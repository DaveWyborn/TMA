import Link from "next/link";
import Script from "next/script";

export const metadata = {
  title: "Privacy Policy | Tailor Made Analytics",
  description: "Read our Privacy Policy to understand how we handle your data and cookie consent.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 text-left">
      {/* Top Back to Home */}
      <Link
        href="/"
        className="inline-block mb-6 bg-[var(--accent-soft)] text-white px-4 py-2 rounded hover:bg-[var(--accent)] transition"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="whitespace-pre-wrap text-sm leading-relaxed">
{`PRIVACY POLICY

Effective date: 2025-07-14

Updated on: 2025-07-14

This Privacy Policy explains the policies of Dave Wyborn on the collection and use of the information we collect when you access www.tailormadeanalytics.com (the “Service”). This Privacy Policy describes your privacy rights and how you are protected under privacy laws.

By using our Service, you are consenting to the collection and use of your information in accordance with this Privacy Policy. Please do not access or use our Service if you do not consent to the collection and use of your information as outlined in this Privacy Policy. This Privacy Policy has been created with the help of CookieScript Privacy Policy Generator.

Dave Wyborn is authorized to modify this Privacy Policy at any time. This may occur without prior notice.

Dave Wyborn will post the revised Privacy Policy on the www.tailormadeanalytics.com website.

COLLECTION AND USE OF YOUR PERSONAL INFORMATION

INFORMATION WE COLLECT

When using our Service, you will be prompted to provide us with personal information used to contact or identify you. www.tailormadeanalytics.com collects the following information:

 * Usage Data
 * Name
 * Email

Usage Data includes the following:

 * Internet Protocol (IP) address of computers accessing the site
 * Web page requests
 * Referring web pages
 * Browser used to access site
 * Time and date of access

HOW WE COLLECT INFORMATION

www.tailormadeanalytics.com collects and receives information from you in the following manner:

 * When you fill a registration form or otherwise submit your personal information.

Your information will be stored for up to 5 days after it is no longer required to provide you the services. Your information may be retained for longer periods for reporting or record-keeping in accordance with applicable laws. Information which does not identify you personally may be stored indefinitely.

HOW WE USE YOUR INFORMATION

www.tailormadeanalytics.com may use your information for the following purposes:

 * For other purposes. Dave Wyborn will use your information for data analysis to identify usage trends or determine the effectiveness of our marketing campaigns when reasonable. We will use your information to evaluate and improve our Service, products, services, and marketing efforts.
 * Providing and maintaining our Service, as well as monitoring the usage of our Service.
 * Managing customer orders. Your email address, phone number, social media profiles, and other user account information will be used in order to manage orders placed through our Service.

HOW WE SHARE YOUR INFORMATION

Dave Wyborn will share your information, when applicable, in the following situations:

 * With your consent. Dave Wyborn will share your information for any purpose with your explicit consent.

THIRD-PARTY SHARING

Your information may be disclosed for additional reasons, including:

 * Complying with applicable laws, regulations, or court orders.
 * Responding to claims that your use of our Service violates third-party rights.
 * Enforcing agreements you make with us, including this Privacy Policy.

COOKIES

Cookies are small text files that are placed on your computer by websites that you visit. Websites use cookies to help users navigate efficiently and perform certain functions. Cookies that are required for the website to operate properly are allowed to be set without your permission. All other cookies need to be approved before they can be set in the browser.

 * Strictly necessary cookies. Strictly necessary cookies allow core website functionality such as user login and account management. The website cannot be used properly without strictly necessary cookies.
 * Targeting cookies. Targeting cookies are used to identify visitors between different websites, eg. content partners, banner networks. Those cookies may be used by companies to build a profile of visitor interests or show relevant ads on other websites.

Below is a report of cookies in use and your current consent status. To change your preferences, please use the Cookie Settings icon in the bottom left corner of your screen.`}
</div>
{/* ✅ CookieScript Declaration Table — read-only */}
<div
  className="cookie-report-container my-8 p-4 border border-gray-700 rounded"
  data-cookiescriptreport="report"
></div>

<Script
  src="//report.cookie-script.com/r/4c31a7c94e523ea8bbdce15e4c515c62.js"
  strategy="afterInteractive"
  data-cs-lang="en"
  type="text/javascript"
  charSet="UTF-8"
/>

      <div className="whitespace-pre-wrap text-sm leading-relaxed">
{`
SECURITY

Your information’s security is important to us. www.tailormadeanalytics.com utilizes a range of security measures to prevent the misuse, loss, or alteration of the information you have given us. However, because we cannot guarantee the security of the information you provide us, you must access our service at your own risk.

Dave Wyborn is not responsible for the performance of websites operated by third parties or your interactions with them. When you leave this website, we recommend you review the privacy practices of other websites you interact with and determine the adequacy of those practices.

CONTACT US

For any questions, please contact us through the following methods:

Name: Dave Wyborn

Address: 11 Maclaren Road

Email: dave@tailormadeanalytics.com

Website: www.tailormadeanalytics.com
`}
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
