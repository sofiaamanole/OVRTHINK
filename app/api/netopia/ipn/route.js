import { NextResponse } from "next/server";
import { getOrder, deleteOrder } from "@/lib/orders";
import { sendResend } from "@/lib/mail";

export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────
   IPN Netopia — notificare server-to-server.
   Pe status „plătit" (3 sau 5): încarcă comanda persistată și trimite
   (1) email cu detaliile comenzii către ORDERS_EMAIL și
   (2) email de confirmare către client (în limba comenzii).
   Blob-ul comenzii se șterge după trimitere (idempotență la IPN duplicat).

   Statusuri: 3/5 = plătit · 15 = 3-DS în așteptare · 12 = respins
   ───────────────────────────────────────────── */
const PAID_STATUSES = new Set([3, 5]);

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
    <tr><td style="padding:6px 12px 3px 0;font-weight:bold">Total</td><td style="text-align:right;font-weight:bold">${fmt(order.total, sym)}</td></tr>
  </table>`;
}

function merchantHtml(orderID, saved) {
  const b = saved?.billing || {};
  const order = saved?.order;
  return `<div style="font-family:Arial,sans-serif;color:#1a1712">
    <h2 style="font-weight:400">Comandă nouă plătită — ${esc(orderID)}</h2>
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

function clientHtml(orderID, saved) {
  const ro = (saved?.language || "ro") === "ro";
  const order = saved?.order;
  const t = ro ? {
    h: "Îți mulțumim pentru comandă!", sub: `Comanda ta <b>${esc(orderID)}</b> a fost confirmată și plătită.`,
    detalii: "Detaliile comenzii", info: "Revenim în curând cu detaliile de livrare. Pentru orice întrebare, scrie-ne la",
  } : {
    h: "Thank you for your order!", sub: `Your order <b>${esc(orderID)}</b> has been confirmed and paid.`,
    detalii: "Order details", info: "We'll follow up shortly with shipping details. For any question, write us at",
  };
  return `<div style="font-family:Arial,sans-serif;color:#1a1712;max-width:560px">
    <h2 style="font-weight:400">${t.h}</h2>
    <p style="font-size:15px">${t.sub}</p>
    <h3 style="font-weight:400;margin-top:18px">${t.detalii}</h3>
    ${itemsTable(order)}
    ${totalsBlock(order)}
    <p style="font-size:13px;color:#777;margin-top:20px">${t.info} <a href="mailto:contact@ovrthink.ro" style="color:#FF4A1C">contact@ovrthink.ro</a>.</p>
    <p style="font-size:12px;color:#aaa;margin-top:16px">OVRthink · SC AESTHETIC STUDIO CREATOR SRL</p>
  </div>`;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    try { body = { raw: await req.text() }; } catch { body = null; }
  }

  const orderID = body?.order?.orderID || body?.orderID || "unknown";
  const status = Number(body?.payment?.status ?? body?.status ?? -1);
  const paid = PAID_STATUSES.has(status);

  // TODO(la conectarea credențialelor): verifică semnătura Netopia cu cheia
  // publică din contul de comerciant înainte de a marca comanda plătită.
  console.log(`[netopia/ipn] order=${orderID} status=${status} paid=${paid}`);

  if (paid && orderID !== "unknown") {
    const ordersEmail = process.env.ORDERS_EMAIL || process.env.CUSTOM_REQUEST_EMAIL || "orders@ovrthink.ro";
    const saved = await getOrder(orderID);
    if (saved) {
      // 1) email comerciant — toate detaliile comenzii
      await sendResend({
        to: ordersEmail,
        replyTo: saved.billing?.email,
        subject: `Comandă OVRthink ${orderID} — plătită`,
        html: merchantHtml(orderID, saved),
      });
      // 2) email confirmare client — în limba comenzii
      if (saved.billing?.email) {
        const ro = (saved.language || "ro") === "ro";
        await sendResend({
          to: saved.billing.email,
          subject: ro ? `Confirmare comandă OVRthink ${orderID}` : `OVRthink order confirmation ${orderID}`,
          html: clientHtml(orderID, saved),
        });
      }
      // idempotență: ștergem comanda ca IPN-urile duplicate să nu retrimită
      await deleteOrder(orderID);
    } else {
      // fallback: fără date persistate (Blob neconfigurat sau deja procesat) — notificare minimală
      await sendResend({
        to: ordersEmail,
        subject: `Comandă OVRthink ${orderID} — plătită`,
        html: `<div style="font-family:Arial,sans-serif">Comanda <b>${esc(orderID)}</b> a fost plătită (status ${status}). Detaliile complete nu au fost găsite — verifică în panoul Netopia.</div>`,
      });
    }
  }

  // Netopia așteaptă confirmare de recepție
  return NextResponse.json({ errorCode: 0 });
}
