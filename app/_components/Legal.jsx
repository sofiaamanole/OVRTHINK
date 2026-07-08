"use client";

import { useState, useEffect } from "react";

/* Pagini legale OVRTHINK — layout minimalist, conținut editabil, în limba română.
   TODO-urile (TODO_...) marchează informațiile care lipsesc. */

const O = "#FF4A1C";
const INK = "#1a1712";
const MUTED = "rgba(26,23,18,0.68)";

const body = { fontFamily: "'Inter', sans-serif", fontSize: 15, color: MUTED, lineHeight: 1.85 };

/* date operator — reutilizate în mai multe pagini */
const FIRMA = "SC AESTHETIC STUDIO CREATOR SRL";
function CompanyBlock() {
  return (
    <div style={{ ...body, fontSize: 14.5 }}>
      {FIRMA}<br />
      CUI: 45931173<br />
      Nr. Reg. Com.: J40/6657/2022<br />
      Adresă: BD Decebal nr. 12, Bl S7, Et 5, Ap 15, cod poștal 030967, România<br />
      Email: <Todo>TODO_CONTACT_EMAIL</Todo><br />
      Telefon: <Todo>TODO_PHONE</Todo>
    </div>
  );
}

function Todo({ children }) {
  return <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.88em", color: O, background: "rgba(255,74,28,0.09)", padding: "1px 6px", borderRadius: 4 }}>{children}</span>;
}
function Ext({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="ovr-flink" style={{ color: O, textDecoration: "none" }}>{children || href}</a>;
}
function P({ children }) { return <p style={{ ...body, margin: "0 0 14px" }}>{children}</p>; }
function UL({ items }) {
  return <ul style={{ ...body, margin: "0 0 14px", paddingLeft: 0, listStyle: "none" }}>
    {items.map((it, i) => <li key={i} style={{ display: "flex", gap: 10, marginBottom: 7 }}><span style={{ color: O }}>—</span><span>{it}</span></li>)}
  </ul>;
}
function Sec({ n, title, children }) {
  return (
    <section style={{ marginTop: 38 }}>
      <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(17px, 2.2vw, 21px)", letterSpacing: "0.02em", color: INK, margin: "0 0 12px" }}>
        {n ? <span style={{ color: O }}>{n}.</span> : null} {title}
      </h2>
      {children}
    </section>
  );
}

function useSeo(title, desc) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    let m = document.querySelector('meta[name="description"]');
    let created = false;
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); created = true; }
    const prevDesc = m.getAttribute("content");
    if (desc) m.setAttribute("content", desc);
    return () => { document.title = prev; if (created) m.remove(); else if (prevDesc != null) m.setAttribute("content", prevDesc); };
  }, [title, desc]);
}

function LegalPage({ title, subtitle, seoTitle, seoDesc, onHome, children }) {
  useSeo(seoTitle || `${title} | OVRthink`, seoDesc);
  return (
    <main className="ovr-rise" style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(34px, 5vw, 64px) 6vw clamp(60px, 8vw, 100px)" }}>
      <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: MUTED, marginBottom: 26 }}>
        <button onClick={onHome} className="ovr-flink" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", letterSpacing: "inherit", textTransform: "inherit", color: "inherit" }}>Acasă</button>
        <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>{title}
      </div>
      <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: "clamp(30px, 5.2vw, 56px)", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, lineHeight: 1 }}>{title}</h1>
      {subtitle && <p style={{ ...body, fontSize: 15.5, margin: "20px 0 0", maxWidth: 640 }}>{subtitle}</p>}
      <div style={{ marginTop: 20 }}>{children}</div>
    </main>
  );
}

