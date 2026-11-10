// All written copy for the marketing page, kept out of the components so it can be edited (or
// translated) in one place. It describes the intended behaviour of the live payment page: confirm each
// statement against the real payment provider before launch.

import { SUPPORT_MAILTO } from './site';

export const NAV = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#security', label: 'Security' },
  { href: '#after-you-pay', label: 'After you pay' },
  { href: '#help', label: 'Help' },
  { href: '#faq', label: 'FAQ' },
] as const;

export const ANNOUNCEMENTS = [
  'Secure checkout for merchant payments',
  'Your order total is fixed and can’t be edited from this page',
  'Cards and wallets accepted, no account needed',
  'Card details are entered in secure, encrypted fields',
] as const;

// Facts shown on the hero's left rail.
export const HERO_FACTS = [
  'Encrypted card entry',
  'No account required',
  'Total set by your order',
  'Straight back to the merchant',
  'Receipt by email',
] as const;

// The scrolling strip docked to the bottom of the hero.
export const MARQUEE_ITEMS = [
  ['Cards', 'accepted'],
  ['Wallets', 'where supported'],
  ['3-D Secure', 'ready'],
  ['No account', 'needed'],
  ['Encrypted', 'end to end'],
  ['Straight back', 'to the merchant'],
] as const;

export const STEPS = [
  {
    tag: 'Step 01',
    title: 'Check out',
    body: 'Build your order on the merchant’s own website and continue to payment. Your total, shipping and any discount included, is fixed the moment the order is created.',
  },
  {
    tag: 'Step 02',
    title: 'Pay here',
    body: 'You arrive with a one-time payment reference, the merchant’s name and the amount due. Enter your card or choose a wallet, then complete any verification your bank asks for.',
  },
  {
    tag: 'Step 03',
    title: 'Confirmed',
    body: 'Once the payment clears you are sent straight back to the merchant with your confirmation. Their order email follows.',
  },
] as const;

export const SECURITY_POINTS = [
  {
    title: 'Card data goes straight to the processor',
    tag: 'Hosted secure fields',
    body: 'The card fields you type into are served by our PCI-compliant payment processor in a secure frame. Your full card number never passes through this site or the merchant’s website.',
  },
  {
    title: 'Your bank can step in',
    tag: '3-D Secure ready',
    body: 'Extra verification runs whenever your card issuer asks for it, so a stolen card number on its own is not enough to complete a purchase.',
  },
  {
    title: 'The amount can’t be edited',
    tag: 'Set by the order',
    body: 'The merchant’s server sets the total when your order is created. Nothing in the page address or in your browser can change what you are charged.',
  },
  {
    title: 'Encrypted, and never indexed',
    tag: 'HTTPS everywhere',
    body: 'Every request between your browser and this page is encrypted in transit. Each payment link belongs to one order, and these pages are kept out of search results.',
  },
] as const;

export const AFTER_PAY_STEPS = [
  {
    time: 'Instantly',
    title: 'Payment confirmed',
    body: 'You see a confirmation on screen and are returned to the merchant with your order reference.',
  },
  {
    time: 'Within minutes',
    title: 'Receipt by email',
    body: 'A receipt is sent to the address you used at checkout. Check your spam folder if it is slow to arrive.',
  },
  {
    time: 'From the merchant',
    title: 'Order confirmation',
    body: 'The merchant sends its own order email and prepares your order under its own shipping and delivery policies.',
  },
  {
    time: 'If you need it',
    title: 'Refunds',
    body: 'Refunds follow the merchant’s policy and go back to the original payment method. Banks usually need several business days to show the credit.',
  },
] as const;

export const PAYMENT_METHOD_NOTES = [
  'Credit and debit cards',
  'Apple Pay and Google Pay, where your device supports them',
  'Bank verification through 3-D Secure, when your issuer asks for it',
] as const;

export const TROUBLESHOOTING = [
  {
    problem: 'My card was declined',
    tip: 'Try another card, or ask your bank to approve it',
    answer:
      'Banks decline for many reasons, and an unfamiliar online merchant is a common one. Try a different card, or ask your bank to approve the charge, then retry from the same payment link.',
  },
  {
    problem: 'I was charged but saw no confirmation',
    tip: 'Wait a few minutes and check your spam folder',
    answer:
      'Give it a few minutes and check your inbox and spam folder. A pending hold can show on your statement before the order is confirmed. If nothing arrives, contact the merchant with your order number.',
  },
  {
    problem: 'I think I paid twice',
    tip: 'Have your order number ready when you write',
    answer:
      'Contact the merchant with your order number, or email us and we will help trace it. A genuine duplicate charge is refunded to the original payment method.',
  },
  {
    problem: 'I need a refund',
    tip: 'Credits can take several business days to show',
    answer:
      'Refunds follow the policy of the merchant you bought from, and go back to the original payment method. Banks usually need several business days to show the credit.',
  },
] as const;

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is PayPrimeTime?',
    answer:
      'It is a hosted payment page. Merchants send customers here to pay for an order, so card entry happens in one secure place. It does not sell anything itself.',
  },
  {
    question: 'Who exactly am I paying?',
    answer:
      'The merchant named at the top of the payment page, and the same name appears on your order summary. If a payment page does not clearly name a merchant, do not pay and contact us.',
  },
  {
    question: 'Why did checkout send me to another address?',
    answer:
      'Card entry lives on its own page so it is kept apart from the merchant’s website. It is the same reason most online stores hand off to a dedicated payment screen.',
  },
  {
    question: 'Do I need an account?',
    answer:
      'No. Everything here is tied to the order you just placed. There is nothing to sign up for and nothing to remember afterwards.',
  },
  {
    question: 'Which payment methods can I use?',
    answer:
      'The options available to you appear on the payment page itself. Cards are supported, and wallets such as Apple Pay or Google Pay show up when your device and bank support them.',
  },
  {
    question: 'Do you keep my card details?',
    answer:
      'No. They are entered into secure fields run by the payment processor and handled there. Neither this site nor the merchant ever sees the full number.',
  },
  {
    question: 'Can I change my order from here?',
    answer:
      'Not on this page. Your total is fixed when the order is created. If something needs to change, go back to the merchant’s website and start the order again.',
  },
  {
    question: 'My payment link says it is unavailable',
    answer:
      'Each link belongs to a single order and stops working once that order is paid or cancelled. Return to the merchant and begin checkout again, or contact us if you think it is a mistake.',
  },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Payments',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Security', href: '#security' },
      { label: 'After you pay', href: '#after-you-pay' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help with a payment', href: '#help' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact support', href: SUPPORT_MAILTO },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refunds & disputes', href: '/refunds' },
    ],
  },
] as const;
