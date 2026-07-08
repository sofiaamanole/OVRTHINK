"use client";

import { useState, useRef, useEffect } from "react";

const O = "#FF4A1C";

/* Intro video cu sunet. La intrarea pe site apare o poartă „INTRĂ";
   click-ul (gest utilizator) permite pornirea video-ului CU sunet,
   apoi se deschide magazinul. Rulează o dată pe sesiune. */
export default function Intro({ children }) {
  const [phase, setPhase] = useState("loading"); // loading | gate | playing | done
  const videoRef = useRef(null);

  useEffect(() => {
    // apare de fiecare dată la intrarea pe site (refresh/link nou)
    setPhase("gate");
  }, []);

  const enter = () => {
    setPhase("playing");
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    const p = v.play();
    if (p && p.catch) {
      p.catch(() => { v.muted = true; v.play().catch(() => finish()); }); // fallback: măcar rulează mut
    }
  };

  const finish = () => {
    try { sessionStorage.setItem("ovr_intro_seen", "1"); } catch {}
    setPhase("done");
  };

  return (
    <>
      {children}
      {phase !== "done" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000, background: "#F4F2EE",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          <style>{`
            @keyframes introSmokeA { 0%,100%{ transform: translate(-6%,4%) scale(1);} 50%{ transform: translate(9%,-4%) scale(1.22);} }
            @keyframes introSmokeB { 0%,100%{ transform: translate(6%,-2%) scale(1.12);} 50%{ transform: translate(-9%,6%) scale(1);} }
          `}</style>
          <video
            ref={videoRef}
            src="/intro.mp4"
            playsInline
            preload="auto"
            onEnded={finish}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover",
              opacity: phase === "playing" ? 1 : 0,
              transition: "opacity .6s ease",
            }}
          />

          {(phase === "gate" || phase === "loading") && (
            <>
              {/* fum portocaliu pe alb */}
              <div aria-hidden style={{ position: "absolute", top: "6%", left: "10%", width: "48vw", height: "48vw",
                background: "radial-gradient(circle, rgba(255,74,28,0.5), transparent 62%)", filter: "blur(64px)",
                animation: "introSmokeA 16s ease-in-out infinite", pointerEvents: "none" }} />
              <div aria-hidden style={{ position: "absolute", bottom: "4%", right: "8%", width: "44vw", height: "44vw",
                background: "radial-gradient(circle, rgba(255,138,61,0.42), transparent 62%)", filter: "blur(72px)",
                animation: "introSmokeB 20s ease-in-out infinite", pointerEvents: "none" }} />
              <div style={{
                position: "relative", zIndex: 2, textAlign: "center",
                opacity: phase === "gate" ? 1 : 0, transition: "opacity .5s ease",
              }}>
                <img src="/brand/logo-black.png" alt="OVRTHINK"
                  style={{ width: "min(58vw, 280px)", display: "block", margin: "0 auto 34px" }} />
                <button onClick={enter} style={{
                  fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 5,
                  textTransform: "uppercase", color: "#fff", cursor: "pointer",
                  padding: "16px 48px", borderRadius: 0,
                  background: O, border: `1px solid ${O}`,
                  boxShadow: "0 12px 30px rgba(255,74,28,0.35)",
                }}>
                  Intră
                </button>
              </div>
            </>
          )}

          {phase === "playing" && (
            <button onClick={finish} style={{
              position: "absolute", bottom: 26, right: 26, zIndex: 3,
              fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2.5,
              textTransform: "uppercase", color: "rgba(255,255,255,0.85)", cursor: "pointer",
              padding: "9px 18px", borderRadius: 0,
              background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.35)",
              backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            }}>
              Skip →
            </button>
          )}
        </div>
      )}
    </>
  );
}
