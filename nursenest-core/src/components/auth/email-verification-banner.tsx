"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";

export function EmailVerificationBanner({ email }: { email: string }) {
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
        <p className="nn-verify-banner__text">
          Check your inbox to verify your email before starting a free trial.
        </p>
        {sent ? (
          <p className="nn-verify-banner__sent">Verification email sent.</p>
        ) : (
          <button
            type="button"
            onClick={() => void resend()}
            disabled={sending}
            className="nn-verify-banner__resend"
          >
            {sending ? "Sending..." : "Resend Verification Email"}
          </button>
        )}
      </div>
    </div>
  );
}
