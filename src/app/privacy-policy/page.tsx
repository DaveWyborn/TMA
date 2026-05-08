import Link from "next/link";
import Script from "next/script";
import NavBar from "../../components/NavBar";
import FooterSection from "../../components/FooterSection";

export const metadata = {
  title: "Privacy Policy | Tailor Made Analytics",
  description: "How Tailor Made Analytics collects, uses and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <NavBar />

      <main
        className="px-6 md:px-12 pt-16 md:pt-24 pb-24"
        style={{ background: "var(--paper)" }}
      >
        <div className="max-w-3xl">
          <p className="brand-tag" style={{ marginBottom: "1.5rem" }}>
            Legal <span className="dot">·</span> Privacy
          </p>
          <h1
            className="display"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              marginBottom: "0.75rem",
            }}
          >
            Privacy Policy
          </h1>
          <p
            className="label-mono"
            style={{
              marginBottom: "3rem",
              textTransform: "none",
              letterSpacing: "0.04em",
            }}
          >
            Effective 14 July 2025 · Updated 14 July 2025
          </p>

          <div
            className="legal-prose"
            style={{
              fontSize: "15px",
              lineHeight: 1.65,
              color: "var(--ink)",
            }}
          >
            <p style={{ marginBottom: "1.25rem" }}>
              This Privacy Policy explains the policies of Dave Wyborn on the
              collection and use of the information we collect when you access
              www.tailormadeanalytics.com (the &ldquo;Service&rdquo;). This
              Privacy Policy describes your privacy rights and how you are
              protected under privacy laws.
            </p>
            <p style={{ marginBottom: "1.25rem" }}>
              By using our Service, you are consenting to the collection and
              use of your information in accordance with this Privacy Policy.
              Please do not access or use our Service if you do not consent to
              the collection and use of your information as outlined in this
              Privacy Policy.
            </p>
            <p style={{ marginBottom: "2rem" }}>
              Dave Wyborn is authorised to modify this Privacy Policy at any
              time. This may occur without prior notice. The revised Privacy
              Policy will be posted on www.tailormadeanalytics.com.
            </p>

            <h2 className="brand-tag" style={{ marginBottom: "0.75rem" }}>
              Information we collect
            </h2>
            <p style={{ marginBottom: "0.75rem" }}>
              When using our Service, you will be prompted to provide us with
              personal information used to contact or identify you. We collect:
            </p>
            <ul
              style={{
                paddingLeft: "1.25rem",
                marginBottom: "1.5rem",
                listStyle: "disc",
              }}
            >
              <li>Usage data</li>
              <li>Name</li>
              <li>Email</li>
            </ul>
            <p style={{ marginBottom: "0.75rem" }}>Usage data includes:</p>
            <ul
              style={{
                paddingLeft: "1.25rem",
                marginBottom: "2rem",
                listStyle: "disc",
              }}
            >
              <li>Internet Protocol (IP) address</li>
              <li>Web page requests</li>
              <li>Referring web pages</li>
              <li>Browser used to access the site</li>
              <li>Time and date of access</li>
            </ul>

            <h2 className="brand-tag" style={{ marginBottom: "0.75rem" }}>
              How we collect information
            </h2>
            <p style={{ marginBottom: "1.25rem" }}>
              When you fill in a form or otherwise submit your personal
              information. Your information is stored for up to 5 days after
              it is no longer required to provide you the services. Information
              may be retained longer for reporting or record-keeping in
              accordance with applicable laws. Information which does not
              identify you personally may be stored indefinitely.
            </p>

            <h2 className="brand-tag" style={{ marginBottom: "0.75rem" }}>
              How we use your information
            </h2>
            <ul
              style={{
                paddingLeft: "1.25rem",
                marginBottom: "2rem",
                listStyle: "disc",
              }}
            >
              <li>
                Providing and maintaining our Service, and monitoring its
                usage.
              </li>
              <li>
                Data analysis to identify usage trends or determine the
                effectiveness of marketing campaigns when reasonable.
              </li>
              <li>
                Managing customer orders — your contact details are used to
                manage orders placed through our Service.
              </li>
            </ul>

            <h2 className="brand-tag" style={{ marginBottom: "0.75rem" }}>
              How we share your information
            </h2>
            <p style={{ marginBottom: "1.25rem" }}>
              With your consent. We share your information for any purpose
              with your explicit consent.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              Your information may also be disclosed for additional reasons,
              including:
            </p>
            <ul
              style={{
                paddingLeft: "1.25rem",
                marginBottom: "2rem",
                listStyle: "disc",
              }}
            >
              <li>Complying with applicable laws, regulations, or court orders.</li>
              <li>
                Responding to claims that your use of our Service violates
                third-party rights.
              </li>
              <li>
                Enforcing agreements you make with us, including this Privacy
                Policy.
              </li>
            </ul>

            <h2 className="brand-tag" style={{ marginBottom: "0.75rem" }}>
              Cookies
            </h2>
            <p style={{ marginBottom: "0.75rem" }}>
              Cookies are small text files placed on your computer by websites
              you visit. Strictly necessary cookies allow core functionality and
              are set without your permission. All other cookies require your
              approval before being set in the browser.
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              Below is a report of cookies in use and your current consent
              status. To change your preferences, use the Cookie Settings icon
              in the bottom-left corner of your screen.
            </p>
          </div>

          <div
            className="cookie-report-container"
            data-cookiescriptreport="report"
            style={{
              margin: "2rem 0 3rem",
              padding: "1.5rem",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius)",
              background: "var(--surface)",
              fontSize: "14px",
              color: "var(--ink)",
            }}
          ></div>

          <Script
            src="//report.cookie-script.com/r/4c31a7c94e523ea8bbdce15e4c515c62.js"
            strategy="afterInteractive"
            data-cs-lang="en"
            type="text/javascript"
            charSet="UTF-8"
          />

          <div
            style={{
              fontSize: "15px",
              lineHeight: 1.65,
              color: "var(--ink)",
            }}
          >
            <h2 className="brand-tag" style={{ marginBottom: "0.75rem" }}>
              Security
            </h2>
            <p style={{ marginBottom: "1.25rem" }}>
              Your information&rsquo;s security is important to us. We use a
              range of security measures to prevent the misuse, loss, or
              alteration of the information you have given us. We cannot
              guarantee the security of the information you provide, so you
              must access our service at your own risk.
            </p>
            <p style={{ marginBottom: "2rem" }}>
              Dave Wyborn is not responsible for the performance of websites
              operated by third parties or your interactions with them. When
              you leave this website, review the privacy practices of the
              other sites you interact with.
            </p>

            <h2 className="brand-tag" style={{ marginBottom: "0.75rem" }}>
              Contact us
            </h2>
            <p style={{ marginBottom: "0.5rem" }}>Name: Dave Wyborn</p>
            <p style={{ marginBottom: "0.5rem" }}>Address: 11 Maclaren Road</p>
            <p style={{ marginBottom: "0.5rem" }}>
              Email:{" "}
              <a href="mailto:dave@tailormadeanalytics.com" className="signal-link">
                dave@tailormadeanalytics.com
              </a>
            </p>
            <p>Website: www.tailormadeanalytics.com</p>
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
