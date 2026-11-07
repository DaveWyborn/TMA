import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Page Speed Checker | Tailor Made Analytics",
  description: "Run Google PageSpeed Insights for mobile and desktop in one go. Get the score, Core Web Vitals and the top fixes to make. Free, no setup.",
  alternates: { canonical: "/page-speed" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
