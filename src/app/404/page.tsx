"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export default function Custom404() {
  const jokes = [
    "Why did the analytics page get a 404? It couldn’t find its path to conversion.",
    "404: Looks like my tracking fell through the cracks — it happens to the best of us.",
    "If I had a pound for every 404, I’d have better tracking budgets.",
    "Looks like you found a page that wasn’t Tailor Made — yet.",
    "This page doesn’t exist. But my sense of humour does."
  ];

  const [joke, setJoke] = useState("");
  const [reported, setReported] = useState(false);

  // Fire GTM event on page load
  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "404_pageview",
        pageType: "404"
      });
    }
    // Pick a random joke
    setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
  }, []);

  const handleReportClick = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "404_manual_report"
      });
    }
    setReported(true);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold mb-4">404 — Tailor Made Error;’s</h1>
      <p className="mb-2">
        Looks like you’ve discovered a page that wasn’t Tailor Made for you — or anyone, really.
        Maybe I forgot to track this one, or the URL went off on its own adventure.
        Either way, it’s definitely my fault — not yours.
      </p>
      <p className="mb-2">
        I should be tracking this error already, but just in case — do us a solid and{" "}
        {!reported ? (
          <button onClick={handleReportClick} className="underline text-blue-600 hover:text-blue-800">
            report it here
          </button>
        ) : (
          <span>Thank you!</span>
        )}
        .
      </p>
      <Link href="/" className="text-blue-600 underline hover:text-blue-800 mb-4">
        🏡 Back to Home
      </Link>
      <p className="text-sm text-gray-500">💡 {joke}</p>
    </main>
  );
}
