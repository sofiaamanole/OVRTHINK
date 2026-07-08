import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* Formular de contact -> email către echipa OVRTHINK (Resend, REST).
   Mod DEMO cât timp RESEND_API_KEY nu e setat. */
export async function POST(req) {
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_JSON" }, { status: 400 });
  }
  const nume = (data.nume || "").toString().trim();
  const email = (data.email || "").toString().trim();
  const subiect = (data.subiect || "").toString().trim();
  const mesaj = (data.mesaj || "").toString().trim();

  if (!nume || !email || !mesaj) {
    return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "INVALID_EMAIL" }, { status: 400 });
  }

  const to = process.env.CUSTOM_REQUEST_EMAIL || "contact@ovrthink.ro"; // TODO: email oficial
  const from = process.env.CUSTOM_REQUEST_FROM || "OVRTHINK <onboarding@resend.dev>";
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.log("[contact][DEMO] mesaj (email neconfigurat):", { nume, email, subiect });
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: email,
        subject: `Contact OVRthink - ${subiect || nume}`,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1712">
          <p><b>Nume:</b> ${nume}</p><p><b>Email:</b> ${email}</p>
          <p><b>Subiect:</b> ${(subiect || "—").replace(/</g, "&lt;")}</p>
          <p><b>Mesaj:</b><br>${mesaj.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p></div>`,
      }),
    });
    if (!res.ok) return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 500 });
  }
}
