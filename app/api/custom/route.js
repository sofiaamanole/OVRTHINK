import { NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const MAX_BYTES = 20 * 1024 * 1024; // 20MB

/* Primește cererea custom (multipart/form-data cu fișier PNG) și o trimite
   pe emailul echipei OVRTHINK. Folosește Resend prin REST API (fără pachet).
   Cât timp RESEND_API_KEY nu e setat, rulează în mod DEMO (logează, nu trimite). */
export async function POST(req) {
  let fd;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_FORM" }, { status: 400 });
  }

  const get = (k) => (fd.get(k) ?? "").toString().trim();
  const nume = get("nume");
  const prenume = get("prenume");
  const email = get("email");
  const telefon = get("telefon");
  const produs = get("produs");
  const culoare = get("culoare");
  const marime = get("marime");
  const descriere = get("descriere");
  const confirm = get("confirm");
  const file = fd.get("file");

  // ── validare pe server ──
  if (!nume || !prenume || !email || !produs || !culoare || !marime) {
    return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "INVALID_EMAIL" }, { status: 400 });
  }
  if (!confirm) {
    return NextResponse.json({ ok: false, error: "NOT_CONFIRMED" }, { status: 400 });
  }
  if (!file || typeof file === "string" || !file.name) {
    return NextResponse.json({ ok: false, error: "NO_FILE" }, { status: 400 });
  }
  if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) {
    return NextResponse.json({ ok: false, error: "NOT_PNG" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "FILE_TOO_LARGE" }, { status: 413 });
  }

  const to = process.env.ORDERS_EMAIL || process.env.CUSTOM_REQUEST_EMAIL || "orders@ovrthink.ro"; // cererile custom -> orders@
  const from = process.env.CUSTOM_REQUEST_FROM || "OVRTHINK <onboarding@resend.dev>";
  const subject = `Cerere custom OVRthink - ${nume} ${prenume}`;

  const rows = [
    ["Nume", nume], ["Prenume", prenume], ["Email", email], ["Telefon", telefon || "—"],
    ["Produs", produs], ["Culoare", culoare], ["Mărime", marime],
    ["Descriere idee", descriere || "—"], ["Fișier", `${file.name} (${Math.round(file.size / 1024)} KB)`],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1712">
      <h2 style="font-weight:400;letter-spacing:1px">Cerere custom OVRTHINK</h2>
      <table style="border-collapse:collapse">
        ${rows.map(([k, v]) => `<tr>
          <td style="padding:6px 14px 6px 0;color:#8a877f">${k}</td>
          <td style="padding:6px 0"><b>${String(v).replace(/</g, "&lt;")}</b></td></tr>`).join("")}
      </table>
    </div>`;

  // notificare internă WhatsApp pentru fiecare cerere custom
  await sendWhatsApp(`✏️ Cerere custom OVRthink\n${nume} ${prenume}\n${produs} · ${culoare} · ${marime}\n${email}`);

  const key = process.env.RESEND_API_KEY;

  // ── mod DEMO: fără cheie de email, doar logăm și confirmăm ──
  if (!key) {
    console.log("[custom][DEMO] cerere primită (email neconfigurat):", { nume, prenume, email, telefon, produs, culoare, marime, file: file.name });
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: email, subject, html,
        attachments: [{ filename: file.name, content: buf.toString("base64") }],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[custom] Resend error:", res.status, detail);
      return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[custom] exception:", e);
    return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 500 });
  }
}
