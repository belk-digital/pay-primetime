# PayPrimeTime

A hosted payment page where merchant orders are paid, intended to live at `payprimetime.com`. A merchant sends a
customer here with an order, the customer pays, sees the confirmation here, and is then sent back to the merchant.
The page always names the merchant, the order and the amount before any card detail is entered. It sells nothing
itself.

It follows the structure of the Veracue payment site (`VeracuePayments`) and the visual language of the PrimeTime brand.

Next.js 15 (App Router), React 19, Tailwind 4, TypeScript, framer-motion, Lenis, Stripe (Payment Element).

```bash
cp .env.example .env.local     # then fill it in, see "Configuration"
npm install
npm run dev                    # http://localhost:3100
npm run typecheck
npm run build
```

## How a payment works

```
 store                         this site                                Stripe
   |  1. order saved (pending)
   |--- POST /api/payments/create (Bearer secret) ----->|  2. PaymentIntent created (idempotent)
   |<-- { paymentIntentId } ----------------------------|
   |  3. browser sent to  /pay?pi=pi_...
   |                                                    |  4. card form (Payment Element), 3-D Secure if needed
   |                                                    |--------------------------------------------> pay
   |                                      /return?pi=...|<------------------------------------------- redirect
   |                                                    |  5. confirmation shown HERE, 8 s countdown
   |<-- browser sent on to the store's order page ------|
   |--- POST /api/payments/status (Bearer secret) ----->|  6. store re-reads the payment from Stripe and
   |<-- { status, amount, metadata } -------------------|     marks the order paid only if it matches
   |
   |<-- POST {store}/api/webhooks/payprimetime ---------|  backup: Stripe webhook -> this site -> a ping to the
        { orderId, eventType }                          |  store. A ping is only a nudge; the store always
                                                        |  re-verifies with /status. A forged ping changes nothing.
```

Design rules that the code relies on:

- **The amount comes from the store, server to server.** Never from the address of the pay page.
- **The pay link carries only the PaymentIntent id.** Everything shown (seller, order number, total) is read back from
  Stripe. A paid link shows "already paid", it never shows a second card form.
- **The store's address is never stored on the payment.** Metadata holds an *index* into the registered store origins
  (`SHOP_URL`, `SHOP_ALT_URLS`) plus a path, so a customer can only ever be sent back to a registered store (no open
  redirect). The Stripe client secret is never passed on to the store.
- **Idempotent create.** The idempotency key is derived from order + amount + currency, so a retry gets the same
  PaymentIntent; a different amount for the same order gets a different one (the store rejects that mismatch).
- **Fails closed.** If anything is missing or unreadable the page says so; it never pretends a payment succeeded.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Explainer page: hero with a sample checkout, How it works, Security, After you pay, Help, FAQ, footer |
| `/pay?pi=` | The checkout: dark order summary (left, order number + total) + Stripe payment form (right) |
| `/return?pi=` | Where Stripe returns the customer: confirmed (with countdown back to the store), processing, or failed |
| `/terms`, `/privacy`, `/refunds` | Legal pages: Terms of Service, Privacy Policy, Refunds & disputes. Linked from the footer, the return page and under the pay button |
| `POST /api/payments/create` | Store -> this site. Creates the PaymentIntent. Bearer `PAYPRIMETIME_API_SECRET` |
| `POST /api/payments/status` | Store -> this site. Returns the real payment state from Stripe. Bearer secret |
| `POST /api/webhooks/stripe` | Stripe -> this site. Signature verified. Pings the store, never decides anything |
| `404`, error boundary | Share the same status screen |

## Configuration

All variables are documented in `.env.example`. `.env.local` is git-ignored; never commit keys.

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `sk_test_` / `pk_test_` until go-live |
| `STRIPE_WEBHOOK_SECRET` | Signing secret (`whsec_`) of the webhook endpoint. Test and live each have their own |
| `SHOP_NAME` | The real seller, shown to customers. It must be truthful |
| `SHOP_URL`, `SHOP_ALT_URLS` | Registered store addresses; the only places a customer is returned to |
| `SHOP_SUPPORT_EMAIL`, `SHOP_STATEMENT_DESCRIPTOR` | Optional, shown on the page. The card statement text itself is set in the Stripe Dashboard |
| `PAYPRIMETIME_API_SECRET` | Shared secret with the store. **Same value** in the store's environment |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3100` locally, `https://payprimetime.com` in production |
| `NEXT_PUBLIC_PAYMENTS_LIVE` | `true` = real Stripe pages. Anything else = design preview with a sample order, nothing charged |
| `NEXT_PUBLIC_LEGAL_ENTITY`, `NEXT_PUBLIC_LEGAL_ADDRESS` | Optional. The operating business, shown on the Terms and Privacy pages only when set |

