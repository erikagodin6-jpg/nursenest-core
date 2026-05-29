"use client";

/**
 * NurseNest Operations Center Dashboard
 *
 * Executive-level platform health view. Aggregates all observability signals
 * into a single screen with drill-down capability.
 *
 * Sections:
 *   1. System Health — overall platform status
 *   2. Learner Health — activity completion, frustration
 *   3. Feature Health — per-feature status grid
 *   4. Performance Health — cache, pool, startup
 *   5. Remediation Intelligence — adaptive learning outcomes
 *   6. Time to Learning — journey speed metrics
 *   7. Active Alerts — consolidated alert feed
 *
 * Designed with semantic CSS variables from the NurseNest design system.
 * Theme-aware: works in Ocean, Midnight, Blossom, Aurora, Sage.
 */

import { useEffect, useState, useCallback } from "react";
import type { OpsCenterSnapshot, SystemHealthLevel } from "@/lib/observability/ops-center";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoadState = "idle" | "loading" | "loaded" | "error";

// ─── Status colors ────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<SystemHealthLevel, string> = {
  healthy:  "text-[#16a34a]",
  watch:    "text-[#d97706]",
  degraded: "text-[#ea580c]",
  critical: "text-[#dc2626]",
};

const STATUS_BG: Record<SystemHealthLevel, string> = {
  healthy:  "bg-[color-mix(in_srgb,#16a34a_12%,transparent)]",
  watch:    "bg-[color-mix(in_srgb,#d97706_12%,transparent)]",
  degraded: "bg-[color-mix(in_srgb,#ea580c_12%,transparent)]",
  critical: "bg-[color-mix(in_srgb,#dc2626_15%,transparent)]",
};

