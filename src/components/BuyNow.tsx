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

  const [callReason, setCallReason] = useState("Discuss pricing");

  const [selectedTier, setSelectedTier] = useState(tiers[1].name);
  const [siteType, setSiteType] = useState("marketing");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalView, setModalView] = useState<"decision" | "callForm" | "paymentForm">("decision");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCallReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCallReason(e.target.value);
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
    const dataToSend = { ...formData, tier: selectedTier, siteType, callReason };

    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      alert("Your enquiry has been sent. We'll be in touch soon.");
      setIsFormOpen(false);
      setModalView("decision");
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  const openModal = () => {
    setIsFormOpen(true);
    setModalView("decision");
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setModalView("decision");
  };

  return (
    <section className="w-full p-4 bg-white text-gray-900">
      <h1 className="text-2xl font-bold mb-4">Flexible Plans That Grow With You</h1>
      <p className="text-gray-700 mb-4">
        Choose a plan that suits you best. You can make a payment now or book a call to chat it through — no commitment needed.
      </p>

      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => { setSiteType("marketing"); setSelectedTier("Growing Business"); }}
          className={
            siteType === "marketing"
              ? "bg-[#AD72F9] text-white px-4 py-2 rounded hover:bg-[#8a4bdc]"
              : "bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          }
        >
          Marketing Site
        </button>
        <button
          type="button"
          onClick={() => { setSiteType("ecommerce"); setSelectedTier("Growing Business"); }}
          className={
            siteType === "ecommerce"
              ? "bg-[#AD72F9] text-white px-4 py-2 rounded hover:bg-[#8a4bdc]"
              : "bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          }
        >
          Ecommerce Site
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            onClick={() => setSelectedTier(tier.name)}
            className={`border p-6 pt-6 shadow-md rounded-lg cursor-pointer transition-colors flex flex-col h-full ${
              selectedTier === tier.name ? "border-[#AD72F9] shadow-lg ring-2 ring-[#AD72F9]" : "border-gray-300"
            } hover:border-[#AD72F9] hover:shadow-xl`}
          >
            {tier.name === "Growing Business" && (
              <span className="inline-block bg-[#AD72F9] text-white text-xs px-2 py-1 rounded mb-2">
                Most Popular
              </span>
            )}
            <h3 className="font-semibold text-lg mb-1">{tier.name}</h3>
            <p className="text-gray-700 text-sm mb-1">
              {siteType === 'marketing'
                ? tier.volume
                : index === 0
                  ? 'Up to £10k online sales per month'
                  : index === 1
                    ? '£10k–£50k online sales per month'
                    : '£50k+ online sales per month'}
            </p>
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
              onClick={(e) => { e.stopPropagation(); openModal(); }}
              className={`mt-auto px-4 py-2 rounded transition ${
                selectedTier === tier.name
                  ? "bg-[#AD72F9] text-white hover:bg-[#8a4bdc]"
                  : "bg-gray-200 text-gray-800 hover:bg-[#AD72F9] hover:text-white"
              }`}
            >
              Select
            </button>
          </div>
        ))}
      </div>

      <p className="text-gray-700 mb-8 text-center">
        Not sure which plan fits? If you feel your needs are different — or the price feels out of reach for your situation —
        <a href="/book-call" className="text-[#AD72F9] underline ml-1">book a call</a> and we&rsquo;ll find the right fit together.
      </p>

      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-xl font-bold hover:text-red-600"
              aria-label="Close modal"
              type="button"
            >
              ✕
            </button>

            {modalView === "decision" && (
              <>
                <h2 className="text-xl font-bold mb-6 text-center">Choose an Action</h2>
                <p className="text-gray-700 mb-4 text-center">
                  You&rsquo;ve chosen {selectedTier} for a {siteType} site.
                  <br />
                  Price: £{siteType === "marketing"
                    ? tiers.find(t => t.name === selectedTier)?.price
                    : tiers.find(t => t.name === selectedTier)?.ecommercePrice
                  }/mo
                </p>
                <ul className="text-sm mb-4 list-disc list-inside space-y-1">
                  {tiers.find(t => t.name === selectedTier)?.bullets.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mb-4 text-center">
                  How would you like to proceed?
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <button
                    type="button"
                    onClick={() => setModalView("callForm")}
                    className="flex-1 bg-gray-500 text-white px-6 py-6 rounded text-lg font-semibold hover:bg-gray-700"
                  >
                    Book a Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalView("paymentForm")}
                    className="flex-1 bg-[#AD72F9] text-white px-6 py-6 rounded text-lg font-semibold hover:bg-[#8a4bdc] transition"
                  >
                    Make Payment
                  </button>
                </div>
              </>
            )}

            {modalView === "callForm" && (
              <>
                <h2 className="text-xl font-bold mb-2">Book a Call</h2>
                <p className="text-gray-700 mb-4">
                  You have selected {selectedTier} for a {siteType} site.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); handleEnquiry(); }} className="space-y-4">
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
                  <label className="block text-gray-700 font-semibold">
                    What do you hope to get from the call?
                    <select
                      name="callReason"
                      value={callReason}
                      onChange={handleCallReasonChange}
                      className="border p-2 w-full mt-1"
                      required
                    >
                      <option value="Discuss pricing">Discuss pricing</option>
                      <option value="Clarify features">Clarify features</option>
                      <option value="Just want to meet you">Just want to meet you</option>
                      <option value="Other">Other</option>
                    </select>
                    {callReason === "Other" && (
                      <textarea
                        name="otherReason"
                        placeholder="Tell us more"
                        className="border p-2 w-full mt-2"
                      ></textarea>
                    )}
                  </label>

                  <input type="hidden" name="tier" value={selectedTier} />
                  <input type="hidden" name="siteType" value={siteType} />

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setModalView("decision")}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Send Enquiry
                    </button>
                  </div>
                </form>
              </>
            )}

            {modalView === "paymentForm" && (
              <>
                <h2 className="text-xl font-bold mb-2">Make Payment</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Please note: This plan is billed as a 12-month minimum contract.
                </p>
                <p className="text-gray-700 mb-4">
                  You have selected {selectedTier} for a {siteType} site.
                </p>
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

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setModalView("decision")}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-[#AD72F9] text-white px-4 py-2 rounded hover:bg-[#8a4bdc] transition"
                    >
                      Make Payment
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}