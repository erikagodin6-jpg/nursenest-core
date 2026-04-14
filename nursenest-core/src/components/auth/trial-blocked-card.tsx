"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { trackClientEvent } from "@/lib/observability/posthog-client";

export function TrialBlockedCard({
  reason,
}: {
  reason: "already_used" | "device_used" | "email_not_verified" | "rate_limited" | "generic";
}) {
  const { t } = useMarketingI18n();
  const messages: Record<string, { titleKey: string; bodyKey: string }> = {
    already_used: {
      titleKey: "auth.trialBlocked.alreadyUsedTitle",
      bodyKey: "auth.trialBlocked.alreadyUsedBody",
    },
    device_used: {
      titleKey: "auth.trialBlocked.alreadyUsedTitle",
      bodyKey: "auth.trialBlocked.deviceUsedBody",
    },
    email_not_verified: {
      titleKey: "auth.trialBlocked.emailNotVerifiedTitle",
      bodyKey: "auth.trialBlocked.emailNotVerifiedBody",
    },
    rate_limited: {
      titleKey: "auth.trialBlocked.rateLimitedTitle",
      bodyKey: "auth.trialBlocked.rateLimitedBody",
    },
    generic: {
      titleKey: "auth.trialBlocked.genericTitle",
      bodyKey: "auth.trialBlocked.genericBody",
    },
  };

  const keys = messages[reason] ?? messages.generic;
  const msg = { title: t(keys.titleKey), body: t(keys.bodyKey) };

  return (
    <div className="nn-trial-blocked">
      <ShieldAlert className="h-5 w-5 text-[var(--semantic-warning)]" aria-hidden />
      <h3 className="nn-trial-blocked__title">{msg.title}</h3>
      <p className="nn-trial-blocked__body">{msg.body}</p>
      <div className="nn-trial-blocked__actions">
        <Link
          href="/login"
          className="nn-trial-blocked__btn-primary"
          onClick={() => trackClientEvent("trial_blocked_sign_in_clicked", { reason })}
        >
          {t("auth.trialBlocked.signInCta")}
        </Link>
        <Link
          href="/pricing"
          className="nn-trial-blocked__btn-secondary"
          onClick={() => trackClientEvent("trial_blocked_pricing_clicked", { reason })}
        >
          {t("auth.trialBlocked.viewPlansCta")}
        </Link>
      </div>
    </div>
  );
}
