import { timingSafeEqual } from 'node:crypto';

// The one business that takes payments through PayPrimeTime: the PrimeTime store. Nothing is charged
// for anyone else, because every payment is stamped with this merchant's id when it is created and a
// payment without it is refused everywhere else.
//
// It is described by plain environment variables (see .env.example):
//   SHOP_NAME                   shown to customers on the payment page: the real seller
//   SHOP_URL                    where customers are returned, and where status pings go
//                               ({SHOP_URL}/api/webhooks/payprimetime, or SHOP_WEBHOOK_URL)
//   SHOP_ALT_URLS               other addresses of the same store customers may return to (optional)
//   SHOP_SUPPORT_EMAIL          shown on the payment page (optional)
//   SHOP_STATEMENT_DESCRIPTOR   shown on the payment page (optional). Display only: what actually
//                               appears on a card statement is set in the Stripe Dashboard.
//   PAYPRIMETIME_API_SECRET     64 random hex characters, the SAME value as in the store's environment
export interface Merchant {
  id: string;
  name: string;
  origin: string;
  altOrigins: string[];
  secret: string;
  statementDescriptor?: string;
  supportEmail?: string;
  webhookUrl: string;
}

export const MERCHANT_ID = 'primetime';

const text = (name: string) => process.env[name]?.trim() || undefined;
const isHttpUrl = (value: string | undefined): value is string => !!value && /^https?:\/\//.test(value);

/** The merchant, or null (with the reason logged) when the environment does not describe a valid one. */
export function getMerchant(): Merchant | null {
  const name = text('SHOP_NAME');
  const url = text('SHOP_URL');
  const secret = text('PAYPRIMETIME_API_SECRET');

  const problems: string[] = [];
  if (!name) problems.push('SHOP_NAME is empty');
  if (!isHttpUrl(url)) problems.push('SHOP_URL must start with http:// or https://');
  if (!secret || secret.length < 32) problems.push('PAYPRIMETIME_API_SECRET must be at least 32 characters');
  if (problems.length > 0 || !name || !url || !secret) {
    console.error(`PayPrimeTime merchant is not configured: ${problems.join('; ')}`);
    return null;
  }

  try {
    const origin = new URL(url).origin;
    const altOrigins = (text('SHOP_ALT_URLS') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(isHttpUrl)
      .map((s) => new URL(s).origin);
    return {
      id: MERCHANT_ID,
      name,
      origin,
      altOrigins,
      secret,
      statementDescriptor: text('SHOP_STATEMENT_DESCRIPTOR'),
      supportEmail: text('SHOP_SUPPORT_EMAIL'),
      webhookUrl: text('SHOP_WEBHOOK_URL') || `${origin}/api/webhooks/payprimetime`,
    };
  } catch {
    console.error('PayPrimeTime merchant is not configured: SHOP_URL / SHOP_ALT_URLS are not valid addresses');
    return null;
  }
}

export function getMerchantById(id: string | undefined | null): Merchant | null {
  if (id !== MERCHANT_ID) return null;
  return getMerchant();
}

// The caller is identified by the shared secret, compared in constant time.
export function authenticateMerchant(req: Request): Merchant | null {
  const merchant = getMerchant();
  if (!merchant) return null;
  const supplied = Buffer.from(req.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${merchant.secret}`);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected) ? merchant : null;
}

// Customers are only ever sent back to a registered address of the store they paid.
export function isReturnUrlAllowed(url: string, merchant: Merchant): boolean {
  try {
    const origin = new URL(url).origin;
    return origin === merchant.origin || merchant.altOrigins.includes(origin);
  } catch {
    return false;
  }
}

// Every address customers may be sent back to, primary first. The position in this list is what is
// stored on a payment, so Stripe never holds the store's own web address.
export function merchantOrigins(merchant: Merchant): string[] {
  return [merchant.origin, ...merchant.altOrigins];
}

// Splits an allowed return address into what is stored on the Stripe payment: which registered origin
// it is on (a position, not an address) and the path. Null when the address is not allowed.
export function encodeReturnUrl(url: unknown, merchant: Merchant): { returnOrigin: string; returnPath: string } | null {
  if (typeof url !== 'string' || !isReturnUrlAllowed(url, merchant)) return null;
  const parsed = new URL(url);
  const index = merchantOrigins(merchant).indexOf(parsed.origin);
  if (index < 0) return null;
  return { returnOrigin: String(index), returnPath: parsed.pathname + parsed.search };
}

// Rebuilds the full return address from what encodeReturnUrl stored, using only registered origins, so
// the result can never point anywhere the store has not registered (no open redirect).
export function decodeReturnUrl(metadata: Record<string, string> | null | undefined, merchant: Merchant): string | null {
  if (!metadata || metadata.returnOrigin === undefined) return null;
  const origin = merchantOrigins(merchant)[Number(metadata.returnOrigin)];
  const path = metadata.returnPath;
  if (!origin || typeof path !== 'string') return null;
  // A path must stay a path: "//host" and "/\host" are how a redirect escapes to another site.
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return null;
  try {
    const rebuilt = new URL(path, origin);
    return rebuilt.origin === origin ? rebuilt.toString() : null;
  } catch {
    return null;
  }
}

// What the browser is allowed to know about the merchant.
export function publicMerchant(m: Merchant) {
  return { name: m.name, statementDescriptor: m.statementDescriptor ?? m.name.toUpperCase().slice(0, 22) };
}