## Legal pages

`app/terms`, `app/privacy` and `app/refunds` share `components/legal/legal-page.tsx`; the wording is written inline in
each page and the date comes from `lib/legal.ts` (`LEGAL_UPDATED`: change it whenever the wording changes). They are
written about "the merchant" in general and name no particular store. They describe what this site actually does (no
account, no database, no analytics or advertising cookies, card details handled only by Stripe), so re-read them if
that ever changes. They are a sound starting point, not legal advice: have them checked before launch, and set the
two `NEXT_PUBLIC_LEGAL_*` variables so the operator is named. There is deliberately no governing-law clause, because
that depends on where the operator is established.

If `NEXT_PUBLIC_PAYMENTS_LIVE=true` but Stripe or the store is not configured, the pay page reports the payment as
unavailable instead of rendering a form.

## Testing locally (nothing is charged, no real emails)

1. Put **test** keys in `.env.local`. Use Stripe's test cards: `4242 4242 4242 4242` (succeeds),
   `4000 0025 0000 3155` (3-D Secure), `4000 0000 0000 9995` (declined). Any future expiry, any CVC.
2. Forward Stripe's webhooks: `stripe listen --forward-to localhost:3100/api/webhooks/stripe`, and copy the `whsec_`
   it prints into `STRIPE_WEBHOOK_SECRET`.
3. Run this site (`npm run dev`, port 3100) and the store (port 3000). In the store set
   `NEXT_PUBLIC_PAYPRIMETIME_CHECKOUT_URL=http://localhost:3100/pay`, `PAYPRIMETIME_API_BASE_URL=http://localhost:3100/api`,
   the same `PAYPRIMETIME_API_SECRET`, and `DISABLE_EMAILS=true` so no customer or admin email is sent while testing.
4. Check out in the store with the card method.

`/pay` without a `pi` is not a sample page in live mode; to see the design preview set `NEXT_PUBLIC_PAYMENTS_LIVE=false`
and open `/pay`, `/pay?state=incomplete | not-found | invalid | paid | canceled`, or
`/return?status=succeeded | processing | failed`.

## The store side

The store has a matching integration (in the store repository, not here):

- `lib/orders/payprimetimeGateway.ts` calls `create` and `status`, and checks that the amount Stripe holds equals the
  order total before an order is marked paid.
- `app/checkout/payprimetimeActions.ts` creates the order, reserves stock, calls `create` and redirects.
- `app/api/webhooks/payprimetime/route.ts` receives the pings and re-verifies with `status`.
- `app/api/cron/expire-unpaid-orders/route.ts` (daily) cancels abandoned card orders after 3 days and releases their stock;
  an order that was in fact paid is marked paid instead of cancelled.
- `app/order-confirmation/[id]/page.tsx` re-verifies on every visit; a `?redirect_status=succeeded` in the address proves
  nothing.
- **Who may open that page:** order ids are sequential, so the id alone is not enough. Every link to the page carries a
  token (`?k=`, an HMAC of the id with `PAYLOAD_SECRET`; `lib/orders/accessToken.ts`): the redirect after checkout, the
  return from this site (the path and query are kept on the payment, and the store address is not), and the "View Order
  Status" button in the order emails. A signed-in customer can also open their own orders without it. Anyone else, and any
  order that does not exist, gets the same "Order Link Not Valid" page. Rotating `PAYLOAD_SECRET` invalidates old links.
- `db/2026-11-11-card-payments.sql` adds the `payprimetime` payment method and the payment-reference column to `orders`.
  Plain additive SQL on purpose: the database was built by Payload's dev "push", and `payload migrate` would offer to wipe
  it. Run it before deploying. Set `PAYLOAD_DB_PUSH=false` whenever a dev server points at a shared or live database.

## Design system

Tokens live in `app/globals.css` under `@theme`.

- **Surfaces:** black `#000`, `#020202`, `#0a0a0a`, `#0b0b0b`, `#111`, panels `#181818`. Content sections alternate with
  light gray (`gray-50`).
- **Accent:** indigo -> purple. The indigo, purple and gray ramps are pinned to the Tailwind v3 hex values the brand is
  built on (Tailwind 4 ships different oklch values), so colours match exactly.
