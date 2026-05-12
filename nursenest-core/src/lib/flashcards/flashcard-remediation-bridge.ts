/**
 * Bridge between UserRemediationQueue and flashcard weak-queue ordering.
 *
 * When a learner misses a practice/CAT question the remediation engine writes a
 * UserRemediationQueue row. This module reads those rows and re-orders flashcard
 * results so missed-topic cards surface first, with danger-aware priority.
 *
 * Design:
 *   - Read-only: does NOT modify FlashcardProgress or UserRemediationQueue.
 *   - Additive: called from loadWeakAreaFlashcardsForUser before the shuffle step.
 *   - Feature-flagged: respects NN_ENABLE_REMEDIATION_ENGINE.
 *   - Never throws: swallows errors to avoid breaking the weak queue.
 */

import { prisma } from "@/lib/db";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import {
  buildResurfacingQueue,
  computeResurfacingSignals,
} from "@/lib/remediation/resurfacing-priority";

const MAX_BOOST_TOPICS = 10;

export type RemediationBoostMap = Map<string, number>;

/**
 * Returns a map of normalizedTopicKey → composite boost score for active
 * remediation queue items. Applies danger-level and chronic-weak-area boosts
 * on top of the raw priorityScore so prescribing-safety topics always surface first.
 *
 * Returns empty map when remediation engine is disabled or on any error.
 */
export async function loadRemediationBoostMap(
  userId: string,
  pathwayId: string | null,
): Promise<RemediationBoostMap> {
  if (!isRemediationEngineEnabled()) return new Map();
  try {
    const now = new Date();
    const rows = await prisma.userRemediationQueue.findMany({
      where: {
        userId,
        resolved: false,
        nextReviewAt: { lte: now },
        ...(pathwayId ? { pathwayId } : {}),
      },
      select: {
        id: true,
        topicKey: true,
        topic: true,
        priorityScore: true,
        mistakeCount: true,
        nextReviewAt: true,
      },
      orderBy: { priorityScore: "desc" },
      take: MAX_BOOST_TOPICS * 3, // over-fetch before dedup+sort
    });

    if (rows.length === 0) return new Map();

    // Apply danger-aware resurfacing pipeline (dedup + sort)
    const resurfaced = buildResurfacingQueue(
      rows.map((r) => ({
        id: r.id,
        topicKey: r.topicKey,
        topic: r.topic,
        priorityScore: r.priorityScore,
        mistakeCount: r.mistakeCount,
        nextReviewAt: r.nextReviewAt,
      })),
    );

    // Compute composite boost signals
    const signals = computeResurfacingSignals(resurfaced);

    // Build final map: normalizedKey → totalBoost score (capped to MAX_BOOST_TOPICS)
    const map: RemediationBoostMap = new Map();
    let count = 0;
    for (const [key, signal] of signals) {
      if (count >= MAX_BOOST_TOPICS) break;
      if (signal.totalBoost > 0) {
        map.set(key, signal.totalBoost);
        count++;
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

/**
 * Re-orders weak flashcard rows so cards whose normalized topic appears in the
 * remediation boost map move to the front.
 *
 * Within the boosted group: sorted by descending boost score (danger-aware).
 * Non-boosted cards retain their incoming order.
 * Never mutates the original array.
 */
export function applyRemediationBoost<T extends { topic: string }>(
  cards: T[],
  boostMap: RemediationBoostMap,
): T[] {
  if (boostMap.size === 0) return cards;

  const boosted: Array<{ card: T; score: number }> = [];
  const unboosted: T[] = [];

  for (const card of cards) {
    const key = normalizeTopicKey(card.topic);
    const score = boostMap.get(key) ?? 0;
    if (score > 0) {
      boosted.push({ card, score });
    } else {
      unboosted.push(card);
    }
  }

  boosted.sort((a, b) => b.score - a.score);
  return [...boosted.map((b) => b.card), ...unboosted];
}
