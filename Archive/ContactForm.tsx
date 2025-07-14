"use client";

import { useState } from "react";

const ContactForm = ({
  tier,
  standard,
  premium,
}: {
  tier: string;
  standard: string[];
  premium: string[];
}) => {
  const [form, setForm] = useState({ name: "", email: "", url: "", comment: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact Form Submitted:", {
      ...form,
      tier,
      standard,
      premium,
    });
    alert("Thanks! We’ll be in touch shortly.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 border p-4 rounded-lg max-w-md mx-auto bg-white text-[var(--primary-color)]"
    >
      <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
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
      <textarea
        placeholder="Tell us more about your requirements..."
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        rows={4}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        type="submit"
        className="border border-[var(--accent-soft)] bg-white text-[var(--primary-color)] px-6 py-3 rounded hover:shadow-md transition"
      >
        Submit
      </button>
    </form>
  );
};

export default ContactForm;
