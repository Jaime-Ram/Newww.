import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

/** Canonical URL for OG/favicons; production default avoids wrong deployment host in meta. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://newww.website");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Newww. — Web Agency",
  description:
    "Newww. is a full-service web agency building websites that win. Design-led development for ambitious brands.",
  openGraph: {
    type: "website",
    title: "Newww. — Web Agency",
    description: "We build websites that win.",
    siteName: "Newww.",
    url: siteUrl,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Newww.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newww. — Web Agency",
    description: "We build websites that win.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
