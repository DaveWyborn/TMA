"use client";

import { useState } from "react";
import classNames from "classnames";

export default function BuyNow() {
  const [siteType, setSiteType] = useState<"marketing" | "ecommerce">("marketing");

  const tiers = [
    {
      name: "Small Business",
      trafficDescription: "Up to 30,000 visits/month",
      salesDescription: "Up to £10,000 sales/month",
      price: 29,
      ecommercePrice: 39,
    },
    {
      name: "Growing Business",
      trafficDescription: "30k–100k visits/month",
      salesDescription: "£10k–£50k sales/month",
      price: 49,
      ecommercePrice: 69,
    },
    {
      name: "Established Business",
      trafficDescription: "100k+ visits/month",
      salesDescription: "£50k+ sales/month",
      price: 69,
      ecommercePrice: 99,
    },
  ];

  return (
    <section className="buy-now-wrapper py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-4 text-[#1B1F3B]">Choose Your Plan</h1>
      <p className="text-lg text-center mb-8 text-gray-700">
        Your plan includes everything: GTM, dashboards, consent management and monitoring — no hidden extras.
      </p>

      {/* Site type toggle */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setSiteType("marketing")}
          className={classNames(
            "px-4 py-2 border rounded transition",
            siteType === "marketing"
              ? "bg-[#1B1F3B] text-white border-[#1B1F3B]"
              : "bg-white text-[#1B1F3B] border-[#1B1F3B]"
          )}
        >
          Marketing / Brochure Site
        </button>
        <button
          onClick={() => setSiteType("ecommerce")}
          className={classNames(
            "px-4 py-2 border rounded transition",
            siteType === "ecommerce"
              ? "bg-[#1B1F3B] text-white border-[#1B1F3B]"
              : "bg-white text-[#1B1F3B] border-[#1B1F3B]"
          )}
        >
          Online Store
        </button>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div key={tier.name} className="flex flex-col h-full">
            <div
              className="border rounded-lg p-6 shadow-md hover:shadow-[0_6px_15px_rgba(173,114,249,0.5)] transition flex flex-col h-full"
            >
              <h3 className="text-2xl font-semibold mb-2 text-[#1B1F3B]">{tier.name}</h3>
              <p className="text-sm text-[#1B1F3B] mb-4">
                {siteType === "marketing" ? tier.trafficDescription : tier.salesDescription}
              </p>
              <p className="text-3xl font-bold mb-4 text-[#1B1F3B]">
                £{siteType === "marketing" ? tier.price : tier.ecommercePrice}{" "}
                <span className="text-base font-normal">/month</span>
              </p>
              <ul className="text-sm text-[#1B1F3B] mb-4 space-y-2">
                <li>✅ Clear, accurate tracking from day one</li>
                <li>✅ Simple dashboard to see what’s working</li>
                <li>✅ Fully compliant data collection</li>
                {tier.name !== "Small Business" && (
                  <li>✅ Proactive checks & insights each month</li>
                )}
                {tier.name === "Established Business" && (
                  <>
                    <li>✅ Customised reporting for your goals</li>
                    <li>✅ Priority support & personal optimisation tips</li>
                  </>
                )}
              </ul>
              <button className="w-full bg-[#1B1F3B] text-white py-2 rounded hover:bg-[#313863] transition mt-auto">
                Get Started
              </button>
            </div>
          </div>
        ))}
      </div>

      {siteType === "ecommerce" && (
        <p className="text-xs text-gray-500 mt-6 text-center">
          Larger eCommerce sites like auctions or marketplaces? Get in touch — typical pricing starts at £149/mo.
        </p>
      )}
      {siteType === "marketing" && (
        <p className="text-xs text-gray-500 mt-6 text-center">
          Larger marketing sites with multiple brands or special requirements? Get in touch for a custom plan.
        </p>
      )}
    </section>
  );
}