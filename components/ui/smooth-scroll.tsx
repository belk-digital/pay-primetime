'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

// The brand's smooth-scroll engine (Lenis), used only on the long marketing page. The
// payment screens keep native scrolling so form fields, autofill and the keyboard behave normally.
// Skipped when the visitor prefers reduced motion. Lenis runs imperatively so the page tree never
// changes shape (a wrapper element would remount the page and replay its entrance animations).
const SMOOTH_PATHS = new Set(['/']);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!SMOOTH_PATHS.has(pathname)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ anchors: true, lerp: 0.1 });
    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
