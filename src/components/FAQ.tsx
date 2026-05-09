"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { lang } = useLanguage();
  const tr = t[lang].faq;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12" style={{ backgroundColor: "var(--page-bg)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter leading-none" style={{ color: "var(--text)" }}>
            {tr.heading}
          </h2>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tr.sub}</p>
        </div>

        <div style={{ borderTop: "1px solid var(--border)" }}>
          {tr.items.map((faq, i) => (
            <div key={i} className="py-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-start justify-between gap-6 text-left">
                <span className="faq-question text-base md:text-lg font-semibold leading-snug">{faq.q}</span>
                <span
                  className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold transition-all duration-200 mt-0.5 ${open === i ? "rotate-45" : ""}`}
                  style={
                    open === i
                      ? { backgroundColor: "var(--accent)", borderColor: "var(--accent)", color: "#fff" }
                      : { borderColor: "var(--border)", color: "var(--text)" }
                  }
                >
                  +
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-48 mt-4" : "max-h-0"}`}>
                <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
