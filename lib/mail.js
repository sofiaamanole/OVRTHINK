/* Helper email via Resend REST (fără pachet). Mod DEMO cât timp RESEND_API_KEY nu e setat. */

export function resendConfigured() {
  return !!process.env.RESEND_API_KEY;
}

export async function sendResend({ to, subject, html, replyTo, attachments }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CUSTOM_REQUEST_FROM || "OVRTHINK <onboarding@resend.dev>";
  if (!key) {
    console.log("[mail][DEMO] email neconfigurat, nu s-a trimis:", { to, subject });
    return { ok: true, demo: true };
  }
  try {
    const body = { from, to: Array.isArray(to) ? to : [to], subject, html };
    if (replyTo) body.reply_to = replyTo;
    if (attachments) body.attachments = attachments;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[mail] Resend error:", res.status, detail);
      return { ok: false, error: "SEND_FAILED" };
    }
    return { ok: true };
  } catch (e) {
    console.error("[mail] exception:", e);
    return { ok: false, error: "SEND_FAILED" };
  }
}
