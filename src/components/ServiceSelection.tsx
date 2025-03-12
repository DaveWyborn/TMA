"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Wireframe from "@/components/Wireframe"; // Import the Wireframe component
import analyticsDescription from "./services/analytics";
import visualisationDescription from "./services/visualisation";
import consentDescription from "./services/consent";

const services = [
  { id: "analytics", title: "Website Analytics", description: analyticsDescription, icon: "/icons/analytics.svg" },
  { id: "visualisation", title: "Data Visualisation", description: visualisationDescription, icon: "/icons/visualisation.svg" },
  { id: "consent", title: "Consent Management", description: consentDescription, icon: "/icons/consent.svg" },
];

const ServiceSelection = () => {
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <section id="services" className="services-container">
      <h2 className="services-heading">Our Services</h2>

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
              className="mr-4 md:mr-0 md:mb-2 transition-transform duration-300"
            />
            <span className="text-lg text-left md:text-center">{service.title}</span>
          </button>
        ))}
      </div>

      {/* Expanded Wireframe Space */}
      <div className="wireframe-wrapper">
        <Wireframe selectedService={selectedService} />
      </div>

      <button className="popup-button" onClick={openPopup}>Tell me more</button>

      {/* Full Page Overlay */}
      {isPopupOpen && (
        <div className="overlay-container" onClick={closePopup}>
          <motion.div 
            className="overlay-content" 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="close-button" onClick={closePopup}>×</button>
            <h2 className="overlay-title">{services.find((service) => service.id === selectedService)?.title}</h2>
            <div className="overlay-text" dangerouslySetInnerHTML={{
              __html: services.find((service) => service.id === selectedService)?.description ?? "",
            }} />
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default dynamic(() => Promise.resolve(ServiceSelection), { ssr: false });
