import type { MetadataRoute } from "next";

const base = "https://tailormadeanalytics.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/seo-tools", priority: 0.9 },
    { path: "/meta-checker", priority: 0.8 },
    { path: "/keyword-analyser", priority: 0.8 },
    { path: "/page-speed", priority: 0.8 },
    { path: "/robots-checker", priority: 0.8 },
    { path: "/privacy-policy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
