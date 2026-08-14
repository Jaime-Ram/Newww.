import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const titel = "Het Scorebord — Honkbaltoernooi";
const omschrijving =
  "Live puntentelling voor het honkbaltoernooi. Iedereen mag punten uitdelen en de regels aanpassen.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: titel,
  description: omschrijving,
  applicationName: "Het Scorebord",
  openGraph: {
    type: "website",
    title: titel,
    description: omschrijving,
    siteName: "Het Scorebord",
    locale: "nl_NL",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image", title: titel, description: omschrijving },
  appleWebApp: { capable: true, title: "Scorebord", statusBarStyle: "black-translucent" },
  // Een openbaar scorebord met namen hoeft niet in Google te staan.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a1210",
  width: "device-width",
  initialScale: 1,
  // Laat de achtergrond doorlopen tot achter de iPhone-homebar.
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
