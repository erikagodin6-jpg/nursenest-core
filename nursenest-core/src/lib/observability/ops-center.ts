/**
 * NurseNest Operations Center — Aggregation Layer
 *
 * Aggregates signals from all observability modules into a single
 * platform health snapshot for the executive dashboard.
 *
 * Answers at any moment:
 *   • Is the platform healthy?
 *   • Are learners succeeding?
 *   • Where are learners struggling?
 *   • What features are underperforming?
 *   • What remediation is working?
 *   • What is causing churn?
 *   • What evidence exists for chargeback disputes?
 *   • What content is producing the best learning outcomes?
 *   • What SEO assets are growing or regressing?
 *
 * This module is the single import for the ops-center API route.
 * It is "server-only" — never import from client components.
 */

import "server-only";

import { getPlatformActivityHealth, getAllActivityHealthScores, type ActivityHealthStatus } from "@/lib/observability/learner-completion-observability";
import { getPlatformFrictionSummary } from "@/lib/observability/user-friction-detector";
import { getTimeToLearningStats } from "@/lib/observability/time-to-learning-metrics";
import { getPlatformRemediationSuccessRate, getTopicImprovementReports, getRemediationTypeStats } from "@/lib/observability/adaptive-learning-observability";
import { computeAllFeatureHealth, summarizeFeatureHealth } from "@/lib/observability/feature-health-engine";
import { getCacheLayerStats, checkCacheAlerts } from "@/lib/performance/cache-observability";
import { getLatestPoolSample, getPoolUtilizationTrend, checkPoolAlert } from "@/lib/performance/connection-pool-monitor";
import { getPlatformImprovementRate } from "@/lib/observability/learning-outcomes-engine";
import { getPlatformQuestionQualitySummary } from "@/lib/observability/content-quality-intelligence";
import { generateInstrumentationCoverageReport } from "@/lib/observability/instrumentation-coverage-audit";
import { buildPlatformReadinessReport } from "@/lib/observability/platform-readiness-engine";
import { getQueueSummary } from "@/lib/observability/content-review-queue";
import { getPlatformTrendSummary } from "@/lib/observability/trend-analytics";
import { getActivityStartupStats, formatActivityStartupReport } from "@/lib/performance/activity-startup-metrics";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SystemHealthLevel = "healthy" | "watch" | "degraded" | "critical";

export type OpsCenterSnapshot = {
  generatedAt: string;
  systemHealth: {
    level: SystemHealthLevel;
    score: number;
    summary: string;
  };
  learnerHealth: {
    level: SystemHealthLevel;
    overallScore: number;
    totalActivitySessions: number;
    degradedActivities: string[];
  };
  featureHealth: {
    level: SystemHealthLevel;
    healthyCount: number;
    watchCount: number;
    degradedCount: number;
    criticalCount: number;
    criticalFeatures: string[];
  };
  performanceHealth: {
    level: SystemHealthLevel;
    cacheHitRates: Record<string, number>;
    poolUtilization: number | null;
    poolTrend: string;
    poolAlertLevel: string | null;
    slowActivities: string[];
  };
  remediationHealth: {
    overallSuccessRate: number | null;
    topImprovingTopics: Array<{ topic: string; avgGain: number }>;
    bestRemediationType: string | null;
  };
  frictionHealth: {
    level: SystemHealthLevel;
    activeSessions: number;
    highFrustrationSessions: number;
    criticalFrustrationSessions: number;
    topFrictionSignal: string | null;
  };
  timeToLearning: {
    level: SystemHealthLevel;
    journeysOnTarget: number;
    journeysTotal: number;
  };
  contentQuality: {
    totalTracked: number;
    flaggedCount: number;
    criticalCount: number;
    avgQualityScore: number | null;
  };
  learningOutcomes: {
    improvingTopics: number;
    totalMeasuredTopics: number;
    improvementRate: number | null;
    avgGain: number | null;
  };
  platformReadiness: {
    overallScore: number;
    status: SystemHealthLevel;
    summary: string;
    actionRequired: boolean;
  };
  reviewQueue: {
    total: number;
    critical: number;
    high: number;
    unacknowledged: number;
  };
  instrumentation: {
    coveragePercent: number;
    darkActivities: number;
  };
  weeklyTrend: {
    regressions: number;
    improvements: number;
  };
  alerts: PlatformSummaryAlert[];
};

