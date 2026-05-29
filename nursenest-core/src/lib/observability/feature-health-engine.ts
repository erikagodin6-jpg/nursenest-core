/**
 * Feature Health Engine
 *
 * Computes composite health scores for every learner-facing feature.
 * Aggregates signals from multiple observability layers into a single
 * Healthy / Watch / Degraded / Critical status per feature.
 *
 * Signal sources:
 *   - learner-completion-observability  (completion rate, error rate)
 *   - activity-startup-metrics          (startup performance)
 *   - route-registry                    (budget definitions)
 *   - cache-observability               (cache hit rates)
 *   - user-friction-detector            (frustration signals)
 *
 * Feature health is the primary signal for the Operations Center dashboard.
 * It answers: "Which features need attention right now?"
 */

import type { ActivityHealthScore } from "@/lib/observability/learner-completion-observability";
import type { CacheLayerStats } from "@/lib/performance/cache-observability";
import type { PoolSample } from "@/lib/performance/connection-pool-monitor";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeatureHealthStatus = "healthy" | "watch" | "degraded" | "critical";
export type FeatureId =
  | "homepage"
  | "dashboard"
  | "questions"
  | "flashcards"
  | "lessons"
  | "clinical-skills"
  | "pharmacology"
  | "ecg"
  | "cat"
  | "loft"
  | "analytics"
  | "readiness"
  | "study-plan"
  | "smart-review";

export type FeatureSignal = {
  source: string;
  metric: string;
  value: number | string;
  status: "ok" | "warn" | "critical";
};

export type FeatureHealthReport = {
  featureId: FeatureId;
  label: string;
  score: number;
  status: FeatureHealthStatus;
  signals: FeatureSignal[];
  lastUpdated: string;
};

// ─── Feature metadata ─────────────────────────────────────────────────────────

const FEATURE_LABELS: Record<FeatureId, string> = {
  homepage:        "Homepage",
  dashboard:       "Learner Dashboard",
  questions:       "Practice Questions",
  flashcards:      "Flashcards",
  lessons:         "Lessons",
  "clinical-skills": "Clinical Skills",
  pharmacology:    "Pharmacology",
  ecg:             "ECG Workstation",
  cat:             "CAT Exam",
  loft:            "LOFT Simulation",
  analytics:       "Analytics",
  readiness:       "Readiness",
  "study-plan":    "Study Plan",
  "smart-review":  "Smart Review",
};

// ─── Health computation ───────────────────────────────────────────────────────

function statusFromScore(score: number): FeatureHealthStatus {
  if (score >= 90) return "healthy";
  if (score >= 70) return "watch";
  if (score >= 50) return "degraded";
  return "critical";
}

/**
 * Compute health score for a single feature from its activity health + startup performance.
 */
