import { CreditCard, Copy, Mail, RotateCcw } from 'lucide-react';
import { Eyebrow, SectionTitle } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { HelpCard } from './help-card';
import { TROUBLESHOOTING } from '@/lib/content';
import { SITE } from '@/lib/site';

// One per troubleshooting item, in order: declined, no confirmation, paid twice, refund.
const ICONS = [CreditCard, Mail, Copy, RotateCcw];

export function Help() {
  return (
    <section id="help" className="bg-gray-50 py-24 text-gray-900 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Eyebrow tone="light">Help</Eyebrow>
            <SectionTitle tone="light" className="mt-5" accent="to plan.">
              When something doesn&rsquo;t go
            </SectionTitle>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-gray-600 md:text-base">
            The four things people ask about most, answered straight. For anything else, email{' '}
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="font-semibold text-indigo-600 underline decoration-indigo-200 underline-offset-4 transition-colors hover:text-indigo-800"
            >
              {SITE.supportEmail}
            </a>
            .
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          {TROUBLESHOOTING.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={item.problem} delay={i * 80} className="h-full">
                <HelpCard
                  index={i}
                  icon={<Icon className="h-[18px] w-[18px]" strokeWidth={2} />}
                  problem={item.problem}
                  answer={item.answer}
                  tip={item.tip}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
