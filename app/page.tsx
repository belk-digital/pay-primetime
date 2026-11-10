import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Hero } from '@/components/sections/hero';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Security } from '@/components/sections/security';
import { AfterYouPay } from '@/components/sections/after-you-pay';
import { Help } from '@/components/sections/help';
import { Faq } from '@/components/sections/faq';
import { CtaBanner } from '@/components/sections/cta-banner';

// The page names its own address; indexing stays off for every page (see app/layout.tsx).
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <HowItWorks />
        <Security />
        <AfterYouPay />
        <Help />
        <Faq />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
