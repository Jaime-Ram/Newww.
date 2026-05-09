"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Tokens ─────────────────────────────────────────────── */
const ink    = "#0A0602";
const paper  = "#F8F2E8";
const cream  = "#EDE4D2";
const red    = "#CC2200";
const amber  = "#D4860A";
const D      = `var(--font-playfair, Georgia, "Times New Roman", serif)`;

/* ─── Menu data ──────────────────────────────────────────── */
const cols = [
  {
    heading: "Pizze Rosse",
    items: [
      { n: "Margherita",           d: "San Marzano, fior di latte, albahaca",              p: "$420" },
      { n: "Napolitana",           d: "Tomate, mozzarella, anchoas, aceitunas, alcaparras", p: "$480" },
      { n: "Diavola",              d: "San Marzano, mozzarella, salame piccante",           p: "$510" },
      { n: "Prosciutto e Funghi",  d: "Tomate, mozzarella, jamón, hongos al horno",         p: "$530" },
      { n: "Fuego Speciale ★",     d: "Búfala, rúcula, crudo, parmesano, trufa",            p: "$590" },
    ],
  },
  {
    heading: "Pizze Bianche",
    items: [
      { n: "Quattro Formaggi",     d: "Mozzarella, gorgonzola, parmesano, provolone",       p: "$520" },
      { n: "Patata e Rosmarino",   d: "Fior di latte, papa, romero, aceite de oliva",       p: "$450" },
      { n: "Bianca e Funghi",      d: "Mozzarella, hongos salteados, tomillo, ajo",         p: "$470" },
      { n: "Tiramisú della nonna", d: "Mascarpone, savoiardi, café — postre",               p: "$220" },
    ],
  },
];

/* ─── Ember positions ────────────────────────────────────── */
const embers = [
  { left:"12%",  bottom:"8%",  size:3, dur:"3.1s", delay:"0s",    ex:"12px",  ex2:"18px"  },
  { left:"23%",  bottom:"12%", size:2, dur:"4s",   delay:"0.6s",  ex:"-8px",  ex2:"-14px" },
  { left:"38%",  bottom:"5%",  size:4, dur:"2.8s", delay:"1.2s",  ex:"20px",  ex2:"30px"  },
  { left:"51%",  bottom:"10%", size:2, dur:"3.6s", delay:"0.3s",  ex:"-15px", ex2:"-22px" },
  { left:"64%",  bottom:"7%",  size:3, dur:"3.3s", delay:"1.8s",  ex:"10px",  ex2:"16px"  },
  { left:"76%",  bottom:"14%", size:2, dur:"4.2s", delay:"0.9s",  ex:"-18px", ex2:"-28px" },
  { left:"88%",  bottom:"6%",  size:3, dur:"2.9s", delay:"2.1s",  ex:"14px",  ex2:"22px"  },
  { left:"7%",   bottom:"20%", size:2, dur:"3.8s", delay:"1.5s",  ex:"-10px", ex2:"-16px" },
  { left:"44%",  bottom:"18%", size:2, dur:"3.4s", delay:"0.7s",  ex:"22px",  ex2:"34px"  },
  { left:"92%",  bottom:"22%", size:3, dur:"3.0s", delay:"2.4s",  ex:"-12px", ex2:"-20px" },
];

