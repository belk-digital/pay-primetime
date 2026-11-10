import { cn } from '@/lib/cn';

// width / height of public/pay-primetime-logo.webp (supplied artwork, transparent padding trimmed).
export const LOGO_RATIO = 1447 / 357;

// The PayPrimeTime logo. The artwork is white/silver on transparent, so it is for dark surfaces, which
// is every place it is used. `size` is the rendered height in px; the width follows from the artwork.
export function BrandLogo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/pay-primetime-logo.webp"
      alt="PayPrimeTime"
      width={Math.round(size * LOGO_RATIO)}
      height={size}
      style={{ height: size, width: 'auto' }}
      decoding="async"
      className={cn('block', className)}
    />
  );
}
