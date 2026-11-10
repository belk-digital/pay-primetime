import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getMerchantById, type Merchant } from '@/lib/merchant';

type PingType = 'succeeded' | 'failed' | 'refunded';

// The backup path for when the customer's browser never makes it back to the store. It only tells the
// store "check this order"; the store re-verifies the real state through /api/payments/status before it
// changes anything, so a forged or replayed ping can never mark an order paid.
//
// Resolves true when the store accepted the ping, false when Stripe should retry (network failure or a
// 5xx). Stripe only redelivers a webhook when we answer with an error, so a store outage at the moment a
// payment succeeds has to surface as a non-2xx here.
async function notifyMerchant(merchant: Merchant, orderId: string, eventType: PingType): Promise<boolean> {
  try {
    const res = await fetch(merchant.webhookUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${merchant.secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, eventType }),
    });
    if (res.status >= 500) {
      console.error(`${merchant.id} answered ${res.status} for order ${orderId} (${eventType}); asking Stripe to retry`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Failed to notify ${merchant.id} for order ${orderId}:`, err);
    return false;
  }
}

async function handle(metadata: Stripe.Metadata | null | undefined, type: PingType): Promise<boolean> {
  const merchant = getMerchantById(metadata?.merchantId);
  const orderId = metadata?.orderId;
  if (!merchant || !orderId) return true; // Not one of ours, or nothing to report.
  return notifyMerchant(merchant, orderId, type);
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return new Response('Webhook not configured', { status: 500 });
  }

  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error('Webhook signature verification failed.', message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
      const ok = await handle(event.data.object.metadata, event.type === 'payment_intent.succeeded' ? 'succeeded' : 'failed');
      if (!ok) return new Response('Store unavailable, retry', { status: 503 });
    }

    // A refund issued from Stripe. The charge carries no PaymentIntent metadata, so look the
    // PaymentIntent up to learn which order it belongs to.
    if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
      if (paymentIntentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const ok = await handle(paymentIntent.metadata, 'refunded');
        if (!ok) return new Response('Store unavailable, retry', { status: 503 });
      }
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Webhook handler error', { status: 500 });
  }
}
