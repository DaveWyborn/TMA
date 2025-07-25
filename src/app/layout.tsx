import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Tailor Made Analytics | Expert Website Tracking, Reporting & Consent Management",
  description: "Unlock actionable insights with Tailor Made Analytics. We specialise in Google Tag Manager, GA4, Looker Studio dashboards, and consent management — tailored to your business.",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Tag Manager via Tag Gateway */}
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
              j.src='https://tags.tailormadeanalytics.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-THL6DSQM');
            `,
          }}
        />
      </head>
      <body className="root-body">
        {/* ✅ GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://tags.tailormadeanalytics.com/ns.html?id=GTM-THL6DSQM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {children}
      </body>
    </html>
  );
}
