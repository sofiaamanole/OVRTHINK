import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────
   IPN Netopia — notificare server-to-server.
   Netopia trimite aici statusul plății (POST JSON).
   Răspundem { errorCode: 0 } ca să confirmăm recepția.

   Statusuri uzuale payment.status:
     3  = plătit / confirmat
     5  = confirmat
     15 = 3-D Secure în așteptare
     12 = respins
   ───────────────────────────────────────────── */

// Statusuri considerate „plată reușită"
const PAID_STATUSES = new Set([3, 5]);

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    // Netopia poate trimite și form-encoded pe v1; acceptăm gracios
    try {
      const text = await req.text();
      body = { raw: text };
    } catch {
      body = null;
    }
  }

  const orderID = body?.order?.orderID || body?.orderID || "unknown";
  const status = Number(body?.payment?.status ?? body?.status ?? -1);
  const paid = PAID_STATUSES.has(status);

  // TODO(la conectarea credențialelor): verifică semnătura Netopia cu cheia
  // publică din contul de comerciant înainte de a marca comanda plătită.
  // TODO: persistă comanda + trimite email de confirmare (nevoie de DB/email).
  console.log(`[netopia/ipn] order=${orderID} status=${status} paid=${paid}`);

  // Netopia așteaptă confirmare de recepție
  return NextResponse.json({ errorCode: 0 });
}
