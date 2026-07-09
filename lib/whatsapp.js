/* Notificare WhatsApp internă (către telefonul propriu) via CallMeBot.
   Setup: trimite "I allow callmebot to send me messages" către +34 644 51 95 23
   pe WhatsApp → primești un apikey. Apoi setezi:
     WHATSAPP_PHONE  = numărul tău în format internațional, ex: 40712345678
     WHATSAPP_APIKEY = apikey-ul primit de la CallMeBot
   Fără ele, funcția nu face nimic (degradează grațios). */
export async function sendWhatsApp(text) {
  const phone = process.env.WHATSAPP_PHONE;
  const apikey = process.env.WHATSAPP_APIKEY;
  if (!phone || !apikey) {
    console.log("[whatsapp] neconfigurat — mesaj nesent:", text.slice(0, 60));
    return { ok: false, skipped: true };
  }
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      console.error("[whatsapp] CallMeBot error:", res.status);
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error("[whatsapp] exception:", e);
    return { ok: false };
  }
}
