import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Meta Tag Checker | Tailor Made Analytics",
  description: "Check any page’s title, meta description, Open Graph, Twitter Cards, schema and technical tags, and compare against a competitor. Free, instant results.",
  alternates: { canonical: "/meta-checker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
