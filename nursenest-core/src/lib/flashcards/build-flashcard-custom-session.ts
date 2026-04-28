import { randomUUID } from "node:crypto";
import { ContentStatus, type Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { flashcardPathwayAccessOptionsFromPathwayId } from "@/lib/flashcards/flashcard-pathway-scope";
import {
  applyCountsToBuilderCategories,
  builderCategoryTitleForId,
  resolveBuilderCategoryId,
  type BuilderCategoryOption,
} from "@/lib/flashcards/flashcard-builder-taxonomy";
import { serializeFlashcardForCustomSession } from "@/lib/flashcards/flashcard-study-serialize";
import type {
  FlashcardCustomSessionQueryRelaxation,
  FlashcardCustomSessionSummary,
} from "@/lib/flashcards/flashcard-custom-session-response";
import {
  filterCardsByProgressFlags,
  parseCustomSessionSourceKind,
  prismaWhereForSourceKind,
  type CustomSessionSourceKind,
} from "@/lib/flashcards/custom-session-card-filters";

export type CustomSessionStudyMode = "term_to_definition" | "definition_to_term" | "mixed";

export type BuildFlashcardCustomSessionInput = {
  userId: string;
  entitlement: AccessScope;
  pathwayId: string | null;
  topicCode?: string | null;
  lessonId?: string | null;
  selectedCategories: string[];
  stateIds: string[];
  weakOnly: boolean;
  incorrectOnly: boolean;
  starredOnly: boolean;
  savedOnly: boolean;
  notesOnly: boolean;
  revisitOnly: boolean;
  notStudiedOnly: boolean;
  recentStudiedOnly: boolean;
  recentDays: number;
  shuffle: boolean;
  mode: CustomSessionStudyMode;
  limit: number;
  includeCards: boolean;
  sourceKind: CustomSessionSourceKind;
  /** Optional deterministic shuffle seed (falls back to random). */
  sessionSeed?: string | null;
  cardLimitRaw?: string | null;
};

export type BuildFlashcardCustomSessionSuccess = {
  ok: true;
  queryRelaxation: FlashcardCustomSessionQueryRelaxation;
  summary: FlashcardCustomSessionSummary;
  categoryOptions: BuilderCategoryOption[];
  cards: ReturnType<typeof serializeFlashcardForCustomSession>[];
};

export type BuildFlashcardCustomSessionFailure = {
  ok: false;
  code: "database_error";
  message: string;
  reason: string;
};

export type BuildFlashcardCustomSessionResult = BuildFlashcardCustomSessionSuccess | BuildFlashcardCustomSessionFailure;

const flashcardSelect = {
  id: true,
  front: true,
  back: true,
  sourceKey: true,
  examItemKind: true,
  questionStem: true,
  answerOptions: true,
  correctAnswer: true,
  rationaleCorrect: true,
  rationaleIncorrect: true,
  category: { select: { name: true, topicCode: true } },
  deck: { select: { pathwayId: true, title: true } },
} as const;

function shuffled<T>(rows: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) h = (h ^ seed.charCodeAt(i)) * 16777619;
  const out = [...rows];
  for (let i = out.length - 1; i > 0; i -= 1) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Shared implementation for `GET /api/flashcards/custom-session` and server-side hub inventory.
 */
export async function buildFlashcardCustomSession(
  input: BuildFlashcardCustomSessionInput,
): Promise<BuildFlashcardCustomSessionResult> {
  const {
    userId,
    entitlement,
    pathwayId,
    topicCode = null,
    lessonId = null,
    selectedCategories,
    stateIds,
    weakOnly,
    incorrectOnly,
    starredOnly,
    savedOnly,
    notesOnly,
    revisitOnly,
    notStudiedOnly,
    recentStudiedOnly,
    recentDays,
    shuffle,
    mode,
    limit,
    includeCards,
    sourceKind,
    sessionSeed,
    cardLimitRaw,
  } = input;

  const pathwayOpts = flashcardPathwayAccessOptionsFromPathwayId(pathwayId);
  const sourceClause = prismaWhereForSourceKind(sourceKind);

  const buildFlashcardWhere = (accessWhere: Prisma.FlashcardWhereInput): Prisma.FlashcardWhereInput => {
    const clauses: Prisma.FlashcardWhereInput[] = [{ status: ContentStatus.PUBLISHED }, accessWhere];
    if (topicCode) clauses.push({ category: { topicCode } });
    if (lessonId) clauses.push({ lessonId });
    if (sourceClause) clauses.push(sourceClause);
    return { AND: clauses };
  };

  const queryRelaxation: FlashcardCustomSessionQueryRelaxation = "none";

  try {
    const cards = await prisma.flashcard.findMany({
      where: buildFlashcardWhere(flashcardAccessWhere(entitlement, pathwayOpts)),
      select: flashcardSelect,
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });

    const categoryCounts: Record<string, number> = {};
    const cardWithCategory = cards.map((card) => {
      const categoryId = resolveBuilderCategoryId({
        label: card.category.name,
        topicCode: card.category.topicCode,
        pathwayId: card.deck?.pathwayId ?? pathwayId,
        deckTitle: card.deck?.title,
        front: card.front,
        back: card.back,
      });
      categoryCounts[categoryId] = (categoryCounts[categoryId] ?? 0) + 1;
      return { ...card, builderCategoryId: categoryId };
    });

    let scoped = cardWithCategory;
    if (selectedCategories.length > 0) {
      const selected = new Set(selectedCategories);
      scoped = scoped.filter((c) => selected.has(c.builderCategoryId));
    }

    const needsProgress = weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly;
    if (needsProgress) {
      const scopedIds = scoped.map((c) => c.id);
      const progress = await prisma.flashcardProgress.findMany({
        where: {
          userId,
          flashcardId: { in: scopedIds },
        },
        select: { flashcardId: true, lastQuality: true, repetitions: true, lastReviewedAt: true },
        take: takeForIdIn(scopedIds, 5000),
      });
      const map = new Map(progress.map((p) => [p.flashcardId, p]));
      if (weakOnly) {
        scoped = scoped.filter((c) => {
          const p = map.get(c.id);
          return Boolean(p && ((p.lastQuality ?? 3) <= 2 || p.repetitions < 2));
        });
      }
      if (incorrectOnly) {
        scoped = scoped.filter((c) => {
          const p = map.get(c.id);
          return Boolean(p && (p.lastQuality ?? 3) <= 1);
        });
      }
      if (notStudiedOnly || recentStudiedOnly) {
        scoped = filterCardsByProgressFlags(scoped, map, {
          notStudiedOnly,
          recentStudiedOnly,
          recentWindowMs: recentDays * 86_400_000,
          nowMs: Date.now(),
        });
      }
    }

    const persistenceFiltersActive = starredOnly || savedOnly || notesOnly || revisitOnly;
    if (persistenceFiltersActive) {
      const allowedIds = new Set(stateIds);
      if (allowedIds.size > 0) {
        scoped = scoped.filter((c) => allowedIds.has(c.id));
      }
    }

    const sessionShuffleSalt = sessionSeed?.trim() || randomUUID();
    const orderingSeed = shuffle
      ? sessionSeed?.trim() || `${userId}:${sessionShuffleSalt}:${selectedCategories.join(",")}:${mode}`
      : `${sessionShuffleSalt}:ordered`;
    const selectedRows = shuffle ? shuffled(scoped, orderingSeed) : scoped;
    const limited = selectedRows.slice(0, limit);

    const cardsForSession = includeCards
      ? limited.map((card, index) => {
          const mixedSwap = mode === "mixed" && index % 2 === 1;
          const swap = mode === "definition_to_term" || mixedSwap;
          const topic = builderCategoryTitleForId(pathwayId, card.builderCategoryId);
          const { builderCategoryId: _bc, ...dbRow } = card;
          void _bc;
          return serializeFlashcardForCustomSession(dbRow, {
            swapFrontBack: swap,
            topic,
            pathwayId: card.deck?.pathwayId ?? pathwayId,
            examOptionShuffleSalt: sessionShuffleSalt,
          });
        })
      : [];

    const plannedCount = limited.length;

    const summary: FlashcardCustomSessionSummary = {
      pathwayId,
      topicCode,
      lessonId,
      selectedCategories,
      matchingCards: scoped.length,
      returnedCards: plannedCount,
      mode,
      shuffle,
      weakOnly,
      incorrectOnly,
      starredOnly,
      savedOnly,
      notesOnly,
      revisitOnly,
      notStudiedOnly,
      recentStudiedOnly,
      recentDays,
      sourceKind,
      cardLimit: cardLimitRaw ?? "20",
      queryRelaxation,
      sessionShuffleSalt,
    };

    return {
      ok: true,
      queryRelaxation,
      summary,
      categoryOptions: applyCountsToBuilderCategories(pathwayId, categoryCounts),
      cards: cardsForSession,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      code: "database_error",
      message: "Flashcards could not be loaded. Please retry.",
      reason: message.slice(0, 500),
    };
  }
}

export function parseCustomSessionCategories(value: string | null | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseCustomSessionCardLimit(value: string | null | undefined): number {
  if (!value || value === "all") return 500;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 20;
  return Math.min(500, Math.max(10, n));
}

export function parseCustomSessionStudyMode(value: string | null | undefined): CustomSessionStudyMode {
  if (value === "definition_to_term") return value;
  if (value === "term_to_definition") return value;
  if (value === "mixed") return value;
  return "mixed";
}
