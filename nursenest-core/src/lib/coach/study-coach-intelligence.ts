import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { computeReadinessScore, type CoachReadinessInput } from "@/lib/coach/study-coach-readiness";
import { rankStudyPriorities } from "@/lib/coach/study-coach-priorities";
import { buildLearnerPatternSnapshot } from "@/lib/coach/study-coach-memory";
import {
  detectDashboardInterventions,
  filterInterventionsByCooldown,
  rankInterventions,
} from "@/lib/coach/study-coach-interventions";
import type {
  CoachContextInput,
  CoachIntervention,
  CoachResponsePayload,
  LearnerPatternSnapshot,
  ReadinessScore,
  WeaknessPriority,
} from "@/lib/coach/study-coach-types";
import { followUpsForIntent, titleForIntent } from "@/lib/coach/study-coach-followups";

export type CoachDashboardBundle = {
  contextInput: CoachContextInput;
  readiness: ReadinessScore;
  priorities: WeaknessPriority[];
  patterns: LearnerPatternSnapshot;
  interventions: CoachIntervention[];
  topIntervention: CoachIntervention | null;
};

function mapTrend(
  t: "improving" | "stable" | "declining" | null | undefined,
): CoachReadinessInput["practiceTrend"] {
  if (t === "improving" || t === "stable" || t === "declining") return t;
  return null;
}

function mockAvg(snapshot: PremiumDashboardSnapshot): number | null {
  if (snapshot.recentMocks.length === 0) return null;
  const sum = snapshot.recentMocks.reduce((a, m) => a + m.pct, 0);
  return Math.round(sum / snapshot.recentMocks.length);
}

/**
 * Build normalized coach inputs from dashboard and study snapshots already loaded for the page.
 */
export function buildCoachDashboardBundle(
  snapshot: PremiumDashboardSnapshot,
  studySnap: LearnerStudySnapshot,
  daysSinceLastActivity: number | null,
): CoachDashboardBundle {
  const weakTopics = studySnap.weakTopics.slice(0, 20).map((w) => ({
    topic: w.topic,
    topicSlug: (w.normalizedTopic ?? normalizeTopicKey(w.topic)).trim() || normalizeTopicKey(w.topic),
    missRate: w.missRate,
    attempted: w.attempted,
    wrongStreak: w.wrongStreak,
  }));

  const topicsImproving = studySnap.topicTrends.filter((r) => r.momentum === "improving").map((r) => r.topic);
  const topicsDeclining = studySnap.topicTrends.filter((r) => r.momentum === "declining").map((r) => r.topic);

  const lessonRatio =
    snapshot.overallLessons.total > 0
      ? snapshot.overallLessons.completed / snapshot.overallLessons.total
      : null;

  const reviewCompletionRate =
    snapshot.practice.gradedTotal > 0
      ? Math.min(1, snapshot.practice.gradedCorrect / Math.max(1, snapshot.practice.gradedTotal))
      : null;

  const topMissRates = studySnap.weakTopics.slice(0, 3).map((w) => w.missRate);
  const difficultyGapScore =
    topMissRates.length > 0 ? Math.round(topMissRates.reduce((a, b) => a + b, 0) / topMissRates.length) : null;

  const contextInput: CoachContextInput = {
    recentAccuracyPct: snapshot.practice.accuracyPct,
    weakTopicCount: studySnap.weakTopics.length,
    weakTopics,
    topicsImproving,
    topicsDeclining,
    recentSessionsSample: snapshot.practice.sessionCount,
    mockExamAvgPct: mockAvg(snapshot),
    catOrPracticeAvgPct: snapshot.practice.accuracyPct,
    reviewCompletionRate,
    daysSinceLastActivity,
    difficultyGapScore,
    appReadinessScore: snapshot.readiness.score,
    practiceTrend: mapTrend(snapshot.readiness.trend ?? undefined),
    lessonsCompletedRatio: lessonRatio,
  };

  const readinessInput: CoachReadinessInput = {
    latestReadinessScore: snapshot.readiness.score,
    recentAccuracyPct: snapshot.practice.accuracyPct,
    practiceAccuracyPct: snapshot.practice.accuracyPct,
    weakTopicCount: studySnap.weakTopics.length,
    improvingTopicCount: topicsImproving.length,
    decliningTopicCount: topicsDeclining.length,
    mockExamAvgPct: mockAvg(snapshot),
    lessonsCompletedRatio: lessonRatio,
    reviewCompletionRate,
    daysSinceLastActivity,
    difficultyGapScore,
    appReadinessScore: snapshot.readiness.score,
    practiceTrend: mapTrend(snapshot.readiness.trend ?? undefined),
  };

  const readiness = computeReadinessScore(readinessInput);
  const priorities = rankStudyPriorities(contextInput, 6);
  const patterns = buildLearnerPatternSnapshot(contextInput);
  const raw = detectDashboardInterventions(readiness, contextInput, patterns, "dashboard");
  const interventions = rankInterventions(raw);
  const topIntervention = interventions[0] ?? null;

  return {
    contextInput,
    readiness,
    priorities,
    patterns,
    interventions,
    topIntervention,
  };
}

