"use client";

import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function Hero() {
  const { lang } = useLanguage();
  const tr = t[lang].hero;

  return (
    <section
      className="hero-section min-h-screen hero-grid flex flex-col justify-between px-6 md:px-12 pt-36 pb-16 relative overflow-hidden"
    >
      <div className="relative z-10 flex-1 flex flex-col justify-end max-w-[1400px] mx-auto w-full">
        <div className="mb-10">
          <span
            className="hero-eyebrow inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase mb-8"
          >
            <span className="w-8 h-px" />
            {tr.eyebrow}
          </span>
          <h1 className="text-[clamp(4.5rem,12vw,10rem)] font-black leading-[0.88] tracking-tighter max-w-full break-words [overflow-wrap:anywhere]" style={{ color: "var(--text)" }}>
            {tr.h1_1}<br />
            <span style={{ color: "var(--accent)" }}>{tr.h1_2}</span><br />
            {tr.h1_3}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-end gap-8 justify-between">
          <p className="hero-body text-base md:text-lg max-w-md leading-relaxed">{tr.body}</p>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a href="#work" className="hero-btn-primary px-8 py-4 rounded-full font-semibold text-sm">
              {tr.cta1}
            </a>
            <a
              href="#contact"
              className="hero-cta-secondary border px-8 py-4 rounded-full font-semibold text-sm transition-colors"
            >
              {tr.cta2}
            </a>
          </div>
        </div>
      </div>

      {/* Social proof strip */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full mt-16 pt-6 social-strip flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-muted)" }}>
          {tr.social}
        </p>
        <div className="hero-scroll-indicator flex items-center gap-3">
          <div className="w-6 h-10 border rounded-full flex items-start justify-center pt-2" style={{ borderColor: "var(--border)" }}>
            <div className="w-1 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-muted)" }} />
          </div>
          <span className="hero-scroll-label text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>{tr.scroll}</span>
        </div>
      </div>
    </section>
  );
}
