"use client";

import { useState } from "react";
import Link from "next/link";

const CREAM  = "#F5F0EB";
const TERRA  = "#C23B22";
const INK    = "#1A1A18";
const MUTED  = "#8C7B6E";
const BORDER = "rgba(26,26,24,0.10)";

const COR = "var(--font-cormorant), Georgia, 'Times New Roman', serif";
const SAN = "system-ui, -apple-system, sans-serif";

const services = [
  { name: "Corte Clásico",    price: "$350", dur: "30 min", desc: "Tijera o máquina, lavado incluido"          },
  { name: "Fade & Degradado", price: "$400", dur: "35 min", desc: "Máquina, varios tipos de degradado"         },
  { name: "Corte + Barba",    price: "$520", dur: "45 min", desc: "Corte completo y diseño de barba"           },
  { name: "Afeitado Clásico", price: "$290", dur: "30 min", desc: "Navaja recta, espuma de afeitar, hot towel" },
  { name: "Barba Completa",   price: "$280", dur: "25 min", desc: "Perfilado, diseño y aceite de barba"        },
  { name: "Corte Niños",      price: "$280", dur: "20 min", desc: "Hasta 12 años, tijera o máquina"            },
];

const team = [
  { name: "Marcos Suárez",    role: "Maestro Barbero", initials: "MS", color: "#C4A882" },
  { name: "Sebastián Ríos",   role: "Barbero Senior",  initials: "SR", color: "#9BAAB8" },
  { name: "Valentina Castro",  role: "Barbera",         initials: "VC", color: "#C2A4A8" },
];

const gallery = [
  { label: "El ambiente",  bg: "linear-gradient(160deg, #E8DDD4 0%, #C9BCB0 100%)" },
  { label: "Instrumentos", bg: "linear-gradient(160deg, #DDD6CE 0%, #BDB5AC 100%)" },
  { label: "La silla",     bg: "linear-gradient(160deg, #EAE0D8 0%, #CBBFB4 100%)" },
  { label: "Maestría",     bg: "linear-gradient(160deg, #E2D9D2 0%, #C4BAB2 100%)" },
  { label: "Detalle",      bg: "linear-gradient(160deg, #E6DEDB 0%, #C8BEB8 100%)" },
  { label: "Tradición",    bg: "linear-gradient(160deg, #EDE4DC 0%, #CBBFB6 100%)" },
  { label: "El corte",     bg: "linear-gradient(160deg, #E4DCE0 0%, #C6BAC0 100%)" },
];

