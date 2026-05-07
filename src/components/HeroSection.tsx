"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="px-6 md:px-12 pt-12 md:pt-24 pb-24 md:pb-32"
      style={{ background: "var(--paper)" }}
    >
      <motion.div
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
          We build measurement stacks that survive releases, dashboards that tell you
          what to do, and consent setups that keep ads running. No vanity metrics.
        </p>

        <div className="flex flex-wrap gap-3 mt-12">
          <Link href="#contact" className="btn-ink">
            Book a call <span style={{ color: "var(--signal)" }}>→</span>
          </Link>
          <Link href="#services" className="btn-ghost">
            See what we do
          </Link>
        </div>
      </motion.div>

      <div className="mt-32 md:mt-40 flex justify-between items-end">
        <span className="label-mono">Scroll to services</span>
        <span className="label-mono">v.01 · 2026</span>
      </div>
    </section>
  );
}
