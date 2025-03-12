"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import testimonialsData from "@/data/testimonialsData";
import Link from "next/link";
import Image from "next/image";

const serviceLinks: Record<string, string> = {
  "Website Analytics": "#services",
  "Data Visualisation & Reporting": "#services",
  "Consent Management": "#services",
};

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  return (
    <section id="testimonials" className="testimonials-section">
      {/* ✅ Fixed Header */}
      <h2 className="testimonials-header">What Clients Say</h2>

      <div
        className="testimonials-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* ✅ Display Image if Available */}
            {testimonialsData[index].image && (
              <div className="testimonial-image">
                <Image
                  src={testimonialsData[index].image}
                  alt={testimonialsData[index].name}
                  width={150}
                  height={150}
                  className="rounded-full object-cover"
                />
              </div>
            )}

            {/* ✅ Quote Below Image */}
            <p className="testimonial-text">"{testimonialsData[index].testimonial}"</p>
            <p className="author-name">{testimonialsData[index].name}</p>
            <p className="author-job">
              {testimonialsData[index].jobTitle}, {testimonialsData[index].company}
            </p>
            <p className="testimonial-services">
              <Link
                href={serviceLinks[testimonialsData[index].services] || "#services"}
                className="service-link"
              >
                {testimonialsData[index].services}
              </Link>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Testimonials;
