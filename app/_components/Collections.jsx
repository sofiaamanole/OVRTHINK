"use client";

import { COLLECTIONS } from "@/lib/catalog";

/* ─────────────────────────────────────────────
   OVRTHINK — motorul vizual al colecțiilor
   TIPOGRAFIE CINETICĂ: background STATIC + rânduri
   uriașe de text (numele colecției + OVRTHINK) care
   se derulează pe diagonală, în layere. Streetwear.
   ───────────────────────────────────────────── */

const ORANGE = "#FF4A1C";

export const THEME = {
  summer: {
    name: "summer",
    bg: "linear-gradient(135deg, #FF7A2E 0%, #FF4A1C 55%, #E0360F 100%)",
    ink: "#FFF4E2",       // text cinetic
    stroke: "rgba(255,244,226,0.9)",
    title: "#FFF4E2",     // hero
    sub: "#FFE3C4",
  },
  winter: {
    name: "winter",
    bg: "linear-gradient(135deg, #1a120d 0%, #7a2f13 55%, #FF5A1E 100%)",
    ink: "#FFE1C6",
    stroke: "rgba(255,138,61,0.9)",
    title: "#FFE8D2",
    sub: "#F0C39C",
  },
  sport: {
    name: "sport",
    bg: "linear-gradient(135deg, #0b0b0b 0%, #C63410 60%, #FF4A1C 100%)",
    ink: "#FFFFFF",
    stroke: "rgba(255,74,28,0.95)",
    title: "#FFFFFF",
    sub: "#FFD2C2",
  },
};

export const KINETIC_KEYFRAMES = `
  @keyframes ovrMarqL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes ovrMarqR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
  @media (prefers-reduced-motion: reduce) {
    .ovr-kin { animation-duration: 0s !important; animation: none !important; }
  }
`;

function seg(text, n) {
  return Array.from({ length: n }, () => text).join(" "); // em-space între cuvinte
}

/* un rând de text care se derulează (marquee seamless) */
function MarqueeRow({ text, dir, dur, size, weight, mode, op, theme }) {
  const t = THEME[theme];
  const block = seg(text, 8) + " ";
  const base = {
    display: "inline-block",
    fontFamily: "'Jost', sans-serif",
    fontWeight: weight,
    fontSize: `${size}vw`,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    lineHeight: 1,
    whiteSpace: "nowrap",
    paddingRight: "1ch",
  };
  const paint = mode === "stroke"
    ? { color: "transparent", WebkitTextStroke: `1.5px ${t.stroke}` }
    : { color: t.ink };
  return (
    <div style={{ whiteSpace: "nowrap", opacity: op }}>
      <div className="ovr-kin" style={{
        display: "inline-block",
        animation: `${dir > 0 ? "ovrMarqR" : "ovrMarqL"} ${dur}s linear infinite`,
      }}>
        <span style={{ ...base, ...paint }}>{block}</span>
        <span style={{ ...base, ...paint }}>{block}</span>
      </div>
    </div>
  );
}

/* stratul de tipografie cinetică (rotit pe diagonală) */
function KineticLayer({ theme, lang, compact }) {
  const col = COLLECTIONS.find(c => c.id === theme);
  const name = (col?.name[lang] || "OVRTHINK").toUpperCase();
  const k = compact ? 0.62 : 1;
  const angle = theme === "sport" ? -11 : -6;
  const rows = [
    { text: name,       dir: -1, dur: 30, size: 13 * k, weight: 200, mode: "stroke", op: 0.55 },
    { text: "OVRTHINK", dir:  1, dur: 23, size: 18 * k, weight: 300, mode: "fill",   op: 0.13 },
    { text: name,       dir:  1, dur: 35, size: 11 * k, weight: 200, mode: "fill",   op: 0.28 },
    { text: "OVRTHINK", dir: -1, dur: 19, size: 21 * k, weight: 400, mode: "stroke", op: 0.5 },
    { text: name,       dir: -1, dur: 27, size: 12 * k, weight: 200, mode: "fill",   op: 0.2 },
    { text: "OVRTHINK", dir:  1, dur: 33, size: 15 * k, weight: 300, mode: "stroke", op: 0.4 },
  ];
  return (
    <div aria-hidden style={{
      position: "absolute", inset: "-20%",
      transform: `rotate(${angle}deg)`,
      display: "flex", flexDirection: "column", justifyContent: "center",
      gap: compact ? "0.4vh" : "0.8vh",
    }}>
      {rows.map((r, i) => <MarqueeRow key={i} {...r} theme={theme} />)}
    </div>
  );
}

/* fundalul static fixat + tipografia cinetică (în spatele conținutului) */
export function CollectionBg({ theme, lang = "ro" }) {
  const t = THEME[theme];
  if (!t) return null;
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none" }}>
      <style>{KINETIC_KEYFRAMES}</style>
      <div style={{ position: "absolute", inset: 0, background: t.bg }} />
      <KineticLayer theme={theme} lang={lang} />
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
      <style>{KINETIC_KEYFRAMES}</style>
      <KineticLayer theme={col.id} lang={lang} compact />
      <div style={{ position: "relative", padding: "26px 24px 28px" }}>
        <div style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(24px, 3vw, 34px)",
          letterSpacing: "0.04em", textTransform: "uppercase", color: t.title, lineHeight: 1.05,
          textShadow: "0 2px 24px rgba(0,0,0,0.35)",
        }}>
          {col.name[lang]}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: t.sub, marginTop: 8, textShadow: "0 1px 12px rgba(0,0,0,0.3)" }}>
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
