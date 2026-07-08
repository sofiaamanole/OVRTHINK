"use client";

/* Paginile OVRTHINK: Home, Colecții, Despre. Temă albă/portocalie. */

const O = "#FF4A1C";
const INK = "#1a1712";
const MUTED = "rgba(26,23,18,0.62)";

function Btn({ children, onClick, primary }) {
  return (
    <button onClick={onClick} className="ovr-hbtn" style={{
      fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase",
      padding: "15px 32px", cursor: "pointer", borderRadius: 0,
      background: primary ? O : "transparent",
      color: primary ? "#fff" : INK,
      border: primary ? `1px solid ${O}` : `1px solid ${INK}`,
    }}>{children}</button>
  );
}

const T = {
  ro: {
    heroEyebrow: "OVRTHINK · Sezon 2026",
    heroTitle: "Noua Eră",
    heroSub: "Streetwear pentru cei care gândesc prea mult.",
    shop: "Cumpără", collections: "Colecții",
    catTitle: "Alege-ți categoria", tee: "Tricouri", hoodie: "Hoodie",
    campTitle: "Always the right choice.",
    campText: "Piese esențiale, croieli oversized, print premium. Fiecare articol poartă monograma [OK] — semnul că ai ales bine.",
    aboutTitle: "Despre OVRTHINK",
    aboutLead: "Am făcut din supra-gândire o estetică.",
    aboutP1: "OVRTHINK e un brand de streetwear născut dintr-o idee simplă: cei care gândesc prea mult merită haine pe măsura minții lor. Croieli oversized, bumbac heavyweight, print premium — piese care spun ceva fără să strige.",
    aboutP2: "Monograma [OK] nu e doar un logo. E o stare — „looks OK, isn't”. Un semn discret că ai ales corect, chiar și când te-ai complicat singur.",
    aboutP3: "Fiecare colecție e gândită în negru și alb, cu un singur accent: portocaliul. Restul îl adaugi tu.",
    colTitle: "Colecții", colSub: "Sezon 2026",
    colCurrent: "Colecția curentă", colName: "Essentials 01",
    colDesc: "Prima dropul OVRTHINK: tricoul și hoodie-ul de bază, în negru și alb. Piesele de la care pornește totul.",
    view: "Vezi produsele",
    soon: "În curând", soonText: "Colecțiile sezoniere — Primăvară-Vară, Toamnă-Iarnă, Sport — vin în curând.",
  },
  en: {
    heroEyebrow: "OVRTHINK · Season 2026",
    heroTitle: "The New Era",
    heroSub: "Streetwear for those who think too much.",
    shop: "Shop", collections: "Collections",
    catTitle: "Choose your category", tee: "T-shirts", hoodie: "Hoodies",
    campTitle: "Always the right choice.",
    campText: "Essential pieces, oversized fits, premium print. Every item carries the [OK] monogram — the sign you chose well.",
    aboutTitle: "About OVRTHINK",
    aboutLead: "We turned overthinking into an aesthetic.",
    aboutP1: "OVRTHINK is a streetwear brand born from a simple idea: those who think too much deserve clothes worthy of their minds. Oversized fits, heavyweight cotton, premium print — pieces that say something without shouting.",
    aboutP2: "The [OK] monogram isn't just a logo. It's a mood — “looks OK, isn't.” A quiet sign you chose right, even when you overcomplicated it yourself.",
    aboutP3: "Every collection is designed in black and white, with a single accent: orange. The rest you add yourself.",
    colTitle: "Collections", colSub: "Season 2026",
    colCurrent: "Current collection", colName: "Essentials 01",
    colDesc: "The first OVRTHINK drop: the essential tee and hoodie, in black and white. Where everything starts.",
    view: "View products",
    soon: "Coming soon", soonText: "Seasonal collections — Spring-Summer, Autumn-Winter, Sport — coming soon.",
  },
};

