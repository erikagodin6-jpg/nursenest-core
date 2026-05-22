"use client";

import { useEffect, useState } from "react";

type AnalyticsData = {
  generatedAt: string;
  users: {
    total: number | null;
    dau: number | null;
    wau: number | null;
    mau: number | null;
    newToday: number | null;
    newThisMonth: number | null;
    deadAccounts: number | null;
    retentionPct: number | null;
  };
  growth: {
    monthly: { month: string; users: number }[] | null;
  };
  emailDomains: { domain: string; count: number }[] | null;
  activity: {
    practiceTestsStarted: number | null;
    lessonsCompleted: number | null;
  };
};

function fmt(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString();
}

function pct(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n}%`;
}

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "brand" | "success" | "warning" | "muted";
}) {
  const textColor =
    accent === "brand"
      ? "text-[var(--semantic-brand)]"
      : accent === "success"
        ? "text-[var(--semantic-positive,#16a34a)]"
        : accent === "warning"
          ? "text-[var(--semantic-warning,#d97706)]"
          : "text-[var(--semantic-text-primary)]";

  return (
    <div className="flex flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">
        {label}
      </span>
      <span className={`mt-2 text-2xl font-bold tabular-nums ${textColor}`}>{value}</span>
      {sub ? (
        <span className="mt-1 text-xs text-[var(--semantic-text-muted)]">{sub}</span>
      ) : null}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)] mb-3">
      {children}
    </h3>
  );
}

function GrowthChart({ data }: { data: { month: string; users: number }[] }) {
  const max = Math.max(...data.map((d) => d.users), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.month} className="flex items-center gap-3 text-xs">
          <span className="w-16 shrink-0 tabular-nums text-[var(--semantic-text-muted)]">
            {d.month}
          </span>
          <div className="flex-1 h-5 rounded-full bg-[var(--semantic-panel-muted)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--semantic-brand)] opacity-80"
              style={{ width: `${Math.max(2, (d.users / max) * 100)}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right tabular-nums font-semibold text-[var(--semantic-text-secondary)]">
            {d.users}
          </span>
        </div>
      ))}
    </div>
  );
}

function EmailDomainTable({ domains }: { domains: { domain: string; count: number }[] }) {
  const suspiciousTlds = ["xyz", "top", "click", "loan", "win", "racing", "science", "party", "download"];
  const knownGood = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "icloud.com", "proton.me", "protonmail.com"];

  function flag(domain: string): "good" | "suspicious" | "neutral" {
    if (knownGood.includes(domain)) return "good";
    const tld = domain.split(".").slice(-1)[0] ?? "";
    if (suspiciousTlds.includes(tld)) return "suspicious";
    if (domain.includes("edu") || domain.includes("ac.")) return "good";
    return "neutral";
  }

  return (
    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
      {domains.map((d) => {
        const f = flag(d.domain);
        return (
          <div key={d.domain} className="flex items-center justify-between text-xs gap-2">
            <span
              className={`font-mono ${
                f === "suspicious"
                  ? "text-[var(--semantic-danger,#dc2626)]"
                  : f === "good"
                    ? "text-[var(--semantic-positive,#16a34a)]"
                    : "text-[var(--semantic-text-secondary)]"
              }`}
            >
              {f === "suspicious" ? "⚠ " : f === "good" ? "✓ " : "  "}
              {d.domain}
            </span>
            <span className="tabular-nums text-[var(--semantic-text-muted)]">{d.count}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Full platform analytics dashboard — admin only.
 * Fetches /api/admin/stats/analytics client-side; never crashes the admin shell.
 */
export function AdminAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/stats/analytics", { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as AnalyticsData;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const ts = data?.generatedAt ? new Date(data.generatedAt).toLocaleTimeString() : null;
  const u = data?.users;
  const a = data?.activity;

  if (loading) {
    return (
      <section aria-busy="true" aria-label="Analytics loading">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-[var(--semantic-panel-muted)]" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--semantic-text-muted)]">
        Analytics unavailable — {error}
      </p>
    );
  }

  if (!data) return null;

  return (
    <section className="space-y-8" data-testid="admin-analytics-dashboard">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Platform analytics</h2>
        {ts ? (
          <span className="text-[10px] text-[var(--semantic-text-muted)]">as of {ts}</span>
        ) : null}
      </div>

      {/* ── User counts ── */}
      <div>
        <SectionTitle>Users</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total registered" value={fmt(u?.total)} accent="brand" />
          <MetricCard label="New today" value={fmt(u?.newToday)} accent="success" sub="createdAt ≥ today" />
          <MetricCard label="New this month" value={fmt(u?.newThisMonth)} sub="calendar month" />
          <MetricCard
            label="Dead accounts"
            value={fmt(u?.deadAccounts)}
            accent={u?.deadAccounts != null && u.deadAccounts > (u.total ?? 0) * 0.3 ? "warning" : "muted"}
            sub="registered, never returned"
          />
        </div>
      </div>

      {/* ── Active users ── */}
      <div>
        <SectionTitle>Active users (updatedAt window)</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricCard label="DAU (24h)" value={fmt(u?.dau)} accent="brand" sub="updatedAt ≥ 24h ago" />
          <MetricCard label="WAU (7d)" value={fmt(u?.wau)} sub="updatedAt ≥ 7 days ago" />
          <MetricCard
            label="MAU (30d) / Retention"
            value={`${fmt(u?.mau)} · ${pct(u?.retentionPct)}`}
            sub="updatedAt ≥ 30 days ago"
          />
        </div>
      </div>

      {/* ── Activity ── */}
      <div>
        <SectionTitle>Platform activity (all time)</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard label="Practice tests started" value={fmt(a?.practiceTestsStarted)} />
          <MetricCard label="Lessons completed" value={fmt(a?.lessonsCompleted)} sub="progress.completed = true" />
        </div>
      </div>

      {/* ── Growth + domains side by side ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {data.growth.monthly && data.growth.monthly.length > 0 ? (
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <SectionTitle>Monthly signup growth (last 24 months)</SectionTitle>
            <GrowthChart data={data.growth.monthly} />
          </div>
        ) : null}

        {data.emailDomains && data.emailDomains.length > 0 ? (
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <SectionTitle>Email domain distribution (top 30)</SectionTitle>
            <p className="text-xs text-[var(--semantic-text-muted)] mb-3">
              ✓ = known good &nbsp;·&nbsp; ⚠ = suspicious TLD &nbsp;·&nbsp; school/edu = good
            </p>
            <EmailDomainTable domains={data.emailDomains} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
