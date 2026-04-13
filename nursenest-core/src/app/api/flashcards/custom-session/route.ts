import { ContentStatus, type Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import {
  applyCountsToBuilderCategories,
  builderCategoryTitleForId,
  resolveBuilderCategoryId,
} from "@/lib/flashcards/flashcard-builder-taxonomy";

type StudyMode = "term_to_definition" | "definition_to_term" | "mixed";

function pathwayScope(pathwayId: string | null): { tier?: "RN" | "RPN" | "NP"; country?: "US" | "CA" } {
  if (!pathwayId) return {};
  const lower = pathwayId.toLowerCase();
  const country = lower.startsWith("ca-") ? "CA" : lower.startsWith("us-") ? "US" : undefined;
  const tier =
    lower.includes("-np-") ? "NP"
    : lower.includes("-rpn-") || lower.includes("-pn-") || lower.includes("rex-pn") ? "RPN"
    : lower.includes("-rn-") ? "RN"
    : undefined;
  return { tier, country };
}

function parseCategories(value: string | null): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCardLimit(value: string | null): number {
  if (!value || value === "all") return 500;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 20;
  return Math.min(500, Math.max(10, n));
}

function parseStudyMode(value: string | null): StudyMode {
  if (value === "definition_to_term") return value;
  if (value === "mixed") return value;
  return "term_to_definition";
}

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

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in required", code: "auth_required" }, { status: 401 });
  }

  const entitlement = await resolveEntitlement(userId);
  if (!entitlement.hasAccess) {
    return NextResponse.json({ error: "Subscription required", code: "subscription_required" }, { status: 403 });
  }

  const sp = req.nextUrl.searchParams;
  const pathwayId = sp.get("pathwayId")?.trim() || null;
  const selectedCategories = parseCategories(sp.get("categories"));
  const stateIds = parseCategories(sp.get("stateIds"));
  const weakOnly = sp.get("weakOnly") === "1";
  const incorrectOnly = sp.get("incorrectOnly") === "1";
  const starredOnly = sp.get("starredOnly") === "1";
  const savedOnly = sp.get("savedOnly") === "1";
  const notesOnly = sp.get("notesOnly") === "1";
  const revisitOnly = sp.get("revisitOnly") === "1";
  const shuffle = sp.get("shuffle") === "1";
  const mode = parseStudyMode(sp.get("mode"));
  const limit = parseCardLimit(sp.get("cardLimit"));
  const includeCards = sp.get("includeCards") === "1";

  const baseWhere: Prisma.FlashcardWhereInput = {
    AND: [{ status: ContentStatus.PUBLISHED }, flashcardAccessWhere(entitlement)],
  };

  const scope = pathwayScope(pathwayId);
  const scopedClauses: Prisma.FlashcardWhereInput[] = [];
  if (scope.tier) scopedClauses.push({ tier: scope.tier });
  if (scope.country) scopedClauses.push({ country: scope.country });
  const pathwayFilter: Prisma.FlashcardWhereInput | null = pathwayId
    ? scopedClauses.length > 0
      ? { AND: scopedClauses }
      : null
    : null;

  const where: Prisma.FlashcardWhereInput =
    pathwayFilter ? { AND: [baseWhere, pathwayFilter] } : baseWhere;

  const cards = await prisma.flashcard.findMany({
    where,
    select: {
      id: true,
      front: true,
      back: true,
      sourceKey: true,
      category: { select: { name: true, topicCode: true } },
      deck: { select: { pathwayId: true, title: true } },
    },
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

  if (weakOnly || incorrectOnly) {
    const progress = await prisma.flashcardProgress.findMany({
      where: {
        userId,
        flashcardId: { in: scoped.map((c) => c.id) },
      },
      select: { flashcardId: true, lastQuality: true, repetitions: true },
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
  }

  const persistenceFiltersActive = starredOnly || savedOnly || notesOnly || revisitOnly;
  if (persistenceFiltersActive) {
    const allowedIds = new Set(stateIds);
    scoped = allowedIds.size > 0 ? scoped.filter((c) => allowedIds.has(c.id)) : [];
  }

  const selectedRows = shuffle ? shuffled(scoped, `${userId}:${selectedCategories.join(",")}:${mode}`) : scoped;
  const limited = selectedRows.slice(0, limit);
  const plannedCount = limited.length;

  const cardsForSession = includeCards
    ? limited.map((card, index) => {
        const mixedSwap = mode === "mixed" && index % 2 === 1;
        const swap = mode === "definition_to_term" || mixedSwap;
        return {
          id: card.id,
          front: swap ? card.back : card.front,
          back: swap ? card.front : card.back,
          topic: builderCategoryTitleForId(pathwayId, card.builderCategoryId),
          subtopic: card.category.topicCode,
          rawTopic: card.category.name,
          sourceKey: card.sourceKey,
          pathwayId: card.deck?.pathwayId ?? pathwayId,
        };
      })
    : [];

  return NextResponse.json({
    ok: true,
    unsupportedFilters: [],
    summary: {
      pathwayId,
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
      cardLimit: sp.get("cardLimit") ?? "20",
    },
    categoryOptions: applyCountsToBuilderCategories(pathwayId, categoryCounts),
    cards: cardsForSession,
  });
}
