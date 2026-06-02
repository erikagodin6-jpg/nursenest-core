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
import type { OpsCenterSnapshot, OpsTrafficLight, SystemHealthLevel } from "@/lib/observability/ops-center";

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

const TRAFFIC_LABEL: Record<OpsTrafficLight, string> = {
  green: "healthy",
  yellow: "degraded",
  red: "failing",
};

const TRAFFIC_CLASS: Record<OpsTrafficLight, string> = {
  green: "text-[#16a34a] bg-[color-mix(in_srgb,#16a34a_12%,transparent)]",
  yellow: "text-[#d97706] bg-[color-mix(in_srgb,#d97706_12%,transparent)]",
  red: "text-[#dc2626] bg-[color-mix(in_srgb,#dc2626_14%,transparent)]",
};

const TRAFFIC_DOT: Record<OpsTrafficLight, string> = {
  green: "●",
  yellow: "●",
  red: "●",
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

function TrafficPill({ status, label }: { status: OpsTrafficLight; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TRAFFIC_CLASS[status]}`}>
      <span aria-hidden>{TRAFFIC_DOT[status]}</span>
      {label ?? TRAFFIC_LABEL[status]}
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

function DrilldownList({ items }: { items: OpsCenterSnapshot["infrastructure"]["drilldown"] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <details
          key={item.label}
          className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_42%,transparent)] p-3"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-[var(--semantic-text-primary)]">{item.label}</span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="text-xs tabular-nums text-[var(--semantic-text-muted)]">{item.value}</span>
              <TrafficPill status={item.status} />
            </span>
          </summary>
          <div className="mt-2 text-xs text-[var(--semantic-text-muted)]">
            {item.detail ?? "No additional detail reported."}
            {item.href ? (
              <a className="ml-2 font-semibold text-[var(--semantic-brand)] underline" href={item.href}>
                Open
              </a>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}

function LearningActivityGrid({ activities }: { activities: OpsCenterSnapshot["learningActivities"] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {activities.map((activity) => (
        <details
          key={activity.key}
          className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{activity.label}</p>
              <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
                p95 {activity.startupP95Ms == null ? "no samples" : `${activity.startupP95Ms}ms`} / {activity.startupBudgetMs}ms
              </p>
            </div>
            <TrafficPill status={activity.status} />
          </summary>
          <div className="mt-3 space-y-2 border-t border-[var(--semantic-border-soft)] pt-3 text-xs text-[var(--semantic-text-muted)]">
            <MetricRow label="Health score" value={activity.score} sub="/100" />
            <MetricRow label="Startup samples" value={activity.sampleCount} />
            <p>{activity.detail}</p>
            <a className="font-semibold text-[var(--semantic-brand)] underline" href={activity.href}>
              Open subsystem
            </a>
          </div>
        </details>
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
    // Admin operations view refreshes frequently enough to show failures without forcing a live socket.
    const interval = setInterval(fetchSnapshot, 15_000);
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

  const { infrastructure, systemHealth, learnerHealth, featureHealth, performanceHealth,
          remediationHealth, frictionHealth, timeToLearning, alerts, users, learningActivities } = snapshot;

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
              Last updated: {lastRefresh} · Auto-refreshes every 15s
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
          { label: "Infra", score: infrastructure.status === "green" ? 100 : infrastructure.status === "yellow" ? 75 : 30, level: infrastructure.status === "green" ? "healthy" as const : infrastructure.status === "yellow" ? "watch" as const : "critical" as const },
          { label: "Learners", score: learnerHealth.overallScore, level: learnerHealth.level },
          { label: "Features", score: Math.round(100 - featureHealth.criticalCount * 15 - featureHealth.degradedCount * 8), level: featureHealth.level },
          { label: "Performance", score: performanceHealth.poolUtilization != null ? 100 - performanceHealth.poolUtilization : 100, level: performanceHealth.level },
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

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Infrastructure" status={infrastructure.status === "green" ? "healthy" : infrastructure.status === "yellow" ? "watch" : "critical"}>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[var(--semantic-border-soft)] p-3">
              <p className="text-[11px] font-semibold uppercase text-[var(--semantic-text-muted)]">Uptime</p>
              <p className="mt-1 text-lg font-black tabular-nums text-[var(--semantic-text-primary)]">
                {Math.floor(infrastructure.uptimeSeconds / 3600)}h {Math.floor((infrastructure.uptimeSeconds % 3600) / 60)}m
              </p>
            </div>
            <div className="rounded-xl border border-[var(--semantic-border-soft)] p-3">
              <p className="text-[11px] font-semibold uppercase text-[var(--semantic-text-muted)]">Version</p>
              <p className="mt-1 truncate text-sm font-bold text-[var(--semantic-text-primary)]">{infrastructure.deploymentVersion}</p>
            </div>
            <div className="rounded-xl border border-[var(--semantic-border-soft)] p-3">
              <p className="text-[11px] font-semibold uppercase text-[var(--semantic-text-muted)]">Environment</p>
              <p className="mt-1 text-sm font-bold text-[var(--semantic-text-primary)]">{infrastructure.environment}</p>
            </div>
            <div className="rounded-xl border border-[var(--semantic-border-soft)] p-3">
              <p className="text-[11px] font-semibold uppercase text-[var(--semantic-text-muted)]">Database</p>
              <p className="mt-1 text-sm font-bold text-[var(--semantic-text-primary)]">{infrastructure.database}</p>
            </div>
          </div>
          <DrilldownList items={infrastructure.drilldown} />
        </SectionCard>

        <SectionCard title="Users & Revenue Signals">
          <MetricRow label="Active users" value={users.activeUsers ?? "—"} sub="15 min" />
          <MetricRow label="Active study sessions" value={users.activeStudySessions ?? "—"} sub="15 min" />
          <MetricRow label="Study sessions" value={users.studySessions24h ?? "—"} sub="24h" />
          <MetricRow label="Active subscriptions" value={users.activeSubscriptions ?? "—"} />
          <MetricRow label="Past-due subscriptions" value={users.pastDueSubscriptions ?? "—"} />
        </SectionCard>
      </div>

      <SectionCard title="Learning Activities">
        <LearningActivityGrid activities={learningActivities} />
      </SectionCard>

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
          <div className="mt-4 border-t border-[var(--semantic-border-soft)] pt-3">
            <p className="mb-2 text-xs font-bold uppercase text-[var(--semantic-text-muted)]">Slowest routes</p>
            {performanceHealth.slowestRoutes.length === 0 ? (
              <p className="text-xs text-[var(--semantic-text-muted)]">No route latency samples yet.</p>
            ) : (
              performanceHealth.slowestRoutes.map((route) => (
                <MetricRow
                  key={route.route}
                  label={route.label}
                  value={route.p95Ms == null ? "—" : `${route.p95Ms}ms`}
                  sub={`budget ${route.budgetMs}ms`}
                />
              ))
            )}
          </div>
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

      <div className="grid gap-6 lg:grid-cols-2">
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
        {featureHealth.criticalFeatures.length > 0 ? (
          <ul className="space-y-2 text-xs text-[#dc2626]">
            {featureHealth.criticalFeatures.map((feature) => (
              <li key={feature} className="rounded-xl bg-[color-mix(in_srgb,#dc2626_8%,transparent)] p-3">
                {feature}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[var(--semantic-text-muted)]">
            Feature health engine reports no critical feature failures.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Slowest Queries">
        {performanceHealth.slowestQueries.length === 0 ? (
          <p className="text-xs text-[var(--semantic-text-muted)]">
            No Prisma query samples captured in this process. Enable full query capture in non-production or inspect slow-query logs for production.
          </p>
        ) : (
          performanceHealth.slowestQueries.map((query) => (
            <MetricRow
              key={`${query.fingerprint}:${query.durationMs}`}
              label={query.fingerprint}
              value={`${query.durationMs}ms`}
              sub={`${query.approxSqlChars} chars`}
            />
          ))
        )}
      </SectionCard>
      </div>

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
