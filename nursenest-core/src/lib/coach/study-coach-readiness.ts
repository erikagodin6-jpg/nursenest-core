import type { ReadinessBand, ReadinessFactor, ReadinessScore } from "./study-coach-types";

/** Inputs for {@link computeReadinessScore}, all optional where data may be missing. */
export interface CoachReadinessInput {
  latestReadinessScore: number | null;
  recentAccuracyPct?: number | null;
  practiceAccuracyPct: number | null;
  weakTopicCount: number;
  improvingTopicCount: number;
  decliningTopicCount: number;
  mockExamAvgPct: number | null;
  lessonsCompletedRatio: number | null;
  reviewCompletionRate: number | null;
  daysSinceLastActivity: number | null;
  difficultyGapScore: number | null;
  appReadinessScore: number | null;
  practiceTrend: "improving" | "stable" | "declining" | null;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function bandFromScore(score: number): ReadinessBand {
  if (score < 45) return "at_risk";
  if (score < 62) return "borderline";
  if (score < 80) return "passing_range";
  return "strong";
}

/**
 * Rule-based readiness (0 to 100) for Study Coach surfaces.
 * Does not call the network. When signals are thin, confidence is low and the score is conservative.
 */
export function computeReadinessScore(input: CoachReadinessInput): ReadinessScore {
  const accCombined = input.recentAccuracyPct ?? input.practiceAccuracyPct ?? null;
  const factors: ReadinessFactor[] = [];
  let weighted = 0;
  let weightSum = 0;

  const add = (
    key: string,
    label: string,
    impact: ReadinessFactor["impact"],
    summary: string,
    value: number | string | undefined,
    weight: number,
    contribution: number,
  ) => {
    factors.push({ key, label, impact, summary, value });
    weighted += contribution * weight;
    weightSum += weight;
  };

  if (input.appReadinessScore != null && input.appReadinessScore >= 0) {
    const v = clamp(input.appReadinessScore, 0, 100);
    add(
      "app_readiness",
      "Plan readiness signal",
      v >= 62 ? "positive" : v < 45 ? "negative" : "neutral",
      "Uses the same readiness model already shown elsewhere in the app when a numeric score exists.",
      v,
      0.35,
      v,
    );
  } else {
    add(
      "app_readiness",
      "Plan readiness signal",
      "neutral",
      "Not enough structured activity yet to mirror the full readiness score. Other signals carry more weight.",
      "n/a",
      0.2,
      52,
    );
  }

  if (accCombined != null) {
    const acc = clamp(accCombined, 0, 100);
    const impact: ReadinessFactor["impact"] = acc >= 72 ? "positive" : acc < 58 ? "negative" : "neutral";
    add(
      "recent_accuracy",
      "Recent session accuracy",
      impact,
      "Weighted from recent scored bank and practice sessions when available.",
      `${acc}%`,
      0.28,
      acc,
    );
  } else {
    add(
      "recent_accuracy",
      "Recent session accuracy",
      "neutral",
      "No recent accuracy window yet. Accuracy will appear after more graded work.",
      "n/a",
      0.12,
      55,
    );
  }

  const weakN = clamp(input.weakTopicCount, 0, 12);
  const weakPenalty = clamp(100 - weakN * 6, 40, 100);
  add(
    "weak_topic_load",
    "Weak topic load",
    weakN >= 5 ? "negative" : weakN <= 1 ? "positive" : "neutral",
    "Counts topics flagged as weak from recent performance data.",
    String(weakN),
    0.18,
    weakPenalty,
  );

  if (input.mockExamAvgPct != null) {
    const m = clamp(input.mockExamAvgPct, 0, 100);
    const impact: ReadinessFactor["impact"] = m >= 70 ? "positive" : m < 55 ? "negative" : "neutral";
    add(
      "mock_avg",
      "Recent mock exams",
      impact,
      "Average percent across recent mock attempts when those attempts exist.",
      `${m}%`,
      0.12,
      m,
    );
  } else {
    add(
      "mock_avg",
      "Recent mock exams",
      "neutral",
      "No recent mock average yet. Mocks are optional but help calibration.",
      "n/a",
      0.05,
      58,
    );
  }

  if (input.lessonsCompletedRatio != null) {
    const r = clamp(input.lessonsCompletedRatio, 0, 1);
    const pct = Math.round(r * 100);
    add(
      "lesson_progress",
      "Lesson progress",
      pct >= 35 ? "positive" : pct < 10 ? "negative" : "neutral",
      "Share of available lessons marked complete for the current plan scope.",
      `${pct}%`,
      0.1,
      pct,
    );
  } else {
    add(
      "lesson_progress",
      "Lesson progress",
      "neutral",
      "Lesson completion ratio not available for this profile yet.",
      "n/a",
      0.05,
      55,
    );
  }

  if (input.practiceTrend === "improving") {
    add("trend", "Recent trend", "positive", "Topic momentum shows improvement in recent activity.", "improving", 0.07, 72);
  } else if (input.practiceTrend === "declining") {
    add("trend", "Recent trend", "negative", "Topic momentum shows more misses than before in tracked topics.", "declining", 0.07, 48);
  } else if (input.practiceTrend === "stable") {
    add("trend", "Recent trend", "neutral", "Performance looks steady versus prior weeks.", "stable", 0.05, 58);
  }

  const netTopic = input.improvingTopicCount - input.decliningTopicCount;
  const consistencyScore = clamp(60 + netTopic * 5, 35, 95);
  add(
    "topic_consistency",
    "Topic consistency",
    netTopic > 0 ? "positive" : netTopic < 0 ? "negative" : "neutral",
    "Compares improving versus declining topic counts from recent trends.",
    `${input.improvingTopicCount} up, ${input.decliningTopicCount} down`,
    0.06,
    consistencyScore,
  );

  if (input.reviewCompletionRate != null) {
    const rr = clamp(Math.round(input.reviewCompletionRate * 100), 0, 100);
    add(
      "review_completion",
      "Review follow-through",
      rr >= 50 ? "positive" : rr < 25 ? "negative" : "neutral",
      "Estimated from review-related signals when present.",
      `${rr}%`,
      0.06,
      rr,
    );
  }

  if (input.difficultyGapScore != null) {
    const dg = clamp(input.difficultyGapScore, 0, 100);
    add(
      "difficulty_gap",
      "Harder item performance",
      dg >= 60 ? "negative" : "neutral",
      "Higher values mean more misses on harder tagged items relative to baseline.",
      String(dg),
      0.05,
      100 - dg * 0.4,
    );
  }

  const rawScore = weightSum > 0 ? Math.round(weighted / weightSum) : 55;
  const score = clamp(rawScore, 0, 100);
  const band = bandFromScore(score);

  let confidence: ReadinessScore["confidence"] = "moderate";
  const thin =
    accCombined == null &&
    input.appReadinessScore == null &&
    input.mockExamAvgPct == null &&
    input.weakTopicCount === 0;
  if (thin) confidence = "low";
  if (accCombined != null && input.appReadinessScore != null && input.weakTopicCount > 0) {
    confidence = "high";
  }

  return { score, band, factors, confidence };
}
