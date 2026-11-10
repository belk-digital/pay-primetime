import { ShieldCheck } from 'lucide-react';
import { ShieldArt } from '@/components/art/shield-art';
import { Eyebrow, SectionTitle } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { SECURITY_POINTS } from '@/lib/content';

export function Security() {
  return (
    // `overflow-x-clip`, not `overflow-hidden`: hidden turns the section into a scroll container, and
    // `position: sticky` then pins to that container instead of the page, so the card on the left would
    // never stay put. Clip trims the overflow the same way without that side effect.
    <section id="security" className="relative overflow-x-clip bg-gray-50 py-24 text-gray-900 md:py-32">
      {/* White wave texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/wave.webp')] bg-cover bg-center opacity-70" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal className="mb-12 max-w-4xl md:mb-16">
          <Eyebrow tone="light">Security</Eyebrow>
          <SectionTitle tone="light" className="mt-5" accent="touches this site.">
            Your card number never
          </SectionTitle>
        </Reveal>

        {/* The list on the right is shown in full and scrolls with the page. From lg up the card on the
            left stays pinned in view while it does, and lets go when the list ends. */}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <div className="relative aspect-[4/4.4] overflow-hidden rounded-3xl border border-black/5 bg-night shadow-2xl lg:sticky lg:top-28 lg:aspect-auto lg:h-[min(36rem,calc(100svh-9rem))]">
              <ShieldArt />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md sm:left-6 sm:top-6">
                <ShieldCheck className="h-4 w-4 text-indigo-300" strokeWidth={2.2} />
                Hosted secure fields
              </div>

              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-black/40 p-5 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6">
                <p className="font-michroma text-sm font-bold uppercase leading-snug tracking-wider sm:text-base">
                  A payment page should be dull in the best way.
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-300">
                  It does a small number of things, in the safest place to do them.
                </p>
              </div>
            </div>
          </Reveal>

          <ol className="flex flex-col gap-4 sm:gap-5">
            {SECURITY_POINTS.map((point, i) => (
              <Reveal
                as="li"
                key={point.title}
                delay={i * 90}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-xl sm:p-8"
              >
                <div className="flex gap-5 sm:gap-7">
                  <span className="tnum font-michroma text-2xl font-bold leading-none text-indigo-600 sm:text-[1.9rem]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <Eyebrow tone="light">{point.tag}</Eyebrow>
                    <h3 className="mt-4 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-indigo-600 sm:text-xl">
                      {point.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600">{point.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
