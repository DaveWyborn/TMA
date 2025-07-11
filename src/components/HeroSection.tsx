"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.section
      id="home"
      className="hero-container relative flex flex-col items-center justify-center h-screen text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* ✅ Logo */}
      <Image
        src="/images/hero-title.png"
        alt="Tailor Made Analytics"
        width={500}
        height={150}
        priority
        className="hero-logo"
      />

      {/* ✅ Stacked tagline */}
      <div className="hero-tagline mt-4">
        <h2 className="hero-heading">Stay compliant.</h2>
        <h2 className="hero-heading">Track what matters.</h2>
        <h2 className="hero-heading italic opacity-90">
          Sleep better at night.
        </h2>
      </div>

      {/* ✅ Animated down arrow */}
      <motion.div
        onClick={() => scrollToSection("promise")}
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
