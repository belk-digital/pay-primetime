import type { MetadataRoute } from 'next';

// Pages stay crawlable on purpose: a crawler has to fetch a page to see its "noindex", so blocking
// them here would let a stray link get the bare URL listed. No sitemap is published.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
  };
}