/* ───────── TERMENI ȘI CONDIȚII ───────── */
function Termeni({ onHome }) {
  return (
    <LegalPage onHome={onHome} title="Termeni și condiții" seoTitle="Termeni și condiții | OVRthink"
      seoDesc="Termenii și condițiile de utilizare a site-ului OVRthink și de plasare a comenzilor."
      subtitle="Acești termeni reglementează utilizarea site-ului OVRthink și plasarea comenzilor prin magazinul online.">
      <Sec n="1" title="Informații despre comerciant">
        <P>Site-ul OVRthink este operat de {FIRMA}, persoană juridică română, cu sediul în BD Decebal nr. 12, Bl S7, Et 5, Ap 15, cod poștal 030967, România, înregistrată la Registrul Comerțului sub nr. J40/6657/2022, CUI 45931173.</P>
        <P>Email contact: <Todo>TODO_CONTACT_EMAIL</Todo><br />Telefon: <Todo>TODO_PHONE</Todo><br />Website: <Todo>TODO_DOMAIN</Todo></P>
      </Sec>
      <Sec n="2" title="Produse">
        <P>OVRthink comercializează produse de streetwear, inclusiv tricouri, hoodie-uri, produse din colecții sezoniere și produse custom/personalizate.</P>
        <P>Fotografiile produselor au caracter de prezentare. Pot exista diferențe minore de culoare, poziționare a printului sau textură în funcție de ecran, lotul de producție sau procesul tehnologic.</P>
      </Sec>
      <Sec n="3" title="Comenzi">
        <P>O comandă este considerată plasată după completarea formularului de comandă și confirmarea acesteia de către client. Ne rezervăm dreptul de a refuza sau anula comenzi în cazul unor erori tehnice, informații incomplete, suspiciuni de fraudă sau indisponibilitate produs.</P>
      </Sec>
      <Sec n="4" title="Prețuri și plată">
        <P>Prețurile afișate pe site sunt exprimate în lei și includ taxele aplicabile, cu excepția cazului în care este menționat altfel.</P>
        <P>Metode de plată acceptate: <Todo>TODO_PAYMENT_METHODS</Todo>.</P>
        <P>Costurile de livrare sunt afișate înainte de finalizarea comenzii.</P>
      </Sec>
      <Sec n="5" title="Livrare">
        <P>Livrarea se face prin curier, pe teritoriul României și/sau în alte țări disponibile la checkout.</P>
        <P>Termen estimativ de procesare: <Todo>TODO_PROCESSING_TIME</Todo>.<br />Termen estimativ de livrare: <Todo>TODO_DELIVERY_TIME</Todo>.<br />Curier: <Todo>TODO_COURIER</Todo>.</P>
      </Sec>
      <Sec n="6" title="Dreptul de retragere pentru produse standard">
        <P>Pentru produsele standard, nepurtate, nespălate, nedeteriorate și în aceeași stare în care au fost livrate, clientul are dreptul să se retragă din contract în termen de 14 zile calendaristice de la primirea produsului, fără a invoca un motiv.</P>
        <P>Pentru exercitarea dreptului de retragere, clientul trebuie să trimită o declarație clară la adresa de email <Todo>TODO_CONTACT_EMAIL</Todo>.</P>
        <P>Costurile directe de returnare sunt suportate de client, cu excepția cazului în care OVRthink decide altfel sau produsul este neconform.</P>
      </Sec>
      <Sec n="7" title="Excepție pentru produse custom/personalizate">
        <P>Produsele custom/personalizate, realizate după specificațiile clientului, cu text, grafică, animație, logo, fișier sau indicații furnizate de client, nu pot fi returnate prin exercitarea dreptului de retragere, cu excepția cazului în care produsul prezintă defecte de fabricație sau neconformități.</P>
        <P>Prin trimiterea unei cereri custom și confirmarea comenzii, clientul înțelege că produsul este realizat special pentru acesta.</P>
      </Sec>
      <Sec n="8" title="Garanție legală de conformitate">
        <P>Produsele beneficiază de garanția legală de conformitate conform legislației aplicabile. În cazul în care produsul primit este neconform, deteriorat sau diferit față de comanda confirmată, clientul trebuie să contacteze OVRthink la <Todo>TODO_CONTACT_EMAIL</Todo>, cu fotografii și detalii despre problemă.</P>
      </Sec>
      <Sec n="9" title="Produse custom și fișiere încărcate">
        <P>Pentru comenzile custom, clientul este responsabil pentru calitatea și dreptul de utilizare al fișierelor trimise. Fișierele trebuie să fie PNG, HD, recomandat 300 DPI, cu fundal transparent.</P>
        <P>OVRthink nu răspunde pentru rezultate slabe ale printului cauzate de fișiere pixelate, neclare, la rezoluție mică sau pregătite incorect.</P>
        <P>Clientul declară că are dreptul de a utiliza textele, imaginile, logo-urile sau grafica trimisă și că acestea nu încalcă drepturile unor terți.</P>
      </Sec>
      <Sec n="10" title="Proprietate intelectuală">
        <P>Logo-ul OVRthink, monograma, designul site-ului, imaginile, textele, grafica și elementele de branding aparțin OVRthink/{FIRMA} sau partenerilor săi și nu pot fi copiate, modificate, distribuite sau utilizate fără acord scris.</P>
      </Sec>
      <Sec n="11" title="Reclamații">
        <P>Pentru reclamații sau sesizări, clientul ne poate contacta la <Todo>TODO_CONTACT_EMAIL</Todo>.</P>
        <P>Consumatorii pot contacta Autoritatea Națională pentru Protecția Consumatorilor: <Ext href="https://anpc.ro/" /></P>
        <P>Pentru soluționarea alternativă a litigiilor, consumatorii pot accesa SAL ANPC: <Ext href="https://reclamatiisal.anpc.ro/" /></P>
      </Sec>
      <Sec n="12" title="Legea aplicabilă">
        <P>Acești termeni sunt guvernați de legislația română și de legislația europeană aplicabilă consumatorilor.</P>
      </Sec>
    </LegalPage>
  );
}

