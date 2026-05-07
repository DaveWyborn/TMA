"use client";

import { motion } from "framer-motion";

const products = [
  { label: "GTM Monitoring", value: "live" },
  { label: "Consent Management", value: "CMP" },
  { label: "Used by", value: "PPC agencies", signal: true },
];

export default function CookieChestSection() {
  return (
    <section
      id="cookiechest"
      className="px-6 md:px-12 py-24 md:py-32"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <p className="brand-tag mb-8" style={{ color: "var(--paper-on-ink)" }}>
        A TMA STUDIO PRODUCT
        <span className="dot">·</span>
        v.01
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="display"
            style={{ fontSize: "clamp(36px, 6vw, 64px)", color: "var(--paper)" }}
          >
            CookieChest.
            <br />
            Tracking that{" "}
            <span style={{ color: "var(--signal)" }}>doesn&apos;t break</span>.
          </h2>

          <p
            className="mt-8 max-w-md"
            style={{
              fontSize: "17px",
              lineHeight: 1.55,
              color: "var(--paper-on-ink)",
            }}
          >
            Real-time tag monitoring and consent management for PPC agencies.
            Built in-house at TMA — the product version of the work we do for clients.
          </p>
        </motion.div>

        <motion.div
          className="md:col-span-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-3">
            {products.map(({ label, value, signal }) => (
              <div
                key={label}
                className="flex justify-between border-b pb-3"
                style={{ borderColor: "var(--ink-soft)" }}
              >
                <span style={{ color: "var(--paper-on-ink)" }}>{label}</span>
                <span
                  className="num-mono"
                  style={{ color: signal ? "var(--signal)" : "var(--paper)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          <a
            href="https://cookiechest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3"
            style={{
              color: "var(--paper)",
              borderBottom: "1px solid var(--signal)",
              paddingBottom: "4px",
            }}
          >
            Visit cookiechest.com{" "}
            <span style={{ color: "var(--signal)" }}>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
