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
    try {
      if (sessionStorage.getItem("ovr_intro_seen") === "1") { setPhase("done"); return; }
    } catch {}
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
          position: "fixed", inset: 0, zIndex: 1000, background: "#000",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
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
            <div style={{
              position: "relative", zIndex: 2, textAlign: "center",
              opacity: phase === "gate" ? 1 : 0, transition: "opacity .5s ease",
            }}>
              <img src="/brand/logo-white.png" alt="OVRTHINK"
                style={{ width: "min(58vw, 280px)", display: "block", margin: "0 auto 34px" }} />
              <button onClick={enter} style={{
                fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 5,
                textTransform: "uppercase", color: "#fff", cursor: "pointer",
                padding: "16px 46px", borderRadius: 0,
                background: "rgba(255,74,28,0.16)", border: `1px solid ${O}`,
                backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
              }}>
                Intră
              </button>
              <div style={{
                marginTop: 16, fontFamily: "'Inter', sans-serif", fontSize: 12,
                letterSpacing: 1, color: "rgba(255,255,255,0.5)",
              }}>
                🔊 cu sunet
              </div>
            </div>
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