/* ───────── RETURURI ───────── */
function Retururi({ onHome }) {
  return (
    <LegalPage onHome={onHome} title="Retururi și rambursări" seoTitle="Retururi și rambursări | OVRthink"
      seoDesc="Politica de retururi și rambursări OVRthink: produse standard, produse custom, pași și costuri.">
      <Sec n="1" title="Produse standard">
        <P>Produsele standard pot fi returnate în termen de 14 zile calendaristice de la primire, dacă sunt nepurtate, nespălate, nedeteriorate și în aceeași stare în care au fost livrate.</P>
      </Sec>
      <Sec n="2" title="Produse care nu pot fi returnate">
        <P>Produsele custom/personalizate, realizate după specificațiile clientului, nu pot fi returnate prin simpla exercitare a dreptului de retragere.</P>
        <P>Această regulă nu afectează drepturile clientului în cazul unui defect de fabricație sau al unei neconformități.</P>
      </Sec>
      <Sec n="3" title="Cum faci retur">
        <UL items={[
          <>Trimite email la <Todo>TODO_CONTACT_EMAIL</Todo></>,
          "Include numele, numărul comenzii și motivul returului",
          "Așteaptă confirmarea returului",
          "Trimite produsul prin curier la adresa comunicată de echipă",
        ]} />
      </Sec>
      <Sec n="4" title="Cost retur">
        <P>Costul de returnare este suportat de client, cu excepția cazului în care produsul este defect sau neconform.</P>
      </Sec>
      <Sec n="5" title="Rambursare">
        <P>Rambursarea se face în termenul legal, folosind aceeași metodă de plată, cu excepția cazului în care clientul acceptă o altă metodă.</P>
      </Sec>
      <Sec n="6" title="Model formular de retragere">
        <div style={{ ...body, border: "1px solid rgba(0,0,0,0.14)", borderRadius: 8, padding: "22px 24px", background: "rgba(255,255,255,0.5)", whiteSpace: "pre-line", fontSize: 14 }}>
{`Către ${FIRMA},
Vă informez prin prezenta cu privire la retragerea mea din contractul privind comanda nr. ______, primită la data de ______.
Nume client:
Email:
Telefon:
Produs:
Data:
Semnătură (doar dacă formularul este trimis fizic):`}
        </div>
      </Sec>
    </LegalPage>
  );
}

