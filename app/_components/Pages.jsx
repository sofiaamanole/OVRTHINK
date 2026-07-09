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
    aboutLead: "Overthinking in progress.",
    aboutP1: "OVRTHINK e un brand de streetwear din România.",
    aboutP2: "Facem tricouri și hanorace din bumbac organic heavyweight, cu croială oversized și print premium, rezistent la spălări repetate. Producem în serii mici și verificăm fiecare piesă înainte să plece spre tine.",
    aboutP3: "Nu urmărim tendințe și nu scoatem zeci de modele pe sezon. Preferăm puține produse, făcute corect: material gros și plăcut la purtat, cusături curate, imprimeu care arată la fel și după un an.",
    aboutP4: "Toate colecțiile sunt în alb și negru, cu un singur accent de culoare: portocaliu. Numele vine de la overthinking — gânditul prea mult. De acolo pornesc toate designurile noastre.",
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
    aboutLead: "Overthinking in progress.",
    aboutP1: "OVRTHINK is a streetwear brand from Romania.",
    aboutP2: "We make tees and hoodies from heavyweight organic cotton, with an oversized fit and premium print built to survive repeated washing. We produce in small batches and check every piece before it ships to you.",
    aboutP3: "We don't chase trends or drop dozens of styles each season. We prefer few products, made right: thick fabric that feels good to wear, clean stitching, print that looks the same a year later.",
    aboutP4: "Every collection is black and white, with a single accent color: orange. The name comes from overthinking. That's where all our designs start.",
    colTitle: "Collections", colSub: "Season 2026",
    colCurrent: "Current collection", colName: "Essentials 01",
    colDesc: "The first OVRTHINK drop: the essential tee and hoodie, in black and white. Where everything starts.",
    view: "View products",
    soon: "Coming soon", soonText: "Seasonal collections — Spring-Summer, Autumn-Winter, Sport — coming soon.",
  },
};

/* stiluri comune homepage */
const eyebrow = { fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: O };
const h2style = { fontFamily: "'Jost', sans-serif", fontWeight: 200, letterSpacing: "0.08em", textTransform: "uppercase", color: INK, margin: 0 };
const bodyStyle = { fontFamily: "'Inter', sans-serif", fontSize: 15, color: MUTED, lineHeight: 1.85 };
const secPad = { padding: "clamp(56px, 8vw, 108px) 6vw" };

