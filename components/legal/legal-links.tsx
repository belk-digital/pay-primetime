import { LEGAL_PAGES } from '@/lib/legal';
import { cn } from '@/lib/cn';

// The line under the pay button. Opens in a new tab so reading it never loses a half-filled card form.
export function PayLegalNotice({ className }: { className?: string }) {
  const link = 'underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current';
  const attrs = { target: '_blank', rel: 'noopener' } as const;
  return (
    <p className={cn('text-center text-[11px] leading-relaxed text-gray-400', className)}>
      By paying you agree to the{' '}
      <a href="/terms" {...attrs} className={link}>
        Terms of Service
      </a>
      . See also the{' '}
      <a href="/privacy" {...attrs} className={link}>
        Privacy Policy
      </a>{' '}
      and{' '}
      <a href="/refunds" {...attrs} className={link}>
        Refunds &amp; disputes
      </a>
      .
    </p>
  );
}

// The three legal pages as a row of small links. It inherits its colour from where it is placed (dark
// footers, the light payment panel), so the same component works on both. `newTab` is for the payment page,
// where leaving would lose a half-filled card form.
export function LegalLinks({
  className,
  newTab = false,
  full = false,
}: {
  className?: string;
  newTab?: boolean;
  /** Use the full page titles instead of the short labels. */
  full?: boolean;
}) {
  return (
    <nav aria-label="Legal" className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1', className)}>
      {LEGAL_PAGES.map((page) => (
        <a
          key={page.href}
          href={page.href}
          {...(newTab ? { target: '_blank', rel: 'noopener' } : {})}
          className="underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current"
        >
          {full ? page.label : page.short}
        </a>
      ))}
    </nav>
  );
}
