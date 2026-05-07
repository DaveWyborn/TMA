"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    { id: "services", label: "Services", href: "#services" },
    { id: "cookiechest", label: "CookieChest", href: "#cookiechest" },
    { id: "seo-tools", label: "SEO Tools", href: "/seo-tools" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-white rounded shadow-md"
        aria-label="Toggle Menu"
      >
        <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
        <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
        <div className="w-6 h-0.5 bg-gray-800"></div>
      </button>

      {/* Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 bg-white shadow-lg rounded p-4 z-40"
          >
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={section.href}
                    className="text-gray-800 hover:text-blue-600 block py-1 min-h-[44px] flex items-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
