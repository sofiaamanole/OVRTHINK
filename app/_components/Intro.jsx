"use client";

import { useState, useRef, useEffect } from "react";

const O = "#FF4A1C";

/* Intro video. Pornește DIRECT la intrarea pe site (fără poartă „INTRĂ").
   Autoplay mut (politica browserelor), cu buton de sunet.
   La final: tranziție lină (fade) între video și website. */
export default function Intro({ children }) {
  const [phase, setPhase] = useState("playing"); // playing | fadeout | done
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => finish());
    // siguranță: dacă metadata nu se încarcă, nu bloca site-ul
    const t = setTimeout(() => { if (v.readyState < 2) finish(); }, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    setPhase(p => (p === "playing" ? "fadeout" : p));
    setTimeout(() => setPhase("done"), 1200);
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted && v.paused) v.play().catch(() => {});
    setMuted(v.muted);
  };

  return (
    <>
      {children}
      {phase !== "done" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000, background: "#F4F2EE",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          opacity: phase === "fadeout" ? 0 : 1,
          transition: "opacity 1.2s ease",
          pointerEvents: phase === "fadeout" ? "none" : "auto",
        }}>
          <video
            ref={videoRef}
            src="/intro.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finish}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover",
              transform: phase === "fadeout" ? "scale(1.04)" : "scale(1)",
              transition: "transform 1.2s ease",
            }}
          />

          {phase === "playing" && (
            <>
              {/* sunet on/off */}
              <button onClick={toggleSound} aria-label="Sunet" style={{
                position: "absolute", bottom: 26, left: 26, zIndex: 3,
                fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2.5,
                textTransform: "uppercase", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 16px", borderRadius: 30,
                background: "rgba(0,0,0,0.32)", border: "1px solid rgba(255,255,255,0.35)",
                backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
              }}>
                <span style={{ fontSize: 14 }}>{muted ? "🔇" : "🔊"}</span>
                {muted ? "Sunet" : "Sunet on"}
              </button>

              {/* skip */}
              <button onClick={finish} style={{
                position: "absolute", bottom: 26, right: 26, zIndex: 3,
                fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2.5,
                textTransform: "uppercase", color: "rgba(255,255,255,0.9)", cursor: "pointer",
                padding: "9px 18px", borderRadius: 30,
                background: "rgba(0,0,0,0.32)", border: "1px solid rgba(255,255,255,0.35)",
                backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
              }}>
                Skip →
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