/* ── HOME (minimal) ── */
export function HomePage({ lang, onShop }) {
  const L = T[lang];
  const products = [
    { id: "tee", name: lang === "ro" ? "Tricou OVRTHINK" : "OVRTHINK Tee", price: "189 lei", img: "/catalog/tee-black.png" },
    { id: "hoodie", name: lang === "ro" ? "Hoodie OVRTHINK" : "OVRTHINK Hoodie", price: "329 lei", img: "/catalog/hoodie-black.png" },
  ];
  return (
    <main>
      {/* HERO minimal: logo + tagline + 2 butoane, mult spațiu */}
      <section style={{ position: "relative", minHeight: "76vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center", padding: "70px 6vw 50px", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "4%", left: "14%", width: "44vw", height: "44vw",
          background: "radial-gradient(circle, rgba(255,74,28,0.26), transparent 62%)", filter: "blur(72px)",
          animation: "ovrGlowA 22s ease-in-out infinite", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: "0%", right: "12%", width: "38vw", height: "38vw",
          background: "radial-gradient(circle, rgba(255,138,61,0.2), transparent 62%)", filter: "blur(78px)",
          animation: "ovrGlowB 26s ease-in-out infinite", pointerEvents: "none" }} />
        <div className="ovr-rise" style={{ position: "relative" }}>
          <img src="/brand/logo-black.png" alt="OVRTHINK" style={{ width: "min(76vw, 500px)", display: "block", margin: "0 auto" }} />
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(15px, 2vw, 22px)", letterSpacing: 1.5, color: MUTED, margin: "28px 0 32px" }}>
            {L.heroSub}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn primary onClick={() => onShop("tee")}>{L.tee}</Btn>
            <Btn onClick={() => onShop("hoodie")}>{L.hoodie}</Btn>
          </div>
        </div>
      </section>

      {/* Două produse, curat */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 6vw 90px" }}>
        <div className="ovr-cat" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          {products.map(p => (
            <button key={p.id} onClick={() => onShop(p.id)} className="ovr-tile" style={{
              background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left",
            }}>
              <div style={{ overflow: "hidden", borderRadius: 4, aspectRatio: "4 / 5", background: "#eceae5" }}>
                <img src={p.img} alt={p.name} className="ovr-tile-img" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: "8%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, letterSpacing: 1 }}>{p.name}</span>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, color: O }}>{p.price}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ── COLECȚII ── */
export function CollectionsPage({ lang, onShop }) {
  const L = T[lang];
  const ro = lang === "ro";
  const cols = [
    { id: "ovrcore", name: "OVRCORE", tag: ro ? "Nucleul · esențiale" : "The core · essentials", live: true,
      subs: [
        { name: "OVRHEAT", tag: ro ? "Vară · lejer" : "Summer · light" },
        { name: "OVRLAYER", tag: ro ? "Iarnă · straturi" : "Winter · layers" },
      ] },
    { id: "ovrmove", name: "OVRMOVE", tag: ro ? "Sport · mișcare · viteză" : "Sport · motion · speed", live: false },
    { id: "ovrshift", name: "OVRSHIFT", tag: ro ? "Ediție limitată" : "Limited edition", live: false },
  ];
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "34px 5vw 90px" }}>
      {/* Header lockup: [OVRTHINK] — COLECȚII (titlu = mărimea logo-ului) */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(14px, 2.8vw, 34px)", flexWrap: "wrap" }}>
        <img src="/brand/logo-black.png" alt="OVRTHINK" style={{ height: "clamp(34px, 5vw, 58px)", display: "block" }} />
        <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: "clamp(30px, 4.4vw, 50px)", color: MUTED, lineHeight: 1 }}>—</span>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(34px, 5vw, 58px)", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, lineHeight: 0.9 }}>{L.colTitle}</h1>
      </div>
      <div style={{ textAlign: "center", fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: O, marginTop: 12 }}>{L.colSub}</div>

      {/* Stânga: imaginea (fum + modele, fără logo) · Dreapta: tab-urile colecțiilor */}
      <div className="ovr-cat" style={{ display: "grid", gridTemplateColumns: "1.32fr 0.8fr", gap: "clamp(16px, 2.4vw, 40px)", alignItems: "center", marginTop: 20 }}>
        {/* stânga: imagine cu marginile topite pe toate laturile */}
        <div>
          <img src="/home/collectii-hero.png" alt="OVRTHINK" style={{
            width: "100%", display: "block",
            maskImage: "linear-gradient(to right, transparent 0%, #000 13%, #000 87%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 13%, #000 87%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)",
            maskComposite: "intersect", WebkitMaskComposite: "source-in",
          }} />
        </div>

        {/* dreapta: tab-uri colecții liquid glass, stivuite vertical */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {cols.map(c => (
            <div key={c.id} className="ovr-glass" onClick={c.live ? () => onShop("tee") : undefined}
              style={{
                position: "relative", cursor: c.live ? "pointer" : "default", overflow: "hidden",
                border: "1px solid rgba(255,74,28,0.32)", borderRadius: 18,
                background: "rgba(255,255,255,0.34)",
                backdropFilter: "blur(16px) saturate(1.35)", WebkitBackdropFilter: "blur(16px) saturate(1.35)",
                boxShadow: "0 10px 34px rgba(255,74,28,0.16), inset 0 1px 0 rgba(255,255,255,0.6)",
                padding: "clamp(18px, 2vw, 26px)",
                display: "flex", flexDirection: "column",
                animation: c.live ? "ovrGlassPulse 4.5s ease-in-out infinite" : "none",
              }}>
              <div aria-hidden style={{ position: "absolute", top: -40, right: -30, width: 140, height: 140,
                background: "radial-gradient(circle, rgba(255,74,28,0.28), transparent 68%)", filter: "blur(20px)", pointerEvents: "none" }} />
              <span style={{ position: "absolute", top: 14, right: 14, fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                color: "#fff", background: c.live ? O : "rgba(26,23,18,0.45)", borderRadius: 20, padding: "4px 11px" }}>
                {c.live ? (ro ? "Disponibil" : "Available") : L.soon}
              </span>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(26px, 3vw, 40px)", letterSpacing: "0.06em", margin: "2px 0 5px" }}>{c.name}</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: MUTED, margin: 0 }}>{c.tag}</p>

              {c.subs && (
                <div style={{ display: "flex", gap: 9, marginTop: 16, flexWrap: "wrap" }}>
                  {c.subs.map(s => (
                    <div key={s.name} className="ovr-subpill" title={s.tag}
                      style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: "0.12em",
                        border: "1px solid rgba(0,0,0,0.16)", borderRadius: 20, padding: "8px 14px", background: "rgba(255,255,255,0.4)" }}>
                      {s.name}
                    </div>
                  ))}
                </div>
              )}

              {c.live && (
                <div className="ovr-arrow" style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: O, marginTop: 16 }}>
                  {L.view} →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ── DESPRE ── */
export function AboutPage({ lang, onShop }) {
  const L = T[lang];
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 5vw 90px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: "clamp(30px, 5vw, 56px)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>{L.aboutTitle}</h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(18px, 2.4vw, 26px)", color: O, marginTop: 14 }}>{L.aboutLead}</p>
      </div>

      <div style={{ overflow: "hidden", borderRadius: 4, marginBottom: 40 }}>
        <img src="/home/hero-male.jpg" alt="" style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 460, objectPosition: "center 30%" }} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: MUTED, lineHeight: 1.9 }}>
        <p style={{ margin: "0 0 20px" }}>{L.aboutP1}</p>
        <p style={{ margin: "0 0 20px" }}>{L.aboutP2}</p>
        <p style={{ margin: "0 0 30px" }}>{L.aboutP3}</p>
        <div style={{ textAlign: "center" }}><Btn primary onClick={() => onShop("tee")}>{L.shop}</Btn></div>
      </div>
    </main>
  );
}
