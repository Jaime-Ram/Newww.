import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Fuego Pizza Co. — Pizza napoletana artesanal · Montevideo",
  description:
    "Pizza napoletana artesanal hecha a leña en Pocitos, Montevideo. Masa madre de 72 horas, tomate San Marzano y mozzarella de búfala. Abierto desde 1987.",
};

export default function PizzariaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={playfair.variable}>{children}</div>;
}
