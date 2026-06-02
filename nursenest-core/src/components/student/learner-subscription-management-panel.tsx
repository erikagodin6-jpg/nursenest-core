"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ManagedBillingPlan = {
  planCode: string;
  label: string;
  tier: string;
  duration: string;
  country: string;
};

type Props = {
  plans: ManagedBillingPlan[];
  currentPlanCode: string | null;
  renewalDate: string | null;
};

type ApiResult =
  | {
      ok: true;
      code?: string;
      kind?: "upgrade" | "downgrade" | "switch";
      immediate?: boolean;
      amountDue?: number | null;
      currency?: string | null;
      effectiveAt?: string | null;
      currentPeriodEnd?: string | null;
      targetPlan?: ManagedBillingPlan;
    }
  | { ok: false; error?: string; code?: string };

function money(amount: number | null | undefined, currency: string | null | undefined): string {
  if (amount == null) return "Stripe will calculate the exact invoice amount.";
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: (currency ?? "usd").toUpperCase(),
  }).format(amount / 100);
}

function dateLabel(value: string | null | undefined): string {
  if (!value) return "your next renewal date";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function LearnerSubscriptionManagementPanel({ plans, currentPlanCode, renewalDate }: Props) {
  const router = useRouter();
  const eligiblePlans = useMemo(() => plans.filter((p) => p.planCode !== currentPlanCode), [plans, currentPlanCode]);
  const [selected, setSelected] = useState(eligiblePlans[0]?.planCode ?? "");
  const [busy, setBusy] = useState<"preview" | "apply" | null>(null);
  const [preview, setPreview] = useState<ApiResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call(action: "preview" | "apply") {
    if (!selected) return;
    setBusy(action);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/billing/subscription-management", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, planCode: selected }),
      });
      const data = (await res.json()) as ApiResult;
      if (!res.ok) {
        setError(data.ok ? "Unable to update subscription." : data.error ?? "Unable to update subscription.");
        return;
      }
      if (!data.ok) {
        setError(data.error ?? "Unable to update subscription.");
        return;
      }
      if (action === "preview") {
        setPreview(data);
      } else if (data.code === "DOWNGRADE_SCHEDULED") {
        setMessage(`Your downgrade is scheduled for ${dateLabel(data.effectiveAt ?? renewalDate)}. Current access stays active until then.`);
        router.refresh();
      } else {
        setMessage(`Your plan was updated. Any prorated charge is handled by Stripe: ${money(data.amountDue, data.currency)}.`);
        router.refresh();
      }
    } catch {
      setError("Billing is temporarily unavailable. Try again shortly.");
    } finally {
      setBusy(null);
    }
  }

  if (eligiblePlans.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-muted/10 px-4 py-3 text-sm text-muted-foreground">
        Plan switching is available after Stripe prices are configured for additional tiers.
      </div>
    );
  }

  const previewSummary =
    preview?.ok && preview.targetPlan
      ? preview.kind === "downgrade"
        ? `Downgrade scheduled for ${dateLabel(preview.currentPeriodEnd ?? renewalDate)}. You keep your current access until renewal.`
        : `${preview.kind === "upgrade" ? "Upgrade" : "Tier switch"} applies immediately. Estimated prorated invoice: ${money(preview.amountDue, preview.currency)}.`
      : null;

  return (
    <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-semibold text-foreground">
          Switch subscription
          <select
            value={selected}
            onChange={(event) => {
              setSelected(event.target.value);
              setPreview(null);
              setMessage(null);
              setError(null);
            }}
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
          >
            {eligiblePlans.map((plan) => (
              <option key={plan.planCode} value={plan.planCode}>
                {plan.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={busy != null || !selected}
          onClick={() => void call("preview")}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80 disabled:opacity-50"
        >
          {busy === "preview" ? "Previewing..." : "Preview"}
        </button>
        <button
          type="button"
          disabled={busy != null || !selected}
          onClick={() => void call("apply")}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50"
        >
          {busy === "apply" ? "Updating..." : "Apply change"}
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Upgrades and lateral tier switches unlock immediately with Stripe proration. Downgrades are scheduled for renewal so your current access is not removed early.
      </p>
      {previewSummary ? <p className="mt-3 text-sm font-medium text-foreground">{previewSummary}</p> : null}
      {message ? <p className="mt-3 text-sm font-medium text-role-success">{message}</p> : null}
      {error ? (
        <p className="mt-3 text-sm font-medium text-[var(--semantic-danger-contrast)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
