"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CLIENT_COUNT = 37;

const tiers = [
  { color: "var(--ink)", label: "80%+" },
  { color: "var(--muted)", label: "50%+" },
  { color: "var(--signal)", label: "30%+" },
];

function SatisfactionGraphic() {
  return (
    <div>
      <p className="label-mono mb-6">Client satisfaction</p>

      <div
        className="grid gap-3 mb-6"
        style={{
          gridTemplateColumns: "repeat(7, 10px)",
          width: "fit-content",
        }}
        aria-label={`${CLIENT_COUNT} clients, all in the 80% or higher satisfaction band`}
      >
        {Array.from({ length: CLIENT_COUNT }).map((_, i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{ width: 10, height: 10, background: "var(--ink)" }}
          />
        ))}
      </div>

      <div
        className="hairline border-t pt-4 space-y-2"
        style={{ width: "fit-content" }}
      >
        {tiers.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className="block rounded-full"
              style={{ width: 10, height: 10, background: color }}
            />
            <span className="label-mono">{label}</span>
          </div>
        ))}
      </div>

      <p className="label-mono mt-6" style={{ maxWidth: "20ch", lineHeight: 1.5 }}>
        {CLIENT_COUNT} clients · 2yr+ avg tenure
      </p>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="home"
      className="px-6 md:px-12 pt-12 md:pt-24 pb-24 md:pb-32"
      style={{ background: "var(--paper)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <motion.div
          className="md:col-span-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="brand-tag mb-8">
            A DATA STUDIO
            <span className="dot">·</span>
            MEASUREMENT
            <span className="dot">·</span>
            SEO
          </p>

          <h1
            className="display"
            style={{
              fontSize: "clamp(44px, 9vw, 96px)",
              maxWidth: "18ch",
            }}
          >
            Analytics,
            <br />
            in plain language.
            <br />
            <span style={{ color: "var(--signal)" }}>Sharp numbers</span>, quiet design.
          </h1>

          <p
            className="mt-10 max-w-xl"
            style={{ fontSize: "19px", lineHeight: 1.5, color: "var(--ink)" }}
          >
            We build measurement stacks that survive releases, dashboards that drive
            decisions, and consent setups that keep ads running. No vanity metrics.
          </p>

          <div className="flex flex-wrap gap-3 mt-12">
            <Link href="#contact" className="btn-ink">
              Book a call <span aria-hidden="true">→</span>
            </Link>
            <Link href="#services" className="btn-ghost">
              See what we do
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hidden md:block md:col-span-4 md:pt-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <SatisfactionGraphic />
        </motion.div>
      </div>

      <div className="mt-32 md:mt-40 flex justify-between items-end">
        <span className="label-mono">Scroll to services</span>
        <span className="label-mono">v.01 · 2026</span>
      </div>
    </section>
  );
}
