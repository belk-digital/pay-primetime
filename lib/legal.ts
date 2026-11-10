// Shared facts for the legal pages (app/terms, app/privacy, app/refunds). Update LEGAL_UPDATED whenever the
// wording of any of them changes. The pages describe what this site actually does: re-read them if the way
// payments are taken ever changes (analytics, accounts, saved cards, a database...).

export const LEGAL_UPDATED = 'November 11, 2026';

export const LEGAL_PAGES = [
  { href: '/terms', label: 'Terms of Service', short: 'Terms' },
  { href: '/privacy', label: 'Privacy Policy', short: 'Privacy' },
  { href: '/refunds', label: 'Refunds & disputes', short: 'Refunds & disputes' },
] as const;

// Optional: who operates the service. Shown on the Terms and Privacy pages only when set, so nothing
// placeholder ever appears. Set both in the host's environment (see .env.example).
export const LEGAL_OPERATOR = {
  entity: process.env.NEXT_PUBLIC_LEGAL_ENTITY?.trim() || '',
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS?.trim() || '',
} as const;
