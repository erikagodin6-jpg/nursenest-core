import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

/** Minimal mock fields for readiness (avoids circular import with dashboard loader). */
export type ReadinessMockInput = { score: number; total: number };

export type ReadinessBand = "insufficient_data" | "not_ready" | "improving" | "near_ready" | "ready";

export type ReadinessConfidence = "low" | "medium" | "high";

export type ReadinessFactor = {
  id: "practice_accuracy" | "mock_performance" | "topic_errors" | "lesson_completion";
  label: string;
  /** Points earned (0–max for this factor). */
  points: number;
  /** Max points this factor could contribute after renormalization context. */
  maxPoints: number;
  /** Plain-language detail — no false precision. */
  detail: string;
};

export type ReadinessTrend = "improving" | "stable" | "declining";

export type ReadinessResult = {
  /** Integer 0–100, or null when we refuse to infer a number. */
  score: number | null;
  band: ReadinessBand;
  confidence: ReadinessConfidence;
  /** Performance trajectory based on recent vs prior signals. */
  trend: ReadinessTrend | null;
  /** Why the score exists or does not. */
  summary: string;
  factors: ReadinessFactor[];
  /** What to improve (deterministic from inputs). */
  whatToImprove: string[];
  /** Recommended next actions. */
  nextActions: string[];
  /** Lowest-scoring factors (plain labels): what is limiting readiness most. */
  holdingBack: string[];
  /** Top 3 weak topic names for quick display. */
  topWeakAreas: string[];
  /** True when this score is intentionally conservative due to cohort/signal limits. */
  calibratedPreview?: boolean;
};

/** Minimum graded items from sessions to treat practice accuracy as a signal. */
const MIN_PRACTICE_ITEMS = 15;

/** Minimum mock attempts to use mock trend as a medium+ signal. */
const MIN_MOCK_ATTEMPTS = 1;

/** Minimum questions in a single mock to count that attempt toward "recent performance". */
const MIN_QUESTIONS_PER_MOCK = 5;

type ReadinessSignalProfile = {
  minPracticeItems: number;
  minMockAttempts: number;
  confidencePracticeHigh: number;
};

function resolveSignalProfile(scope?: { tier?: string; country?: string }): ReadinessSignalProfile {
  const tier = (scope?.tier ?? "").toUpperCase();
  const country = (scope?.country ?? "").toUpperCase();
  // NP and Allied-CA currently have thinner/less uniform pools; stay intentionally conservative.
  if (tier === "NP" || (tier === "ALLIED" && country === "CA")) {
    return {
      minPracticeItems: 25,
      minMockAttempts: 2,
      confidencePracticeHigh: 80,
    };
  }
  return {
    minPracticeItems: MIN_PRACTICE_ITEMS,
    minMockAttempts: MIN_MOCK_ATTEMPTS,
    confidencePracticeHigh: 60,
  };
}

