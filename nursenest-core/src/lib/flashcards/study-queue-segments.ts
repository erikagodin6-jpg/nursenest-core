/**
 * Server-side helpers for building segmented SRS study queues.
 *
 * Segments:
 *   new      — never reviewed (no FlashcardProgress row, or repetitions === 0 && lapses === 0)
 *   due      — nextReviewAt within UTC today
 *   overdue  — nextReviewAt before UTC today
 *   lapsing  — reviewed cards with lapses > 0 that are due now or overdue
 *   weak     — low lastQuality (< 3) or lapses ≥ 2
 *
 * All queries are scoped to the subscriber's entitlement (tier + country + allied occupation).
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
 * Returns per-segment counts for the SRS dashboard.
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
  const baseCardWhere = { status: ContentStatus.PUBLISHED, ...cardScope };

  const [dueToday, overdue, lapsing, totalReviewed] = await Promise.all([
    prisma.flashcardProgress.count({
      where: {
        userId,
        nextReviewAt: { gte: todayStart, lte: todayEnd },
        flashcard: baseCardWhere,
      },
    }),
    prisma.flashcardProgress.count({
      where: {
        userId,
        nextReviewAt: { lt: todayStart },
        flashcard: baseCardWhere,
      },
    }),
    prisma.flashcardProgress.count({
      where: {
        userId,
        lapses: { gt: 0 },
        nextReviewAt: { lte: todayEnd },
        flashcard: baseCardWhere,
      },
    }),
    prisma.flashcardProgress.count({
      where: {
        userId,
        repetitions: { gt: 0 },
        flashcard: baseCardWhere,
      },
    }),
  ]);

  // New cards: published flashcards with no progress row for this user.
  // We approximate this with a count query on accessible decks minus total reviewed.
  const totalAccessible = await prisma.flashcard.count({
    where: { status: ContentStatus.PUBLISHED, deckId: { not: null }, ...cardScope },
  });
  const newCards = Math.max(0, totalAccessible - totalReviewed);

  return { newCards, dueToday, overdue, lapsing, totalReviewed };
}

/**
 * Loads actual card rows for each segment (capped per segment to avoid oversized payloads).
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
  const baseCardWhere = { status: ContentStatus.PUBLISHED, deckId: { not: null }, ...cardScope };

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

  const [overdueRows, dueTodayRows, lapsingRows] = await Promise.all([
    prisma.flashcardProgress.findMany({
      where: {
        userId,
        nextReviewAt: { lt: todayStart },
        flashcard: baseCardWhere,
      },
      select: progressSelect,
      orderBy: { nextReviewAt: "asc" },
      take: limitPerSegment,
    }),
    prisma.flashcardProgress.findMany({
      where: {
        userId,
        nextReviewAt: { gte: todayStart, lte: todayEnd },
        flashcard: baseCardWhere,
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
        flashcard: baseCardWhere,
      },
      select: progressSelect,
      orderBy: { lapses: "desc" },
      take: limitPerSegment,
    }),
  ]);

  const seenIds = new Set<string>();

  function toCard(row: typeof overdueRows[number], segment: StudyQueueCard["segment"]): StudyQueueCard | null {
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

  const counts = await loadStudyQueueCounts(userId, entitlement, pathwayId);

  return { counts, cards };
}
