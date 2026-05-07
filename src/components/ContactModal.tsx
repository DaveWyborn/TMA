"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { handleContact } from "@/lib/handleContact";

export default function ContactModal({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "call" | "contact";
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const title = type === "call" ? "Book a Call" : "Send a Message";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const honeypot = formData.get("companyName") as string;

    const result = await handleContact({ type, name, email, message: message || undefined, honeypot });

    setIsSubmitting(false);

    if (result.success) {
      if (type === "call") {
        const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? "https://cal.com";
        window.open(calLink, "_blank");
        onClose();
      } else {
        setIsSuccess(true);
      }
    } else {
      alert(`Something went wrong: ${result.error ?? "unknown error"}`);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {isSuccess ? (
          <div className="text-center py-4">
            <p className="text-gray-700 mb-6 text-base">
              Message sent. We&apos;ll be in touch shortly.
            </p>
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-[var(--primary-color)] text-white rounded hover:opacity-90 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4 text-[var(--primary-color)]">
              {title}
            </h3>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-xs font-medium text-gray-600">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="border border-gray-300 p-2.5 rounded text-sm focus:outline-none focus:border-[var(--accent-soft)] text-gray-900"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs font-medium text-gray-600">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Your email"
                  required
                  className="border border-gray-300 p-2.5 rounded text-sm focus:outline-none focus:border-[var(--accent-soft)] text-gray-900"
                />
              </div>
              {type === "contact" && (
                <div className="flex flex-col gap-1">
                  <label htmlFor="message" className="text-xs font-medium text-gray-600">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="What would you like to talk about?"
                    rows={4}
                    className="border border-gray-300 p-2.5 rounded text-sm focus:outline-none focus:border-[var(--accent-soft)] resize-none text-gray-900"
                  />
                </div>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="companyName"
                tabIndex={-1}
                autoComplete="off"
                className="hidden-honeypot"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 px-5 py-2.5 bg-[var(--primary-color)] text-white rounded hover:opacity-90 transition disabled:opacity-60 text-sm font-medium"
              >
                {isSubmitting ? "Sending…" : type === "call" ? "Book Now" : "Send Message"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
