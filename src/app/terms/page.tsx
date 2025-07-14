import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Tailor Made Analytics",
  description: "Read our standard Terms & Conditions for all services provided by Tailor Made Analytics.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 text-left">
      {/* Back to Home */}
      <Link
        href="/"
        className="inline-block mb-6 bg-[var(--accent-soft)] text-white px-4 py-2 rounded hover:bg-[var(--accent)] transition"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <div className="prose prose-invert text-left">
        <p>Effective date: 2025-07-14</p>

        <h3>1. Introduction</h3>
        <p>
          These Terms & Conditions govern the use of services provided by Tailor Made Analytics.
          By engaging our services, you agree to be bound by these terms unless otherwise specified in a separate written agreement.
        </p>

        <h3>2. Services Provided</h3>
        <p>
          Tailor Made Analytics provides analytics implementation, tracking setup, consent management,
          and monitoring services. Specific deliverables may vary based on project scope and will be confirmed in writing.
        </p>

        <h3>3. Payment Terms</h3>
        <p>
  All services are billed monthly unless otherwise agreed in writing.
  A secure payment link will be provided, and payment is processed via Stripe,
  giving you the option to pay by card or direct debit.
</p>
<p>
  Payment must be made in full by the due date specified on your invoice.
  Services may be suspended in the event of late or non-payment.
</p>

        <h3>4. Liability</h3>
        <p>
          We take all reasonable care in delivering services but do not guarantee uninterrupted or error-free performance.
          We are not responsible for indirect, consequential, or incidental damages arising from the use of our services.
        </p>

        <h3>5. Modifications</h3>
        <p>
          We may update these Terms & Conditions at any time.
          Continued use of our services implies acceptance of the updated terms.
        </p>

        <h3>6. Project-Specific Terms</h3>
        <p>
          For certain projects, tailored Terms & Conditions may apply and will be provided in writing.
          If you require a custom version, please contact us directly.
        </p>

        <h3>7. Contact Us</h3>
        <p>
          For questions or to request a custom Terms & Conditions document, please contact:
        </p>
        <p>Name: Dave Wyborn</p>
        <p>Email: dave@tailormadeanalytics.com</p>
        <p>Website: www.tailormadeanalytics.com</p>
      </div>

      {/* Bottom Back to Home */}
      <Link
        href="/"
        className="inline-block mt-12 bg-[var(--accent-soft)] text-white px-4 py-2 rounded hover:bg-[var(--accent)] transition"
      >
        ← Back to Home
      </Link>
    </main>
  );
}
