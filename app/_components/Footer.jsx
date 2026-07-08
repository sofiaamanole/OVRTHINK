"use client";

/* Footer legal OVRTHINK — minimalist, 4 coloane. nav(key) = navigare internă (SPA). */

const O = "#FF4A1C";
const MUTED = "rgba(26,23,18,0.6)";

function FLink({ children, onClick, href }) {
  const style = {
    fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase",
    color: MUTED, textDecoration: "none", background: "transparent", border: "none", padding: 0,
    cursor: "pointer", textAlign: "left", display: "block", lineHeight: 2.1,
  };
  if (href) return <a className="ovr-flink" href={href} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>;
  return <button className="ovr-flink" onClick={onClick} style={style}>{children}</button>;
}

function Col({ title, children }) {
  return (
    <div>
      {title && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "#1a1712", marginBottom: 14 }}>{title}</div>}
      {children}
    </div>
  );
}

export default function Footer({ lang, nav, onShop }) {
  const ro = lang === "ro";
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,255,255,0.4)", padding: "clamp(40px, 5vw, 64px) 6vw 30px" }}>
      <div className="ovr-footgrid" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: "clamp(28px, 4vw, 56px)" }}>
        <Col>
          <img src="/brand/logo-black.png" alt="OVRTHINK" style={{ height: 20, width: "auto", display: "block", marginBottom: 16 }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: MUTED, lineHeight: 1.8, margin: 0, maxWidth: 260 }}>
            {ro ? "Streetwear minimalist. Croieli oversized. Detalii premium." : "Minimalist streetwear. Oversized cuts. Premium details."}
          </p>
        </Col>

        <Col title="Shop">
          <FLink onClick={() => onShop("tee")}>{ro ? "Tricouri" : "T-shirts"}</FLink>
          <FLink onClick={() => onShop("hoodie")}>Hoodie</FLink>
          <FLink onClick={() => nav("collections")}>{ro ? "Colecții" : "Collections"}</FLink>
          <FLink onClick={() => nav("custom")}>Custom</FLink>
        </Col>

        <Col title="Support">
          <FLink onClick={() => nav("contact")}>Contact</FLink>
          <FLink onClick={() => nav("livrare")}>{ro ? "Livrare și plată" : "Shipping & payment"}</FLink>
          <FLink onClick={() => nav("retururi")}>{ro ? "Retururi" : "Returns"}</FLink>
          <FLink onClick={() => nav("marimi")}>{ro ? "Ghid mărimi" : "Size guide"}</FLink>
          <FLink onClick={() => nav("ingrijire")}>{ro ? "Îngrijire produse" : "Product care"}</FLink>
          <FLink onClick={() => nav("faq")}>FAQ</FLink>
        </Col>

        <Col title="Legal">
          <FLink onClick={() => nav("termeni")}>{ro ? "Termeni și condiții" : "Terms & conditions"}</FLink>
          <FLink onClick={() => nav("confidentialitate")}>{ro ? "Politica de confidențialitate" : "Privacy policy"}</FLink>
          <FLink onClick={() => nav("cookies")}>{ro ? "Politica cookies" : "Cookie policy"}</FLink>
          <FLink href="https://anpc.ro/">ANPC</FLink>
          <FLink href="https://reclamatiisal.anpc.ro/">SAL ANPC</FLink>
        </Col>
      </div>

      <div style={{ maxWidth: 1180, margin: "clamp(32px, 4vw, 48px) auto 0", paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.07)",
        fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 1, color: "rgba(26,23,18,0.5)", lineHeight: 1.7 }}>
        © {year} OVRthink. {ro ? "Operat de" : "Operated by"} SC AESTHETIC STUDIO CREATOR SRL. {ro ? "Toate drepturile rezervate." : "All rights reserved."}
      </div>
    </footer>
  );
}
