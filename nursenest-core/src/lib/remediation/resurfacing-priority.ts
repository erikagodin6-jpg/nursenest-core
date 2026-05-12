/**
 * Adaptive resurfacing priority for the remediation engine.
 *
 * Decides ordering within an already-scored remediation queue by applying
 * danger-level, prescribing-safety, and chronic-weak-area boosts on top of
 * the raw priorityScore. Separate from the scoring formula used at capture
 * time (remediation-scoring.ts) so resurfacing can be tuned independently.
 *
 * Key invariants:
 *  - Never throws — all errors degrade gracefully to the raw input order.
 *  - Never mutates input arrays.
 *  - Deduplication collapses same-topic rows before ordering to prevent queue explosion.
 *  - Stable sort: equal-score ties preserve insertion order.
 */

import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { isPrescribingSafetyTopic, topicDangerLevel } from "@/lib/remediation/topic-taxonomy";

export type ResurfacingEntry = {
  id: string;
  topicKey: string;
  topic: string | null;
  priorityScore: number;
  mistakeCount: number;
  nextReviewAt: Date;
};

export type ResurfacingSignal = {
  topicKey: string;
  dangerBoost: number;
  chronicBoost: number;
  totalBoost: number;
};

// ── Deduplication ─────────────────────────────────────────────────────────────

/**
 * Collapse multiple queue entries that normalize to the same topic key.
 * Keeps the highest-scoring row per normalized key to prevent duplicate
 * resurfacing of the same weak area via different body-system paths.
 */
export function deduplicateResurfacingEntries<T extends { topicKey: string; priorityScore: number }>(
  entries: T[],
): T[] {
  const seen = new Map<string, T>();
  for (const entry of entries) {
    const key = normalizeTopicKey(entry.topicKey);
    const existing = seen.get(key);
    if (!existing || entry.priorityScore > existing.priorityScore) {
      seen.set(key, entry);
    }
  }
  return Array.from(seen.values());
}

// ── Signal computation ────────────────────────────────────────────────────────

/**
 * Compute per-topic resurfacing boost signals from a batch of queue entries.
 * Returns a Map keyed by normalized topic key for O(1) lookup.
 */
export function computeResurfacingSignals(
  entries: ResurfacingEntry[],
): Map<string, ResurfacingSignal> {
  const signals = new Map<string, ResurfacingSignal>();

  for (const entry of entries) {
    const key = normalizeTopicKey(entry.topic ?? entry.topicKey);
    const dangerLevel = topicDangerLevel(entry.topic);
    const isPrescribing = isPrescribingSafetyTopic(entry.topic);

    let dangerBoost = 0;
    if (isPrescribing || dangerLevel === "critical") dangerBoost = 30;
    else if (dangerLevel === "high") dangerBoost = 15;

    // Chronic: every accumulated mistake adds urgency, capped at 30.
    const chronicBoost = Math.min(entry.mistakeCount * 2, 30);
    const totalBoost = entry.priorityScore + dangerBoost + chronicBoost;

    signals.set(key, { topicKey: key, dangerBoost, chronicBoost, totalBoost });
  }

  return signals;
}

// ── Ordering ──────────────────────────────────────────────────────────────────

const DANGER_ORDER = { critical: 0, high: 1, standard: 2 } as const;

/**
 * Sort queue entries by resurfacing urgency.
 *
 * Tier 1 — prescribing-safety topics (always surface first regardless of score).
 * Tier 2 — critical-danger topics.
 * Tier 3 — high-danger topics.
 * Tier 4 — remaining, ordered by priorityScore DESC + mistakeCount DESC.
 *
 * Stable: equal entries preserve insertion order.
 */
export function sortByResurfacingUrgency(entries: ResurfacingEntry[]): ResurfacingEntry[] {
  return [...entries].sort((a, b) => {
    const aPS = isPrescribingSafetyTopic(a.topic);
    const bPS = isPrescribingSafetyTopic(b.topic);
    if (aPS && !bPS) return -1;
    if (!aPS && bPS) return 1;

    const aD = DANGER_ORDER[topicDangerLevel(a.topic)];
    const bD = DANGER_ORDER[topicDangerLevel(b.topic)];
    if (aD !== bD) return aD - bD;

    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
    return b.mistakeCount - a.mistakeCount;
  });
}

/**
 * Full resurfacing pipeline: deduplicate → sort → return ordered entries.
 *
 * Input entries should already be filtered to `resolved = false` and
 * `nextReviewAt <= now` by the caller.
 */
export function buildResurfacingQueue(entries: ResurfacingEntry[]): ResurfacingEntry[] {
  const deduped = deduplicateResurfacingEntries(entries);
  return sortByResurfacingUrgency(deduped);
}
