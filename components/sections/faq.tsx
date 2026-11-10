'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { FAQ_ITEMS } from '@/lib/content';
import { cn } from '@/lib/cn';

// Accordion: one panel open at a time, the open one picks up an indigo
// border and wash. The panel height animates with a grid-rows transition, so no measuring is needed.
export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-white/5 bg-black px-5 py-24 text-white sm:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mb-14 text-center">
          <h2 className="mb-6 font-michroma text-[1.6rem] font-bold uppercase leading-[1.18] tracking-wider sm:text-4xl lg:text-5xl">
            Frequently asked <span className="text-silver-gradient">questions</span>
          </h2>
          <p className="text-base text-gray-400 md:text-lg">
            Quick answers about how paying here works. Anything else, just email us.
          </p>
        </Reveal>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, index) => {
            const open = openIndex === index;
            return (
              <Reveal
                key={faq.question}
                delay={Math.min(index, 4) * 60}
                className={cn(
                  'overflow-hidden rounded-2xl border transition-all duration-300',
                  open ? 'border-indigo-500/50 bg-indigo-900/20' : 'border-white/10 bg-surface hover:border-white/20',
                )}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 sm:px-6"
                  >
                    <span className="font-michroma text-[13px] font-bold uppercase leading-snug tracking-wide text-white sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300',
                        open && 'rotate-180 text-indigo-400',
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 text-sm leading-relaxed text-gray-300 sm:px-6 sm:text-base">{faq.answer}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
