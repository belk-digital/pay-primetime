import type { ReactNode } from 'react';

interface HelpCardProps {
  index: number;
  icon: ReactNode;
  problem: string;
  answer: string;
  tip: string;
}

// A help card with one restrained hover: it rises a couple of pixels, the border and shadow firm up,
// and the icon tile turns indigo. Nothing else moves. Server-rendered, no JavaScript.
export function HelpCard({ index, icon, problem, answer, tip }: HelpCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-7 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_18px_40px_-22px_rgba(17,24,39,0.28)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
          {icon}
        </span>
        <span className="tnum font-michroma text-[11px] font-bold tracking-widest text-gray-300 transition-colors duration-300 group-hover:text-indigo-600">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-bold leading-snug text-gray-900 sm:text-xl">{problem}</h3>
      <p className="mb-7 mt-3 max-w-md text-sm leading-relaxed text-gray-600">{answer}</p>

      <p className="mt-auto border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-500">
        <span className="mr-1.5 font-semibold text-gray-900">Quick fix</span>
        {tip}
      </p>
    </article>
  );
}
