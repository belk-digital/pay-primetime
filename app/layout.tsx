import type { Metadata, Viewport } from 'next';
import { Inter, Michroma, Syncopate } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/ui/smooth-scroll';
import { SITE } from '@/lib/site';

// The brand's three typefaces.
const syncopate = Syncopate({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', variable: '--nf-syncopate' });
const michroma = Michroma({ subsets: ['latin'], weight: '400', display: 'swap', variable: '--nf-michroma' });
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--nf-inter' });

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const TITLE = 'PayPrimeTime — Secure payment pages for merchants';
const DESCRIPTION =
  'PayPrimeTime is a secure hosted payment page where merchant orders are paid. Every checkout names who you are paying before you pay.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: '%s | PayPrimeTime' },
  description: DESCRIPTION,
  applicationName: 'PayPrimeTime',
  category: 'finance',
  // Email addresses and phone numbers in the copy stay plain text.
  formatDetection: { email: false, telephone: false, address: false },
  // A payment address can carry an order reference, so it must not leak in a Referer header.
  referrer: 'strict-origin-when-cross-origin',
  // The whole site is kept out of search results: this tag, the matching X-Robots-Tag header on every
  // response (next.config.mjs), and no sitemap.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: { index: false, follow: false, noarchive: true, nosnippet: true, noimageindex: true },
  },
  openGraph: {
    type: 'website',
    siteName: 'PayPrimeTime',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE.url,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syncopate.variable} ${michroma.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-black font-inter text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-5 focus:py-3 focus:font-futuristic focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:text-black"
        >
          Skip to main content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
