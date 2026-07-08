"use client";

/* PROTOTIP direcție colecții — editorial / moody studio / produs care plutește.
   Separat de magazin (localhost:3000/lab). Placeholder-ul de produs se va
   înlocui cu mockup-urile reale (haina pe fundal transparent / studio). */

const O = "#FF4A1C";

function TeeSilhouette({ style }) {
  return (
    <svg viewBox="0 0 220 240" style={style} aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f2ee" />
          <stop offset="1" stopColor="#c7c3bb" />
        </linearGradient>
      </defs>
      <path
        d="M66,34 L88,22 Q110,38 132,22 L154,34 L196,64 L172,96 L152,80 L152,214 Q110,226 68,214 L68,80 L48,96 L24,64 Z"
        fill="url(#g)" stroke="rgba(0,0,0,0.12)" strokeWidth="1"
      />
      <path d="M88,22 Q110,38 132,22" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
    </svg>
  );
}

const PRODUCTS = [
  { n: "Model 01", p: "189 lei" },
  { n: "Model 02", p: "189 lei" },
  { n: "Hoodie 01", p: "329 lei" },
  { n: "Model 03", p: "189 lei" },
];

export default function Lab() {
  return (
    <div style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      background: "radial-gradient(120% 90% at 50% 22%, #33373d 0%, #212429 42%, #121316 78%, #0b0c0e 100%)",
      color: "#f3f1ec", fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes bob { 0%,100%{ transform: translateY(-10px);} 50%{ transform: translateY(10px);} }
        @keyframes shadowPulse { 0%,100%{ transform: scaleX(1); opacity:.5;} 50%{ transform: scaleX(.86); opacity:.32;} }
        @keyframes fog { from{ transform: translateX(-10%);} to{ transform: translateX(10%);} }
        @keyframes sheen { 0%{ transform: translateX(-60%) rotate(8deg); opacity:0;} 30%{opacity:.5;} 100%{ transform: translateX(60%) rotate(8deg); opacity:0;} }
        @keyframes fadeUp { from{ opacity:0; transform: translateY(20px);} to{ opacity:1; transform:none;} }
        @keyframes tonalDrift { from{ transform: translateX(0);} to{ transform: translateX(-50%);} }
        .fu { animation: fadeUp .8s cubic-bezier(.2,.7,.2,1) both; }
        .card { transition: transform .3s ease; }
        .card:hover { transform: translateY(-8px); }
        .card:hover .cardsh { transform: scaleX(.85); opacity:.3; }
        @media (prefers-reduced-motion: reduce){ *{ animation:none !important; } }
      `}</style>

      {/* ceață subtilă jos */}
      <div style={{ position: "absolute", left: "-10%", right: "-10%", bottom: 0, height: "40%",
        background: "radial-gradient(60% 100% at 50% 100%, rgba(220,225,230,0.10), transparent 70%)",
        animation: "fog 14s ease-in-out infinite alternate", pointerEvents: "none" }} />

      {/* HUD sus */}
      <header style={{ position: "relative", zIndex: 3, display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "22px 6vw", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase" }}>
        <img src="/brand/logo-white.png" alt="OVRTHINK" style={{ height: 20 }} />
        <span style={{ color: "#8b8f95" }}>Limited Release</span>
        <span style={{ color: "#8b8f95" }}>Sezon 2026 · 04</span>
      </header>

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "20px 6vw 40px" }}>
        {/* nume tonal repetat, estompat, în spate */}
        <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", opacity: 0.05, pointerEvents: "none" }}>
          <div style={{ whiteSpace: "nowrap", animation: "tonalDrift 40s linear infinite", fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: "17vw", letterSpacing: "0.02em", textTransform: "uppercase" }}>
            TOAMNĂ–IARNĂ&nbsp;&nbsp;TOAMNĂ–IARNĂ&nbsp;&nbsp;
          </div>
        </div>

        <div className="fu" style={{ position: "relative" }}>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 6, textTransform: "uppercase", color: O }}>
            Colecția
          </div>
          <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: "clamp(38px, 8vw, 104px)",
            letterSpacing: "0.06em", textTransform: "uppercase", margin: "6px 0 0", lineHeight: 1 }}>
            Toamnă–Iarnă
          </h1>
          <p style={{ color: "#a7abb1", fontSize: 15, marginTop: 14, fontStyle: "italic", fontFamily: "Georgia, serif" }}>
            Cald pe vreme rece. Un capitol nou.
          </p>
        </div>

        {/* produs care plutește */}
        <div style={{ position: "relative", height: "min(52vh, 440px)", marginTop: 10 }}>
          <div style={{ position: "absolute", left: "50%", top: "48%", transform: "translate(-50%,-50%)" }}>
            <div style={{ animation: "bob 5s ease-in-out infinite" }}>
              <TeeSilhouette style={{ width: "min(46vw, 300px)", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }} />
            </div>
            {/* umbra pe podea */}
            <div className="cardsh" style={{ width: "min(40vw, 250px)", height: 26, margin: "10px auto 0",
              borderRadius: "50%", background: "radial-gradient(50% 100% at 50% 50%, rgba(0,0,0,0.6), transparent 70%)",
              animation: "shadowPulse 5s ease-in-out infinite" }} />
          </div>
          {/* rază de lumină */}
          <div aria-hidden style={{ position: "absolute", left: "35%", top: 0, width: "30%", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            animation: "sheen 9s ease-in-out infinite", pointerEvents: "none" }} />
        </div>

        <button style={{ marginTop: 6, fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 3,
          textTransform: "uppercase", padding: "15px 34px", cursor: "pointer", color: "#0b0c0e",
          background: "#f3f1ec", border: "none" }}>
          Vezi colecția →
        </button>
      </section>

      {/* grilă produse — plutesc discret pe studio */}
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1160, margin: "0 auto", padding: "30px 6vw 90px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="grid">
          {PRODUCTS.map((pr, i) => (
            <div key={i} className="card fu" style={{ animationDelay: `${0.1 * i}s`, textAlign: "center", cursor: "pointer" }}>
              <div style={{ position: "relative", padding: "22px 10px 8px" }}>
                <TeeSilhouette style={{ width: "72%", filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.5))" }} />
                <div className="cardsh" style={{ width: "56%", height: 14, margin: "6px auto 0", borderRadius: "50%",
                  background: "radial-gradient(50% 100% at 50% 50%, rgba(0,0,0,0.55), transparent 70%)", opacity: 0.5, transition: "all .3s ease" }} />
              </div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 1, marginTop: 10 }}>{pr.n}</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: O, marginTop: 3 }}>{pr.p}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", paddingBottom: 40, fontSize: 11,
        letterSpacing: 3, textTransform: "uppercase", color: "#6b6f75" }}>
        Prototip direcție · silueta e placeholder pentru mockup-urile reale
      </div>

      <style>{`@media (max-width: 820px){ .grid{ grid-template-columns: repeat(2,1fr) !important; } }`}</style>
    </div>
  );
}
