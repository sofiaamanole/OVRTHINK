"use client";

import { useState, useEffect } from "react";

const O = "#FF4A1C";
const KEY = "ovr_cookie_consent";

/* Cookie banner minimalist. Reține preferința în localStorage.
   Cookies non-esențiale (analytics/marketing) NU se încarcă înainte de consimțământ.
   TODO: conectează valorile de mai jos la scripturile reale (analytics/pixel) când sunt adăugate. */
export default function CookieBanner({ lang }) {
  const ro = lang === "ro";
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  const save = (val) => {
    try { localStorage.setItem(KEY, JSON.stringify({ ...val, necessary: true, ts: Date.now() })); } catch {}
    // TODO: dacă val.analytics/val.marketing === true, inițializează aici scripturile respective
    setShow(false);
  };

  if (!show) return null;

  const btn = (primary) => ({
    fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
    padding: "11px 20px", cursor: "pointer", borderRadius: 0,
    background: primary ? O : "transparent", color: primary ? "#fff" : "#1a1712",
    border: primary ? `1px solid ${O}` : "1px solid rgba(0,0,0,0.25)",
  });

  return (
    <div style={{
      position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 1200, maxWidth: 620, margin: "0 auto",
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      border: "1px solid rgba(0,0,0,0.14)", borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
      padding: "22px 24px",
    }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "rgba(26,23,18,0.75)", lineHeight: 1.7, margin: "0 0 16px" }}>
        {ro
          ? "Folosim cookies pentru funcționarea site-ului și, cu acordul tău, pentru analiză și marketing."
          : "We use cookies to run the site and, with your consent, for analytics and marketing."}
      </p>

      {config && (
        <div style={{ margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { k: "necessary", l: ro ? "Necesare (mereu active)" : "Necessary (always on)", fixed: true },
            { k: "analytics", l: ro ? "Analiză" : "Analytics" },
            { k: "marketing", l: "Marketing" },
          ].map(o => (
            <label key={o.k} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 1, color: "#1a1712" }}>
              <input type="checkbox" disabled={o.fixed} checked={o.fixed ? true : prefs[o.k]}
                onChange={e => setPrefs(p => ({ ...p, [o.k]: e.target.checked }))}
                style={{ width: 15, height: 15, accentColor: O }} />
              {o.l}
            </label>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button style={btn(true)} onClick={() => save({ analytics: true, marketing: true })}>{ro ? "Acceptă toate" : "Accept all"}</button>
        <button style={btn(false)} onClick={() => save({ analytics: false, marketing: false })}>{ro ? "Respinge non-esențiale" : "Reject non-essential"}</button>
        {config
          ? <button style={btn(false)} onClick={() => save(prefs)}>{ro ? "Salvează" : "Save"}</button>
          : <button style={btn(false)} onClick={() => setConfig(true)}>{ro ? "Configurează" : "Configure"}</button>}
      </div>
    </div>
  );
}
