import { CreditCard, PackageCheck, ShoppingBag } from 'lucide-react';
import { StepDoneArt, StepOrderArt, StepPayArt } from '@/components/art/step-art';
import { Eyebrow, SectionTitle } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { ScrollMarquee } from './scroll-marquee';
import { STEPS } from '@/lib/content';

const ICONS = [ShoppingBag, CreditCard, PackageCheck];
const ART = [StepOrderArt, StepPayArt, StepDoneArt];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-y border-white/5 bg-void py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal className="mb-14 flex flex-col items-start justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <SectionTitle className="mt-5" accent="About a minute.">
              Three steps.
            </SectionTitle>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-gray-400 md:text-base">
            Most of it happens before you reach this page. All that is left here is the payment itself.
          </p>
        </Reveal>
      </div>

      {/* Full-bleed band: outlined type runs edge to edge behind the cards and slides as you scroll. */}
      <div className="relative w-full">
        <ScrollMarquee />

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-6 pt-6 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 lg:gap-8">
            {STEPS.map((step, i) => {
              const Icon = ICONS[i];
              const Art = ART[i];
              return (
                <Reveal
                  key={step.title}
                  delay={i * 120}
                  className="group relative flex w-[82vw] max-w-[360px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/40 hover:shadow-[0_30px_80px_-30px_rgba(79,70,229,0.5)] sm:w-auto sm:max-w-none"
                >
                  <div className="relative aspect-[4/3.1] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                      <Art />
                    </div>
                    <div className="relative z-10 flex items-start justify-between p-4 sm:p-5">
                      <span className="rounded border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-200 backdrop-blur-sm">
                        {step.tag}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-indigo-300 backdrop-blur-sm">
                        <Icon className="h-4 w-4" strokeWidth={2.1} />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="font-michroma text-xl font-bold uppercase tracking-wider text-white sm:text-[1.35rem]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{step.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
