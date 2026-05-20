import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

export type TopicMomentum = "improving" | "stable" | "declining";

/**
 * Heuristic momentum from rolling topic stats (no separate time-series table).
 * Tuned for adaptive prioritization: streak + recency of misses + accuracy.
 */
export function computeTopicMomentum(row: WeakTopicRow): TopicMomentum {
  const attempted = row.attempted;
  if (attempted < 2) return "stable";

  const acc = 100 - row.missRate;
  const streak = row.wrongStreak ?? 0;
  const lastWrongMs = row.lastWrongAt ? Date.parse(row.lastWrongAt) : NaN;
  const daysSinceWrong = Number.isFinite(lastWrongMs) ? (Date.now() - lastWrongMs) / 86400000 : 999;

  if (streak >= 3) return "declining";
  if (row.missRate >= 58 && attempted >= 3 && daysSinceWrong < 4) return "declining";
  if (streak >= 2 && daysSinceWrong < 2.5) return "declining";

  if (streak === 0 && attempted >= 4 && daysSinceWrong >= 5 && acc >= 52) return "improving";
  if (row.strength === "strong" && acc >= 72 && attempted >= 3) return "improving";
  if (streak === 0 && attempted >= 6 && daysSinceWrong >= 8 && acc >= 55) return "improving";

  return "stable";
}

export function topicTrendSummary(row: WeakTopicRow, momentum: TopicMomentum): string {
  if (momentum === "improving") {
    return `Accuracy trending up — short mixed sets keep ${row.topic} from slipping.`;
  }
  if (momentum === "declining") {
    return `Recent misses — slow down and review rationales on ${row.topic} before volume.`;
  }
  return `Keep sampling ${row.topic} to confirm whether it stays a priority.`;
}
