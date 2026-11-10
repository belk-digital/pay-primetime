import { createHash } from 'node:crypto';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { authenticateMerchant, encodeReturnUrl } from '@/lib/merchant';

// Stripe's ceiling for a single USD charge ($999,999.99). Anything above is a bug on the caller's side.
const MAX_AMOUNT_CENTS = 99_999_999;

// Called server-to-server by the store after it has created its own pending order. The store is
// identified by the shared secret, and the amount is trusted because this endpoint is never reachable
// from a customer's browser (and is useless without the secret).
//
// Body: { orderId, orderNumber?, amount, currency, returnUrl, customerEmail?, description? }
//   amount     in major units, e.g. 151.95
//   returnUrl  where the customer is sent after the confirmation here; must be on the store's address
// Answer: { paymentIntentId }. The store then sends the customer to  /pay?pi=<paymentIntentId>.
export async function POST(req: Request) {
  const merchant = authenticateMerchant(req);
  if (!merchant) return new Response('Unauthorized', { status: 401 });

  try {
    const { orderId, orderNumber, amount, currency, returnUrl, customerEmail, description } = (await req.json()) || {};

    if (!orderId || typeof amount !== 'number' || !(amount > 0) || !currency || !returnUrl) {
      return new Response('Missing or invalid fields', { status: 400 });
    }

    // Only a position among the registered origins and a path are kept on the Stripe payment, never the
    // store's own web address (see encodeReturnUrl).
    const encodedReturn = encodeReturnUrl(returnUrl, merchant);
    if (!encodedReturn) return new Response('returnUrl must be on one of your registered addresses', { status: 400 });

    const amountInCents = Math.round(amount * 100);
    if (amountInCents < 50) return new Response('Amount too low for card processing (minimum $0.50)', { status: 400 });
    if (amountInCents > MAX_AMOUNT_CENTS) return new Response('Amount too high', { status: 400 });

    const cur = String(currency).toLowerCase();
    const shownNumber =
      (typeof orderNumber === 'string' || typeof orderNumber === 'number') && String(orderNumber).trim()
        ? String(orderNumber).trim().slice(0, 40)
        : undefined;

    const params: Stripe.PaymentIntentCreateParams = {
      amount: amountInCents,
      currency: cur,
      automatic_payment_methods: { enabled: true },
      description: typeof description === 'string' && description ? description.slice(0, 200) : `${merchant.name} order ${orderId}`,
      ...(typeof customerEmail === 'string' && customerEmail ? { receipt_email: customerEmail } : {}),
      metadata: {
        merchantId: merchant.id,
        // The store's own reference, used to find the order again when the payment is verified.
        orderId: String(orderId),
        // What the customer knows the order as. Only ever shown on the payment page; never used to look
        // anything up.
        ...(shownNumber ? { orderNumber: shownNumber } : {}),
        ...encodedReturn,
      },
    };

    // A retried call with identical details replays the same PaymentIntent. The key covers every
    // parameter, so the same order arriving with a different return address or email gets its own
    // PaymentIntent rather than a Stripe idempotency conflict.
    const fingerprint = createHash('sha256').update(JSON.stringify(params)).digest('hex').slice(0, 16);
    let key = `payprimetime-create-${merchant.id}-${orderId}-${amountInCents}-${cur}-${fingerprint}`;
    const stripe = getStripe();
    let paymentIntent = await stripe.paymentIntents.create(params, { idempotencyKey: key });

    // A replay can hand back an earlier PaymentIntent that has since been canceled, and a canceled one
    // can never be paid. Stripe replays the response saved when the key was first used, which still says
    // "requires_payment_method", so the live status is read before deciding. A canceled one is replaced
    // with a fresh PaymentIntent under a new key.
    for (let attempt = 0; attempt < 5; attempt++) {
      const live = await stripe.paymentIntents.retrieve(paymentIntent.id);
      if (live.status !== 'canceled') break;
      key = `${key}-after-${paymentIntent.id}`;
      paymentIntent = await stripe.paymentIntents.create(params, { idempotencyKey: key });
    }

    return Response.json({ paymentIntentId: paymentIntent.id });
  } catch (error: unknown) {
    console.error('payprimetime payments/create error:', error);
    return new Response(error instanceof Error ? error.message : 'Failed to create payment', { status: 500 });
  }
}
