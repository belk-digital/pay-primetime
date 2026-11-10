// What the pay page needs to know about an order. Amounts are in minor units (cents), like every
// payment API, and only turned into display strings by lib/format.ts.
//
// Two sources feed it:
//  - LIVE (NEXT_PUBLIC_PAYMENTS_LIVE=true): lib/payments.ts builds it from the real Stripe PaymentIntent.
//    That only knows the order number and the total, so `lines` is empty.
//  - PREVIEW (the default): resolvePayLink() below serves one built-in sample order, and lets ?state=
//    show the unavailable screens, so the design can be reviewed without any payment provider.

import { SITE } from './site';

export interface OrderLine {
  id: string;
  name: string;
  detail: string;
  quantity: number;
  /** Price of one unit, in minor units. */
  unitAmount: number;
}

/** The merchant being paid. Every checkout names one before the customer pays. */
export interface Merchant {
  name: string;
  /** What the charge will read as on the customer's card statement. */
  statementDescriptor: string;
}

export interface PaymentOrder {
  /** Payment reference carried in the pay link. */
  reference: string;
  /** The order number the customer knows, e.g. "#7013". */
  number: string;
  currency: string;
  merchant: Merchant;
  /** The total due, in minor units. This is what is charged. */
  amount: number;
  /** Optional itemisation, shown when present (the sample order has it; the live page does not). */
  lines?: OrderLine[];
  shippingAmount?: number;
  discountAmount?: number;
  discountLabel?: string;
  /** Where "cancel" and "return to merchant" send the customer: the merchant's own address. */
  returnUrl: string;
}

export function orderSubtotal(order: PaymentOrder): number {
  return (order.lines ?? []).reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);
}

export function orderTotal(order: PaymentOrder): number {
  return order.amount;
}

const SAMPLE_LINES: OrderLine[] = [
  { id: 'l1', name: 'Sample item', detail: 'Size S', quantity: 2, unitAmount: 6400 },
  { id: 'l2', name: 'Sample item', detail: 'Size L', quantity: 1, unitAmount: 14200 },
];

export const PREVIEW_ORDER: PaymentOrder = {
  reference: 'preview',
  number: '#20481',
  currency: 'usd',
  merchant: { name: 'Sample Merchant', statementDescriptor: 'SAMPLE MERCHANT' },
  lines: SAMPLE_LINES,
  shippingAmount: 995,
  discountAmount: 0,
  amount: 27995, // 2 x 64.00 + 142.00 + 9.95 shipping
  // The sample has no real merchant to send the customer back to, so it returns to the home page.
  returnUrl: '/',
};

export type PayLinkState = 'ready' | 'incomplete' | 'not-found' | 'invalid' | 'paid' | 'canceled' | 'processing';

export type PayLink =
  | {
      state: 'ready';
      order: PaymentOrder;
      /** Present on a live payment: what the Stripe card fields need. Absent in preview. */
      live?: { clientSecret: string; paymentIntentId: string };
    }
  | { state: 'paid' | 'canceled' | 'processing'; returnUrl?: string; merchantName?: string }
  | { state: 'incomplete' | 'not-found' | 'invalid' };

const PREVIEWABLE_STATES: ReadonlySet<string> = new Set(['incomplete', 'not-found', 'invalid', 'paid', 'canceled', 'processing']);

// PREVIEW only. In live mode the pay page uses lib/payments.ts and never calls this; if it ever did, it
// would fail closed rather than serve the sample order as if it were real.
export function resolvePayLink(params: { state?: string }): PayLink {
  if (SITE.paymentsLive) return { state: 'not-found' };

  if (params.state && PREVIEWABLE_STATES.has(params.state)) {
    return { state: params.state as 'incomplete' | 'not-found' | 'invalid' | 'paid' | 'canceled' | 'processing' };
  }
  return { state: 'ready', order: PREVIEW_ORDER };
}
