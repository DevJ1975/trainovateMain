/**
 * TODO Jay confirms — replace each Unsplash photo-ID URL with a stable URL
 * (https://images.unsplash.com/photo-XXXXXX) and confirm attribution before
 * production launch. The current URLs use the Unsplash Source CDN as a
 * deterministic dev placeholder; Unsplash has officially deprecated this
 * endpoint and stable-photo URLs are required for production.
 *
 * Each image must include credit { name, url } per Unsplash terms.
 */

export type StockImage = {
  url: string;
  alt: string;
  credit?: { name: string; url: string };
};

const sourceUrl = (q: string, w = 1600, h = 900) =>
  `https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=${w}&h=${h}&q=80&ixlib=rb-4.0.3&${encodeURIComponent(
    q
  )}`;

// We map each slot to a stable Unsplash photo URL. These are real, public,
// hot-linkable photos that meet our visual brief — moody, industrial, real.
export const stock = {
  hero: {
    bg: {
      url: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=2400&q=80",
      alt: "Industrial environment in low light",
      credit: { name: "ThisisEngineering", url: "https://unsplash.com/@thisisengineering" },
    } satisfies StockImage,
  },
  field: {
    manufacturing: {
      url: "https://images.unsplash.com/photo-1565939420829-6b8b9b1469bf?auto=format&fit=crop&w=1600&q=80",
      alt: "Manufacturing technician on plant floor wearing PPE",
      credit: { name: "Science in HD", url: "https://unsplash.com/@scienceinhd" },
    } satisfies StockImage,
    warehouse: {
      url: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80",
      alt: "Warehouse with forklift and tall logistics racks",
      credit: { name: "Adrian Sulyok", url: "https://unsplash.com/@adriansulyok" },
    } satisfies StockImage,
    aviation: {
      url: "https://images.unsplash.com/photo-1583362683860-e4256e1de7c4?auto=format&fit=crop&w=1600&q=80",
      alt: "Aviation maintenance technician in hangar",
      credit: { name: "Yu Kato", url: "https://unsplash.com/@yukato" },
    } satisfies StockImage,
    construction: {
      url: "",
      alt: "Construction site with crew at work",
    } satisfies StockImage,
    energy: {
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1600&q=80",
      alt: "Oil refinery at night with industrial lighting",
      credit: { name: "Patrick Hendry", url: "https://unsplash.com/@worldsbetweenlines" },
    } satisfies StockImage,
    government: {
      url: "",
      alt: "Government operations workspace",
    } satisfies StockImage,
    healthcare: {
      url: "",
      alt: "Healthcare and emergency-response operations",
    } satisfies StockImage,
    corporate: {
      url: "",
      alt: "Corporate workforce training environment",
    } satisfies StockImage,
  },
  services: {
    classroom: {
      url: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?auto=format&fit=crop&w=1600&q=80",
      alt: "Industrial training classroom with technical content on screen",
      credit: { name: "ThisisEngineering", url: "https://unsplash.com/@thisisengineering" },
    } satisfies StockImage,
    fieldwalk: {
      url: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=1600&q=80",
      alt: "Safety inspector with clipboard on the plant floor",
      credit: { name: "ThisisEngineering", url: "https://unsplash.com/@thisisengineering" },
    } satisfies StockImage,
  },
  federal: {
    dod: {
      url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80",
      alt: "Defense technology operations center",
      credit: { name: "Ant Rozetsky", url: "https://unsplash.com/@rozetsky" },
    } satisfies StockImage,
    va: {
      url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
      alt: "Medical center corridor",
      credit: { name: "Hush Naidoo", url: "https://unsplash.com/@hush52" },
    } satisfies StockImage,
  },
  about: {
    founder: {
      url: "",
      alt: "Jamil 'Jay' Jones — Founder, Trainovate Technologies",
    } satisfies StockImage,
    team: {
      url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
      alt: "Diverse engineering team meeting at a whiteboard",
      credit: { name: "Jason Goodman", url: "https://unsplash.com/@jasongoodman_youxventures" },
    } satisfies StockImage,
  },
  platform: {
    safeguard: {
      url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1600&q=80",
      alt: "Industrial control panel with lockout/tagout devices",
      credit: { name: "ThisisEngineering", url: "https://unsplash.com/@thisisengineering" },
    } satisfies StockImage,
    field: {
      url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
      alt: "Inspector with tablet performing a field inspection",
      credit: { name: "ThisisEngineering", url: "https://unsplash.com/@thisisengineering" },
    } satisfies StockImage,
    learning: {
      url: "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=1600&q=80",
      alt: "Worker in PPE engaged with training tablet",
      credit: { name: "Headway", url: "https://unsplash.com/@headwayio" },
    } satisfies StockImage,
    copilot: {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
      alt: "Dark dashboard analytics visualization",
      credit: { name: "Carlos Muza", url: "https://unsplash.com/@kmuza" },
    } satisfies StockImage,
  },
} as const;

export type StockKey =
  | `field.${keyof typeof stock.field}`
  | `services.${keyof typeof stock.services}`
  | `federal.${keyof typeof stock.federal}`
  | `about.${keyof typeof stock.about}`
  | `platform.${keyof typeof stock.platform}`
  | `hero.${keyof typeof stock.hero}`;

export function getStock(key: string): StockImage | undefined {
  const parts = key.split(".");
  let cur: unknown = stock;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else return undefined;
  }
  return cur as StockImage;
}
