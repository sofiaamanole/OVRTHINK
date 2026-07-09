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
    // NU sări peste intro dacă play() e respins pe mobil — doar reîncearcă
    const tryPlay = () => { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); };
    tryPlay();
    const onReady = () => tryPlay();
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);
    // fallback mobil: primul tap pornește video-ul dacă autoplay e blocat
    const onTap = () => tryPlay();
    window.addEventListener("touchstart", onTap, { once: true });
    window.addEventListener("pointerdown", onTap, { once: true });
    // siguranță: doar dacă video-ul chiar NU pornește deloc, trecem la site
    const t = setTimeout(() => { if (v.paused && v.currentTime === 0) finish(); }, 10000);
    return () => {
      clearTimeout(t);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      window.removeEventListener("touchstart", onTap);
      window.removeEventListener("pointerdown", onTap);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    setPhase(p => (p === "playing" ? "fadeout" : p));
    setTimeout(() => setPhase("done"), 1100);
  };

  // pornește tranziția cu ~1.8s înainte de finalul video-ului (trecere mai devreme, suprapusă)
  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration || isNaN(v.duration)) return;
    if (v.duration - v.currentTime <= 1.8) finish();
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
          position: "fixed", inset: 0, zIndex: 1000,
          // fundal gri care imită backgroundul video-ului -> marginile lui devin invizibile
          background: "linear-gradient(180deg, #ececf0 0%, #d4d4d9 58%, #c6c6cc 100%)",
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
            onTimeUpdate={onTime}
            onEnded={finish}
            style={{
              // pătrat, se vede TOT (fără crop), centrat, mai mic; marginile topite în fundal
              width: "min(94vw, 90vh)", height: "min(94vw, 90vh)",
              objectFit: "cover", display: "block",
              // fade DOAR pe marginea exterioară (18%) — nu ajunge la inel; topește seam-ul
              maskImage: "radial-gradient(closest-side at 50% 50%, #000 82%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(closest-side at 50% 50%, #000 82%, transparent 100%)",
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
