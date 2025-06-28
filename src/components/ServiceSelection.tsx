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
};

const services: Service[] = [
  {
    id: "gtm",
    title: "GTM Setup & Support",
    description: "We help you set up Google Tag Manager for accurate and efficient data tracking.\nIncludes support for custom events, tags, and troubleshooting.",
    icon: "/icons/gtm.svg",
  },
  {
    id: "looker",
    title: "Custom Looker Dashboard",
    description: "Get tailored dashboards that visualize your key metrics clearly and effectively.\nWe build views that match your business goals.",
    icon: "/icons/looker.svg",
  },
  {
    id: "consent",
    title: "Consent Management",
    description: "Ensure compliance with privacy laws through effective consent management solutions.\nIntegrated with your site for a seamless user experience.",
    icon: "/icons/consent.svg",
  },
  {
    id: "monitoring",
    title: "Ongoing Monitoring & Updates",
    description: "Continuous monitoring and updates to keep your analytics accurate and up to date.\nProactive alerts and recommendations.",
    icon: "/icons/monitoring.svg",
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
      />
    </section>
  );
};

export default dynamic(() => Promise.resolve(ServiceSelection), { ssr: false });