"use client";

/* ─────────────────────────────────────────────
   OVRTHINK — motorul vizual al colecțiilor
   Fiecare colecție: background STATIC fixat + decor ANIMAT
   care se mișcă deasupra lui. Portocaliu predominant.
   ───────────────────────────────────────────── */

const ORANGE = "#FF4A1C";

/* poziții deterministe (aceleași pe server și client → fără hydration mismatch) */
function rnd(i, salt = 1) {
  const x = Math.sin((i + 1) * 12.9898 * salt) * 43758.5453;
  return x - Math.floor(x);
}

export const THEME = {
  summer: {
    name: "summer",
    bg: "radial-gradient(125% 95% at 50% -12%, #FFEDCB 0%, #FFC178 26%, #FF8A3D 56%, #FF4A1C 100%)",
    title: "#FFF4E2",
    sub: "#FFE3C4",
    accent: "#FFFFFF",
  },
  winter: {
    name: "winter",
    bg: "linear-gradient(180deg, #17100b 0%, #3a2113 40%, #9c3d16 80%, #FF6A2B 100%)",
    title: "#FFE8D2",
    sub: "#F0C39C",
    accent: ORANGE,
  },
  sport: {
    name: "sport",
    bg: "linear-gradient(125deg, #0d0d0d 0%, #1e0d05 36%, #C63410 70%, #FF4A1C 100%)",
    title: "#FFFFFF",
    sub: "#FFD2C2",
    accent: ORANGE,
  },
};

export const COLLECTION_KEYFRAMES = `
  @keyframes ovrFloatUp { 0%{transform:translateY(10vh) scale(.8);opacity:0} 12%{opacity:.85} 100%{transform:translateY(-115vh) scale(1.35);opacity:0} }
  @keyframes ovrFall { 0%{transform:translateY(-12vh) translateX(0) rotate(0deg);opacity:0} 10%{opacity:1} 100%{transform:translateY(112vh) translateX(6vw) rotate(300deg);opacity:.85} }
  @keyframes ovrStreak { 0%{transform:translate(-40vw,8vh) skewX(-18deg);opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{transform:translate(135vw,-16vh) skewX(-18deg);opacity:0} }
  @keyframes ovrSpin { to { transform: rotate(360deg); } }
  @keyframes ovrPulse { 0%,100%{opacity:.35;transform:scale(1)} 50%{opacity:.85;transform:scale(1.08)} }
  @keyframes ovrColRise { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:none} }
  @media (prefers-reduced-motion: reduce) {
    .ovr-decor * { animation: none !important; }
  }
`;

/* ── decor: vară ── soare rotativ + particule de căldură care urcă ── */
function SummerDecor() {
  const dots = Array.from({ length: 16 });
  return (
    <div className="ovr-decor" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* raze de soare rotative */}
      <div style={{
        position: "absolute", top: "-40vh", left: "50%", width: "160vh", height: "160vh",
        marginLeft: "-80vh", borderRadius: "50%",
        background: "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.13) 0deg 5deg, transparent 5deg 17deg)",
        animation: "ovrSpin 70s linear infinite", opacity: 0.7,
      }} />
      {/* glow soare */}
      <div style={{
        position: "absolute", top: "-24vh", left: "50%", width: "70vh", height: "70vh", marginLeft: "-35vh",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(255,248,225,0.9), rgba(255,248,225,0) 62%)",
      }} />
      {dots.map((_, i) => {
        const size = 8 + rnd(i, 3) * 26;
        return (
          <span key={i} style={{
            position: "absolute", bottom: "-6vh", left: `${rnd(i, 1) * 100}%`,
            width: size, height: size, borderRadius: "50%",
            background: i % 3 === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,230,190,0.55)",
            filter: "blur(1px)",
            animation: `ovrFloatUp ${11 + rnd(i, 2) * 12}s linear ${rnd(i, 5) * 10}s infinite`,
          }} />
        );
      })}
    </div>
  );
}

/* ── decor: iarnă/toamnă ── fulgi + frunze chihlimbar care cad ── */
function WinterDecor() {
  const flakes = Array.from({ length: 34 });
  return (
    <div className="ovr-decor" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {flakes.map((_, i) => {
        const leaf = i % 3 === 0;
        const size = leaf ? 9 + rnd(i, 3) * 10 : 3 + rnd(i, 3) * 5;
        return (
          <span key={i} style={{
            position: "absolute", top: "-12vh", left: `${rnd(i, 1) * 100}%`,
            width: size, height: leaf ? size * 0.7 : size,
            borderRadius: leaf ? "60% 0 60% 0" : "50%",
            background: leaf
              ? (i % 2 ? "rgba(255,138,61,0.8)" : "rgba(214,86,32,0.85)")
              : "rgba(255,244,232,0.85)",
            animation: `ovrFall ${9 + rnd(i, 2) * 9}s linear ${rnd(i, 5) * 9}s infinite`,
          }} />
        );
      })}
    </div>
  );
}

