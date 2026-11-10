'use client';

import { useId, useMemo, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, CreditCard, Info, Lock, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, inputClass } from '@/components/ui/field';
import { PaymentBadges } from '@/components/layout/payment-badges';
import { PayLegalNotice } from '@/components/legal/legal-links';
import {
  BRAND_LABEL,
  COUNTRIES,
  detectBrand,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  formatMoney,
  isValidCardNumber,
  isValidCvc,
  isValidEmail,
  isValidExpiry,
  isValidPostalCode,
} from '@/lib/format';
import { orderTotal, type PaymentOrder } from '@/lib/order';
import { submitPayment, type PaymentDetails } from '@/lib/payment-gateway';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/cn';

type Method = 'card' | 'wallet';

interface Values {
  email: string;
  name: string;
  number: string;
  expiry: string;
  cvc: string;
  country: string;
  postalCode: string;
}

type FieldKey = keyof Values;
type Errors = Partial<Record<FieldKey, string>>;

const INITIAL: Values = { email: '', name: '', number: '', expiry: '', cvc: '', country: 'US', postalCode: '' };

// Top-to-bottom, so a failed submit can send focus to the first field that needs attention.
const CARD_FIELDS: FieldKey[] = ['email', 'name', 'number', 'expiry', 'cvc', 'country', 'postalCode'];

function validate(v: Values, method: Method): Errors {
  const e: Errors = {};
  if (!v.email.trim()) e.email = 'Enter your email so we can send your receipt.';
  else if (!isValidEmail(v.email)) e.email = 'That email address doesn’t look right.';
  if (method === 'wallet') return e;

  if (!v.name.trim()) e.name = 'Enter the name shown on the card.';
  const brand = detectBrand(v.number);
  if (!digitsOnly(v.number)) e.number = 'Enter your card number.';
  else if (!isValidCardNumber(v.number)) e.number = 'That card number isn’t valid. Check it and try again.';
  if (!digitsOnly(v.expiry)) e.expiry = 'Enter the expiry date.';
  else if (!isValidExpiry(v.expiry)) e.expiry = 'This card has expired or the date is invalid.';
  if (!digitsOnly(v.cvc)) e.cvc = 'Enter the security code.';
  else if (!isValidCvc(v.cvc, brand)) e.cvc = brand === 'amex' ? 'Amex codes have 4 digits.' : 'Enter the 3-digit code.';
  if (!v.postalCode.trim()) e.postalCode = v.country === 'US' ? 'Enter your ZIP code.' : 'Enter your postal code.';
  else if (!isValidPostalCode(v.postalCode, v.country)) e.postalCode = v.country === 'US' ? 'Enter a 5-digit ZIP code.' : 'That postal code looks too short.';
  return e;
}

const TABS: Array<{ id: Method; label: string; icon: typeof CreditCard }> = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
];

