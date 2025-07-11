"use client";

import { motion } from "framer-motion";

export default function FooterSection() {
  return (
    <motion.section
      id="footer"
      className="w-full h-screen flex flex-col justify-center items-center text-center px-6 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* ✅ Headline */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
        Working with us is simple.
      </h2>

      {/* ✅ Supporting line */}
      <p className="text-lg text-gray-300 mb-8 max-w-2xl">
        From your first discovery call to continuous improvements, we keep your
        tracking, consent, and reporting clear — so you can stay focused on your business.
      </p>

      {/* ✅ Process steps */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <span className="text-gray-400 text-sm uppercase tracking-wider">
          Discover
        </span>
        <span className="text-gray-400 text-sm uppercase tracking-wider">
          &gt; Setup
        </span>
        <span className="text-gray-400 text-sm uppercase tracking-wider">
          &gt; Monitor
        </span>
        <span className="text-gray-400 text-sm uppercase tracking-wider">
          &gt; Report
        </span>
        <span className="text-gray-400 text-sm uppercase tracking-wider">
          &gt; Improve
        </span>
      </div>

      {/* ✅ Optional back-to-top arrow */}
      {/* If you want looping scroll UX — optional! */}
      {/* 
      <motion.div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-400 opacity-80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </motion.div>
      */}

      {/* ✅ Footer strip */}
      <div className="absolute bottom-4 w-full text-center text-xs text-gray-500">
        <p>
          Tailor Made Analytics &copy; {new Date().getFullYear()} |{" "}
          <a href="/privacy" className="underline hover:text-gray-300">
            Privacy Policy
          </a>
        </p>
        <p>Built with care in the UK</p>
      </div>
    </motion.section>
  );
}
