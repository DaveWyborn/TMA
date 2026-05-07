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

  const title = type === "call" ? "Who are we meeting?" : "Send a message";
  const intro =
    type === "call"
      ? "Tell us who you are, then we'll take you to the calendar to pick a time."
      : "Drop us a note. We'll come back to you within a working day.";
  const tag = type === "call" ? "STEP 1 OF 2 · YOUR DETAILS" : "TELL US ABOUT YOU";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const honeypot = formData.get("companyName") as string;

    const result = await handleContact({
      type,
      name,
      email,
      message: message || undefined,
      honeypot,
    });

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
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4"
      style={{ background: "rgba(20, 23, 31, 0.55)" }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-md p-8 relative"
        style={{
          background: "var(--paper)",
          borderRadius: "var(--radius)",
          color: "var(--ink)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 inline-flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            background: "transparent",
            color: "var(--ink)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </button>

        {isSuccess ? (
          <div className="py-6">
            <p className="brand-tag mb-6">
              <span style={{ color: "var(--signal)" }}>·</span> SENT
            </p>
            <p
              className="display mb-8"
              style={{ fontSize: "28px" }}
            >
              Message received.
              <br />
              We&apos;ll be in touch shortly.
            </p>
            <button onClick={handleClose} className="btn-ink">
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="brand-tag mb-4">{tag}</p>
            <h3 className="display mb-3" style={{ fontSize: "28px" }}>
              {title}
            </h3>
            <p
              className="mb-8"
              style={{
                fontSize: "15px",
                lineHeight: 1.5,
                color: "var(--muted)",
              }}
            >
              {intro}
            </p>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="field-label">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className="field"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="field-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="field"
                  placeholder="you@agency.com"
                />
              </div>

              {type === "contact" && (
                <div>
                  <label htmlFor="message" className="field-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="field"
                    placeholder="What would you like to talk about?"
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
                className="btn-ink mt-2"
              >
                {isSubmitting
                  ? type === "call"
                    ? "Opening calendar…"
                    : "Sending…"
                  : type === "call"
                  ? "Continue to calendar"
                  : "Send message"}
                {!isSubmitting && (
                  <span style={{ color: "var(--signal)" }}>→</span>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
