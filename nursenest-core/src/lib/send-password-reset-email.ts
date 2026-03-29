import { safeServerLog } from "@/lib/observability/safe-server-log";

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
  emailAttempted: boolean;
  /** Only in development when email is not configured. Never set in production. */
  devResetUrl?: string;
};

/**
 * Sends reset email via Resend when `RESEND_API_KEY` is set.
 * Production: never returns `devResetUrl`. Does not log raw tokens.
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
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        safeServerLog("auth", "password_reset_email_failed", {
          status: res.status,
          snippet: text.slice(0, 120),
        });
        return { emailAttempted: true };
      }
      return { emailAttempted: true };
    } catch (e) {
      safeServerLog("auth", "password_reset_email_error", { message: String(e).slice(0, 200) });
      return { emailAttempted: true };
    }
  }

  safeServerLog("auth", "password_reset_email_skipped", {
    reason: "no_resend_key",
    nodeEnv: process.env.NODE_ENV ?? "unknown",
  });

  if (process.env.NODE_ENV === "development") {
    return { emailAttempted: false, devResetUrl: resetUrl };
  }

  return { emailAttempted: false };
}
