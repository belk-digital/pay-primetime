'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight, ArrowUpRight, FileText, HelpCircle, LifeBuoy, Lock, Menu, Receipt, ShieldCheck, X } from 'lucide-react';
import { BrandLogo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { ANNOUNCEMENTS, NAV } from '@/lib/content';
import { SUPPORT_MAILTO } from '@/lib/site';
import { cn } from '@/lib/cn';

const NAV_UNDERLINE =
  "relative text-gray-300 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100";

const MOBILE_ICONS = [FileText, ShieldCheck, Receipt, LifeBuoy, HelpCircle];

function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center justify-center border-b border-white/5 bg-night px-10 text-center text-[11px] text-gray-300 md:text-xs">
      <span key={index} className="announce truncate">
        {ANNOUNCEMENTS[index]}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// Behaves like the brand's main nav: transparent and full width at the top of the page, then a compact
// floating glass bar once you scroll. It slides away on the way down and returns on any scroll up.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 50);
    const diff = y - lastY.current;
    if (Math.abs(diff) > 6) {
      if (diff > 0 && y > 160) setHidden(true);
      else if (diff < 0) setHidden(false);
      lastY.current = y;
    }
  });

  useEffect(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  // Escape closes the menu, and the page behind it stops scrolling while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [open]);

  const hide = hidden && !open;

  return (
    <>
      {showAnnouncement && <AnnouncementBar onDismiss={() => setShowAnnouncement(false)} />}

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: hide ? '-150%' : 0, opacity: hide ? 0 : 1 }}
        transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
        className={cn(
          'fixed inset-x-0 z-50 flex justify-center transition-[top,padding] duration-500 ease-in-out',
          showAnnouncement ? 'top-9' : 'top-0',
          scrolled ? 'py-3 md:py-4' : 'py-0',
        )}
      >
        <header
          className={cn(
            'relative flex items-center justify-between transition-all duration-500',
            scrolled
              ? 'w-[calc(100%-1.5rem)] rounded-2xl border border-white/10 bg-night/70 px-4 py-2 shadow-2xl backdrop-blur-lg md:w-[calc(100%-4rem)] md:px-6 lg:w-[calc(100%-6rem)]'
              : 'w-full border-b border-white/5 bg-transparent px-4 py-5 md:px-8 lg:px-12',
          )}
        >
          <Link href="/" aria-label="PayPrimeTime home" className="flex items-center transition-opacity hover:opacity-90">
            <span className="md:hidden">
              <BrandLogo size={27} />
            </span>
            <span className="hidden md:inline">
              <BrandLogo size={scrolled ? 32 : 38} className="transition-all duration-500" />
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 text-[13px] font-medium xl:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className={cn('font-futuristic uppercase tracking-wide', NAV_UNDERLINE)}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 font-futuristic text-[10px] font-bold uppercase tracking-wider text-gray-300 xl:inline-flex">
              <Lock className="h-3.5 w-3.5 text-indigo-300" />
              Secure checkout
            </span>
            <a
              href={SUPPORT_MAILTO}
              className="group hidden items-center gap-2 rounded-md border border-white/10 bg-white/10 px-5 py-2.5 font-futuristic text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:bg-white/20 md:inline-flex"
            >
              Contact
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="text-gray-300 transition-colors hover:text-white xl:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>
      </motion.div>

      {/* Mobile drawer */}
      <div
        onClick={() => setOpen(false)}
        data-lenis-prevent
        aria-hidden
        className={cn(
          'fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-500 xl:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        id="mobile-menu"
        role="dialog"
        aria-label="Site menu"
        aria-modal={open || undefined}
        inert={!open}
        data-lenis-prevent
        className={cn(
          'fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-black shadow-2xl transition-transform duration-500 ease-in-out xl:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-5">
          <BrandLogo size={30} />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-gray-400 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Mobile" className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-6 py-4">
          {NAV.map((item, i) => {
            const Icon = MOBILE_ICONS[i];
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-white/5 py-4 font-futuristic text-sm font-medium uppercase tracking-wide text-gray-300 transition-colors hover:text-white"
              >
                <Icon className="h-4 w-4 shrink-0 text-gray-500" />
                {item.label}
                <ArrowRight className="ml-auto h-4 w-4 text-gray-600" />
              </a>
            );
          })}
        </nav>

        <div className="shrink-0 space-y-3 border-t border-white/10 px-6 py-6">
          <Button href={SUPPORT_MAILTO} variant="light" fullWidth>
            Contact support
          </Button>
          <p className="flex items-center justify-center gap-2 text-center text-[11px] text-gray-500">
            <Lock className="h-3 w-3" /> Encrypted checkout
          </p>
        </div>
      </aside>
    </>
  );
}
