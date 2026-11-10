import Link from 'next/link';
import type { MouseEventHandler, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'light' | 'dark' | 'outline' | 'outline-dark' | 'indigo' | 'glass';
type Size = 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  // White on dark: the primary call to action.
  light: 'bg-white text-black hover:bg-gray-200',
  // Black on light surfaces.
  dark: 'bg-gray-900 text-white hover:bg-gray-800',
  outline: 'border border-white/30 text-white hover:bg-white/10',
  'outline-dark': 'border border-gray-300 text-gray-900 hover:bg-gray-100',
  // The pay button and anything that has to read as "the" action on a form.
  indigo: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_12px_32px_-12px_rgba(79,70,229,0.8)]',
  // Translucent secondary action.
  glass: 'bg-white/10 text-white border border-white/10 backdrop-blur-sm hover:bg-white/20',
};

const SIZES: Record<Size, string> = {
  md: 'h-12 px-6 text-[11px] sm:text-xs gap-3',
  lg: 'h-14 px-8 text-xs sm:text-[13px] gap-3',
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: Size;
  /** Rounded-full, used for the pay button. */
  pill?: boolean;
  /** Replaces the default trailing arrow. */
  icon?: ReactNode;
  /** Hides the trailing icon entirely. */
  noIcon?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler<HTMLElement>;
  'aria-label'?: string;
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

// The brand button: Syncopate caps with wide tracking, a trailing arrow that nudges forward on
// hover, plus a soft light sweep. Renders a link when given an href and a button otherwise.
export function Button({
  children,
  href,
  variant = 'light',
  size = 'md',
  pill = false,
  icon,
  noIcon = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const external = href ? /^https?:/.test(href) : false;
  const classes = cn(
    'group relative inline-flex max-w-full items-center justify-center overflow-hidden whitespace-nowrap font-futuristic font-bold uppercase tracking-wider transition-all duration-300',
    'active:scale-[0.985]',
    pill ? 'rounded-full' : 'rounded-lg',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'pointer-events-none opacity-60',
    className,
  );

  const trailing = noIcon ? null : loading ? (
    <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
  ) : (
    (icon ?? (
      external ? (
        <ArrowUpRight
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      ) : (
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      )
    ))
  );

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />
      <span className="relative truncate">{children}</span>
      {trailing && <span className="relative flex shrink-0 items-center">{trailing}</span>}
    </>
  );

  if (href) {
    if (isExternal(href) || href.startsWith('#')) {
      return (
        <a
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          className={classes}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} aria-label={ariaLabel} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      className={classes}
    >
      {inner}
    </button>
  );
}