export function computeFeatureHealth(
  featureId: FeatureId,
  opts: {
    activityHealth?: ActivityHealthScore;
    cacheStats?: CacheLayerStats[];
    poolSample?: PoolSample | null;
    /** First-content p95 ms observed (from Playwright or Server-Timing). */
    p95FirstContentMs?: number;
    /** Error rate 0–1 from log aggregation. */
    errorRate?: number;
  } = {},
): FeatureHealthReport {
  let score = 100;
  const signals: FeatureSignal[] = [];

  // Signal: activity completion rate
  if (opts.activityHealth) {
    const h = opts.activityHealth;
    if (h.completionRate !== null) {
      if (h.completionRate < 0.5) {
        score -= 35;
        signals.push({ source: "completion", metric: "completion_rate",
          value: `${Math.round(h.completionRate * 100)}%`, status: "critical" });
      } else if (h.completionRate < 0.75) {
        score -= 15;
        signals.push({ source: "completion", metric: "completion_rate",
          value: `${Math.round(h.completionRate * 100)}%`, status: "warn" });
      }
    }
    if (h.errorRate !== null && h.errorRate > 0.05) {
      score -= 20;
      signals.push({ source: "completion", metric: "error_rate",
        value: `${Math.round(h.errorRate * 100)}%`, status: "critical" });
    } else if (h.errorRate !== null && h.errorRate > 0.02) {
      score -= 10;
      signals.push({ source: "completion", metric: "error_rate",
        value: `${Math.round(h.errorRate * 100)}%`, status: "warn" });
    }
  }

  // Signal: performance
  if (opts.p95FirstContentMs != null) {
    const FAST = 2000;
    const SLOW = 4000;
    if (opts.p95FirstContentMs > SLOW) {
      score -= 25;
      signals.push({ source: "performance", metric: "p95_first_content",
        value: `${opts.p95FirstContentMs}ms`, status: "critical" });
    } else if (opts.p95FirstContentMs > FAST) {
      score -= 10;
      signals.push({ source: "performance", metric: "p95_first_content",
        value: `${opts.p95FirstContentMs}ms`, status: "warn" });
    } else {
      signals.push({ source: "performance", metric: "p95_first_content",
        value: `${opts.p95FirstContentMs}ms`, status: "ok" });
    }
  }

  // Signal: error rate from logs
  if (opts.errorRate != null) {
    if (opts.errorRate > 0.05) {
      score -= 20;
      signals.push({ source: "errors", metric: "error_rate",
        value: `${Math.round(opts.errorRate * 100)}%`, status: "critical" });
    } else if (opts.errorRate > 0.01) {
      score -= 8;
      signals.push({ source: "errors", metric: "error_rate",
        value: `${Math.round(opts.errorRate * 100)}%`, status: "warn" });
    }
  }

  // Signal: cache health
  if (opts.cacheStats) {
    const snapshotStat = opts.cacheStats.find((s) => s.layer === "snapshot");
    if (snapshotStat && snapshotStat.total > 0 && snapshotStat.hitRate < 0.7) {
      score -= 15;
      signals.push({ source: "cache", metric: "snapshot_hit_rate",
        value: `${Math.round(snapshotStat.hitRate * 100)}%`, status: "warn" });
    }
  }

  // Signal: DB pool pressure
  if (opts.poolSample?.utilization != null) {
    if (opts.poolSample.utilization > 0.9) {
      score -= 20;
      signals.push({ source: "db", metric: "pool_utilization",
        value: `${Math.round(opts.poolSample.utilization * 100)}%`, status: "critical" });
    } else if (opts.poolSample.utilization > 0.75) {
      score -= 8;
      signals.push({ source: "db", metric: "pool_utilization",
        value: `${Math.round(opts.poolSample.utilization * 100)}%`, status: "warn" });
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    featureId,
    label: FEATURE_LABELS[featureId] ?? featureId,
    score,
    status: statusFromScore(score),
    signals,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Compute health scores for all features from available signal sources.
 */
export function computeAllFeatureHealth(opts: {
  activityHealthMap?: Map<FeatureId, ActivityHealthScore>;
  cacheStats?: CacheLayerStats[];
  poolSample?: PoolSample | null;
  p95Map?: Map<FeatureId, number>;
  errorRateMap?: Map<FeatureId, number>;
}): FeatureHealthReport[] {
  const featureIds = Object.keys(FEATURE_LABELS) as FeatureId[];
  return featureIds.map((id) =>
    computeFeatureHealth(id, {
      activityHealth: opts.activityHealthMap?.get(id),
      cacheStats: opts.cacheStats,
      poolSample: opts.poolSample,
      p95FirstContentMs: opts.p95Map?.get(id),
      errorRate: opts.errorRateMap?.get(id),
    }),
  );
}

/**
 * Returns a summary of platform-wide feature health.
 */
export function summarizeFeatureHealth(reports: FeatureHealthReport[]): {
  healthyCount: number;
  watchCount: number;
  degradedCount: number;
  criticalCount: number;
  overallStatus: FeatureHealthStatus;
  criticalFeatures: string[];
  degradedFeatures: string[];
} {
  const counts = { healthy: 0, watch: 0, degraded: 0, critical: 0 };
  const critical: string[] = [];
  const degraded: string[] = [];

  for (const r of reports) {
    counts[r.status]++;
    if (r.status === "critical") critical.push(r.label);
    else if (r.status === "degraded") degraded.push(r.label);
  }

  let overallStatus: FeatureHealthStatus = "healthy";
  if (counts.critical > 0) overallStatus = "critical";
  else if (counts.degraded > 1) overallStatus = "degraded";
  else if (counts.degraded === 1 || counts.watch > 3) overallStatus = "watch";

  return {
    healthyCount: counts.healthy,
    watchCount: counts.watch,
    degradedCount: counts.degraded,
    criticalCount: counts.critical,
    overallStatus,
    criticalFeatures: critical,
    degradedFeatures: degraded,
  };
}
