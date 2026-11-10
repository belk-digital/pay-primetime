import type { Metadata } from 'next';
import { PayClient } from './pay-client';
import { StatusScreen } from '@/components/status/status-screen';
import { resolvePayLink, type PayLinkState } from '@/lib/order';
import { loadPayLink } from '@/lib/payments';
import { SITE, SUPPORT_MAILTO } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Complete your payment',
  robots: { index: false, follow: false },
};

// Always resolve the link fresh: a payment's state changes under it.
export const dynamic = 'force-dynamic';

const UNAVAILABLE: Record<
  Exclude<PayLinkState, 'ready'>,
  { title: string; message: string; tone: 'danger' | 'neutral' | 'success' | 'processing' }
> = {
  incomplete: {
    title: 'Payment link incomplete',
    message: 'This link is missing its payment reference. Please use the link from your order.',
    tone: 'neutral',
  },
  'not-found': {
    title: 'We couldn’t find this payment',
    message: 'It may have expired. Head back to the merchant’s website and start checkout again.',
    tone: 'neutral',
  },
  invalid: {
    title: 'This payment link isn’t valid',
    message: 'We can’t tell which order this payment is for, so we won’t take it. Please return to the website you came from.',
    tone: 'danger',
  },
  paid: {
    title: 'This order is already paid',
    message: 'Nothing more to do here. Your confirmation is waiting at the merchant’s website.',
    tone: 'success',
  },
  processing: {
    title: 'This payment is processing',
    message: 'Your bank is still confirming it, so there is nothing to pay again. The merchant will confirm your order as soon as it clears.',
    tone: 'processing',
  },
  canceled: {
    title: 'This payment can no longer be completed',
    message: 'Return to the merchant’s website and start checkout again.',
    tone: 'danger',
  },
};

// LIVE (NEXT_PUBLIC_PAYMENTS_LIVE=true): the link is `/pay?pi=<payment reference>`, and everything on the page
// (who is paid, how much, where to go afterwards) is read from that Stripe payment. PREVIEW: a built-in sample
// order, and ?state=… shows each unavailable screen, so the design can be reviewed without Stripe.
export default async function PayPage({ searchParams }: { searchParams: Promise<{ state?: string; pi?: string }> }) {
  const params = await searchParams;
  const link = SITE.paymentsLive ? await loadPayLink(params.pi) : resolvePayLink({ state: params.state });

  if (link.state === 'ready') return <PayClient order={link.order} live={link.live} />;

  const copy = UNAVAILABLE[link.state];
  const returnUrl = 'returnUrl' in link ? link.returnUrl : undefined;
  return (
    <StatusScreen
      tone={copy.tone}
      title={copy.title}
      message={copy.message}
      // A payment that is already paid, processing or canceled still knows where its store is: offer the way back.
      primary={returnUrl ? { label: 'Return to merchant', href: returnUrl } : { label: 'How paying works', href: '/#how-it-works' }}
      secondary={{ label: 'Contact support', href: SUPPORT_MAILTO }}
    />
  );
}
