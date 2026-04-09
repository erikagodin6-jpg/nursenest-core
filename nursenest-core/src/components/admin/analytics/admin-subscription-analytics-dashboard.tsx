"use client";

import type { AdminSubscriptionAnalyticsData } from "@/lib/admin/load-admin-subscription-analytics";
import { Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

type Q = { fromDay: string; toDay: string };

function MiniBars({ points }: { points: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className="flex h-24 items-end gap-0.5">
      {points.map((p) => (
        <div key={p.label} className="flex min-w-[10px] flex-1 flex-col items-center gap-1" title={`${p.label}: ${p.value}`}>
          <div
            className="w-full max-w-[12px] rounded-t bg-primary/80"
            style={{ height: `${Math.max(6, (p.value / max) * 100)}%` }}
          />
          <span className="text-[9px] text-muted-foreground">{p.label.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AdminSubscriptionAnalyticsDashboard({
  initialData,
  initialQuery,
}: {
  initialData: AdminSubscriptionAnalyticsData | null;
  initialQuery: Q;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Q>(initialQuery);

  useEffect(() => {
    setForm(initialQuery);
  }, [initialQuery.fromDay, initialQuery.toDay]);

  const d = initialData;

  const href = useMemo(() => {
    const p = new URLSearchParams();
    p.set("from", form.fromDay);
    p.set("to", form.toDay);
    return `/admin/analytics/subscriptions?${p.toString()}`;
  }, [form]);

  function apply() {
    startTransition(() => router.push(href));
  }

  async function refresh() {
    setBusy(true);
    try {
      const p = new URLSearchParams();
      p.set("from", initialQuery.fromDay);
      p.set("to", initialQuery.toDay);
      const res = await fetch(`/api/admin/analytics/subscriptions?${p}`, { cache: "no-store" });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!d) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
        <p className="font-semibold">Unavailable</p>
        <Link className="mt-2 block underline" href="/admin/operations">
          Operations
        </Link>
      </div>
    );
  }

  const maxPath = Math.max(1, ...d.byPathway.map((x) => x.subscriptions));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="text-xs font-medium text-muted-foreground">
            From
            <input
              type="date"
              className="mt-1 block rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.fromDay}
              onChange={(e) => setForm((f) => ({ ...f, fromDay: e.target.value }))}
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            To
            <input
              type="date"
              className="mt-1 block rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.toDay}
              onChange={(e) => setForm((f) => ({ ...f, toDay: e.target.value }))}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={apply}
            disabled={pending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </button>
          <button
            type="button"
            onClick={refresh}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Window for time-series &amp; churn columns: {d.query.fromDay} → {d.query.toDay}. Snapshot counts (status) are
        current DB state.
        {d.degraded ? <span className="ml-2 font-semibold text-amber-700">Partial data</span> : null}
      </p>

      {d.warnings.length > 0 ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <ul className="list-inside list-disc">
            {d.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <Section title="What this does / does not include" subtitle="Decision-useful ops view — not Stripe Revenue Recognition.">
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {d.dataNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { k: "Active + grace", v: d.overview.activeOrGrace, hint: "Paying access" },
          { k: "Active (paid)", v: d.overview.activePaid, hint: "Stripe ACTIVE" },
          { k: "Grace", v: d.overview.grace, hint: "At-risk access" },
          { k: "Past due", v: d.overview.pastDue, hint: "Billing failed" },
          { k: "Cancelled rows", v: d.overview.cancelled, hint: "Historical" },
        ].map((x) => (
          <div key={x.k} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{x.k}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{x.v.toLocaleString()}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{x.hint}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Total subscription rows in DB: {d.overview.subscriptionRowsTotal}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Trial vs paid (learners)" subtitle="Trials from User.trial*; paid = has ACTIVE or GRACE subscription row.">
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-muted/30 p-3">
              <dt className="text-xs text-muted-foreground">Trial active (learners)</dt>
              <dd className="text-xl font-semibold tabular-nums">{d.trial.trialActiveLearners}</dd>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <dt className="text-xs text-muted-foreground">Trial ends in 7d</dt>
              <dd className="text-xl font-semibold tabular-nums">{d.trial.trialEndingWithin7Days}</dd>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <dt className="text-xs text-muted-foreground">Learners with paid access</dt>
              <dd className="text-xl font-semibold tabular-nums">{d.trial.learnersWithPaidAccess}</dd>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <dt className="text-xs text-muted-foreground">Trial only (no ACTIVE/GRACE sub)</dt>
              <dd className="text-xl font-semibold tabular-nums">{d.trial.trialOnlyNoPaidSub}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-border/50 pt-4">
            <p className="text-xs font-medium text-muted-foreground">Trial status distribution</p>
            <ul className="mt-2 space-y-1 text-sm">
              {d.trial.byTrialStatus.map((r) => (
                <li key={r.status} className="flex justify-between gap-2">
                  <span>{r.status}</span>
                  <span className="tabular-nums">{r.learners}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="Churn &amp; renewal risk (DB)" subtitle={d.churnAndRisk.note}>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-2 border-b border-border/40 pb-2">
              <dt>CANCELLED updated in window</dt>
              <dd className="font-semibold tabular-nums">{d.churnAndRisk.cancelledUpdatedInRange}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/40 pb-2">
              <dt>PAST_DUE touched in window</dt>
              <dd className="font-semibold tabular-nums">{d.churnAndRisk.pastDueUpdatedInRange}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/40 pb-2">
              <dt>Current GRACE rows</dt>
              <dd className="font-semibold tabular-nums">{d.churnAndRisk.graceRows}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Current PAST_DUE rows</dt>
              <dd className="font-semibold tabular-nums">{d.churnAndRisk.pastDueRows}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Exact renewal dates and dunning steps require Stripe (customer portal / subscriptions). Use PAST_DUE + GRACE as
            internal follow-up queues.
          </p>
        </Section>
      </div>

      <Section title="Plan uptake" subtitle="Billed tier &amp; country on subscription rows.">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">By plan tier</h3>
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2">Tier</th>
                  <th className="py-2">ACTIVE</th>
                  <th className="py-2">All rows</th>
                </tr>
              </thead>
              <tbody>
                {d.byPlanTier.map((r) => (
                  <tr key={String(r.tier)} className="border-b border-border/40">
                    <td className="py-2 font-mono text-xs">{r.tier ?? "—"}</td>
                    <td className="py-2 tabular-nums">{r.activePaid}</td>
                    <td className="py-2 tabular-nums">{r.allRows}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-sm font-semibold">By plan country</h3>
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2">Country</th>
                  <th className="py-2">ACTIVE</th>
                  <th className="py-2">All rows</th>
                </tr>
              </thead>
              <tbody>
                {d.byPlanCountry.map((r) => (
                  <tr key={String(r.country)} className="border-b border-border/40">
                    <td className="py-2 font-mono text-xs">{r.country ?? "—"}</td>
                    <td className="py-2 tabular-nums">{r.activePaid}</td>
                    <td className="py-2 tabular-nums">{r.allRows}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section title="Subscriptions by learner pathway" subtitle="Joins User.targetExamPathwayId — marketing goal, not Stripe metadata.">
        <div className="space-y-2">
          {d.byPathway.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rows.</p>
          ) : (
            d.byPathway.map((p) => (
              <div key={String(p.pathwayId)} className="space-y-1">
                <div className="flex justify-between gap-2 text-xs">
                  <span className="truncate font-mono">{p.label}</span>
                  <span className="shrink-0 tabular-nums">
                    {p.subscriptions} rows · {p.activePaid} ACTIVE
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-2 rounded-full bg-emerald-600/80"
                    style={{ width: `${(p.subscriptions / maxPath) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Acquisition (window)" subtitle={d.acquisition.checkoutNote}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">New subscription rows</p>
              <p className="text-2xl font-bold tabular-nums">{d.acquisition.newSubscriptionsInRange}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">New learner accounts</p>
              <p className="text-2xl font-bold tabular-nums">{d.acquisition.newLearnersInRange}</p>
            </div>
          </div>
          <p className="mt-3 text-sm">
            New sub ÷ new signup (proxy):{" "}
            <strong className="tabular-nums">
              {d.acquisition.newSubPerSignupPct != null ? `${d.acquisition.newSubPerSignupPct}%` : "—"}
            </strong>
          </p>
          {d.acquisition.newSubscriptionsByDay.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground">New subscriptions by day</p>
              <MiniBars points={d.acquisition.newSubscriptionsByDay.map((x) => ({ label: x.day, value: x.count }))} />
            </div>
          ) : null}
        </Section>

        <Section title="Upgrades / downgrades &amp; drift" subtitle={d.planDrift.upgradesDowngradesNote}>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm font-semibold">ACTIVE subs with plan tier ≠ profile tier</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{d.planDrift.activeTierMismatchVsProfile}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Investigate in Stripe + user profile when high — often legitimate after a plan change or legacy tier.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
