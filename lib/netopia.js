/* ─────────────────────────────────────────────
   NETOPIA Payments — API v2 (hosted card flow)
   Docs: https://doc.netopia-payments.com/docs/payment-api/
   Sandbox spec: https://secure.sandbox.netopia-payments.com/spec

   Fluxul „hosted": trimitem comanda (fără date de card),
   Netopia răspunde cu un paymentURL, redirecționăm clientul
   pe pagina lor securizată. NU procesăm carduri pe site.
   ───────────────────────────────────────────── */

const SANDBOX_BASE = "https://secure.sandbox.netopia-payments.com";
const LIVE_BASE = "https://secure.netopia-payments.com";

export function netopiaConfigured() {
  return Boolean(process.env.NETOPIA_API_KEY && process.env.NETOPIA_POS_SIGNATURE);
}

function baseUrl() {
  // NETOPIA_LIVE=true → producție; altfel sandbox
  return process.env.NETOPIA_LIVE === "true" ? LIVE_BASE : SANDBOX_BASE;
}

// ISO country code numeric (642 = România) — Netopia cere cod numeric
const COUNTRY_RO = 642;

/**
 * Pornește o plată card la Netopia și întoarce paymentURL-ul de redirect.
 * @param {object} p
 * @param {string} p.orderID  identificator unic comandă
 * @param {number} p.amount   sumă (aceeași valută ca `currency`)
 * @param {string} p.currency RON | EUR | USD
 * @param {string} p.description
 * @param {object} p.billing  { email, phone, firstName, lastName, city, address, postalCode }
 * @param {Array}  [p.products]
 * @param {string} p.notifyUrl  IPN server-to-server
 * @param {string} p.redirectUrl unde revine clientul după plată
 * @param {string} [p.language] ro | en
 * @returns {Promise<{ok:boolean, paymentURL?:string, status?:any, raw?:any, error?:string}>}
 */
export async function startCardPayment(p) {
  if (!netopiaConfigured()) {
    return { ok: false, error: "NETOPIA_NOT_CONFIGURED" };
  }

  const body = {
    config: {
      notifyUrl: p.notifyUrl,
      redirectUrl: p.redirectUrl,
      language: p.language === "en" ? "en" : "ro",
    },
    payment: {
      options: { installments: 1, bonus: 0 },
      // fără `instrument` → Netopia servește pagina de card hosted
    },
    order: {
      posSignature: process.env.NETOPIA_POS_SIGNATURE,
      dateTime: p.dateTime, // ISO string, injectat de caller (fără Date.now în lib)
      description: p.description,
      orderID: p.orderID,
      amount: Number(p.amount.toFixed(2)),
      currency: p.currency,
      billing: {
        email: p.billing.email,
        phone: p.billing.phone || "",
        firstName: p.billing.firstName || "",
        lastName: p.billing.lastName || "",
        city: p.billing.city || "",
        country: COUNTRY_RO,
        state: p.billing.state || "",
        postalCode: p.billing.postalCode || "",
        details: p.billing.address || "",
      },
      shipping: {
        email: p.billing.email,
        phone: p.billing.phone || "",
        firstName: p.billing.firstName || "",
        lastName: p.billing.lastName || "",
        city: p.billing.city || "",
        country: COUNTRY_RO,
        state: p.billing.state || "",
        postalCode: p.billing.postalCode || "",
        details: p.billing.address || "",
      },
      products: p.products || [],
      installments: { selected: 0, available: [0] },
      data: {},
    },
  };

  let res, json;
  try {
    res = await fetch(`${baseUrl()}/payment/card/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NETOPIA_API_KEY,
      },
      body: JSON.stringify(body),
    });
    json = await res.json();
  } catch (e) {
    return { ok: false, error: `NETOPIA_NETWORK: ${e.message}` };
  }

  // Răspunsul hosted întoarce payment.paymentURL pentru redirect
  const paymentURL =
    json?.payment?.paymentURL ||
    json?.customerAction?.url ||
    json?.paymentURL;

  if (paymentURL) {
    return { ok: true, paymentURL, status: json?.payment?.status, raw: json };
  }

  const errMsg =
    json?.error?.message ||
    json?.message ||
    `Netopia HTTP ${res?.status} fără paymentURL`;
  return { ok: false, error: errMsg, raw: json };
}
