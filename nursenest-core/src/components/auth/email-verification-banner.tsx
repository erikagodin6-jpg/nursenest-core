"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { trackClientEvent } from "@/lib/observability/posthog-client";

export function EmailVerificationBanner({ email }: { email: string }) {
  const { t } = useMarketingI18n();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function resend() {
    if (sending) return;
    setSending(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
      trackClientEvent("verification_email_resent", {});
    } catch {
      // Fail silently
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="nn-verify-banner">
      <Mail className="h-4 w-4 text-[var(--semantic-warning)] flex-shrink-0" aria-hidden />
      <div className="nn-verify-banner__content">
        <p className="nn-verify-banner__text">{t("auth.emailVerification.banner")}</p>
        {sent ? (
          <p className="nn-verify-banner__sent">{t("auth.emailVerification.sent")}</p>
        ) : (
          <button
            type="button"
            onClick={() => void resend()}
            disabled={sending}
            className="nn-verify-banner__resend"
          >
            {sending ? t("auth.emailVerification.sending") : t("auth.emailVerification.resend")}
          </button>
        )}
      </div>
    </div>
  );
}
