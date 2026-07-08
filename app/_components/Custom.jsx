"use client";

import { useState } from "react";

/* Pagina CUSTOM — cerere de personalizare produs. Temă albă/portocalie OVRTHINK. */

const O = "#FF4A1C";
const INK = "#1a1712";
const MUTED = "rgba(26,23,18,0.62)";

const eyebrow = { fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: O };
const h2style = { fontFamily: "'Jost', sans-serif", fontWeight: 200, letterSpacing: "0.06em", color: INK, margin: 0 };
const body = { fontFamily: "'Inter', sans-serif", fontSize: 15, color: MUTED, lineHeight: 1.85 };
const secPad = { padding: "clamp(48px, 7vw, 96px) 6vw" };
const lbl = { fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#8a877f", marginBottom: 8, display: "block" };
const field = { width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 14.5, padding: "13px 15px", border: "1px solid rgba(0,0,0,0.2)", borderRadius: 0, background: "rgba(255,255,255,0.7)", color: INK };

function scrollToForm() {
  const el = document.getElementById("custom-form");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── HERO ── */
function CustomHero({ ro }) {
  return (
    <section style={{ ...secPad, paddingBottom: "clamp(24px, 3vw, 48px)", textAlign: "center" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={eyebrow}>OVRTHINK / CUSTOM</div>
        <h1 style={{ ...h2style, fontSize: "clamp(38px, 6.4vw, 82px)", textTransform: "uppercase", lineHeight: 1, margin: "18px 0 18px" }}>
          CUSTOM OVRTHINK
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(16px, 2.2vw, 24px)", letterSpacing: 0.5, color: O, margin: "0 0 16px" }}>
          {ro ? "Dacă tot ești overthinker, împărtășește cu noi ideea ta." : "If you're an overthinker anyway, share your idea with us."}
        </p>
        <p style={{ ...body, margin: "0 auto 30px", maxWidth: 560 }}>
          {ro
            ? "Trimite-ne textul, animația sau grafica ta, iar noi o transformăm într-un tricou sau hoodie unic. Tu vii cu ideea, noi ne ocupăm de produs."
            : "Send us your text, animation or graphic and we turn it into a unique tee or hoodie. You bring the idea, we handle the product."}
        </p>
        <button onClick={scrollToForm} className="ovr-hbtn" style={{
          fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase",
          padding: "15px 34px", cursor: "pointer", borderRadius: 0, background: O, color: "#fff", border: `1px solid ${O}`,
        }}>
          {ro ? "Trimite ideea ta" : "Send your idea"}
        </button>
      </div>
    </section>
  );
}

/* ── CUM FUNCȚIONEAZĂ ── */
function CustomSteps({ ro }) {
  const steps = [
    { n: "01", t: ro ? "Trimite ideea" : "Send the idea", d: ro ? "Încarcă textul, animația sau grafica pe care vrei să o imprimăm." : "Upload the text, animation or graphic you want printed." },
    { n: "02", t: ro ? "Alegem produsul" : "Choose the product", d: ro ? "Selectezi tricou sau hoodie, culoarea și mărimea dorită." : "Pick tee or hoodie, the color and size you want." },
    { n: "03", t: ro ? "Confirmăm pe email" : "We confirm by email", d: ro ? "Îți trimitem confirmarea, prețul final și detaliile de producție." : "We send the confirmation, final price and production details." },
  ];
  return (
    <section style={{ ...secPad, paddingTop: "clamp(20px, 3vw, 40px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={{ ...h2style, fontWeight: 300, fontSize: "clamp(26px, 4vw, 44px)", margin: "0 0 30px" }}>{ro ? "Cum funcționează" : "How it works"}</h2>
        <div className="ovr-trio">
          {steps.map(s => (
            <div key={s.n} style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "28px 26px", background: "rgba(255,255,255,0.5)" }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 2, color: O, marginBottom: 12 }}>{s.n} / {s.t}</div>
              <p style={{ ...body, fontSize: 14, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CERINȚE FIȘIER ── */
function FileRequirements({ ro }) {
  const reqs = ro
    ? ["Format acceptat: PNG", "Calitate: HD", "Rezoluție recomandată: 300 DPI", "Fundal: transparent", "Design clar, fără pixeli vizibili", "Trimite grafica la dimensiune cât mai mare"]
    : ["Accepted format: PNG", "Quality: HD", "Recommended resolution: 300 DPI", "Background: transparent", "Clear design, no visible pixels", "Send the graphic as large as possible"];
  return (
    <section style={{ ...secPad, paddingTop: "clamp(20px, 3vw, 40px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={{ ...h2style, fontWeight: 300, fontSize: "clamp(26px, 4vw, 44px)", margin: "0 0 12px" }}>{ro ? "Detalii importante despre fișier" : "Important file details"}</h2>
        <p style={{ ...body, maxWidth: 560, margin: "0 0 26px" }}>
          {ro ? "Pentru print de calitate, fișierul trimis trebuie să fie pregătit corect." : "For a quality print, the file you send must be prepared correctly."}
        </p>
        <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "28px clamp(22px,3vw,36px)", background: "rgba(255,255,255,0.5)" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px 28px" }}>
            {reqs.map(r => (
              <li key={r} style={{ ...body, fontSize: 14.5, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: O, marginTop: 2 }}>—</span>{r}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ display: "inline-flex", width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${O}`, color: O, alignItems: "center", justifyContent: "center", fontFamily: "'Jost',sans-serif", fontSize: 12, flexShrink: 0 }}>!</span>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8a877f", margin: 0 }}>
              {ro ? "Fișierele de calitate slabă pot afecta rezultatul final al printului." : "Low-quality files may affect the final print result."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FORMULAR ── */
function CustomRequestForm({ ro }) {
  const [state, setState] = useState("idle"); // idle | sending | success | error
  const [fileName, setFileName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const file = fd.get("file");
    if (!file || !file.name) return;
    if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) { setState("error"); return; }
    if (file.size > 20 * 1024 * 1024) { setState("error"); return; }
    setState("sending");
    try {
      const res = await fetch("/api/custom", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      setState(res.ok && data.ok ? "success" : "error");
      if (res.ok && data.ok) formEl.reset();
    } catch {
      setState("error");
    }
  };

  const selOpts = (arr) => arr.map(o => <option key={o.v} value={o.v}>{o.l}</option>);
  const produse = [{ v: "Tricou", l: ro ? "Tricou" : "T-shirt" }, { v: "Hoodie", l: "Hoodie" }];
  const culori = [{ v: "Alb", l: ro ? "Alb" : "White" }, { v: "Negru", l: ro ? "Negru" : "Black" }];
  const marimi = ["S", "M", "L", "XL", "XXL"].map(s => ({ v: s, l: s }));

  return (
    <section id="custom-form" style={{ ...secPad, paddingTop: "clamp(20px, 3vw, 40px)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h2 style={{ ...h2style, fontWeight: 300, fontSize: "clamp(26px, 4vw, 44px)", margin: "0 0 12px" }}>{ro ? "Trimite cererea custom" : "Send your custom request"}</h2>
        <p style={{ ...body, maxWidth: 560, margin: "0 0 32px" }}>
          {ro ? "Completează formularul de mai jos și atașează fișierul tău. Cererea va fi trimisă direct către echipa OVRthink." : "Fill in the form below and attach your file. The request goes straight to the OVRthink team."}
        </p>

        {state === "success" ? (
          <div style={{ border: `1px solid ${O}`, borderRadius: 10, padding: "34px 30px", background: "rgba(255,74,28,0.05)" }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 17, letterSpacing: 0.5, color: INK, margin: 0 }}>
              {ro ? "Cererea ta a fost trimisă. Revenim pe email cu confirmarea și detaliile de producție." : "Your request was sent. We'll reply by email with the confirmation and production details."}
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate={false}>
            <div className="ovr-cat" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div><label style={lbl}>{ro ? "Nume" : "Last name"} *</label><input className="ovr-input" name="nume" type="text" required style={field} /></div>
              <div><label style={lbl}>{ro ? "Prenume" : "First name"} *</label><input className="ovr-input" name="prenume" type="text" required style={field} /></div>
              <div><label style={lbl}>Email *</label><input className="ovr-input" name="email" type="email" required style={field} /></div>
              <div><label style={lbl}>{ro ? "Telefon" : "Phone"}</label><input className="ovr-input" name="telefon" type="tel" style={field} /></div>
              <div><label style={lbl}>{ro ? "Produs dorit" : "Product"} *</label><select className="ovr-input" name="produs" required style={field} defaultValue="Tricou">{selOpts(produse)}</select></div>
              <div><label style={lbl}>{ro ? "Culoare produs" : "Color"} *</label><select className="ovr-input" name="culoare" required style={field} defaultValue="Alb">{selOpts(culori)}</select></div>
              <div><label style={lbl}>{ro ? "Mărime" : "Size"} *</label><select className="ovr-input" name="marime" required style={field} defaultValue="M">{selOpts(marimi)}</select></div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>{ro ? "Descrie ideea ta" : "Describe your idea"}</label>
              <textarea className="ovr-input" name="descriere" rows={4} style={{ ...field, resize: "vertical" }}
                placeholder={ro ? "Scrie aici textul, ideea, poziționarea pe produs sau orice detaliu important." : "Write the text, idea, placement on the product or any important detail."} />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={lbl}>{ro ? "Încarcă fișierul (PNG)" : "Upload file (PNG)"} *</label>
              <label className="ovr-input" style={{ ...field, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#fff", background: O, padding: "8px 14px" }}>
                  {ro ? "Alege fișier" : "Choose file"}
                </span>
                <span style={{ color: fileName ? INK : "#a8a59c", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {fileName || (ro ? "Niciun fișier ales" : "No file chosen")}
                </span>
                <input name="file" type="file" accept=".png,image/png" required style={{ display: "none" }}
                  onChange={e => setFileName(e.target.files?.[0]?.name || "")} />
              </label>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8a877f", margin: "8px 0 0" }}>
                {ro ? "Acceptăm doar fișiere PNG, HD, recomandat 300 DPI, cu fundal transparent." : "We only accept PNG files, HD, recommended 300 DPI, transparent background."}
              </p>
            </div>

            <label style={{ display: "flex", gap: 12, alignItems: "flex-start", margin: "22px 0 26px", cursor: "pointer" }}>
              <input name="confirm" type="checkbox" required value="da" style={{ marginTop: 3, width: 16, height: 16, accentColor: O }} />
              <span style={{ ...body, fontSize: 13.5 }}>
                {ro ? "Confirm că fișierul trimis este PNG și am citit cerințele pentru print." : "I confirm the file is PNG and I have read the print requirements."}
              </span>
            </label>

            {state === "error" && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#b23410", margin: "0 0 18px" }}>
                {ro ? "Cererea nu a putut fi trimisă. Te rugăm să încerci din nou sau să ne contactezi direct." : "The request could not be sent. Please try again or contact us directly."}
              </p>
            )}

            <button type="submit" disabled={state === "sending"} className="ovr-cta" style={{
              fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 3, textTransform: "uppercase",
              padding: "16px 40px", cursor: state === "sending" ? "wait" : "pointer", border: "none", borderRadius: 0,
              background: O, color: "#fff", opacity: state === "sending" ? 0.7 : 1,
            }}>
              {state === "sending" ? (ro ? "Se trimite…" : "Sending…") : (ro ? "Trimite cererea" : "Send request")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function CustomPage({ lang }) {
  const ro = lang === "ro";
  return (
    <main className="ovr-rise">
      <CustomHero ro={ro} />
      <CustomSteps ro={ro} />
      <FileRequirements ro={ro} />
      <CustomRequestForm ro={ro} />
    </main>
  );
}
