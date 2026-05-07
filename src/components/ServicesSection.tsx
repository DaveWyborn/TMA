"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const services = [
  {
    title: "SEO",
    desc: "Keyword research, rank tracking, and content strategy backed by real data.",
    detail:
      "We use DataForSEO, BigQuery, and Looker Studio to build keyword research pipelines, track ranking movements, connect Google Search Console, and produce custom SEO dashboards. No vanity metrics — just the numbers that drive organic growth.",
  },
  {
    title: "GTM & Tag Management",
    desc: "GA4 setup, event tracking, and server-side tagging done properly.",
    detail:
      "From a clean GA4 configuration to full server-side tagging via our Tag Gateway, we handle every layer of your measurement stack. Events fire correctly, consent is respected, and your data stays yours.",
  },
  {
    title: "On-site Optimisation",
    desc: "Technical SEO, page speed, structured data, and CRO.",
    detail:
      "We audit and improve Core Web Vitals, fix crawlability issues, implement structured data, and identify conversion bottlenecks — giving search engines and users a site they can rely on.",
  },
];

export default function ServicesSection() {
  const [activeService, setActiveService] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      id="services"
      className="relative w-full min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 overflow-hidden promise-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-[var(--light-text)]">
        What We Do
      </h2>

      <p className="text-lg text-gray-300 max-w-xl mb-12">
        Analytics, SEO, and tag management — designed to work together, not in silos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full z-10">
        {services.map(({ title, desc }) => (
          <motion.div
            key={title}
            onClick={() => setActiveService(activeService === title ? null : title)}
            className={`relative bg-white/5 p-6 rounded-lg shadow-md cursor-pointer transition-all text-left ${
              activeService === title ? "ring-2 ring-[var(--accent-soft)]" : ""
            }`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{
              scale: 1.03,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
          >
            <h3 className="text-lg font-semibold mb-2 text-[var(--light-text)]">
              {title}
            </h3>
            <p className="text-sm text-gray-300">{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Detail panel */}
      <div className="relative mt-8 max-w-3xl w-full min-h-[80px] flex items-center justify-center">
        {services.map(
          ({ title, detail }) =>
            activeService === title && (
              <motion.p
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-base text-gray-200 text-center"
              >
                {detail}
              </motion.p>
            )
        )}
      </div>

      {/* Down chevron */}
      <motion.div
        onClick={() => scrollToSection("cookiechest")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white opacity-80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </motion.section>
  );
}
