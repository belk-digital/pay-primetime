// Server only: turns a real Stripe PaymentIntent into what the pay page and the return page render.
// Used when NEXT_PUBLIC_PAYMENTS_LIVE=true; in preview the sample order in lib/order.ts is used instead.
//
// Who is being paid, how much, and where the customer goes afterwards all come from the PaymentIntent
// that the store created through /api/payments/create. Nothing is ever read from the page address
// beyond the payment reference itself.

import type Stripe from 'stripe';
import { getStripe, stripeConfigured } from './stripe';
import { decodeReturnUrl, getMerchantById, publicMerchant, type Merchant } from './merchant';
import type { PayLink, PaymentOrder } from './order';

async function retrieve(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
  try {
    return await getStripe().paymentIntents.retrieve(paymentIntentId);
  } catch {
    return null;
  }
}

// The order as the customer knows it: the store's display number. A purely numeric one is shown as
// "#7013", the way shops write order numbers.
function orderLabel(metadata: Stripe.Metadata | null | undefined): string {
  const value = metadata?.orderNumber || metadata?.orderId || '';
  return /^\d+$/.test(value) ? `#${value}` : value;
}

function toOrder(intent: Stripe.PaymentIntent, merchant: Merchant, returnUrl: string): PaymentOrder {
  return {
    reference: intent.id,
    number: orderLabel(intent.metadata),
    currency: intent.currency,
    merchant: publicMerchant(merchant),
    amount: intent.amount,
    returnUrl,
  };
}

/** Where the store's confirmation page is told the outcome. The Stripe client secret is NOT passed on. */
export function storeReturnUrl(returnUrl: string, intent: Stripe.PaymentIntent): string {
  const url = new URL(returnUrl);
  url.searchParams.set('payment_intent', intent.id);
  url.searchParams.set(
    'redirect_status',
    intent.status === 'succeeded' ? 'succeeded' : intent.status === 'processing' || intent.status === 'requires_capture' ? 'processing' : 'failed',
  );
  return url.toString();
}

// ---------------------------------------------------------------------------------------------
// /pay
// ---------------------------------------------------------------------------------------------
export async function loadPayLink(paymentIntentId: string | undefined): Promise<PayLink> {
  if (!paymentIntentId) return { state: 'incomplete' };
  if (!stripeConfigured()) {
    console.error('Stripe is not configured: STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY are both required');
    return { state: 'not-found' };
  }

  const intent = await retrieve(paymentIntentId);
  if (!intent) return { state: 'not-found' };

  // Who is being paid, and where to send the customer afterwards, live only in the PaymentIntent's
  // metadata, written once server-side when the store created the payment.
  const merchant = getMerchantById(intent.metadata?.merchantId);
  const returnUrl = merchant ? decodeReturnUrl(intent.metadata, merchant) : null;
  if (!merchant || !returnUrl) return { state: 'invalid' };

  const back = storeReturnUrl(returnUrl, intent);
  if (intent.status === 'succeeded') return { state: 'paid', returnUrl: back, merchantName: merchant.name };
  if (intent.status === 'processing' || intent.status === 'requires_capture') {
    return { state: 'processing', returnUrl: back, merchantName: merchant.name };
  }
  if (intent.status === 'canceled' || !intent.client_secret) {
    return { state: 'canceled', returnUrl: back, merchantName: merchant.name };
  }

  return {
    state: 'ready',
    order: toOrder(intent, merchant, back),
    live: { clientSecret: intent.client_secret, paymentIntentId: intent.id },
  };
}

// ---------------------------------------------------------------------------------------------
// /return
// ---------------------------------------------------------------------------------------------
export type ReturnOutcome =
  | { kind: 'succeeded' | 'processing' | 'failed'; order: PaymentOrder; storeUrl: string; paymentIntentId: string }
  | { kind: 'unknown' };

// What the customer sees after Stripe sends them back: the real, current state of the payment, read from
// Stripe, never from the address. The destination is rebuilt from the registered addresses.
export async function loadReturn(paymentIntentId: string | undefined): Promise<ReturnOutcome> {
  if (!paymentIntentId || !stripeConfigured()) return { kind: 'unknown' };
  const intent = await retrieve(paymentIntentId);
  if (!intent) return { kind: 'unknown' };

  const merchant = getMerchantById(intent.metadata?.merchantId);
  const returnUrl = merchant ? decodeReturnUrl(intent.metadata, merchant) : null;
  if (!merchant || !returnUrl) return { kind: 'unknown' };

  const kind =
    intent.status === 'succeeded' ? 'succeeded' : intent.status === 'processing' || intent.status === 'requires_capture' ? 'processing' : 'failed';
  const storeUrl = storeReturnUrl(returnUrl, intent);
  return { kind, order: toOrder(intent, merchant, storeUrl), storeUrl, paymentIntentId: intent.id };
}
