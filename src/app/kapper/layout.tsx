import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "El Filo — Barbería de precisión · Pocitos, Montevideo",
  description:
    "Barbería de precisión en Pocitos, Montevideo. Cortes clásicos, fades, barba completa y afeitado a navaja recta. Maestros barberos desde 2009.",
};

export default function KapperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={cormorant.variable}>{children}</div>;
}