export type PlatformSummaryAlert = {
  severity: "warn" | "critical";
  category: string;
  message: string;
};

// ─── Health level helpers ─────────────────────────────────────────────────────

function scoreToLevel(score: number): SystemHealthLevel {
  if (score >= 90) return "healthy";
  if (score >= 70) return "watch";
  if (score >= 50) return "degraded";
  return "critical";
}

function activityStatusToLevel(status: ActivityHealthStatus): SystemHealthLevel {
  return status as SystemHealthLevel;
}

// ─── Snapshot builder ─────────────────────────────────────────────────────────

export async function buildOpsCenterSnapshot(): Promise<OpsCenterSnapshot> {
  const now = new Date().toISOString();
  const alerts: PlatformSummaryAlert[] = [];

  // ── Learner health ─────────────────────────────────────────────────────────
  const activityHealth = getPlatformActivityHealth();
  const learnerLevel = activityStatusToLevel(activityHealth.status);
  if (activityHealth.degradedActivities.length > 0) {
    alerts.push({
      severity: activityHealth.degradedActivities.length > 2 ? "critical" : "warn",
      category: "Learner",
      message: `${activityHealth.degradedActivities.length} activit(y/ies) degraded: ${activityHealth.degradedActivities.join(", ")}`,
    });
  }

  // ── Feature health ─────────────────────────────────────────────────────────
  const featureReports = computeAllFeatureHealth({
    cacheStats: getCacheLayerStats(),
    poolSample: getLatestPoolSample(),
  });
  const featureSummary = summarizeFeatureHealth(featureReports);
  if (featureSummary.criticalCount > 0) {
    alerts.push({
      severity: "critical",
      category: "Features",
      message: `${featureSummary.criticalCount} feature(s) critical: ${featureSummary.criticalFeatures.join(", ")}`,
    });
  }

  // ── Performance health ─────────────────────────────────────────────────────
  const cacheStats = getCacheLayerStats();
  const cacheHitRates: Record<string, number> = {};
  for (const stat of cacheStats) {
    cacheHitRates[stat.layer] = Math.round(stat.hitRate * 100);
  }

  const poolSample = getLatestPoolSample();
  const poolTrend = getPoolUtilizationTrend();
  const poolAlert = poolSample ? checkPoolAlert(poolSample) : null;

  if (poolAlert && (poolAlert.severity === "critical" || poolAlert.severity === "emergency")) {
    alerts.push({
      severity: "critical",
      category: "Database",
      message: poolAlert.message,
    });
  }

  const cacheAlerts = checkCacheAlerts();
  for (const ca of cacheAlerts) {
    if (ca.severity === "critical") {
      alerts.push({ severity: "critical", category: "Cache", message: ca.message });
    }
  }

  const activityStats = getActivityStartupStats();
  const slowActivities = activityStats
    .filter((s) => s.status === "fail" || s.status === "warn")
    .map((s) => s.label);

  const perfLevel: SystemHealthLevel =
    poolAlert?.severity === "critical" || cacheAlerts.some((a) => a.severity === "critical")
      ? "critical"
      : slowActivities.length > 2 ? "degraded"
      : slowActivities.length > 0 ? "watch"
      : "healthy";

  // ── Friction health ────────────────────────────────────────────────────────
  const frictionSummary = getPlatformFrictionSummary();
  const frictionLevel: SystemHealthLevel =
    frictionSummary.criticalFrustrationCount > 3 ? "critical"
    : frictionSummary.highFrustrationCount > 10 ? "degraded"
    : frictionSummary.highFrustrationCount > 3 ? "watch"
    : "healthy";

  if (frictionSummary.criticalFrustrationCount > 0) {
    alerts.push({
      severity: "warn",
      category: "Friction",
      message: `${frictionSummary.criticalFrustrationCount} session(s) at critical frustration level`,
    });
  }

  // ── Remediation health ─────────────────────────────────────────────────────
  const remediationRate = getPlatformRemediationSuccessRate();
  const topicReports = getTopicImprovementReports()
    .filter((r) => r.avgScoreGain !== null && r.avgScoreGain > 0)
    .sort((a, b) => (b.avgScoreGain ?? 0) - (a.avgScoreGain ?? 0))
    .slice(0, 5);
  const remediationTypeStats = getRemediationTypeStats();
  const bestType = remediationTypeStats
    .filter((t) => t.avgScoreGain !== null)
    .sort((a, b) => (b.avgScoreGain ?? 0) - (a.avgScoreGain ?? 0))[0]?.type ?? null;

  // ── Time to learning ───────────────────────────────────────────────────────
  const ttlStats = getTimeToLearningStats().filter((s) => s.sampleCount > 0);
  const ttlOnTarget = ttlStats.filter((s) => s.p50Status === "pass").length;
  const ttlLevel: SystemHealthLevel =
    ttlStats.length === 0 ? "healthy"
    : ttlOnTarget === ttlStats.length ? "healthy"
    : ttlOnTarget >= ttlStats.length * 0.75 ? "watch"
    : ttlOnTarget >= ttlStats.length * 0.5 ? "degraded"
    : "critical";

  // ── Content quality ────────────────────────────────────────────────────────
  const contentQualitySummary = getPlatformQuestionQualitySummary();
  if (contentQualitySummary.criticalCount > 5) {
    alerts.push({
      severity: "warn",
      category: "Content",
      message: `${contentQualitySummary.criticalCount} questions with critical quality issues`,
    });
  }

  // ── Learning outcomes ──────────────────────────────────────────────────────
  const learningOutcomes = getPlatformImprovementRate();

  // ── Instrumentation coverage ───────────────────────────────────────────────
  const coverageReport = generateInstrumentationCoverageReport();
  if (coverageReport.darkCount > 3) {
    alerts.push({
      severity: "warn",
      category: "Instrumentation",
      message: `${coverageReport.darkCount} activities have zero observability — data blind spots`,
    });
  }

  // ── Content review queue ───────────────────────────────────────────────────
  const queueSummary = getQueueSummary();
  if (queueSummary.critical > 0) {
    alerts.push({
      severity: "critical",
      category: "Content Queue",
      message: `${queueSummary.critical} critical content review item(s) pending`,
    });
  }

  // ── Weekly trend ───────────────────────────────────────────────────────────
  const weeklyTrend = getPlatformTrendSummary("7d");

  // ── Platform readiness ─────────────────────────────────────────────────────
  const infraScore = poolSample?.utilization != null
    ? Math.round((1 - poolSample.utilization) * 100) : 100;
  const readinessReport = buildPlatformReadinessReport({
    featureHealthScore: Math.round(100 - featureSummary.criticalCount * 15 - featureSummary.degradedCount * 8),
    learnerHealthScore: activityHealth.overallScore,
    contentQualityScore: contentQualitySummary.avgQualityScore ?? 100,
    infraHealthScore: infraScore,
    instrumentationCoveragePercent: coverageReport.coveragePercent,
  });

  if (readinessReport.status === "critical") {
    alerts.push({
      severity: "critical",
      category: "Platform Readiness",
      message: `Platform readiness score: ${readinessReport.overallScore}/100 — ${readinessReport.summary}`,
    });
  }

  // ── Overall system health ──────────────────────────────────────────────────
  const levelPriority: Record<SystemHealthLevel, number> = {
    healthy: 0, watch: 1, degraded: 2, critical: 3,
  };

  const allLevels: SystemHealthLevel[] = [
    learnerLevel, featureSummary.overallStatus, perfLevel, frictionLevel, ttlLevel,
    readinessReport.status,
  ];
  const worstLevel = allLevels.reduce(
    (a, b) => levelPriority[a] > levelPriority[b] ? a : b, "healthy",
  );

  const systemSummaries: Record<SystemHealthLevel, string> = {
    healthy: "All systems operating normally.",
    watch: "Minor signals detected — monitor closely.",
    degraded: "Some features or activities are underperforming.",
    critical: "Critical issues detected — immediate attention required.",
  };

  return {
    generatedAt: now,
    systemHealth: {
      level: worstLevel,
      score: readinessReport.overallScore,
      summary: systemSummaries[worstLevel],
    },
    learnerHealth: {
      level: learnerLevel,
      overallScore: activityHealth.overallScore,
      totalActivitySessions: activityHealth.activityScores.reduce(
        (s, a) => s + a.totalStarted, 0,
      ),
      degradedActivities: activityHealth.degradedActivities,
    },
    featureHealth: {
      level: featureSummary.overallStatus,
      healthyCount: featureSummary.healthyCount,
      watchCount: featureSummary.watchCount,
      degradedCount: featureSummary.degradedCount,
      criticalCount: featureSummary.criticalCount,
      criticalFeatures: featureSummary.criticalFeatures,
    },
    performanceHealth: {
      level: perfLevel,
      cacheHitRates,
      poolUtilization: poolSample?.utilization != null
        ? Math.round(poolSample.utilization * 100) : null,
      poolTrend,
      poolAlertLevel: poolAlert?.severity ?? null,
      slowActivities,
    },
    remediationHealth: {
      overallSuccessRate: remediationRate != null ? Math.round(remediationRate * 100) : null,
      topImprovingTopics: topicReports.map((r) => ({
        topic: r.topic,
        avgGain: r.avgScoreGain ?? 0,
      })),
      bestRemediationType: bestType,
    },
    frictionHealth: {
      level: frictionLevel,
      activeSessions: frictionSummary.activeSessions,
      highFrustrationSessions: frictionSummary.highFrustrationCount,
      criticalFrustrationSessions: frictionSummary.criticalFrustrationCount,
      topFrictionSignal: frictionSummary.topSignals[0]?.signal ?? null,
    },
    timeToLearning: {
      level: ttlLevel,
      journeysOnTarget: ttlOnTarget,
      journeysTotal: ttlStats.length,
    },
    contentQuality: {
      totalTracked: contentQualitySummary.totalTracked,
      flaggedCount: contentQualitySummary.flaggedCount,
      criticalCount: contentQualitySummary.criticalCount,
      avgQualityScore: contentQualitySummary.avgQualityScore,
    },
    learningOutcomes: {
      improvingTopics: learningOutcomes.improvingTopics,
      totalMeasuredTopics: learningOutcomes.totalMeasuredTopics,
      improvementRate: learningOutcomes.improvementRate,
      avgGain: learningOutcomes.avgGain,
    },
    platformReadiness: {
      overallScore: readinessReport.overallScore,
      status: readinessReport.status as SystemHealthLevel,
      summary: readinessReport.summary,
      actionRequired: readinessReport.actionRequired,
    },
    reviewQueue: {
      total: queueSummary.total,
      critical: queueSummary.critical,
      high: queueSummary.high,
      unacknowledged: queueSummary.unacknowledged,
    },
    instrumentation: {
      coveragePercent: coverageReport.coveragePercent,
      darkActivities: coverageReport.darkCount,
    },
    weeklyTrend: {
      regressions: weeklyTrend.regressions.length,
      improvements: weeklyTrend.improvements.length,
    },
    alerts,
  };
}
