import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { insights } from "@/lib/insights";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trainovate.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = ["", "/platform", "/services", "/federal", "/about", "/insights", "/contact"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  const productPages = products.map((p) => ({
    url: `${siteUrl}/platform/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const insightPages = insights.map((p) => ({
    url: `${siteUrl}/insights/${p.slug}`,
    lastModified: new Date(p.date + "T12:00:00Z"),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...base, ...productPages, ...insightPages];
}