/* ───────── POLITICA DE CONFIDENȚIALITATE ───────── */
function Confidentialitate({ onHome }) {
  return (
    <LegalPage onHome={onHome} title="Politica de confidențialitate" seoTitle="Politica de confidențialitate | OVRthink"
      seoDesc="Cum colectează și prelucrează OVRthink datele personale ale utilizatorilor."
      subtitle={`Această politică explică modul în care ${FIRMA}, operatorul site-ului OVRthink, colectează și prelucrează datele personale ale utilizatorilor.`}>
      <Sec n="1" title="Operatorul datelor"><CompanyBlock /></Sec>
      <Sec n="2" title="Ce date colectăm">
        <UL items={["nume și prenume", "email", "telefon", "adresă de livrare/facturare", "date despre comandă",
          "date de plată procesate prin furnizorul de plată, fără a stoca date complete de card", "fișiere încărcate pentru cereri custom",
          "mesaje trimise prin formulare", "date tehnice: IP, browser, dispozitiv, cookies"]} />
      </Sec>
      <Sec n="3" title="Scopurile prelucrării">
        <UL items={["procesarea comenzilor", "livrarea produselor", "comunicarea cu clientul", "gestionarea retururilor și reclamațiilor",
          "procesarea cererilor custom", "emiterea documentelor fiscale", "securitatea site-ului", "marketing/newsletter, doar cu consimțământ",
          "analiză trafic, doar unde este cazul și cu consimțământ pentru cookies non-esențiale"]} />
      </Sec>
      <Sec n="4" title="Temeiuri legale">
        <UL items={["executarea contractului", "obligație legală", "interes legitim", "consimțământ pentru newsletter/cookies non-esențiale"]} />
      </Sec>
      <Sec n="5" title="Furnizori și împuterniciți">
        <P>Putem transmite date către furnizori necesari pentru funcționarea magazinului: servicii de hosting, procesatori de plată, curieri, contabilitate, email, servicii IT, analytics sau marketing, după caz.</P>
      </Sec>
      <Sec n="6" title="Durata păstrării datelor">
        <P>Datele sunt păstrate atât timp cât este necesar pentru scopurile indicate, pentru îndeplinirea obligațiilor legale sau pentru apărarea drepturilor noastre.</P>
      </Sec>
      <Sec n="7" title="Drepturile utilizatorului">
        <UL items={["dreptul de acces", "dreptul la rectificare", "dreptul la ștergere", "dreptul la restricționare",
          "dreptul la opoziție", "dreptul la portabilitate", "dreptul de retragere a consimțământului", "dreptul de a depune plângere la ANSPDCP"]} />
        <P>Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal: <Ext href="https://www.dataprotection.ro/" /></P>
      </Sec>
      <Sec n="8" title="Securitate">
        <P>Luăm măsuri tehnice și organizatorice rezonabile pentru protejarea datelor personale, însă nicio metodă de transmitere prin internet nu este complet lipsită de riscuri.</P>
      </Sec>
    </LegalPage>
  );
}

/* ───────── POLITICA COOKIES ───────── */
function Cookies({ onHome }) {
  return (
    <LegalPage onHome={onHome} title="Politica cookies" seoTitle="Politica cookies | OVRthink"
      seoDesc="Ce sunt cookies, ce tipuri folosim și cum îți poți gestiona consimțământul pe OVRthink.">
      <Sec n="1" title="Ce sunt cookies">
        <P>Cookies sunt fișiere mici stocate pe dispozitivul utilizatorului pentru a permite funcționarea site-ului, îmbunătățirea experienței, analiză sau marketing.</P>
      </Sec>
      <Sec n="2" title="Tipuri de cookies">
        <UL items={["cookies necesare: coș, sesiune, securitate, funcționarea site-ului", "cookies de preferințe: limbă, monedă, setări",
          "cookies de analiză: trafic, performanță", "cookies de marketing: reclame, pixel, campanii"]} />
      </Sec>
      <Sec n="3" title="Consimțământ">
        <P>Cookies non-esențiale, precum cele de analiză sau marketing, vor fi utilizate doar după acordul utilizatorului, dacă sunt implementate pe site.</P>
      </Sec>
      <Sec n="4" title="Retragerea consimțământului">
        <P>Utilizatorul poate modifica sau retrage consimțământul pentru cookies din setările bannerului cookies sau din browser.</P>
        {/* TODO: conectează politica cookies cu sistemul real de cookie consent folosit pe site. */}
      </Sec>
    </LegalPage>
  );
}