export async function loadDaysSinceLastActivity(userId: string): Promise<number | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;
  try {
    const [p, a] = await Promise.all([
      prisma.progress.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
      }),
      prisma.examAttempt.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);
    const dates = [p?.updatedAt, a?.createdAt].filter(Boolean) as Date[];
    if (dates.length === 0) return null;
    const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
    const days = Math.floor((Date.now() - latest.getTime()) / 86400000);
    return Math.max(0, days);
  } catch {
    return null;
  }
}

export function formatReadinessExplainResponse(readiness: ReadinessScore): CoachResponsePayload {
  const bandLabel =
    readiness.band === "at_risk"
      ? "At Risk"
      : readiness.band === "borderline"
        ? "Borderline"
        : readiness.band === "passing_range"
          ? "Passing Range"
          : "Strong";

  const lines: string[] = [
    `Score: ${readiness.score} (${bandLabel}).`,
    `Confidence in this snapshot: ${readiness.confidence}.`,
    "",
    "Factors:",
    ...readiness.factors.map((f) => {
      const v = f.value != null ? ` (${f.value})` : "";
      return `• ${f.label}: ${f.summary}${v}`;
    }),
  ];

  return {
    intent: "readiness_explain",
    title: titleForIntent("readiness_explain"),
    content: lines.join("\n"),
    deterministic: true,
    followUp: followUpsForIntent("readiness_explain"),
  };
}

