"use client";

import { motion } from "framer-motion";
import testimonialsData from "@/data/testimonialsData";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="px-6 md:px-12 py-24 md:py-32"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-5xl">
        <p className="brand-tag mb-10">What clients say</p>

        <h2
          className="display mb-16"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", maxWidth: "20ch" }}
        >
          Notes from the people we&apos;ve worked with.
        </h2>

        <div>
          {testimonialsData.map((t, i) => (
            <motion.article
              key={t.id}
              className={`grid grid-cols-12 gap-6 py-12 hairline border-t ${
                i === testimonialsData.length - 1 ? "border-b" : ""
              }`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="col-span-12 md:col-span-4">
                <p
                  className="display"
                  style={{ fontSize: "20px", lineHeight: 1.2, fontWeight: 500 }}
                >
                  {t.name}
                </p>
                <p style={{ fontSize: "15px", color: "var(--muted)", marginTop: 4 }}>
                  {t.jobTitle}, {t.company}
                </p>
                <p className="label-mono" style={{ marginTop: 12 }}>
                  {t.services}
                </p>
              </div>

              <blockquote
                className="col-span-12 md:col-span-8 display"
                style={{
                  fontSize: "clamp(20px, 2.6vw, 26px)",
                  fontWeight: 500,
                  lineHeight: 1.35,
                  letterSpacing: "-0.005em",
                }}
              >
                &ldquo;{t.testimonial}&rdquo;
              </blockquote>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
