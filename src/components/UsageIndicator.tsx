"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

type ToolName =
  | "meta-checker"
  | "keyword-analyser"
  | "page-speed"
  | "robots-checker";

interface Usage {
  tier: "anon" | "free" | "paid";
  limit: number | null;
  remaining: number | null;
}

export default function UsageIndicator({ tool }: { tool: ToolName }) {
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch(`/api/usage?tool=${tool}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!cancelled && d) setUsage(d);
        })
        .catch(() => {});
    };
    load();
    const handler = () => load();
    window.addEventListener("usage-refresh", handler);
    return () => {
      cancelled = true;
      window.removeEventListener("usage-refresh", handler);
    };
  }, [tool]);

  if (!usage) return null;

  if (usage.tier === "paid") {
    return (
      <div
        className="num-tag"
        style={{ fontSize: "11px", color: "var(--ink-soft)" }}
      >
        Unlimited
      </div>
    );
  }

  const remaining = usage.remaining ?? 0;
  const limit = usage.limit ?? 0;
  const low = remaining <= 1;

  return (
    <div
      className="num-tag"
      style={{
        fontSize: "11px",
        color: low ? "var(--signal)" : "var(--ink-soft)",
      }}
    >
      {remaining} of {limit} left today
      {usage.tier === "anon" && (
        <>
          {" · "}
          <Link
            href="/sign-up"
            style={{ color: "var(--signal)", textDecoration: "underline" }}
          >
            Sign up for 5×
          </Link>
        </>
      )}
    </div>
  );
}
