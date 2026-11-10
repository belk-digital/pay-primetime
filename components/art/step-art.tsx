import type { ReactNode } from 'react';
import { Check, Lock, Package, ShoppingBag } from 'lucide-react';
import { PaymentCardArt } from './payment-card';
import { RingsBackdrop } from './backdrops';

// Artwork for the three "How it works" cards. Each fills its (relatively positioned) parent, is built
// from CSS and SVG only, and is sized in percentages so it holds up at any card width.
function StepBase({ glow, children }: { glow: string; children: ReactNode }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#08080d]">
      <div
        className={`absolute left-1/2 top-[42%] h-[75%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px] ${glow}`}
      />
      <RingsBackdrop cx={500} cy={430} />
      <div className="dot-grid absolute inset-0 opacity-40" />
      {children}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#111111] to-transparent" />
    </div>
  );
}

export function StepOrderArt() {
  const rows = [
    ['bg-indigo-500', 'w-[58%]', 'w-[30%]'],
    ['bg-purple-500', 'w-[46%]', 'w-[26%]'],
    ['bg-gray-400', 'w-[62%]', 'w-[24%]'],
  ];
  return (
    <StepBase glow="bg-indigo-600/40">
      <div className="absolute left-1/2 top-[11%] w-[62%] -translate-x-1/2 -rotate-[4deg] rounded-2xl bg-white p-[6%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between">
          <span className="h-2 w-[38%] rounded-full bg-gray-900/80" />
          <span className="h-2 w-[16%] rounded-full bg-gray-900/15" />
        </div>
        <div className="mt-[8%] space-y-[7%]">
          {rows.map(([swatch, a, b], i) => (
            <div key={i} className="flex items-center gap-[6%]">
              <span className={`h-6 w-6 shrink-0 rounded-md sm:h-7 sm:w-7 ${swatch}`} />
              <div className="flex-1 space-y-1.5">
                <span className={`block h-1.5 rounded-full bg-gray-900/70 ${a}`} />
                <span className="block h-1 w-[40%] rounded-full bg-gray-900/15" />
              </div>
              <span className={`h-1.5 rounded-full bg-gray-900/70 ${b}`} style={{ maxWidth: '24%' }} />
            </div>
          ))}
        </div>
        <div className="mt-[8%] flex items-center justify-between border-t border-gray-900/10 pt-[6%]">
          <span className="h-2 w-[22%] rounded-full bg-gray-900/30" />
          <span className="h-3.5 w-[34%] rounded-full bg-gray-900" />
        </div>
      </div>
      <span className="absolute right-[12%] top-[7%] flex h-12 w-12 rotate-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-[0_14px_30px_-8px_rgba(0,0,0,0.7)]">
        <ShoppingBag className="h-5 w-5" strokeWidth={2} />
      </span>
    </StepBase>
  );
}

export function StepPayArt() {
  return (
    <StepBase glow="bg-purple-600/35">
      <div className="absolute left-1/2 top-[9%] -translate-x-1/2 -rotate-[9deg]">
        <PaymentCardArt tone="indigo" size={210} />
      </div>
      <div className="absolute left-1/2 top-[27%] -translate-x-1/2 rotate-[4deg]">
        <PaymentCardArt tone="night" size={200} />
      </div>
      <div className="absolute left-1/2 top-[62%] flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/20 bg-white py-1.5 pl-4 pr-1.5 font-futuristic text-[11px] font-bold uppercase tracking-wider text-black shadow-[0_16px_36px_-10px_rgba(0,0,0,0.8)]">
        Pay $279.95
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
          <Lock className="h-3.5 w-3.5" />
        </span>
      </div>
    </StepBase>
  );
}

export function StepDoneArt() {
  return (
    <StepBase glow="bg-indigo-600/35">
      <div className="absolute left-1/2 top-[40%] h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/30" />
      <div className="absolute left-1/2 top-[40%] h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <span className="pulse-ring absolute left-1/2 top-[40%] flex h-[26%] w-[26%] min-h-14 min-w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ok text-white shadow-[0_20px_50px_-10px_rgba(16,185,129,0.6)]">
        <Check className="h-[46%] w-[46%]" strokeWidth={3} />
      </span>
      <div className="absolute bottom-[26%] left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-[#181818]/90 px-3.5 py-2 shadow-2xl backdrop-blur-sm">
        <Package className="h-3.5 w-3.5 text-indigo-300" />
        <span className="font-futuristic text-[10px] font-bold uppercase tracking-wider text-gray-200">Order confirmed</span>
      </div>
    </StepBase>
  );
}
