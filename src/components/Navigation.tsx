"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("bold");
  const { lang, setLang } = useLanguage();
  const tr = t[lang].nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Read active theme from nearest [data-theme] ancestor
    const el = document.querySelector("[data-theme]");
    if (el) setTheme(el.getAttribute("data-theme") ?? "bold");

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lightBg = scrolled || theme === "clay" || theme === "light";

  const navLinks = [
    { label: tr.work, href: "#work" },
    { label: tr.services, href: "#services" },
    { label: tr.about, href: "#about" },
    { label: tr.contact, href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-0 flex items-center justify-between gap-4 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md border-b" : "bg-transparent"
      }`}
      style={scrolled ? { backgroundColor: "var(--page-bg)", borderColor: "var(--border)" } : undefined}
    >
      <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Newww.">
        <img
          src="/favicon-mark.png"
          alt=""
          className="h-[72px] w-[72px] object-contain"
          style={{ filter: "invert(1)" }}
        />
        <span className="text-base font-semibold">
          <span style={{ color: "#AAAAAA" }}>Made by </span>
          <span style={{ color: "#111111", textDecoration: "underline", textUnderlineOffset: "3px" }}>Newww.</span>
        </span>
      </Link>


      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="nav-link text-sm font-medium"
            style={{ color: lightBg ? "var(--text)" : "rgba(255,255,255,0.65)" }}
          >
            {label}
          </a>
        ))}

        {/* Lang toggle */}
        <button
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          className="text-xs font-bold tracking-widest transition-colors px-2 py-1 rounded border"
          style={{
            color: lightBg ? "var(--text-muted)" : "rgba(255,255,255,0.5)",
            borderColor: lightBg ? "var(--border)" : "rgba(255,255,255,0.2)",
          }}
        >
          {lang === "en" ? "ES" : "EN"}
        </button>

        <a
          href="#contact"
          className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
          style={
            lightBg
              ? { backgroundColor: "var(--text)", color: "var(--page-bg)" }
              : { backgroundColor: "#fff", color: "var(--dark)" }
          }
        >
          {tr.cta}
        </a>
      </nav>

      {/* Hamburger */}
      <div className="md:hidden flex items-center gap-4">
        <button
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          className="text-xs font-bold tracking-widest px-2 py-1 rounded border"
          style={{
            color: lightBg ? "var(--text-muted)" : "rgba(255,255,255,0.5)",
            borderColor: lightBg ? "var(--border)" : "rgba(255,255,255,0.2)",
          }}
        >
          {lang === "en" ? "ES" : "EN"}
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="flex flex-col gap-[5px] p-1"
        >
          {[
            menuOpen ? "rotate-45 translate-y-[7px]" : "",
            menuOpen ? "opacity-0" : "",
            menuOpen ? "-rotate-45 -translate-y-[7px]" : "",
          ].map((extra, i) => (
            <span
              key={i}
              className={`block w-6 h-0.5 transition-all duration-300 ${extra}`}
              style={{ backgroundColor: lightBg ? "var(--text)" : "#fff" }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute top-full left-0 right-0 border-t px-6 py-8 flex flex-col gap-6 transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "var(--page-bg)", borderColor: "var(--border)" }}
      >
        {navLinks.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            className="text-3xl font-black tracking-tighter nav-link"
            style={{ color: "var(--text)" }}
          >
            {label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="px-6 py-4 rounded-full text-center font-semibold transition-colors"
          style={{ backgroundColor: "var(--text)", color: "var(--page-bg)" }}
        >
          {tr.cta}
        </a>
      </div>
    </header>
  );
}
