// PREVIEW ONLY. This is the stand-in for the payment provider used by the design-preview form
// (app/pay/payment-form.tsx), which is shown while NEXT_PUBLIC_PAYMENTS_LIVE is not "true".
//
// While previewing, submitPayment() waits a moment (so the loading state can be seen) and reports
// "preview": no card is charged, and what the customer typed is dropped when it returns. It is never stored
// or sent anywhere.
//
// The real payment path does not go through here at all: when payments are live the pay page renders
// app/pay/stripe-payment-form.tsx instead, which uses Stripe's hosted card fields and confirms the payment
// directly with Stripe.

import type { PaymentOrder } from './order';
import { SITE } from './site';

export interface PaymentDetails {
  email: string;
  method: 'card' | 'wallet';
  // Present for card payments only.
  card?: {
    name: string;
    number: string;
    expiry: string;
    cvc: string;
    country: string;
    postalCode: string;
  };
}

export type PaymentResult =
  | { status: 'preview' }
  | { status: 'succeeded' }
  | { status: 'processing' }
  | { status: 'failed'; message: string };

export async function submitPayment(_order: PaymentOrder, _details: PaymentDetails): Promise<PaymentResult> {
  if (!SITE.paymentsLive) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { status: 'preview' };
  }

  // Live mode never uses this form; refuse rather than pretend if it ever does.
  throw new Error('The preview form cannot take a real payment.');
}
