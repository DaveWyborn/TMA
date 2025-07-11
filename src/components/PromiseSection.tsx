"use client";

import { useState } from "react";
import { motion } from "framer-motion";


export default function PromiseSection() {
  const promises = [
    {
      title: "Setup",
      desc: "GA4, Tag Manager, and Consent Manager installed and tested properly.",
      detail: "We make sure your GA4 and Tag Manager are correctly configured, tested and integrated with your consent tool. No surprises, just reliable data.",
    },
    {
      title: "Monitoring",
      desc: "Your tracking and uptime are watched 24/7 — no hidden data loss.",
      detail: "We keep an eye on your data streams and your site’s uptime. If something goes wrong, we spot it fast — before it costs you revenue.",
    },
    {
      title: "Reporting",
      desc: "See clear, simple reports with the metrics that matter to you.",
      detail: "Get dashboards you actually understand. No fluff — just actionable data, when you need it.",
    },
    {
      title: "Consent",
      desc: "Stay in line with Google’s requirements — keep your ads running.",
      detail: "We help you stay up to date with changing consent rules. When Google changes the rules, you don’t get caught out.",
    },
  ];

  const [activePromise, setActivePromise] = useState<string | null>(null);
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <motion.section
      id="testimonials"
      className="promise-section relative w-full h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden"
    >
      <h2 className="text-3xl font-bold mb-4 text-[var(--light-text)]">
        Our Promise
      </h2>
      <p className="text-lg text-gray-300 max-w-xl mb-12">
        We keep your data flowing and your site compliant — so you can focus on what matters.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl z-10">
        {promises.map(({ title, desc }) => (
          <motion.div
            key={title}
            onClick={() => setActivePromise(title)}
            className={`bg-white/5 p-6 rounded-lg shadow-md cursor-pointer transition-all ${
              activePromise === title ? "ring-2 ring-[var(--accent-soft)]" : ""
            }`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
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

      {/* ✅ Reserved Detail Space */}
      <div className="relative mt-8 max-w-3xl min-h-[100px] flex items-center justify-center">
        {promises.map(
          ({ title, detail }) =>
            activePromise === title && (
              <motion.p
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-base text-gray-200"
              >
                {detail}
              </motion.p>
            )
        )}
      </div>
              {/* Simple down chevron */}
        <motion.div
        onClick={() => scrollToSection("Testimonials")}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {/* Simple down chevron */}
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


