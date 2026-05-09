"use client";

import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function Process() {
  const { lang } = useLanguage();
  const tr = t[lang].process;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12" style={{ backgroundColor: "var(--page-bg)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter leading-none" style={{ color: "var(--text)" }}>
            {tr.heading}
          </h2>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tr.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {tr.steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < tr.steps.length - 1 && (
                <div
                  className="hidden lg:block absolute h-px z-0"
                  style={{ top: "28px", left: "28px", width: "calc(100% + 24px)", backgroundColor: "var(--border)" }}
                />
              )}
              <div className="step-circle w-14 h-14 rounded-full flex items-center justify-center mb-6 relative z-10">
                <span className="step-num text-sm font-black">{step.number}</span>
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
