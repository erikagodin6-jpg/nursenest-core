import { shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";

export type CardOrderRow = { id: string; positionInDeck: number };

/** @deprecated Prefer {@link shuffleFlashcardQueueWithinDueBands} with an explicit session salt. */
export function shuffleIdsStableSeed(ids: string[]): string[] {
  const out = [...ids];
  let s = Math.floor(Math.random() * 2 ** 31);
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * `buildStudyQueueIds` returns all due cards first, then not-due. Shuffle **within** each band so
 * study order varies per session while preserving review priority.
 */
export function shuffleFlashcardQueueWithinDueBands(
  queueIds: string[],
  progressByCardId: Map<string, ProgressLite>,
  now: Date,
  salt: string,
): string[] {
  if (queueIds.length <= 1) return queueIds;
  const nowMs = now.getTime();
  const due: string[] = [];
  const notDue: string[] = [];
  for (const id of queueIds) {
    const p = progressByCardId.get(id);
    const next = p?.nextReviewAt?.getTime() ?? null;
    const isDue = next === null || next <= nowMs;
    (isDue ? due : notDue).push(id);
  }
  return [...shuffleSeeded(due, `${salt}:fc-due`), ...shuffleSeeded(notDue, `${salt}:fc-not-due`)];
}

export type ProgressLite = {
  nextReviewAt: Date | null;
  repetitions: number;
};

export type AdaptiveProgressLite = ProgressLite & {
  lastReviewedAt?: Date | null;
  lastQuality?: number | null;
  lapses?: number | null;
};

function seededTie(salt: string, id: string): number {
  let h = 2166136261;
  const seed = `${salt}\0${id}`;
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Fresh custom-session ordering:
 * - unseen cards first
 * - due / weak cards next
 * - recently reviewed cards cooled down unless explicitly filtered elsewhere
 * - mastered/not-due cards remain in rotation, but later
 */
export function orderFlashcardsForAdaptiveSession<T extends { id: string }>(
  rows: readonly T[],
  progressByCardId: Map<string, AdaptiveProgressLite>,
  now: Date,
  salt: string,
): T[] {
  if (rows.length <= 1) return [...rows];
  const nowMs = now.getTime();
  const dayMs = 86_400_000;
  const stableSalt = salt.trim().length >= 8 ? salt.trim() : "flashcard-adaptive-order";

  return [...rows]
    .map((row) => {
      const p = progressByCardId.get(row.id);
      const nextMs = p?.nextReviewAt?.getTime() ?? null;
      const reviewedMs = p?.lastReviewedAt?.getTime() ?? null;
      const daysSinceReview = reviewedMs == null ? 1_000 : Math.max(0, (nowMs - reviewedMs) / dayMs);
      const due = nextMs == null || nextMs <= nowMs;
      const unseen = !p || p.repetitions <= 0 || reviewedMs == null;
      const weak = (p?.lastQuality ?? 5) <= 2 || (p?.lapses ?? 0) > 0;
      const recentlyReviewedPenalty =
        reviewedMs == null
          ? 0
          : daysSinceReview < 1
            ? 900_000
            : daysSinceReview < 3
              ? 450_000
              : daysSinceReview < 7
                ? 140_000
                : 0;

      const score =
        (unseen ? 1_250_000 : 0) +
        (due ? 650_000 : -180_000) +
        (weak ? 520_000 : 0) +
        Math.min(180_000, daysSinceReview * 18_000) -
        recentlyReviewedPenalty +
        (seededTie(stableSalt, row.id) % 10_000);

      return { row, score, tie: seededTie(`${stableSalt}:tie`, row.id) };
    })
    .sort((a, b) => b.score - a.score || a.tie - b.tie || a.row.id.localeCompare(b.row.id))
    .map((entry) => entry.row);
}

/**
 * Due cards first (earliest next review), then new cards, then not-due by deck order.
 */
export function buildStudyQueueIds(
  cards: CardOrderRow[],
  progressByCardId: Map<string, ProgressLite>,
  now: Date,
): string[] {
  const nowMs = now.getTime();
  const decorated = cards.map((c) => {
    const p = progressByCardId.get(c.id);
    const next = p?.nextReviewAt?.getTime() ?? null;
    const due = next === null || next <= nowMs;
    return {
      id: c.id,
      positionInDeck: c.positionInDeck,
      due,
      nextMs: next ?? Number.MAX_SAFE_INTEGER,
    };
  });

  decorated.sort((a, b) => {
    if (a.due !== b.due) return a.due ? -1 : 1;
    if (a.due && b.due) return a.nextMs - b.nextMs;
    return a.positionInDeck - b.positionInDeck;
  });

  return decorated.map((d) => d.id);
}
