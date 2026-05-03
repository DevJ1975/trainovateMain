export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Trainovate.ai",
    legalName: "Trainovate Technologies LLC",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://trainovate.tech",
    email: "info@trainovate.tech",
    foundingDate: "2024",
    description:
      "Workforce Transformation OS for high-risk industries. Veteran-owned. SDVOSB.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      addressCountry: "US",
    },
    knowsAbout: [
      "EHS",
      "OSHA training",
      "Lockout/Tagout",
      "xAPI",
      "Workforce safety",
      "AI co-pilots",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
