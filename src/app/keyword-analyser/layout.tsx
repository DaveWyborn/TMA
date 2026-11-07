import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Keyword Density Checker | Tailor Made Analytics",
  description: "See how often a keyword appears on a page and whether it lands in the URL, title, H1 and alt text. Free keyword placement and density check.",
  alternates: { canonical: "/keyword-analyser" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
