"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { handleFormSubmit } from "@/lib/handleFormSubmit";

export default function BuyNowModal({
  isOpen,
  onClose,
  title,
  type, // 'call' or 'contact'
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "call" | "contact";
}) {
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const website_url = formData.get("website_url") as string;
    const message = formData.get("message") as string;
    const honeypot = formData.get("companyName") as string;
    const bookingUrl = process.env.NEXT_PUBLIC_GOOGLE_MEETING_LINK!;

    const result = await handleFormSubmit({
      type,
      name,
      email,
      website_url: website_url || undefined,
      message: message || undefined,
      honeypot,
    });

    if (result.success) {
      if (type === "call") {
        // ✅ Direct to Calendly immediately
        window.open(bookingUrl, "_blank");
        onClose(); // ✅ Close modal
      } else {
        setIsSuccess(true); // ✅ Show thank you for Contact Us
      }
    } else {
      alert("Oops! Something went wrong.");
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {isSuccess ? (
          <>
            <p className="text-gray-700 mb-6">
              Your message has been sent. We’ll be in touch soon.
            </p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-[var(--primary-color)] text-white rounded hover:shadow transition"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4 text-[var(--primary-color)]">
              {title}
            </h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="border p-2 rounded"
              />

              {/* ✅ Website URL for both forms, optional */}
              <input
                type="text"
                name="website_url"
                placeholder="Website URL (optional)"
                className="border p-2 rounded"
              />

              {type === "contact" && (
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  className="border p-2 rounded"
                ></textarea>
              )}

              {/* ✅ Hidden honeypot */}
              <input
                type="text"
                name="companyName"
                tabIndex={-1}
                autoComplete="off"
                className="hidden-honeypot"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded hover:shadow transition"
              >
                Submit
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
