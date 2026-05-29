"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { RetentionRiskProfile, RetentionRiskSummary, RiskLevel } from "@/lib/admin/subscription-risk";
import { riskLevelColor } from "@/lib/admin/subscription-risk";

type Props = { initialData?: RetentionRiskSummary | null };

const RISK_LABELS: Record<RiskLevel, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${riskLevelColor(level)}`}>
      {RISK_LABELS[level]}
    </span>
  );
}

function SummaryCard({ label, count, level }: { label: string; count: number; level: RiskLevel }) {
  const color = riskLevelColor(level);
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">{count}</p>
    </div>
  );
}

export function AdminRetentionRiskClient({ initialData }: Props) {
  const [data, setData] = useState<RetentionRiskSummary | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [minLevel, setMinLevel] = useState<RiskLevel>("medium");
  const [search, setSearch] = useState("");

  const load = async (level: RiskLevel = minLevel) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/retention-risk?minLevel=${level}`, { credentials: "include" });
      if (res.ok) setData(await res.json() as RetentionRiskSummary);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!initialData) void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = (data?.profiles ?? []).filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.email.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.userId.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <SummaryCard label="Critical" count={data?.critical ?? 0} level="critical" />
        <SummaryCard label="High Risk" count={data?.high ?? 0} level="high" />
        <SummaryCard label="Medium Risk" count={data?.medium ?? 0} level="medium" />
        <SummaryCard label="Low Risk" count={data?.low ?? 0} level="low" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or ID…"
          className="min-w-[240px] flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-[var(--theme-heading-text)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex gap-2">
          {(["critical", "high", "medium", "low"] as RiskLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => { setMinLevel(level); void load(level); }}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                minLevel === level ? riskLevelColor(level) : "border-border bg-background text-muted-foreground hover:bg-muted/40"
              }`}
            >
              {RISK_LABELS[level]}+
            </button>
          ))}
        </div>
        <button
          onClick={() => void load()}
          disabled={loading}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:border-primary/40 disabled:opacity-40"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* Table */}
      {loading && !data ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading retention risk data…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border px-5 py-10 text-center text-sm text-muted-foreground">
          No users match the current filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-left">Risk</th>
                <th className="px-4 py-3 text-left">Health</th>
                <th className="px-4 py-3 text-left">Last Active</th>
                <th className="px-4 py-3 text-left">Signals</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <RiskRow key={p.userId} profile={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <p className="text-right text-xs text-muted-foreground">
          {data.total} active subscribers analysed · generated {new Date(data.generatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

function RiskRow({ profile: p }: { profile: RetentionRiskProfile }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="hover:bg-muted/20">
        <td className="px-4 py-3">
          <p className="font-medium text-[var(--theme-heading-text)]">{p.name || "(no name)"}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{p.email}</p>
        </td>
        <td className="px-4 py-3 text-xs uppercase text-muted-foreground">{p.tier}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <RiskBadge level={p.riskLevel} />
            <span className="tabular-nums text-xs text-muted-foreground">{p.riskScore}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <HealthBar score={p.healthScore} />
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground">
          {p.daysSinceLastActivity === null
            ? "Never"
            : p.daysSinceLastActivity === 0
              ? "Today"
              : `${p.daysSinceLastActivity}d ago`}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-primary underline underline-offset-2"
          >
            {p.signals.length} signal{p.signals.length !== 1 ? "s" : ""} {expanded ? "▲" : "▼"}
          </button>
        </td>
        <td className="px-4 py-3 max-w-[180px] text-xs text-muted-foreground">{p.recommendedAction}</td>
        <td className="px-4 py-3">
          <Link
            href={`/admin/users/${p.userId}`}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary/40"
          >
            View
          </Link>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} className="bg-muted/10 px-4 py-3">
            <ul className="space-y-1">
              {p.signals.map((s) => (
                <li key={s.code} className="flex gap-2 text-xs">
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${riskLevelColor(s.severity)}`}>
                    {s.severity}
                  </span>
                  <span className="font-medium text-[var(--theme-heading-text)]">{s.label}</span>
                  <span className="text-muted-foreground">— {s.detail}</span>
                </li>
              ))}
            </ul>
            {p.subscriptionEndsAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                Subscription ends: {new Date(p.subscriptionEndsAt).toLocaleDateString()}
                {p.daysUntilExpiry !== null && ` (${p.daysUntilExpiry} days)`}
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function HealthBar({ score }: { score: number }) {
  const color = score >= 60 ? "bg-green-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="tabular-nums text-xs text-muted-foreground">{score}</span>
    </div>
  );
}
