"use client";

import { motion } from "framer-motion";

const products = [
  {
    label: "GTM Monitoring",
    desc: "Real-time alerts when your tracking breaks — before your client notices.",
    href: "https://cookiechest.com",
  },
  {
    label: "Consent Management (CMP)",
    desc: "Cookie consent built for PPC agencies. Keeps Google happy, keeps ads running.",
    href: "https://cookiechest.com/CMP",
  },
];

export default function CookieChestSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      id="cookiechest"
      className="relative w-full min-h-screen flex flex-col justify-center items-center text-center px-6 py-20"
      style={{ background: "var(--dark-bg)" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* TMA product badge */}
      <span className="mb-4 text-xs font-semibold tracking-widest uppercase text-[var(--accent-soft)] border border-[var(--accent-soft)] px-3 py-1 rounded-full">
        A Tailor Made Analytics Product
      </span>

      <h2 className="text-3xl font-bold mb-3 text-[var(--light-text)]">
        CookieChest
      </h2>

      <p className="text-lg text-gray-300 max-w-xl mb-12">
        Tracking signal monitoring and consent management for PPC agencies.
        Built to protect your data and your clients.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full z-10">
        {products.map(({ label, desc, href }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 p-6 rounded-lg shadow-md text-left hover:ring-2 hover:ring-[var(--accent-soft)] transition-all"
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
              {label}
            </h3>
            <p className="text-sm text-gray-300 mb-3">{desc}</p>
            <span className="text-xs font-medium text-[var(--accent-soft)] underline">
              Visit cookiechest.com →
            </span>
          </motion.a>
        ))}
      </div>

      {/* Down chevron */}
      <motion.div
        onClick={() => scrollToSection("testimonials")}
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
