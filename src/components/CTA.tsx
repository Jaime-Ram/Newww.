"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import t from "@/lib/translations";

export default function CTA() {
  const { lang } = useLanguage();
  const tr = t[lang].cta;

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    display: "block",
    marginBottom: 6,
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 md:px-12 overflow-hidden" style={{ backgroundColor: "var(--cta-bg)" }}>
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>{tr.eyebrow}</p>
            <h2 className="text-white text-[clamp(2.5rem,6vw,6rem)] font-black tracking-tighter leading-[0.9] mb-6 max-w-full break-words [overflow-wrap:anywhere]">
              {tr.heading}
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>{tr.body}</p>
            <a href={`mailto:${tr.email}`} className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
              {tr.email}
            </a>
          </div>

          {/* Right */}
          {status === "sent" ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              {/* Animated checkmark */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 24 }}>
                <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                <circle
                  cx="40" cy="40" r="38"
                  stroke="#FF3D00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="239"
                  strokeDashoffset="0"
                  style={{ animation: "dash 0.6s ease forwards", transformOrigin: "center", transform: "rotate(-90deg)" }}
                />
                <polyline
                  points="24,40 35,52 56,28"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset="0"
                  style={{ animation: "check 0.4s 0.5s ease forwards" }}
                />
                <style>{`
                  @keyframes dash {
                    from { stroke-dashoffset: 239; }
                    to   { stroke-dashoffset: 0; }
                  }
                  @keyframes check {
                    from { stroke-dashoffset: 50; }
                    to   { stroke-dashoffset: 0; }
                  }
                `}</style>
              </svg>
              <p className="text-white text-2xl font-bold mb-2">
                {lang === "es" ? "¡Mensaje enviado!" : "Message sent!"}
              </p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}>
                {lang === "es"
                  ? "Te respondemos dentro de un día hábil."
                  : "We'll get back to you within one business day."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Name + Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>{lang === "es" ? "Nombre *" : "Name *"}</label>
                  <input
                    type="text"
                    required
                    placeholder={lang === "es" ? "Tu nombre" : "Your name"}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    required
                    placeholder={lang === "es" ? "tu@email.com" : "you@example.com"}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Phone + Address */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>{lang === "es" ? "Teléfono" : "Phone"}</label>
                  <input
                    type="tel"
                    placeholder={lang === "es" ? "+34 600 000 000" : "+31 6 00 000 000"}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{lang === "es" ? "Dirección / Empresa" : "Address / Company"}</label>
                  <input
                    type="text"
                    placeholder={lang === "es" ? "Tu empresa o dirección" : "Your company or address"}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>{lang === "es" ? "Mensaje" : "Message"}</label>
                <textarea
                  rows={5}
                  placeholder={lang === "es" ? "Contanos sobre tu proyecto..." : "Tell us about your project..."}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  backgroundColor: "#fff",
                  color: "#111",
                  border: "none",
                  borderRadius: 999,
                  padding: "16px 32px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                  opacity: status === "sending" ? 0.6 : 1,
                  transition: "opacity 0.2s",
                  alignSelf: "flex-start",
                }}
              >
                {status === "sending"
                  ? (lang === "es" ? "Enviando..." : "Sending...")
                  : (lang === "es" ? "Enviar mensaje" : "Send message")}
              </button>

              {status === "error" && (
                <p style={{ color: "#ff6b6b", fontSize: 13 }}>
                  {lang === "es" ? "Algo salió mal. Intentá de nuevo." : "Something went wrong. Please try again."}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
