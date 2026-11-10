import { PaymentCardArt } from '@/components/art/payment-card';
import { GlowField, RingsBackdrop } from '@/components/art/backdrops';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { CheckoutPreview } from './checkout-preview';
import { HERO_FACTS, MARQUEE_ITEMS } from '@/lib/content';

function MarqueeSet({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12" aria-hidden={hidden || undefined}>
      {MARQUEE_ITEMS.map(([strong, soft], i) => (
        <div
          key={strong}
          className="flex items-center gap-3 whitespace-nowrap font-futuristic text-[10px] uppercase tracking-widest sm:text-[11px]"
        >
          <span className="text-[9px] text-indigo-400">{i % 2 === 0 ? '◆' : '◇'}</span>
          <span className="font-bold text-white">{strong}</span>
          <span className="-ml-1 text-gray-500">{soft}</span>
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <>
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-night text-gray-200">
        {/* Atmosphere: light pools, orbiting rings, a faint dot grid, and a fade under the nav */}
        <GlowField />
        <RingsBackdrop cx={760} cy={500} className="opacity-60" />
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-linear-to-b from-black/90 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black to-transparent" />

        <div className="relative z-10 flex w-full flex-1 flex-col justify-center px-4 pb-28 pt-36 md:px-8 md:pt-40 lg:px-12 lg:pb-24 lg:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.18fr_0.82fr] lg:gap-10">
            <div className="max-w-3xl">
              <Reveal>
                <Eyebrow>Secure checkout &middot; Merchant payments</Eyebrow>
              </Reveal>

              <Reveal delay={90}>
                <h1 className="mt-5 font-michroma text-[1.4rem] font-bold uppercase leading-[1.2] tracking-wider text-white min-[380px]:text-[1.5rem] sm:text-[2.2rem] lg:text-[2.3rem] xl:text-[2.7rem] 2xl:text-[3rem]">
                  Pay your order
                  <br />
                  <span className="text-silver-gradient">with confidence</span>
                </h1>
              </Reveal>

              <Reveal delay={180}>
                <p className="mt-6 max-w-lg text-sm leading-relaxed text-gray-300 md:text-base">
                  PayPrimeTime is the secure hosted payment page where merchant orders are paid. Every checkout names
                  the merchant, the order and the amount before you enter a single card digit.
                </p>
              </Reveal>

              <Reveal delay={270} className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Button href="#how-it-works" variant="light">
                  How it works
                </Button>
                <Button href="#help" variant="outline">
                  Get help
                </Button>
              </Reveal>

              <Reveal delay={360}>
                <ul className="mt-10 grid grid-cols-1 gap-2 font-mono text-[11px] uppercase tracking-wider text-gray-400 sm:grid-cols-2 sm:text-xs lg:grid-cols-1 xl:grid-cols-2">
                  {HERO_FACTS.map((fact) => (
                    <li key={fact} className="flex items-center gap-3">
                      <span className="text-white/40">/</span> {fact}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={200} className="relative mx-auto flex w-full max-w-[560px] items-center justify-center lg:h-[560px] 2xl:max-w-[640px]">
              <div aria-hidden className="pointer-events-none absolute left-[-6%] top-[3%] hidden -rotate-[14deg] lg:block xl:left-[-2%]">
                <PaymentCardArt tone="indigo" size={300} className="float-soft" style={{ animationDelay: '-2s' }} />
              </div>
              <div aria-hidden className="pointer-events-none absolute -right-2 bottom-[2%] hidden rotate-[9deg] lg:block">
                <PaymentCardArt tone="night" size={290} className="float-soft" style={{ animationDelay: '-4.5s' }} />
              </div>
              <CheckoutPreview />
            </Reveal>
          </div>
        </div>

        {/* Docked strip of reassurances */}
        <div className="marquee-pause absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/10 bg-black/55 py-4 backdrop-blur-md">
          <div aria-hidden className="absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-black to-transparent" />
          <div aria-hidden className="absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-black to-transparent" />
          <div className="marquee-left flex w-max items-center" style={{ ['--marquee-speed' as string]: '38s' }}>
            <MarqueeSet />
            <MarqueeSet hidden />
          </div>
        </div>
      </section>

    </>
  );
}
