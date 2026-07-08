"use client";

/* Preview animații de categorie — localhost:3000/anim
   Alegi care rămâne pt Tricouri și care pt Hoodie. */

const O = "#FF4A1C";

function Clip({ src, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        borderRadius: 14, overflow: "hidden", border: `1px solid rgba(255,255,255,0.14)`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)", background: "#000",
      }}>
        <video src={src} autoPlay muted loop playsInline
          style={{ width: "100%", display: "block", aspectRatio: "1 / 1", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: 12, fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

export default function AnimPreview() {
  return (
    <div style={{ minHeight: "100vh", background: "#080809", color: "#f3f1ec", padding: "40px 5vw 80px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 34 }}>
        <img src="/brand/logo-white.png" alt="OVRTHINK" style={{ height: 22, margin: "0 auto 14px", display: "block" }} />
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: O }}>Preview animații categorie</div>
        <p style={{ fontSize: 13.5, color: "rgba(243,241,236,0.6)", marginTop: 10 }}>
          Alege care rămâne pentru fiecare categorie. Rulează în buclă, fără sunet.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 44 }}>
        <section>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, letterSpacing: 4, textTransform: "uppercase", marginBottom: 18, borderBottom: `1px solid rgba(255,255,255,0.12)`, paddingBottom: 10 }}>Tricouri</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <Clip src="/anim/tricou-1.mp4" label="Tricou · Opțiunea 1" />
            <Clip src="/anim/tricou-2.mp4" label="Tricou · Opțiunea 2" />
          </div>
        </section>

        <section>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, letterSpacing: 4, textTransform: "uppercase", marginBottom: 18, borderBottom: `1px solid rgba(255,255,255,0.12)`, paddingBottom: 10 }}>Hoodie</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <Clip src="/anim/hoodie-1.mp4" label="Hoodie · Opțiunea 1" />
            <Clip src="/anim/hoodie-2.mp4" label="Hoodie · Opțiunea 2" />
          </div>
        </section>
      </div>

      <p style={{ textAlign: "center", marginTop: 40, fontSize: 12, letterSpacing: 2, color: "rgba(243,241,236,0.4)", textTransform: "uppercase" }}>
        Zi-mi: „tricou 1 sau 2" și „hoodie 1 sau 2" → le montez ca tranziție
      </p>
    </div>
  );
}
