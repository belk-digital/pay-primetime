import { RingsBackdrop } from './backdrops';

// A lock-and-shield illustration for the security panel. Fills its parent.
export function ShieldArt() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#06060a]">
      <div className="absolute left-1/2 top-[42%] h-[70%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/35 blur-[90px]" />
      <div className="absolute -right-10 bottom-0 h-[40%] w-[60%] rounded-full bg-purple-600/25 blur-[100px]" />
      <RingsBackdrop cx={500} cy={420} strong />
      <div className="dot-grid absolute inset-0 opacity-30" />
      <svg
        viewBox="0 0 300 340"
        className="absolute left-1/2 top-[9%] w-[58%] -translate-x-1/2 drop-shadow-[0_40px_50px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="shieldFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#818cf8" />
            <stop offset="0.5" stopColor="#4f46e5" />
            <stop offset="1" stopColor="#581c87" />
          </linearGradient>
          <linearGradient id="shieldShine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M150 28 252 68v86c0 66-44 114-102 140C92 268 48 220 48 154V68Z" fill="url(#shieldFill)" />
        <path d="M150 28 252 68v86c0 66-44 114-102 140C92 268 48 220 48 154V68Z" fill="url(#shieldShine)" />
        <path
          d="M150 52 232 84v70c0 54-35 94-82 116-47-22-82-62-82-116V84Z"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.4"
          strokeWidth="2"
        />
        {/* Lock */}
        <path
          d="M128 140v-14a22 22 0 0 1 44 0v14"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <rect x="116" y="138" width="68" height="52" rx="12" fill="#0a0a0a" />
        <circle cx="150" cy="160" r="7" fill="#a5b4fc" />
        <rect x="147" y="162" width="6" height="14" rx="3" fill="#a5b4fc" />
      </svg>
    </div>
  );
}