/** We only emit a numeric score if at least one strong signal exists. */
function hasMinimumSignal(practiceTotal: number, mocks: ReadinessMockInput[], profile: ReadinessSignalProfile): boolean {
  const mockUsable = mocks.filter((m) => m.total >= MIN_QUESTIONS_PER_MOCK);
  return practiceTotal >= profile.minPracticeItems || mockUsable.length >= profile.minMockAttempts;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function bandFromScore(score: number): Exclude<ReadinessBand, "insufficient_data"> {
  if (score < 50) return "not_ready";
  if (score < 70) return "improving";
  if (score < 85) return "near_ready";
  return "ready";
}

function confidenceLevel(practiceTotal: number, mockCount: number, profile: ReadinessSignalProfile): ReadinessConfidence {
  if (practiceTotal >= profile.confidencePracticeHigh && mockCount >= 2) return "high";
  if (practiceTotal >= profile.minPracticeItems || mockCount >= 2) return "medium";
  return "low";
}

/** Std dev of mock % when 2+ usable mocks — high spread lowers confidence in a single "score". */
function mockPercentStdDev(mocks: ReadinessMockInput[]): number | null {
  const usable = mocks.filter((m) => m.total >= MIN_QUESTIONS_PER_MOCK);
  if (usable.length < 2) return null;
  const pcts = usable.map((m) => (m.total > 0 ? (m.score / m.total) * 100 : 0));
  const mean = pcts.reduce((a, b) => a + b, 0) / pcts.length;
  const v = pcts.reduce((s, p) => s + (p - mean) ** 2, 0) / pcts.length;
  return Math.sqrt(v);
}

/**
 * Readiness is a **weighted blend** of observable signals only. Missing inputs contribute **0 points**
 * and reduce the maximum achievable score; we **renormalize** to 0–100 so a user with only mocks
 * is not capped at 70 with unexplained missing points.
 *
 * Weights (when all signals present):
 * - Practice accuracy (session-graded items): 35%
 * - Recent mock % (last up to 3 usable attempts): 30%
 * - Topic error pressure (inverse of avg miss rate on top weak topics; if none, full credit): 25%
 * - Lesson completion vs plan pool: 15%
 */
export function computeReadiness(args: {
  practiceCorrect: number;
  practiceTotal: number;
  recentMocks: ReadinessMockInput[];
  weakTopics: WeakTopicRow[];
  lessonsCompleted: number;
  lessonsAvailable: number;
  /** Optional scope for conservative calibration in thinner cohorts. */
  scope?: { tier?: string; country?: string };
  /**
   * When false, session-graded practice totals must not be interpreted as real zeros —
   * readiness omits the practice factor (0 max) instead of implying “no practice yet”.
   */
  practiceSignalReliable?: boolean;
  /**
   * When false, weak-topic rows must not be interpreted as “no weak areas” —
   * readiness omits the topic factor (0 max) instead of awarding full topic credit.
   */
  topicPerformanceSignalReliable?: boolean;
}): ReadinessResult {
  const {
    practiceCorrect,
    practiceTotal,
    recentMocks,
    weakTopics: weakTopicsRaw,
    lessonsCompleted,
    lessonsAvailable,
    scope,
    practiceSignalReliable = true,
    topicPerformanceSignalReliable = true,
  } = args;
  const signalProfile = resolveSignalProfile(scope);
  const calibratedPreview = signalProfile.minPracticeItems > MIN_PRACTICE_ITEMS;

  const weakTopics = [...weakTopicsRaw].sort(
    (a, b) =>
      (b.weakPriorityScore ?? 0) - (a.weakPriorityScore ?? 0) ||
      (b.missRate ?? 0) - (a.missRate ?? 0) ||
      a.topic.localeCompare(b.topic),
  );

  const usableMocks = recentMocks.filter((m) => m.total >= MIN_QUESTIONS_PER_MOCK).slice(0, 3);

  const practiceTotalForSignals = practiceSignalReliable ? practiceTotal : 0;

  if (!hasMinimumSignal(practiceTotalForSignals, recentMocks, signalProfile)) {
    return {
      score: null,
      band: "insufficient_data",
      confidence: "low",
      trend: null,
      summary:
        calibratedPreview
          ? `Answer at least ${signalProfile.minPracticeItems} practice questions or complete ${signalProfile.minMockAttempts} practice exam(s) so we can calculate your readiness.`
          : "Answer at least 15 practice questions or complete one practice exam so we can calculate your readiness score.",
      factors: [],
      whatToImprove: [
        "Start a practice session or take a practice exam.",
        "Work through lessons in your study plan.",
      ],
      nextActions: [
        "Try a practice session or exam, then check back here.",
        "Start a lesson in your study plan.",
      ],
      holdingBack: [],
      topWeakAreas: [],
      calibratedPreview,
    };
  }

  const factors: ReadinessFactor[] = [];

  /** Practice accuracy factor (0–35) */
  let practicePoints = 0;
  let practiceMax = 0;
  if (!practiceSignalReliable) {
    factors.push({
      id: "practice_accuracy",
      label: "Practice Questions",
      points: 0,
      maxPoints: 0,
      detail:
        "Recent scored practice data could not be loaded. Refresh to try again — this factor is hidden until the signal is available.",
    });
  } else if (practiceTotal >= signalProfile.minPracticeItems) {
    practiceMax = 35;
    const acc = practiceTotal > 0 ? practiceCorrect / practiceTotal : 0;
    practicePoints = Math.round(35 * clamp01(acc));
    factors.push({
      id: "practice_accuracy",
      label: "Practice Questions",
      points: practicePoints,
      maxPoints: practiceMax,
      detail: `${practiceCorrect} of ${practiceTotal} questions answered correctly in recent sessions.`,
    });
  } else {
    factors.push({
      id: "practice_accuracy",
      label: "Practice Questions",
      points: 0,
      maxPoints: 0,
      detail: `${practiceTotal} questions answered so far. Complete at least ${signalProfile.minPracticeItems} to include this in your score.`,
    });
  }

  /** Mock performance (0–30) */
  let mockPoints = 0;
  let mockMax = 0;
  if (usableMocks.length >= signalProfile.minMockAttempts) {
    mockMax = 30;
    const avgPct =
      usableMocks.reduce((s, m) => s + (m.total > 0 ? (m.score / m.total) * 100 : 0), 0) / usableMocks.length;
    mockPoints = Math.round(30 * clamp01(avgPct / 100));
    const spread = mockPercentStdDev(recentMocks);
    let mockDetail = `${Math.round(avgPct)}% average across your ${usableMocks.length} most recent practice exam(s).`;
    if (spread != null && spread > 12) {
      mockDetail += ` Your scores varied quite a bit between exams, so the estimate is weighted toward consistency.`;
      const dampen = Math.max(0.72, 1 - (spread - 12) / 140);
      mockPoints = Math.round(mockPoints * dampen);
    }
    factors.push({
      id: "mock_performance",
      label: "Practice Exams",
      points: mockPoints,
      maxPoints: mockMax,
      detail: mockDetail,
    });
  } else {
    factors.push({
      id: "mock_performance",
      label: "Practice Exams",
      points: 0,
      maxPoints: 0,
      detail: "Complete a full practice exam to include this in your score.",
    });
  }

  /** Topic error pressure (0–25): lower miss concentration → higher score */
  let topicPoints = 0;
  let topicMax = 0;
  if (!topicPerformanceSignalReliable) {
    factors.push({
      id: "topic_errors",
      label: "Topic Strength",
      points: 0,
      maxPoints: 0,
      detail:
        "Topic performance could not be loaded. An empty weak-topic list here does not mean you have no weak areas — refresh to retry.",
    });
  } else {
    topicMax = 25;
    if (weakTopics.length === 0) {
      topicPoints = 25;
      factors.push({
        id: "topic_errors",
        label: "Topic Strength",
        points: topicPoints,
        maxPoints: topicMax,
        detail: "No weak topics identified yet. This improves as you answer more questions.",
      });
    } else {
      const top = weakTopics.slice(0, 3);
      const weights = top.map((t) => Math.max(0.12, (t.weakPriorityScore ?? 0.5) + 0.12));
      const wSum = weights.reduce((s, w) => s + w, 0) || 1;
      const avgMiss = top.reduce((s, t, i) => s + t.missRate * (weights[i] ?? 1), 0) / wSum;
      topicPoints = Math.round(25 * clamp01(1 - avgMiss / 100));
      factors.push({
        id: "topic_errors",
        label: "Topic Strength",
        points: topicPoints,
        maxPoints: topicMax,
        detail: `Your weakest topics have a ~${Math.round(avgMiss)}% miss rate. Bringing this down will lift your score.`,
      });
    }
  }

  /** Lesson completion (0–15) */
  let lessonMax = 0;
  let lessonPoints = 0;
  if (lessonsAvailable > 0) {
    lessonMax = 15;
    lessonPoints = Math.round(15 * clamp01(lessonsCompleted / lessonsAvailable));
    factors.push({
      id: "lesson_completion",
      label: "Lesson Progress",
      points: lessonPoints,
      maxPoints: lessonMax,
      detail: `${lessonsCompleted} of ${lessonsAvailable} lessons finished.`,
    });
  } else {
    factors.push({
      id: "lesson_completion",
      label: "Lesson Progress",
      points: 0,
      maxPoints: 0,
      detail: "Lessons are being set up for your exam track.",
    });
  }

  const earned = practicePoints + mockPoints + topicPoints + lessonPoints;
  const possible = practiceMax + mockMax + topicMax + lessonMax;
  const score = possible > 0 ? Math.round((earned / possible) * 100) : 0;
  let band = bandFromScore(score);
  const spread = mockPercentStdDev(recentMocks);
  if (spread != null && spread > 18 && band === "ready") {
    band = "near_ready";
  }

  let confidence = confidenceLevel(practiceTotalForSignals, usableMocks.length, signalProfile);
  if (spread != null && spread > 18 && confidence === "high") {
    confidence = "medium";
  }

  // Trend: derived from mock progression when 2+ mocks exist
  let trend: ReadinessTrend | null = null;
  if (usableMocks.length >= 2) {
    const latestPct = usableMocks[0]!.total > 0 ? (usableMocks[0]!.score / usableMocks[0]!.total) * 100 : 0;
    const priorPct = usableMocks[1]!.total > 0 ? (usableMocks[1]!.score / usableMocks[1]!.total) * 100 : 0;
    const delta = latestPct - priorPct;
    if (delta > 4) trend = "improving";
    else if (delta < -4) trend = "declining";
    else trend = "stable";
  }

  let summary =
    confidence === "high"
      ? "Based on your recent practice, exam scores, topic performance, and lessons completed."
      : confidence === "medium"
        ? "This estimate will become more precise as you complete more practice sessions and exams."
        : "Early estimate based on limited data. Your score will sharpen with more practice.";
  // NP / Allied-CA profiles use higher minimum signals; surface that the model is intentionally stricter.
  if (calibratedPreview) {
    summary += " Scoring for this exam track is intentionally stricter until signals are stronger.";
  }

  const whatToImprove: string[] = [];
  if (
    practiceSignalReliable &&
    practiceTotal >= MIN_PRACTICE_ITEMS &&
    practiceTotal > 0 &&
    practiceCorrect / practiceTotal < 0.65
  ) {
    whatToImprove.push("Review explanations on missed questions before adding more practice.");
  }
  if (usableMocks.length && usableMocks.reduce((s, m) => s + m.score / m.total, 0) / usableMocks.length < 0.65) {
    whatToImprove.push("Focus on shorter topic drills before taking full-length exams.");
  }
  if (topicPerformanceSignalReliable && weakTopics.length) {
    whatToImprove.push(
      `Focus on weak topics: ${weakTopics
        .slice(0, 3)
        .map((w) => w.topic)
        .join(", ")}.`,
    );
  }
  if (lessonsAvailable > 0 && lessonsCompleted / lessonsAvailable < 0.3) {
    whatToImprove.push("Continue working through lessons to strengthen your foundation.");
  }
  if (whatToImprove.length === 0) {
    whatToImprove.push("Continue alternating between lessons, topic practice, and full exams.");
  }

  const nextActions: string[] = [];
  if (topicPerformanceSignalReliable && weakTopics[0]) {
    nextActions.push(`Practice ${weakTopics[0].topic} questions.`);
  }
  nextActions.push("Take a full practice exam and review your mistakes.");
  nextActions.push("Continue with your next lesson.");

  const holdingBack: string[] = [];
  for (const f of factors) {
    if (f.maxPoints <= 0) continue;
    const ratio = f.points / f.maxPoints;
    if (ratio < 0.42) holdingBack.push(f.label);
  }

  const topWeakAreas = topicPerformanceSignalReliable ? weakTopics.slice(0, 3).map((w) => w.topic) : [];

  return {
    score,
    band,
    confidence,
    trend,
    summary,
    factors,
    whatToImprove: whatToImprove.slice(0, 5),
    nextActions: nextActions.slice(0, 4),
    holdingBack: holdingBack.slice(0, 3),
    topWeakAreas,
    calibratedPreview,
  };
}

export function readinessBandLabel(band: ReadinessBand): string {
  switch (band) {
    case "insufficient_data":
      return "Building Profile";
    case "not_ready":
      return "Needs Focus";
    case "improving":
      return "Developing";
    case "near_ready":
      return "Near Ready";
    case "ready":
      return "Ready";
    default:
      return band;
  }
}

export function readinessBandGuidance(band: ReadinessBand): string {
  switch (band) {
    case "insufficient_data":
      return "We need a bit more data to calculate your score. Complete a practice session or a full exam to get started.";
    case "not_ready":
      return "Your score shows room to grow. Reviewing your weakest topics now will have the biggest impact.";
    case "improving":
      return "You are making progress. Stay consistent with practice and review, especially on topics you find difficult.";
    case "near_ready":
      return "You are in a strong position. A couple more focused sessions on remaining weak spots could push you over the line.";
    case "ready":
      return "You are performing at exam level. Stay sharp with light review and make sure to rest before your exam.";
    default:
      return "";
  }
}

/** CSS class for the main readiness meter fill — aligns color with band semantics. */
export function readinessBandProgressFillClass(band: ReadinessBand): string {
  switch (band) {
    case "ready":
      return "nn-progress-fill-semantic-success";
    case "near_ready":
      return "nn-progress-fill-semantic-brand";
    case "improving":
      return "nn-progress-fill-semantic-readiness";
    case "not_ready":
      return "nn-progress-fill-semantic-warning";
    case "insufficient_data":
    default:
      return "nn-progress-fill-semantic-muted";
  }
}
