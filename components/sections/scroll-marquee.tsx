'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const ROWS = [
  { text: 'CHECK OUT · PAY · CONFIRMED · PRIMETIME · CHECK OUT · PAY · CONFIRMED · PRIMETIME ·', from: -220, to: 220 },
  { text: 'SECURE · ENCRYPTED · SIMPLE · SECURE · ENCRYPTED · SIMPLE · SECURE · ENCRYPTED ·', from: 220, to: -220 },
];

function Row({ text, from, to, progress }: { text: string; from: number; to: number; progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, 1], [from, to]);
  return (
    // `scroll-row` is held still under prefers-reduced-motion in globals.css. Doing it in CSS (rather than
    // branching on useReducedMotion here) keeps the server and client markup identical.
    <motion.div style={{ x }} className="scroll-row -ml-[30vw] w-max whitespace-nowrap will-change-transform">
      <span className="text-outline block font-michroma text-[4.5rem] font-bold uppercase leading-[0.9] tracking-tight sm:text-[7rem] lg:text-[10rem]">
        {text}
      </span>
    </motion.div>
  );
}

// Full-bleed rows of outlined display type that slide sideways, in opposite directions, as the
// section scrolls through the viewport. Fills its (relatively positioned) parent edge to edge.
export function ScrollMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex select-none flex-col justify-between overflow-hidden py-2"
    >
      {ROWS.map((row) => (
        <Row key={row.text} {...row} progress={scrollYProgress} />
      ))}
    </div>
  );
}
