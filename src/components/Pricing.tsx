"use client";

import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function Pricing() {
  const { lang } = useLanguage();
  const tr = t[lang].pricing;

  return (
    <section id="pricing" className="py-24 md:py-32 px-6 md:px-12" style={{ backgroundColor: "var(--page-bg)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.2em] uppercase mb-4 block" style={{ color: "var(--accent)" }}>
            {tr.eyebrow}
          </span>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter leading-none mb-4 max-w-full break-words [overflow-wrap:anywhere]" style={{ color: "var(--text)" }}>
            {tr.heading}
          </h2>
          <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>{tr.sub}</p>
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full text-xs font-bold" style={{ backgroundColor: "rgba(var(--accent-rgb),0.08)", color: "var(--accent)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }} />
            {tr.badge}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tr.plans.map((plan) => (
            <div key={plan.name} className={`pricing-card flex flex-col ${plan.featured ? "featured" : ""}`}>
              {plan.featured && (
                <span className="text-xs font-bold tracking-widest uppercase mb-5 block" style={{ color: "var(--accent)" }}>
                  {tr.mostPopular}
                </span>
              )}
              {!plan.featured && <div className="mb-5" />}

              <div className="mb-6">
                <p className="text-sm font-semibold mb-1" style={{ color: plan.featured ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}>
                  {plan.name}
                </p>
                <p className="text-5xl font-black tracking-tighter" style={{ color: plan.featured ? "#fff" : "var(--text)" }}>
                  {plan.price}
                </p>
                <p className="text-xs mt-1 font-medium" style={{ color: plan.featured ? "rgba(255,255,255,0.4)" : "var(--text-muted)" }}>
                  {plan.delivery}
                </p>
              </div>

              <p className="text-sm leading-relaxed mb-8" style={{ color: plan.featured ? "rgba(255,255,255,0.55)" : "var(--text-muted)" }}>
                {plan.description}
              </p>

              <ul className="flex flex-col gap-3 mb-10 flex-1">
                {plan.items.map((item) => (
                  <li key={item} className="pricing-item flex items-start text-sm" style={{ color: plan.featured ? "rgba(255,255,255,0.85)" : "var(--text)" }}>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="block text-center py-4 rounded-full text-sm font-bold transition-all duration-200"
                style={
                  plan.featured
                    ? { backgroundColor: "var(--accent)", color: "#fff" }
                    : { backgroundColor: "var(--text)", color: "#fff" }
                }
              >
                {plan.cta}
              </a>

              <p className="text-xs text-center mt-4" style={{ color: plan.featured ? "rgba(255,255,255,0.3)" : "var(--text-muted)" }}>
                {tr.guarantee}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
