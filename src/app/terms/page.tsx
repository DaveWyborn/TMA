import Link from "next/link";
import NavBar from "../../components/NavBar";
import FooterSection from "../../components/FooterSection";

export const metadata = {
  title: "Terms & Conditions | Tailor Made Analytics",
  description:
    "Standard Terms & Conditions for all services provided by Tailor Made Analytics.",
};

const sections = [
  {
    num: "01",
    head: "Introduction",
    body: "These Terms & Conditions govern the use of services provided by Tailor Made Analytics. By engaging our services, you agree to be bound by these terms unless otherwise specified in a separate written agreement.",
  },
  {
    num: "02",
    head: "Services provided",
    body: "Tailor Made Analytics provides analytics implementation, tracking setup, consent management, and monitoring services. Specific deliverables vary based on project scope and will be confirmed in writing.",
  },
  {
    num: "03",
    head: "Payment terms",
    body: "All services are billed monthly unless otherwise agreed in writing. A secure payment link is provided, and payment is processed via Stripe — by card or direct debit. Payment must be made in full by the due date specified on the invoice. Services may be suspended in the event of late or non-payment.",
  },
  {
    num: "04",
    head: "Liability",
    body: "We take all reasonable care in delivering services but do not guarantee uninterrupted or error-free performance. We are not responsible for indirect, consequential, or incidental damages arising from the use of our services.",
  },
  {
    num: "05",
    head: "Modifications",
    body: "We may update these Terms & Conditions at any time. Continued use of our services implies acceptance of the updated terms.",
  },
  {
    num: "06",
    head: "Project-specific terms",
    body: "For certain projects, tailored Terms & Conditions may apply and will be provided in writing. If you require a custom version, contact us directly.",
  },
];

export default function TermsPage() {
  return (
    <>
      <NavBar />

      <main
        className="px-6 md:px-12 pt-16 md:pt-24 pb-24"
        style={{ background: "var(--paper)" }}
      >
        <div className="max-w-3xl">
          <p className="brand-tag" style={{ marginBottom: "1.5rem" }}>
            Legal <span className="dot">·</span> Terms
          </p>
          <h1
            className="display"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              marginBottom: "0.75rem",
            }}
          >
            Terms &amp; Conditions
          </h1>
          <p
            className="label-mono"
            style={{
              marginBottom: "3rem",
              textTransform: "none",
              letterSpacing: "0.04em",
            }}
          >
            Effective 14 July 2025
          </p>

          <div
            className="hairline"
            style={{ borderTop: "1px solid var(--hairline)" }}
          >
            {sections.map((s) => (
              <div
                key={s.num}
                className="hairline"
                style={{
                  borderBottom: "1px solid var(--hairline)",
                  padding: "2rem 0",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                  <div className="md:col-span-1">
                    <span
                      className="num-tag"
                      style={{ fontSize: "20px" }}
                    >
                      {s.num}
                    </span>
                  </div>
                  <div className="md:col-span-11">
                    <h2
                      className="display"
                      style={{ fontSize: "20px", marginBottom: "0.5rem" }}
                    >
                      {s.head}
                    </h2>
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: 1.65,
                        color: "var(--ink-soft)",
                        maxWidth: "62ch",
                      }}
                    >
                      {s.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem" }}>
            <p className="brand-tag" style={{ marginBottom: "0.75rem" }}>
              Contact
            </p>
            <p style={{ fontSize: "15px", lineHeight: 1.65, color: "var(--ink)" }}>
              Dave Wyborn —{" "}
              <a
                href="mailto:dave@tailormadeanalytics.com"
                className="signal-link"
              >
                dave@tailormadeanalytics.com
              </a>
            </p>
          </div>

          <div
            style={{
              marginTop: "4rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <Link href="/" className="signal-link" style={{ fontSize: "15px" }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </main>

      <FooterSection />
    </>
  );
}
