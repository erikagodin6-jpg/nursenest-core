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
