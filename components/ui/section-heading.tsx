import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

// Small indigo chip that sits above section titles.
export function Eyebrow({
  children,
  tone = 'dark',
  className,
}: {
  children: ReactNode;
  /** `dark` for dark sections, `light` for the light-gray ones. */
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block rounded border px-3 py-1 text-[10px] font-bold uppercase tracking-widest sm:text-xs',
        tone === 'dark'
          ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300'
          : 'border-indigo-200 bg-indigo-100 text-indigo-600',
        className,
      )}
    >
      {children}
    </span>
  );
}

// Michroma, uppercase and wide-tracked, with the indigo-to-purple accent on a trailing phrase.
export function SectionTitle({
  children,
  accent,
  tone = 'dark',
  as: Tag = 'h2',
  className,
}: {
  children: ReactNode;
  accent?: ReactNode;
  tone?: 'dark' | 'light';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        'font-michroma text-[1.6rem] font-bold uppercase leading-[1.18] tracking-wider sm:text-4xl lg:text-5xl',
        tone === 'dark' ? 'text-white' : 'text-gray-900',
        className,
      )}
    >
      {children}
      {accent && (
        <>
          {' '}
          <span className={tone === 'dark' ? 'text-brand-gradient-light' : 'text-brand-gradient'}>{accent}</span>
        </>
      )}
    </Tag>
  );
}
