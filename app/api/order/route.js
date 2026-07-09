import { NextResponse } from "next/server";
import { sendResend } from "@/lib/mail";
import { sendWhatsApp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────
   Comandă RAMBURS (plata la livrare) — fără Netopia.
   Primește comanda din checkout, trimite:
   (1) email cu detaliile către ORDERS_EMAIL,
   (2) confirmare către client (în limba comenzii),
   (3) notificare internă WhatsApp.
   Se folosește cât timp plata cu cardul (Netopia) nu e activă.
   ───────────────────────────────────────────── */

const esc = (s) => String(s ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = (v, sym) => `${v} ${sym || "lei"}`;

function itemsTable(order) {
  if (!order?.items?.length) return "";
  const rows = order.items.map(it => `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #eee">${esc(it.name)} · ${esc(it.product)}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee">${esc(it.color)} / ${esc(it.size)}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:center">${esc(it.qty)}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right">${fmt(it.total, order.symbol)}</td>
    </tr>`).join("");
  return `<table style="border-collapse:collapse;width:100%;font-size:14px;margin:8px 0 14px">
    <thead><tr>
      <th style="text-align:left;padding:8px 10px;border-bottom:2px solid #1a1712">Produs</th>
      <th style="text-align:left;padding:8px 10px;border-bottom:2px solid #1a1712">Culoare / Mărime</th>
      <th style="padding:8px 10px;border-bottom:2px solid #1a1712">Cant.</th>
      <th style="text-align:right;padding:8px 10px;border-bottom:2px solid #1a1712">Total</th>
    </tr></thead><tbody>${rows}</tbody></table>`;
}

function totalsBlock(order) {
  if (!order) return "";
  const sym = order.symbol;
  return `<table style="font-size:14px;margin-top:6px">
    <tr><td style="padding:3px 12px 3px 0;color:#777">Subtotal</td><td style="text-align:right">${fmt(order.subtotal, sym)}</td></tr>
    <tr><td style="padding:3px 12px 3px 0;color:#777">Livrare${order.shippingMethod ? " · " + esc(order.shippingMethod) : ""}</td><td style="text-align:right">${fmt(order.shipping, sym)}</td></tr>
    <tr><td style="padding:6px 12px 3px 0;font-weight:bold">Total (ramburs)</td><td style="text-align:right;font-weight:bold">${fmt(order.total, sym)}</td></tr>
  </table>`;
}

function merchantHtml(orderID, billing, order) {
  const b = billing || {};
  return `<div style="font-family:Arial,sans-serif;color:#1a1712">
    <h2 style="font-weight:400">Comandă nouă — RAMBURS — ${esc(orderID)}</h2>
    <p style="font-size:14px;background:#fff3ee;border:1px solid #ffd3c4;border-radius:6px;padding:8px 12px;display:inline-block">
      💵 Plată: <b>RAMBURS la livrare</b></p>
    ${itemsTable(order)}
    ${totalsBlock(order)}
    <h3 style="font-weight:400;margin-top:22px">Client &amp; livrare</h3>
    <p style="font-size:14px;line-height:1.7;margin:0">
      ${esc([b.firstName, b.lastName].filter(Boolean).join(" "))}<br>
      ${esc(b.email)}${b.phone ? " · " + esc(b.phone) : ""}<br>
      ${esc(b.address)}${b.city ? ", " + esc(b.city) : ""}${b.state ? ", " + esc(b.state) : ""}${b.postalCode ? " " + esc(b.postalCode) : ""}
    </p>
  </div>`;
}

function clientHtml(orderID, language, order) {
  const ro = (language || "ro") === "ro";
  const t = ro ? {
    h: "Îți mulțumim pentru comandă!",
    sub: `Comanda ta <b>${esc(orderID)}</b> a fost înregistrată.`,
    pay: "Plata se face <b>ramburs</b> (cash sau card la curier), la primirea coletului.",
    detalii: "Detaliile comenzii",
    info: "Revenim în curând cu detaliile de livrare. Pentru orice întrebare, scrie-ne la",
  } : {
    h: "Thank you for your order!",
    sub: `Your order <b>${esc(orderID)}</b> has been registered.`,
    pay: "Payment is <b>cash on delivery</b> (cash or card to the courier), when you receive the parcel.",
    detalii: "Order details",
    info: "We'll follow up shortly with shipping details. For any question, write us at",
  };
  return `<div style="font-family:Arial,sans-serif;color:#1a1712;max-width:560px">
    <h2 style="font-weight:400">${t.h}</h2>
    <p style="font-size:15px">${t.sub}</p>
    <p style="font-size:14px;background:#fff3ee;border:1px solid #ffd3c4;border-radius:6px;padding:10px 14px">💵 ${t.pay}</p>
    <h3 style="font-weight:400;margin-top:18px">${t.detalii}</h3>
    ${itemsTable(order)}
    ${totalsBlock(order)}
    <p style="font-size:13px;color:#777;margin-top:20px">${t.info} <a href="mailto:contact@ovrthink.ro" style="color:#FF4A1C">contact@ovrthink.ro</a>.</p>
    <p style="font-size:12px;color:#aaa;margin-top:16px">OVRthink · SC AESTHETIC STUDIO CREATOR SRL</p>
  </div>`;
}

export async function POST(req) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_JSON" }, { status: 400 });
  }

  const { billing, order, language } = payload || {};
  if (!billing?.email) {
    return NextResponse.json({ ok: false, error: "MISSING_EMAIL" }, { status: 400 });
  }
  if (!order?.items?.length) {
    return NextResponse.json({ ok: false, error: "EMPTY_ORDER" }, { status: 400 });
  }

  const orderID = `OVR-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
  const ordersEmail = process.env.ORDERS_EMAIL || process.env.CUSTOM_REQUEST_EMAIL || "orders@ovrthink.ro";
  const ro = (language || "ro") === "ro";

  // 1) email comerciant — toate detaliile + plată ramburs
  await sendResend({
    to: ordersEmail,
    replyTo: billing.email,
    subject: `Comandă OVRthink ${orderID} — RAMBURS`,
    html: merchantHtml(orderID, billing, order),
  });

  // 2) confirmare client — în limba comenzii
  await sendResend({
    to: billing.email,
    subject: ro ? `Confirmare comandă OVRthink ${orderID}` : `OVRthink order confirmation ${orderID}`,
    html: clientHtml(orderID, language, order),
  });

  // 3) notificare internă WhatsApp
  const clientName = [billing.firstName, billing.lastName].filter(Boolean).join(" ");
  const total = `${order.total} ${order.symbol || "lei"}`;
  const nItems = order.items.reduce((a, i) => a + (i.qty || 0), 0);
  await sendWhatsApp(`🛒 Comanda noua OVRthink (RAMBURS) ${orderID}\nTotal: ${total}\nClient: ${clientName}\nProduse: ${nItems}`);

  return NextResponse.json({ ok: true, orderID });
}
