import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trainovate.ai · Coming Soon",
  description: "Trainovate.ai — coming soon.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0A0A0A",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Near Miss",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
