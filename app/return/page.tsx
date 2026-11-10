import type { Metadata } from 'next';
import { StatusScreen } from '@/components/status/status-screen';
import { formatMoney } from '@/lib/format';
import { PREVIEW_ORDER, orderTotal } from '@/lib/order';
import { loadReturn } from '@/lib/payments';
import { SITE, SUPPORT_MAILTO } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Payment status',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// Where the customer lands after paying. Stripe sends them here (the pay form gives it this address), and
// this page, not the store, is where the confirmation is shown. From here they are sent on to the store,
// whose own page re-checks the payment with us before it marks the order paid.
//
// LIVE: the state is read from Stripe by payment reference, never from the address, and the way back to
// the store is rebuilt from the store's registered addresses. PREVIEW: ?status=succeeded|processing|failed
// shows each screen with the sample order.
export default async function ReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; pi?: string; payment_intent?: string }>;
}) {
  const params = await searchParams;
  return SITE.paymentsLive ? <LiveReturn pi={params.pi} stripePi={params.payment_intent} /> : <PreviewReturn status={params.status} />;
}

async function LiveReturn({ pi, stripePi }: { pi?: string; stripePi?: string }) {
  // Stripe appends its own copy of the reference; if the two disagree the address has been tampered with.
  const reference = pi ?? stripePi;
  const outcome = !reference || (stripePi && pi && stripePi !== pi) ? ({ kind: 'unknown' } as const) : await loadReturn(reference);

  if (outcome.kind === 'unknown') {
    return (
      <StatusScreen
        tone="neutral"
        title="We can’t find this payment"
        message="If you were charged, contact support with your order number and we will sort it out."
        primary={{ label: 'Contact support', href: SUPPORT_MAILTO }}
        secondary={{ label: 'How paying works', href: '/#how-it-works' }}
      />
    );
  }

  const { order, storeUrl, paymentIntentId } = outcome;
  const merchant = order.merchant.name;
  const details = [
    { label: 'Paid to', value: merchant },
    { label: 'Order', value: order.number },
    { label: 'Total', value: formatMoney(order.amount, order.currency) },
  ];

  if (outcome.kind === 'failed') {
    return (
      <StatusScreen
        tone="danger"
        eyebrow="Payment unsuccessful"
        title="That payment didn’t go through"
        message="Your card was not charged. Check your details or try another card or wallet, then try again."
        primary={{ label: 'Try again', href: `/pay?pi=${encodeURIComponent(paymentIntentId)}` }}
        secondary={{ label: 'Return to merchant', href: storeUrl }}
      />
    );
  }

  if (outcome.kind === 'processing') {
    return (
      <StatusScreen
        tone="processing"
        eyebrow="Payment processing"
        title="Your bank is still confirming"
        message={`This can take a few minutes. You don’t need to pay again: ${merchant} will confirm your order as soon as it clears.`}
        details={details}
        primary={{ label: 'Return to merchant', href: storeUrl }}
        secondary={{ label: 'Payment help', href: '/#help' }}
      />
    );
  }

  return (
    <StatusScreen
      tone="success"
      eyebrow="Payment confirmed"
      title="Thank you. Your payment is in"
      message={`Your payment went through. We’re taking you back to ${merchant} to finish up.`}
      details={details}
      autoRedirect={{ url: storeUrl, seconds: 8, merchantName: merchant }}
      primary={{ label: 'Return to merchant now', href: storeUrl }}
    />
  );
}

function PreviewReturn({ status }: { status?: string }) {
  const order = PREVIEW_ORDER;
  const merchant = order.merchant.name;
  const details = [
    { label: 'Paid to', value: merchant },
    { label: 'Order', value: order.number },
    { label: 'Total', value: formatMoney(orderTotal(order), order.currency) },
  ];

  if (status === 'failed') {
    return (
      <StatusScreen
        preview
        tone="danger"
        eyebrow="Payment unsuccessful"
        title="That payment didn’t go through"
        message="Your card was not charged. Check your details or try another card or wallet, then try again."
        primary={{ label: 'Try again', href: '/pay' }}
        secondary={{ label: 'Return to merchant', href: order.returnUrl }}
      />
    );
  }

  if (status === 'processing') {
    return (
      <StatusScreen
        preview
        tone="processing"
        eyebrow="Payment processing"
        title="Your bank is still confirming"
        message="This can take a few minutes. You don’t need to pay again: we’ll email your receipt as soon as it clears."
        details={details}
        primary={{ label: 'Return to merchant', href: order.returnUrl }}
        secondary={{ label: 'Payment help', href: '/#help' }}
      />
    );
  }

  return (
    <StatusScreen
      preview
      tone="success"
      eyebrow="Payment confirmed"
      title="Thank you. Your payment is in"
      message={`Your payment went through. We’re taking you back to ${merchant} to finish up.`}
      details={details}
      primary={{ label: 'Return to merchant now', href: order.returnUrl }}
      secondary={{ label: 'Payment help', href: '/#help' }}
    />
  );
}
