import { appOriginForEmail } from "@/lib/email/app-origin";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { runWithCircuitBreaker } from "@/lib/server/circuit-breaker";

export type SendTransactionalEmailResult = { ok: boolean; skippedReason?: string };

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/**
 * Sends HTML email via Resend when RESEND_API_KEY is set. Same transport as password reset.
 */
export async function sendTransactionalEmailHtml(params: {
  to: string;
  subject: string;
  html: string;
  /** Optional plain-text part for clients that strip HTML */
  text?: string;
}): Promise<SendTransactionalEmailResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RETENTION_EMAIL_FROM?.trim() ||
    process.env.PASSWORD_RESET_EMAIL_FROM?.trim() ||
    "NurseNest <onboarding@resend.dev>";

  if (!key) {
    safeServerLog("email", "transactional_skipped", { reason: "no_resend_key", subject: params.subject.slice(0, 80) });
    return { ok: false, skippedReason: "no_resend_key" };
  }

  try {
    return await runWithCircuitBreaker<SendTransactionalEmailResult>(
      "email",
      async () => {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [params.to],
            subject: params.subject,
            html: params.html,
            ...(params.text ? { text: params.text } : {}),
          }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          safeServerLog("email", "transactional_failed", {
            status: res.status,
            snippet: text.slice(0, 120),
            subject: params.subject.slice(0, 80),
          });
          throw new Error(`resend_http_${res.status}`);
        }
        return { ok: true as const };
      },
      () => {
        safeServerLog("email", "transactional_skipped", { reason: "circuit_open", subject: params.subject.slice(0, 80) });
        return { ok: false as const, skippedReason: "circuit_open" as const };
      },
    );
  } catch (e) {
    safeServerLog("email", "transactional_error", { message: String(e).slice(0, 200) });
    return { ok: false, skippedReason: "network" };
  }
}

export function htmlEmailShell(title: string, bodyHtml: string): string {
  const safeTitle = escapeHtmlAttr(title);
  const origin = appOriginForEmail();
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${safeTitle}</title></head><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:560px;margin:0 auto;padding:16px;">${bodyHtml}<p style="margin-top:24px;font-size:12px;color:#666;">You receive study emails because you have a NurseNest account. <a href="${escapeHtmlAttr(`${origin}/app`)}">Open the app</a>.</p></body></html>`;
}
