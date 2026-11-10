import { ArrowRight, Check, Lock } from 'lucide-react';

// A decorative replica of the real pay page for the hero. Every figure is an example, so the whole
// thing is hidden from assistive tech and labelled "Sample order" for everyone else.
export function CheckoutPreview() {
  return (
    <div
      aria-hidden
      className="float-soft relative w-full max-w-[360px] rounded-2xl 2xl:max-w-[400px] border border-white/10 bg-surface/85 p-5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mark.webp" alt="" className="h-6 w-auto" />
          </span>
          <div>
            <p className="font-michroma text-[11px] font-bold uppercase leading-tight tracking-wider text-white">
              Your merchant
            </p>
            <p className="mt-0.5 text-[11px] leading-tight text-gray-500">Order #20481 &middot; Sample</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 font-futuristic text-[9px] font-bold uppercase tracking-wider text-indigo-300">
          <Lock className="h-3 w-3" /> Secure
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total due</p>
        <p className="tnum mt-1 font-michroma text-[1.7rem] font-bold leading-none tracking-tight text-white">$279.95</p>
        <div className="tnum mt-3 space-y-1.5 border-t border-white/5 pt-3 text-[11.5px] text-gray-400">
          <div className="flex justify-between">
            <span>Items (3)</span>
            <span className="text-gray-200">$270.00</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-gray-200">$9.95</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Card number</p>
          <p className="tnum mt-0.5 text-[13px] text-gray-500">1234 1234 1234 1234</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Expiry</p>
            <p className="mt-0.5 text-[13px] text-gray-500">MM / YY</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">CVC</p>
            <p className="mt-0.5 text-[13px] text-gray-500">123</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex h-12 items-center justify-between rounded-full bg-indigo-600 pl-6 pr-1.5 font-futuristic text-[11px] font-bold uppercase tracking-widest text-white shadow-[0_12px_32px_-12px_rgba(79,70,229,0.9)]">
        Pay $279.95
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
        </span>
      </div>

      {/* Confirmation chip hanging off the corner */}
      <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl border border-white/10 bg-panel px-4 py-3 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)] sm:flex lg:-left-14">
        <span className="pulse-ring flex h-8 w-8 items-center justify-center rounded-full bg-ok text-white">
          <Check className="h-4 w-4" strokeWidth={2.8} />
        </span>
        <div>
          <p className="font-futuristic text-[10px] font-bold uppercase leading-tight tracking-wider text-white">
            Payment confirmed
          </p>
          <p className="mt-0.5 text-[10.5px] leading-tight text-gray-500">Taking you back to the merchant</p>
        </div>
      </div>
    </div>
  );
}
