"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Wireframe from "@/components/Wireframe"; // ✅ Import the Wireframe component
import { JSDOMPurify } from 'dompurify';

// Import service descriptions
import analyticsDescription from "./services/analytics";
import visualisationDescription from "./services/visualisation";
import consentDescription from "./services/consent";

// ✅ Dynamically load DOMPurify only in the browser to prevent SSR issues

let DOMPurify: JSDOMPurify | null = null;

if (typeof window !== "undefined") {
  import("dompurify").then((mod) => {
    DOMPurify = mod.default;
  });
}

// ✅ Service Data
const services = [
  { id: "analytics", title: "Website Analytics", description: analyticsDescription, icon: "/icons/analytics.svg" },
  { id: "visualisation", title: "Data Visualisation", description: visualisationDescription, icon: "/icons/visualisation.svg" },
  { id: "consent", title: "Consent Management", description: consentDescription, icon: "/icons/consent.svg" },
];

const ServiceSelection = () => {
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // ✅ Handle Escape key to close overlay
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOverlayOpen(false);
      }
    };

    if (isOverlayOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOverlayOpen]);

  return (
    <section id="services" className="w-full h-screen flex flex-col items-center justify-center bg-white scroll-snap-align-start pt-24 md:pt-0 text-gray-800">
      <h2 className="text-3xl font-semibold text-[#1B1F3B] mb-6 text-center">Our Services</h2>

      {/* Service Selection Buttons */}
      <div className="services-buttons flex flex-col md:flex-row justify-center gap-6 mb-8 w-full px-4">
        {services.map((service) => (
          <button
            key={service.id}
            className={`service-button flex items-center md:flex-col px-4 md:px-6 pb-2 border-b-2 transition-all duration-300 transform w-full md:w-auto
              ${selectedService === service.id ? "border-[#1B1F3B] text-[#1B1F3B] scale-105 font-semibold" : "border-gray-400 text-gray-700"}
              hover:border-[#313863] hover:text-[#313863] hover:scale-110`}
            onClick={() => setSelectedService(service.id)}
          >
            <Image
              src={service.icon}
              alt={service.title}
              width={40}
              height={40}
              className="mr-4 md:mr-0 md:mb-2 transition-transform duration-300"
            />
            <span className="text-lg text-left md:text-center">{service.title}</span>
          </button>
        ))}
      </div>

      {/* ✅ Wireframe Display */}
      <div className="wireframe-container">
        <Wireframe selectedService={selectedService} />
      </div>

      {/* ✅ Tell Me More Button */}
      <button className="popup-button" onClick={() => setIsOverlayOpen(true)}>
        Tell Me More
      </button>

      {/* ✅ Service Description Overlay */}
      {isOverlayOpen && (
        <div className="overlay-container" onClick={() => setIsOverlayOpen(false)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setIsOverlayOpen(false)}>✕</button>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedService}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="text-lg text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify && typeof DOMPurify.sanitize === "function"
                      ? DOMPurify.sanitize(services.find((service) => service.id === selectedService)?.description ?? "",
                          { ALLOWED_TAGS: ["h3", "p", "strong", "ul", "li", "span", "br"] })
                      : "",
                  }}
                />
                {/* ✅ CTA Buttons */}
                <div className="overlay-actions">
                  <a href="#contact" className="buy-button">Buy Now</a>
                  <a href="YOUR_CALENDAR_BOOKING_LINK" target="_blank" className="book-button">Book a Call</a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
};

// ✅ Ensure component is client-side only
export default dynamic(() => Promise.resolve(ServiceSelection), { ssr: false });
