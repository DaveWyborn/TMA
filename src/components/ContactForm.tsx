"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY!);
const GOOGLE_MEETING_LINK = process.env.NEXT_PUBLIC_GOOGLE_MEETING_LINK;

const PRODUCTS = [
  { id: "template", name: "Looker Studio Template", price: 250, stripeId: "price_template_stripe_id", type: "one-time" },
  { id: "tracking", name: "Website Tracking Package", price: 170, stripeId: "price_tracking_stripe_id", type: "one-time" },
  { id: "consent", name: "Consent Manager Subscription", price: 12, stripeId: "price_consent_stripe_id", type: "subscription" },
];

export default function ContactForm() {
  const [cart, setCart] = useState<{ id: string; name: string; price: number; stripeId: string; type: string; quantity: number }[]>([]);

  const addToCart = (product: typeof PRODUCTS[number]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });

    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <section id="contact" className="contact-container">
      {/* ✅ Left Side - Contact Form & Booking */}
      <div className="contact-left">
        <h2 className="text-3xl font-semibold mb-6 text-center">Contact Me</h2>
        <p className="text-lg text-center max-w-2xl">Let’s talk about how I can help your business.</p>

        <form onSubmit={() => {}} className="mt-6 max-w-lg mx-auto flex flex-col space-y-6">
          <input type="text" name="honeypot" className="hidden" />

          <div className="relative w-full">
            <label>Your Name</label>
            <input type="text" name="name" className="w-full border-b-2 focus:border-primary outline-none bg-transparent py-2 transition-all" required />
          </div>

          <div className="relative w-full">
            <label>Your Email</label>
            <input type="email" name="email" className="w-full border-b-2 focus:border-primary outline-none bg-transparent py-2 transition-all" required />
          </div>

          <div className="relative w-full">
            <label>Your Message</label>
            <textarea name="message" className="w-full border-b-2 focus:border-primary outline-none bg-transparent py-2 transition-all resize-none" required />
          </div>

          <div className="flex flex-col space-y-4">
            <button type="submit" className="contact-button">
              Send Message
            </button>

            <Link href={GOOGLE_MEETING_LINK} target="_blank" className="contact-button text-center">
              Book a Meeting
            </Link>
          </div>
        </form>
      </div>

      {/* ✅ Right Side - Buy Now */}
      <div className="contact-right">
        <h2 className="contact-header">Buy Now</h2>
        <p className="contact-subheader">Instantly purchase our ready-made solutions.</p>

        {/* ✅ Product List Positioned Below Subheader */}
        <div className="cart-container mt-6">
          <div className="w-full max-w-md space-y-4">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="cart-item">
                <span className="product-name">{product.name}</span>
                <span className="product-price">£{product.price} {product.type === "subscription" && "/ month"}</span>
                <button onClick={() => addToCart(product)} className="contact-button add-to-cart">
                  +
                </button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="mt-6 w-full max-w-md bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Cart</h3>
              <ul className="mt-2 space-y-2">
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">✕</button>
                  </li>
                ))}
              </ul>
              <button onClick={handleCheckout} className="contact-button mt-4 w-full">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
