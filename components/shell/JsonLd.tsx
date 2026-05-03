/**
 * Site-wide structured data — Organization + WebSite + ProfessionalService.
 * Mounted once in the root layout.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trainovate.ai";

const orgData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Trainovate",
  legalName: "Trainovate Technologies LLC",
  alternateName: ["Trainovate.ai", "Trainovate Technologies"],
  url: siteUrl,
  email: "info@trainovate.ai",
  foundingDate: "2024",
  description:
    "Trainovate builds AI-powered workforce training systems, immersive VR/3D safety simulations, microlearning, and the Soteria FIELD SaaS LMS for high-risk industries.",
  logo: `${siteUrl}/icon.svg`,
  image: `${siteUrl}/opengraph-image`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Las Vegas",
    addressRegion: "NV",
    addressCountry: "US",
  },
  knowsAbout: [
    "Workforce training",
    "AI-powered learning systems",
    "Immersive VR training",
    "3D training simulations",
    "Microlearning",
    "OSHA compliance training",
    "Lockout/Tagout training",
    "Custom LMS development",
    "Safety training",
    "Operational readiness training",
    "Veteran-owned small business",
  ],
  hasCredential: [
    "SDVOSB — Service-Disabled Veteran-Owned Small Business",
    "DVOSB — Veteran-Owned Small Business",
  ],
  brand: {
    "@type": "Brand",
    name: "Soteria",
  },
};

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Trainovate.ai",
  description:
    "AI-powered workforce training systems, immersive VR/3D safety simulations, microlearning, and the Soteria FIELD SaaS LMS for high-risk industries.",
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en-US",
};

const serviceData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#service`,
  name: "Trainovate Workforce Training Solutions",
  url: `${siteUrl}/platform`,
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: { "@type": "Country", name: "United States" },
  serviceType: "Workforce training and safety learning systems",
  description:
    "AI-driven learning systems, immersive VR & 3D safety training, microlearning, safety & compliance programs, and the Soteria FIELD SaaS LMS.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Trainovate Training Solutions",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI-Driven Learning Systems",
          description:
            "Adaptive AI training that evolves with the learner, reinforcing critical knowledge and identifying knowledge gaps before they become risks.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Immersive VR & 3D Training",
          description:
            "Realistic VR and 3D simulations that prepare teams for high-risk environments before they step into them.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Microlearning & Daily Reinforcement",
          description:
            "Short, focused mobile-first microlearning units designed to improve safety retention and behavior change.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Safety & Compliance Programs",
          description:
            "OSHA-aligned safety and compliance training programs that improve behavior and reduce operational risk.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "SoftwareApplication",
          name: "Soteria FIELD SaaS",
          applicationCategory: "Learning Management System",
          operatingSystem: "Web, iOS, Android",
          description:
            "Soteria FIELD is a custom multi-tenant SaaS LMS for inspections, audits, corrective actions, and workforce training in high-risk industries. xAPI-native, mobile-first, Section 508 accessible.",
        },
      },
    ],
  },
};

export function OrganizationJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
    </>
  );
}
