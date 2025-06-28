"use client";

import { useState } from "react";

export default function BuyNowForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    website: "",
    tier: "Small Business",
    siteType: "marketing",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Get Started</h1>
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

        <label className="block">Choose Tier</label>
        <select name="tier" value={formData.tier} onChange={handleChange} className="border p-2 w-full">
          <option>Small Business</option>
          <option>Growing Business</option>
          <option>Established Business</option>
        </select>

        <label className="block">Site Type</label>
        <select name="siteType" value={formData.siteType} onChange={handleChange} className="border p-2 w-full">
          <option value="marketing">Marketing</option>
          <option value="ecommerce">Ecommerce</option>
        </select>

        <button
          type="submit"
          className="bg-[#1B1F3B] text-white px-4 py-2 rounded hover:bg-[#313863] transition"
        >
          Continue to Payment
        </button>
      </form>
    </section>
  );
}