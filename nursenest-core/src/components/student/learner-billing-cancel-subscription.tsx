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
    <div
      className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)] px-4 py-4"
      data-nn-cancellation-save-flow
    >
      <p className="text-sm font-semibold text-[var(--semantic-warning-contrast)]">
        {t("learner.billingPage.cancelSubscriptionTitle")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("learner.billingPage.cancelSubscriptionBody")}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["Pause Instead", "Contact support if you need time away but want to preserve your study history."],
          ["Switch Plan", "Monthly and longer plans can be reviewed before you make a final decision."],
          ["Review Progress", "Check completed lessons, readiness, and weak-area progress before cancelling."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-primary)]">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <a href="/app/account/progress" className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)]">
          View Progress
        </a>
        <a href="/pricing" className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)]">
          Compare Plans
        </a>
        <a href="/contact" className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)]">
          Ask Support
        </a>
      </div>
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

export function LearnerBillingReactivateSubscription(props: { t: LearnerMarketingT; enabled: boolean }) {
  const { t, enabled } = props;
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) return null;

  async function reactivate() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/billing/reactivate-subscription", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? t("learner.billingPage.reactivateSubscriptionError"));
        return;
      }
      setMessage(t("learner.billingPage.reactivateSubscriptionSuccess"));
      router.refresh();
    } catch {
      setError(t("learner.billingPage.reactivateSubscriptionNetwork"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-4 py-4">
      <p className="text-sm font-semibold text-[var(--semantic-success-contrast)]">
        {t("learner.billingPage.reactivateSubscriptionTitle")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("learner.billingPage.reactivateSubscriptionBody")}</p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void reactivate()}
        className="mt-3 inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[var(--semantic-success)] px-4 py-2 text-sm font-semibold text-[var(--semantic-on-success,var(--semantic-surface))] hover:opacity-95 disabled:opacity-50"
      >
        {busy ? t("learner.billingPage.reactivateSubscriptionBusy") : t("learner.billingPage.reactivateSubscriptionCta")}
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