export function PaymentForm({ order }: { order: PaymentOrder }) {
  const router = useRouter();
  const uid = useId();
  const [method, setMethod] = useState<Method>('card');
  const [values, setValues] = useState<Values>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  const total = formatMoney(orderTotal(order), order.currency);
  const errors = useMemo(() => validate(values, method), [values, method]);
  const brand = detectBrand(values.number);
  const idOf = (k: FieldKey) => `${uid}-${k}`;
  const showError = (k: FieldKey) => (submitted || touched[k] ? errors[k] : undefined);
  const errorCount = Object.keys(errors).length;

  const set = (k: FieldKey) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let next = e.target.value;
    if (k === 'number') next = formatCardNumber(next);
    else if (k === 'expiry') next = formatExpiry(next);
    else if (k === 'cvc') next = digitsOnly(next).slice(0, 4);
    setValues((prev) => ({ ...prev, [k]: next }));
    setSubmitError(null);
  };
  const blur = (k: FieldKey) => () => setTouched((prev) => ({ ...prev, [k]: true }));

  const aria = (k: FieldKey) => ({
    id: idOf(k),
    'aria-invalid': showError(k) ? (true as const) : undefined,
    'aria-describedby': showError(k) ? `${idOf(k)}-error` : undefined,
    onBlur: blur(k),
  });

  async function pay(chosen: Method) {
    setSubmitted(true);
    const current = validate(values, chosen);
    const firstBad = CARD_FIELDS.find((k) => current[k]);
    if (firstBad) {
      // Toggle a class rather than re-keying the card: remounting would drop focus and the inputs.
      setShaking(false);
      requestAnimationFrame(() => setShaking(true));
      window.setTimeout(() => setShaking(false), 450);
      document.getElementById(idOf(firstBad))?.focus();
      return;
    }

    setProcessing(true);
    setSubmitError(null);
    const details: PaymentDetails =
      chosen === 'card'
        ? {
            email: values.email,
            method: 'card',
            card: { name: values.name, number: values.number, expiry: values.expiry, cvc: values.cvc, country: values.country, postalCode: values.postalCode },
          }
        : { email: values.email, method: 'wallet' };

    try {
      const result = await submitPayment(order, details);
      if (result.status === 'failed') {
        setSubmitError(result.message);
        setProcessing(false);
        return;
      }
      // "preview" is what the frontend-only gateway reports; the return page marks it as a preview.
      router.push(`/return?status=${result.status === 'processing' ? 'processing' : 'succeeded'}`);
    } catch {
      setSubmitError('We couldn’t complete that payment. Please try again, or contact support if it keeps happening.');
      setProcessing(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!processing) void pay(method);
  }

  // Arrow keys move between the Card and Wallet tabs, as the tabs pattern expects.
  function onTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next: Method = method === 'card' ? 'wallet' : 'card';
    setMethod(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  }

  const sellerNote = (
    <>
      You are paying <span className="font-semibold text-gray-700">{order.merchant.name}</span>. Its terms and its
      refund and shipping policies apply to this order.
    </>
  );

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Payment details" className="flex flex-col gap-5">
      {!SITE.paymentsLive && (
        <div role="note" className="flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3.5 text-[13px] leading-relaxed text-indigo-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
          <p>
            <span className="font-bold">Interface preview.</span> This page isn&rsquo;t connected to a payment provider
            yet, so no payment is taken and nothing you type is sent or stored.
          </p>
        </div>
      )}

      <div className={cn('rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-8', shaking && 'shake')}>
        {/* Contact */}
        <h2 className="mb-5 border-b border-black/10 pb-4 text-xs font-bold uppercase tracking-widest text-gray-900">Contact</h2>
        <Field id={idOf('email')} label="Email for your receipt" error={showError('email')}>
          <input
            {...aria('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={set('email')}
            className={inputClass(!!showError('email'))}
          />
        </Field>

        {/* Payment method */}
        <h2 className="mb-5 mt-9 flex items-center gap-2 border-b border-black/10 pb-4 text-xs font-bold uppercase tracking-widest text-gray-900">
          <Lock className="h-4 w-4" />
          Payment method
        </h2>

        <div role="tablist" aria-label="Payment method" className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
          {TABS.map((tab) => {
            const active = method === tab.id;
            return (
              <button
                key={tab.id}
                id={`${uid}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`${uid}-panel-${tab.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setMethod(tab.id)}
                onKeyDown={onTabKey}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg py-2.5 font-futuristic text-[11px] font-bold uppercase tracking-wider transition-all duration-300',
                  active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800',
                )}
              >
                <tab.icon className={cn('h-4 w-4 transition-colors', active && 'text-indigo-600')} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {method === 'card' ? (
          <div id={`${uid}-panel-card`} role="tabpanel" aria-labelledby={`${uid}-tab-card`} className="fade-up mt-6 grid grid-cols-2 gap-4">
            <Field id={idOf('name')} label="Name on card" error={showError('name')} className="col-span-2">
              <input {...aria('name')} type="text" autoComplete="cc-name" placeholder="Full name" value={values.name} onChange={set('name')} className={inputClass(!!showError('name'))} />
            </Field>

            <Field id={idOf('number')} label="Card number" error={showError('number')} className="col-span-2">
              <div className="relative">
                <input
                  {...aria('number')}
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 1234 1234 1234"
                  value={values.number}
                  onChange={set('number')}
                  className={cn(inputClass(!!showError('number')), 'tnum pr-24')}
                />
                <span aria-live="polite" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-futuristic text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {brand === 'unknown' ? <CreditCard className="h-4 w-4" aria-hidden /> : BRAND_LABEL[brand]}
                </span>
              </div>
            </Field>

            <Field id={idOf('expiry')} label="Expiry" error={showError('expiry')}>
              <input {...aria('expiry')} type="text" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" maxLength={7} value={values.expiry} onChange={set('expiry')} className={cn(inputClass(!!showError('expiry')), 'tnum')} />
            </Field>

            <Field id={idOf('cvc')} label="Security code" error={showError('cvc')}>
              <input {...aria('cvc')} type="text" inputMode="numeric" autoComplete="cc-csc" placeholder={brand === 'amex' ? '1234' : '123'} maxLength={4} value={values.cvc} onChange={set('cvc')} className={cn(inputClass(!!showError('cvc')), 'tnum')} />
            </Field>

            <Field id={idOf('country')} label="Country or region" className="col-span-2 sm:col-span-1">
              <div className="relative">
                <select id={idOf('country')} autoComplete="country" value={values.country} onChange={set('country')} className={cn(inputClass(), 'appearance-none pr-10')}>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
              </div>
            </Field>

            <Field id={idOf('postalCode')} label={values.country === 'US' ? 'ZIP code' : 'Postal code'} error={showError('postalCode')} className="col-span-2 sm:col-span-1">
              <input {...aria('postalCode')} type="text" inputMode={values.country === 'US' ? 'numeric' : 'text'} autoComplete="postal-code" placeholder={values.country === 'US' ? '12345' : ''} value={values.postalCode} onChange={set('postalCode')} className={inputClass(!!showError('postalCode'))} />
            </Field>
          </div>
        ) : (
          <div id={`${uid}-panel-wallet`} role="tabpanel" aria-labelledby={`${uid}-tab-wallet`} className="fade-up mt-6">
            <p className="text-sm leading-relaxed text-gray-600">
              Apple Pay and Google Pay appear here when your device and bank support them. You confirm with Face ID,
              Touch ID or your device passcode, and no card number is typed.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {['Apple Pay', 'Google Pay'].map((name) => (
                <button
                  key={name}
                  type="button"
                  disabled={processing}
                  onClick={() => void pay('wallet')}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 font-futuristic text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60"
                >
                  <Wallet className="h-4 w-4" />
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Announced to screen readers when a submit is blocked */}
      <p role="status" aria-live="polite" className="sr-only">
        {submitted && errorCount > 0 && method === 'card' ? `${errorCount} ${errorCount === 1 ? 'field needs' : 'fields need'} attention.` : ''}
      </p>

      {submitError && (
        <p role="alert" className="fade-up rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {submitError}
        </p>
      )}

      {method === 'card' && (
        <div>
          <Button type="submit" variant="indigo" size="lg" pill fullWidth loading={processing} icon={<Lock className="h-4 w-4" strokeWidth={2.4} />}>
            {processing ? 'Processing…' : `Pay ${total}`}
          </Button>
          {!SITE.paymentsLive && <p className="mt-3 text-center text-xs text-gray-500">Preview only &mdash; no card will be charged.</p>}
        </div>
      )}

      <p className="text-center text-xs leading-relaxed text-gray-500">{sellerNote}</p>
      <PayLegalNotice className="-mt-3" />

      <div className="flex flex-col items-center gap-4 border-t border-black/10 pt-5 text-gray-400 sm:flex-row sm:justify-between">
        <PaymentBadges className="text-gray-500 [&_li]:opacity-80" />
        <p className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-500" />
          Encrypted checkout
        </p>
      </div>
    </form>
  );
}
