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
import { getPrismaQueryLog } from "@/lib/db/prisma-query-capture";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { buildRuntimeVersionPayload, readBuildMeta } from "@/lib/build/runtime-version";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SystemHealthLevel = "healthy" | "watch" | "degraded" | "critical";

export type OpsCenterSnapshot = {
  generatedAt: string;
  infrastructure: {
    status: OpsTrafficLight;
    uptimeSeconds: number;
    deploymentVersion: string;
    environment: string;
    deploymentMode: string;
    database: "ok" | "error" | "not_configured";
    drilldown: OpsDrilldownItem[];
  };
  systemHealth: {
    level: SystemHealthLevel;
    score: number;
    summary: string;
  };
  learningActivities: LearningActivityOpsStatus[];
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
    startupLatency: Array<{
      activity: string;
      label: string;
      route: string;
      p50Ms: number | null;
      p95Ms: number | null;
      budgetMs: number;
      status: OpsTrafficLight;
    }>;
    slowestRoutes: Array<{
      route: string;
      label: string;
      p95Ms: number | null;
      budgetMs: number;
      status: OpsTrafficLight;
    }>;
    slowestQueries: Array<{
      fingerprint: string;
      durationMs: number;
      approxSqlChars: number;
    }>;
  };
  users: {
    activeUsers: number | null;
    activeStudySessions: number | null;
    studySessions24h: number | null;
    activeSubscriptions: number | null;
    pastDueSubscriptions: number | null;
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

export type OpsTrafficLight = "green" | "yellow" | "red";

export type OpsDrilldownItem = {
  label: string;
  value: string;
  status: OpsTrafficLight;
  href?: string;
  detail?: string;
};

export type LearningActivityOpsStatus = {
  key: "flashcards" | "cat" | "lessons" | "clinical-skills" | "pharmacology" | "ecg";
  label: string;
  status: OpsTrafficLight;
  healthLevel: SystemHealthLevel;
  score: number;
  startupP95Ms: number | null;
  startupBudgetMs: number;
  sampleCount: number;
  detail: string;
  href: string;
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

function levelToTraffic(level: SystemHealthLevel): OpsTrafficLight {
  if (level === "healthy") return "green";
  if (level === "watch") return "yellow";
  return "red";
}

function startupStatusToLevel(status: "pass" | "warn" | "fail" | "no-data"): SystemHealthLevel {
  if (status === "pass") return "healthy";
  if (status === "warn" || status === "no-data") return "watch";
  return "critical";
}

function worstLevel(levels: SystemHealthLevel[]): SystemHealthLevel {
  const levelPriority: Record<SystemHealthLevel, number> = {
    healthy: 0, watch: 1, degraded: 2, critical: 3,
  };
  return levels.reduce(
    (a, b) => levelPriority[a] > levelPriority[b] ? a : b, "healthy",
  );
}

function formatMs(ms: number | null): string {
  return ms == null ? "No samples" : `${ms}ms`;
}

type OpsCounts = {
  activeUsers: number | null;
  activeStudySessions: number | null;
  studySessions24h: number | null;
  activeSubscriptions: number | null;
  pastDueSubscriptions: number | null;
  failedBackgroundJobs24h: number | null;
  failedAutomationJobs24h: number | null;
};

function intFromRow(row: Record<string, unknown> | undefined, key: string): number {
  const value = row?.[key];
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

async function loadOpsCounts(): Promise<OpsCounts> {
  if (!isDatabaseUrlConfigured()) {
    return {
      activeUsers: null,
      activeStudySessions: null,
      studySessions24h: null,
      activeSubscriptions: null,
      pastDueSubscriptions: null,
      failedBackgroundJobs24h: null,
      failedAutomationJobs24h: null,
    };
  }

  try {
    const [
      activeUsers,
      activeStudySessions,
      studySessions24h,
      activeSubscriptions,
      pastDueSubscriptions,
      failedBackgroundJobs24h,
      failedAutomationJobs24h,
    ] = await Promise.all([
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(DISTINCT user_id)::int AS count
        FROM learner_activity_events
        WHERE created_at >= NOW() - INTERVAL '15 minutes'
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM learner_session_activities
        WHERE revoked_at IS NULL
          AND last_seen_at >= NOW() - INTERVAL '15 minutes'
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM learner_activity_events
        WHERE lifecycle = 'started'
          AND created_at >= NOW() - INTERVAL '24 hours'
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM "Subscription"
        WHERE status IN ('ACTIVE', 'GRACE')
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM "Subscription"
        WHERE status = 'PAST_DUE'
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM "BackgroundJob"
        WHERE status = 'FAILED'
          AND "updatedAt" >= NOW() - INTERVAL '24 hours'
      `,
      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM "ContentAutomationLog"
        WHERE status = 'FAILED'
          AND "updatedAt" >= NOW() - INTERVAL '24 hours'
      `,
    ]);

    return {
      activeUsers: intFromRow(activeUsers[0], "count"),
      activeStudySessions: intFromRow(activeStudySessions[0], "count"),
      studySessions24h: intFromRow(studySessions24h[0], "count"),
      activeSubscriptions: intFromRow(activeSubscriptions[0], "count"),
      pastDueSubscriptions: intFromRow(pastDueSubscriptions[0], "count"),
      failedBackgroundJobs24h: intFromRow(failedBackgroundJobs24h[0], "count"),
      failedAutomationJobs24h: intFromRow(failedAutomationJobs24h[0], "count"),
    };
  } catch {
    return {
      activeUsers: null,
      activeStudySessions: null,
      studySessions24h: null,
      activeSubscriptions: null,
      pastDueSubscriptions: null,
      failedBackgroundJobs24h: null,
      failedAutomationJobs24h: null,
    };
  }
}

// ─── Snapshot builder ─────────────────────────────────────────────────────────

export async function buildOpsCenterSnapshot(): Promise<OpsCenterSnapshot> {
  const now = new Date().toISOString();
  const alerts: PlatformSummaryAlert[] = [];
  const [opsCounts, buildMeta, databaseReady] = await Promise.all([
    loadOpsCounts(),
    readBuildMeta(),
    checkDatabaseReadiness(1200).catch(() => ({ ok: false as const, classification: "DB_OTHER" as const, error: "readiness failed" })),
  ]);

  const runtimeVersion = buildRuntimeVersionPayload(buildMeta, {
    nodeEnv: process.env.NODE_ENV ?? null,
    deploymentMode: process.env.NN_APP_PLATFORM_BUILD === "true" ? "digitalocean-app-platform" : "standalone",
  });
  const databaseStatus: OpsCenterSnapshot["infrastructure"]["database"] =
    databaseReady.ok ? ("latencyMs" in databaseReady ? "ok" : "not_configured") : "error";

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
  const startupLatency = activityStats.map((s) => ({
    activity: s.activity,
    label: s.label,
    route: s.route,
    p50Ms: s.p50Ms,
    p95Ms: s.p95Ms,
    budgetMs: s.budgetMs,
    status: levelToTraffic(startupStatusToLevel(s.status)),
  }));
  const slowestRoutes = activityStats
    .filter((s) => s.p95Ms != null)
    .sort((a, b) => (b.p95Ms ?? 0) - (a.p95Ms ?? 0))
    .slice(0, 6)
    .map((s) => ({
      route: s.route,
      label: s.label,
      p95Ms: s.p95Ms,
      budgetMs: s.budgetMs,
      status: levelToTraffic(startupStatusToLevel(s.status)),
    }));
  const slowestQueries = getPrismaQueryLog()
    .sort((a, b) => b.durationMs - a.durationMs)
    .slice(0, 5)
    .map((query) => ({
      fingerprint: `${query.query.length}:${query.query.slice(0, 36).replace(/\s+/g, " ")}`,
      durationMs: Math.round(query.durationMs),
      approxSqlChars: query.query.length,
    }));

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

  if (databaseStatus === "error") {
    alerts.push({
      severity: "critical",
      category: "Infrastructure",
      message: "Database readiness check is failing.",
    });
  }

  if ((opsCounts.pastDueSubscriptions ?? 0) > 0) {
    alerts.push({
      severity: "warn",
      category: "Billing",
      message: `${opsCounts.pastDueSubscriptions} subscription(s) are past due.`,
    });
  }

  const backupFailures = (opsCounts.failedBackgroundJobs24h ?? 0) + (opsCounts.failedAutomationJobs24h ?? 0);
  if (backupFailures > 0) {
    alerts.push({
      severity: "warn",
      category: "Jobs",
      message: `${backupFailures} background/automation failure(s) in the last 24 hours.`,
    });
  }

  const activityScoresByKey = new Map(getAllActivityHealthScores().map((score) => [score.activity, score]));
  const startupStatsByKey = new Map(activityStats.map((stat) => [stat.activity, stat]));
  const requiredLearningActivities = [
    { key: "flashcards", label: "Flashcards", href: "/app/flashcards" },
    { key: "cat", label: "CAT", href: "/app/practice-tests/cat-launch" },
    { key: "lessons", label: "Lessons", href: "/app/lessons" },
    { key: "clinical-skills", label: "Clinical Skills", href: "/app/clinical-skills" },
    { key: "pharmacology", label: "Pharmacology", href: "/app/pharmacology" },
    { key: "ecg", label: "ECG", href: "/modules/ecg" },
  ] as const;
  const learningActivities: LearningActivityOpsStatus[] = requiredLearningActivities.map((activity) => {
    const health = activityScoresByKey.get(activity.key);
    const startup = startupStatsByKey.get(activity.key);
    const healthLevel = health ? activityStatusToLevel(health.status) : "watch";
    const startupLevel = startup ? startupStatusToLevel(startup.status) : "watch";
    const level = worstLevel([healthLevel, startupLevel]);
    const detail =
      startup?.sampleCount
        ? `p95 startup ${formatMs(startup.p95Ms)} against ${startup.budgetMs}ms budget.`
        : "No recent startup samples; synthetic monitoring should populate this.";
    return {
      key: activity.key,
      label: activity.label,
      status: levelToTraffic(level),
      healthLevel: level,
      score: health?.score ?? 100,
      startupP95Ms: startup?.p95Ms ?? null,
      startupBudgetMs: startup?.budgetMs ?? (activity.key === "cat" ? 3000 : 2000),
      sampleCount: startup?.sampleCount ?? 0,
      detail,
      href: activity.href,
    };
  });

  // ── Overall system health ──────────────────────────────────────────────────
  const allLevels: SystemHealthLevel[] = [
    learnerLevel, featureSummary.overallStatus, perfLevel, frictionLevel, ttlLevel,
    readinessReport.status,
    databaseStatus === "error" ? "critical" : "healthy",
  ];
  const overallWorstLevel = worstLevel(allLevels);

  const systemSummaries: Record<SystemHealthLevel, string> = {
    healthy: "All systems operating normally.",
    watch: "Minor signals detected — monitor closely.",
    degraded: "Some features or activities are underperforming.",
    critical: "Critical issues detected — immediate attention required.",
  };

  return {
    generatedAt: now,
    infrastructure: {
      status: levelToTraffic(databaseStatus === "error" ? "critical" : runtimeVersion.ok ? "healthy" : "watch"),
      uptimeSeconds: Math.round(process.uptime()),
      deploymentVersion: runtimeVersion.commit?.slice(0, 12) ?? runtimeVersion.branch ?? "unknown",
      environment: runtimeVersion.environment ?? runtimeVersion.runtimeEnvironment ?? process.env.NODE_ENV ?? "unknown",
      deploymentMode: runtimeVersion.deploymentMode ?? "unknown",
      database: databaseStatus,
      drilldown: [
        {
          label: "Database readiness",
          value: databaseStatus,
          status: databaseStatus === "ok" ? "green" : databaseStatus === "not_configured" ? "yellow" : "red",
          detail: databaseReady.ok ? "Readiness probe completed." : databaseReady.error?.slice(0, 180),
        },
        {
          label: "Build source",
          value: runtimeVersion.source ?? "unknown",
          status: runtimeVersion.ok ? "green" : "yellow",
          detail: runtimeVersion.message,
          href: "/api/runtime/version",
        },
        {
          label: "Background jobs",
          value: `${opsCounts.failedBackgroundJobs24h ?? "—"} failed / 24h`,
          status: (opsCounts.failedBackgroundJobs24h ?? 0) > 0 ? "yellow" : "green",
        },
        {
          label: "Automation jobs",
          value: `${opsCounts.failedAutomationJobs24h ?? "—"} failed / 24h`,
          status: (opsCounts.failedAutomationJobs24h ?? 0) > 0 ? "yellow" : "green",
        },
      ],
    },
    systemHealth: {
      level: overallWorstLevel,
      score: readinessReport.overallScore,
      summary: systemSummaries[overallWorstLevel],
    },
    learningActivities,
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
      startupLatency,
      slowestRoutes,
      slowestQueries,
    },
    users: {
      activeUsers: opsCounts.activeUsers,
      activeStudySessions: opsCounts.activeStudySessions,
      studySessions24h: opsCounts.studySessions24h,
      activeSubscriptions: opsCounts.activeSubscriptions,
      pastDueSubscriptions: opsCounts.pastDueSubscriptions,
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
