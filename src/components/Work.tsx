"use client";

import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

/** Proudest first (top row); last tile = least prime in typical Z-pattern scan. */
const projects = [
  {
    id: 1,
    num: "001",
    title: { en: "Domio", es: "Domio" },
    category: { en: "Real Estate SaaS", es: "SaaS Inmobiliario" },
    tags: ["Software", "App Development", "Web Design"],
    year: "2025",
    href: "https://domiovastgoedbeheer.nl",
  },
  {
    id: 2,
    num: "002",
    title: { en: "Vekto Studio", es: "Vekto Studio" },
    category: { en: "Web Agency", es: "Agencia Web" },
    tags: ["Branding", "Web Design", "Development"],
    year: "2025",
    href: "/vekto-studio/html/index.html",
  },
  {
    id: 3,
    num: "003",
    title: { en: "Fintech Demo", es: "Fintech Demo" },
    category: { en: "Web Design", es: "Diseño Web" },
    tags: ["Web Design", "Development"],
    year: "2025",
    href: "/full2/index.html",
  },
  {
    id: 4,
    num: "004",
    title: { en: "Bondivideo", es: "Bondivideo" },
    category: { en: "Video Production Studio", es: "Estudio de Producción de Video" },
    tags: ["Branding", "Web Design", "App Development"],
    year: "2026",
    href: "https://bondivideo.app",
  },
  {
    id: 5,
    num: "005",
    title: { en: "Energiebelastingloket", es: "EBL.nl" },
    category: { en: "Tax Platform", es: "Plataforma Fiscal" },
    tags: ["Backend", "Web Design"],
    year: "2025",
    href: "https://energiebelastingloket.nl",
  },
  {
    id: 6,
    num: "006",
    title: { en: "CSC", es: "CSC" },
    category: { en: "Circular Shipping Company", es: "Circular Shipping Company" },
    tags: ["Web Design", "Development"],
    year: "2024",
    href: "https://www.circularshipping.nl",
  },
];

export default function Work() {
  const { lang } = useLanguage();
  const tr = t[lang].work;

  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-12" style={{ backgroundColor: "var(--page-bg)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter leading-none max-w-full break-words [overflow-wrap:anywhere]" style={{ color: "var(--text)" }}>
            {tr.heading}
          </h2>
          <a href="#contact" className="work-all-link text-sm font-semibold underline underline-offset-4">
            {tr.all}
          </a>
        </div>

        {/* Studio-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ border: "1px solid var(--border)" }}>
          {projects.map((project) => {
            const inner = (
              <div className="studio-cursor-expand group relative flex flex-col justify-between gap-8 p-8 md:p-10 overflow-hidden"
                style={{ borderBottom: "1px solid var(--border)" }}>

                {/* Red fill from bottom on hover */}
                <div className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500"
                  style={{
                    backgroundColor: "var(--accent)",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    zIndex: 0,
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <span className="text-xs font-bold tracking-widest text-[#888888] group-hover:text-white/50 transition-colors duration-300">
                    {project.num}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-black tracking-tight leading-[1.0] mb-6 text-[#111111] group-hover:text-white transition-colors duration-300 max-w-full break-words [overflow-wrap:anywhere]">
                    {project.title[lang]}
                  </h3>
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag}
                          className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-[#E8E8E8] text-[#888888] group-hover:border-white/30 group-hover:text-white/70 transition-all duration-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm shrink-0 text-[#888888] group-hover:text-white/50 transition-colors duration-300">
                      {project.year} {project.href ? "↗" : ""}
                    </span>
                  </div>
                </div>
              </div>
            );

            const oddCol = project.id % 2 === 1;
            const borderRight = oddCol ? { borderRight: "1px solid var(--border)" } : {};

            if (project.href) {
              const isExternal = project.href.startsWith("http");
              return (
                <a
                  key={project.id}
                  href={project.href}
                  target={isExternal ? "_blank" : "_self"}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  style={borderRight}
                >
                  {inner}
                </a>
              );
            }
            return (
              <div key={project.id} style={borderRight}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
