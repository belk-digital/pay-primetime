import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'night' | 'indigo' | 'silver';

const TONES: Record<Tone, string> = {
  night: 'from-[#1b1b2b] via-[#0c0c14] to-black text-white border-white/10',
  indigo: 'from-indigo-500 via-indigo-700 to-purple-900 text-white border-white/20',
  silver: 'from-white via-gray-200 to-gray-400 text-gray-900 border-white/60',
};

// A decorative payment card. Sized in ems off a single pixel width so it scales as one object.
export function PaymentCardArt({
  tone = 'night',
  size = 320,
  className,
  style,
}: {
  tone?: Tone;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative shrink-0 overflow-hidden rounded-[1.1em] border bg-linear-to-br shadow-[0_2.2em_4em_-1.2em_rgba(0,0,0,0.7)]',
        TONES[tone],
        className,
      )}
      style={{ width: size, height: size / 1.586, fontSize: size / 20, ...style }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_0%_0%,rgba(255,255,255,0.22),transparent_55%)]" />
      <svg viewBox="0 0 100 63" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        <circle cx="92" cy="14" r="46" fill="none" stroke="currentColor" strokeOpacity="0.09" strokeWidth="0.5" />
        <circle cx="92" cy="14" r="34" fill="none" stroke="currentColor" strokeOpacity="0.09" strokeWidth="0.5" />
        <circle cx="92" cy="14" r="22" fill="none" stroke="currentColor" strokeOpacity="0.09" strokeWidth="0.5" />
      </svg>

      <div className="relative flex h-full flex-col justify-between p-[1.5em]">
        <div className="flex items-start justify-between">
          {tone === 'silver' ? (
            <span className="font-michroma text-[0.85em] font-bold uppercase tracking-[0.3em]">Primetime</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/mark.webp" alt="" className="h-[2.1em] w-auto opacity-90" />
          )}
          <svg
            viewBox="0 0 24 24"
            className="h-[1.6em] w-[1.6em] opacity-70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 3.5a12 12 0 0 1 0 17" />
          </svg>
        </div>

        <div className="h-[2.2em] w-[3em] rounded-[0.4em] bg-linear-to-br from-gray-100 via-gray-300 to-gray-500 shadow-inner">
          <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-px p-[0.35em] opacity-40">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="rounded-[1px] border border-black/60" />
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span className="tnum font-michroma text-[0.85em] tracking-[0.18em]">&bull;&bull;&bull;&bull; 4242</span>
          <span className="font-futuristic text-[0.62em] font-bold uppercase tracking-[0.25em] opacity-70">Debit</span>
        </div>
      </div>
    </div>
  );
}
