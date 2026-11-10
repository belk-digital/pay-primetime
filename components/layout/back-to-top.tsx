'use client';

import { ArrowRight } from 'lucide-react';

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll back to top"
      className="group flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2 pl-4 pr-2 transition-colors hover:bg-white/10"
    >
      <span className="text-xs font-medium tracking-wide">Back to top</span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:-translate-y-0.5">
        <ArrowRight className="h-3.5 w-3.5 -rotate-90" strokeWidth={2.5} />
      </span>
    </button>
  );
}
