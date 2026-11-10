'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';

// "Taking you back to the merchant in 8s": a countdown with a draining bar, a way to stop it, and then a
// plain navigation. The destination is decided on the server (rebuilt from the merchant's registered
// addresses), never taken from the page address. Without JavaScript the page's own "Return" button is
// the way back.
export function AutoRedirect({ url, seconds = 8, merchantName }: { url: string; seconds?: number; merchantName: string }) {
  const [left, setLeft] = useState(seconds);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (left <= 0) {
      window.location.assign(url);
      return;
    }
    const timer = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [left, paused, url]);

  return (
    <div className="mx-auto mt-7 max-w-sm" role="status" aria-live="polite">
      <div className="h-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
        <div
          className="countdown-bar h-full origin-left rounded-full bg-indigo-400"
          style={{ animationDuration: `${seconds}s`, animationPlayState: paused ? 'paused' : 'running' }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 text-xs text-gray-400">
        <span>
          {paused ? 'Paused.' : left > 0 ? `Returning you to ${merchantName} in ${left}s` : `Taking you to ${merchantName}…`}
        </span>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex shrink-0 items-center gap-1.5 font-futuristic text-[10px] font-bold uppercase tracking-wider text-gray-300 transition-colors hover:text-white"
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {paused ? 'Resume' : 'Stay here'}
        </button>
      </div>
    </div>
  );
}
