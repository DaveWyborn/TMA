"use client";

import { motion, AnimatePresence } from "framer-motion";

export type LimitTier = "anon" | "free" | "paid";

export default function LimitReachedModal({
  open,
  tier,
  onClose,
}: {
  open: boolean;
  tier: LimitTier;
  onClose: () => void;
}) {
  const heading =
    tier === "anon"
      ? "Daily limit reached"
      : "You're out of uses for today";

  const body =
    tier === "anon"
      ? "Anonymous visitors get 2 uses per tool per day. Sign up free and get 10 — or get in touch about unlimited access."
      : "Free accounts get 10 uses per tool per day. For unlimited usage, get in touch and we'll set you up.";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(20, 23, 31, 0.4)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full p-8"
            style={{
              background: "var(--paper)",
              border: "1px solid var(--ink)",
              borderRadius: "var(--radius)",
            }}
          >
            <div
              className="num-tag mb-4"
              style={{ fontSize: "11px", color: "var(--signal)" }}
            >
              LIMIT REACHED
            </div>
            <h3
              className="display mb-3"
              style={{ fontSize: "26px", color: "var(--ink)" }}
            >
              {heading}
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "var(--ink-soft)",
                lineHeight: 1.55,
              }}
            >
              {body}
            </p>
            <div className="flex gap-3 mt-6">
              {tier === "anon" && (
                <a
                  href="/sign-up"
                  className="signal-link"
                  style={{
                    fontSize: "14px",
                    padding: "10px 16px",
                    border: "1px solid var(--ink)",
                    background: "var(--ink)",
                    color: "var(--paper)",
                    borderRadius: "var(--radius)",
                    textDecoration: "none",
                  }}
                >
                  Sign up free
                </a>
              )}
              <a
                href="/#contact"
                className="signal-link"
                style={{
                  fontSize: "14px",
                  padding: "10px 16px",
                  border: "1px solid var(--ink)",
                  background: "transparent",
                  color: "var(--ink)",
                  borderRadius: "var(--radius)",
                  textDecoration: "none",
                }}
              >
                Get in touch
              </a>
              <button
                onClick={onClose}
                style={{
                  fontSize: "14px",
                  padding: "10px 16px",
                  border: "1px solid var(--hairline)",
                  background: "transparent",
                  color: "var(--ink-soft)",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  marginLeft: "auto",
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
