/* Persistență comenzi între /api/netopia/start și /api/netopia/ipn.
   Funcțiile serverless sunt stateless, așa că salvăm datele comenzii în
   Vercel Blob (privat), cheiate după orderID, și le recuperăm în IPN.
   Degradează grațios dacă BLOB_READ_WRITE_TOKEN nu e setat (nu persistă). */

const PREFIX = "orders/";

function blobConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function saveOrder(orderID, data) {
  if (!blobConfigured()) {
    console.log("[orders] Blob neconfigurat — comanda nu a fost persistată:", orderID);
    return { ok: false, skipped: true };
  }
  try {
    const { put } = await import("@vercel/blob");
    await put(`${PREFIX}${orderID}.json`, JSON.stringify(data), {
      access: "public",              // URL neg-hicibil (storeId random + orderID); ștearsă după email
      addRandomSuffix: false,
      contentType: "application/json",
      allowOverwrite: true,
    });
    return { ok: true };
  } catch (e) {
    console.error("[orders] saveOrder error:", e);
    return { ok: false, error: String(e) };
  }
}

export async function getOrder(orderID) {
  if (!blobConfigured()) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: `${PREFIX}${orderID}` });
    if (!blobs || blobs.length === 0) return null;
    const res = await fetch(blobs[0].url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("[orders] getOrder error:", e);
    return null;
  }
}

export async function deleteOrder(orderID) {
  if (!blobConfigured()) return;
  try {
    const { list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: `${PREFIX}${orderID}` });
    if (blobs && blobs.length) await del(blobs.map(b => b.url));
  } catch (e) {
    console.error("[orders] deleteOrder error:", e);
  }
}
