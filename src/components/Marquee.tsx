"use client";

import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function Marquee() {
  const { lang } = useLanguage();
  const items = [...t[lang].marquee, ...t[lang].marquee];

  return (
    <div className="py-4 overflow-hidden select-none" style={{ backgroundColor: "var(--marquee-bg)" }}>
      <div className="flex whitespace-nowrap animate-marquee">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center text-white text-sm font-semibold tracking-wide">
            <span className="px-8">{item}</span>
            <span className="text-white/40 text-[10px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
