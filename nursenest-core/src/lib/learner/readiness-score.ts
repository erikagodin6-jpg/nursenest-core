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

export type ReadinessResult = {
  /** Integer 0–100, or null when we refuse to infer a number. */
  score: number | null;
  band: ReadinessBand;
  confidence: ReadinessConfidence;
  /** Why the score exists or does not. */
  summary: string;
  factors: ReadinessFactor[];
  /** What to improve (deterministic from inputs). */
  whatToImprove: string[];
  /** Recommended next actions. */
  nextActions: string[];
  /** Lowest-scoring factors (plain labels)—what is limiting readiness most. */
  holdingBack: string[];
};

/** Minimum graded items from sessions to treat practice accuracy as a signal. */
const MIN_PRACTICE_ITEMS = 15;

/** Minimum mock attempts to use mock trend as a medium+ signal. */
const MIN_MOCK_ATTEMPTS = 1;

/** Minimum questions in a single mock to count that attempt toward “recent performance”. */
const MIN_QUESTIONS_PER_MOCK = 5;

/** We only emit a numeric score if at least one strong signal exists. */
function hasMinimumSignal(practiceTotal: number, mocks: ReadinessMockInput[]): boolean {
  const mockUsable = mocks.filter((m) => m.total >= MIN_QUESTIONS_PER_MOCK);
  return practiceTotal >= MIN_PRACTICE_ITEMS || mockUsable.length >= MIN_MOCK_ATTEMPTS;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function bandFromScore(score: number): Exclude<ReadinessBand, "insufficient_data"> {
  if (score < 40) return "not_ready";
  if (score < 60) return "improving";
  if (score < 80) return "near_ready";
  return "ready";
}

function confidenceLevel(practiceTotal: number, mockCount: number): ReadinessConfidence {
  if (practiceTotal >= 60 && mockCount >= 2) return "high";
  if (practiceTotal >= MIN_PRACTICE_ITEMS || mockCount >= 2) return "medium";
  return "low";
}

/** Std dev of mock % when 2+ usable mocks — high spread lowers confidence in a single “score”. */
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
}): ReadinessResult {
  const {
    practiceCorrect,
    practiceTotal,
    recentMocks,
    weakTopics: weakTopicsRaw,
    lessonsCompleted,
    lessonsAvailable,
  } = args;

  const weakTopics = [...weakTopicsRaw].sort(
    (a, b) =>
      (b.weakPriorityScore ?? 0) - (a.weakPriorityScore ?? 0) ||
      (b.missRate ?? 0) - (a.missRate ?? 0) ||
      a.topic.localeCompare(b.topic),
  );

  const usableMocks = recentMocks.filter((m) => m.total >= MIN_QUESTIONS_PER_MOCK).slice(0, 3);

  if (!hasMinimumSignal(practiceTotal, recentMocks)) {
    return {
      score: null,
      band: "insufficient_data",
      confidence: "low",
      summary:
        "We need more scored practice (about 15+ graded items in timed sessions) or at least one mock with 5+ questions before a readiness number is meaningful.",
      factors: [],
      whatToImprove: [
        "Complete a timed practice or mock exam so we can measure accuracy and topics.",
        "Finish lessons in your plan to raise completion toward your exam date.",
      ],
      nextActions: [
        "Run a block in the question bank or a practice exam, then return here.",
        "Open Lessons and complete at least one module in your tier.",
      ],
      holdingBack: [],
    };
  }

  const factors: ReadinessFactor[] = [];

  /** Practice accuracy factor (0–35) */
  let practicePoints = 0;
  let practiceMax = 0;
  if (practiceTotal >= MIN_PRACTICE_ITEMS) {
    practiceMax = 35;
    const acc = practiceTotal > 0 ? practiceCorrect / practiceTotal : 0;
    practicePoints = Math.round(35 * clamp01(acc));
    factors.push({
      id: "practice_accuracy",
      label: "Practice accuracy",
      points: practicePoints,
      maxPoints: practiceMax,
      detail: `${practiceCorrect}/${practiceTotal} graded items correct in recent completed sessions (your plan scope).`,
    });
  } else {
    factors.push({
      id: "practice_accuracy",
      label: "Practice accuracy",
      points: 0,
      maxPoints: 0,
      detail: `Only ${practiceTotal} graded items — need at least ${MIN_PRACTICE_ITEMS} before this signal is included in the denominator.`,
    });
  }

  /** Mock performance (0–30) */
  let mockPoints = 0;
  let mockMax = 0;
  if (usableMocks.length >= MIN_MOCK_ATTEMPTS) {
    mockMax = 30;
    const avgPct =
      usableMocks.reduce((s, m) => s + (m.total > 0 ? (m.score / m.total) * 100 : 0), 0) / usableMocks.length;
    mockPoints = Math.round(30 * clamp01(avgPct / 100));
    const spread = mockPercentStdDev(recentMocks);
    let mockDetail = `Average ${Math.round(avgPct)}% across ${usableMocks.length} recent mock attempt(s) (5+ items each).`;
    if (spread != null && spread > 12) {
      mockDetail += ` Spread is ~${Math.round(spread)}% between mocks—readiness weights consistency, not one lucky run.`;
      const dampen = Math.max(0.72, 1 - (spread - 12) / 140);
      mockPoints = Math.round(mockPoints * dampen);
    }
    factors.push({
      id: "mock_performance",
      label: "Recent mock performance",
      points: mockPoints,
      maxPoints: mockMax,
      detail: mockDetail,
    });
  } else {
    factors.push({
      id: "mock_performance",
      label: "Recent mock performance",
      points: 0,
      maxPoints: 0,
      detail: "No recent mock with 5+ items — this signal is omitted from the denominator until you complete one.",
    });
  }

  /** Topic error pressure (0–25): lower miss concentration → higher score */
  let topicPoints = 0;
  const topicMax = 25;
  if (weakTopics.length === 0) {
    topicPoints = 25;
    factors.push({
      id: "topic_errors",
      label: "Topic error load",
      points: topicPoints,
      maxPoints: topicMax,
      detail: "No recorded topic misses in recent scored sessions — or not enough data to attribute errors yet.",
    });
  } else {
    const top = weakTopics.slice(0, 3);
    const weights = top.map((t) => Math.max(0.12, (t.weakPriorityScore ?? 0.5) + 0.12));
    const wSum = weights.reduce((s, w) => s + w, 0) || 1;
    const avgMiss = top.reduce((s, t, i) => s + t.missRate * (weights[i] ?? 1), 0) / wSum;
    topicPoints = Math.round(25 * clamp01(1 - avgMiss / 100));
    factors.push({
      id: "topic_errors",
      label: "Topic error load",
      points: topicPoints,
      maxPoints: topicMax,
      detail: `Weighted miss pressure on priority weak topics ~${Math.round(avgMiss)}% (ledger + sessions). Lower is better.`,
    });
  }

  /** Lesson completion (0–15) */
  let lessonMax = 0;
  let lessonPoints = 0;
  if (lessonsAvailable > 0) {
    lessonMax = 15;
    lessonPoints = Math.round(15 * clamp01(lessonsCompleted / lessonsAvailable));
    factors.push({
      id: "lesson_completion",
      label: "Lesson completion",
      points: lessonPoints,
      maxPoints: lessonMax,
      detail: `${lessonsCompleted} of ${lessonsAvailable} lessons completed in your plan pool.`,
    });
  } else {
    factors.push({
      id: "lesson_completion",
      label: "Lesson completion",
      points: 0,
      maxPoints: 0,
      detail: "No lesson pool counted for your scope — pathway or catalog may still be loading.",
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

  let confidence = confidenceLevel(practiceTotal, usableMocks.length);
  if (spread != null && spread > 18 && confidence === "high") {
    confidence = "medium";
  }

  const summary =
    confidence === "high"
      ? "Readiness blends recent session accuracy, mock scores, topic misses, and lesson completion. It is indicative—not a pass guarantee."
      : confidence === "medium"
        ? "Readiness is preliminary: add more timed practice and mocks to tighten this estimate."
        : "Readiness is early: numbers will move as you complete more full sessions.";

  const whatToImprove: string[] = [];
  if (practiceTotal >= MIN_PRACTICE_ITEMS && practiceCorrect / practiceTotal < 0.65) {
    whatToImprove.push("Raise session accuracy: review rationales on misses before adding volume.");
  }
  if (usableMocks.length && usableMocks.reduce((s, m) => s + m.score / m.total, 0) / usableMocks.length < 0.65) {
    whatToImprove.push("Bring mock scores up with smaller topic-focused blocks before long mocks.");
  }
  if (weakTopics.length) {
    whatToImprove.push(
      `Drill weak topics: ${weakTopics
        .slice(0, 3)
        .map((w) => w.topic)
        .join(", ")}.`,
    );
  }
  if (lessonsAvailable > 0 && lessonsCompleted / lessonsAvailable < 0.3) {
    whatToImprove.push("Advance lesson completion in your plan pool to align content with practice.");
  }
  if (whatToImprove.length === 0) {
    whatToImprove.push("Keep mixing lessons, topic drills, and full mocks week over week.");
  }

  const nextActions: string[] = [];
  if (weakTopics[0]) {
    nextActions.push(`Practice topic “${weakTopics[0].topic}” in the question bank.`);
  }
  nextActions.push("Schedule one full mock this week and review every miss.");
  nextActions.push("Complete the next lesson in your pathway, then repeat a short quiz on the same topic.");

  const holdingBack: string[] = [];
  for (const f of factors) {
    if (f.maxPoints <= 0) continue;
    const ratio = f.points / f.maxPoints;
    if (ratio < 0.42) holdingBack.push(f.label);
  }

  return {
    score,
    band,
    confidence,
    summary,
    factors,
    whatToImprove: whatToImprove.slice(0, 5),
    nextActions: nextActions.slice(0, 4),
    holdingBack: holdingBack.slice(0, 3),
  };
}

export function readinessBandLabel(band: ReadinessBand): string {
  switch (band) {
    case "insufficient_data":
      return "Building profile";
    case "not_ready":
      return "Not ready";
    case "improving":
      return "Improving";
    case "near_ready":
      return "Near ready";
    case "ready":
      return "Ready";
    default:
      return band;
  }
}
