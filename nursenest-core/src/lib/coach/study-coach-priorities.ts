import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import type { CoachContextInput, WeaknessPriority } from "./study-coach-types";

const EXAM_WEIGHT_DEFAULT = 1;

function recencyDecay(attempted: number): number {
  if (attempted <= 0) return 0.35;
  if (attempted < 5) return 0.55;
  if (attempted < 15) return 0.75;
  return 1;
}

function trendMultiplier(topicLabel: string, improving: string[], declining: string[]): number {
  const t = topicLabel.trim().toLowerCase();
  if (declining.some((d) => d.trim().toLowerCase() === t)) return 1.15;
  if (improving.some((i) => i.trim().toLowerCase() === t)) return 0.92;
  return 1;
}

/**
 * Deterministic ranked "what to study next" list.
 * Uses only normalized learner signals so output stays explainable.
 */
export function rankStudyPriorities(input: CoachContextInput, maxItems = 6): WeaknessPriority[] {
  const rows = input.weakTopics.slice(0, 20);
  if (rows.length === 0) return [];

  const scored = rows.map((w) => {
    const slug = w.topicSlug || normalizeTopicKey(w.topic);
    const severity = clamp01(w.missRate / 100) * 40;
    const streakBoost = Math.min(18, (w.wrongStreak ?? 0) * 3);
    const attemptSignal = Math.min(15, Math.log10(w.attempted + 1) * 8);
    const recency = recencyDecay(w.attempted) * 12;
    const examW = EXAM_WEIGHT_DEFAULT * 8;
    const diffGap = (input.difficultyGapScore ?? 50) / 100;
    const difficulty = diffGap * 6;
    const trend = trendMultiplier(w.topic, input.topicsImproving, input.topicsDeclining) * 6;
    const unfinished = (input.reviewCompletionRate != null && input.reviewCompletionRate < 0.35 ? 1.2 : 1) * 4;

    const priorityScore =
      severity +
      streakBoost +
      attemptSignal +
      recency +
      examW +
      difficulty +
      trend +
      unfinished;

    const reasons: string[] = [];
    if (w.missRate >= 55) reasons.push(`Miss rate near ${w.missRate}% across recent attempts.`);
    if ((w.wrongStreak ?? 0) >= 2) reasons.push("Repeated misses recently on this topic.");
    if (w.attempted < 8) reasons.push("Still thin evidence, but early misses matter.");
    if (input.topicsDeclining.some((d) => d.trim().toLowerCase() === w.topic.trim().toLowerCase())) {
      reasons.push("Trend shows more misses than before.");
    }
    if (reasons.length === 0) reasons.push("Ranked from ledger and session weak-topic signals.");

    const suggestedActions: string[] = [
      "Short question drill on this topic",
      "Review matching lesson section",
      "Revisit rationales for last misses",
    ];

    return {
      topicSlug: slug,
      label: w.topic,
      priorityScore: Math.round(priorityScore * 10) / 10,
      reasons,
      suggestedActions,
    };
  });

  scored.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
    return a.topicSlug.localeCompare(b.topicSlug);
  });

  return scored.slice(0, maxItems);
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
