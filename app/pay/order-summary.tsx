'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Lock } from 'lucide-react';
import { GlowField, RingsBackdrop } from '@/components/art/backdrops';
import { BrandLogo } from '@/components/ui/logo';
import { formatMoney } from '@/lib/format';
import { orderSubtotal, orderTotal, type PaymentOrder } from '@/lib/order';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/cn';

// The dark half of the pay page: who is being paid, for what, and exactly how much. On a phone the
// line items fold behind a toggle so the form is never far below the fold.
export function OrderSummary({ order }: { order: PaymentOrder }) {
  const [open, setOpen] = useState(false);
  const money = (n: number) => formatMoney(n, order.currency);
  const subtotal = orderSubtotal(order);
  const total = orderTotal(order);
  const lines = order.lines ?? [];
  const hasLines = lines.length > 0;
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const shipping = order.shippingAmount ?? 0;
  const discount = order.discountAmount ?? 0;

  return (
    <aside
      aria-label="Order summary"
      className="no-scrollbar relative isolate overflow-hidden bg-night text-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
    >
      <GlowField className="-z-10" />
      <RingsBackdrop cx={250} cy={760} className="-z-10 opacity-60" />
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

      <div className="flex min-h-full flex-col justify-between gap-8 px-5 py-6 sm:px-10 sm:py-8 lg:gap-8 lg:px-14 lg:py-9">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="PayPrimeTime home" className="transition-opacity hover:opacity-90">
            <BrandLogo size={40} />
          </Link>
          <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3.5 py-2 font-futuristic text-[10px] font-bold uppercase tracking-wider text-gray-300 backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5 text-indigo-300" />
            <span>
              Secure<span className="hidden sm:inline lg:hidden xl:inline"> payment</span>
            </span>
          </span>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">You&rsquo;re paying</p>
          <p className="mt-2 font-michroma text-lg font-bold uppercase tracking-wider sm:text-xl">{order.merchant.name}</p>

          <p className="tnum mt-5 font-michroma text-[2.4rem] font-bold leading-none tracking-tight sm:text-[3.2rem] lg:text-[3.4rem] xl:text-[3.7rem]">
            {money(total)}
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Order <span className="tnum font-semibold text-gray-300">{order.number}</span>
            {hasLines && (
              <>
                {' '}&middot; {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </>
            )}
          </p>

          {/* Line items (when the order has them). Always open from lg up; a toggle below that. */}
          <div className="mt-6 max-w-md lg:mt-7">
            {hasLines ? (
            <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="order-lines"
              className="flex w-full items-center justify-between border-y border-white/10 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-300 transition-colors hover:text-white lg:hidden"
            >
              {open ? 'Hide order summary' : 'Show order summary'}
              <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', open && 'rotate-180')} />
            </button>

            {/* Collapsed below lg: `invisible` also takes it out of the accessibility tree, and the
                visibility transition holds it visible until the height animation has finished. */}
            <div
              id="order-lines"
              className={cn(
                'grid transition-[grid-template-rows,visibility] duration-300 ease-in-out lg:visible lg:grid-rows-[1fr]',
                open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <ul className="divide-y divide-white/10 lg:border-t lg:border-white/10">
                  {lines.map((line) => (
                    <li key={line.id} className="flex items-start justify-between gap-5 py-4 text-sm">
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{line.name}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {line.detail} &middot; Qty {line.quantity}
                        </p>
                      </div>
                      <span className="tnum shrink-0 text-gray-200">{money(line.unitAmount * line.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <dl className="tnum space-y-2.5 border-t border-white/10 py-4 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <dt>Subtotal</dt>
                    <dd className="text-gray-200">{money(subtotal)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-ok-soft">
                      <dt>{order.discountLabel ?? 'Discount'}</dt>
                      <dd>&minus;{money(discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <dt>Shipping</dt>
                    <dd className="text-gray-200">{shipping === 0 ? 'Free' : money(shipping)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-3.5">
                    <dt className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Total due</dt>
                    <dd className="font-michroma text-lg font-bold text-white">{money(total)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            </>
            ) : (
              <dl className="tnum divide-y divide-white/10 border-t border-white/10 text-sm">
                <div className="flex items-center justify-between py-3.5">
                  <dt className="text-gray-500">Order</dt>
                  <dd className="font-semibold text-gray-200">{order.number}</dd>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <dt className="text-gray-500">Total due</dt>
                  <dd className="font-semibold text-gray-200">{money(total)}</dd>
                </div>
              </dl>
            )}

            <div className={cn('flex items-center justify-between border-t border-white/10 py-3.5 text-sm', hasLines ? 'mt-2 lg:mt-0' : 'border-b')}>
              <span className="text-gray-500">Statement name</span>
              <span className="font-semibold text-gray-200">{order.merchant.statementDescriptor}</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <p className="max-w-sm text-[11px] leading-relaxed text-gray-500">
            {order.merchant.name} is the seller of this order. {SITE.name} is the secure payment page it uses.
          </p>
          <a
            href={order.returnUrl}
            className="group mt-6 inline-flex items-center gap-2 font-futuristic text-[11px] font-medium uppercase tracking-wide text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Cancel and return to {order.merchant.name}
          </a>
        </div>
      </div>
    </aside>
  );
}