const STATUS_ICON: Record<SystemHealthLevel, string> = {
  healthy:  "●",
  watch:    "◑",
  degraded: "▲",
  critical: "✗",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ level, label }: { level: SystemHealthLevel; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[level]} ${STATUS_BG[level]}`}
    >
      <span aria-hidden>{STATUS_ICON[level]}</span>
      {label}
    </span>
  );
}

function ScoreMeter({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const level: SystemHealthLevel =
    score >= 90 ? "healthy" : score >= 70 ? "watch" : score >= 50 ? "degraded" : "critical";
  const textSize = size === "sm" ? "text-2xl" : "text-4xl";
  return (
    <div className="text-center">
      <span className={`${textSize} font-black tabular-nums ${STATUS_COLOR[level]}`}>
        {score}
      </span>
      <span className="ml-1 text-xs text-[var(--semantic-text-muted)]">/100</span>
    </div>
  );
}

function SectionCard({
  title,
  status,
  children,
  className = "",
}: {
  title: string;
  status?: SystemHealthLevel;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--semantic-text-primary)]">
          {title}
        </h2>
        {status && <StatusPill level={status} label={status} />}
      </div>
      {children}
    </section>
  );
}

function MetricRow({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-[var(--semantic-border-soft)] py-2 last:border-b-0">
      <span className="text-xs text-[var(--semantic-text-muted)]">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold tabular-nums text-[var(--semantic-text-primary)]">
          {value}
        </span>
        {sub && (
          <span className="ml-1 text-xs text-[var(--semantic-text-muted)]">{sub}</span>
        )}
      </div>
    </div>
  );
}

function FeatureGrid({
  features,
}: {
  features: Array<{ label: string; status: SystemHealthLevel; score: number }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {features.map((f) => (
        <div
          key={f.label}
          className={`flex flex-col gap-1 rounded-xl border border-[var(--semantic-border-soft)] p-3 ${STATUS_BG[f.status]}`}
        >
          <span className={`text-xs font-semibold ${STATUS_COLOR[f.status]}`}>
            {STATUS_ICON[f.status]} {f.label}
          </span>
          <span className={`text-lg font-black tabular-nums ${STATUS_COLOR[f.status]}`}>
            {f.score}
          </span>
        </div>
      ))}
    </div>
  );
}

function AlertFeed({
  alerts,
}: {
  alerts: Array<{ severity: "warn" | "critical"; category: string; message: string }>;
}) {
  if (alerts.length === 0) {
    return (
      <p className="text-xs text-[#16a34a]">
        ✓ No active alerts — all systems nominal.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {alerts.map((a, i) => (
        <li
          key={i}
          className={`flex gap-3 rounded-xl p-3 text-xs ${
            a.severity === "critical"
              ? "bg-[color-mix(in_srgb,#dc2626_10%,transparent)] text-[#dc2626]"
              : "bg-[color-mix(in_srgb,#d97706_10%,transparent)] text-[#d97706]"
          }`}
        >
          <span className="shrink-0 font-bold uppercase">{a.severity}</span>
          <span>
            <span className="font-semibold">[{a.category}]</span> {a.message}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export function OpsCenterDashboard() {
  const [snapshot, setSnapshot] = useState<OpsCenterSnapshot | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshot = useCallback(async () => {
    setLoadState("loading");
    try {
      const res = await fetch("/api/admin/ops-center", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as OpsCenterSnapshot;
      setSnapshot(data);
      setLastRefresh(new Date().toLocaleTimeString());
      setLoadState("loaded");
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ops center data");
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    fetchSnapshot();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchSnapshot, 60_000);
    return () => clearInterval(interval);
  }, [fetchSnapshot]);

  if (loadState === "idle" || loadState === "loading") {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--semantic-text-muted)]">
        <span className="animate-pulse">Loading operations center…</span>
      </div>
    );
  }

  if (loadState === "error" || !snapshot) {
    return (
      <div className="rounded-2xl border border-[#dc2626]/20 bg-[color-mix(in_srgb,#dc2626_8%,var(--semantic-surface))] p-6">
        <p className="text-sm font-semibold text-[#dc2626]">
          Operations Center unavailable
        </p>
        <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">{error}</p>
        <button
          type="button"
          className="mt-3 text-xs font-semibold text-[var(--semantic-brand)] underline"
          onClick={fetchSnapshot}
        >
          Retry
        </button>
      </div>
    );
  }

  const { systemHealth, learnerHealth, featureHealth, performanceHealth,
          remediationHealth, frictionHealth, timeToLearning, alerts } = snapshot;

  // Build feature list for the grid (placeholder — in production, featureReports come from API)
  const featureList = [
    { label: "Dashboard", status: learnerHealth.level, score: learnerHealth.overallScore },
    { label: "Questions", status: featureHealth.criticalFeatures.includes("Practice Questions") ? "critical" as const : "healthy" as const, score: 90 },
    { label: "Flashcards", status: "healthy" as const, score: 95 },
    { label: "Lessons", status: "healthy" as const, score: 88 },
    { label: "Clinical Skills", status: "healthy" as const, score: 92 },
    { label: "Pharmacology", status: "healthy" as const, score: 91 },
    { label: "ECG", status: "healthy" as const, score: 87 },
    { label: "CAT Exam", status: "healthy" as const, score: 85 },
    { label: "LOFT", status: "healthy" as const, score: 83 },
    { label: "Analytics", status: "healthy" as const, score: 89 },
    { label: "Readiness", status: "healthy" as const, score: 90 },
    { label: "Study Plan", status: "healthy" as const, score: 93 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Operations Center
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--semantic-text-primary)] md:text-3xl">
            Platform Intelligence
          </h1>
          {lastRefresh && (
            <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
              Last updated: {lastRefresh} · Auto-refreshes every 60s
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <StatusPill level={systemHealth.level} label={`System: ${systemHealth.level}`} />
          <button
            type="button"
            onClick={fetchSnapshot}
            className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Top KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {[
          { label: "System", score: systemHealth.score, level: systemHealth.level },
          { label: "Learners", score: learnerHealth.overallScore, level: learnerHealth.level },
          { label: "Features", score: Math.round(100 - featureHealth.criticalCount * 15 - featureHealth.degradedCount * 8), level: featureHealth.level },
          { label: "Performance", score: performanceHealth.poolUtilization != null ? 100 - performanceHealth.poolUtilization : 100, level: performanceHealth.level },
          { label: "Friction", score: Math.max(0, 100 - frictionHealth.criticalFrustrationSessions * 10 - frictionHealth.highFrustrationSessions * 3), level: frictionHealth.level },
          { label: "TTL", score: timeToLearning.journeysTotal > 0 ? Math.round((timeToLearning.journeysOnTarget / timeToLearning.journeysTotal) * 100) : 100, level: timeToLearning.level },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-center shadow-sm ${STATUS_BG[kpi.level]}`}
          >
            <p className="text-xs font-semibold uppercase text-[var(--semantic-text-muted)]">{kpi.label}</p>
            <ScoreMeter score={kpi.score} size="sm" />
            <StatusPill level={kpi.level} label={kpi.level} />
          </div>
        ))}
      </div>

      {/* Alert feed */}
      {alerts.length > 0 && (
        <SectionCard title={`Active Alerts (${alerts.length})`} status={alerts.some((a) => a.severity === "critical") ? "critical" : "watch"}>
          <AlertFeed alerts={alerts} />
        </SectionCard>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Learner health */}
        <SectionCard title="Learner Health" status={learnerHealth.level}>
          <MetricRow label="Activity sessions" value={learnerHealth.totalActivitySessions.toLocaleString()} />
          <MetricRow label="Degraded activities" value={learnerHealth.degradedActivities.length} />
          {learnerHealth.degradedActivities.length > 0 && (
            <p className="mt-2 text-xs text-[#ea580c]">
              Degraded: {learnerHealth.degradedActivities.join(", ")}
            </p>
          )}
          <MetricRow label="Active frustration" value={frictionHealth.highFrustrationSessions} sub="sessions" />
          <MetricRow label="Critical frustration" value={frictionHealth.criticalFrustrationSessions} sub="sessions" />
          {frictionHealth.topFrictionSignal && (
            <MetricRow label="Top friction signal" value={frictionHealth.topFrictionSignal.replace(/_/g, " ")} />
          )}
        </SectionCard>

        {/* Performance health */}
        <SectionCard title="Performance & Infrastructure" status={performanceHealth.level}>
          <MetricRow
            label="DB pool utilization"
            value={performanceHealth.poolUtilization != null ? `${performanceHealth.poolUtilization}%` : "—"}
            sub={performanceHealth.poolTrend}
          />
          {performanceHealth.poolAlertLevel && (
            <p className="mt-1 text-xs text-[#d97706]">
              Pool alert: {performanceHealth.poolAlertLevel}
            </p>
          )}
          {Object.entries(performanceHealth.cacheHitRates).map(([layer, rate]) => (
            <MetricRow key={layer} label={`${layer} cache`} value={`${rate}%`} sub="hit rate" />
          ))}
          {performanceHealth.slowActivities.length > 0 && (
            <p className="mt-2 text-xs text-[#d97706]">
              Slow: {performanceHealth.slowActivities.join(", ")}
            </p>
          )}
        </SectionCard>

        {/* Remediation intelligence */}
        <SectionCard title="Adaptive Learning">
          <MetricRow
            label="Remediation success rate"
            value={remediationHealth.overallSuccessRate != null
              ? `${remediationHealth.overallSuccessRate}%` : "—"}
          />
          <MetricRow
            label="Best remediation type"
            value={remediationHealth.bestRemediationType?.replace(/-/g, " ") ?? "—"}
          />
          {remediationHealth.topImprovingTopics.slice(0, 3).map((t) => (
            <MetricRow
              key={t.topic}
              label={t.topic}
              value={`+${t.avgGain}`}
              sub="avg gain"
            />
          ))}
          <MetricRow
            label="Time-to-learning"
            value={`${timeToLearning.journeysOnTarget}/${timeToLearning.journeysTotal}`}
            sub="journeys on target"
          />
        </SectionCard>
      </div>

      {/* Feature health grid */}
      <SectionCard title="Feature Health" status={featureHealth.level}>
        <div className="mb-3 flex gap-4 text-xs text-[var(--semantic-text-muted)]">
          <span>
            <span className="text-[#16a34a]">●</span> Healthy: {featureHealth.healthyCount}
          </span>
          <span>
            <span className="text-[#d97706]">◑</span> Watch: {featureHealth.watchCount}
          </span>
          <span>
            <span className="text-[#ea580c]">▲</span> Degraded: {featureHealth.degradedCount}
          </span>
          <span>
            <span className="text-[#dc2626]">✗</span> Critical: {featureHealth.criticalCount}
          </span>
        </div>
        <FeatureGrid features={featureList} />
      </SectionCard>

      {/* No-alerts confirmation */}
      {alerts.length === 0 && (
        <div className="rounded-2xl border border-[color-mix(in_srgb,#16a34a_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,#16a34a_5%,var(--semantic-surface))] p-4 text-center">
          <p className="text-sm font-semibold text-[#16a34a]">✓ All systems nominal — no active alerts</p>
          <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
            Generated at {new Date(snapshot.generatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
