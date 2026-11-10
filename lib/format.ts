export function formatMoney(minorUnits: number, currency: string): string {
  return (minorUnits / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
}

// ---------------------------------------------------------------------------------------------
// Card field helpers. These only shape and sanity-check what the customer types so the form feels
// right (spacing, brand hint, inline errors). They are NOT a security control: the payment provider
// validates the real card server-side.
// ---------------------------------------------------------------------------------------------

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export function detectBrand(raw: string): CardBrand {
  const d = digitsOnly(raw);
  if (/^4/.test(d)) return 'visa';
  if (/^(5[1-5]|2(2[2-9][1-9]|2[3-9]|[3-6]|7[01]|720))/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^(6011|65|64[4-9])/.test(d)) return 'discover';
  return 'unknown';
}

export const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  unknown: 'Card',
};

export function formatCardNumber(raw: string): string {
  const brand = detectBrand(raw);
  const d = digitsOnly(raw).slice(0, brand === 'amex' ? 15 : 19);
  // American Express groups as 4-6-5, everything else in fours.
  if (brand === 'amex') {
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(' ');
  }
  return d.replace(/(.{4})/g, '$1 ').trim();
}

function luhn(d: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = Number(d[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

export function isValidCardNumber(raw: string): boolean {
  const d = digitsOnly(raw);
  const brand = detectBrand(d);
  const lengthOk = brand === 'amex' ? d.length === 15 : d.length >= 13 && d.length <= 19;
  return lengthOk && luhn(d);
}

// Shows "MM / YY". The slash only appears once a third digit is typed, so backspacing never gets stuck
// on it. A first digit of 2-9 is a month that needs a leading zero.
export function formatExpiry(raw: string): string {
  let d = digitsOnly(raw).slice(0, 4);
  if (d.length === 1 && Number(d) > 1) d = `0${d}`;
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
}

export function isValidExpiry(value: string, now = new Date()): boolean {
  const d = digitsOnly(value);
  if (d.length !== 4) return false;
  const month = Number(d.slice(0, 2));
  const year = 2000 + Number(d.slice(2));
  if (month < 1 || month > 12) return false;
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;
  return year > thisYear || (year === thisYear && month >= thisMonth);
}

export function isValidCvc(value: string, brand: CardBrand): boolean {
  const d = digitsOnly(value);
  return brand === 'amex' ? d.length === 4 : d.length === 3 || d.length === 4;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
] as const;

export function isValidPostalCode(value: string, country: string): boolean {
  const v = value.trim();
  if (country === 'US') return /^\d{5}(-\d{4})?$/.test(v);
  return v.length >= 3 && v.length <= 10;
}
