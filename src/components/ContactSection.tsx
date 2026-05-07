"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ContactModal from "./ContactModal";

export default function ContactSection() {
  const [modalType, setModalType] = useState<"call" | "contact" | null>(null);

  return (
    <motion.section
      id="contact"
      className="relative w-full min-h-screen flex flex-col justify-center items-center text-center px-6 py-20"
      style={{ background: "var(--deep-purple)" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--light-text)]">
        Let&apos;s talk.
      </h2>

      <p className="text-lg text-gray-300 max-w-md mb-10">
        No pitch. Just a conversation about where you want to get to.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setModalType("call")}
          className="min-h-[44px] px-7 py-3 bg-white text-[var(--primary-color)] font-semibold rounded hover:shadow-lg transition text-sm"
        >
          Book a Call
        </button>
        <button
          onClick={() => setModalType("contact")}
          className="min-h-[44px] px-7 py-3 border border-white text-white font-semibold rounded hover:bg-white/10 transition text-sm"
        >
          Send a Message
        </button>
      </div>

      {modalType && (
        <ContactModal
          isOpen={true}
          onClose={() => setModalType(null)}
          type={modalType}
        />
      )}
    </motion.section>
  );
}
