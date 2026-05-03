import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trainovate.ai · Coming Soon",
  description: "Trainovate.ai — coming soon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
