"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import testimonials from "@/data/testimonialsData"; // ✅ Import testimonials from separate file

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  return (
    <section id="testimonials" className="testimonials-section">
      <h2 className="testimonials-heading">What Clients Say</h2>

      <div
        className="testimonials-content"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <p className="testimonial-quote">"{testimonials[index].quote}"</p>
            <p className="testimonial-author">- {testimonials[index].author}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Testimonials;
