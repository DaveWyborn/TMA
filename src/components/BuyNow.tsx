"use client";

import { useState } from "react";

type Tier = {
  name: string;
  volume: string;
  price: number;
  ecommercePrice: number;
  bullets: string[];
};

const tiers: Tier[] = [
  {
    name: "Small Business",
    volume: "0–30k visitors/month",
    price: 29,
    ecommercePrice: 49,
    bullets: [
      "Visual results with simple dashboards",
      "Clear actions & basic recommendations",
      "Standard monitoring & alerts"
    ]
  },
  {
    name: "Growing Business",
    volume: "30k–100k visitors/month",
    price: 49,
    ecommercePrice: 79,
    bullets: [
      "Deeper custom dashboards",
      "Priority performance alerts",
      "Regular strategy check-ins"
    ]
  },
  {
    name: "Established Business",
    volume: "100k+ visitors/month",
    price: 69,
    ecommercePrice: 149,
    bullets: [
      "Fully tailored dashboards & KPIs",
      "Advanced analytics & tracking",
      "Priority support & insights"
    ]
  }
];

export default function BuyNowForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    website: "",
  });

  const [selectedTier, setSelectedTier] = useState(tiers[0].name);
  const [siteType, setSiteType] = useState("marketing");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = { ...formData, tier: selectedTier, siteType };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong. Please try again.");
    }
  };

  const handleEnquiry = async () => {
    const dataToSend = { ...formData, tier: selectedTier, siteType };

    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      alert("Your enquiry has been sent. We'll be in touch soon.");
      setIsFormOpen(false);
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Get Started</h1>

      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setSiteType("marketing")}
          className={
            siteType === "marketing"
              ? "bg-blue-600 text-white px-4 py-2 rounded"
              : "bg-gray-200 px-4 py-2 rounded"
          }
        >
          Marketing Site
        </button>
        <button
          type="button"
          onClick={() => setSiteType("ecommerce")}
          className={
            siteType === "ecommerce"
              ? "bg-blue-600 text-white px-4 py-2 rounded"
              : "bg-gray-200 px-4 py-2 rounded"
          }
        >
          Ecommerce Site
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`border p-6 shadow-md rounded-lg hover:shadow-xl ${
              selectedTier === tier.name ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <h3 className="font-semibold text-lg mb-1">{tier.name}</h3>
            <p className="text-gray-700 text-sm mb-1">{tier.volume}</p>
            <p className="text-xl font-bold mb-4">
              £
              {siteType === "marketing" ? tier.price : tier.ecommercePrice}
              /mo
            </p>
            <ul className="text-sm mb-4 list-disc list-inside space-y-1">
              {tier.bullets.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setSelectedTier(tier.name)}
              className="mt-2 bg-[#1B1F3B] text-white px-4 py-2 rounded hover:bg-[#313863] transition"
            >
              Select
            </button>
          </div>
        ))}
      </div>

      <p className="text-gray-700 mb-8 text-center">
        {siteType === "marketing"
          ? "Need something more complex? Larger marketing sites and multi-domain setups — get in touch to discuss a custom plan."
          : "Larger eCommerce sites like auctions or marketplaces? Get in touch — typical pricing starts at £149/mo."}
      </p>

      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#1B1F3B] text-white px-6 py-3 rounded hover:bg-[#313863]"
        >
          Continue
        </button>
      )}

      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-xl font-bold hover:text-red-600"
              aria-label="Close modal"
              type="button"
            >
              ✕
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="company"
                placeholder="Company Name (optional)"
                value={formData.company}
                onChange={handleChange}
                className="border p-2 w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
              <input
                type="url"
                name="website"
                placeholder="Website URL"
                value={formData.website}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />

              <input type="hidden" name="tier" value={selectedTier} />
              <input type="hidden" name="siteType" value={siteType} />

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleEnquiry}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Make Enquiry
                </button>
                <button
                  type="submit"
                  className="bg-[#1B1F3B] text-white px-4 py-2 rounded hover:bg-[#313863] transition"
                >
                  Make Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}