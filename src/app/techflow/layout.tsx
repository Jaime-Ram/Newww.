import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TechFlow — Workflow automation for engineering teams",
  description: "TechFlow automates your engineering pipeline, surfaces bottlenecks in real-time, and keeps your team moving.",
};

export default function TechFlowLayout({ children }: { children: React.ReactNode }) {
  return <div className={space.variable}>{children}</div>;
}
