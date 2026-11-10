import { GlowField, RingsBackdrop } from '@/components/art/backdrops';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { CtaOrb } from './cta-orb';
import { SUPPORT_MAILTO } from '@/lib/site';

// The closing call to action: a rounded dark banner, text on the left, with the same orbiting rings
// and light pools as the hero rather than a photograph.
export function CtaBanner() {
  return (
    <section className="bg-white px-4 py-12 md:px-8 md:py-16 lg:px-12">
      <Reveal className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-night shadow-2xl">
        <GlowField />
        <RingsBackdrop cx={820} cy={500} className="opacity-70" />
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_80%_50%,black,transparent_70%)]"
        />

        <CtaOrb />

        <div className="relative z-10 flex max-w-3xl flex-col items-start px-8 py-12 text-left text-white md:px-12 md:py-16 lg:px-16 lg:py-20">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-400 sm:text-sm">We&rsquo;re here to help</p>
          <h2 className="mb-6 font-michroma text-[1.6rem] font-bold uppercase leading-tight tracking-wider sm:text-4xl">
            Need a hand with a payment?
          </h2>
          <p className="mb-10 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
            If a payment link isn&rsquo;t working, a charge looks wrong or you would like a receipt re-sent, our team
            will sort it out. Include your order number and we can usually answer in one reply.
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Button href={`${SUPPORT_MAILTO}?subject=Payment%20question`} variant="light">
              Contact support
            </Button>
            <Button href="#how-it-works" variant="outline">
              How paying works
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
