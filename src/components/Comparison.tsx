"use client";

import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function Comparison() {
  const { lang } = useLanguage();
  const tr = t[lang].comparison;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12" style={{ backgroundColor: "var(--page-bg)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--accent)" }}>
              {tr.eyebrow}
            </span>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter leading-none" style={{ color: "var(--text)" }}>
              {tr.heading}
            </h2>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {/* Header */}
            <div className="grid grid-cols-3" style={{ backgroundColor: "var(--page-bg)", borderBottom: "1px solid var(--border)" }}>
              <div className="p-5" />
              <div className="p-5 text-center" style={{ borderLeft: "1px solid var(--border)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>{tr.cols.agency}</span>
              </div>
              <div className="p-5 text-center" style={{ borderLeft: "1px solid var(--border)", backgroundColor: "var(--dark)" }}>
                <span className="text-sm font-bold text-white">{tr.cols.us}</span>
              </div>
            </div>

            {/* Rows */}
            {tr.rows.map((row, i) => (
              <div
                key={i}
                className="comparison-row grid grid-cols-3"
                style={{ borderBottom: i < tr.rows.length - 1 ? "1px solid var(--border)" : undefined }}
              >
                <div className="p-5 flex items-center">
                  <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{row.label}</span>
                </div>
                <div className="p-5 flex items-center justify-center" style={{ borderLeft: "1px solid var(--border)" }}>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>{row.agency}</span>
                </div>
                <div className="p-5 flex items-center justify-center gap-2" style={{ borderLeft: "1px solid var(--border)", backgroundColor: "rgba(var(--accent-rgb),0.04)" }}>
                  <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>✓</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{row.us}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
