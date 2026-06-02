/**
 * Centralized lapse-frequency resolver for the remediation engine.
 *
 * Provides a single batched topic → lapse-count lookup consumed by all
 * remediation call sites (grade, remediation-signal, confidence capture).
 *
 * Design invariants:
 *  - One DB round-trip per call: fetches all FlashcardProgress rows with
 *    lapses > 0, joins through Flashcard → Category to get topicCode, then
 *    aggregates in JS.  Uses @@index([userId, lapses]) so the scan is indexed.
 *  - buildTopicLapseIndex returns Map<normalizedTopicKey, totalLapses>.
 *  - resolveTopicLapseCount is O(1) Map.get after the index is built.
 *  - Never throws: errors degrade to empty map → 0 lapse count.
 *  - Never leaks DB row shapes to routes: callers only see plain numbers.
 *  - Negative or NaN values are clamped to 0.
 */

import type { PrismaClient } from "@prisma/client";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";

export type TopicLapseIndex = Map<string, number>;

// ── Core builder ──────────────────────────────────────────────────────────────

/**
 * Fetch all lapsing flashcard progress for a user and build a topic → total-lapses
 * index in a single DB round-trip.
 *
 * Call once per request/session and share the result across all subsequent
 * resolveTopicLapseCount calls. Never call inside a loop.
 *
 * Falls back to an empty map on any DB error so callers always receive a valid map.
 */
export async function buildTopicLapseIndex(
  prisma: PrismaClient,
  userId: string,
): Promise<TopicLapseIndex> {
  try {
    const rows = await prisma.flashcardProgress.findMany({
      where: { userId, lapses: { gt: 0 } },
      select: {
        lapses: true,
        flashcard: {
          select: {
            category: {
              select: {
                topicCode: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const index: TopicLapseIndex = new Map();
    for (const row of rows) {
      // Prefer topicCode; fall back to category name so non-coded categories still contribute.
      const rawTopic = row.flashcard.category.topicCode ?? row.flashcard.category.name;
      if (!rawTopic) continue;
      const key = normalizeTopicKey(rawTopic);
      index.set(key, (index.get(key) ?? 0) + Math.max(0, row.lapses));
    }
    return index;
  } catch {
    return new Map();
  }
}

// ── Point resolver ────────────────────────────────────────────────────────────

/**
 * Look up the aggregated lapse count for a raw topic string.
 * O(1) after buildTopicLapseIndex has been called.
 * Returns 0 for unknown topics, null/undefined inputs, or negative stored values.
 */
export function resolveTopicLapseCount(
  index: TopicLapseIndex,
  topic: string | null | undefined,
): number {
  if (!topic) return 0;
  return Math.max(0, index.get(normalizeTopicKey(topic)) ?? 0);
}

/**
 * Resolve lapse counts for a set of topics at once.
 * Returns a record keyed by original (un-normalized) topic strings for caller convenience.
 */
export function resolveTopicLapseMap(
  index: TopicLapseIndex,
  topics: ReadonlyArray<string | null | undefined>,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const topic of topics) {
    if (topic) result[topic] = resolveTopicLapseCount(index, topic);
  }
  return result;
}

// ── Empty sentinel ────────────────────────────────────────────────────────────

/**
 * Returns an empty lapse index when remediation is disabled or the lookup is
 * skipped. Avoids conditional branches at call sites.
 */
export function emptyLapseIndex(): TopicLapseIndex {
  return new Map();
}
