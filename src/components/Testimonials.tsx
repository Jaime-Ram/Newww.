"use client";

import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function Testimonials() {
  const { lang } = useLanguage();
  const tr = t[lang].testimonials;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12" style={{ backgroundColor: "var(--page-bg)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase mb-3 block" style={{ color: "var(--accent)" }}>
              {tr.eyebrow}
            </span>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tighter leading-none" style={{ color: "var(--text)" }}>
              {tr.heading}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ border: "1px solid var(--border)" }}>
          {tr.items.map((item, i) => (
            <div
              key={i}
              className="studio-cursor-expand group relative flex flex-col justify-between gap-8 p-8 md:p-10 overflow-hidden"
              style={{
                borderBottom: "1px solid var(--border)",
                borderRight: i % 2 === 0 ? "1px solid var(--border)" : undefined,
              }}
            >
              {/* Red fill from bottom */}
              <div
                className="absolute inset-0 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500"
                style={{ backgroundColor: "var(--accent)", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)", zIndex: 0 }}
              />

              {/* Stars */}
              <div className="relative z-10 flex gap-0.5">
                {Array.from({ length: item.stars }).map((_, s) => (
                  <span key={s} className="text-sm text-[#FF3D00] group-hover:text-white transition-colors duration-300">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="relative z-10 text-lg font-medium leading-relaxed text-[#111111] group-hover:text-white transition-colors duration-300">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Name + role */}
              <div className="relative z-10">
                <p className="font-bold text-[#111111] group-hover:text-white transition-colors duration-300">{item.name}</p>
                <p className="text-sm text-[#888888] group-hover:text-white/60 transition-colors duration-300">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
