import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { BrandLogo } from '@/components/ui/logo';
import { Reveal } from '@/components/ui/reveal';
import { PaymentBadges } from './payment-badges';
import { BackToTop } from './back-to-top';
import { FOOTER_COLUMNS } from '@/lib/content';
import { SITE, SUPPORT_MAILTO } from '@/lib/site';

const LINK_UNDERLINE =
  "relative inline-block w-fit text-sm text-gray-400 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100";

export function SiteFooter() {
  return (
    <footer className="flex flex-col overflow-hidden bg-deep px-6 pb-0 pt-24 text-white md:px-12 lg:px-24">
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        <div className="mb-16 flex flex-col justify-between gap-16 lg:flex-row">
          {/* Brand + support */}
          <Reveal className="flex flex-col gap-8 lg:w-1/2">
            <div>
              <Link href="/" aria-label="PayPrimeTime home" className="mb-6 inline-block transition-opacity hover:opacity-85">
                <BrandLogo size={76} />
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-gray-400">
                PayPrimeTime is a secure hosted payment page where merchant orders are paid. It sells nothing itself: it
                only takes payment for the order you have just placed.
              </p>
            </div>

            <div className="max-w-sm">
              <h4 className="mb-3 text-base font-semibold text-white">Need a hand with a payment?</h4>
              <p className="mb-4 text-sm text-gray-400">Our team replies to payment questions by email.</p>
              <a
                href={`${SUPPORT_MAILTO}?subject=Payment%20question`}
                className="group relative flex w-full items-center rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-14 text-sm text-white transition-colors hover:border-indigo-500/40 hover:bg-white/10"
              >
                <Mail className="mr-3 h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-indigo-300" />
                <span className="truncate">{SITE.supportEmail}</span>
                <span className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors group-hover:bg-indigo-500">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </a>
            </div>
          </Reveal>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:w-auto lg:gap-x-16">
            {FOOTER_COLUMNS.map((col, i) => (
              <Reveal key={col.title} delay={80 + i * 80}>
                <h4 className="mb-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={`font-futuristic ${LINK_UNDERLINE}`}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Back to top */}
        <Reveal className="mb-8 flex flex-col justify-between gap-4 border-t border-white/5 pt-8 text-sm text-gray-400 sm:flex-row sm:items-center">
          <p>Questions about what you ordered? The merchant you paid can help with the order itself.</p>
          <BackToTop />
        </Reveal>

        {/* Accepted payment methods */}
        <Reveal className="mb-8 flex flex-col gap-4 border-t border-white/5 pt-8 text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Accepted</span>
          <PaymentBadges className="text-gray-300" />
        </Reveal>

        {/* Seller note */}
        <Reveal className="mb-8 border-t border-white/5 pt-8">
          <p className="max-w-4xl text-[11px] leading-relaxed text-gray-500">
            <span className="mr-2 font-bold uppercase tracking-wider text-gray-400">Please note:</span>
            The merchant named on each payment page is the seller of that order. Its policies on refunds, shipping and
            returns apply to your purchase, and card payments are processed securely on its behalf.
          </p>
        </Reveal>

        <Reveal className="mb-16 flex flex-col items-center justify-between text-sm text-gray-400 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0">
            Design by{' '}
            <a
              href="https://belkdigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Belk Digital
            </a>
          </p>
        </Reveal>
      </div>

      {/* Giant gradient wordmark */}
      <div className="relative mt-auto flex w-full justify-center pb-4" aria-hidden>
        <div
          className="w-full text-center"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          }}
        >
          <Reveal>
            <p className="m-0 select-none bg-linear-to-b from-indigo-600 to-purple-900 bg-clip-text p-0 font-futuristic text-[8.2vw] font-bold leading-none tracking-tighter text-transparent">
              PAYPRIMETIME
            </p>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
