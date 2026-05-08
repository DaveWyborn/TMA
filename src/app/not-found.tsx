"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";
import FooterSection from "../components/FooterSection";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const jokes = [
  "Why did the analytics page get a 404? It couldn't find its path to conversion.",
  "Looks like my tracking fell through the cracks — it happens to the best of us.",
  "If I had a pound for every 404, I'd have better tracking budgets.",
  "Looks like you found a page that wasn't Tailor Made — yet.",
  "This page doesn't exist. But our sense of humour does.",
];

export default function Custom404() {
  const [joke, setJoke] = useState("");
  const [reported, setReported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "404_pageview",
        pageType: "404",
      });
    }
    setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
  }, []);

  const handleReportClick = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event: "404_manual_report" });
    }
    setReported(true);
  };

  return (
    <>
      <NavBar />

      <main
        className="px-6 md:px-12"
        style={{
          background: "var(--paper)",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="max-w-3xl py-16 md:py-24">
          <p
            className="num-tag"
            style={{ fontSize: "clamp(4rem, 12vw, 8rem)", marginBottom: "1rem" }}
          >
            404
          </p>
          <h1
            className="display"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginBottom: "1.25rem",
            }}
          >
            This one wasn&rsquo;t Tailor Made.
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "var(--ink-soft)",
              lineHeight: 1.6,
              maxWidth: "60ch",
              marginBottom: "1rem",
            }}
          >
            You&rsquo;ve hit a page that doesn&rsquo;t exist — either we forgot
            to track it, or the URL went off on its own adventure. Either way,
            it&rsquo;s on us.
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "var(--ink-soft)",
              lineHeight: 1.6,
              maxWidth: "60ch",
              marginBottom: "2rem",
            }}
          >
            Our error tracking should already have this, but if you fancy
            helping out,{" "}
            {!reported ? (
              <button
                onClick={handleReportClick}
                className="signal-link"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                report it here
              </button>
            ) : (
              <span style={{ color: "var(--signal)" }}>thank you.</span>
            )}
            {!reported && "."}
          </p>

          <div className="flex gap-3 flex-wrap" style={{ marginBottom: "3rem" }}>
            <Link href="/" className="btn-ink">
              ← Back to home
            </Link>
            <Link href="/seo-tools" className="btn-ghost">
              Try the tools
            </Link>
          </div>

          <p
            className="label-mono"
            style={{
              textTransform: "none",
              letterSpacing: "0.02em",
              fontSize: "13px",
              fontStyle: "italic",
              color: "var(--muted)",
              maxWidth: "60ch",
            }}
          >
            {joke}
          </p>
        </div>
      </main>

      <FooterSection />
    </>
  );
}
