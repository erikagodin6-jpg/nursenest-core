"use client";

import { useCallback, useState } from "react";
import { Mail } from "lucide-react";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";
import { AuthField, AuthInput, AuthTextLink } from "@/components/auth/auth-experience/auth-primitives";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { trackClientEvent } from "@/lib/observability/posthog-client";

export type AuthVerifyEmailPendingProps = {
  email: string | null;
  loginHref: string;
  callbackUrl: string | null;
};

/**
 * Figma 102:2 — calm inbox guidance; resend without exposing verification mechanics.
 */
export function AuthVerifyEmailPending({ email, loginHref, callbackUrl }: AuthVerifyEmailPendingProps) {
  const { t } = useMarketingI18n();
  const [address, setAddress] = useState(email ?? "");
  const [sending, setSending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resend = useCallback(async () => {
    const trimmed = address.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Unable to resend right now. Try again shortly.");
        return;
      }
      setResent(true);
      trackClientEvent("verification_email_resent", { surface: "verify-email" });
    } catch {
      setError("Unable to resend right now. Try again shortly.");
    } finally {
      setSending(false);
    }
  }, [address, sending, t]);

  return (
    <div className="nn-auth-verify-pending" data-nn-auth-verify-pending>
      <div className="nn-auth-verify-pending__icon" aria-hidden>
        <Mail className="h-8 w-8 text-[var(--auth-primary)]" strokeWidth={1.75} />
      </div>

      <AuthTransitionShell
        kind="sign-up-completion"
        layout="panel"
        callbackUrl={callbackUrl}
        className="!mb-0"
      />

      <div className="nn-auth-verify-pending__resend">
        <AuthField
          id="verify-email-address"
          label={t("auth.emailVerification.resendLabel") ?? "Resend to"}
        >
          <AuthInput
            id="verify-email-address"
            type="email"
            name="email"
            autoComplete="email"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("auth.emailVerification.emailPlaceholder") ?? "Email on your account"}
            invalid={Boolean(error)}
          />
        </AuthField>
        {resent ? (
          <p className="nn-auth-verify-pending__sent" role="status" aria-live="polite">
            {t("auth.emailVerification.sent")}
          </p>
        ) : (
          <button
            type="button"
            className="nn-premium-auth-verified__secondary-btn mt-3 w-full px-4 py-2.5 text-sm font-semibold"
            onClick={() => void resend()}
            disabled={sending || !address.trim()}
            aria-busy={sending}
          >
            {sending ? t("auth.emailVerification.sending") : t("auth.emailVerification.resend")}
          </button>
        )}
        {error ? (
          <p className="nn-auth-verify-pending__error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <p className="nn-auth-verify-pending__signin">
        {t("auth.emailVerification.alreadyVerified") ?? "Already verified?"}{" "}
        <AuthTextLink href={loginHref}>{t("auth.emailVerification.signInLink") ?? "Sign in"}</AuthTextLink>
      </p>
    </div>
  );
}
