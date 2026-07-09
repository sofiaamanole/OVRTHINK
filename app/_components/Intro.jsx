"use client";

import { useState, useRef, useEffect } from "react";

const O = "#FF4A1C";

/* Intro video. Pornește DIRECT la intrarea pe site (fără poartă „INTRĂ").
   Sunet PORNIT automat (fără buton). Dacă browserul blochează autoplay-ul cu
   sunet, video-ul pornește mut și se dezmutează la PRIMA interacțiune (atingere/
   click/scroll/tastă) — fără niciun buton de sunet.
   La final: tranziție lină (fade) între video și website. */
export default function Intro({ children }) {
  const [phase, setPhase] = useState("playing"); // playing | fadeout | done
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const gestures = ["pointerdown", "touchstart", "keydown", "click", "wheel", "scroll"];

    // dezmutează la prima interacțiune (dacă autoplay-ul cu sunet a fost blocat)
    const unmute = () => {
      if (!videoRef.current) return;
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      videoRef.current.play().catch(() => {});
      gestures.forEach(g => window.removeEventListener(g, unmute));
    };

    const tryPlay = () => {
      // încearcă întâi CU sunet
      v.muted = false;
      v.volume = 1;
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => {
        // blocat cu sunet -> pornește mut, dar dezmutează la prima interacțiune
        v.muted = true;
        v.play().catch(() => {});
        gestures.forEach(g => window.addEventListener(g, unmute, { once: true, passive: true }));
      });
    };

    tryPlay();
    const onReady = () => tryPlay();
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);
    // siguranță: doar dacă video-ul chiar NU pornește deloc, trecem la site
    const t = setTimeout(() => { if (v.paused && v.currentTime === 0) finish(); }, 10000);
    return () => {
      clearTimeout(t);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      gestures.forEach(g => window.removeEventListener(g, unmute));
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