/* ─── COMPONENT ──────────────────────────────────────────── */
export default function FuegoPizza() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ backgroundColor: paper, color: ink, fontFamily: "var(--font-geist-sans, sans-serif)", overflowX: "hidden" }}>

      {/* ══════════════════════════════════════════
          NAV — ultra-minimal, transparent over hero
      ══════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-500"
        style={scrolled ? { backgroundColor: ink, borderBottom: "1px solid rgba(255,255,255,0.07)" } : { backgroundColor: "transparent" }}
      >
        {/* Logo */}
        <a href="#" className="flex flex-col leading-none" style={{ fontFamily: D }}>
          <span className="font-black text-xl tracking-tighter" style={{ color: "#fff" }}>Fuego</span>
          <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: scrolled ? amber : "rgba(255,255,255,0.45)" }}>
            Pizza Co.
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10 text-xs tracking-widest uppercase font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
          {[["Menú","#menu"],["Nosotros","#nosotros"],["Galería","#galeria"],["Ubicación","#ubicacion"]].map(([l,h]) => (
            <a key={h} href={h} className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>

        {/* Reservar pill */}
        <a
          href="#ordenar"
          className="hidden md:block text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full transition-colors"
          style={{ backgroundColor: red, color: "#fff" }}
        >
          Reservar
        </a>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-[5px]">
          {[menuOpen?"rotate-45 translate-y-[7px]":"", menuOpen?"opacity-0":"", menuOpen?"-rotate-45 -translate-y-[7px]":""].map((c,i)=>(
            <span key={i} className={`block w-6 h-0.5 bg-white transition-all duration-300 ${c}`} />
          ))}
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 px-6 py-10 flex flex-col gap-6" style={{ backgroundColor: ink }}>
            {[["Menú","#menu"],["Nosotros","#nosotros"],["Galería","#galeria"],["Ubicación","#ubicacion"]].map(([l,h])=>(
              <a key={h} href={h} onClick={()=>setMenuOpen(false)} className="font-black italic text-3xl text-white" style={{ fontFamily: D }}>{l}</a>
            ))}
            <a href="#ordenar" className="mt-2 py-3 rounded-full text-center font-bold text-white text-sm" style={{ backgroundColor: red }}>
              Reservar mesa
            </a>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════
          HERO — full-screen, ember particles
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 30% 80%, #3D1200 0%, #1A0800 45%, ${ink} 100%)` }}
      >
        {/* Embers */}
        {embers.map((e, i) => (
          <span
            key={i}
            className="fuego-ember absolute rounded-full pointer-events-none"
            style={{
              left: e.left, bottom: e.bottom,
              width: e.size, height: e.size,
              backgroundColor: i % 3 === 0 ? amber : i % 3 === 1 ? "#E85A20" : "#FFA040",
              "--dur": e.dur, "--delay": e.delay, "--ex": e.ex, "--ex2": e.ex2,
            } as React.CSSProperties}
          />
        ))}

        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

        {/* Giant brand name */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
          <span
            className="font-black italic opacity-[0.04] leading-none tracking-tighter text-white"
            style={{ fontFamily: D, fontSize: "clamp(12rem, 35vw, 40rem)" }}
          >
            F
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-14 pb-16 md:pb-24 max-w-[1400px] mx-auto w-full">
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-6" style={{ color: amber }}>
            Montevideo · 1987
          </p>
          <h1
            className="font-black italic leading-[0.85] tracking-tight mb-8"
            style={{ fontFamily: D, fontSize: "clamp(4rem, 14vw, 15rem)", color: "#fff" }}
          >
            Fuego<br />
            <span style={{ color: red }}>Pizza</span><br />
            Co.
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <a href="#menu" className="text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-full text-white transition-opacity hover:opacity-80" style={{ backgroundColor: red }}>
              Ver el menú
            </a>
            <a href="#nosotros" className="text-sm font-medium text-white/50 hover:text-white transition-colors tracking-wide">
              Nuestra historia ↓
            </a>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="relative z-10 border-t border-white/10 px-6 md:px-14 py-4 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between">
          <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
            Pizza napoletana artesanal
          </span>
          <div className="flex items-center gap-6 text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
            <span>Masa madre 72h</span>
            <span style={{ color: red }}>·</span>
            <span>Horno a leña 450°C</span>
            <span style={{ color: red }}>·</span>
            <span>San Marzano DOP</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MANIFIESTO — one big statement
      ══════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8 md:px-20 text-center" style={{ backgroundColor: paper }}>
        <p className="text-xs font-bold tracking-[0.35em] uppercase mb-10" style={{ color: red }}>
          Lo que somos
        </p>
        <blockquote
          className="font-black italic leading-[0.9] tracking-tight max-w-5xl"
          style={{ fontFamily: D, fontSize: "clamp(2.8rem, 7vw, 7.5rem)", color: ink }}
        >
          Hacemos una sola cosa. La hacemos todos los días. La hacemos bien.
        </blockquote>
        <p className="mt-12 text-base leading-relaxed max-w-xl" style={{ color: "rgba(10,6,2,0.5)" }}>
          Abrimos en 1987. La masa es la misma. El horno es el mismo. Lo que cambió es que ya conocemos a sus nietos.
        </p>
      </section>

      {/* ══════════════════════════════════════════
          TRES PILARES — full-height panels
      ══════════════════════════════════════════ */}
      {/* Panel 1 — La masa */}
      <section className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: cream }}>
        <div className="flex-1 flex flex-col justify-end p-10 md:p-16 lg:p-24 relative overflow-hidden">
          <span
            className="absolute top-8 right-8 font-black leading-none select-none pointer-events-none"
            style={{ fontFamily: D, fontSize: "clamp(8rem,20vw,18rem)", color: "rgba(10,6,2,0.05)" }}
          >01</span>
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-6" style={{ color: "rgba(10,6,2,0.4)" }}>
            El primer secreto
          </p>
          <h2 className="font-black italic leading-[0.88] mb-8" style={{ fontFamily: D, fontSize: "clamp(3.5rem,9vw,9rem)", color: ink }}>
            La masa.
          </h2>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: "rgba(10,6,2,0.5)" }}>
            72 horas de fermentación lenta. Harina tipo 00 de molino napolitano. La misma cepa de masa madre que empezó el abuelo Carmelo. No usamos levadura industrial. Nunca.
          </p>
          <div className="mt-10 flex gap-8">
            <div>
              <p className="font-black text-3xl" style={{ fontFamily: D, color: ink }}>72 h</p>
              <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(10,6,2,0.4)" }}>Fermentación</p>
            </div>
            <div>
              <p className="font-black text-3xl" style={{ fontFamily: D, color: ink }}>00</p>
              <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(10,6,2,0.4)" }}>Tipo de harina</p>
            </div>
            <div>
              <p className="font-black text-3xl" style={{ fontFamily: D, color: ink }}>1987</p>
              <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(10,6,2,0.4)" }}>La cepa original</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-5/12 min-h-[40vh] md:min-h-0" style={{ background: "linear-gradient(160deg, #D4B896 0%, #BFA07A 50%, #8C6A42 100%)" }} />
      </section>

      {/* Panel 2 — El tomate */}
      <section className="min-h-screen flex flex-col md:flex-row-reverse" style={{ backgroundColor: red }}>
        <div className="flex-1 flex flex-col justify-end p-10 md:p-16 lg:p-24 relative overflow-hidden">
          <span
            className="absolute top-8 right-8 font-black leading-none select-none pointer-events-none"
            style={{ fontFamily: D, fontSize: "clamp(8rem,20vw,18rem)", color: "rgba(255,255,255,0.06)" }}
          >02</span>
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            El segundo secreto
          </p>
          <h2 className="font-black italic leading-[0.88] mb-8 text-white" style={{ fontFamily: D, fontSize: "clamp(3.5rem,9vw,9rem)" }}>
            El tomate.
          </h2>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            San Marzano DOP. Cultivado en las laderas del Vesubio. Más dulce, menos ácido. Llega dos veces por año en lata desde Campania. No hay sustituto posible.
          </p>
          <div className="mt-10 flex gap-8">
            {[["DOP","Denominación de origen"],["Vesubio","Campania, Italia"],["2x año","Importación directa"]].map(([v,l])=>(
              <div key={v}>
                <p className="font-black text-2xl text-white" style={{ fontFamily: D }}>{v}</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-5/12 min-h-[40vh] md:min-h-0" style={{ background: "linear-gradient(160deg, #FF6B3D 0%, #CC2200 50%, #8B1500 100%)" }} />
      </section>

      {/* Panel 3 — El horno */}
      <section className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: ink }}>
        <div className="flex-1 flex flex-col justify-end p-10 md:p-16 lg:p-24 relative overflow-hidden">
          <span
            className="absolute top-8 right-8 font-black leading-none select-none pointer-events-none"
            style={{ fontFamily: D, fontSize: "clamp(8rem,20vw,18rem)", color: "rgba(255,255,255,0.03)" }}
          >03</span>
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-6" style={{ color: amber }}>
            El tercer secreto
          </p>
          <h2 className="font-black italic leading-[0.88] mb-8 text-white" style={{ fontFamily: D, fontSize: "clamp(3.5rem,9vw,9rem)" }}>
            El horno.
          </h2>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Construido en 1987 con barro traído de Nápoles. Se calienta tres horas antes del servicio. Llega a 450°C. La pizza cocina en exactamente 90 segundos.
          </p>
          <div className="mt-10 flex gap-8">
            {[["450°C","Temperatura"],["90 seg","Cocción"],["Barro","Material original"]].map(([v,l])=>(
              <div key={v}>
                <p className="font-black text-2xl text-white" style={{ fontFamily: D }}>{v}</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-5/12 min-h-[40vh] md:min-h-0" style={{ background: `radial-gradient(circle at 40% 70%, ${amber} 0%, #8B4500 30%, #3D1A00 65%, ${ink} 100%)` }} />
      </section>

      {/* ══════════════════════════════════════════
          MENU — printed-menu typography
      ══════════════════════════════════════════ */}
      <section id="menu" className="py-24 md:py-40 px-6 md:px-14 lg:px-24" style={{ backgroundColor: paper }}>
        <div className="max-w-[1200px] mx-auto">

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.35em] uppercase mb-3" style={{ color: red }}>Il menú</p>
              <h2 className="font-black italic leading-none" style={{ fontFamily: D, fontSize: "clamp(3rem,8vw,7rem)", color: ink }}>
                Nuestras pizzas.
              </h2>
            </div>
            <p className="text-sm" style={{ color: "rgba(10,6,2,0.4)" }}>Precios en pesos uruguayos · IVA incluido</p>
          </div>

          {/* Two-column menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            {cols.map((col) => (
              <div key={col.heading}>
                <h3 className="font-bold italic mb-8 pb-4" style={{ fontFamily: D, fontSize: "1.6rem", color: ink, borderBottom: `2px solid ${ink}` }}>
                  {col.heading}
                </h3>
                <div className="space-y-6">
                  {col.items.map((item) => (
                    <div key={item.n}>
                      <div className="flex items-baseline">
                        <span className="font-bold text-base" style={{ color: ink }}>{item.n}</span>
                        <span className="menu-leader" />
                        <span className="font-black text-base shrink-0" style={{ color: ink }}>{item.p}</span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(10,6,2,0.45)" }}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-16 text-center text-xs" style={{ color: "rgba(10,6,2,0.35)" }}>
            Disponible sin TACC bajo pedido · Consultá por alergias · Los ingredientes pueden variar por estacionalidad
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NOSOTROS — editorial split
      ══════════════════════════════════════════ */}
      <section id="nosotros" className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: ink }}>
        {/* Text half */}
        <div className="flex-1 flex flex-col justify-center p-10 md:p-16 lg:p-24">
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-8" style={{ color: amber }}>
            Nuestra historia
          </p>
          <h2 className="font-black italic leading-[0.9] mb-10 text-white" style={{ fontFamily: D, fontSize: "clamp(2.8rem,6vw,5.5rem)" }}>
            Carmelo llegó de Nápoles en 1987 con una receta.
          </h2>
          <div className="space-y-5 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            <p>
              Una valija, una receta y las ganas de cocinar para su nueva ciudad. Abrió la primera Fuego en Pocitos con un solo horno a leña que tardó tres días en calentarse bien.
            </p>
            <p>
              Casi cuatro décadas después seguimos usando la misma masa madre que él preparó ese primer martes de octubre. Algunos clientes que eran chicos en los &apos;90 hoy traen a sus propios hijos.
            </p>
            <p>
              No tenemos franquicias. No congelamos nada. Solo pizzas honestas hechas con ingredientes que podemos nombrar.
            </p>
          </div>
          <div className="mt-12 flex gap-10">
            {[["1987","Apertura"],["3 gen.","Familia"],["1","Local"]].map(([v,l])=>(
              <div key={v}>
                <p className="font-black text-4xl text-white" style={{ fontFamily: D }}>{v}</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Photo half */}
        <div
          className="w-full lg:w-2/5 min-h-[50vh] relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #3D1800 0%, #1A0800 40%, #2A1000 100%)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[16rem] select-none pointer-events-none" style={{ opacity: 0.04 }}>🔥</span>
          </div>
          {/* Carmelo label */}
          <div className="absolute bottom-8 left-8">
            <p className="text-white font-black text-2xl italic" style={{ fontFamily: D }}>Carmelo Fuego</p>
            <p className="text-xs tracking-widest uppercase mt-1" style={{ color: amber }}>Fundador · Nápoles, 1952</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GALERIA — overlapping collage
      ══════════════════════════════════════════ */}
      <section id="galeria" className="py-24 md:py-32 px-6 md:px-14 overflow-hidden" style={{ backgroundColor: cream }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-black italic leading-none" style={{ fontFamily: D, fontSize: "clamp(2.5rem,7vw,6rem)", color: ink }}>
              Galería.
            </h2>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="text-xs font-bold tracking-widest uppercase" style={{ color: red }}>
              @fuegopizzamvd ↗
            </a>
          </div>

          {/* Mosaic layout */}
          <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[70vh]">
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden" style={{ background: `radial-gradient(circle at 45% 50%, #FF6B3D 0%, #CC2200 30%, #8B1500 60%, #3D0800 100%)` }}>
              <div className="w-full h-full flex items-end p-6" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }}>
                <p className="text-white text-sm font-medium">La Fuego Speciale</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg, #D4B896 0%, #8C6A42 100%)" }} />
            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(160deg, ${ink} 0%, #3D1200 50%, #5C2000 100%)` }} />
          </div>

          <div className="grid grid-cols-4 gap-3 mt-3">
            {[
              { bg:"linear-gradient(135deg,#2D5A1F,#1A3A10)", h:"h-40" },
              { bg:`radial-gradient(circle at 50%,${amber},#8B4500,#3D1A00)`, h:"h-40" },
              { bg:"linear-gradient(135deg,#F5EDD8,#D4B896,#8C6A42)", h:"h-40" },
              { bg:`linear-gradient(135deg,${red},#8B1500)`, h:"h-40" },
            ].map((item, i) => (
              <div key={i} className={`${item.h} rounded-2xl overflow-hidden`} style={{ background: item.bg }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          UBICACION — address, big and clear
      ══════════════════════════════════════════ */}
      <section id="ubicacion" className="py-24 md:py-40 px-6 md:px-14" style={{ backgroundColor: paper }}>
        <div className="max-w-[1400px] mx-auto">
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-8" style={{ color: red }}>Dónde encontrarnos</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
            <div>
              <address className="not-italic">
                <p className="font-black italic leading-none mb-4" style={{ fontFamily: D, fontSize: "clamp(3rem,7vw,6rem)", color: ink }}>
                  Av. Brasil<br />2940.
                </p>
                <p className="text-lg font-medium" style={{ color: "rgba(10,6,2,0.5)" }}>Pocitos, Montevideo, Uruguay</p>
              </address>
              <div className="mt-12 space-y-2">
                <p className="text-sm" style={{ color: "rgba(10,6,2,0.5)" }}>Lun – Vie: <strong className="text-inherit font-semibold" style={{ color: ink }}>12:00 – 15:00 · 18:00 – 23:30</strong></p>
                <p className="text-sm" style={{ color: "rgba(10,6,2,0.5)" }}>Sáb – Dom: <strong style={{ color: ink }}>12:00 – 00:00</strong></p>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="tel:+59829001234" className="font-bold text-sm px-6 py-3 rounded-full text-white" style={{ backgroundColor: red }}>
                  +598 2900 1234
                </a>
                <a href="https://wa.me/59829001234" className="font-semibold text-sm px-6 py-3 rounded-full border" style={{ borderColor: "rgba(10,6,2,0.2)", color: ink }}>
                  WhatsApp ↗
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden h-72 lg:h-96 relative" style={{ backgroundColor: cream }}>
              <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(10,6,2,0.06) 39px, rgba(10,6,2,0.06) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(10,6,2,0.06) 39px, rgba(10,6,2,0.06) 40px)" }} />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                <div className="w-5 h-5 rounded-full border-4" style={{ borderColor: red, backgroundColor: "#fff" }} />
                <div className="text-center">
                  <p className="font-bold text-sm" style={{ color: ink }}>Fuego Pizza Co.</p>
                  <p className="text-xs" style={{ color: "rgba(10,6,2,0.45)" }}>Av. Brasil 2940 · Pocitos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ORDENAR / CTA — full-screen red
      ══════════════════════════════════════════ */}
      <section id="ordenar" className="min-h-screen flex flex-col justify-center items-center px-8 text-center relative overflow-hidden" style={{ backgroundColor: red }}>
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 60%, rgba(255,120,60,0.3), transparent 60%)" }} />
        <div className="relative z-10">
          <p className="text-white/60 text-xs font-bold tracking-[0.35em] uppercase mb-8">¿Hambre?</p>
          <h2
            className="font-black italic leading-[0.85] mb-12 text-white"
            style={{ fontFamily: D, fontSize: "clamp(4rem, 15vw, 16rem)" }}
          >
            Pedí ahora.
          </h2>
          <p className="text-white/65 text-lg max-w-md mx-auto leading-relaxed mb-14">
            Llamanos, escribinos por WhatsApp o vení directo. La pizza sale del horno en 90 segundos, la entrega llega en 40 minutos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+59829001234"
              className="font-black text-lg px-10 py-5 rounded-full transition-opacity hover:opacity-85"
              style={{ backgroundColor: "#fff", color: red }}
            >
              +598 2900 1234
            </a>
            <a
              href="https://wa.me/59829001234"
              className="font-semibold text-base px-10 py-5 rounded-full border-2 border-white/30 text-white hover:border-white transition-colors"
            >
              WhatsApp ↗
            </a>
          </div>

          {/* Reservation inline */}
          <div className="mt-20 p-8 md:p-12 rounded-3xl max-w-2xl mx-auto text-left" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
            <p className="text-white font-bold text-xl mb-6" style={{ fontFamily: D }}>Reservar mesa</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[["Nombre","text","Tu nombre"],["Teléfono","tel","+598..."],["Fecha","date",""],["Hora","time",""]].map(([l,t,ph])=>(
                <div key={String(l)}>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-white/40">{l}</label>
                  <input
                    type={String(t)}
                    placeholder={String(ph)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-white/40">Personas</label>
                <select className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  {[1,2,3,4,5,6,"7+"].map(n=><option key={n} value={n}>{n} persona{n!==1?"s":""}</option>)}
                </select>
              </div>
            </div>
            <button className="mt-6 w-full py-4 rounded-full font-bold text-sm transition-opacity hover:opacity-85" style={{ backgroundColor: "#fff", color: red }}>
              Confirmar reserva
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="px-6 md:px-14 py-14" style={{ backgroundColor: "#080401" }}>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <div>
            <p className="font-black italic text-4xl mb-1 text-white" style={{ fontFamily: D }}>
              Fuego<span style={{ color: red }}>.</span>
            </p>
            <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
              Pizza napoletana · Pocitos, Montevideo · 1987
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-10 gap-y-3">
            {[["Menú","#menu"],["Nosotros","#nosotros"],["Galería","#galeria"],["Ubicación","#ubicacion"],["Reservar","#ordenar"]].map(([l,h])=>(
              <a key={h} href={h} className="text-xs tracking-widest uppercase hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</a>
            ))}
          </nav>
          <div className="text-right">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} Fuego Pizza Co.</p>
            <Link href="/" className="text-xs hover:text-white/40 transition-colors" style={{ color: "rgba(255,255,255,0.15)" }}>
              Sitio web por newww.
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
