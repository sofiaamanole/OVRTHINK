import Link from "next/link";

export const metadata = {
  title: "OVRTHINK — Comandă",
};

export default async function ReturnPage({ searchParams }) {
  const sp = await searchParams;
  const order = sp?.order || null;

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#FAFAF8",
        color: "#141414",
        display: "grid",
        placeItems: "center",
        padding: "40px 24px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <img
          src="/brand/logo-black.png"
          alt="OVRTHINK"
          style={{ height: 26, width: "auto", display: "inline-block" }}
        />

        <div
          style={{
            marginTop: 40,
            fontFamily: "'Jost', sans-serif",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Îți mulțumim
        </div>
        <p style={{ fontSize: 13.5, color: "#8a877f", marginTop: 12, lineHeight: 1.6 }}>
          Comanda ta a fost înregistrată. Vei primi confirmarea și statusul plății pe email.
        </p>
        {order && (
          <div
            style={{
              marginTop: 20,
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "#a8a59c",
            }}
          >
            Comandă: {order}
          </div>
        )}

        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: 40,
            fontFamily: "'Jost', sans-serif",
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            padding: "16px 34px",
            background: "#141414",
            color: "#FAFAF8",
            textDecoration: "none",
          }}
        >
          Înapoi în Studio
        </Link>
      </div>
    </main>
  );
}
