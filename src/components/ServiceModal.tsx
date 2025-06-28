"use client";

import { useState } from "react";
import ServiceModal from "./ServiceModal";

const services = [
  {
    id: "visual",
    title: "Visual Results",
    description: "We deliver clear reporting and insights so you can see what works.",
    points: [
      "Looker Studio dashboards with live data",
      "Easy sharing with your team",
      "Actionable insights",
    ],
  },
  {
    id: "tracking",
    title: "Accurate Tracking",
    description: "Confidently measure what matters most to you.",
    points: [
      "Google Tag Manager setup",
      "Key events tracked correctly",
      "No data leaks or gaps",
    ],
  },
  {
    id: "consent",
    title: "Privacy & Compliance",
    description: "Stay compliant and build trust with your visitors.",
    points: [
      "Consent banners",
      "User preferences",
      "Automatic updates when rules change",
    ],
  },
  {
    id: "peace",
    title: "Peace of Mind",
    description: "We monitor and maintain your setup so you can focus on your business.",
    points: [
      "Ongoing monitoring",
      "Proactive fixes",
      "Support when you need it",
    ],
  },
];

export default function ServiceSelection() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const service = services.find((s) => s.id === selectedService);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map(({ id, title, description }) => (
        <div
          key={id}
          className="cursor-pointer p-6 border rounded-lg hover:shadow-lg transition"
          onClick={() => setSelectedService(id)}
        >
          <h4 className="text-xl font-semibold mb-2">{title}</h4>
          <p className="text-gray-600">{description}</p>
        </div>
      ))}

      {service && (
        <ServiceModal
          isOpen={true}
          onClose={() => setSelectedService(null)}
          title={service.title}
          details={service.description}
          points={service.points}
        />
      )}
    </div>
  );
}