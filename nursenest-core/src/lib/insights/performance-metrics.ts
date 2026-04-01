import type { ConsistencyLabel, PerformanceAnalysis, PerformanceTrend, TopicAccuracyRow } from "@/lib/insights/types";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Mock trend from up to last 5 attempts (oldest → newest).
 */
export function mockPerformanceTrend(mocks: { score: number; total: number }[]): PerformanceTrend {
  const usable = mocks.filter((m) => m.total >= 5).slice(0, 5);
  if (usable.length < 2) return "unknown";
  const pcts = usable.map((m) => (m.total > 0 ? (m.score / m.total) * 100 : 0));
  const first = pcts[pcts.length - 1]!;
  const prev = pcts[pcts.length - 2]!;
  const delta = first - prev;
  if (delta >= 4) return "improving";
  if (delta <= -4) return "declining";
  return "stable";
}

export function mockPercentSpread(mocks: { score: number; total: number }[]): number | null {
  const usable = mocks.filter((m) => m.total >= 5);
  if (usable.length < 2) return null;
  const pcts = usable.map((m) => (m.total > 0 ? (m.score / m.total) * 100 : 0));
  const mean = pcts.reduce((a, b) => a + b, 0) / pcts.length;
  const v = pcts.reduce((s, p) => s + (p - mean) ** 2, 0) / pcts.length;
  return Math.sqrt(v);
}

export function consistencyFromSpread(spread: number | null): ConsistencyLabel {
  if (spread == null) return "unknown";
  if (spread <= 8) return "tight";
  if (spread <= 18) return "moderate";
  return "volatile";
}

export function buildTopicAccuracyRows(
  weak: WeakTopicRow[],
  strong: WeakTopicRow[],
): TopicAccuracyRow[] {
  const map = new Map<string, TopicAccuracyRow>();
  for (const r of [...weak, ...strong]) {
    const attempted = r.attempted;
    const correct = Math.max(0, attempted - r.missed);
    const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
    map.set(r.topic, {
      topic: r.topic,
      subtopic: null,
      correct,
      attempted,
      accuracyPct: acc,
      weightedAccuracy: attempted > 0 ? correct / attempted : null,
    });
  }
  return [...map.values()].sort((a, b) => (b.attempted || 0) - (a.attempted || 0));
}

export function buildPerformanceAnalysis(args: {
  sessionGrading: { correct: number; total: number; sessionCount: number };
  recencyWeighted: { correct: number; total: number } | null;
  weakTopics: WeakTopicRow[];
  strongTopics: WeakTopicRow[];
  recentMocks: { score: number; total: number; at: string }[];
}): PerformanceAnalysis {
  const { sessionGrading, recencyWeighted, weakTopics, strongTopics, recentMocks } = args;
  const total = sessionGrading.total;
  const overallAccuracyPct =
    total > 0 ? Math.round((sessionGrading.correct / total) * 100) : null;
  const rw = recencyWeighted;
  const recencyWeightedAccuracyPct =
    rw && rw.total > 0 ? Math.round((rw.correct / rw.total) * 100) : null;

  const mockTrend = mockPerformanceTrend(recentMocks);
  const spread = mockPercentSpread(recentMocks);
  const mockConsistency = consistencyFromSpread(spread);

  let trendSummary = "";
  if (mockTrend === "improving") {
    trendSummary = "Recent mock scores trend upward — keep pairing review with new questions.";
  } else if (mockTrend === "declining") {
    trendSummary = "Recent mocks are softer than earlier attempts — slow down and review rationales before volume.";
  } else if (mockTrend === "stable") {
    trendSummary = "Mock performance is steady — use weak-topic drills to move the needle.";
  } else {
    trendSummary = "Not enough comparable mock data yet — trend will appear after two full attempts with 5+ items each.";
  }
  if (mockConsistency === "volatile" && spread != null) {
    trendSummary += ` Mock scores vary by ~${Math.round(spread)}% — consistency matters as much as a single high score.`;
  }

  return {
    overallAccuracyPct,
    recencyWeightedAccuracyPct,
    byTopic: buildTopicAccuracyRows(weakTopics, strongTopics),
    mockTrend,
    mockConsistency,
    trendSummary: trendSummary.trim(),
  };
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return clamp(n, 0, 1);
}

/**
 * Optional: blend readiness with CAT stability — never a fake “pass chance”.
 */
export function catReadinessNudge(args: {
  readinessScore: number | null;
  catSe: number | null;
}): number | null {
  if (args.readinessScore == null || args.catSe == null) return args.readinessScore;
  if (args.catSe > 0.85) return args.readinessScore;
  /** Small damping when CAT estimate is still noisy — honest uncertainty. */
  const damp = clamp01(1 - (0.85 - args.catSe) * 0.15);
  return Math.round(args.readinessScore * damp);
}
