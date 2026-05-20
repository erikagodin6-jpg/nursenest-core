"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { AdminObservabilityLearnerRow } from "@/lib/admin/load-admin-observability-learners";

type PathwayOption = { id: string; label: string };

export function AdminObservabilityLearnerRoster({
  canLoad,
  pathwayOptions,
}: {
  canLoad: boolean;
  pathwayOptions: PathwayOption[];
}) {
  const [pathway, setPathway] = useState("");
  const [trialOnly, setTrialOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AdminObservabilityLearnerRow[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!canLoad) return;
    setLoading(true);
    setError(null);
    try {
      const u = new URL("/api/admin/observability/learners", window.location.origin);
      u.searchParams.set("page", String(page));
      u.searchParams.set("limit", "24");
      if (pathway.trim()) u.searchParams.set("pathway", pathway.trim());
      if (trialOnly) u.searchParams.set("trial", "1");
      const res = await fetch(u.toString(), { cache: "no-store", credentials: "same-origin" });
      const json = (await res.json()) as {
        ok?: boolean;
        rows?: AdminObservabilityLearnerRow[];
        hasMore?: boolean;
        error?: string;
        code?: string;
      };
      if (!res.ok || !json.ok) {
        setError(json.error ?? `HTTP ${res.status}`);
        setRows([]);
        setHasMore(false);
        return;
      }
      setRows(json.rows ?? []);
      setHasMore(Boolean(json.hasMore));
    } catch (e) {
      setError(e instanceof Error ? e.message : "fetch_failed");
      setRows([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [canLoad, page, pathway, trialOnly]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!canLoad) {
    return (
      <div
        className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-warm)]/15 p-5 text-sm text-[var(--semantic-text-secondary)]"
        role="status"
      >
        <strong className="text-[var(--semantic-text-primary)]">Learner roster</strong> with email visibility requires{" "}
        <span className="font-semibold">support or super</span> staff. Use{" "}
        <Link href="/admin/analytics/users" className="font-semibold text-[var(--semantic-brand)] underline">
          user analytics
        </Link>{" "}
        for cohort metrics, or ask a super admin to elevate access.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Recent learners</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
            Bounded list (24/page, max 25 pages). PII stays admin-authenticated. Open a row for full support detail,
            progress samples, and subscription masks.
          </p>
        </div>
        <Link href="/admin/users" className="text-sm font-semibold text-[var(--semantic-brand)] underline">
          User search →
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          Pathway
          <select
            className="min-w-[200px] rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)]"
            value={pathway}
            onChange={(e) => {
              setPage(1);
              setPathway(e.target.value);
            }}
          >
            <option value="">All pathways</option>
            {pathwayOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--semantic-text-secondary)]">
          <input
            type="checkbox"
            checked={trialOnly}
            onChange={(e) => {
              setPage(1);
              setTrialOnly(e.target.checked);
            }}
          />
          Active trial only
        </label>
        <button
          type="button"
          className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)]/30 px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-cool)]/50 disabled:opacity-50"
          onClick={() => void load()}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-[var(--semantic-danger)]/40 bg-[var(--semantic-danger)]/10 px-3 py-2 text-sm text-[var(--semantic-danger)]">
          {error}
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)]">
              <th className="py-2 pr-3 font-semibold">Learner</th>
              <th className="py-2 pr-3 font-semibold">Trial</th>
              <th className="py-2 pr-3 font-semibold">Tier</th>
              <th className="py-2 pr-3 font-semibold">Pathway</th>
              <th className="py-2 pr-3 font-semibold">Last login</th>
              <th className="py-2 font-semibold">Subscriptions</th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-[var(--semantic-text-muted)]">
                  Loading…
                </td>
              </tr>
            ) : null}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[var(--semantic-border-soft)]/80">
                <td className="py-2 pr-3 align-top">
                  <Link href={`/admin/users/${r.id}`} className="font-semibold text-[var(--semantic-brand)] underline">
                    {r.name}
                  </Link>
                  <div className="font-mono text-[11px] text-[var(--semantic-text-muted)]">{r.email}</div>
                </td>
                <td className="py-2 pr-3 align-top">{r.trialStatus}</td>
                <td className="py-2 pr-3 align-top">
                  {r.tier}
                  <div className="text-[11px] text-[var(--semantic-text-muted)]">{r.country}</div>
                </td>
                <td className="max-w-[200px] py-2 pr-3 align-top text-xs leading-snug">
                  {r.targetPathwayLabel ?? r.targetExamPathwayId ?? "—"}
                </td>
                <td className="py-2 pr-3 align-top text-xs whitespace-nowrap">
                  {r.lastLoginAt ? new Date(r.lastLoginAt).toLocaleString() : "—"}
                </td>
                <td className="py-2 align-top text-xs leading-snug">{r.subscriptionSummary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-[var(--semantic-border-soft)] px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="text-sm text-[var(--semantic-text-secondary)]">Page {page}</span>
        <button
          type="button"
          className="rounded-lg border border-[var(--semantic-border-soft)] px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
          disabled={!hasMore || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
