import type { Metadata, Viewport } from "next";
import { Inter_Tight, Manrope, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteShell } from "@/components/shell/SiteShell";
import { OrganizationJsonLd } from "@/components/shell/JsonLd";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600", "700"],
});

// Manrope drives the italic emphasis word inside h1/h2 — a cleaner, more
// modern counterpoint than the prior editorial serif.
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-emphasis",
  weight: ["400", "500", "600"],
});

// Space Grotesk drives h1/h2 display — geometric, technical, defense-tech.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

// Geist Mono isn't on Google Fonts in this Next version; JetBrains Mono is the
// closest neighbour and ships a near-identical visual rhythm at small sizes.
const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trainovate.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Trainovate | AI-Powered Workforce Training & Immersive Safety Learning",
    template: "%s · Trainovate.ai",
  },
  description:
    "Trainovate builds AI-powered workforce training systems, immersive VR/3D safety simulations, microlearning, and Soteria FIELD SaaS — a custom LMS for safety, compliance, and operational performance in high-risk industries.",
  keywords: [
    "workforce training technology",
    "safety training solutions",
    "AI-powered workforce training",
    "immersive safety training",
    "VR safety training",
    "microlearning for employees",
    "custom LMS development",
    "compliance training systems",
    "industrial safety training",
    "employee training platform",
    "Soteria FIELD SaaS",
    "training systems for high-risk industries",
    "3D training simulations",
    "operational readiness training",
    "OSHA compliance training support",
    "modern LMS for safety training",
    "veteran-owned training company",
    "SDVOSB training",
  ],
  authors: [{ name: "Trainovate Technologies" }],
  creator: "Trainovate Technologies",
  publisher: "Trainovate Technologies LLC",
  openGraph: {
    type: "website",
    siteName: "Trainovate.ai",
    title: "Trainovate | AI-Powered Workforce Training & Immersive Safety Learning",
    description:
      "AI, immersive VR/3D, microlearning, and the Soteria FIELD SaaS LMS — built for safety, compliance, and operational performance in high-risk industries.",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trainovate | AI-Powered Workforce Training",
    description:
      "AI, immersive VR/3D, microlearning, and Soteria FIELD SaaS — for high-risk industries.",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${manrope.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="text-bone">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-signal focus:text-void focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-eyebrow"
        >
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
        <OrganizationJsonLd />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
