import { Check, Mail, PackageCheck, RotateCcw, type LucideIcon } from 'lucide-react';
import { GlowField } from '@/components/art/backdrops';
import { Button } from '@/components/ui/button';
import { Eyebrow, SectionTitle } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { AFTER_PAY_STEPS, PAYMENT_METHOD_NOTES } from '@/lib/content';
import { SUPPORT_MAILTO } from '@/lib/site';

const ICONS: LucideIcon[] = [Check, Mail, PackageCheck, RotateCcw];

export function AfterYouPay() {
  return (
    <section id="after-you-pay" className="relative overflow-hidden bg-black py-24 md:py-32">
      <GlowField className="opacity-70" />

      <div className="relative mx-auto grid max-w-[1400px] items-start gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-12">
        <Reveal className="min-w-0 lg:sticky lg:top-28">
          <Eyebrow>After you pay</Eyebrow>
          <SectionTitle className="mt-5" accent="after you pay">
            What happens
          </SectionTitle>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400 md:text-base">
            Paying here is the last step of checkout. You are returned to the merchant with your confirmation, and
            everything that follows is between you and them.
          </p>

          <div className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-surface p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">What you can pay with</p>
            <ul className="mt-4 space-y-3">
              {PAYMENT_METHOD_NOTES.map((note) => (
                <li key={note} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <Button href={`${SUPPORT_MAILTO}?subject=Payment%20question`} variant="outline">
              Ask about a payment
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          <ol className="relative rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl sm:p-9">
            <span
              aria-hidden
              className="absolute bottom-14 left-[2.9rem] top-14 w-px bg-linear-to-b from-indigo-500/60 via-white/10 to-transparent sm:left-[3.55rem]"
            />
            {AFTER_PAY_STEPS.map((step, i) => {
              const Icon = ICONS[i];
              return (
                <li key={step.title} className="relative flex gap-5 pb-9 last:pb-0 sm:gap-6">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-500/40 bg-[#14142a] text-indigo-300">
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-futuristic text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                      {step.time}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
