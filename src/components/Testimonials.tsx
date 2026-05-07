"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import testimonialsData from "@/data/testimonialsData";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonialsData.length);
    }, 7000);
    return () => clearInterval(id);
  }, [isPaused]);

  const t = testimonialsData[index];

  return (
    <section
      id="testimonials"
      className="px-6 md:px-12 py-24 md:py-32"
      style={{ background: "var(--paper)" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-4xl">
        <p className="brand-tag mb-10">
          04 <span className="dot">·</span> WHAT CLIENTS SAY
        </p>

        <div className="min-h-[260px] md:min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <blockquote
                className="display"
                style={{
                  fontSize: "clamp(22px, 3.4vw, 34px)",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                  fontWeight: 500,
                  maxWidth: "32ch",
                }}
              >
                <span style={{ color: "var(--signal)" }}>&ldquo;</span>
                {t.testimonial}
                <span style={{ color: "var(--signal)" }}>&rdquo;</span>
              </blockquote>

              <div className="mt-8 flex items-center gap-4 hairline border-t pt-4 max-w-md">
                <span className="num-mono" style={{ color: "var(--signal)" }}>
                  0{t.id}
                </span>
                <span style={{ fontWeight: 500 }}>{t.name}</span>
                <span style={{ color: "var(--muted)" }}>·</span>
                <span style={{ color: "var(--muted)" }}>
                  {t.jobTitle}, {t.company}
                </span>
              </div>

              <p className="label-mono mt-3">{t.services}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        <div className="flex gap-2 mt-10">
          {testimonialsData.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              style={{
                width: i === index ? 24 : 8,
                height: 2,
                background: i === index ? "var(--signal)" : "var(--hairline)",
                transition: "all 0.25s ease",
                cursor: "pointer",
                border: "none",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
