import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';
import { LEGAL_OPERATOR } from '@/lib/legal';
import { SITE, SUPPORT_MAILTO } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What information PayPrimeTime handles when you pay on a payment page, and why.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      current="/privacy"
      title="Privacy Policy"
      summary="This policy explains what information is handled when you pay on a PayPrimeTime payment page, who it is shared with, and the choices you have."
    >
      <LegalSection id="scope" title="1. Scope">
        <p>
          This policy covers PayPrimeTime payment pages: the page where you enter your payment details and the page that
          confirms the result. The merchant you are paying has its own privacy policy for what it holds about you and
          your order, and that is separate from this one.
        </p>
        {LEGAL_OPERATOR.entity && (
          <p>
            The Service is operated by <strong>{LEGAL_OPERATOR.entity}</strong>
            {LEGAL_OPERATOR.address ? `, ${LEGAL_OPERATOR.address}` : ''}.
          </p>
        )}
      </LegalSection>

      <LegalSection id="information" title="2. Information we handle">
        <ul>
          <li>
            <strong>Order details from the merchant.</strong> The order number, the amount, the currency, a short
            description (such as the order number) and, when the merchant provides it, your email address so a receipt
            can be sent.
          </li>
          <li>
            <strong>Payment details you enter.</strong> Your card number, expiry date and security code are typed into
            secure fields provided by Stripe and go from your browser straight to Stripe. They do not pass through our
            servers and we never see or store them. Stripe may also ask for other details depending on the method you
            use, such as a postal code, or an email address and phone number if you use a wallet or a saved-payment
            service.
          </li>
          <li>
            <strong>Technical information.</strong> Like any website, our hosting records your IP address, browser and
            device type, the pages requested and the time. Stripe also collects device and browser information on the
            payment page to detect fraud.
          </li>
          <li>
            <strong>Messages to support.</strong> If you write to us, your email address and what you tell us.
          </li>
        </ul>
        <p>
          We do not ask you to create an account, and we do not keep a customer database. We do not knowingly collect
          anything beyond what is listed above.
        </p>
      </LegalSection>

      <LegalSection id="use" title="3. How we use it">
        <ul>
          <li>to show the payment page and take the payment you ask us to take;</li>
          <li>to confirm the result to you and to tell the merchant whether the order was paid, failed or refunded;</li>
          <li>to prevent fraud and abuse and keep the Service secure;</li>
          <li>to answer your messages and fix problems with a payment;</li>
          <li>to meet legal and accounting obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection id="sharing" title="4. Who we share it with">
        <ul>
          <li>
            <strong>Stripe</strong>, our payment processor, which handles your payment details and decides on fraud
            checks. Stripe acts under its own{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
              privacy policy
            </a>
            .
          </li>
          <li>
            <strong>The merchant</strong> you are paying: the order reference, the amount and whether the payment
            succeeded, failed or was refunded. Never your card details.
          </li>
          <li>
            <strong>Service providers</strong> that host and secure the Service, only as needed to run it.
          </li>
          <li>
            <strong>Authorities and advisers</strong> when the law requires it, or to protect our rights and the safety
            of others.
          </li>
        </ul>
        <p>We do not sell your personal information and we do not share it for advertising.</p>
      </LegalSection>

      <LegalSection id="cookies" title="5. Cookies and tracking">
        <p>
          Our pages do not use advertising or analytics cookies or trackers. The Stripe payment fields on the payment page
          may use cookies or similar technology to work and to detect fraud; see Stripe&rsquo;s privacy policy for details.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="6. How long we keep it">
        <p>
          Records of payments are held by Stripe for as long as payment processing and the law require. Hosting logs are
          kept for a limited period by our hosting provider. Messages you send to support are kept for as long as needed
          to help you and to keep a record of it.
        </p>
      </LegalSection>

      <LegalSection id="security" title="7. Security">
        <p>
          Pages are served over an encrypted connection, and card details are handled by Stripe, which is certified to the
          PCI DSS standard for card data. No system is perfectly secure, which is one reason we keep what we handle to a
          minimum.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="8. Your choices and rights">
        <p>
          Depending on where you live, you may have the right to ask what we hold about you, to have it corrected or
          deleted, to restrict or object to how it is used, and to complain to your data protection authority. Write to us
          at <a href={SUPPORT_MAILTO}>{SITE.supportEmail}</a> and we will respond.
        </p>
        <p>
          Information the merchant holds about your order is controlled by the merchant, and information held by Stripe is
          controlled by Stripe; for those, contact them directly.
        </p>
      </LegalSection>

      <LegalSection id="transfers" title="9. Where it is processed">
        <p>
          Stripe and our service providers may process information in countries other than your own, including the United
          States. Where the law requires it, they use recognised safeguards for those transfers.
        </p>
      </LegalSection>

      <LegalSection id="children" title="10. Children">
        <p>The Service is not intended for anyone under 18, and we do not knowingly collect their information.</p>
      </LegalSection>

      <LegalSection id="changes" title="11. Changes to this policy">
        <p>
          If we change how we handle information we will update this page and the date at the top. If a change is
          significant we will make it clear on the payment page.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="12. Contact">
        <p>
          Privacy questions: <a href={SUPPORT_MAILTO}>{SITE.supportEmail}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
