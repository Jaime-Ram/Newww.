"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  bg:       "#04060A",
  surface:  "#0A1020",
  border:   "rgba(255,255,255,0.06)",
  violet:   "#7C3AED",
  electric: "#818CF8",
  cyan:     "#06B6D4",
  emerald:  "#10B981",
  text:     "#F1F5F9",
  muted:    "#475569",
  dimmed:   "#1E293B",
  amber:    "#F59E0B",
};

const F = "var(--font-space, 'Space Grotesk', sans-serif)";
const M = "'JetBrains Mono', 'Courier New', monospace";

// ─── Root page ───────────────────────────────────────────────────────────────
export default function TechFlowPage() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [annual, setAnnual]         = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: F, minHeight: "100vh", overflowX: "hidden" }}>
      <Nav scrolled={scrolled} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Hero />
      <Marquee />
      <Features />
      <Pricing annual={annual} setAnnual={setAnnual} />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({
  scrolled,
  mobileOpen,
  setMobileOpen,
}: {
  scrolled: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const links = ["Product", "Docs", "Changelog", "Pricing"];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          zIndex: 100,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          backgroundColor: scrolled ? "rgba(4,6,10,0.95)" : "rgba(4,6,10,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          transition: "background-color 0.25s",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo — dot grid + wordmark */}
          <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px",
                width: "20px",
                height: "20px",
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: i === 0 || i === 3 ? C.violet : C.electric,
                    opacity: i === 1 || i === 2 ? 0.5 : 1,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: F,
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "-0.02em",
                color: C.text,
              }}
            >
              TechFlow
            </span>
          </a>

          {/* Desktop links */}
          <div
            className="hidden md:flex"
            style={{ gap: "32px", alignItems: "center" }}
          >
            {links.map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: "#94A3B8",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.text)}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#94A3B8")}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex" style={{ gap: "10px", alignItems: "center" }}>
            <a
              href="#"
              style={{
                color: "#94A3B8",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                padding: "7px 16px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.text)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#94A3B8")}
            >
              Log in
            </a>
            <a
              href="#"
              style={{
                backgroundColor: C.violet,
                color: "#fff",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                padding: "8px 18px",
                borderRadius: "8px",
                transition: "background-color 0.15s",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = "#6D28D9")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = C.violet)}
            >
              Start building
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="flex md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  backgroundColor: C.text,
                  borderRadius: "2px",
                  transition: "transform 0.2s, opacity 0.2s",
                  transform:
                    mobileOpen && i === 0 ? "translateY(7px) rotate(45deg)" :
                    mobileOpen && i === 2 ? "translateY(-7px) rotate(-45deg)" : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            backgroundColor: C.bg,
            display: "flex",
            flexDirection: "column",
            padding: "88px 32px 40px",
            gap: "28px",
          }}
        >
          {links.map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => setMobileOpen(false)}
              style={{
                color: C.text,
                textDecoration: "none",
                fontSize: "1.75rem",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                borderBottom: `1px solid ${C.border}`,
                paddingBottom: "20px",
              }}
            >
              {link}
            </a>
          ))}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            <a
              href="#"
              style={{
                backgroundColor: C.violet,
                color: "#fff",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 600,
                padding: "14px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              Start building
            </a>
          </div>
        </div>
      )}
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="tf-grain"
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: "60px",
        backgroundColor: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric orbs */}
      <div
        className="tf-orb"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        className="tf-orb"
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0.04) 50%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          animationDelay: "-4s",
        }}
      />

      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
          zIndex: 0,
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "780px",
          width: "100%",
          padding: "80px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "0",
        }}
      >
        {/* Beta badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid rgba(16,185,129,0.3)",
            backgroundColor: "rgba(16,185,129,0.06)",
            borderRadius: "20px",
            padding: "6px 14px",
            marginBottom: "44px",
          }}
        >
          <span
            className="tf-pulse-dot"
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: C.emerald,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: M,
              fontSize: "0.75rem",
              color: C.emerald,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            Now in public beta
          </span>
        </div>

        {/* Mixed-weight headline */}
        <h1
          style={{
            margin: "0 0 28px",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: F,
              fontWeight: 300,
              fontSize: "clamp(3rem, 7vw, 7rem)",
              color: C.text,
              opacity: 0.75,
            }}
          >
            Engineering velocity,
          </span>
          <span
            style={{
              display: "block",
              fontFamily: F,
              fontWeight: 700,
              fontSize: "clamp(3rem, 7vw, 7rem)",
              color: C.text,
              background: `linear-gradient(135deg, ${C.text} 0%, ${C.electric} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            without the drag.
          </span>
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: F,
            fontSize: "1.1rem",
            color: "#64748B",
            lineHeight: 1.7,
            margin: "0 0 40px",
            maxWidth: "520px",
          }}
        >
          TechFlow connects your entire engineering stack — commits, builds, tests, deploys.
          Surface bottlenecks before they block your team.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
          <a
            href="#"
            style={{
              backgroundColor: C.violet,
              color: "#fff",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 600,
              padding: "13px 28px",
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "background-color 0.15s, transform 0.1s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#6D28D9";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = C.violet;
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Start building for free <span style={{ opacity: 0.8 }}>→</span>
          </a>
          <a
            href="#"
            style={{
              backgroundColor: "transparent",
              color: "#94A3B8",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 500,
              padding: "13px 24px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = C.text;
              el.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#94A3B8";
              el.style.textDecoration = "none";
            }}
          >
            Watch 3-min demo
          </a>
        </div>

        {/* Trust line */}
        <p
          style={{
            fontFamily: M,
            fontSize: "0.72rem",
            color: C.muted,
            letterSpacing: "0.04em",
            margin: "0 0 72px",
          }}
        >
          No credit card &nbsp;·&nbsp; SOC 2 Type II &nbsp;·&nbsp; 99.9% uptime SLA
        </p>

        {/* Terminal card */}
        <div
          style={{
            width: "100%",
            maxWidth: "580px",
            backgroundColor: C.surface,
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 0 60px rgba(124,58,237,0.15), 0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Window chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              backgroundColor: "rgba(10,16,32,0.8)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              {["#FF5F57", "#FFBD2E", "#28CA41"].map((c, i) => (
                <div key={i} style={{ width: "11px", height: "11px", borderRadius: "50%", backgroundColor: c }} />
              ))}
            </div>
            <span
              style={{
                fontFamily: M,
                fontSize: "0.72rem",
                color: C.muted,
                flex: 1,
                textAlign: "center",
                letterSpacing: "0.02em",
              }}
            >
              Quick start
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
            {/* Command line */}
            <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
              <span style={{ fontFamily: M, fontSize: "0.85rem", color: C.muted, userSelect: "none" }}>$</span>
              <span style={{ fontFamily: M, fontSize: "0.85rem", color: C.text }}>
                npx create-techflow@latest my-pipeline
              </span>
            </div>

            <div style={{ height: "10px" }} />

            {/* Success lines */}
            {[
              "Pipeline created in 340ms",
              "Connected to GitHub",
              "First deploy triggered",
            ].map((line) => (
              <div key={line} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontFamily: M, fontSize: "0.85rem", color: C.emerald, userSelect: "none" }}>✓</span>
                <span style={{ fontFamily: M, fontSize: "0.85rem", color: "#94A3B8" }}>{line}</span>
              </div>
            ))}

            <div style={{ height: "10px" }} />

            {/* Dashboard link */}
            <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
              <span style={{ fontFamily: M, fontSize: "0.85rem", color: C.cyan, userSelect: "none" }}>→</span>
              <span style={{ fontFamily: M, fontSize: "0.85rem" }}>
                <span style={{ color: "#64748B" }}>Dashboard: </span>
                <span style={{ color: C.cyan }}>https://app.techflow.io/my-pipeline</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee() {
  const companies = [
    "Stripe", "Notion", "Figma", "Vercel", "Linear",
    "Shopify", "GitHub", "Netlify", "PlanetScale", "Clerk",
  ];
  // duplicate for seamless loop
  const all = [...companies, ...companies];

  return (
    <div
      style={{
        backgroundColor: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        height: "52px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="animate-marquee"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {all.map((name, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            <span
              style={{
                fontFamily: F,
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#334155",
                letterSpacing: "0.04em",
                padding: "0 24px",
              }}
            >
              {name}
            </span>
            <span style={{ color: C.violet, fontSize: "0.55rem", opacity: 0.7 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section
      style={{
        padding: "130px 24px",
        backgroundColor: C.bg,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section label */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <span
            style={{
              fontFamily: M,
              fontSize: "0.75rem",
              color: C.electric,
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "16px",
            }}
          >
            // what&apos;s inside
          </span>
          <h2
            style={{
              fontFamily: F,
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: 0,
              color: C.text,
            }}
          >
            Built different
          </h2>
        </div>

        {/* Panel 01 — left text, right pipeline visual */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px",
            marginBottom: "2px",
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
          }}
          className="tf-panel-grid"
        >
          <div
            style={{
              backgroundColor: C.surface,
              padding: "64px 56px",
              borderLeft: `4px solid ${C.violet}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <span style={{ fontFamily: M, fontSize: "3.5rem", fontWeight: 700, color: C.dimmed, lineHeight: 1 }}>
              01
            </span>
            <h3
              style={{
                fontFamily: F,
                fontWeight: 700,
                fontSize: "1.5rem",
                letterSpacing: "-0.03em",
                color: C.text,
                margin: 0,
              }}
            >
              Pipeline Orchestration
            </h3>
            <p style={{ fontFamily: F, fontSize: "0.95rem", color: C.muted, lineHeight: 1.7, margin: 0, maxWidth: "360px" }}>
              Connect every stage of your release cycle — from commit to production — with a single unified runtime that respects your existing tooling.
            </p>
            <a
              href="#"
              style={{
                fontFamily: F,
                fontSize: "0.875rem",
                color: C.electric,
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
                transition: "gap 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.gap = "10px")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.gap = "6px")}
            >
              Explore <span>→</span>
            </a>
          </div>

          {/* Pipeline visual */}
          <div
            style={{
              backgroundColor: C.surface,
              padding: "64px 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PipelineVisual />
          </div>
        </div>

        {/* Panel 02 — right text, left data viz */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px",
            marginBottom: "2px",
          }}
        >
          {/* Data viz */}
          <div
            style={{
              backgroundColor: C.surface,
              padding: "64px 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DataVizPanel />
          </div>

          <div
            style={{
              backgroundColor: C.surface,
              padding: "64px 56px",
              borderLeft: `4px solid ${C.cyan}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <span style={{ fontFamily: M, fontSize: "3.5rem", fontWeight: 700, color: C.dimmed, lineHeight: 1 }}>
              02
            </span>
            <h3
              style={{
                fontFamily: F,
                fontWeight: 700,
                fontSize: "1.5rem",
                letterSpacing: "-0.03em",
                color: C.text,
                margin: 0,
              }}
            >
              Bottleneck Intelligence
            </h3>
            <p style={{ fontFamily: F, fontSize: "0.95rem", color: C.muted, lineHeight: 1.7, margin: 0, maxWidth: "360px" }}>
              TechFlow traces latency through your entire system — tests that creep, reviews that stall, deploys that block. Fix the right things first.
            </p>
            <a
              href="#"
              style={{
                fontFamily: F,
                fontSize: "0.875rem",
                color: C.cyan,
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
                transition: "gap 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.gap = "10px")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.gap = "6px")}
            >
              Explore <span>→</span>
            </a>
          </div>
        </div>

        {/* Panel 03 — full width, metrics */}
        <div
          style={{
            backgroundColor: C.surface,
            padding: "80px 48px",
            borderRadius: "0 0 16px 16px",
            borderLeft: `4px solid ${C.emerald}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "48px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0",
              width: "100%",
              maxWidth: "780px",
              textAlign: "center",
            }}
          >
            {[
              { num: "99.9%", label: "Uptime SLA", color: C.emerald },
              { num: "< 2min", label: "Average build time", color: C.electric },
              { num: "10,000+", label: "Engineering teams", color: C.cyan },
            ].map(({ num, label, color }, i) => (
              <div
                key={num}
                style={{
                  padding: "0 32px",
                  borderRight: i < 2 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: F,
                    fontWeight: 700,
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color,
                    marginBottom: "12px",
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily: M,
                    fontSize: "0.72rem",
                    color: C.muted,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ maxWidth: "520px", textAlign: "center" }}>
            <span
              style={{
                fontFamily: M,
                fontSize: "0.75rem",
                color: C.electric,
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: "14px",
              }}
            >
              03 &nbsp;/&nbsp; Scale &amp; Reliability
            </span>
            <p style={{ fontFamily: F, fontSize: "0.95rem", color: C.muted, lineHeight: 1.7, margin: 0 }}>
              Built on a distributed execution layer, TechFlow runs workloads across regions automatically.
              No infrastructure knowledge required — just results.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tf-panel-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Pipeline visual component ────────────────────────────────────────────────
function PipelineVisual() {
  const stages = [
    { label: "Commit", dot: C.emerald, pct: 100 },
    { label: "Build",  dot: C.emerald, pct: 78  },
    { label: "Test",   dot: C.amber,   pct: 52  },
    { label: "Deploy", dot: C.violet,  pct: 35  },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Stage boxes with arrows */}
      <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
        {stages.map((stage, i) => (
          <div key={stage.label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div
              style={{
                flex: 1,
                backgroundColor: "rgba(10,16,40,0.9)",
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                padding: "12px 10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                minWidth: 0,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: M, fontSize: "0.65rem", color: C.muted }}>{stage.label}</span>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: stage.dot }} />
              </div>
              <div
                style={{
                  height: "3px",
                  backgroundColor: C.dimmed,
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${stage.pct}%`,
                    backgroundColor: stage.dot,
                    borderRadius: "2px",
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
            {i < stages.length - 1 && (
              <div style={{ padding: "0 4px", color: "#1E293B", fontSize: "0.7rem", flexShrink: 0 }}>
                ──▶
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live feed */}
      <div
        style={{
          backgroundColor: "rgba(10,16,40,0.9)",
          border: `1px solid ${C.border}`,
          borderRadius: "8px",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "7px",
        }}
      >
        {[
          { dot: C.emerald, text: "main pushed — pipeline triggered", time: "2s ago" },
          { dot: C.amber,   text: "test/unit-auth — running (14 of 20)", time: "1m ago" },
          { dot: C.electric,text: "staging deploy — queued", time: "2m ago" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: item.dot, flexShrink: 0 }} />
            <span style={{ fontFamily: M, fontSize: "0.62rem", color: "#475569", flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {item.text}
            </span>
            <span style={{ fontFamily: M, fontSize: "0.58rem", color: C.dimmed, flexShrink: 0 }}>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Data viz component ───────────────────────────────────────────────────────
function DataVizPanel() {
  const bars = [
    { label: "Code Review", pct: 82, color: C.violet },
    { label: "CI Pipeline", pct: 56, color: C.electric },
    { label: "Deploy", pct: 34, color: C.cyan },
    { label: "QA Sign-off", pct: 91, color: C.emerald },
    { label: "Monitoring", pct: 68, color: C.amber },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ fontFamily: M, fontSize: "0.7rem", color: C.muted, letterSpacing: "0.06em", marginBottom: "4px" }}>
        CYCLE TIME BREAKDOWN — LAST 30D
      </div>
      {bars.map((bar) => (
        <div key={bar.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: M, fontSize: "0.65rem", color: "#64748B" }}>{bar.label}</span>
            <span style={{ fontFamily: M, fontSize: "0.65rem", color: bar.color }}>{bar.pct}%</span>
          </div>
          <div style={{ height: "6px", backgroundColor: C.dimmed, borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${bar.pct}%`,
                background: `linear-gradient(90deg, ${bar.color}99, ${bar.color})`,
                borderRadius: "3px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────────────────
function Pricing({ annual, setAnnual }: { annual: boolean; setAnnual: (v: boolean) => void }) {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      annualPrice: "Free",
      tagline: "Perfect for side projects and small teams",
      features: [
        "1 active pipeline",
        "5 team members",
        "Basic analytics",
        "Community support",
        "GitHub integration",
      ],
      cta: "Get started free",
      style: "ghost" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$49",
      annualPrice: "$39",
      tagline: "For growing engineering teams",
      features: [
        "Unlimited pipelines",
        "25 team members",
        "AI bottleneck detection",
        "Priority support",
        "Custom alerts",
        "Advanced analytics",
      ],
      cta: "Start free trial",
      style: "filled" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      annualPrice: "Custom",
      tagline: "For large organizations at scale",
      features: [
        "Unlimited everything",
        "SSO and SAML",
        "Dedicated SLA",
        "Dedicated support",
        "Custom integrations",
        "Audit logs",
      ],
      cta: "Contact sales",
      style: "ghost" as const,
      popular: false,
    },
  ];

  return (
    <section
      className="tf-grain"
      style={{
        padding: "130px 24px",
        position: "relative",
        background: `radial-gradient(ellipse 70% 60% at 50% 100%, rgba(124,58,237,0.08) 0%, transparent 60%), ${C.bg}`,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span
            style={{
              fontFamily: M,
              fontSize: "0.75rem",
              color: C.electric,
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "16px",
            }}
          >
            // pricing
          </span>
          <h2
            style={{
              fontFamily: F,
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: "0 0 32px",
              color: C.text,
            }}
          >
            Simple, transparent pricing
          </h2>

          {/* Toggle */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "4px",
              gap: "4px",
              backgroundColor: C.surface,
            }}
          >
            {(["Monthly", "Annual"] as const).map((label) => {
              const active = label === "Monthly" ? !annual : annual;
              return (
                <button
                  key={label}
                  onClick={() => setAnnual(label === "Annual")}
                  style={{
                    background: active ? C.violet : "transparent",
                    color: active ? "#fff" : C.muted,
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 20px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: F,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {label}
                  {label === "Annual" && (
                    <span
                      style={{
                        fontSize: "0.68rem",
                        backgroundColor: active ? "rgba(255,255,255,0.15)" : "rgba(16,185,129,0.15)",
                        color: active ? "#fff" : C.emerald,
                        padding: "2px 7px",
                        borderRadius: "4px",
                        fontWeight: 600,
                        fontFamily: M,
                      }}
                    >
                      save 20%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                backgroundColor: C.surface,
                border: plan.popular ? `1px solid ${C.violet}` : `1px solid ${C.border}`,
                borderRadius: "12px",
                padding: "36px 32px",
                position: "relative",
                boxShadow: plan.popular ? `0 0 40px rgba(124,58,237,0.15)` : "none",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-13px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: C.violet,
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "4px 14px",
                    borderRadius: "20px",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    fontFamily: M,
                    textTransform: "uppercase",
                  }}
                >
                  Most popular
                </div>
              )}

              <h3 style={{ fontFamily: F, fontSize: "1.1rem", fontWeight: 700, color: C.text, margin: "0 0 6px" }}>
                {plan.name}
              </h3>
              <p style={{ fontFamily: F, fontSize: "0.82rem", color: C.muted, margin: "0 0 24px", lineHeight: 1.5 }}>
                {plan.tagline}
              </p>

              <div style={{ marginBottom: "28px", display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span
                  style={{
                    fontFamily: F,
                    fontSize: "2.75rem",
                    fontWeight: 700,
                    color: C.text,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {annual ? plan.annualPrice : plan.price}
                </span>
                {plan.price !== "Free" && plan.price !== "Custom" && (
                  <span style={{ fontFamily: M, fontSize: "0.8rem", color: C.muted }}>/mo</span>
                )}
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {plan.features.map((feat) => (
                  <li key={feat} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: C.emerald, fontSize: "0.9rem", flexShrink: 0, lineHeight: 1 }}>✓</span>
                    <span style={{ fontFamily: F, fontSize: "0.875rem", color: "#64748B" }}>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontFamily: F,
                  transition: "all 0.15s",
                  backgroundColor: plan.style === "filled" ? C.violet : "transparent",
                  color: plan.style === "filled" ? "#fff" : C.text,
                  border: plan.style === "ghost" ? `1px solid ${C.border}` : "none",
                }}
                onMouseEnter={(e) => {
                  if (plan.style === "filled") (e.currentTarget as HTMLElement).style.backgroundColor = "#6D28D9";
                  else (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  if (plan.style === "filled") (e.currentTarget as HTMLElement).style.backgroundColor = C.violet;
                  else (e.currentTarget as HTMLElement).style.borderColor = C.border;
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      quote: "TechFlow completely changed how we ship. We cut deploy time from two hours down to twelve minutes. The bottleneck detection found an issue we had ignored for months.",
      highlight: "cut deploy time from two hours down to twelve minutes",
      name: "Sarah Kim",
      role: "CTO",
      company: "Notion",
      initials: "SK",
      avatarBg: `linear-gradient(135deg, ${C.violet}, ${C.electric})`,
    },
    {
      quote: "Finally a pipeline tool that doesn't require a PhD to configure. We were live in under an hour. The AI surface layer is the real differentiator.",
      highlight: "were live in under an hour",
      name: "Marcus Torres",
      role: "VP Engineering",
      company: "Stripe",
      initials: "MT",
      avatarBg: `linear-gradient(135deg, #0EA5E9, #6366F1)`,
    },
    {
      quote: "The real-time observability across our entire pipeline is something we built internally for years and never got right. TechFlow just works, out of the box.",
      highlight: "TechFlow just works, out of the box",
      name: "Priya Mehta",
      role: "Engineering Lead",
      company: "Figma",
      initials: "PM",
      avatarBg: `linear-gradient(135deg, #EC4899, #8B5CF6)`,
    },
  ];

  return (
    <section
      style={{
        padding: "130px 24px",
        backgroundColor: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <span
            style={{
              fontFamily: M,
              fontSize: "0.75rem",
              color: C.electric,
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "16px",
            }}
          >
            // testimonials
          </span>
          <h2
            style={{
              fontFamily: F,
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: 0,
              color: C.text,
            }}
          >
            Trusted by teams that ship
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                backgroundColor: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.3)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = C.border)}
            >
              <div style={{ color: C.amber, fontSize: "0.85rem", letterSpacing: "3px" }}>
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              <p
                style={{
                  fontFamily: F,
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: "#94A3B8",
                  margin: 0,
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  paddingTop: "16px",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: t.avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                    fontFamily: F,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontFamily: F, fontSize: "0.875rem", fontWeight: 700, color: C.text }}>
                    {t.name}
                  </div>
                  <div style={{ fontFamily: M, fontSize: "0.72rem", color: C.muted }}>
                    {t.role} @ {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section
      className="tf-grain"
      style={{
        padding: "140px 24px",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0A0520 0%, #0D1525 50%, #050B18 100%)",
        textAlign: "center",
      }}
    >
      {/* Background orb */}
      <div
        className="tf-orb"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
        <span
          style={{
            fontFamily: M,
            fontSize: "0.75rem",
            color: C.electric,
            letterSpacing: "0.1em",
            display: "block",
            marginBottom: "24px",
          }}
        >
          // get started today
        </span>
        <h2
          style={{
            fontFamily: F,
            fontWeight: 700,
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: "0 0 24px",
            color: C.text,
          }}
        >
          Your next deploy
          <br />
          <span style={{ color: C.electric }}>is waiting.</span>
        </h2>
        <p
          style={{
            fontFamily: F,
            fontSize: "1.05rem",
            color: C.muted,
            lineHeight: 1.7,
            margin: "0 0 48px",
            maxWidth: "480px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Join 10,000+ engineering teams who eliminated bottlenecks and ship with confidence.
          Free to start, no credit card required.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#"
            style={{
              backgroundColor: C.violet,
              color: "#fff",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 600,
              padding: "14px 32px",
              borderRadius: "8px",
              transition: "background-color 0.15s, transform 0.1s",
              fontFamily: F,
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#6D28D9";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = C.violet;
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Start building for free
          </a>
          <a
            href="#"
            style={{
              backgroundColor: "transparent",
              color: "#fff",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 600,
              padding: "14px 32px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "border-color 0.15s",
              fontFamily: F,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")}
          >
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: "Product",
      links: ["Features", "Changelog", "Roadmap", "Status", "Integrations"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press", "Partners"],
    },
    {
      title: "Resources",
      links: ["Docs", "API Reference", "Guides", "Community", "Support"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "Cookies", "SLA"],
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#020408",
        borderTop: `1px solid ${C.border}`,
        padding: "72px 24px 40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "56px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px",
              width: "20px",
              height: "20px",
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: i === 0 || i === 3 ? C.violet : C.electric,
                  opacity: i === 1 || i === 2 ? 0.35 : 0.7,
                }}
              />
            ))}
          </div>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: "1rem", color: "#334155", letterSpacing: "-0.01em" }}>
            TechFlow
          </span>
        </div>

        {/* Link columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "40px",
            marginBottom: "60px",
          }}
        >
          {cols.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily: M,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "#334155",
                  margin: "0 0 18px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontFamily: F,
                        fontSize: "0.875rem",
                        color: "#334155",
                        textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#94A3B8")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#334155")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span style={{ fontFamily: M, fontSize: "0.75rem", color: "#1E293B" }}>
            &copy; 2025 TechFlow, Inc. All rights reserved.
          </span>
          <span style={{ fontFamily: M, fontSize: "0.75rem", color: "#1E293B" }}>
            Built by{" "}
            <Link
              href="/"
              style={{ color: C.electric, textDecoration: "none", fontWeight: 600 }}
            >
              newww.
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
