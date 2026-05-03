import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { SiteShell } from "@/components/shell/SiteShell";
import { OrganizationJsonLd } from "@/components/shell/JsonLd";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
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
    default: "Trainovate Technologies — Workforce Transformation OS",
    template: "%s · Trainovate",
  },
  description:
    "AI-powered learning, EHS instrumentation, and immersive content for the industries the world depends on. Veteran-owned. SDVOSB.",
  keywords: [
    "EHS training",
    "OSHA",
    "SDVOSB",
    "veteran-owned",
    "xAPI",
    "lockout tagout",
    "workforce safety",
    "AI co-pilot",
    "federal training",
  ],
  authors: [{ name: "Trainovate Technologies" }],
  creator: "Trainovate Technologies",
  openGraph: {
    type: "website",
    siteName: "Trainovate Technologies",
    title: "Trainovate Technologies — Workforce Transformation OS",
    description:
      "AI-powered learning, EHS instrumentation, and immersive content for the industries the world depends on.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Trainovate Technologies",
    description: "Workforce Transformation OS for high-risk industries.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicons/favicon.svg" },
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
      className={`${interTight.variable} ${instrumentSerif.variable} ${geistMono.variable}`}
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
      </body>
    </html>
  );
}
