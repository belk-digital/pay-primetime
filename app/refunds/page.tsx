import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';
import { SITE, SUPPORT_MAILTO } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refunds & disputes',
  description: 'How refunds, duplicate charges and card disputes work for payments made on PayPrimeTime.',
  alternates: { canonical: '/refunds' },
};

export default function RefundsPage() {
  return (
    <LegalPage
      current="/refunds"
      title="Refunds & disputes"
      summary="PayPrimeTime takes payment on behalf of the merchant you are paying, so refunds are decided by that merchant. This page explains how to ask, what to expect, and what to do if something looks wrong."
    >
      <LegalSection id="who" title="1. Who decides on a refund">
        <p>
          The merchant named on your payment page is the seller of your order. It sets its own refund, return and
          cancellation policy and decides whether to refund you. PayPrimeTime does not sell, hold or ship anything, so we
          cannot approve a refund on a merchant&rsquo;s behalf.
        </p>
      </LegalSection>

      <LegalSection id="request" title="2. How to ask for a refund">
        <ol className="list-decimal space-y-2 pl-5 marker:text-gray-500">
          <li>Contact the merchant first and give it your order number. You will find it on the confirmation page, in your receipt and in the merchant&rsquo;s own emails.</li>
          <li>
            If you cannot reach the merchant, or you are not getting an answer, write to{' '}
            <a href={SUPPORT_MAILTO}>{SITE.supportEmail}</a> with the order number, the amount, the date and the email
            address you used. We will pass your request on to the merchant and help where we can. We cannot promise a
            refund, because that is the merchant&rsquo;s decision.
          </li>
        </ol>
      </LegalSection>

      <LegalSection id="how" title="3. How refunds are paid">
        <p>
          When a merchant refunds an order, the money goes back to the card or wallet you paid with, in full or in part.
          It is not paid out another way. Once a refund has been issued, your bank usually shows it within 5 to 10
          business days, and some banks take longer.
        </p>
      </LegalSection>

      <LegalSection id="charges" title="4. Charges you do not recognise or twice">
        <p>
          Each payment link belongs to one order and an order can only be paid once, so you should not be charged twice for
          the same order. The payment page shows the name that will appear on your card statement, which may differ from
          the merchant&rsquo;s trading name.
        </p>
        <p>
          If you think you were charged twice, or you do not recognise a charge, write to us straight away at{' '}
          <a href={SUPPORT_MAILTO}>{SITE.supportEmail}</a> with the amount, the date and the last four digits of the card.
          We will look into it and, if it is a mistake, make sure it is put right.
        </p>
      </LegalSection>

      <LegalSection id="failed" title="5. Payments that fail or do not finish">
        <p>
          If your bank declines a payment, or you leave before it is completed, you are not charged. If you were charged
          but the merchant does not show your order as paid, give it a few minutes, because confirmation can take a short
          while to arrive, and then contact us with your order number.
        </p>
      </LegalSection>

      <LegalSection id="disputes" title="6. Disputing a payment with your bank">
        <p>
          You are free to dispute a charge with your card issuer at any time, under its rules. We suggest contacting the
          merchant or us first, because that is usually quicker than a dispute. If you do dispute a payment, the dispute
          is handled through Stripe and the card networks, and the merchant may be asked to provide order information to
          answer it.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="7. Contact">
        <p>
          Payment questions: <a href={SUPPORT_MAILTO}>{SITE.supportEmail}</a>. Please include the order number.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
