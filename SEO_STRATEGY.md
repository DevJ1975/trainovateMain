# Trainovate.ai — SEO Strategy & Implementation

A complete, Trainovate-specific SEO plan for [trainovate.ai](https://trainovate.ai).
Action items already shipped in the codebase are tagged **[shipped]**;
everything else is sequenced under §11 Priority Action Plan.

---

## 1. SEO Strategy Summary

Trainovate.ai is a veteran-founded workforce training technology company
selling AI-powered, immersive (VR/3D), microlearning, and **Soteria FIELD
SaaS** (custom LMS) into high-risk industries. The site has three jobs:

1. **Capture intent** at the top of the funnel — searches for *"AI safety
   training"*, *"VR safety training"*, *"custom LMS for industrial
   training"*, *"microlearning for safety compliance"*, etc.
2. **Position the platform** — Soteria FIELD as a category-defining
   workforce-safety LMS, not a generic course library.
3. **Convert** — Demo / Build Your Training System / Federal teaming
   inquiries.

Strategic posture: **modern alternative to outdated training systems**.
Every page should reinforce that operators have a real choice — Trainovate
or the binder.

---

## 2. Target Keyword Map

### Primary (high-intent, drive money pages)
| Keyword | Money page |
| --- | --- |
| workforce training technology | / (home) |
| safety training solutions | /platform |
| AI-powered workforce training | / (home) |
| immersive safety training | /platform |
| VR safety training | /platform/learning, /industries |
| microlearning for employees | /platform/learning |
| custom LMS development | /platform, /platform/field |
| compliance training systems | /platform |
| industrial safety training | /industries |
| employee training platform | / (home) |

### Secondary (support primary, blog targets)
| Keyword | Target page |
| --- | --- |
| training systems for high-risk industries | /industries |
| 3D training simulations | /platform |
| operational readiness training | /platform |
| safety compliance training | /platform |
| mobile-first training platform | /about |
| workforce development technology | /about |
| digital learning systems | / (home) |
| safety microlearning | blog |
| OSHA compliance training support | blog |
| modern LMS for safety training | /platform/field |

### Long-tail (blog cluster targets)
- AI-powered safety training for manufacturing → blog
- VR training for workplace safety → blog
- custom LMS for industrial training → /platform/field
- microlearning for safety compliance → blog
- immersive training for high-risk work environments → blog
- workforce training systems for manufacturing and logistics → /industries
- mobile training platform for safety teams → blog
- employee training that improves retention → blog
- training systems for real-world job performance → /about

### Branded
- Trainovate / Trainovate.ai / Trainovate Technologies
- Soteria / Soteria FIELD / Soteria FIELD SaaS
- Operational Minds podcast
- Jamil Jones (founder)

---

## 3. Site-Wide SEO Recommendations

| Item | Status |
| --- | --- |
| Per-page `<title>` and `<meta description>` | **[shipped]** |
| Per-page canonical URLs | **[shipped]** |
| Open Graph + Twitter card metadata | **[shipped]** |
| H1 per page (one only, keyword-bearing) | **[shipped]** |
| H2 structure under each H1 | **[shipped]** |
| Internal linking — every page links to /platform + /industries + /contact | **[shipped]** |
| Image alt text on stock photos | partial — review BrandPanel and PhotoStrip |
| `sitemap.xml` (dynamic) | **[shipped]** |
| `robots.txt` | **[shipped]** |
| Organization + WebSite + Service JSON-LD | **[shipped]** |
| `/api/contact` honeypot + rate limit | **[shipped]** |
| Mobile responsive (all pages) | **[shipped]** |
| Reduced-motion + Section-508 ARIA + skip-to-content | **[shipped]** |
| FAQ schema on /platform & /industries | **TODO** |
| BlogPosting schema on /insights/[slug] | **TODO** |
| Breadcrumb schema | **TODO** |
| OG image per route (currently single static) | **TODO** |
| Vercel Analytics + Speed Insights | **TODO** — install `@vercel/analytics`, `@vercel/speed-insights` |
| Google Search Console verification | **TODO** — add file or meta tag |
| Bing Webmaster verification | **TODO** |

---

## 4. Homepage SEO

- **URL:** `/`
- **Title:** `Trainovate | AI-Powered Workforce Training & Immersive Safety Learning` **[shipped]**
- **Description:** `Trainovate builds AI-powered workforce training systems, immersive VR/3D safety simulations, microlearning, and Soteria FIELD SaaS — a custom LMS for safety, compliance, and operational performance in high-risk industries.` **[shipped]**
- **H1:** `The training platform for high-risk, high-performance teams.` **[shipped]**
- **H2 sections (current order):** Trust strip · *"Training is broken. Here's what works."* · *"What is Trainovate"* · *"Five capabilities. One platform."* · *"Three steps. Shipped, not pitched."* · *"Built for complex, high-risk environments."* · *"Built for real-world performance."* · *"Modernizing training. Protecting people. Improving performance."* · *"Build training that actually works."*
- **Keyword targets:** workforce training technology · AI-powered workforce training · immersive safety training · safety training solutions · custom LMS development · Soteria FIELD SaaS
- **Internal links from home:** /platform (Explore Solutions, Soteria FIELD references) · /industries (View All Industries) · /contact (Request a Demo, Build Your Training System) · /about (footer + nav) · /federal (footer + nav)
- **Above-the-fold copy includes:** AI · immersive learning · safety · compliance · real-world performance — primary long-tail terms

---

## 5. About Page SEO

- **URL:** `/about`
- **Title:** `About Trainovate | Veteran-Founded Workforce Training Technology Company` **[shipped]**
- **Description:** `Learn how Trainovate builds modern workforce training systems using AI, immersive VR/3D learning, microlearning, and the Soteria FIELD SaaS LMS — for real-world safety, performance, and retention. Veteran-founded. SDVOSB.` **[shipped]**
- **H1:** `Train for the real world. Not the classroom.` **[shipped]**
- **H2 structure:** Who We Are · Why Trainovate Exists · What We Build · Our Approach · Veteran-Founded · What Makes Us Different · Mission
- **Keyword targets:** veteran-founded training technology company · workforce development technology · modern LMS for safety training · workforce training technology
- **Copy improvements queued:**
  - Above-the-fold paragraph already names AI + immersive + Soteria FIELD positioning
  - Add a single-sentence Soteria FIELD callout in "What We Build"
  - Add internal links to /industries and /platform from the founder bio paragraph

---

## 6. Industries Page SEO

- **URL:** `/industries`
- **Title:** `Industries We Serve | Safety Training & Workforce Learning Solutions` **[shipped]**
- **Description:** `Trainovate supports manufacturing, construction, warehousing & logistics, aviation maintenance, energy & utilities, government, healthcare & emergency response, and corporate teams with AI-powered safety training, immersive VR/3D simulations, microlearning, and the Soteria FIELD SaaS LMS.` **[shipped]**
- **H1:** `Training built for the industries the world depends on.` **[shipped]**
- **H2 structure:** Industry overview · 8 vertical sections · Built for High-Risk, High-Responsibility Work · Training That Meets People Where They Work · CTA
- **Per-industry keyword targets:**
  - Manufacturing → *manufacturing safety training*, *LOTO training*, *machine guarding training*
  - Construction → *construction safety training*, *OSHA 10/30 training*
  - Warehousing & Logistics → *warehouse safety training*, *logistics training*, *forklift safety*
  - Aviation Maintenance → *aviation maintenance training*, *FAA Part 145 training*
  - Energy & Utilities → *energy training*, *SIMOPS training*, *NERC CIP training*
  - Government & Public Sector → *government workforce training*, *Section 508 training*
  - Healthcare & Emergency Response → *healthcare emergency response training*, *EMS training*, *protocol microlearning*
  - Corporate Workforce Training → *corporate workforce training*, *adaptive learning paths*
- **Implementation:** When deep-dive `/industries/[slug]` pages are built, each becomes a money page for the corresponding long-tail.

---

## 7. Solutions Page SEO (`/platform`)

- **URL:** `/platform`
- **Title:** `Training Solutions | AI, VR, Microlearning & Custom LMS Development` **[shipped]**
- **Description:** `Explore Trainovate training solutions: AI-driven learning systems, immersive VR & 3D safety training, microlearning & daily reinforcement, safety & compliance programs, and Soteria FIELD SaaS — a custom LMS built for high-risk industries.` **[shipped]**
- **H1 (currently):** `Four products. One doctrine.` — recommend updating to `AI-powered training solutions, built for high-risk industries.`
- **H2 structure:** product tile grid (Safeguard / FIELD / Learning / Co-Pilot) · One spine. Four endpoints.
- **Keyword targets:** AI-driven learning systems · VR safety training · 3D training simulations · microlearning for safety compliance · custom LMS development · Soteria FIELD SaaS
- **Content opportunity:** add a "Data & Performance Insights" card to the product grid (xAPI evidence + LRS analytics) — earns ranking on *workforce performance analytics* and *xAPI LRS*.

---

## 8. 90-Day Content Plan

13 articles, one per week. Each lands in `lib/insights.ts` (or migrate
to MDX in `src/content/insights/`).

### Month 1 — Foundational pillars
| # | Title | Target keyword | Intent | Internal link | CTA |
| --- | --- | --- | --- | --- | --- |
| 1 | Why Most Safety Training Is Theater | safety training solutions | informational | /platform | Request a Demo |
| 2 | What xAPI Changes About EHS Evidence | workforce performance analytics | informational | /platform | Request a Demo |
| 3 | The Practical Guide to Microlearning for Safety Compliance | microlearning for safety compliance | informational | /platform/learning | Build Your Training System |
| 4 | A Buyer's Guide to Custom LMS Development for Industrial Training | custom LMS development | commercial | /platform/field | Request a Demo |

### Month 2 — Industry-anchored
| # | Title | Target keyword | Intent | Internal link | CTA |
| --- | --- | --- | --- | --- | --- |
| 5 | AI-Powered Safety Training for Manufacturing | AI-powered safety training for manufacturing | commercial | /industries#manufacturing | Request a Demo |
| 6 | VR Training for Workplace Safety: What Actually Works | VR training for workplace safety | informational | /platform/learning | Explore Solutions |
| 7 | OSHA 10/30 in the Field — A Modern Construction Training Stack | construction safety training | commercial | /industries#construction | Request a Demo |
| 8 | Warehouse Safety Training That Survives Turnover | warehouse safety training | commercial | /industries#warehousing | Request a Demo |

### Month 3 — Differentiation + thought leadership
| # | Title | Target keyword | Intent | Internal link | CTA |
| --- | --- | --- | --- | --- | --- |
| 9 | SDVOSBs in the EHS Marketplace: A 2026 Outlook | SDVOSB EHS market | informational | /federal | Federal Teaming |
| 10 | Training Retention Is an Engineering Problem | employee training that improves retention | informational | /about | Build Your Training System |
| 11 | Immersive Training for High-Risk Work Environments | immersive training for high-risk work environments | commercial | /platform/learning | Request a Demo |
| 12 | The Future of Work and Operational Learning | operational readiness training | informational | /podcast | Subscribe |
| 13 | Mobile Training Platform Buyer's Checklist for Safety Teams | mobile training platform for safety teams | commercial | /platform/field | Request a Demo |

Cadence rules:
- 800–1,400 words each
- Each article includes: a clear H1 with target keyword, 3–5 H2 sections,
  one internal link per 200 words minimum, one image with descriptive
  alt text, and a clear CTA at the end.
- Add `BlogPosting` schema per article.

---

## 9. Schema Markup Recommendations

### Already shipped
- `Organization` (root layout) — name, alternateName, address, knowsAbout, brand
- `WebSite` (root layout)
- `ProfessionalService` (root layout) — with `OfferCatalog` containing all
  five solutions including `SoftwareApplication: Soteria FIELD SaaS`

### Recommended additions
- **`BreadcrumbList`** — on /platform/[slug] and /industries
- **`FAQPage`** — add a 5–7 question FAQ to /platform and each
  /platform/[slug] page (compliance, deployment time, integrations,
  pricing model, federal posture). FAQ schema earns rich-result
  inclusion.
- **`BlogPosting`** — per /insights/[slug]; include `author`,
  `datePublished`, `dateModified`, `image`, `wordCount`.
- **`PodcastSeries`** + **`PodcastEpisode`** — once Operational Minds
  launches; add to /podcast.
- **`Course`** — for any standalone training programs published
  separately (e.g., OSHA 10/30 cohorts).
- **`VideoObject`** — wrap the Vimeo brand intro on /about with
  `VideoObject` schema (`embedUrl`, `thumbnailUrl`, `description`).

---

## 10. Technical SEO Checklist

| Item | Status | Notes |
| --- | --- | --- |
| Page speed — LCP under 2.5s | needs measurement | run Lighthouse on Vercel preview |
| Mobile responsive | **[shipped]** | every section verified at mobile/tablet/desktop |
| Core Web Vitals tracking | **TODO** | install `@vercel/speed-insights` |
| `sitemap.xml` (auto from `app/sitemap.ts`) | **[shipped]** | includes /platform/[slug], /insights/[slug] |
| `robots.txt` | **[shipped]** | allows /, disallows /api/ |
| Canonical URLs (per page) | **[shipped]** | added to all primary pages |
| Clean URL structure | **[shipped]** | kebab-case, no query strings, no `.html` |
| Image compression | **[shipped]** | next/image serves AVIF/WebP variants |
| Image alt text | partial | BrandPanel sets generic alt; replace with descriptive per-slot text |
| Internal links | **[shipped]** | nav + footer + per-page CTAs |
| Broken links scan | **TODO** | run Lighthouse / Screaming Frog post-launch |
| SSL | **[shipped]** | Vercel default |
| Vercel Analytics | **TODO** | `npm i @vercel/analytics` + mount in layout |
| Google Search Console | **TODO** | verify domain, submit sitemap.xml |
| Bing Webmaster | **TODO** | verify, submit sitemap.xml |
| 404 page | partial | Next default — replace with branded 404 with key links |
| `prefers-reduced-motion` | **[shipped]** | all 3D scenes + transitions respect it |
| `lang="en"` on `<html>` | **[shipped]** | |

---

## 11. Priority Action Plan

### Week 1 (immediate)
1. Install `@vercel/analytics` + `@vercel/speed-insights`, mount in root layout — **[shipped]**
2. Verify domain in Google Search Console + Bing Webmaster, submit sitemap — **needs Jay**
3. Replace BrandPanel generic alt text with per-slot descriptive alt — **[shipped]**
4. Build branded 404 page — **[shipped]** (`app/not-found.tsx`)

### Week 2
5. Add FAQ schema + visible FAQ section to /platform and /industries — **[shipped]** (7 Q&A on /platform, 7 Q&A on /industries, both with FAQPage JSON-LD)
6. Add Breadcrumb schema to /platform/[slug] and /industries — **[shipped]** (Breadcrumbs component on /platform/[slug] and /industries/[slug])
7. Update /platform H1 + add Data & Performance Insights card — **[shipped]**
8. Add VideoObject schema for the Vimeo embed on /about — **[shipped]** (VimeoEmbed now emits VideoObject when given description + uploadDate)

### Weeks 3–4
9. Build /industries/[slug] dynamic pages (8 deep-dives — long-tail SEO money pages) — **[shipped]** (manufacturing, warehousing-logistics, construction, aviation-maintenance, energy-utilities, government-public-sector, healthcare-emergency-response, corporate-workforce-training — each with per-vertical Service JSON-LD, breadcrumbs, hero, capabilities, frameworks, signal stat, challenges, programs, outcomes, CTA + next-industry cross-link)
10. Publish first 4 blog articles (Month 1 cluster) — **TODO** (content writing — needs Jay or content writer)
11. Add BlogPosting schema to /insights/[slug] — **[shipped]**

### Month 2–3
12. Continue blog cadence (one per week) — **TODO**
13. Internal-link audit — every blog article links to at least one money page — **TODO** post-publishing
14. PodcastSeries / PodcastEpisode schema once Operational Minds is live — **TODO** post-launch
15. Backlink outreach — veteran business directories (NaVOBA, Vetbiz),
    SDVOSB lists, training-tech directories (Capterra, G2, eLearning Industry) — **TODO**

---

## Notes

- All metadata + JSON-LD changes shipped in the same commit as this
  document.
- Treat `Soteria FIELD SaaS` as the proper-noun product name throughout
  copy — it's the most defensible long-tail keyword Trainovate owns.
- The site is intentionally light on stock photography and heavy on
  3D/SVG art — this is a brand decision, but SEO-wise it's neutral
  since photos rarely rank in product/service searches.
