import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Robots.txt & Sitemap Checker | Tailor Made Analytics",
  description: "Validate a site’s robots.txt and XML sitemap, spot blocked pages and broken sitemap entries. Free, instant check.",
  alternates: { canonical: "/robots-checker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
