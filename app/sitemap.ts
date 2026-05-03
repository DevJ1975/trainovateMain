import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { industries } from "@/lib/industries";
import { insights } from "@/lib/insights";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trainovate.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = [
    "",
    "/platform",
    "/industries",
    "/federal",
    "/about",
    "/podcast",
    "/insights",
    "/contact",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productPages = products.map((p) => ({
    url: `${siteUrl}/platform/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const industryPages = industries.map((i) => ({
    url: `${siteUrl}/industries/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85, // long-tail SEO money pages
  }));

  const insightPages = insights.map((p) => ({
    url: `${siteUrl}/insights/${p.slug}`,
    lastModified: new Date(p.date + "T12:00:00Z"),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...base, ...productPages, ...industryPages, ...insightPages];
}
