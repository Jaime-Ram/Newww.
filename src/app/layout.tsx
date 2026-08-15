import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";

import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const titel = "Kinheim — Scorebord";
const omschrijving = "Puntentelling voor het toernooi. Tik een speler aan en geef punten.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: titel,
  description: omschrijving,
  applicationName: "Scorebord",
  openGraph: {
    type: "website",
    title: titel,
    description: omschrijving,
    siteName: "Kinheim Scorebord",
    locale: "nl_NL",
    url: siteUrl,
  },
  appleWebApp: { capable: true, title: "Scorebord", statusBarStyle: "black-translucent" },
  // Een openbaar scorebord met namen hoeft niet in Google te staan.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
