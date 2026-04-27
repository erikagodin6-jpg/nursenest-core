"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

export function LearnerBillingCancelSubscription(props: { t: LearnerMarketingT; enabled: boolean }) {
  const { t, enabled } = props;
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) return null;

  async function cancel() {
    if (!window.confirm(t("learner.billingPage.cancelSubscriptionConfirm"))) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/billing/cancel-subscription", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? t("learner.billingPage.cancelSubscriptionError"));
        return;
      }
      setMessage(t("learner.billingPage.cancelSubscriptionSuccess"));
      router.refresh();
    } catch {
      setError(t("learner.billingPage.cancelSubscriptionNetwork"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)] px-4 py-4">
      <p className="text-sm font-semibold text-[var(--semantic-warning-contrast)]">
        {t("learner.billingPage.cancelSubscriptionTitle")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("learner.billingPage.cancelSubscriptionBody")}</p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void cancel()}
        className="mt-3 inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-danger-contrast)] hover:opacity-95 disabled:opacity-50"
      >
        {busy ? t("learner.billingPage.cancelSubscriptionBusy") : t("learner.billingPage.cancelSubscriptionCta")}
      </button>
      {error ? (
        <p className="mt-2 text-sm text-[var(--semantic-danger-contrast)]" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-2 text-sm text-role-success" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
