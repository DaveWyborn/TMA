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
    <section id="contact" className="w-full h-screen flex flex-col md:flex-row">
      {/* ✅ Right Side - Buy Now Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-[#0B0016] text-white p-10 h-full">
        <h2 className="text-3xl font-semibold text-[#AD72F9] mb-6 text-center">Buy Now</h2>
        <p className="text-lg text-gray-300 text-center max-w-2xl mb-6">Instantly purchase our ready-made solutions.</p>

        <div className="w-full max-w-md space-y-6">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="p-4 border border-gray-700 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-[#AD72F9]">{product.name}</h3>
              <p className="text-gray-400">£{product.price} {product.type === "subscription" && "/ month"}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 px-6 py-2 border border-[#AD72F9] text-[#AD72F9] rounded-md hover:bg-[#AD72F9] hover:text-white transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* ✅ Cart Summary (Fixed Height to Prevent Movement) */}
        <div className="mt-6 w-full max-w-md bg-gray-800 p-4 rounded-lg transition-all duration-300"
             style={{ height: "180px", overflow: "hidden", visibility: cart.length > 0 ? "visible" : "hidden" }}>
          <h3 className="text-lg font-semibold text-white">Cart</h3>

          {cart.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-gray-300">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500">✕</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm mt-2">Your cart is empty.</p>
          )}

          <button
            onClick={handleCheckout}
            className={`mt-4 w-full py-3 bg-[#6C04DC] text-white rounded-lg hover:bg-[#AD72F9] transition ${
              cart.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}
