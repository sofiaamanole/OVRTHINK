import { NextResponse } from "next/server";
import { startCardPayment, netopiaConfigured } from "@/lib/netopia";

export const dynamic = "force-dynamic";

function siteOrigin(req) {
  // preferă env explicit (setat pe Vercel), altfel derivă din request
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("host");
  return `${proto}://${host}`;
}

export async function POST(req) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_JSON" }, { status: 400 });
  }

  const { amount, currency, billing, products, language } = payload || {};

  if (!amount || amount <= 0) {
    return NextResponse.json({ ok: false, error: "INVALID_AMOUNT" }, { status: 400 });
  }
  if (!billing?.email) {
    return NextResponse.json({ ok: false, error: "MISSING_EMAIL" }, { status: 400 });
  }

  const origin = siteOrigin(req);
  const orderID = `OVR-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;

  // Netopia neconfigurat încă → mod DEMO: site-ul rămâne funcțional,
  // frontend-ul afișează confirmarea demo. Se activează plata reală
  // imediat ce sunt setate NETOPIA_API_KEY + NETOPIA_POS_SIGNATURE.
  if (!netopiaConfigured()) {
    return NextResponse.json({ ok: true, demo: true, orderID });
  }

  const result = await startCardPayment({
    orderID,
    amount,
    currency: currency || "RON",
    description: `Comandă OVRTHINK ${orderID}`,
    billing,
    products: products || [],
    language,
    dateTime: new Date().toISOString(),
    notifyUrl: `${origin}/api/netopia/ipn`,
    redirectUrl: `${origin}/checkout/return?order=${encodeURIComponent(orderID)}`,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error, orderID }, { status: 502 });
  }

  return NextResponse.json({ ok: true, paymentURL: result.paymentURL, orderID });
}
