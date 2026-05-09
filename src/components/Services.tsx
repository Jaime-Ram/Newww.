"use client";

import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function Services() {
  const { lang } = useLanguage();
  const tr = t[lang].deliverables;

  return (
    <section id="services" className="py-24 md:py-32 px-6 md:px-12" style={{ backgroundColor: "var(--page-bg)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase mb-3 block" style={{ color: "var(--accent)" }}>
              {tr.eyebrow}
            </span>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter leading-none max-w-full break-words [overflow-wrap:anywhere]" style={{ color: "var(--text)" }}>
              {tr.heading}
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tr.sub}</p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px p-px"
          style={{ backgroundColor: "var(--border)" }}
        >
          {tr.items.map((item, i) => (
            <div
              key={i}
              className="studio-cursor-expand group relative flex flex-col justify-between gap-8 p-8 md:p-10 overflow-hidden"
              style={{ backgroundColor: "var(--page-bg)" }}
            >
              {/* Red fill from bottom */}
              <div
                className="absolute inset-0 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500"
                style={{ backgroundColor: "var(--accent)", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)", zIndex: 0 }}
              />

              {/* Check icon */}
              <div className="relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold group-hover:bg-white/20 transition-colors duration-300"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  ✓
                </div>
              </div>

              {/* Text */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3 text-[#111111] group-hover:text-white transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#888888] group-hover:text-white/70 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