- **Type:** Syncopate (UI, nav, buttons, labels), Michroma (headings, uppercase, wide tracking), Inter (reading text and
  form fields). Loaded with `next/font/google`.
- **Shapes:** `rounded-lg` caps buttons, `rounded-2xl` / `3xl` cards, a translucent blurred header, a large gradient
  wordmark in the footer.
- **Motion:** entrance (rise 40px + fade, `power3.out`), orbiting silver rings, scroll-linked marquee type, a header that
  hides on scroll-down, Lenis smooth scrolling. Lenis only runs on `/`; the payment screens keep native scrolling.
  Everything is disabled under `prefers-reduced-motion`, and content is fully visible without JS.
- **Assets:** the logo (`public/pay-primetime-logo.webp`, transparent padding trimmed; a PNG copy is used only for the
  link-preview image, which cannot read WebP), the "P" mark cropped from the same artwork (`public/mark.webp`, the
  favicon and touch icon in `app/`), and an abstract white wave texture (`public/wave.webp`). The logo is white/silver,
  so it is for dark surfaces. There are no photographs. All other artwork (cards, shield, step illustrations, rings)
  is original SVG/CSS in `components/art`.

## Structure

```
app/
  page.tsx                  explainer page
  pay/                      page.tsx (server) + pay-client, order-summary, stripe-payment-form, payment-form (preview)
  return/page.tsx           post-payment screen: reads the payment from Stripe, countdown back to the store
  api/payments/             create, status  (store -> this site, bearer secret)
  api/webhooks/stripe/      Stripe -> this site (signature verified)
  layout.tsx, globals.css   fonts, metadata (noindex), design tokens
components/
  ui/                       button, reveal, field, logo, section-heading, smooth-scroll
  layout/                   site-header, site-footer, payment-badges, back-to-top
  sections/                 hero, how-it-works, security, after-you-pay, help (+ help-card), faq, cta-banner (+ cta-orb)
  status/                   status-screen (shared screen), auto-redirect (countdown)
  art/                      backdrops, payment-card, step-art, shield-art
lib/
  stripe.ts                 Stripe client
  merchant.ts               the registered store (from env), bearer auth, return-URL encode/decode
  payments.ts               loads a pay link / return from Stripe
  order.ts                  order + merchant model, preview order
  payment-gateway.ts        preview-mode stub (live payments use the Payment Element directly)
  site.ts, content.ts       identity, support email, page copy
  format.ts                 money + card-field helpers
```

## Deployment (payprimetime.com)

- Add `payprimetime.com` (and `www`, redirecting to the apex) to the host. `NEXT_PUBLIC_SITE_URL` must be
  `https://payprimetime.com`.
- Set every variable from `.env.example` on the host (Production) with the **live** Stripe keys, then redeploy:
  variables only apply to new builds.
- In the Stripe Dashboard add the webhook endpoint `https://payprimetime.com/api/webhooks/stripe` with the events
  `payment_intent.succeeded`, `payment_intent.payment_failed` and `charge.refunded`, and put its signing secret in
  `STRIPE_WEBHOOK_SECRET`. The test-mode secret from `stripe listen` does not work in live mode.
- On the store: `NEXT_PUBLIC_PAYPRIMETIME_CHECKOUT_URL=https://payprimetime.com/pay`,
  `PAYPRIMETIME_API_BASE_URL=https://payprimetime.com/api` (note the `/api`: the store appends `/payments/create`), the same `PAYPRIMETIME_API_SECRET`, a `CRON_SECRET`, and
  `DISABLE_EMAILS` unset. `SHOP_URL` here must be the store's public address (plus its `www` variant in `SHOP_ALT_URLS`).
- `support@payprimetime.com` is a placeholder mailbox and must exist before launch.
- **Search engines:** the whole site is `noindex`. Every response carries `X-Robots-Tag: noindex, nofollow, noarchive,
  noimageindex` (`next.config.mjs`), every page carries the same meta tag, and there is no sitemap. `robots.txt` leaves
  pages crawlable so a crawler can read the noindex.
- **Link previews:** `app/opengraph-image.tsx` draws the Open Graph / Twitter image.
- Security headers (frame denial, referrer policy, permissions policy) are set in `next.config.mjs`.
- Stripe reviews the business behind the account and what it sells before live payments are enabled; the checkout
  names the real seller and the statement descriptor should match the Dashboard's public details.
