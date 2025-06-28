"use client";

import { useState, useMemo, useCallback } from "react";
import pricingData from "@/data/tiered_pricing_data.json";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY!);
const GOOGLE_MEETING_LINK = process.env.NEXT_PUBLIC_GOOGLE_MEETING_LINK;

// const OWNER_EMAIL = process.env.NEXT_PUBLIC_BOOKING_NOTIFICATION_EMAIL;
// TODO: Reserved for booking notification emails later

type ToggleGroupProps = {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

const ToggleGroup = ({ label, options, value, onChange }: ToggleGroupProps) => (
  <div className="toggle-group">
    <span>{label}</span>
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={classNames("toggle-btn", { active: value === opt.value })}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

type PricingItem = {
  Service: string;
  "Service Name": string;
  "Pricing Agency": number;
  "Pricing Individual": number;
  "Pricing Type": string;
  "Existing Setup": string;
  Tier?: string;
  FastCheckout?: boolean;
  quantity?: number;
  price?: number;
  [key: string]: unknown; // ✅ Replaced 'any' with 'unknown'
};

type PricingCardProps = {
  item: PricingItem;
  price: number;
  // onAddToCart: (item: PricingItem, price: number) => void;
};

const PricingCard = ({ item, price }: PricingCardProps) => (
  <motion.div
    className={classNames("product-block", item.Tier === "Pro" && "highlighted")}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {item.Tier === "Pro" && <span className="badge">Best for eCommerce</span>}
    <h3>{item["Service Name"]}</h3>
    <p className="price">
      £{price}
      {item["Pricing Type"].includes("Monthly") ? "/mo" : ""}
    </p>
    <ul>
      {
        [...Array(5)].map(
          (_, i) =>
            item[`Feature ${i + 1}`] && (
              <li key={i}>
                {item[`Feature ${i + 1}`] as React.ReactNode}
              </li>
            )
        ) as React.ReactNode[]
      }
    </ul>
    {/* <button onClick={() => onAddToCart(item, price)}>Add to Selection</button> */}
  </motion.div>
);

export default function BuyNow() {
  const [userType, setUserType] = useState("agency");
  const [setupType, setSetupType] = useState("new");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [cart, setCart] = useState<PricingItem[]>([]);
  const [email, setEmail] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const filterByCategory = (category: string): PricingItem[] =>
    pricingData.filter((item) =>
      item.Service.toLowerCase().includes(category.toLowerCase())
    );

  const filterCards = useCallback(
    (list: PricingItem[]): PricingItem[] => {
      return list.filter((item) => {
        const setupMatch =
          item["Existing Setup"] === "N/A" ||
          (setupType === "existing" && item["Existing Setup"] === "Yes") ||
          (setupType === "new" && item["Existing Setup"] === "No");
        return setupMatch;
      });
    },
    [setupType]
  );

  const getPrice = (item: PricingItem): number => {
    const basePrice =
      userType === "agency" ? item["Pricing Agency"] : item["Pricing Individual"];
    return billingCycle === "annual" && item["Pricing Type"].includes("Monthly")
      ? basePrice * 10
      : basePrice;
  };

  // const handleAddToCart = (item: PricingItem, price: number) => {
  //  setCart((prev) => {
  //    const existing = prev.find((i) => i.Service === item.Service);
  //    if (existing) {
  //      return prev.map((i) =>
  //        i.Service === item.Service ? { ...i, quantity: i.quantity + 1 } : i
  //      );
  //    }
  //    return [...prev, { ...item, price, quantity: 1 }];
  //  });
  //};

  const handleRemoveFromCart = (service: string) => {
    setCart((prev) => prev.filter((i) => i.Service !== service));
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

  const handleBookCall = async () => {
    const summary = cart
      .map((i) => `- ${i["Service Name"]} (£${i.price})`)
      .join("\n");

    await fetch("/api/book-call-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        bcc: !!email,
        items: summary,
      }),
    });

    setEmailConfirmed(true);
    window.open(
      `${GOOGLE_MEETING_LINK}?details=${encodeURIComponent(summary)}`,
      "_blank"
    );
  };

  const allFastCheckout = cart.every((item) => item.FastCheckout === true);

  const analytics = useMemo(
    () => filterCards(filterByCategory("Analytics")),
    [filterCards]
  );
  const reporting = useMemo(
    () => filterCards(filterByCategory("Reporting")),
    [filterCards]
  );
  const consent = useMemo(
    () => filterCards(filterByCategory("Consent")),
    [filterCards]
  );

  return (
    <section id="buy-now" className="buy-now-wrapper">
      <div className="buy-now-inner">
        <h2 className="buy-now-title">Ready to get started?</h2>

        {/* Toggles */}
        <div className="toggles-row">
          <ToggleGroup
            label="User Type"
            value={userType}
            onChange={setUserType}
            options={[
              { label: "Agency", value: "agency" },
              { label: "Individual", value: "individual" },
            ]}
          />
          <ToggleGroup
            label="Setup Type"
            value={setupType}
            onChange={setSetupType}
            options={[
              { label: "Existing", value: "existing" },
              { label: "New", value: "new" },
            ]}
          />
          <ToggleGroup
            label="Billing"
            value={billingCycle}
            onChange={setBillingCycle}
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "Annual", value: "annual" },
            ]}
          />
        </div>

        <div className="buy-now-grid">
          {/* Column 1: Analytics */}
          <div className="buy-column column-analytics">
            <AnimatePresence>
              {analytics.map((item, i) => (
                <PricingCard
                  key={item.Service + i}
                  item={item}
                  price={getPrice(item)}
                  // onAddToCart={handleAddToCart}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Column 2: Reporting */}
          <div className="buy-column column-reporting">
            <AnimatePresence>
              {reporting.map((item, i) => (
                <PricingCard
                  key={item.Service + i}
                  item={item}
                  price={getPrice(item)}
                  //onAddToCart={handleAddToCart}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Column 3: Consent */}
          <div className="buy-column column-consent">
            <AnimatePresence>
              {consent.map((item, i) => (
                <PricingCard
                  key={item.Service + i}
                  item={item}
                  price={getPrice(item)}
                  //onAddToCart={handleAddToCart}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {/* 
      {cart.length > 0 && (
        <div className="cart-sidebar">
          <h4>Your Selection</h4>
          <ul>
            {cart.map((item) => (
              <li key={item.Service}>
                <span>
                  {item["Service Name"]} × {item.quantity}
                </span>
                <div>
                  £{item.price * item.quantity}
                  <button onClick={() => handleRemoveFromCart(item.Service)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {allFastCheckout ? (
            <button onClick={handleCheckout} className="checkout-btn">
              Checkout
            </button>
          ) : (
            <div className="call-to-book">
              <p>
                <strong>This service requires a face-to-face call.</strong>
                <br />
                Don&apos;t worry — we&apos;ll remember your selection and if you
                still want to go ahead after the call, we&apos;ll email you
                instructions on how to complete the order.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (optional)"
              />
              <button onClick={handleBookCall} className="book-call-btn">
                Book a Call
              </button>
              {emailConfirmed && (
                <p className="confirmation-message">
                  Selection sent! We&apos;ve opened the booking link in a new
                  tab.
                </p>
              )}
            </div>
          )}
        </div>
      )}
      */}
    </section>
  );
}