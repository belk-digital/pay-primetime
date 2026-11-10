'use client';

import { useState, type FormEvent } from 'react';
import { loadStripe, type Appearance } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentBadges } from '@/components/layout/payment-badges';
import { PayLegalNotice } from '@/components/legal/legal-links';
import { formatMoney } from '@/lib/format';
import { orderTotal, type PaymentOrder } from '@/lib/order';

// The live payment form. The card fields are Stripe's own Payment Element, served from Stripe in a secure
// frame, so the card number never passes through this app. It also offers Apple Pay and Google Pay where
// the device supports them. Styled here (not with page CSS, which cannot reach into the frame) to match
// the rest of the checkout.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const appearance: Appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#4f46e5',
    colorBackground: '#f9fafb',
    colorText: '#111827',
    colorTextSecondary: '#6b7280',
    colorDanger: '#ef4444',
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSizeBase: '15px',
    spacingUnit: '4px',
    borderRadius: '12px',
  },
  rules: {
    '.Input': { border: '1px solid rgba(0,0,0,0.1)', boxShadow: 'none', padding: '12px 16px', backgroundColor: '#f9fafb' },
    '.Input:hover': { border: '1px solid rgba(0,0,0,0.2)' },
    '.Input:focus': { border: '1px solid rgba(99,102,241,0.5)', boxShadow: '0 0 0 1px rgba(99,102,241,0.5)' },
    '.Label': { fontWeight: '700', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '6px' },
    '.Tab': { border: '1px solid rgba(0,0,0,0.1)', boxShadow: 'none', backgroundColor: '#ffffff' },
    '.Tab:hover': { border: '1px solid rgba(0,0,0,0.2)' },
    '.Tab--selected': { border: '1px solid #4f46e5', backgroundColor: '#eef2ff', boxShadow: 'none', color: '#312e81' },
    '.TabIcon--selected': { fill: '#4f46e5' },
    '.TabLabel--selected': { color: '#312e81' },
    '.Error': { fontSize: '13px' },
  },
};

const fonts = [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }];

export function StripePaymentForm({
  order,
  clientSecret,
  paymentIntentId,
}: {
  order: PaymentOrder;
  clientSecret: string;
  paymentIntentId: string;
}) {
  if (!stripePromise) {
    return (
      <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
        Card payments are not available right now. Please try again shortly, or contact support.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance, fonts }}>
      <Inner order={order} paymentIntentId={paymentIntentId} />
    </Elements>
  );
}

function Inner({ order, paymentIntentId }: { order: PaymentOrder; paymentIntentId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = formatMoney(orderTotal(order), order.currency);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || processing) return;

    setProcessing(true);
    setError(null);

    // Checks the fields and collects them before confirming.
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Please check your payment details.');
      setProcessing(false);
      return;
    }

    // Stripe sends the customer to /return once the payment is confirmed (adding the outcome to the
    // address); that page shows the confirmation and then sends them on to the store. This only resolves
    // here when something went wrong, e.g. a declined card.
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/return?pi=${encodeURIComponent(paymentIntentId)}` },
    });

    if (confirmError) {
      setError(confirmError.message || 'Something went wrong. Please try again.');
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={onSubmit} aria-label="Payment details" className="flex flex-col gap-5">
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="mb-5 flex items-center gap-2 border-b border-black/10 pb-4 text-xs font-bold uppercase tracking-widest text-gray-900">
          <Lock className="h-4 w-4" />
          Payment method
        </h2>
        <PaymentElement options={{ layout: 'tabs' }} onReady={() => setReady(true)} />
      </div>

      {error && (
        <p role="alert" className="fade-up rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="indigo"
        size="lg"
        pill
        fullWidth
        loading={processing}
        disabled={!stripe || !elements || !ready}
        icon={<Lock className="h-4 w-4" strokeWidth={2.4} />}
      >
        {processing ? 'Processing…' : `Pay ${total}`}
      </Button>

      <p className="text-center text-xs leading-relaxed text-gray-500">
        You are paying <span className="font-semibold text-gray-700">{order.merchant.name}</span>. Its terms and its refund and
        shipping policies apply to this order.
      </p>
      <PayLegalNotice className="-mt-3" />

      <div className="flex flex-col items-center gap-4 border-t border-black/10 pt-5 text-gray-400 sm:flex-row sm:justify-between">
        <PaymentBadges className="text-gray-500 [&_li]:opacity-80" />
        <p className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-500" />
          Encrypted checkout
        </p>
      </div>
    </form>
  );
}
