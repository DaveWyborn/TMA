"use client";

import { useState } from "react";
import TierCard from "./TierCard";
import ServiceBox from "./ServiceBox";
import BuyNowModal from "./BuyNowModal";

const BuyNow = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPremium, setSelectedPremium] = useState<string[]>([]);
  const [currentTier, setCurrentTier] = useState("Tracker");
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeTagline, setActiveTagline] = useState<string | null>(null);

  const allServices = [
    {
      name: "Basic Reporting Dashboard",
      type: "Add-on",
      tagline: "Your key metrics in one simple report.",
      popular: true,
    },
    {
      name: "GA4 Setup",
      type: "Included",
      tagline: "Best-practice Google Analytics property.",
      popular: true,
    },
    {
      name: "GTM Tracking",
      type: "Included",
      tagline: "Track key events with Google Tag Manager.",
      popular: false,
    },
    {
      name: "Consent Management",
      type: "Included",
      tagline: "Built-in GDPR consent, tailored for GA4.",
      popular: false,
    },
    {
      name: "Uptime Monitoring",
      type: "Included",
      tagline: "Peace of mind — we watch your site so you don’t have to.",
      popular: false,
    },
    {
      name: "Funnel Analysis",
      type: "Add-on",
      tagline: "Spot drop-offs and optimise your funnels.",
      popular: false,
    },
    {
      name: "Google Business Profile Setup",
      type: "Add-on",
      tagline: "Get your local business verified & visible.",
      popular: false,
    },
    {
      name: "Google Search Console",
      type: "Add-on",
      tagline: "Monitor indexing and search performance.",
      popular: false,
    },
    {
      name: "Advanced Reporting Dashboard",
      type: "Advanced",
      tagline: "Bespoke Looker Studio dashboards with deep insights.",
      popular: true,
    },
    {
      name: "SEO Reporting",
      type: "Advanced",
      tagline: "Track keyword rankings and organic trends.",
      popular: true,
    },
    {
      name: "Competitor Dashboards",
      type: "Advanced",
      tagline: "Benchmark your SEO against key rivals.",
      popular: false,
    },
    {
      name: "E-commerce Reporting",
      type: "Advanced",
      tagline: "Enhanced e-commerce tracking & insights.",
      popular: true,
    },
    {
      name: "TAG Gateway / Server Side Tracking",
      type: "Advanced",
      tagline: "Better privacy & data control with server-side tagging.",
      popular: false,
    },
  ];

  const handleToggle = (serviceName: string, type: string) => {
    const selected = type === "Advanced" ? selectedPremium : selectedServices;

    const updated = selected.includes(serviceName)
      ? selected.filter((s) => s !== serviceName)
      : [...selected, serviceName];

    if (type === "Advanced") {
      setSelectedPremium(updated);
    } else {
      setSelectedServices(updated);
    }

    const totalCount =
      (type === "Advanced" ? selectedServices.length : updated.length) +
      ((type === "Advanced" ? updated.length : selectedPremium.length) * 3);

    if (totalCount === 0) setCurrentTier("Tracker");
    else if (totalCount <= 2) setCurrentTier("Explorer");
    else if (totalCount <= 4) setCurrentTier("Adventurer");
    else setCurrentTier("Trailblazer");
  };

  return (
    <section id="buy-now" className="buy-now-section">
      <h2 className="text-2xl font-bold mb-2 text-[var(--primary-color)]">
        Explore Our Services
      </h2>
      <p className="text-base mb-8 text-gray-700 max-w-xl text-center">
        Pick the services you’re interested in — we’ll help you decide what’s right for your goals.
      </p>

      <div className="buy-now-container overflow-y-auto max-h-[70vh]">
        {/* 🟢 Services on the left */}
        <div className="services-column">
          <ServiceBox
            title="Our Services"
            intro="Select as many services as you like. We’ll suggest the best plan for your needs."
            services={allServices}
            selected={[...selectedServices, ...selectedPremium]}
            onToggle={handleToggle}
            activeTagline={activeTagline}
            setActiveTagline={setActiveTagline}
          />
        </div>

        {/* 🟢 Tiers on the right */}
        <div className="tiers-column">
          {[
            { tier: "Tracker", price: "£29" },
            { tier: "Explorer", price: "£49" },
            { tier: "Adventurer", price: "£69" },
            { tier: "Trailblazer", price: "£89" },
          ].map(({ tier, price }) => (
            <TierCard
              key={tier}
              tier={tier}
              isActive={currentTier === tier}
              price={price}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4 max-w-xl mx-auto">
        Tiers and prices are just indicators — we’ll shape your plan around your goals and budget. Ready to move on?
      </p>

      {/* ✅ New modal-based CTAs */}
      <div className="buy-now-form flex flex-wrap justify-center gap-4 mt-4">
        <button
          onClick={() => setIsCallModalOpen(true)}
          className="border border-[var(--primary-color)] bg-white text-[var(--primary-color)] px-6 py-3 rounded hover:shadow-md transition"
        >
          Book a Call
        </button>
        <button
          onClick={() => setIsContactModalOpen(true)}
          className="border border-[var(--accent-soft)] bg-white text-[var(--primary-color)] px-6 py-3 rounded hover:shadow-md transition"
        >
          Contact Us
        </button>
      </div>

      {/* ✅ Book a Call Modal */}
     <BuyNowModal
  isOpen={isCallModalOpen}
  onClose={() => setIsCallModalOpen(false)}
  title="Book a Call"
  type="call"  
/>

      {/* ✅ Contact Us Modal */}
      <BuyNowModal
  isOpen={isContactModalOpen}
  onClose={() => setIsContactModalOpen(false)}
  title="Contact Us"
  type="contact" 
/>

    </section>
  );
};

export default BuyNow;
