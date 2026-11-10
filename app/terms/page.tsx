import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';
import { LEGAL_OPERATOR } from '@/lib/legal';
import { SITE, SUPPORT_MAILTO } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that apply when you use a PayPrimeTime payment page.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage
      current="/terms"
      title="Terms of Service"
      summary="These terms apply when you use a PayPrimeTime payment page to pay for an order. They are short on purpose: what this service is, what it is not, and how payments work."
    >
      <LegalSection id="about" title="1. What PayPrimeTime is">
        <p>
          PayPrimeTime provides hosted payment pages (the &ldquo;Service&rdquo;). A merchant sends you to a PayPrimeTime
          page with an order, you pay for that order on the page, and you are then returned to the merchant.
        </p>
        <p>
          PayPrimeTime is not a seller. We do not sell, ship or support any goods or services, we do not set prices, and
          we are not a party to the sale between you and the merchant.
        </p>
        {LEGAL_OPERATOR.entity && (
          <p>
            The Service is operated by <strong>{LEGAL_OPERATOR.entity}</strong>
            {LEGAL_OPERATOR.address ? `, ${LEGAL_OPERATOR.address}` : ''}. References to &ldquo;we&rdquo; and &ldquo;us&rdquo; mean that operator.
          </p>
        )}
      </LegalSection>

      <LegalSection id="merchant" title="2. Who you are paying">
        <p>
          Every payment page shows the name of the merchant, the order number and the total before you enter any payment
          details. The merchant named on the page is the seller of that order and is responsible for it: the products or
          services, delivery, returns, cancellations and its own terms and policies.
        </p>
        <p>
          Questions about what you ordered should go to the merchant. We can help with the payment itself: a payment
          that did not go through, a payment you do not recognise, or a page that does not work.
        </p>
      </LegalSection>

      <LegalSection id="use" title="3. Using the Service">
        <p>By using a payment page you confirm that:</p>
        <ul>
          <li>you are at least 18, or the age of majority where you live, and able to enter into these terms;</li>
          <li>the order is yours, and you are allowed to use the card, wallet or other payment method you enter;</li>
          <li>the details you provide are accurate.</li>
        </ul>
        <p>You agree not to:</p>
        <ul>
          <li>use a payment method that is not yours, or use the Service to commit fraud or any unlawful act;</li>
          <li>test, probe or attack the Service, or try to get around its security or limits;</li>
          <li>use automated tools to open payment pages or submit payments, other than as the merchant&rsquo;s own checkout does;</li>
          <li>interfere with other people&rsquo;s use of the Service.</li>
        </ul>
        <p>We may refuse or stop a payment, or restrict access, if we reasonably suspect any of the above.</p>
      </LegalSection>

      <LegalSection id="payments" title="4. Payments and amounts">
        <p>
          The amount is set by the merchant when the order is created and cannot be changed on the payment page. We do
          not add any fee to it. Your card issuer may apply its own charges, such as for a foreign currency.
        </p>
        <p>
          When you press the pay button you authorise a charge of the total shown to the payment method you entered. Your
          bank or card issuer decides whether to approve a payment, and may ask you to confirm it (for example with 3-D
          Secure). A payment can be declined; if so, you are not charged.
        </p>
        <p>
          Card and wallet payments are processed by Stripe. Stripe&rsquo;s own terms and{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
            privacy policy
          </a>{' '}
          apply to its processing. Your card details are entered into secure fields provided by Stripe and do not pass
          through our servers.
        </p>
      </LegalSection>

      <LegalSection id="confirmation" title="5. Confirmation and receipts">
        <p>
          After a successful payment the page confirms it and then returns you to the merchant. If the merchant gave us
          your email address, a payment receipt may be emailed to you.
        </p>
        <p>
          A confirmation here means the payment was accepted. The merchant remains responsible for fulfilling the order
          and for contacting you about it.
        </p>
      </LegalSection>

      <LegalSection id="refunds" title="6. Refunds, cancellations and disputes">
        <p>
          The merchant decides whether to refund or cancel an order. How refunds and disputes work is explained on the{' '}
          <a href="/refunds">Refunds &amp; disputes</a> page.
        </p>
      </LegalSection>

      <LegalSection id="availability" title="7. Availability">
        <p>
          We work to keep the Service available, but we do not promise it will always be uninterrupted or error free. We
          may pause or change the Service, for example for maintenance or security reasons. A payment link belongs to one
          order and stops working once that order is paid or cancelled.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="8. Our responsibility">
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the extent the law allows, we are
          not responsible for the goods or services you buy from a merchant, for anything a merchant does or fails to do,
          or for losses that we could not reasonably have foreseen.
        </p>
        <p>
          To the extent the law allows, our total liability to you for any claim connected with a payment is limited to
          the amount of that payment. Nothing in these terms limits any right you have by law that cannot be limited,
          including consumer rights where you live.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="9. Changes to these terms">
        <p>
          We may update these terms. The version on this page when you pay is the one that applies to that payment, and
          the date at the top shows when it last changed.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact">
        <p>
          Questions about these terms or a payment: <a href={SUPPORT_MAILTO}>{SITE.supportEmail}</a>. Please include the
          order number shown on the payment page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
