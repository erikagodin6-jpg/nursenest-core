import type { Prisma } from "@prisma/client";

export type FlashcardProgressPick = {
  flashcardId: string;
  lastQuality: number | null;
  repetitions: number;
  lastReviewedAt: Date | null;
};

/**
 * Optional deck / lesson / question provenance filter for custom study sessions.
 * `all` — no extra constraint (beyond access scope).
 */
export type CustomSessionSourceKind = "all" | "lesson" | "question" | "deck";

export function prismaWhereForSourceKind(source: CustomSessionSourceKind): Prisma.FlashcardWhereInput | null {
  switch (source) {
    case "lesson":
      return { lessonId: { not: null } };
    case "question":
      return { examQuestionId: { not: null } };
    case "deck":
      return { deckId: { not: null } };
    default:
      return null;
  }
}

export function parseCustomSessionSourceKind(raw: string | null | undefined): CustomSessionSourceKind {
  const v = (raw ?? "").trim().toLowerCase();
  if (v === "lesson" || v === "question" || v === "deck") return v;
  return "all";
}

export function filterCardsByProgressFlags<T extends { id: string }>(
  cards: T[],
  progressById: Map<string, FlashcardProgressPick>,
  opts: { notStudiedOnly: boolean; recentStudiedOnly: boolean; recentWindowMs: number; nowMs: number },
): T[] {
  let out = cards;
  if (opts.notStudiedOnly) {
    out = out.filter((c) => {
      const p = progressById.get(c.id);
      return !p || p.repetitions === 0;
    });
  }
  if (opts.recentStudiedOnly) {
    const cutoff = opts.nowMs - opts.recentWindowMs;
    out = out.filter((c) => {
      const p = progressById.get(c.id);
      if (!p?.lastReviewedAt) return false;
      return p.lastReviewedAt.getTime() >= cutoff;
    });
  }
  return out;
}
