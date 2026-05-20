/**
 * Pure helpers for adaptive / CAT-style question selection on top of paginated pools.
 * Server routes should still fetch IDs with `take` + `skip` or random ORDER BY — never load full banks.
 */

export type DifficultyBand = "low" | "mid" | "high";

export type TopicWeight = { topicKey: string; weight: number };

/** Map Prisma difficulty (1–5) to coarse bands for stratified draws. */
export function difficultyBandFromScore(d: number | null | undefined): DifficultyBand {
  const x = typeof d === "number" && Number.isFinite(d) ? Math.round(d) : 3;
  const clamped = Math.min(5, Math.max(1, x));
  if (clamped <= 2) return "low";
  if (clamped >= 4) return "high";
  return "mid";
}

/**
 * After weak-area diagnostics, overweight underrepresented topics (weights need not sum to 1).
 */
export function reweightTopicsForWeakAreas(
  topicCounts: Record<string, number>,
  weakTopics: string[],
  boost = 2,
): TopicWeight[] {
  const keys = Object.keys(topicCounts);
  if (keys.length === 0) return [];
  const weak = new Set(weakTopics);
  return keys.map((topicKey) => ({
    topicKey,
    weight: weak.has(topicKey) ? topicCounts[topicKey]! * boost : topicCounts[topicKey]!,
  }));
}

/** Simple 3-parameter logistic ability estimate from binary outcomes (CAT-style placeholder). */
export function estimateAbilityLogistic(correct: number, incorrect: number, prior = 0): number {
  const c = Math.max(0, correct);
  const i = Math.max(0, incorrect);
  if (c + i === 0) return prior;
  const p = (c + 0.5) / (c + i + 1);
  const logit = Math.log(p / (1 - p));
  return prior * 0.25 + logit * 0.75;
}

/**
 * Target next difficulty (1–5) from ability — higher ability → harder items.
 */
export function suggestedDifficultyTarget(ability: number): number {
  const t = (Math.tanh(ability / 3) + 1) / 2;
  return Math.min(5, Math.max(1, Math.round(1 + t * 4)));
}

/**
 * Pick topic for the next item using weights (deterministic tie-break with hash of step index).
 */
export function pickTopicByWeight(weights: TopicWeight[], stepIndex: number): string | null {
  if (weights.length === 0) return null;
  const sum = weights.reduce((s, w) => s + Math.max(0, w.weight), 0);
  if (sum <= 0) return weights[0]!.topicKey;
  let r = (Math.sin(stepIndex * 12.9898) * 43758.5453) % 1;
  if (r < 0) r += 1;
  let acc = 0;
  const target = r * sum;
  for (const w of weights) {
    acc += Math.max(0, w.weight);
    if (target <= acc) return w.topicKey;
  }
  return weights[weights.length - 1]!.topicKey;
}

/** Exclude IDs already served in-session or in recent history. */
export function filterSeenIds<T extends { id: string }>(rows: T[], seen: ReadonlySet<string>): T[] {
  return rows.filter((r) => !seen.has(r.id));
}
