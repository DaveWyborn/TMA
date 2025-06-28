"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import ServiceModal from "./ServiceModal";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: string[];
};

const services: Service[] = [
  
  {
    id: "tracking",
    title: "Accurate Tracking",
    description: "Confidently measure what matters most to you.",
    icon: "/icons/tracking.svg",
    points: ["Google Tag Manager setup", "Key events tracked correctly", "No data leaks or gaps"],
  },
  
  {
    id: "visual",
    title: "Visual Results",
    description: "We deliver clear reporting and insights so you can see what works.",
    icon: "/icons/visual.svg",
    points: ["Looker Studio dashboards with live data", "Easy sharing with your team", "Actionable insights"],
  },
  
  {
    id: "consent",
    title: "Privacy & Compliance",
    description: "Stay compliant and build trust with your visitors.",
    icon: "/icons/consent.svg",
    points: ["Consent banners", "User preferences", "Automatic updates when rules change"],
  },
  {
    id: "peace",
    title: "Peace of Mind",
    description: "We monitor and maintain your setup so you can focus on your business.",
    icon: "/icons/peace.svg",
    points: ["Ongoing monitoring", "Proactive fixes", "Support when you need it"],
  },
];

const ServiceSelection = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section
      id="services"
      className="w-full min-h-screen flex flex-col items-center justify-center bg-white scroll-snap-align-start pt-24 md:pt-0 text-gray-800 px-4"
    >
      <h2 className="text-3xl font-semibold text-[#1B1F3B] mb-4 text-center">
        Our Bundled Services
      </h2>
      <p className="mb-12 text-lg text-gray-600 text-center max-w-3xl">
        You get all this in every package — no complicated add-ons, just
        everything you need.
      </p>

      <div className="services-list grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="service-item flex items-start space-x-4 p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-left w-full"
          >
            <Image
              src={service.icon}
              alt={service.title}
              width={48}
              height={48}
              className="flex-shrink-0"
            />
            <div>
              <h3 className="text-xl font-semibold text-[#1B1F3B] mb-2">
                {service.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {service.description.split("\n")[0]}...
              </p>
              <span className="text-sm text-[#1B1F3B] underline mt-2 inline-block">
                Read More
              </span>
            </div>
          </button>
        ))}
      </div>

      <ServiceModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.title || ""}
        details={selectedService?.description || ""}
        points={selectedService?.points || []}
      />
    </section>
  );
};

export default dynamic(() => Promise.resolve(ServiceSelection), { ssr: false });