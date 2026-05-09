"use client";

import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function About() {
  const { lang } = useLanguage();
  const tr = t[lang].about;

  return (
    <section id="about" className="py-24 md:py-32" style={{ backgroundColor: "var(--dark)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Text + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase mb-8" style={{ color: "var(--accent)" }}>
              <span className="w-8 h-px" style={{ backgroundColor: "var(--accent)" }} />
              {tr.eyebrow}
            </span>
            <h2 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-black tracking-tighter leading-[0.95] mb-8">
              {tr.heading}
            </h2>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              <p>{tr.p1}</p>
              <p>{tr.p2}</p>
              <p>{tr.p3}</p>
            </div>
          </div>

          {/* Stats — clean 2x2 grid */}
          <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
            {tr.stats.map((stat) => (
              <div key={stat.value} className="studio-cursor-expand group relative flex flex-col justify-between p-8 overflow-hidden" style={{ backgroundColor: "var(--dark)" }}>
                {/* Red fill from bottom */}
                <div
                  className="absolute inset-0 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500"
                  style={{ backgroundColor: "var(--accent)", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)", zIndex: 0 }}
                />
                <span className="relative z-10 text-xs font-medium tracking-wide uppercase group-hover:text-white transition-colors duration-300" style={{ color: "rgba(255,255,255,0.25)" }}>{stat.label}</span>
                <span className="relative z-10 text-5xl font-black tracking-tighter text-white mt-6 group-hover:text-white transition-colors duration-300">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Industries */}
        <div className="pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "rgba(255,255,255,0.2)" }}>{tr.industriesLabel}</p>
          <div className="flex flex-wrap gap-3">
            {tr.industries.map((industry) => (
              <span key={industry} className="industry-tag text-sm px-4 py-2 rounded-full cursor-default">
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
