"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const wireframeImages = {
  analytics: "/images/analytics.svg",
  visualisation: "/images/visualisation.svg",
  consent: "/images/consent.svg",
};

const Wireframe = ({ selectedService }: { selectedService: string }) => {
  const [currentImage, setCurrentImage] = useState(wireframeImages[selectedService]);

  useEffect(() => {
    if (wireframeImages[selectedService]) {
      setCurrentImage(wireframeImages[selectedService]);
    }
  }, [selectedService]);

  return (
    <div className="wireframe-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedService}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="wireframe-svg"
        >
          <Image
            src={currentImage}
            alt={`${selectedService} wireframe`}
            width={800}
            height={450}
            priority
            className="transition-all duration-500 ease-in-out"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Wireframe;
