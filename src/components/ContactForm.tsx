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
      return existingItem
        ? prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
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
      <div className="contact-form">
        <h2 className="contact-heading">Contact Me</h2>
        <p className="contact-description">Let’s talk about how I can help your business.</p>

        <form onSubmit={() => {}} className="contact-inputs">
          <input type="text" name="honeypot" className="hidden" />

          <div className="input-group">
            <label>Your Name</label>
            <input type="text" name="name" required />
          </div>

          <div className="input-group">
            <label>Your Email</label>
            <input type="email" name="email" required />
          </div>

          <div className="input-group">
            <label>Your Message</label>
            <textarea name="message" required />
          </div>

          <div className="contact-buttons">
            <button type="submit" className="btn-primary">Send Message</button>
            <Link href={GOOGLE_MEETING_LINK} target="_blank" className="btn-primary text-center">
              Book a Meeting
            </Link>
          </div>
        </form>
      </div>

      {/* ✅ Right Side - Buy Now with Cart */}
      <div className="cart-container">
        <h2 className="cart-heading">Buy Now</h2>
        <p className="cart-description">Instantly purchase our ready-made solutions.</p>

        <div className="product-list">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="product-card">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-price">£{product.price} {product.type === "subscription" && "/ month"}</p>
              <button onClick={() => addToCart(product)} className="btn-primary">
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* ✅ Cart Summary */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <h3 className="cart-title">Cart</h3>
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <button onClick={() => removeFromCart(item.id)} className="btn-remove">✕</button>
                </li>
              ))}
            </ul>
            <button onClick={handleCheckout} className="btn-checkout">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
