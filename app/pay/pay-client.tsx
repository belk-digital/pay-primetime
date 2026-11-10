'use client';

import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { OrderSummary } from './order-summary';
import { PaymentForm } from './payment-form';
import { StripePaymentForm } from './stripe-payment-form';
import type { PaymentOrder } from '@/lib/order';
import { SITE } from '@/lib/site';

// The pay page: order summary on the left (dark), payment form on the right (light), the same split
// the brand's checkout pattern. From lg down it stacks, summary first.
export function PayClient({ order, live }: { order: PaymentOrder; live?: { clientSecret: string; paymentIntentId: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <OrderSummary order={order} />

      <main id="main-content" className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto w-full max-w-[540px]">
          <h1 className="font-michroma text-2xl font-bold uppercase leading-tight tracking-wider text-gray-900 sm:text-[1.7rem]">
            Payment <span className="text-brand-gradient">details</span>
          </h1>
          <p className="mb-7 mt-3 text-sm leading-relaxed text-gray-600">
            Choose how you&rsquo;d like to pay. Your total can&rsquo;t be changed from this page.
          </p>

          {/* Live: Stripe's hosted card fields. Preview: the stand-in form, which never sends anything. */}
          {live ? (
            <StripePaymentForm order={order} clientSecret={live.clientSecret} paymentIntentId={live.paymentIntentId} />
          ) : (
            <PaymentForm order={order} />
          )}

          <div className="mt-8 flex items-start gap-3 text-xs leading-relaxed text-gray-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <p>
              Card details are encrypted and handled by our payment processor. Neither {order.merchant.name} nor {SITE.name}{' '}
              sees your full card number. Trouble paying?{' '}
              <a className="font-semibold text-gray-800 underline underline-offset-4 transition-colors hover:text-indigo-600" href={`mailto:${SITE.supportEmail}`}>
                {SITE.supportEmail}
              </a>
            </p>
          </div>

          <a
            href={order.returnUrl}
            className="group mt-6 inline-flex items-center gap-2 font-futuristic text-[11px] font-medium uppercase tracking-wide text-gray-500 transition-colors hover:text-gray-900 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Cancel and return to {order.merchant.name}
          </a>
        </div>
      </main>
    </div>
  );
}
