// Single source of truth for who PayPrimeTime is. PayPrimeTime is a hosted payment page: a merchant
// sends a customer here with an order, the customer pays, and is sent back. It sells nothing itself, so
// nothing in this file is specific to any one merchant. The merchant being paid comes from the order
// (see lib/order.ts).

const trimSlash = (url: string) => url.replace(/\/+$/, '');

export const SITE = {
  name: 'PayPrimeTime',
  url: trimSlash(process.env.NEXT_PUBLIC_SITE_URL || 'https://payprimetime.com'),
  // Must be a mailbox that exists before launch.
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@payprimetime.com',
  /**
   * False until a real payment provider is wired into app/pay. While false, the pay page says so,
   * the form is a visual preview, and no payment is taken or sent anywhere. See lib/payment-gateway.ts.
   */
  paymentsLive: process.env.NEXT_PUBLIC_PAYMENTS_LIVE === 'true',
} as const;

export const SUPPORT_MAILTO = `mailto:${SITE.supportEmail}`;
