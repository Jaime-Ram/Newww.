"use client";

import SiteQrCode from "@/components/SiteQrCode";
import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function Footer() {
  const { lang } = useLanguage();
  const tr = t[lang].footer;
  const year = new Date().getFullYear();

  const navLinks = [
    t[lang].nav.work, t[lang].nav.services, t[lang].nav.about, t[lang].nav.contact,
  ];
  const hrefs = ["#work", "#services", "#about", "#contact"];

  return (
    <footer className="px-6 md:px-12 py-16" style={{ backgroundColor: "var(--dark)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 pb-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/favicon-mark.png" alt="" className="h-[72px] w-[72px] object-contain" style={{ filter: "none" }} />
              <span className="text-base font-semibold">
                <span style={{ color: "rgba(255,255,255,0.35)" }}>Made by </span>
                <span style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "3px" }}>Newww.</span>
              </span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-[200px]">{tr.tagline}</p>
            <div className="mt-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-white/20 text-xs font-bold tracking-widest uppercase mb-4 block">{tr.qrEyebrow}</span>
              <SiteQrCode />
              <p className="text-white/35 text-xs leading-relaxed max-w-[140px] mt-3">{tr.qrCaption}</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-white/20 text-xs font-bold tracking-widest uppercase mb-5 block">{tr.nav}</span>
            <div className="flex flex-col gap-3">
              {navLinks.map((label, i) => (
                <a key={label} href={hrefs[i]} className="footer-link text-sm">{label}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <span className="text-white/20 text-xs font-bold tracking-widest uppercase mb-5 block">{tr.contact}</span>
            <div className="flex flex-col gap-3">
              <a href="#contact" className="footer-link text-sm">{tr.contactFormLink}</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link text-sm">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link text-sm">LinkedIn</a>
            </div>
          </div>

          {/* Locations */}
          <div>
            <span className="text-white/20 text-xs font-bold tracking-widest uppercase mb-5 block">{tr.locations}</span>
            <div className="flex flex-col gap-3">
              {tr.cities.map((city) => (
                <span key={city} className="text-white/40 text-sm">{city}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-white/20 text-xs">{tr.copy(year)}</p>
          <div className="flex gap-6">
            <a href="#" className="text-white/20 text-xs hover:text-white/40 transition-colors">{tr.privacy}</a>
            <a href="#" className="text-white/20 text-xs hover:text-white/40 transition-colors">{tr.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
