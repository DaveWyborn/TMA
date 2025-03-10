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
      className="hero-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* ✅ PNG Logo */}
      <Image
        src="/images/hero-title.png"
        alt="Tailor Made Analytics"
        width={500}
        height={150}
        priority
        className="hero-logo"
      />

      {/* ✅ Single Header */}
      <h2 className="hero-heading">
        Website Analytics, Data Visualisation, and Consent Management made simple.
      </h2>

      {/* ✅ Button */}
      <button onClick={() => scrollToSection("services")} className="hero-button">
        Explore Services
      </button>
    </motion.section>
  );
}
