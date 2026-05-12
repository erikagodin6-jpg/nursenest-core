/**
 * Server-side helpers for building segmented SRS study queues.
 *
 * Segments (mutually exclusive in count display):
 *   lapsing  — cards with lapses > 0 that are due/overdue (highest priority)
 *   overdue  — nextReviewAt before UTC today AND lapses === 0
 *   due      — nextReviewAt within UTC today AND lapses === 0
 *   new      — never reviewed (no progress row, or repetitions === 0 && lapses === 0)
 *
 * Lapsing cards are excluded from the overdue count to avoid double-counting.
 * All queries are scoped to the subscriber's entitlement (tier + country + allied occupation).
 * Only deck-based cards (deckId != null) are counted; lesson-linked synthetics are excluded.
 */

import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { flashcardPathwayAccessOptionsFromPathwayId } from "@/lib/flashcards/flashcard-pathway-scope";

const SEGMENT_CARD_LIMIT = 50;

export type StudyQueueCounts = {
  newCards: number;
  dueToday: number;
  overdue: number;
  lapsing: number;
  totalReviewed: number;
};

export type StudyQueueCard = {
  id: string;
  front: string;
  back: string;
  deckSlug: string | null;
  pathwayId: string | null;
  topic: string;
  subtopic: string | null;
  sourceKey: string | null;
  segment: "new" | "due" | "overdue" | "lapsing";
  lapses: number;
  intervalDays: number;
  nextReviewAt: string | null;
};

function utcDayBounds(d: Date): { start: Date; end: Date } {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return { start, end };
}

/**
 * Returns per-segment counts for the SRS dashboard (mutually exclusive buckets).
 * Does NOT fetch full card rows — use `loadStudyQueueSegments` for that.
 */
export async function loadStudyQueueCounts(
  userId: string,
  entitlement: AccessScope,
  pathwayId?: string | null,
): Promise<StudyQueueCounts> {
  const now = new Date();
  const { start: todayStart, end: todayEnd } = utcDayBounds(now);
  const pathwayOpts = flashcardPathwayAccessOptionsFromPathwayId(pathwayId ?? null);
  const cardScope = flashcardAccessWhere(entitlement, pathwayOpts);

  // Restrict to deck-based cards only — matches the totalAccessible count and avoids
  // inflating totalReviewed with lesson-linked synthetic progress rows.
  const deckCardWhere = { status: ContentStatus.PUBLISHED, deckId: { not: null as null }, ...cardScope };

  const [dueToday, overdue, lapsing, totalReviewed, totalAccessible] = await Promise.all([
    // Due today — lapses === 0 only (lapsing cards are counted separately)
    prisma.flashcardProgress.count({
      where: {
        userId,
        lapses: 0,
        nextReviewAt: { gte: todayStart, lte: todayEnd },
        flashcard: deckCardWhere,
      },
    }),
    // Overdue — excludes lapsing cards to avoid double-counting
    prisma.flashcardProgress.count({
      where: {
        userId,
        lapses: 0,
        nextReviewAt: { lt: todayStart },
        flashcard: deckCardWhere,
      },
    }),
    // Lapsing: lapses > 0 AND due/overdue now (the highest-priority bucket)
    prisma.flashcardProgress.count({
      where: {
        userId,
        lapses: { gt: 0 },
        nextReviewAt: { lte: todayEnd },
        flashcard: deckCardWhere,
      },
    }),
    // Total reviewed: any card where the user has ever rated it (repetitions > 0 or lapses > 0)
    prisma.flashcardProgress.count({
      where: {
        userId,
        OR: [{ repetitions: { gt: 0 } }, { lapses: { gt: 0 } }],
        flashcard: deckCardWhere,
      },
    }),
    // Total accessible deck cards (denominator for newCards)
    prisma.flashcard.count({
      where: { status: ContentStatus.PUBLISHED, deckId: { not: null }, ...cardScope },
    }),
  ]);

  const newCards = Math.max(0, totalAccessible - totalReviewed);
  return { newCards, dueToday, overdue, lapsing, totalReviewed };
}

