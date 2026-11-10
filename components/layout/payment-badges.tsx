import { cn } from '@/lib/cn';

// Monochrome "accepted here" marks, set as type and simple shapes so they sit quietly in a dark footer
// or a light form. They take their colour from the surrounding text.
export function PaymentBadges({ className }: { className?: string }) {
  return (
    <ul aria-label="Accepted payment methods" className={cn('flex flex-wrap items-center gap-x-6 gap-y-3', className)}>
      <li title="Visa" className="select-none text-sm font-black italic leading-none tracking-wider sm:text-base">
        VISA
      </li>
      <li title="Mastercard" className="select-none">
        <svg className="h-4 w-auto sm:h-5" viewBox="0 0 38 24" fill="none" aria-label="Mastercard" role="img">
          <circle cx="12" cy="12" r="11" fill="currentColor" fillOpacity="0.95" />
          <circle cx="26" cy="12" r="11" fill="currentColor" fillOpacity="0.35" />
          <path
            d="M19 4.8a10.95 10.95 0 0 1 3.6 7.2A10.95 10.95 0 0 1 19 19.2a10.95 10.95 0 0 1-3.6-7.2A10.95 10.95 0 0 1 19 4.8Z"
            fill="currentColor"
            fillOpacity="0.75"
          />
        </svg>
      </li>
      <li title="American Express" className="select-none text-[11px] font-bold leading-none tracking-[0.18em] sm:text-xs">
        AMEX
      </li>
      <li title="Apple Pay" className="select-none text-sm font-semibold leading-none tracking-tight sm:text-base">
        Apple&nbsp;Pay
      </li>
      <li title="Google Pay" className="select-none text-sm font-semibold leading-none tracking-tight sm:text-base">
        G&nbsp;Pay
      </li>
    </ul>
  );
}