/* ───────── LIVRARE ȘI PLATĂ ───────── */
function Livrare({ onHome }) {
  return (
    <LegalPage onHome={onHome} title="Livrare și plată" seoTitle="Livrare și plată | OVRthink"
      seoDesc="Informații despre livrare, costuri și metode de plată pentru comenzile OVRthink.">
      <Sec n="1" title="Livrare">
        <P>Comenzile OVRthink sunt procesate în termen de <Todo>TODO_PROCESSING_TIME</Todo> și livrate prin <Todo>TODO_COURIER</Todo>.</P>
        <P>Termen estimativ de livrare: <Todo>TODO_DELIVERY_TIME</Todo>.</P>
      </Sec>
      <Sec n="2" title="Cost livrare">
        <P>Costul livrării este afișat înainte de finalizarea comenzii.</P>
        <P>Cost standard livrare: <Todo>TODO_SHIPPING_COST</Todo>.</P>
      </Sec>
      <Sec n="3" title="Plată">
        <P>Metode de plată disponibile: <Todo>TODO_PAYMENT_METHODS</Todo>.</P>
      </Sec>
      <Sec n="4" title="Produse custom">
        <P>Produsele custom pot necesita timp suplimentar de procesare, în funcție de complexitatea fișierului și confirmarea designului.</P>
      </Sec>
    </LegalPage>
  );
}

/* ───────── CONTACT ───────── */
function ContactForm() {
  const [state, setState] = useState("idle");
  const onSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = { nume: f.get("nume"), email: f.get("email"), subiect: f.get("subiect"), mesaj: f.get("mesaj") };
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const d = await res.json().catch(() => ({}));
      setState(res.ok && d.ok ? "success" : "error");
      if (res.ok && d.ok) e.target.reset && e.target.reset();
    } catch { setState("error"); }
  };
  const field = { width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 14.5, padding: "13px 15px", border: "1px solid rgba(0,0,0,0.2)", borderRadius: 0, background: "rgba(255,255,255,0.7)", color: INK };
  const lbl = { fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#8a877f", marginBottom: 8, display: "block" };
  if (state === "success") return <p style={{ ...body, color: O }}>Mesajul tău a fost trimis. Revenim cât mai curând.</p>;
  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 18 }}><label style={lbl}>Nume *</label><input className="ovr-input" name="nume" required style={field} /></div>
      <div style={{ marginBottom: 18 }}><label style={lbl}>Email *</label><input className="ovr-input" name="email" type="email" required style={field} /></div>
      <div style={{ marginBottom: 18 }}><label style={lbl}>Subiect</label><input className="ovr-input" name="subiect" style={field} /></div>
      <div style={{ marginBottom: 18 }}><label style={lbl}>Mesaj *</label><textarea className="ovr-input" name="mesaj" rows={5} required style={{ ...field, resize: "vertical" }} /></div>
      {state === "error" && <p style={{ ...body, color: "#b23410", fontSize: 14 }}>Mesajul nu a putut fi trimis. Încearcă din nou sau scrie-ne direct pe email.</p>}
      <button type="submit" disabled={state === "sending"} className="ovr-cta" style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", padding: "15px 36px", cursor: "pointer", border: "none", background: O, color: "#fff", opacity: state === "sending" ? 0.7 : 1 }}>
        {state === "sending" ? "Se trimite…" : "Trimite mesajul"}
      </button>
    </form>
  );
}
function Contact({ onHome }) {
  return (
    <LegalPage onHome={onHome} title="Contact" seoTitle="Contact | OVRthink" seoDesc="Contactează OVRthink pentru comenzi, retururi, produse custom sau întrebări.">
      <P>Pentru comenzi, retururi, produse custom sau întrebări despre OVRthink, ne poți contacta folosind datele de mai jos.</P>
      <Sec title="Date firmă"><CompanyBlock /></Sec>
      <Sec title="Trimite-ne un mesaj"><ContactForm /></Sec>
    </LegalPage>
  );
}