/* ── decor: sport ── dungi de viteză diagonale + puls energic ── */
function SportDecor() {
  const streaks = Array.from({ length: 12 });
  return (
    <div className="ovr-decor" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "20%", left: "60%", width: "80vh", height: "80vh", marginLeft: "-40vh",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(255,74,28,0.35), rgba(255,74,28,0) 60%)",
        animation: "ovrPulse 3.2s ease-in-out infinite",
      }} />
      {streaks.map((_, i) => {
        const h = 2 + rnd(i, 3) * 5;
        const w = 14 + rnd(i, 4) * 30;
        return (
          <span key={i} style={{
            position: "absolute", top: `${rnd(i, 1) * 100}%`, left: 0,
            width: `${w}vw`, height: h, borderRadius: h,
            background: i % 2 ? "rgba(255,255,255,0.55)" : "rgba(255,74,28,0.8)",
            boxShadow: "0 0 12px rgba(255,74,28,0.5)",
            animation: `ovrStreak ${2.2 + rnd(i, 2) * 3}s linear ${rnd(i, 5) * 4}s infinite`,
          }} />
        );
      })}
    </div>
  );
}

/* fundalul static fixat + decorul animat (în spatele conținutului) */
export function CollectionBg({ theme }) {
  const t = THEME[theme];
  if (!t) return null;
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none" }}>
      <style>{COLLECTION_KEYFRAMES}</style>
      <div style={{ position: "absolute", inset: 0, background: t.bg }} />
      {theme === "summer" && <SummerDecor />}
      {theme === "winter" && <WinterDecor />}
      {theme === "sport" && <SportDecor />}
    </div>
  );
}

/* ── HUB: 3 portaluri de colecție ── */
function Portal({ col, lang, onOpen }) {
  const t = THEME[col.id];
  return (
    <button onClick={() => onOpen(col.id)} className="ovr-portal" style={{
      position: "relative", overflow: "hidden", cursor: "pointer", border: "none", padding: 0,
      minHeight: "min(62vh, 520px)", background: t.bg, borderRadius: 0, textAlign: "left",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.9 }}>
        <style>{COLLECTION_KEYFRAMES}</style>
        {col.id === "summer" && <SummerDecor />}
        {col.id === "winter" && <WinterDecor />}
        {col.id === "sport" && <SportDecor />}
      </div>
      <div style={{ position: "relative", padding: "26px 24px 28px" }}>
        <div style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(24px, 3vw, 34px)",
          letterSpacing: "0.04em", textTransform: "uppercase", color: t.title, lineHeight: 1.05,
        }}>
          {col.name[lang]}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: t.sub, marginTop: 8 }}>
          {col.tagline[lang]}
        </div>
        <span className="ovr-portal-cta" style={{
          display: "inline-block", marginTop: 18, fontFamily: "'Jost', sans-serif", fontSize: 11,
          letterSpacing: 3, textTransform: "uppercase", color: "#141414", background: "#FAFAF8",
          padding: "11px 20px",
        }}>
          {lang === "ro" ? "Deschide colecția →" : "Open collection →"}
        </span>
      </div>
    </button>
  );
}

export function CollectionsHub({ collections, lang, onOpen }) {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "30px 5vw 80px" }}>
      <style>{`
        .ovr-hub { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ovr-portal { transition: transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease; }
        .ovr-portal:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(20,20,20,0.22); }
        .ovr-portal-cta { transition: background .2s ease, color .2s ease; }
        .ovr-portal:hover .ovr-portal-cta { background: ${ORANGE}; color: #FAFAF8; }
        @media (max-width: 820px) { .ovr-hub { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{
        fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: "clamp(26px, 4vw, 40px)",
        letterSpacing: "0.14em", textTransform: "uppercase", margin: "6px 0 22px", textAlign: "center",
      }}>
        {lang === "ro" ? "Colecții" : "Collections"}
      </div>
      <div className="ovr-hub">
        {collections.map((c, i) => (
          <div key={c.id} className="ovr-rise" style={{ animationDelay: `${i * 0.09}s` }}>
            <Portal col={c} lang={lang} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </main>
  );
}
