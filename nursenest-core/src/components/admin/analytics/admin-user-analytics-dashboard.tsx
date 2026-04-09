"use client";

import type { AdminUserAnalyticsData } from "@/lib/admin/load-admin-user-analytics";
import { Progress } from "@/components/ui/progress";
import { Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

export type SerializableUserAnalyticsQuery = {
  fromDay: string;
  toDay: string;
  country: string;
  pathway: string;
  subscription: string;
};

function MiniBars({
  points,
  label,
}: {
  points: Array<{ label: string; value: number }>;
  label: string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="flex h-28 items-end gap-0.5 overflow-x-auto pb-1">
        {points.map((p) => (
          <div key={p.label} className="flex min-w-[18px] flex-1 flex-col items-center gap-1" title={`${p.label}: ${p.value}`}>
            <div
              className="w-full max-w-[14px] rounded-t bg-primary/80 transition hover:bg-primary"
              style={{ height: `${Math.max(4, (p.value / max) * 100)}%` }}
            />
            <span className="truncate text-[9px] text-muted-foreground">{p.label.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionCard({
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

function buildSearchParams(q: SerializableUserAnalyticsQuery): string {
  const p = new URLSearchParams();
  p.set("from", q.fromDay);
  p.set("to", q.toDay);
  if (q.country !== "ALL") p.set("country", q.country);
  if (q.pathway !== "ALL") p.set("pathway", q.pathway);
  if (q.subscription !== "all") p.set("subscription", q.subscription);
  return p.toString();
}

export function AdminUserAnalyticsDashboard({
  initialData,
  initialQuery,
}: {
  initialData: AdminUserAnalyticsData | null;
  initialQuery: SerializableUserAnalyticsQuery;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<SerializableUserAnalyticsQuery>(initialQuery);

  useEffect(() => {
    setForm(initialQuery);
  }, [initialQuery.fromDay, initialQuery.toDay, initialQuery.country, initialQuery.pathway, initialQuery.subscription]);

  const data = initialData;

  const filterHref = useMemo(() => {
    const qs = buildSearchParams(form);
    return qs ? `/admin/analytics/users?${qs}` : "/admin/analytics/users";
  }, [form]);

  function applyFilters() {
    startTransition(() => {
      router.push(filterHref);
    });
  }

  async function refresh() {
    setBusy(true);
    try {
      const qs = buildSearchParams(initialQuery);
      const res = await fetch(`/api/admin/analytics/users${qs ? `?${qs}` : ""}`, { cache: "no-store" });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
        <p className="font-semibold text-amber-950 dark:text-amber-100">User analytics unavailable</p>
        <p className="mt-2 text-muted-foreground">
          Database offline or safe mode. See{" "}
          <Link className="font-semibold text-primary underline" href="/admin/operations">
            Operations
          </Link>
          .
        </p>
      </div>
    );
  }

  const d = data;
  const maxPath = Math.max(1, ...d.pathwayDistribution.map((x) => x.users));
  const maxEng = Math.max(1, ...d.engagementByPathway.map((x) => x.activeInRange));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-xs font-medium text-muted-foreground">
            From
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.fromDay}
              onChange={(e) => setForm((f) => ({ ...f, fromDay: e.target.value }))}
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            To
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.toDay}
              onChange={(e) => setForm((f) => ({ ...f, toDay: e.target.value }))}
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            Country
            <select
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            >
              <option value="ALL">All</option>
              {d.filterOptions.countries.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            Pathway
            <select
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.pathway}
              onChange={(e) => setForm((f) => ({ ...f, pathway: e.target.value }))}
            >
              {d.filterOptions.pathways.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            Subscription
            <select
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.subscription}
              onChange={(e) => setForm((f) => ({ ...f, subscription: e.target.value }))}
            >
              {d.filterOptions.subscriptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={applyFilters}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-60"
          >
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Apply
          </button>
          <button
            type="button"
            onClick={refresh}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted/40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Generated {new Date(d.generatedAt).toLocaleString()} · Window {d.query.fromDay} → {d.query.toDay}
        {d.degraded ? (
          <span className="ml-2 font-semibold text-amber-700 dark:text-amber-300">Partial data (see warnings)</span>
        ) : null}
      </p>

      {d.warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-100">
          <p className="font-semibold">Warnings</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {d.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Learners (filtered)</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{d.totals.users.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-emerald-500/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active in window</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {d.totals.activeUsers.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {d.totals.activeShare !== null ? `${(d.totals.activeShare * 100).toFixed(1)}% of filtered learners` : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/30 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Exam attempts (window)</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{d.questionCatUsage.examAttemptsInRange.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Avg / active learner:{" "}
            {d.questionCatUsage.avgExamAttemptsPerActiveUser !== null
              ? d.questionCatUsage.avgExamAttemptsPerActiveUser.toFixed(2)
              : "—"}
          </p>
        </div>
      </div>

      <SectionCard title="Data notes" subtitle="Honest limits of what we can infer from the database.">
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {d.dataNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="New users (signups) in window" subtitle="User.createdAt buckets; respects filters.">
          {d.newUsersByDay.length === 0 ? (
            <p className="text-sm text-muted-foreground">No signups in this range for the selected filters.</p>
          ) : (
            <MiniBars
              label="Signups per day (UTC)"
              points={d.newUsersByDay.map((x) => ({ label: x.day, value: x.count }))}
            />
          )}
        </SectionCard>

        <SectionCard title="Subscription state (primary)" subtitle={d.subscriptionBreakdown.note}>
          <div className="space-y-2">
            {d.subscriptionBreakdown.byPrimaryState.map((row) => (
              <div key={row.state} className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">{row.state}</span>
                <span className="tabular-nums text-muted-foreground">{row.users.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {d.query.pathway === "ALL" ? (
        <SectionCard
          title="Pathway distribution"
          subtitle="Learners by current targetExamPathwayId (unset shown as no pathway)."
        >
          {d.pathwayDistribution.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rows.</p>
          ) : (
            <div className="space-y-3">
              {d.pathwayDistribution.map((row) => (
                <div key={String(row.pathwayId)} className="space-y-1">
                  <div className="flex justify-between gap-2 text-xs">
                    <span className="truncate text-muted-foreground">{row.label}</span>
                    <span className="shrink-0 tabular-nums font-medium">{row.users}</span>
                  </div>
                  <Progress
                    value={maxPath > 0 ? (row.users / maxPath) * 100 : 0}
                    variant="accent"
                    className="border-0 bg-muted/60"
                  />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      ) : (
        <SectionCard title="Pathway distribution" subtitle="Hidden while a single pathway filter is applied.">
          <p className="text-sm text-muted-foreground">Clear pathway filter to see distribution across pathways.</p>
        </SectionCard>
      )}

      <SectionCard
        title="Engagement by pathway"
        subtitle="Per pathway: learner count, active in window, avg progress events & exam attempts per active learner."
      >
        {d.engagementByPathway.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3">Pathway</th>
                  <th className="py-2 pr-3">Learners</th>
                  <th className="py-2 pr-3">Active</th>
                  <th className="py-2 pr-3">Avg progress / active</th>
                  <th className="py-2 pr-3">Avg exams / active</th>
                </tr>
              </thead>
              <tbody>
                {d.engagementByPathway.map((row) => (
                  <tr key={String(row.pathwayId)} className="border-b border-border/50">
                    <td className="py-2 pr-3 font-medium">{row.label}</td>
                    <td className="py-2 pr-3 tabular-nums">{row.users}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums">{row.activeInRange}</span>
                        <div className="h-1.5 flex-1 max-w-[80px] overflow-hidden rounded-full bg-muted/60">
                          <div
                            className="h-1.5 rounded-full bg-emerald-500/80"
                            style={{ width: `${(row.activeInRange / maxEng) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2 pr-3 tabular-nums">
                      {row.avgProgressEventsPerActive !== null ? row.avgProgressEventsPerActive.toFixed(1) : "—"}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">
                      {row.avgExamAttemptsPerActive !== null ? row.avgExamAttemptsPerActive.toFixed(2) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Lesson usage (distinct learners)" subtitle={d.lessonUsage.note}>
          <div className="space-y-3">
            <p className="text-sm">
              Avg lesson touches per learner with progress updates:{" "}
              <span className="font-semibold tabular-nums">
                {d.lessonUsage.avgLessonsTouchedPerActiveUser !== null
                  ? d.lessonUsage.avgLessonsTouchedPerActiveUser.toFixed(2)
                  : "—"}
              </span>
            </p>
            {d.lessonUsage.topLessonsByDistinctUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No lesson progress in window.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {d.lessonUsage.topLessonsByDistinctUsers.map((l) => (
                  <li key={l.lessonId} className="flex justify-between gap-2 border-b border-border/40 pb-2">
                    <span className="min-w-0 truncate">{l.title ?? l.lessonId}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">{l.distinctUsers} learners</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Questions & CAT" subtitle={d.questionCatUsage.note}>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-muted/30 p-3">
              <dt className="text-xs text-muted-foreground">Exam attempts</dt>
              <dd className="text-lg font-semibold tabular-nums">{d.questionCatUsage.examAttemptsInRange}</dd>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <dt className="text-xs text-muted-foreground">Exam sessions</dt>
              <dd className="text-lg font-semibold tabular-nums">{d.questionCatUsage.examSessionsInRange}</dd>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <dt className="text-xs text-muted-foreground">CAT sessions (adaptive state)</dt>
              <dd className="text-lg font-semibold tabular-nums">{d.questionCatUsage.catSessionsInRange}</dd>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <dt className="text-xs text-muted-foreground">Practice tests completed</dt>
              <dd className="text-lg font-semibold tabular-nums">{d.questionCatUsage.practiceTestsCompletedInRange}</dd>
            </div>
            <div className="rounded-lg bg-muted/30 p-3 sm:col-span-2">
              <dt className="text-xs text-muted-foreground">Adaptive practice tests completed</dt>
              <dd className="text-lg font-semibold tabular-nums">{d.questionCatUsage.practiceTestsAdaptiveCompletedInRange}</dd>
            </div>
          </dl>
        </SectionCard>
      </div>

      <SectionCard
        title="Free vs paid (same geo/pathway)"
        subtitle={
          d.freeVsPaid.available
            ? "Compared under current country & pathway filters. Paid = ACTIVE or GRACE subscription."
            : d.freeVsPaid.reason ?? ""
        }
      >
        {d.freeVsPaid.available ? (
          <div className="grid gap-4 md:grid-cols-2">
            {(["paid", "free"] as const).map((k) => {
              const seg = d.freeVsPaid[k];
              return (
                <div key={k} className="rounded-xl border border-border/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k}</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt>Learners</dt>
                      <dd className="tabular-nums font-medium">{seg.users}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Active in window</dt>
                      <dd className="tabular-nums font-medium">{seg.activeUsers}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Avg exam attempts / active</dt>
                      <dd className="tabular-nums">
                        {seg.avgExamAttemptsPerActive !== null ? seg.avgExamAttemptsPerActive.toFixed(2) : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Avg lesson touches / learner w/ progress</dt>
                      <dd className="tabular-nums">
                        {seg.avgProgressTouchesPerActive !== null ? seg.avgProgressTouchesPerActive.toFixed(2) : "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{d.freeVsPaid.reason}</p>
        )}
      </SectionCard>

      <SectionCard title="Weekly cohort retention" subtitle={d.cohortRetention.note}>
        {!d.cohortRetention.available ? (
          <p className="text-sm text-muted-foreground">{d.cohortRetention.reason}</p>
        ) : d.cohortRetention.weeks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No cohorts in range (need signups in the last 8 UTC weeks).</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3">Cohort week (UTC)</th>
                  <th className="py-2 pr-3">Size</th>
                  <th className="py-2 pr-3">Week 1 retention %</th>
                  <th className="py-2 pr-3">Week 2 retention %</th>
                </tr>
              </thead>
              <tbody>
                {d.cohortRetention.weeks.map((w) => (
                  <tr key={w.cohortWeekStart} className="border-b border-border/50">
                    <td className="py-2 pr-3 font-mono text-xs">{w.cohortWeekStart}</td>
                    <td className="py-2 pr-3 tabular-nums">{w.cohortSize}</td>
                    <td className="py-2 pr-3 tabular-nums">{w.retentionWeek1Pct !== null ? `${w.retentionWeek1Pct}%` : "—"}</td>
                    <td className="py-2 pr-3 tabular-nums">{w.retentionWeek2Pct !== null ? `${w.retentionWeek2Pct}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
