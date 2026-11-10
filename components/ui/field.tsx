import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

// Form styling for the brand's checkout: gray-50 inputs, hairline borders, an indigo focus
// ring, and tiny wide-tracked bold labels.
export const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500';

export function inputClass(hasError = false) {
  return cn(
    'w-full rounded-xl border bg-gray-50 px-4 py-3 font-inter text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-hidden focus:ring-1',
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50'
      : 'border-black/10 hover:border-black/20 focus:border-indigo-500/50 focus:ring-indigo-500/50',
  );
}

export function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="fade-up mt-1.5 text-xs text-red-500">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}
