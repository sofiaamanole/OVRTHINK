"use client";

/* PROTOTIP direcție — FUTURIST / LIQUID GLASS / MINIMALIST
   Culorile brand: negru · alb · portocaliu. localhost:3000/lab
   Silueta e placeholder pentru imaginile reale (folder imagini-site). */

const O = "#FF4A1C";

function TeeSilhouette({ style }) {
  return (
    <svg viewBox="0 0 220 240" style={style} aria-hidden>
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#cfccc6" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d="M66,34 L88,22 Q110,38 132,22 L154,34 L196,64 L172,96 L152,80 L152,214 Q110,226 68,214 L68,80 L48,96 L24,64 Z"
        fill="url(#tg)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
    </svg>
  );
}

/* colțuri HUD futuriste */
function Corner({ pos }) {
  const m = { tl: { top: 10, left: 10 }, tr: { top: 10, right: 10, transform: "scaleX(-1)" },
    bl: { bottom: 10, left: 10, transform: "scaleY(-1)" }, br: { bottom: 10, right: 10, transform: "scale(-1)" } }[pos];
  return <div style={{ position: "absolute", width: 18, height: 18, borderTop: `1.5px solid ${O}`, borderLeft: `1.5px solid ${O}`, opacity: 0.8, ...m }} />;
}

const PRODUCTS = [
  { n: "Model 01", p: "189 lei" },
  { n: "Model 02", p: "189 lei" },
  { n: "Hoodie 01", p: "329 lei" },
  { n: "Model 03", p: "189 lei" },
];

export default function Lab() {
  const glass = {
    background: "rgba(255,255,255,0.055)",
    backdropFilter: "blur(22px) saturate(1.3)",
    WebkitBackdropFilter: "blur(22px) saturate(1.3)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 24px 60px rgba(0,0,0,0.45)",
  };

  return (
    <div style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      background: "#080809", color: "#f3f1ec", fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes glowA { 0%,100%{ transform: translate(-8%,-4%) scale(1);} 50%{ transform: translate(10%,6%) scale(1.15);} }
        @keyframes glowB { 0%,100%{ transform: translate(6%,4%) scale(1.1);} 50%{ transform: translate(-8%,-6%) scale(1);} }
        @keyframes bob { 0%,100%{ transform: translateY(-9px);} 50%{ transform: translateY(9px);} }
        @keyframes sheen { 0%{ transform: translateX(-120%);} 100%{ transform: translateX(220%);} }
        @keyframes fadeUp { from{ opacity:0; transform: translateY(22px);} to{ opacity:1; transform:none;} }
        @keyframes scan { 0%,100%{ opacity:.15;} 50%{ opacity:.5;} }
        .fu { animation: fadeUp .9s cubic-bezier(.2,.7,.2,1) both; }
        .gcard { transition: transform .35s ease, border-color .35s ease, background .35s ease; }
        .gcard:hover { transform: translateY(-8px); border-color: rgba(255,74,28,0.5); background: rgba(255,255,255,0.08); }
        @media (prefers-reduced-motion: reduce){ *{ animation:none !important; } }
        @media (max-width: 820px){ .grid4{ grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>

      {/* blob-uri portocalii care „curg" în spatele sticlei */}
      <div aria-hidden style={{ position: "absolute", top: "-15%", left: "8%", width: "55vw", height: "55vw",
        background: "radial-gradient(circle, rgba(255,74,28,0.55), transparent 62%)", filter: "blur(40px)",
        animation: "glowA 18s ease-in-out infinite", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-20%", right: "5%", width: "50vw", height: "50vw",
        background: "radial-gradient(circle, rgba(255,138,61,0.35), transparent 62%)", filter: "blur(50px)",
        animation: "glowB 22s ease-in-out infinite", pointerEvents: "none" }} />
      {/* grilă futuristă foarte fină */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "64px 64px" }} />

      {/* NAV — bară de sticlă */}
      <div style={{ position: "sticky", top: 14, zIndex: 10, margin: "14px 4vw 0" }}>
        <header style={{ ...glass, borderRadius: 16, display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "13px 22px" }}>
          <img src="/brand/logo-white.png" alt="OVRTHINK" style={{ height: 19 }} />
          <div style={{ display: "flex", gap: 26, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#c9ccd0" }}>
            <span>Colecții</span><span>Shop</span><span>Despre</span>
          </div>
          <div style={{ ...glass, borderRadius: 10, padding: "7px 14px", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Coș · 0</div>
        </header>
      </div>

      {/* HERO — vitrină de sticlă cu produs care plutește */}
      <section style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "42px 5vw 30px" }}>
        <div className="fu" style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 6, textTransform: "uppercase", color: O }}>Colecția · Toamnă–Iarnă</div>
        <h1 className="fu" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: "clamp(40px, 8.5vw, 110px)",
          letterSpacing: "0.04em", textTransform: "uppercase", margin: "8px 0 0", lineHeight: 0.98 }}>
          The New Era
        </h1>

        {/* vitrina */}
        <div className="fu" style={{ ...glass, position: "relative", maxWidth: 440, margin: "34px auto 0",
          borderRadius: 22, padding: "30px 26px 26px", overflow: "hidden" }}>
          <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
          {/* sheen care traversează sticla */}
          <div aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)", animation: "sheen 7s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#9a9ea3" }}>
            <span>Limited Release</span><span style={{ color: O }}>● 2026</span>
          </div>
          <div style={{ animation: "bob 5.5s ease-in-out infinite", padding: "18px 0 8px" }}>
            <TeeSilhouette style={{ width: "62%", filter: "drop-shadow(0 26px 34px rgba(0,0,0,0.6))" }} />
          </div>
          <div style={{ width: "56%", height: 16, margin: "0 auto", borderRadius: "50%",
            background: "radial-gradient(50% 100% at 50% 50%, rgba(0,0,0,0.55), transparent 70%)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, letterSpacing: 1 }}>Model 01</span>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: O }}>189 lei</span>
          </div>
        </div>

        <button style={{ ...glass, marginTop: 26, fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 3,
          textTransform: "uppercase", padding: "15px 34px", cursor: "pointer", color: "#fff",
          borderRadius: 12, background: "rgba(255,74,28,0.22)", borderColor: "rgba(255,74,28,0.5)" }}>
          Vezi colecția →
        </button>
      </section>

      {/* grilă produse — carduri de sticlă */}
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1160, margin: "0 auto", padding: "34px 4vw 80px" }}>
        <div className="grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {PRODUCTS.map((pr, i) => (
            <div key={i} className="gcard fu" style={{ ...glass, animationDelay: `${0.08 * i}s`, borderRadius: 18, padding: "22px 14px 16px", cursor: "pointer", textAlign: "center" }}>
              <TeeSilhouette style={{ width: "74%", filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.5))" }} />
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 1, marginTop: 12 }}>{pr.n}</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: O, marginTop: 3 }}>{pr.p}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", paddingBottom: 40, fontSize: 11,
        letterSpacing: 3, textTransform: "uppercase", color: "#6b6f75" }}>
        Prototip · liquid glass · siluetele sunt placeholder pentru imaginile tale
      </div>
    </div>
  );
}
