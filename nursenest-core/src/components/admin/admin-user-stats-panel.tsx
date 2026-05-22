"use client";

import { useEffect, useState } from "react";

type UserStats = {
  totalUsers: number;
  learnerUsers: number;
  adminUsers: number;
  activeUsers: number;
  newLast24Hours: number;
  newLast7Days: number;
  newLast30Days: number;
  generatedAt: string;
  note?: string;
};

function fmt(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString();
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[var(--semantic-border-soft)] last:border-0">
      <span className="text-sm text-[var(--semantic-text-secondary)]">{label}</span>
      <span
        className={`text-sm font-semibold tabular-nums ${highlight ? "text-[var(--semantic-brand)]" : "text-[var(--semantic-text-primary)]"}`}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Admin-only user count panel. Fetches from /api/admin/stats/users.
 * Fully isolated — failure shows a graceful message, never crashes the admin shell.
 */
export function AdminUserStatsPanel() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/stats/users", { credentials: "include" });
        if (!res.ok) {
          setError(`HTTP ${res.status}`);
          return;
        }
        const data = (await res.json()) as UserStats;
        if (!cancelled) setStats(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ts = stats?.generatedAt ? new Date(stats.generatedAt).toLocaleTimeString() : null;

  return (
    <section
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm"
      aria-label="User metrics"
      data-testid="admin-user-stats-panel"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">User metrics</h2>
        {ts ? (
          <span className="text-[10px] text-[var(--semantic-text-muted)] tabular-nums">
            as of {ts}
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-2.5 animate-pulse" aria-busy="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 rounded-md bg-[var(--semantic-panel-muted)]" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-[var(--semantic-text-muted)]">
          Could not load user metrics — {error}. Check server logs.
        </p>
      ) : !stats ? (
        <p className="text-sm text-[var(--semantic-text-muted)]">No data returned.</p>
      ) : (
        <div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            All users
          </div>
          <StatRow label="Total registered" value={fmt(stats.totalUsers)} highlight />
          <StatRow label="Learners" value={fmt(stats.learnerUsers)} />
          <StatRow label="Admins / staff" value={fmt(stats.adminUsers)} />
          <StatRow label="Active (30-day)" value={fmt(stats.activeUsers)} />

          <div className="mt-5 mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            New signups
          </div>
          <StatRow label="Last 24 hours" value={fmt(stats.newLast24Hours)} highlight={stats.newLast24Hours > 0} />
          <StatRow label="Last 7 days" value={fmt(stats.newLast7Days)} />
          <StatRow label="Last 30 days" value={fmt(stats.newLast30Days)} />

          {stats.note ? (
            <p className="mt-4 text-xs text-[var(--semantic-danger)]">{stats.note}</p>
          ) : null}
        </div>
      )}
    </section>
  );
}
