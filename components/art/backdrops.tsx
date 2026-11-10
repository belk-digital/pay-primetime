import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

// Slowly orbiting silver rings, a signature motif of the brand. Pure SVG with CSS rotation, so it costs nothing at runtime and stops under reduced motion.
export function RingsBackdrop({
  className,
  cx = 500,
  cy = 500,
  strong = false,
}: {
  className?: string;
  /** Ring centre in the 1000x1000 viewBox. */
  cx?: number;
  cy?: number;
  /** Brighter rings, for use on a mostly empty background. */
  strong?: boolean;
}) {
  const a = strong ? 1 : 0.65;
  const speed = (s: number) => ({ ['--ring-speed' as string]: `${s}s` }) as CSSProperties;
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    >
      <circle cx={cx} cy={cy} r="560" fill="none" stroke="rgba(210,210,210,0.08)" strokeWidth="1" />
      <circle
        className="ring-cw"
        style={speed(110)}
        cx={cx}
        cy={cy}
        r="440"
        fill="none"
        stroke={`rgba(210,210,210,${0.8 * a})`}
        strokeWidth="1.5"
        strokeDasharray="500 800"
        strokeLinecap="round"
      />
      <circle
        className="ring-ccw"
        style={speed(150)}
        cx={cx}
        cy={cy}
        r="340"
        fill="none"
        stroke={`rgba(210,210,210,${0.5 * a})`}
        strokeWidth="1"
      />
      <circle
        className="ring-ccw"
        style={speed(90)}
        cx={cx}
        cy={cy}
        r="260"
        fill="none"
        stroke={`rgba(210,210,210,${0.7 * a})`}
        strokeWidth="1.5"
        strokeDasharray="150 250 80 200"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="180" fill="none" stroke="rgba(165,180,252,0.18)" strokeWidth="1" />
    </svg>
  );
}

// Soft indigo and purple light pools.
export function GlowField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="glow-drift absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-indigo-600/20 blur-[130px]" />
      <div
        className="glow-drift absolute -bottom-48 -right-32 h-[32rem] w-[32rem] rounded-full bg-purple-600/20 blur-[130px]"
        style={{ animationDelay: '-6s' }}
      />
    </div>
  );
}
