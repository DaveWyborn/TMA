"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const services = [
  {
    id: "gtm",
    title: "GTM Setup & Support",
    description:
      "We help you set up Google Tag Manager for accurate and efficient data tracking.",
    icon: "/icons/gtm.svg",
  },
  {
    id: "looker",
    title: "Custom Looker Dashboard",
    description:
      "Get tailored dashboards that visualize your key metrics clearly and effectively.",
    icon: "/icons/looker.svg",
  },
  {
    id: "consent",
    title: "Consent Management",
    description:
      "Ensure compliance with privacy laws through effective consent management solutions.",
    icon: "/icons/consent.svg",
  },
  {
    id: "monitoring",
    title: "Ongoing Monitoring & Updates",
    description:
      "Continuous monitoring and updates to keep your analytics accurate and up to date.",
    icon: "/icons/monitoring.svg",
  },
];

const ServiceSelection = () => {
  return (
    <section
      id="services"
      className="w-full min-h-screen flex flex-col items-center justify-center bg-white scroll-snap-align-start pt-24 md:pt-0 text-gray-800 px-4"
    >
      <h2 className="text-3xl font-semibold text-[#1B1F3B] mb-12 text-center">
        Our Bundled Services
      </h2>

      <div className="services-list grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
        {services.map((service) => (
          <div
            key={service.id}
            className="service-item flex items-start space-x-4 p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
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
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default dynamic(() => Promise.resolve(ServiceSelection), { ssr: false });