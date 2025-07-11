"use client";

import { useState } from "react";

const BookingForm = ({
  tier,
  standard,
  premium,
}: {
  tier: string;
  standard: string[];
  premium: string[];
}) => {
  const [form, setForm] = useState({ name: "", email: "", url: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send data to your email backend OR API
    console.log("Form submitted", {
      ...form,
      tier,
      standard,
      premium,
    });
    // TODO: Redirect to Google Calendar link
    window.location.href = "YOUR_GOOGLE_CAL_BOOKING_URL";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 border p-4 rounded-lg max-w-md mx-auto"
    >
      <h4 className="text-lg font-semibold mb-4">Tell us about you</h4>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="url"
        placeholder="Website URL"
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-[#1B1F3B] text-white px-6 py-3 rounded hover:bg-[#313863] transition"
      >
        Submit & Book a Call
      </button>
    </form>
  );
};

export default BookingForm;
