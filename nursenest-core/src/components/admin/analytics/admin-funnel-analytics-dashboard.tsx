"use client";

import type { AdminFunnelAnalyticsData } from "@/lib/admin/load-admin-funnel-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

export type SerializableFunnelQuery = {
  fromDay: string;
  toDay: string;
  country: string;
  pathway: string;
};

function buildSearchParams(q: SerializableFunnelQuery): string {
  const p = new URLSearchParams();
  p.set("from", q.fromDay);
  p.set("to", q.toDay);
  if (q.country !== "ALL") p.set("country", q.country);
  if (q.pathway !== "ALL") p.set("pathway", q.pathway);
  return p.toString();
}

export function AdminFunnelAnalyticsDashboard({
  initialData,
  initialQuery,
}: {
  initialData: AdminFunnelAnalyticsData | null;
  initialQuery: SerializableFunnelQuery;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<SerializableFunnelQuery>(initialQuery);

  useEffect(() => {
    setForm(initialQuery);
  }, [initialQuery.fromDay, initialQuery.toDay, initialQuery.country, initialQuery.pathway]);

  const data = initialData;

  const filterHref = useMemo(() => {
    const qs = buildSearchParams(form);
    return qs ? `/admin/analytics/funnels?${qs}` : "/admin/analytics/funnels";
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
      const res = await fetch(`/api/admin/analytics/funnels${qs ? `?${qs}` : ""}`, { cache: "no-store" });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
        <p className="font-semibold text-amber-950 dark:text-amber-100">Funnel analytics unavailable</p>
        <p className="mt-2 text-muted-foreground">
          <Link className="font-semibold text-primary underline" href="/admin/operations">
            Operations
          </Link>
        </p>
      </div>
    );
  }

  const d = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            Country (PostHog props)
            <select
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            >
              <option value="ALL">All</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            Pathway id
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 font-mono text-sm"
              placeholder="ALL or __unset__"
              value={form.pathway === "ALL" ? "" : form.pathway}
              onChange={(e) => {
                const v = e.target.value.trim();
                setForm((f) => ({ ...f, pathway: v.length === 0 ? "ALL" : v }));
              }}
            />
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

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>
          Source: <strong className="text-foreground">{d.source}</strong>
        </span>
        <span>·</span>
        <span>PostHog query API: {d.posthogConfigured ? "configured" : "not configured"}</span>
        <span>·</span>
        <span>
          Window {d.query.fromDay} → {d.query.toDay}
        </span>
        {d.degraded ? (
          <span className="font-semibold text-amber-700 dark:text-amber-300">Partial / degraded</span>
        ) : null}
      </div>

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

      <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">How to read this</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {d.dataNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
        {!d.posthogConfigured ? (
          <p className="mt-3 text-sm font-medium text-foreground">
            For full funnel steps, set <code className="rounded bg-muted px-1">POSTHOG_PERSONAL_API_KEY</code> and{" "}
            <code className="rounded bg-muted px-1">POSTHOG_PROJECT_ID</code> (see PostHog project settings). The project
            token alone cannot run HogQL from the server.
          </p>
        ) : null}
      </section>

      <div className="overflow-x-auto rounded-2xl border border-border/70">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
              <th className="p-3">Step</th>
              <th className="p-3">Event</th>
              <th className="p-3">Uniques</th>
              <th className="p-3">Conv. vs prior</th>
              <th className="p-3">Drop-off vs prior</th>
            </tr>
          </thead>
          <tbody>
            {d.steps.map((row) => (
              <tr key={row.id} className="border-b border-border/50">
                <td className="p-3 font-medium">{row.label}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{row.event}</td>
                <td className="p-3 tabular-nums">{row.count !== null ? row.count.toLocaleString() : "—"}</td>
                <td className="p-3 tabular-nums">
                  {row.conversionFromPriorPct !== null ? `${row.conversionFromPriorPct}%` : "—"}
                </td>
                <td className="p-3 tabular-nums">
                  {row.dropOffFromPriorPct !== null ? `${row.dropOffFromPriorPct}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {d.engagementSteps.length > 0 ? (
        <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Engagement &amp; product signals</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Independent event volumes (not a strict funnel). Use pathway/country filters where events include those
            properties.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
                  <th className="p-3">Signal</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">Uniques</th>
                  <th className="p-3">Conv. vs prior</th>
                  <th className="p-3">Drop-off vs prior</th>
                </tr>
              </thead>
              <tbody>
                {d.engagementSteps.map((row) => (
                  <tr key={row.id} className="border-b border-border/50">
                    <td className="p-3 font-medium">{row.label}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{row.event}</td>
                    <td className="p-3 tabular-nums">{row.count !== null ? row.count.toLocaleString() : "—"}</td>
                    <td className="p-3 tabular-nums">
                      {row.conversionFromPriorPct !== null ? `${row.conversionFromPriorPct}%` : "—"}
                    </td>
                    <td className="p-3 tabular-nums">
                      {row.dropOffFromPriorPct !== null ? `${row.dropOffFromPriorPct}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Event name reference</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Stable PostHog event strings from <code className="rounded bg-muted px-1">PH</code> — use in Insights / HogQL.
        </p>
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium text-primary">Show taxonomy ({Object.keys(PH).length} events)</summary>
          <ul className="mt-3 max-h-64 list-inside list-disc space-y-0.5 overflow-y-auto font-mono text-xs text-muted-foreground">
            {Object.entries(PH)
              .sort((a, b) => a[1].localeCompare(b[1]))
              .map(([k, v]) => (
                <li key={k}>
                  <span className="text-foreground">{v}</span> <span className="text-muted-foreground">({k})</span>
                </li>
              ))}
          </ul>
        </details>
      </section>
    </div>
  );
}
