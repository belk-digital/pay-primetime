'use client';

import { StatusScreen } from '@/components/status/status-screen';
import { SUPPORT_MAILTO } from '@/lib/site';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatusScreen
      tone="danger"
      eyebrow="Something went wrong"
      title="We hit a snag"
      message="Nothing was charged. Try again, and if it keeps happening, contact support and we will help."
      primary={{ label: 'Try again', onClick: reset }}
      secondary={{ label: 'Contact support', href: SUPPORT_MAILTO }}
    />
  );
}