/**
 * Loads actual card rows for each segment, then fetches counts in parallel.
 * Ordering: lapsing (highest priority) → overdue → due today.
 * Deduplication via seenIds ensures a card appears in at most one segment.
 */
export async function loadStudyQueueSegments(
  userId: string,
  entitlement: AccessScope,
  pathwayId?: string | null,
  limitPerSegment = SEGMENT_CARD_LIMIT,
): Promise<{ counts: StudyQueueCounts; cards: StudyQueueCard[] }> {
  const now = new Date();
  const { start: todayStart, end: todayEnd } = utcDayBounds(now);
  const pathwayOpts = flashcardPathwayAccessOptionsFromPathwayId(pathwayId ?? null);
  const cardScope = flashcardAccessWhere(entitlement, pathwayOpts);
  const deckCardWhere = { status: ContentStatus.PUBLISHED, deckId: { not: null as null }, ...cardScope };

  const cardSelect = {
    id: true,
    front: true,
    back: true,
    sourceKey: true,
    deck: { select: { slug: true, pathwayId: true } },
    category: { select: { name: true, topicCode: true } },
  } as const;

  const progressSelect = {
    flashcardId: true,
    lapses: true,
    intervalDays: true,
    nextReviewAt: true,
    flashcard: { select: cardSelect },
  } as const;

  // Run segment queries AND count queries in parallel (single DB round-trip batch)
  const [overdueRows, dueTodayRows, lapsingRows, counts] = await Promise.all([
    prisma.flashcardProgress.findMany({
      where: {
        userId,
        lapses: 0,
        nextReviewAt: { lt: todayStart },
        flashcard: deckCardWhere,
      },
      select: progressSelect,
      orderBy: { nextReviewAt: "asc" },
      take: limitPerSegment,
    }),
    prisma.flashcardProgress.findMany({
      where: {
        userId,
        lapses: 0,
        nextReviewAt: { gte: todayStart, lte: todayEnd },
        flashcard: deckCardWhere,
      },
      select: progressSelect,
      orderBy: { nextReviewAt: "asc" },
      take: limitPerSegment,
    }),
    prisma.flashcardProgress.findMany({
      where: {
        userId,
        lapses: { gt: 0 },
        nextReviewAt: { lte: todayEnd },
        flashcard: deckCardWhere,
      },
      select: progressSelect,
      orderBy: { lapses: "desc" },
      take: limitPerSegment,
    }),
    loadStudyQueueCounts(userId, entitlement, pathwayId),
  ]);

  const seenIds = new Set<string>();

  function toCard(
    row: (typeof overdueRows)[number],
    segment: StudyQueueCard["segment"],
  ): StudyQueueCard | null {
    const c = row.flashcard;
    if (!c || seenIds.has(row.flashcardId)) return null;
    seenIds.add(row.flashcardId);
    return {
      id: c.id,
      front: c.front,
      back: c.back,
      deckSlug: c.deck?.slug ?? null,
      pathwayId: c.deck?.pathwayId ?? null,
      topic: c.category.name,
      subtopic: c.category.topicCode ?? null,
      sourceKey: c.sourceKey,
      segment,
      lapses: row.lapses,
      intervalDays: row.intervalDays,
      nextReviewAt: row.nextReviewAt?.toISOString() ?? null,
    };
  }

  const cards: StudyQueueCard[] = [];
  for (const r of lapsingRows) {
    const c = toCard(r, "lapsing");
    if (c) cards.push(c);
  }
  for (const r of overdueRows) {
    const c = toCard(r, "overdue");
    if (c) cards.push(c);
  }
  for (const r of dueTodayRows) {
    const c = toCard(r, "due");
    if (c) cards.push(c);
  }

  return { counts, cards };
}
