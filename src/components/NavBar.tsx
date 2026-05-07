"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Wordmark from "./Wordmark";

const sections = [
  { label: "Services", href: "/#services" },
  { label: "CookieChest", href: "/#cookiechest" },
  { label: "SEO Tools", href: "/seo-tools" },
  { label: "Contact", href: "/#contact" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="w-full px-6 md:px-12 pt-6 md:pt-8 pb-4 flex items-start justify-between"
      style={{ background: "var(--paper)" }}
    >
      <Link href="/" aria-label="Tailor Made Analytics — home">
        <Wordmark size={22} showSubhead={true} />
      </Link>

      <nav
        className="hidden md:flex gap-8 items-center pt-2"
        style={{ fontSize: "15px", color: "var(--ink)" }}
      >
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="signal-link">
            {s.label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu trigger */}
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="md:hidden inline-flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius)",
          border: "1px solid var(--ink)",
          background: "transparent",
          color: "var(--ink)",
        }}
        aria-label="Open menu"
        aria-expanded={menuOpen}
      >
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <path d="M0 1H18M0 6H18M0 11H18" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden fixed inset-0 z-50 flex flex-col"
            style={{ background: "var(--paper)" }}
          >
            <div className="flex items-start justify-between px-6 pt-6">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Home">
                <Wordmark size={22} showSubhead={true} />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--ink)",
                  background: "transparent",
                  color: "var(--ink)",
                }}
                aria-label="Close menu"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1L13 13M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-2 px-6 pt-16">
              {sections.map((s, i) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setMenuOpen(false)}
                  className="display block py-4 hairline border-b"
                  style={{ fontSize: "32px" }}
                >
                  <span className="num-tag mr-4" style={{ fontSize: "14px" }}>
                    0{i + 1}
                  </span>
                  {s.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
