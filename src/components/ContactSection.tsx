"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ContactModal from "./ContactModal";

export default function ContactSection() {
  const [modalType, setModalType] = useState<"call" | "contact" | null>(null);

  return (
    <section
      id="contact"
      className="px-6 md:px-12 py-24 md:py-32"
      style={{ background: "var(--paper)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <p className="brand-tag mb-10">Let&apos;s talk</p>

        <h2
          className="display"
          style={{ fontSize: "clamp(36px, 6vw, 64px)", maxWidth: "16ch" }}
        >
          No pitch. Just a conversation about
          <br />
          <span style={{ color: "var(--signal)" }}>where you want to get to</span>.
        </h2>

        <p
          className="mt-8 max-w-lg"
          style={{ fontSize: "17px", lineHeight: 1.55, color: "var(--ink)" }}
        >
          Book a call or send a message. We&apos;ll come back to you within a working day.
        </p>

        <div className="flex flex-wrap gap-3 mt-12">
          <button
            type="button"
            onClick={() => setModalType("call")}
            className="btn-ink"
          >
            Book a call <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            onClick={() => setModalType("contact")}
            className="btn-ghost"
          >
            Send a message
          </button>
        </div>
      </motion.div>

      {modalType && (
        <ContactModal
          isOpen={true}
          onClose={() => setModalType(null)}
          type={modalType}
        />
      )}
    </section>
  );
}
