import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Keep under typical reverse-proxy limits (e.g. 60s) so the route returns JSON instead of 504. */
const RESEND_FETCH_TIMEOUT_MS = 12_000;

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function appOrigin(): string {
  const raw =
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "";
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function buildPasswordResetUrl(rawToken: string): string {
  const base = appOrigin();
  const u = new URL("/reset-password", `${base}/`);
  u.searchParams.set("token", rawToken);
  return u.toString();
}

export type SendPasswordResetResult = {
  /** True when Resend returned 2xx within the deadline, or dev fallback link is available. */
  delivered: boolean;
  /** Only in development when email is not configured. Never set in production. */
  devResetUrl?: string;
};

export function isPasswordResetEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/**
 * Sends reset email via Resend when `RESEND_API_KEY` is set.
 * Uses a bounded fetch timeout so the forgot-password route does not hang until a gateway 504.
 */
export async function sendPasswordResetEmail(params: {
  toEmail: string;
  resetUrl: string;
}): Promise<SendPasswordResetResult> {
  const { toEmail, resetUrl } = params;
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.PASSWORD_RESET_EMAIL_FROM?.trim() || "NurseNest <onboarding@resend.dev>";

  if (key) {
    const subject = "Reset your NurseNest password";
    const safeHref = escapeHtmlAttr(resetUrl);
    const html = `
      <p>You requested a password reset.</p>
      <p><a href="${safeHref}">Set a new password</a></p>
      <p>This link expires in one hour. If you did not request this, you can ignore this email.</p>
    `;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [toEmail],
          subject,
          html,
        }),
        signal: AbortSignal.timeout(RESEND_FETCH_TIMEOUT_MS),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        safeServerLog("auth", "password_reset_email_failed", {
          status: res.status,
          snippet: text.slice(0, 120),
        });
        return { delivered: false };
      }
      return { delivered: true };
    } catch (e) {
      const name = e instanceof Error ? e.name : "";
      const msg = e instanceof Error ? e.message : String(e);
      const timedOut =
        name === "TimeoutError" || name === "AbortError" || /aborted|timeout/i.test(msg);
      safeServerLog("auth", "password_reset_email_error", {
        name,
        timedOut,
        message: msg.slice(0, 200),
      });
      return { delivered: false };
    }
  }

  safeServerLog("auth", "password_reset_email_skipped", {
    reason: "no_resend_key",
    nodeEnv: process.env.NODE_ENV ?? "unknown",
  });

  if (process.env.NODE_ENV === "development") {
    return { delivered: true, devResetUrl: resetUrl };
  }

  return { delivered: false };
}
