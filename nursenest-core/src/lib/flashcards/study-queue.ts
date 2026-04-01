export type CardOrderRow = { id: string; positionInDeck: number };

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
