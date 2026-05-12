/**
 * Bridge between the existing UserRemediationQueue and flashcard weak-queue ordering.
 *
 * When a learner misses a practice/CAT question, the remediation engine writes a
 * UserRemediationQueue row (see `record-remediation.ts`). This module reads those
 * rows and uses them to re-order flashcard results so missed-topic cards surface first.
 *
 * Design:
 *   - Read-only: does NOT modify FlashcardProgress or UserRemediationQueue.
 *   - Additive: called from `loadWeakAreaFlashcardsForUser` before the shuffle step.
 *   - Feature-flagged: respects `NN_ENABLE_REMEDIATION_ENGINE`.
 *   - Never throws: swallows errors to avoid breaking the weak queue.
 */

import { prisma } from "@/lib/db";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";
import { normalizeTopicLabel } from "@/lib/learner/weak-topics-from-sessions";

const MAX_BOOST_TOPICS = 10;

export type RemediationBoostMap = Map<string, number>;

/**
 * Returns a map of normalizedTopicKey → priorityScore for active remediation queue items.
 * Higher score = higher flashcard priority.
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
        topicKey: true,
        priorityScore: true,
      },
      orderBy: { priorityScore: "desc" },
      take: MAX_BOOST_TOPICS,
    });

    const map: RemediationBoostMap = new Map();
    for (const row of rows) {
      if (row.topicKey && row.priorityScore > 0) {
        map.set(row.topicKey, row.priorityScore);
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

/**
 * Re-orders a list of weak flashcard rows so that cards whose normalized topic
 * appears in the remediation boost map are moved to the front.
 *
 * Within the boosted group, cards are sorted by descending boost score.
 * Non-boosted cards retain their incoming order.
 */
export function applyRemediationBoost<T extends { topic: string }>(
  cards: T[],
  boostMap: RemediationBoostMap,
): T[] {
  if (boostMap.size === 0) return cards;

  const boosted: Array<{ card: T; score: number }> = [];
  const unboosted: T[] = [];

  for (const card of cards) {
    const key = normalizeTopicLabel(card.topic);
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
