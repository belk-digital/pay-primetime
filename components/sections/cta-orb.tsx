import { Link2, Mail, Receipt, ShieldCheck, type LucideIcon } from 'lucide-react';

// The centrepiece of the closing banner. It sits in the middle of the banner's orbiting rings (those are
// drawn centred 82% across, 50% down, so this is placed on the same point) and is sized as a share of
// the banner WIDTH, because the rings scale with width: at 36% its edge lands exactly on the ring.
//
// Motion, all CSS: the core floats; three pulse rings expand and fade; a dashed ring turns slowly;
// four icon badges travel round while staying upright. The badges orbit at 40% of the box rather than
// on the ring itself (50%), because the ring touches the banner's right edge and anything riding it
// would be clipped there. Everything stops under reduced motion. Decorative, so hidden from
// assistive tech.

// Positions are 50% +/- 40% * sin/cos of the angle (30, 120, 210, 300 degrees), as percentages of the box.
const BADGES: Array<{ icon: LucideIcon; left: string; top: string }> = [
  { icon: Mail, left: '70%', top: '15.4%' },
  { icon: Receipt, left: '84.6%', top: '70%' },
  { icon: ShieldCheck, left: '30%', top: '84.6%' },
  { icon: Link2, left: '15.4%', top: '30%' },
];

export function CtaOrb() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-[82%] top-1/2 z-[5] hidden aspect-square w-[36%] -translate-x-1/2 -translate-y-1/2 lg:block"
      style={{ ['--orbit-speed' as string]: '70s' }}
    >
      {/* Pulse rings, staggered with negative delays so they are already mid-flight on load */}
      {[0, -1.7, -3.4].map((delay) => (
        <span
          key={delay}
          className="ping-ring absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/50"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}

      {/* Slow dashed ring, turning against the chips */}
      <span
        className="orbit-counter absolute inset-[17%] rounded-full border border-dashed border-white/15"
        style={{ ['--orbit-speed' as string]: '140s' }}
      />

      {/* Orbiting badges (kept upright by the counter-rotation). Below xl there is not room beside the text. */}
      <div className="orbit absolute inset-0 hidden xl:block">
        {BADGES.map(({ icon: Icon, left, top }, i) => (
          <div key={i} className="absolute" style={{ left, top, translate: '-50% -50%' }}>
            <div className="orbit-counter">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-panel/90 text-indigo-300 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.8),0_0_24px_-6px_rgba(99,102,241,0.5)] backdrop-blur-sm">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Core: the brand mark on a glowing disc */}
      <div className="float-soft absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 via-indigo-600 to-purple-700 shadow-[0_0_90px_-8px_rgba(99,102,241,0.85),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-white/20">
          <span className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.38),transparent_55%)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mark.webp" alt="" className="relative h-14 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]" />
        </div>
      </div>
    </div>
  );
}
