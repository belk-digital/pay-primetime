import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { GlowField } from '@/components/art/backdrops';
import { BrandLogo } from '@/components/ui/logo';
import { LegalLinks } from './legal-links';
import { LEGAL_PAGES, LEGAL_UPDATED } from '@/lib/legal';
import { SITE, SUPPORT_MAILTO } from '@/lib/site';
import { cn } from '@/lib/cn';

// The shell shared by the Terms, Privacy and Refunds pages: the brand header, a readable single column,
// and a slim footer that links the three pages to each other. Nothing here depends on the home page's
// anchors, so it works from any address.
export function LegalPage({
  title,
  summary,
  current,
  children,
}: {
  title: string;
  summary: string;
  /** The href of this page, to mark it in the footer. */
  current: (typeof LEGAL_PAGES)[number]['href'];
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-night text-white">
      <GlowField />
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[28rem] opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="PayPrimeTime home" className="transition-opacity hover:opacity-90">
          <BrandLogo size={42} />
        </Link>
        <a
          href={SUPPORT_MAILTO}
          className="group hidden items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-2.5 font-futuristic text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:inline-flex sm:text-xs"
        >
          Contact support
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </a>
      </header>

      <main id="main-content" className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-xs font-medium text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to PayPrimeTime
        </Link>

        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-indigo-300">Legal</p>
        <h1 className="font-michroma text-[1.7rem] font-bold uppercase leading-tight tracking-wider sm:text-4xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-400">{summary}</p>
        <p className="mt-4 text-xs text-gray-500">Last updated {LEGAL_UPDATED}</p>

        <div className="mt-12 space-y-12 border-t border-white/10 pt-12">{children}</div>
      </main>

      <footer className="relative z-10 border-t border-white/5 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_PAGES.map((page) => (
              <a
                key={page.href}
                href={page.href}
                aria-current={page.href === current ? 'page' : undefined}
                className={cn(
                  'underline-offset-4 transition-colors hover:text-white hover:underline',
                  page.href === current && 'text-gray-300',
                )}
              >
                {page.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

// One numbered section of a legal page.
export function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-gray-300 [&_a]:text-white [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-white [&_strong]:font-semibold [&_strong]:text-white [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-gray-500">
        {children}
      </div>
    </section>
  );
}
