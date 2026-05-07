"use client";

import Link from "next/link";
import Wordmark from "./Wordmark";

const steps = ["Discover", "Recommend", "Build", "Monitor", "Improve"];

export default function FooterSection() {
  return (
    <footer
      id="footer"
      className="px-6 md:px-12 py-20"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="max-w-5xl">
        <p className="brand-tag mb-10" style={{ color: "var(--paper-on-ink)" }}>
          06 <span className="dot">·</span> HOW WE WORK
        </p>

        <div className="flex flex-wrap items-baseline gap-3 mb-16">
          {steps.map((s, i) => (
            <span key={s} className="flex items-baseline gap-3">
              <span
                className="num-tag"
                style={{ fontSize: "12px", color: "var(--paper-on-ink)" }}
              >
                0{i + 1}
              </span>
              <span
                className="display"
                style={{
                  fontSize: "clamp(20px, 3vw, 28px)",
                  color: "var(--paper)",
                }}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <span style={{ color: "var(--signal)" }}>—</span>
              )}
            </span>
          ))}
        </div>

        <div
          className="hairline border-t pt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-10"
          style={{ borderColor: "var(--ink-soft)" }}
        >
          <Wordmark size={22} inverted />

          <div className="flex flex-col md:items-end gap-2">
            <p className="label-mono" style={{ color: "var(--paper-on-ink)" }}>
              Tailor Made Analytics &copy; {new Date().getFullYear()} · Built in
              the UK
            </p>
            <p className="label-mono" style={{ color: "var(--paper-on-ink)" }}>
              <Link href="/privacy-policy" className="signal-link on-ink">
                Privacy
              </Link>
              {" · "}
              <Link href="/terms" className="signal-link on-ink">
                Terms
              </Link>
              {" · "}
              <a href="mailto:hello@tailormadeanalytics.com" className="signal-link on-ink">
                hello@tailormadeanalytics.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
