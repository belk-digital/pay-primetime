import { StatusScreen } from '@/components/status/status-screen';
import { SITE, SUPPORT_MAILTO } from '@/lib/site';

export default function NotFound() {
  return (
    <StatusScreen
      tone="neutral"
      eyebrow="404"
      title="That page isn’t here"
      message="If you were trying to pay for an order, go back to the merchant’s website and start checkout again."
      primary={{ label: `${SITE.name} home`, href: '/' }}
      secondary={{ label: 'Contact support', href: SUPPORT_MAILTO }}
    />
  );
}