/* ───────── FAQ ───────── */
function Faq({ onHome }) {
  const qa = [
    ["În cât timp primesc comanda?", <>Termenul estimativ este <Todo>TODO_DELIVERY_TIME</Todo> după procesare.</>],
    ["Pot returna produsul?", "Produsele standard pot fi returnate în 14 zile dacă sunt nepurtate, nespălate și nedeteriorate. Produsele custom nu pot fi returnate decât dacă au defecte sau neconformități."],
    ["Pot personaliza un tricou sau hoodie?", "Da. Intră în pagina Custom, trimite ideea și fișierul PNG, iar echipa OVRthink revine cu detalii."],
    ["Ce format trebuie să aibă fișierul custom?", "PNG, HD, recomandat 300 DPI, cu fundal transparent."],
    ["Cum aleg mărimea?", "Consultă pagina Ghid mărimi înainte de comandă."],
    ["Cum se spală produsele?", "Recomandăm spălarea pe dos, la temperatură joasă, fără uscător automat și fără călcare directă pe print."],
  ];
  return (
    <LegalPage onHome={onHome} title="Întrebări frecvente" seoTitle="FAQ | OVRthink" seoDesc="Răspunsuri la întrebările frecvente despre comenzi, retururi, produse custom și îngrijire OVRthink.">
      {qa.map(([q, a], i) => (
        <div key={i} style={{ borderTop: "1px solid rgba(0,0,0,0.1)", padding: "22px 0" }}>
          <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: 17, letterSpacing: "0.02em", color: INK, margin: "0 0 8px" }}>{q}</h2>
          <p style={{ ...body, fontSize: 14.5, margin: 0 }}>{a}</p>
        </div>
      ))}
    </LegalPage>
  );
}

/* ───────── GHID MĂRIMI ───────── */
function SizeTable({ title }) {
  const rows = [["Lungime", "TODO"], ["Lățime piept", "TODO"], ["Lungime mânecă", "TODO"]];
  const sizes = ["S", "M", "L", "XL", "XXL"];
  return (
    <div style={{ marginTop: 8, overflowX: "auto" }}>
      <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, letterSpacing: 1, marginBottom: 10 }}>{title}</div>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480, ...body, fontSize: 13.5 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.14)", fontFamily: "'Jost',sans-serif", fontWeight: 400, color: INK }}></th>
            {sizes.map(s => <th key={s} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.14)", fontFamily: "'Jost',sans-serif", fontWeight: 400, color: INK }}>{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(([r]) => (
            <tr key={r}>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{r}</td>
              {sizes.map(s => <td key={s} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}><Todo>TODO</Todo></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Marimi({ onHome }) {
  return (
    <LegalPage onHome={onHome} title="Ghid mărimi" seoTitle="Ghid mărimi | OVRthink" seoDesc="Ghid de mărimi orientativ pentru tricourile și hoodie-urile OVRthink.">
      <P>Măsurătorile sunt orientative. Pentru fit oversized, alege mărimea obișnuită. Pentru un fit mai relaxat, poți alege o mărime mai mare.</P>
      <Sec title="Tricou"><SizeTable title="Tricou (cm)" /></Sec>
      <Sec title="Hoodie"><SizeTable title="Hoodie (cm)" /></Sec>
    </LegalPage>
  );
}

/* ───────── ÎNGRIJIRE PRODUSE ───────── */
function Ingrijire({ onHome }) {
  return (
    <LegalPage onHome={onHome} title="Îngrijire produse" seoTitle="Îngrijire produse | OVRthink" seoDesc="Instrucțiuni de spălare și întreținere pentru produsele OVRthink.">
      <P>Pentru a păstra calitatea materialului și a printului, respectă instrucțiunile de întreținere.</P>
      <UL items={["Spală produsul pe dos", "Spală la maximum 30°C", "Nu folosi înălbitor", "Nu usca în uscător automat",
        "Nu călca direct pe print", "Nu curăța chimic", "Pentru produse custom/DTF, evită frecarea agresivă a zonei printate"]} />
    </LegalPage>
  );
}

export const LEGAL_KEYS = ["termeni", "confidentialitate", "cookies", "retururi", "livrare", "contact", "faq", "marimi", "ingrijire"];

export function LegalRouter({ page, onHome }) {
  const map = {
    termeni: Termeni, confidentialitate: Confidentialitate, cookies: Cookies, retururi: Retururi,
    livrare: Livrare, contact: Contact, faq: Faq, marimi: Marimi, ingrijire: Ingrijire,
  };
  const Comp = map[page];
  return Comp ? <Comp onHome={onHome} /> : null;
}
