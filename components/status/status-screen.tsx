import Link from 'next/link';
import type { ReactNode } from 'react';
import { AlertTriangle, ArrowUpRight, Clock, Info, LinkIcon, type LucideIcon } from 'lucide-react';
import { GlowField, RingsBackdrop } from '@/components/art/backdrops';
import { BrandLogo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { AutoRedirect } from './auto-redirect';
import { LegalLinks } from '@/components/legal/legal-links';
import { cn } from '@/lib/cn';
import { SITE, SUPPORT_MAILTO } from '@/lib/site';

export type StatusTone = 'success' | 'danger' | 'neutral' | 'processing';

const TONE_STYLES: Record<StatusTone, { ring: string; bubble: string; glow: string }> = {
  success: { ring: 'border-ok/30', bubble: 'bg-ok text-white shadow-[0_20px_50px_-10px_rgba(16,185,129,0.55)]', glow: 'bg-ok/10' },
  danger: { ring: 'border-danger/30', bubble: 'bg-danger text-white shadow-[0_20px_50px_-10px_rgba(239,68,68,0.5)]', glow: 'bg-danger/10' },
  neutral: { ring: 'border-indigo-500/30', bubble: 'bg-indigo-600 text-white shadow-[0_20px_50px_-10px_rgba(79,70,229,0.6)]', glow: 'bg-indigo-500/10' },
  processing: { ring: 'border-indigo-500/30', bubble: 'bg-indigo-600 text-white shadow-[0_20px_50px_-10px_rgba(79,70,229,0.6)]', glow: 'bg-indigo-500/10' },
};

function ToneIcon({ tone, icon: Icon }: { tone: StatusTone; icon?: LucideIcon }) {
  if (tone === 'success') {
    return (
      <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path className="draw-check" d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    );
  }
  const Fallback = tone === 'danger' ? AlertTriangle : tone === 'processing' ? Clock : LinkIcon;
  const Chosen = Icon ?? Fallback;
  return <Chosen className="h-8 w-8" strokeWidth={2} aria-hidden />;
}

export interface StatusAction {
  label: string;
  /** Omit for an action that only runs `onClick` (e.g. the error boundary's retry). */
  href?: string;
  onClick?: () => void;
}

interface StatusScreenProps {
  tone: StatusTone;
  title: ReactNode;
  message: ReactNode;
  eyebrow?: string;
  icon?: LucideIcon;
  /** Label / value rows, e.g. order number and amount. */
  details?: Array<{ label: string; value: string }>;
  primary?: StatusAction;
  secondary?: StatusAction;
  /** Shows the "interface preview" notice. */
  preview?: boolean;
  /** Counts down, then sends the customer on to `url` (decided server-side). */
  autoRedirect?: { url: string; seconds?: number; merchantName: string };
}

// The page shell shared by every non-form screen: an unavailable payment link, the post-payment
// return page, a 404 and the error boundary. Dark, centred, one clear next step.
export function StatusScreen({ tone, title, message, eyebrow, icon, details, primary, secondary, preview, autoRedirect }: StatusScreenProps) {
  const t = TONE_STYLES[tone];
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-night text-white">
      <GlowField />
      <RingsBackdrop cx={500} cy={470} className="opacity-50" />
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="PayPrimeTime home" className="transition-opacity hover:opacity-90">
          <BrandLogo size={42} />
        </Link>
        <a
          href={SUPPORT_MAILTO}
          className="group hidden items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-2.5 font-futuristic text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:inline-flex sm:text-xs"
        >
          Contact support
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </a>
      </header>

      <main id="main-content" className="relative z-10 flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="fade-up w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center shadow-2xl backdrop-blur-md sm:p-11">
          {preview && !SITE.paymentsLive && (
            <p className="mx-auto mb-7 inline-flex items-center gap-2 rounded border border-indigo-500/25 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
              <Info className="h-3.5 w-3.5" />
              Interface preview &middot; no payment was taken
            </p>
          )}

          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
            <span className={cn('absolute inset-0 rounded-full border', t.ring)} />
            <span className={cn('absolute -inset-4 rounded-full blur-2xl', t.glow)} />
            <span className={cn('pop-in relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full', t.bubble, tone === 'success' && 'pulse-ring')}>
              <ToneIcon tone={tone} icon={icon} />
            </span>
          </div>

          {eyebrow && <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-indigo-300">{eyebrow}</p>}
          <h1 className="font-michroma text-[1.45rem] font-bold uppercase leading-tight tracking-wider sm:text-3xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-gray-400 sm:text-base">{message}</p>

          {details && details.length > 0 && (
            <dl className="mx-auto mt-8 max-w-sm divide-y divide-white/10 border-y border-white/10 text-left text-sm">
              {details.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-6 py-3.5">
                  <dt className="text-gray-500">{row.label}</dt>
                  <dd className="tnum text-right font-semibold text-white">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {autoRedirect && <AutoRedirect {...autoRedirect} />}

          {(primary || secondary) && (
            <div className={cn('mx-auto flex max-w-sm flex-col gap-3', autoRedirect ? 'mt-6' : 'mt-9')}>
              {primary && (
                <Button href={primary.href} onClick={primary.onClick} variant="light" fullWidth>
                  {primary.label}
                </Button>
              )}
              {secondary && (
                <Button href={secondary.href} onClick={secondary.onClick} variant="outline" fullWidth>
                  {secondary.label}
                </Button>
              )}
            </div>
          )}

          <p className="mt-8 text-xs text-gray-500">
            Need help?{' '}
            <a
              className="font-medium text-gray-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
              href={SUPPORT_MAILTO}
            >
              {SITE.supportEmail}
            </a>
          </p>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 px-5 py-5 text-center">
        <p className="text-[10px] uppercase tracking-widest text-gray-500">
          Payments are processed securely on behalf of the merchant named at checkout
        </p>
        <LegalLinks className="mt-3 text-[11px] text-gray-500 hover:[&_a]:text-gray-300" />
      </footer>
    </div>
  );
}