export default function ElFilo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "", servicio: "", mensaje: "" });

  const navLinks: [string, string][] = [
    ["Servicios", "#servicios"],
    ["Equipo",    "#equipo"],
    ["Galería",   "#galeria"],
    ["Reservar",  "#reservar"],
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "transparent",
    border: `1px solid ${BORDER}`,
    borderRadius: "4px",
    padding: "12px 16px",
    fontSize: "14px",
    color: INK,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: SAN,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "9px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: TERRA,
    fontWeight: 700,
    marginBottom: "8px",
  };

  return (
    <div style={{ backgroundColor: CREAM, color: INK, fontFamily: SAN, overflowX: "hidden" }}>

      {/* ── NAV ── always visible, cream */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: CREAM,
        borderBottom: `1px solid ${BORDER}`,
        padding: "0 clamp(24px, 5vw, 60px)",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <a href="#" style={{ fontFamily: COR, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 600, color: INK, textDecoration: "none", letterSpacing: "-0.02em" }}>
          El Filo
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex" style={{ alignItems: "center", gap: "32px" }}>
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = INK)}
              onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
            >
              {label}
            </a>
          ))}
          <a
            href="#reservar"
            style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "#fff", backgroundColor: TERRA, padding: "9px 20px", borderRadius: "100px", textDecoration: "none", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Reservar
          </a>
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}
          aria-label="Menú"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: "block", width: "22px", height: "1.5px", backgroundColor: INK, transition: "all 0.2s" }} />
          ))}
        </button>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{ position: "absolute", top: "64px", left: 0, right: 0, backgroundColor: CREAM, borderBottom: `1px solid ${BORDER}`, padding: "32px clamp(24px, 5vw, 60px)", display: "flex", flexDirection: "column", gap: "20px", zIndex: 49 }}>
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: COR, fontStyle: "italic", fontSize: "2.2rem", fontWeight: 600, color: INK, textDecoration: "none", lineHeight: 1.1 }}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── split layout */}
      <section className="block md:grid" style={{ gridTemplateColumns: "1fr 380px", minHeight: "76vh" }}>

        {/* Left: editorial type block */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(56px, 10vh, 110px) clamp(24px, 6vw, 80px)" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: TERRA, fontWeight: 600, marginBottom: "28px", margin: "0 0 28px" }}>
            Barbería · Pocitos · Montevideo
          </p>
          <h1 style={{ fontFamily: COR, fontStyle: "italic", fontSize: "clamp(3.8rem, 9vw, 7.5rem)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.02em", color: INK, margin: "0 0 28px" }}>
            El arte del<br />
            <span style={{ color: TERRA }}>corte</span><br />
            perfecto.
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.85, color: MUTED, maxWidth: "360px", marginBottom: "40px", margin: "0 0 40px" }}>
            Precisión, tradición y carácter desde 2009.
            Cada detalle cuenta en Pocitos, Montevideo.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="#reservar"
              style={{ backgroundColor: TERRA, color: "#fff", fontWeight: 600, fontSize: "13px", letterSpacing: "0.08em", padding: "14px 30px", borderRadius: "100px", textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Reservar turno
            </a>
            <a
              href="#servicios"
              style={{ border: `1px solid ${BORDER}`, color: INK, fontWeight: 500, fontSize: "13px", letterSpacing: "0.06em", padding: "14px 30px", borderRadius: "100px", textDecoration: "none", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = TERRA)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
            >
              Ver servicios
            </a>
          </div>
        </div>

        {/* Right: terracotta panel */}
        <div
          className="hidden md:flex"
          style={{ backgroundColor: TERRA, position: "relative", overflow: "hidden", alignItems: "flex-end", justifyContent: "flex-start", padding: "48px 40px" }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: COR, fontStyle: "italic", fontSize: "clamp(3rem, 4vw, 5.5rem)", fontWeight: 700, color: "rgba(255,255,255,0.14)", lineHeight: 0.9, margin: "0 0 20px", userSelect: "none" }}>
              Est.<br />2009
            </p>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
              Av. Brasil 2856
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section
        id="servicios"
        style={{ backgroundColor: CREAM, padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 80px)", borderTop: `1px solid ${BORDER}` }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: TERRA, fontWeight: 600, margin: "0 0 16px" }}>
            Lista de precios
          </p>
          <h2 style={{ fontFamily: COR, fontStyle: "italic", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: INK, lineHeight: 1.0, margin: "0 0 56px" }}>
            Servicios.
          </h2>

          <div>
            {services.map((svc, i) => (
              <div key={svc.name}>
                {i === 0 && <div style={{ height: "1px", backgroundColor: BORDER }} />}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <h3 style={{ fontFamily: COR, fontStyle: "italic", fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)", fontWeight: 600, color: INK, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                      {svc.name}
                    </h3>
                    <p style={{ fontSize: "13px", color: MUTED, margin: 0, lineHeight: 1.5 }}>{svc.desc}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "20px", flexShrink: 0 }}>
                    <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, fontWeight: 500 }}>
                      {svc.dur}
                    </span>
                    <span style={{ fontFamily: COR, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: TERRA, letterSpacing: "-0.02em" }}>
                      {svc.price}
                    </span>
                  </div>
                </div>
                <div style={{ height: "1px", backgroundColor: BORDER }} />
              </div>
            ))}
          </div>

          <p style={{ marginTop: "24px", fontSize: "12px", color: MUTED, letterSpacing: "0.04em" }}>
            Precios en pesos uruguayos · IVA incluido · Reserva recomendada
          </p>
        </div>
      </section>

      {/* ── GALLERY — horizontal filmstrip ── */}
      <section
        id="galeria"
        style={{ backgroundColor: CREAM, paddingTop: "clamp(64px, 10vh, 120px)", paddingBottom: "clamp(64px, 10vh, 120px)", borderTop: `1px solid ${BORDER}` }}
      >
        <div style={{ padding: "0 clamp(24px, 6vw, 80px)", marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: TERRA, fontWeight: 600, margin: "0 0 16px" }}>
            Espacio
          </p>
          <h2 style={{ fontFamily: COR, fontStyle: "italic", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: INK, lineHeight: 1.0, margin: 0 }}>
            El ambiente.
          </h2>
        </div>

        {/* Filmstrip scroll */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: "12px" }}>
          <div style={{ display: "flex", gap: "12px", padding: "0 clamp(24px, 6vw, 80px)", width: "max-content" }}>
            {gallery.map((item, i) => (
              <div
                key={i}
                style={{ width: "260px", height: "360px", borderRadius: "6px", background: item.bg, flexShrink: 0, position: "relative", overflow: "hidden", transition: "opacity 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <div style={{ position: "absolute", bottom: "20px", left: "20px", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(26,26,24,0.40)", fontWeight: 600 }}>
                  {item.label}
                </div>
                <div style={{ position: "absolute", top: "20px", right: "20px", fontSize: "10px", fontFamily: COR, fontStyle: "italic", color: "rgba(26,26,24,0.20)", fontWeight: 600 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section
        id="equipo"
        style={{ backgroundColor: CREAM, padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 80px)", borderTop: `1px solid ${BORDER}` }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: TERRA, fontWeight: 600, margin: "0 0 16px" }}>
            Nuestros maestros
          </p>
          <h2 style={{ fontFamily: COR, fontStyle: "italic", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: INK, lineHeight: 1.0, margin: "0 0 64px" }}>
            El Equipo.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "48px 40px" }}>
            {team.map(person => (
              <div key={person.name}>
                {/* Circular portrait */}
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: person.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <span style={{ fontFamily: COR, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>
                    {person.initials}
                  </span>
                </div>

                <h3 style={{ fontFamily: COR, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 600, color: INK, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                  {person.name}
                </h3>
                <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: TERRA, fontWeight: 600, margin: "0 0 16px" }}>
                  {person.role}
                </p>
                <a
                  href="#reservar"
                  style={{ fontSize: "12px", fontWeight: 500, color: MUTED, textDecoration: "underline", textUnderlineOffset: "3px", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = INK)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                >
                  Reservar con {person.name.split(" ")[0]} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING — simple 4-field form ── */}
      <section
        id="reservar"
        style={{ backgroundColor: "#EDE8E3", padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 80px)", borderTop: `1px solid ${BORDER}` }}
      >
        <div className="block md:grid" style={{ maxWidth: "1100px", margin: "0 auto", gridTemplateColumns: "1fr 1.5fr", gap: "80px", alignItems: "start" }}>

          {/* Left: heading + details */}
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: TERRA, fontWeight: 600, margin: "0 0 16px" }}>
              Agenda tu turno
            </p>
            <h2 style={{ fontFamily: COR, fontStyle: "italic", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: INK, lineHeight: 1.0, margin: "0 0 24px" }}>
              Reservar.
            </h2>
            <p style={{ fontSize: "14px", lineHeight: 1.85, color: MUTED, maxWidth: "320px", margin: "0 0 36px" }}>
              Dejanos tus datos y te confirmamos por WhatsApp en menos de una hora.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {([
                ["Dirección", "Av. Brasil 2856, Pocitos"],
                ["Teléfono",  "+598 2710 4400"],
                ["Instagram", "@elfilo.mvd"],
                ["Horario",   "Lun – Sáb: 09:00 – 20:00"],
              ] as [string, string][]).map(([lbl, val]) => (
                <div key={lbl} style={{ display: "flex", gap: "20px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: TERRA, fontWeight: 700, minWidth: "72px", paddingTop: "2px" }}>
                    {lbl}
                  </span>
                  <span style={{ fontSize: "13px", color: MUTED }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div style={{ backgroundColor: CREAM, borderRadius: "8px", padding: "clamp(24px, 4vw, 48px)", border: `1px solid ${BORDER}` }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Teléfono</label>
              <input
                type="tel"
                placeholder="+598 ..."
                value={form.telefono}
                onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Servicio</label>
              <select
                value={form.servicio}
                onChange={e => setForm(f => ({ ...f, servicio: e.target.value }))}
                style={{ ...inputStyle, color: form.servicio ? INK : MUTED }}
              >
                <option value="">Seleccioná un servicio</option>
                {services.map(s => (
                  <option key={s.name} value={s.name}>{s.name} — {s.price}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>
                Mensaje{" "}
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: MUTED }}>
                  (opcional)
                </span>
              </label>
              <textarea
                placeholder="Preferencias, fecha tentativa, notas..."
                value={form.mensaje}
                onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <button
              style={{ width: "100%", backgroundColor: TERRA, color: "#fff", fontWeight: 600, fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "16px", borderRadius: "100px", border: "none", cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Enviar solicitud
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: INK, padding: "clamp(40px, 6vh, 64px) clamp(24px, 6vw, 80px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "32px" }}>
          <div>
            <p style={{ fontFamily: COR, fontStyle: "italic", fontSize: "1.6rem", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 6px" }}>
              El Filo
            </p>
            <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: 0 }}>
              Barbería de precisión · Pocitos · Desde 2009
            </p>
          </div>
          <nav style={{ display: "flex", gap: "24px 32px", flexWrap: "wrap" }}>
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >
                {label}
              </a>
            ))}
          </nav>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", margin: "0 0 4px" }}>
              &copy; {new Date().getFullYear()} El Filo Barbería
            </p>
            <Link
              href="/"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.15)")}
            >
              Sitio web por newww.
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
