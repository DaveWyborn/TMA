"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Import service descriptions
import analyticsDescription from "./services/analytics";
import visualisationDescription from "./services/visualisation";
import consentDescription from "./services/consent";

// ✅ Dynamically load DOMPurify only in the browser
const loadDOMPurify = async () => {
  if (typeof window !== "undefined") {
    const mod = await import("dompurify");
    return mod.default || mod;
  }
  return null;
};

// ✅ Service Data
const services = [
  { id: "analytics", title: "Website Analytics", description: analyticsDescription, icon: "/icons/analytics.svg" },
  { id: "visualisation", title: "Data Visualisation", description: visualisationDescription, icon: "/icons/visualisation.svg" },
  { id: "consent", title: "Consent Management", description: consentDescription, icon: "/icons/consent.svg" },
];

const ServiceSelection = () => {
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [sanitizedDescription, setSanitizedDescription] = useState<string | null>(null);
  const [DOMPurify, setDOMPurify] = useState<any>(null);

  // ✅ Load DOMPurify on mount
  useEffect(() => {
    loadDOMPurify().then((purify) => {
      setDOMPurify(purify);
      if (purify && typeof purify.sanitize === "function") {
        const initialDescription = services.find((service) => service.id === selectedService)?.description ?? "";
        setSanitizedDescription(purify.sanitize(initialDescription, { ALLOWED_TAGS: ["h3", "p", "strong", "ul", "li", "span", "br"], ALLOWED_ATTR: ["class"] }));
      }
    });
  }, []);

  // ✅ Update sanitized description when the service changes
  useEffect(() => {
    if (DOMPurify && typeof DOMPurify.sanitize === "function") {
      const newDescription = services.find((service) => service.id === selectedService)?.description ?? "";
      setSanitizedDescription(DOMPurify.sanitize(newDescription, { ALLOWED_TAGS: ["h3", "p", "strong", "ul", "li", "span", "br"], ALLOWED_ATTR: ["class"] }));
    }
  }, [selectedService, DOMPurify]);

  return (
    <section id="services" className="services-container">
      <h2 className="services-heading">Our Services</h2>

      {/* ✅ Service Selection Buttons */}
      <div className="services-buttons">
        {services.map((service) => (
          <button
            key={service.id}
            className={`service-button ${selectedService === service.id ? "selected" : ""}`}
            onClick={() => setSelectedService(service.id)}
          >
            <Image
              src={service.icon}
              alt={service.title}
              width={40}
              height={40}
              className="service-icon"
            />
            <span className="service-title">{service.title}</span>
          </button>
        ))}
      </div>

      {/* ✅ Selected Service Description - Only show when DOMPurify is available */}
      <div className="service-description">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedService}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {sanitizedDescription ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
            ) : (
              <p>Loading description...</p>
            )}
            <a href="#contact" className="get-started-button">
              Get Started
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// ✅ Ensure component is client-side only
export default dynamic(() => Promise.resolve(ServiceSelection), { ssr: false });