export function formatStudyPriorityResponse(priorities: WeaknessPriority[]): CoachResponsePayload {
  if (priorities.length === 0) {
    return {
      intent: "study_priority_ranked",
      title: titleForIntent("study_priority_ranked"),
      content: "No weak topics are flagged yet. After more graded practice, ranked priorities will appear here.",
      deterministic: true,
      followUp: followUpsForIntent("study_priority_ranked"),
    };
  }
  const lines: string[] = ["Ranked focus (highest first):", ""];
  priorities.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.label} (score ${p.priorityScore})`);
    p.reasons.forEach((r) => lines.push(`   • ${r}`));
    lines.push("");
  });
  return {
    intent: "study_priority_ranked",
    title: titleForIntent("study_priority_ranked"),
    content: lines.join("\n").trim(),
    deterministic: true,
    followUp: followUpsForIntent("study_priority_ranked"),
  };
}

export function formatPatternInsightResponse(patterns: LearnerPatternSnapshot): CoachResponsePayload {
  const parts: string[] = [];
  if (patterns.summarySignals.length) {
    parts.push("Summary");
    patterns.summarySignals.forEach((s) => parts.push(`• ${s}`));
    parts.push("");
  }
  if (patterns.repeatedWeakTopics.length) {
    parts.push("Topics with repeated misses");
    patterns.repeatedWeakTopics.forEach((t) => parts.push(`• ${t}`));
    parts.push("");
  }
  if (patterns.improvingTopics.length) {
    parts.push("Improving topics");
    patterns.improvingTopics.forEach((t) => parts.push(`• ${t}`));
    parts.push("");
  }
  if (patterns.timingPatterns.length) {
    parts.push("Timing and difficulty");
    patterns.timingPatterns.forEach((t) => parts.push(`• ${t}`));
    parts.push("");
  }
  if (patterns.reviewHabits.length) {
    parts.push("Review habits");
    patterns.reviewHabits.forEach((t) => parts.push(`• ${t}`));
    parts.push("");
  }
  if (patterns.confidencePatterns.length) {
    parts.push("Accuracy pattern");
    patterns.confidencePatterns.forEach((t) => parts.push(`• ${t}`));
  }
  const content =
    parts.length > 0
      ? parts.join("\n").trim()
      : "Patterns are still forming. More sessions will produce clearer signals.";

  return {
    intent: "pattern_insight",
    title: titleForIntent("pattern_insight"),
    content,
    deterministic: true,
    followUp: followUpsForIntent("pattern_insight"),
  };
}

export function formatInterventionResponse(top: CoachIntervention): CoachResponsePayload {
  return {
    intent: "intervention_alert",
    title: top.title,
    content: top.message,
    deterministic: true,
    followUp: top.recommendedAction
      ? [{ label: top.recommendedAction.label, intent: top.recommendedAction.intent }]
      : followUpsForIntent("intervention_alert"),
  };
}

/** Minimal context for lesson page priority match when dashboard snapshot is not loaded. */
export function buildMinimalCoachContextFromStudySnapshot(snap: LearnerStudySnapshot): CoachContextInput {
  return {
    recentAccuracyPct: null,
    weakTopicCount: snap.weakTopics.length,
    weakTopics: snap.weakTopics.slice(0, 20).map((w) => ({
      topic: w.topic,
      topicSlug: (w.normalizedTopic ?? normalizeTopicKey(w.topic)).trim() || normalizeTopicKey(w.topic),
      missRate: w.missRate,
      attempted: w.attempted,
      wrongStreak: w.wrongStreak,
    })),
    topicsImproving: snap.topicTrends.filter((t) => t.momentum === "improving").map((t) => t.topic),
    topicsDeclining: snap.topicTrends.filter((t) => t.momentum === "declining").map((t) => t.topic),
    recentSessionsSample: 0,
    mockExamAvgPct: null,
    catOrPracticeAvgPct: null,
    reviewCompletionRate: null,
    daysSinceLastActivity: null,
    difficultyGapScore: null,
    appReadinessScore: null,
    practiceTrend: null,
    lessonsCompletedRatio: null,
  };
}

export function lessonTopicMatchesTopPriority(
  topicSlug: string | null | undefined,
  snap: LearnerStudySnapshot,
): boolean {
  if (!topicSlug?.trim()) return false;
  const ranked = rankStudyPriorities(buildMinimalCoachContextFromStudySnapshot(snap), 3);
  const key = normalizeTopicKey(topicSlug);
  return ranked.some((r) => r.topicSlug === key);
}

export { filterInterventionsByCooldown, rankInterventions };

/**
 * Load dashboard + study snapshots and build the coach bundle (for API deterministic intents).
 */
export async function loadCoachBundleForApi(
  userId: string,
  entitlement: AccessScope,
): Promise<CoachDashboardBundle | null> {
  const [snapshot, studySnap] = await Promise.all([
    loadPremiumDashboardSnapshot(userId, entitlement),
    buildLearnerStudySnapshot(userId, entitlement, undefined),
  ]);
  if (!snapshot || !studySnap) return null;
  const days = await loadDaysSinceLastActivity(userId);
  return buildCoachDashboardBundle(snapshot, studySnap, days);
}
