/**
 * Platform Readiness Engine
 *
 * Single composite 0–100 score representing overall NurseNest platform health.
 *
 * Inputs (weighted):
 *   Feature Health              (25%) — from feature-health-engine.ts
 *   Learner Health              (25%) — from learner-completion-observability.ts
 *   Content Quality             (15%) — from content-quality-intelligence.ts
 *   Infrastructure Health       (15%) — cache + pool + startup
 *   SEO Health                  (10%) — from seo-observability.ts
 *   Adaptive Learning Health    (5%)  — from adaptive-learning-observability.ts
 *   Instrumentation Coverage    (5%)  — from instrumentation-coverage-audit.ts
 *
 * Status thresholds:
 *   90–100 → Healthy   (all systems operating normally)
 *   70–89  → Watch     (minor signals, monitor closely)
 *   50–69  → Degraded  (some systems impaired, action needed)
 *   0–49   → Critical  (immediate attention required)
 *
 * The Platform Readiness Index is the primary KPI for the executive dashboard.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlatformReadinessStatus = "healthy" | "watch" | "degraded" | "critical";

export type ReadinessComponent = {
  name: string;
  weight: number;
  score: number;
  status: PlatformReadinessStatus;
  signals: string[];
};

export type PlatformReadinessReport = {
  generatedAt: string;
  overallScore: number;
  status: PlatformReadinessStatus;
  /** Plain-language summary for the executive dashboard. */
  summary: string;
  components: ReadinessComponent[];
  actionRequired: boolean;
  topActions: string[];
  /** What improved this week vs. last snapshot. */
  weeklyDelta?: { improved: string[]; regressed: string[] };
};

// ─── Score helpers ────────────────────────────────────────────────────────────

export function statusFromScore(score: number): PlatformReadinessStatus {
  if (score >= 90) return "healthy";
  if (score >= 70) return "watch";
  if (score >= 50) return "degraded";
  return "critical";
}

// ─── Component definitions ────────────────────────────────────────────────────

export const READINESS_WEIGHTS = {
  featureHealth:          0.25,
  learnerHealth:          0.25,
  contentQuality:         0.15,
  infraHealth:            0.15,
  seoHealth:              0.10,
  adaptiveLearningHealth: 0.05,
  instrumentationCoverage:0.05,
} as const;

// ─── Report builder ───────────────────────────────────────────────────────────

export type ReadinessInput = {
  featureHealthScore?: number;
  learnerHealthScore?: number;
  contentQualityScore?: number;
  infraHealthScore?: number;
  seoHealthScore?: number;
  adaptiveLearningScore?: number;
  instrumentationCoveragePercent?: number;
  signals?: Record<string, string[]>;
};

export function buildPlatformReadinessReport(input: ReadinessInput): PlatformReadinessReport {
  const components: ReadinessComponent[] = [
    {
      name: "Feature Health",
      weight: READINESS_WEIGHTS.featureHealth,
      score: input.featureHealthScore ?? 100,
      status: statusFromScore(input.featureHealthScore ?? 100),
      signals: input.signals?.featureHealth ?? [],
    },
    {
      name: "Learner Health",
      weight: READINESS_WEIGHTS.learnerHealth,
      score: input.learnerHealthScore ?? 100,
      status: statusFromScore(input.learnerHealthScore ?? 100),
      signals: input.signals?.learnerHealth ?? [],
    },
    {
      name: "Content Quality",
      weight: READINESS_WEIGHTS.contentQuality,
      score: input.contentQualityScore ?? 100,
      status: statusFromScore(input.contentQualityScore ?? 100),
      signals: input.signals?.contentQuality ?? [],
    },
    {
      name: "Infrastructure",
      weight: READINESS_WEIGHTS.infraHealth,
      score: input.infraHealthScore ?? 100,
      status: statusFromScore(input.infraHealthScore ?? 100),
      signals: input.signals?.infraHealth ?? [],
    },
    {
      name: "SEO Health",
      weight: READINESS_WEIGHTS.seoHealth,
      score: input.seoHealthScore ?? 100,
      status: statusFromScore(input.seoHealthScore ?? 100),
      signals: input.signals?.seoHealth ?? [],
    },
    {
      name: "Adaptive Learning",
      weight: READINESS_WEIGHTS.adaptiveLearningHealth,
      score: input.adaptiveLearningScore ?? 100,
      status: statusFromScore(input.adaptiveLearningScore ?? 100),
      signals: input.signals?.adaptiveLearning ?? [],
    },
    {
      name: "Instrumentation",
      weight: READINESS_WEIGHTS.instrumentationCoverage,
      score: input.instrumentationCoveragePercent ?? 50,
      status: statusFromScore(input.instrumentationCoveragePercent ?? 50),
      signals: input.signals?.instrumentation ?? [],
    },
  ];

  // Weighted composite score
  const overallScore = Math.round(
    components.reduce((sum, c) => sum + c.score * c.weight, 0),
  );
  const status = statusFromScore(overallScore);

  // Identify top actions (components scoring worst)
  const sorted = [...components].sort((a, b) => a.score - b.score);
  const topActions = sorted
    .filter((c) => c.status !== "healthy")
    .slice(0, 3)
    .map((c) => {
      if (c.name === "Feature Health" && c.score < 70) return "Investigate degraded feature(s) — check ops-center";
      if (c.name === "Learner Health" && c.score < 70) return "Review activity completion rates — learners may be stuck";
      if (c.name === "Content Quality" && c.score < 70) return "Review flagged questions — content quality issues detected";
      if (c.name === "Infrastructure" && c.score < 70) return "Check DB pool and cache hit rates — infrastructure under pressure";
      if (c.name === "SEO Health" && c.score < 70) return "Verify blog count, sitemap, and hub routes — SEO regression detected";
      if (c.name === "Instrumentation" && c.score < 70) return "Wire observability into dark route handlers — coverage gap";
      return `Improve ${c.name}: ${c.score}/100`;
    });

  const summaries: Record<PlatformReadinessStatus, string> = {
    healthy:  "Platform is operating at full health. All systems nominal.",
    watch:    "Minor signals detected. Monitor platform and address before they escalate.",
    degraded: "Some systems are underperforming. Action required before learner impact grows.",
    critical: "Critical platform issues detected. Immediate engineering attention required.",
  };

  return {
    generatedAt: new Date().toISOString(),
    overallScore,
    status,
    summary: summaries[status],
    components,
    actionRequired: status === "degraded" || status === "critical",
    topActions,
  };
}

/** Quick accessor: returns just the platform readiness score from available signals. */
export function getQuickReadinessScore(opts: {
  featureScore?: number;
  learnerScore?: number;
  infraScore?: number;
}): { score: number; status: PlatformReadinessStatus } {
  const score = Math.round(
    (opts.featureScore ?? 100) * 0.35 +
    (opts.learnerScore ?? 100) * 0.35 +
    (opts.infraScore ?? 100) * 0.30,
  );
  return { score, status: statusFromScore(score) };
}