/* ── HOME — premium / editorial ── */
export function HomePage({ lang, onShop, onCollections, onAbout, fmt }) {
  const ro = lang === "ro";
  const collections = [
    { name: "OVRHEAT", text: ro ? "Toate tricourile OVRTHINK." : "All OVRTHINK t-shirts.", onClick: () => onShop("tee") },
    { name: "OVRLAYER", text: ro ? "Hanorace și croieli groase." : "Hoodies and heavier cuts.", onClick: () => onShop("hoodie") },
    { name: "OVRMOVE", text: ro ? "Piese de gym și sport, făcute pentru mișcare." : "Gym and sport pieces made for movement.", soon: true },
    { name: "OVRSHIFT", text: ro ? "Streetwear inspirat din racing și riding." : "Rider and racing inspired streetwear.", soon: true },
  ];
  const looks = [
    { src: "/home/hero-male.jpg", alt: ro ? "Tricou · model" : "Tee · model" },        /* imagine tricou/model */
    { src: "/home/campaign.jpg", alt: ro ? "Hanorac · model" : "Hoodie · model" },      /* imagine hoodie/model */
    { src: "/home/extra.jpg", alt: ro ? "Detaliu material" : "Material close-up" },      /* close-up material/logo */
  ];
  const why = [
    { t: "Heavyweight cotton", d: ro ? "Material premium, dens, cu structură." : "Premium, dense fabric with structure." },
    { t: "Oversized fit", d: ro ? "Croială relaxată, construită pentru prezență." : "Relaxed cut, built for presence." },
    { t: "Minimal identity", d: ro ? "Design alb/negru cu accent portocaliu OVR." : "Black/white design with the OVR orange accent." },
  ];


  return (
    <main>
      {/* 1 — HERO */}
      <section style={{ position: "relative", ...secPad, paddingTop: "clamp(40px, 5vw, 72px)", paddingBottom: "clamp(12px, 1.6vw, 26px)" }}>
        <div className="ovr-hero ovr-rise" style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <div style={eyebrow}>OVRTHINK / 01</div>
            <h1 style={{ ...h2style, fontWeight: 200, fontSize: "clamp(38px, 6.4vw, 82px)", lineHeight: 1.0, margin: "18px 0 0" }}>
              OVRTHINK<br />THE ORDINARY
            </h1>
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(16px, 2vw, 22px)", letterSpacing: 1, color: INK, margin: "22px 0 14px" }}>
              {ro ? "Streetwear pentru cei care gândesc prea mult." : "Streetwear for those who think too much."}
            </p>
            <p style={{ ...bodyStyle, maxWidth: 440, margin: "0 0 30px" }}>
              {ro
                ? "Piese clean, oversized, în alb, negru și portocaliu. Create pentru cei care transformă supra-gândirea într-o estetică."
                : "Clean, oversized pieces in white, black and orange. Made for those who turn overthinking into an aesthetic."}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn primary onClick={() => onShop("tee")}>{ro ? "Cumpără acum" : "Shop now"}</Btn>
              <Btn onClick={onCollections}>{ro ? "Vezi colecțiile" : "View collections"}</Btn>
            </div>
          </div>
          {/* Animația de home — marginile topite în fundal pe toate laturile. Sursă: /home/acasa-animatie.mp4 */}
          <div>
            <video src="/home/acasa-animatie.mp4" autoPlay muted loop playsInline preload="auto"
              style={{
                width: "100%", display: "block", objectFit: "cover", aspectRatio: "4 / 5",
                maskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
                maskComposite: "intersect", WebkitMaskComposite: "source-in",
              }} />
          </div>
        </div>
      </section>

      {/* 2 — SHOP BY COLLECTION */}
      <section style={{ ...secPad, paddingTop: "clamp(14px, 1.8vw, 30px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ ...eyebrow, marginBottom: 26 }}>SHOP BY COLLECTION</div>
          <div className="ovr-collgrid">
            {collections.map(c => (
              <button key={c.name} onClick={c.soon ? undefined : c.onClick} disabled={c.soon}
                className={c.soon ? "" : "ovr-glass"} style={{
                textAlign: "left", cursor: c.soon ? "default" : "pointer", display: "flex", flexDirection: "column",
                border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, background: "rgba(255,255,255,0.5)",
                padding: "22px 20px", minHeight: 178, color: INK, WebkitTapHighlightColor: "transparent",
                opacity: c.soon ? 0.62 : 1,
              }}>
                <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: 19, letterSpacing: "0.1em", margin: "0 0 8px", color: INK }}>{c.name}</h3>
                <p style={{ ...bodyStyle, fontSize: 13, margin: 0 }}>{c.text}</p>
                <div style={{ flex: 1 }} />
                {c.soon ? (
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "#9a968e", marginTop: 16, border: "1px solid rgba(0,0,0,0.18)", borderRadius: 20, padding: "4px 11px", alignSelf: "flex-start" }}>
                    {ro ? "În curând" : "Coming soon"}
                  </span>
                ) : (
                  <span className="ovr-arrow" style={{ fontFamily: "'Jost', sans-serif", fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: O, marginTop: 16 }}>
                    {ro ? "Explorează" : "Explore"} →
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — BRAND STATEMENT */}
      <section style={{ ...secPad, textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={eyebrow}>THE OVRTHINK CODE</div>
          <h2 style={{ ...h2style, fontWeight: 200, fontSize: "clamp(30px, 5vw, 60px)", textTransform: "none", letterSpacing: "0.01em", margin: "14px 0 20px" }}>Made from overthinking.</h2>
          <p style={{ ...bodyStyle, fontSize: 16, margin: "0 auto 30px", maxWidth: 600 }}>
            {ro
              ? "OVRthink este pentru cei care gândesc prea mult, simt prea mult și aleg să transforme asta într-o estetică. Minimal, clean, oversized — cu un singur accent: portocaliul OVR."
              : "OVRthink is for those who think too much, feel too much, and choose to turn it into an aesthetic. Minimal, clean, oversized — with a single accent: the OVR orange."}
          </p>
          <Btn onClick={onAbout}>{ro ? "Despre brand" : "About the brand"}</Btn>
        </div>
      </section>

      {/* 5 — LOOKBOOK STRIP */}
      <section style={{ ...secPad, paddingTop: 0 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ ...eyebrow, marginBottom: 24 }}>OVRTHINK IN MOTION</div>
          <div className="ovr-trio">
            {looks.map(l => (
              <div key={l.src} className="ovr-lookcard" style={{ background: "#f1eee9" }}>
                <img src={l.src} alt={l.alt} style={{ width: "100%", height: "100%", objectFit: "cover", aspectRatio: "3 / 4", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — WHY OVRTHINK */}
      <section style={{ ...secPad }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ ...eyebrow, marginBottom: 26 }}>{ro ? "DE CE OVRTHINK" : "WHY OVRTHINK"}</div>
          <div className="ovr-trio">
            {why.map(w => (
              <div key={w.t} style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "30px 26px", background: "rgba(255,255,255,0.5)" }}>
                <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: 18, letterSpacing: "0.04em", margin: "0 0 10px" }}>{w.t}</h3>
                <p style={{ ...bodyStyle, fontSize: 14, margin: 0 }}>{w.d}</p>
              </div>
            ))}
          </div>
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
    { id: "ovrheat", name: "OVRHEAT", tag: ro ? "Toate tricourile" : "All t-shirts", live: true, target: "tee" },
    { id: "ovrlayer", name: "OVRLAYER", tag: ro ? "Hanorace · straturi" : "Hoodies · layers", live: true, target: "hoodie" },
    { id: "ovrmove", name: "OVRMOVE", tag: ro ? "Sport · mișcare · viteză" : "Sport · motion · speed", live: false },
    { id: "ovrshift", name: "OVRSHIFT", tag: ro ? "Ediție limitată" : "Limited edition", live: false },
  ];
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "34px 5vw 90px" }}>
      {/* Header lockup: [OVRTHINK] — COLECȚII (titlu = mărimea logo-ului) */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(14px, 2.8vw, 34px)", flexWrap: "wrap" }}>
        <img src="/brand/logo-black.png" alt="OVRTHINK" style={{ height: "clamp(34px, 5vw, 58px)", display: "block" }} />
        <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: "clamp(30px, 4.4vw, 50px)", color: MUTED, lineHeight: 1 }}>—</span>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: "clamp(30px, 4.4vw, 51px)", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0, lineHeight: 0.9 }}>{L.colTitle}</h1>
      </div>
      <div style={{ textAlign: "center", fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: O, marginTop: 12 }}>{L.colSub}</div>

      {/* Stânga: imaginea (fum + modele, fără logo) · Dreapta: tab-urile colecțiilor */}
      <div className="ovr-cat" style={{ display: "grid", gridTemplateColumns: "1.62fr 0.74fr", gap: "clamp(12px, 2vw, 32px)", alignItems: "start", marginTop: 12 }}>
        {/* stânga: imagine cu marginile topite (capul NU se atinge de fade — are padding transparent deasupra) */}
        <div>
          <img src="/home/collectii-hero.png" alt="OVRTHINK" style={{
            width: "100%", display: "block", marginTop: "-2%",
            maskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 70%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 9%, #000 66%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 70%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 9%, #000 66%, transparent 100%)",
            maskComposite: "intersect", WebkitMaskComposite: "source-in",
          }} />
        </div>

        {/* dreapta: tab-uri colecții liquid glass, stivuite vertical */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {cols.map(c => (
            <div key={c.id} className="ovr-glass" onClick={c.live ? () => onShop(c.target) : undefined}
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
      </div>

      <div style={{ marginBottom: 40 }}>
        {/* margini topite în fundal pe toate laturile — trecere insesizabilă */}
        <img src="/home/hero-male.jpg" alt="" style={{
          width: "100%", display: "block", objectFit: "cover", maxHeight: 460, objectPosition: "center 30%",
          maskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%)",
          maskComposite: "intersect", WebkitMaskComposite: "source-in",
        }} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: MUTED, lineHeight: 1.9 }}>
        <p style={{ margin: "0 0 20px" }}>{L.aboutP1}</p>
        <p style={{ margin: "0 0 20px" }}>{L.aboutP2}</p>
        <p style={{ margin: "0 0 20px" }}>{L.aboutP3}</p>
        <p style={{ margin: "0 0 34px" }}>{L.aboutP4}</p>
        <p style={{ textAlign: "center", fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(18px, 2.6vw, 28px)", letterSpacing: "0.02em", color: O, margin: "0 0 34px" }}>{L.aboutLead}</p>
        <div style={{ textAlign: "center" }}><Btn primary onClick={() => onShop("tee")}>{L.shop}</Btn></div>
      </div>
    </main>
  );
}
