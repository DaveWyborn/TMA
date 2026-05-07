"use client";

import { motion } from "framer-motion";

const services = [
  {
    n: "01",
    title: "SEO",
    blurb:
      "Keyword research and rank tracking through DataForSEO and BigQuery. Search Console wired into Looker Studio dashboards that show what's worth doing next, not vanity rankings.",
  },
  {
    n: "02",
    title: "GTM & Tag Management",
    blurb:
      "GA4 setup, event tracking, and full server-side tagging via our own Tag Gateway. Events fire correctly. Consent is respected. Your data stays yours.",
  },
  {
    n: "03",
    title: "On-site Optimisation",
    blurb:
      "Core Web Vitals, structured data, crawlability, conversion bottlenecks. A site that search engines and users can both rely on.",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="px-6 md:px-12 py-24 md:py-32"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-5xl">
        <p className="brand-tag mb-10">What we do</p>

        <h2 className="display mb-4" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          SEO, GTM, and on-site optimisation —
          <br />
          designed to work together.
        </h2>

        <div className="mt-16">
          {services.map(({ n, title, blurb }, i) => (
            <motion.div
              key={n}
              className={`grid grid-cols-12 gap-6 py-10 hairline border-t items-baseline ${
                i === services.length - 1 ? "border-b" : ""
              }`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="col-span-12 md:col-span-2">
                <span className="num-tag" style={{ fontSize: "28px" }}>
                  {n}
                </span>
              </div>
              <div className="col-span-12 md:col-span-4">
                <h3 className="display" style={{ fontSize: "28px" }}>
                  {title}
                </h3>
              </div>
              <div
                className="col-span-12 md:col-span-6"
                style={{ fontSize: "16px", lineHeight: 1.55, color: "var(--ink)" }}
              >
                {blurb}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
