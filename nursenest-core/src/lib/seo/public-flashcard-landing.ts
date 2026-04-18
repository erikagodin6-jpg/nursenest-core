import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { publicMarketingFlashcardDeckWhere } from "@/lib/entitlements/content-access-scope";
import { truncateForPreview } from "@/lib/flashcards/flashcard-access";
import {
  classifyPublicFlashcardDeck,
  lessonNameFromSlug,
  lessonSlugFromSourceKey,
  PUBLIC_FLASHCARD_CATEGORIES,
} from "@/lib/flashcards/public-flashcard-categories";
import { formatTitleCase } from "@/lib/format/text-case";

export type PublicFlashcardTopicRow = { slug: string; name: string };
const PUBLIC_FLASHCARD_DB_TIMEOUT_MS = 1000;

async function withPublicFlashcardFallback<T>(run: () => Promise<T>, fallback: T, label: string): Promise<T> {
  return withDatabaseFallbackTimeout(run, fallback, PUBLIC_FLASHCARD_DB_TIMEOUT_MS, {
    scope: "public_flashcards",
    label,
  });
}

export type PublicFeaturedDeck = {
  slug: string;
  title: string;
  description: string | null;
  cardCount: number;
  sampleFront: string | null;
  pathwayId: string | null;
  categoryId: string;
  subcategoryId?: string;
  highYield: boolean;
  lessonSource?: { slug: string; name: string };
};

export type PublicFlashcardCategorySection = {
  id: string;
  title: string;
  description: string;
  decks: PublicFeaturedDeck[];
  subcategories?: Array<{
    id: string;
    title: string;
    decks: PublicFeaturedDeck[];
  }>;
};

export async function loadPublicFlashcardHub(): Promise<{
  topics: PublicFlashcardTopicRow[];
  featuredDecks: PublicFeaturedDeck[];
  categorySections: PublicFlashcardCategorySection[];
  highYieldDecks: PublicFeaturedDeck[];
}> {
  const deckWhere = publicMarketingFlashcardDeckWhere();
  // Fetch more than 12 so dedup doesn't leave us short
  const [topics, rawDecks] = await Promise.all([
    withPublicFlashcardFallback(
      () =>
        prisma.flashcardTag.findMany({
          where: { decks: { some: { deck: deckWhere } } },
          orderBy: { name: "asc" },
          take: 48,
          select: { slug: true, name: true },
        }),
      [],
      "flashcard_hub.topics",
    ),
    withPublicFlashcardFallback(
      () =>
        prisma.flashcardDeck.findMany({
          where: { ...deckWhere, cardCount: { gt: 0 } },
          orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
          take: 24,
          select: {
            id: true,
            pathwayId: true,
            slug: true,
            title: true,
            description: true,
            cardCount: true,
            tags: { select: { tag: { select: { slug: true, name: true } } } },
            cards: {
              where: { status: ContentStatus.PUBLISHED },
              take: 1,
              orderBy: { positionInDeck: "asc" },
              select: { front: true },
            },
          },
        }),
      [],
      "flashcard_hub.decks",
    ),
  ]);

    // Deduplicate by slug, then by normalised title — keeps first occurrence per pair.
    const seenSlugs = new Set<string>();
    const seenTitles = new Set<string>();
    const deduped = rawDecks.filter((d) => {
      const normTitle = d.title.trim().toLowerCase();
      if (seenSlugs.has(d.slug) || seenTitles.has(normTitle)) return false;
      seenSlugs.add(d.slug);
      seenTitles.add(normTitle);
      return true;
    });

    // Remove decks that are clearly targeted at non-nursing audiences.
    const NON_NURSING_KEYWORDS = /paramedic|emt\b|firefighter|fire fighter/i;
    const nursingDecks = deduped.filter((d) => !NON_NURSING_KEYWORDS.test(d.title));

    const lessonSourceRows =
      nursingDecks.length === 0
        ? []
        : await withPublicFlashcardFallback(
            () =>
              prisma.flashcard.findMany({
                where: {
                  status: ContentStatus.PUBLISHED,
                  deckId: { in: nursingDecks.map((d) => d.id) },
                  sourceKey: { startsWith: "lesson:" },
                },
                orderBy: [{ deckId: "asc" }, { positionInDeck: "asc" }],
                select: { deckId: true, sourceKey: true },
              }),
            [],
            "flashcard_hub.lesson_sources",
          );
    const lessonSourceByDeckId = new Map<string, { slug: string; name: string }>();
    for (const row of lessonSourceRows) {
      if (!row.deckId || lessonSourceByDeckId.has(row.deckId)) continue;
      const slug = lessonSlugFromSourceKey(row.sourceKey);
      if (!slug) continue;
      lessonSourceByDeckId.set(row.deckId, { slug, name: lessonNameFromSlug(slug) });
    }

    const decorated = nursingDecks.slice(0, 12).map((d) => {
      const tags = d.tags.map((entry) => entry.tag);
      const category = classifyPublicFlashcardDeck({
        title: d.title,
        description: d.description,
        tags,
        pathwayId: d.pathwayId,
      });
      return {
        slug: d.slug,
        title: formatTitleCase(d.title),
        description: d.description,
        cardCount: d.cardCount,
        sampleFront: d.cards[0]?.front?.slice(0, 200) ?? null,
        pathwayId: d.pathwayId,
        categoryId: category.categoryId,
        ...(category.subcategoryId ? { subcategoryId: category.subcategoryId } : {}),
        highYield: category.highYield,
        ...(lessonSourceByDeckId.get(d.id) ? { lessonSource: lessonSourceByDeckId.get(d.id) } : {}),
      } satisfies PublicFeaturedDeck;
    });

    const pathwayIds = [...new Set(decorated.map((deck) => deck.pathwayId ?? "default-nursing"))];
    const categorySections: PublicFlashcardCategorySection[] = pathwayIds.flatMap((pathwayId) => {
      const scopedDecks = decorated.filter((deck) => (deck.pathwayId ?? "default-nursing") === pathwayId);
      return PUBLIC_FLASHCARD_CATEGORIES(pathwayId)
        .map((category) => {
          const categoryDecks = scopedDecks.filter((deck) => deck.categoryId === category.id);
          const subcategories = category.subcategories
            ?.map((sub) => ({
              id: sub.id,
              title: sub.title,
              decks: categoryDecks.filter((deck) => deck.subcategoryId === sub.id),
            }))
            .filter((sub) => sub.decks.length > 0);
          const topDecks = subcategories?.length ? categoryDecks.filter((deck) => !deck.subcategoryId) : categoryDecks;
          return {
            id: `${pathwayId}:${category.id}`,
            title: category.title,
            description: category.description ?? "",
            decks: topDecks,
            ...(subcategories?.length ? { subcategories } : {}),
          };
        })
        .filter((section) => section.decks.length > 0 || (section.subcategories?.length ?? 0) > 0);
    });

  return {
    topics,
    featuredDecks: decorated,
    categorySections,
    highYieldDecks: decorated.filter((deck) => deck.highYield),
  };
}

export type PublicDeckLanding = {
  kind: "deck";
  slug: string;
  title: string;
  description: string | null;
  cardCount: number;
  samples: Array<{ front: string; backTeaser: string }>;
};

export type PublicTopicLanding = {
  kind: "topic";
  slug: string;
  name: string;
  decks: Array<{ slug: string; title: string }>;
  samples: Array<{ front: string; backTeaser: string; deckTitle: string }>;
};

export async function loadPublicFlashcardSlugLanding(slug: string): Promise<PublicDeckLanding | PublicTopicLanding | null> {
  const deckWhere = publicMarketingFlashcardDeckWhere();
  const deck = await withPublicFlashcardFallback(
    () =>
      prisma.flashcardDeck.findFirst({
        where: { AND: [{ slug }, deckWhere] },
        select: {
          slug: true,
          title: true,
          description: true,
          cardCount: true,
          cards: {
            where: { status: ContentStatus.PUBLISHED },
            take: 6,
            orderBy: { positionInDeck: "asc" },
            select: { front: true, back: true },
          },
        },
      }),
    null,
    `flashcard_slug_deck:${slug}`,
  );

  if (deck) {
    return {
      kind: "deck",
      slug: deck.slug,
      title: formatTitleCase(deck.title),
      description: deck.description,
      cardCount: deck.cardCount,
      samples: deck.cards.map((c) => ({
        front: c.front,
        backTeaser: truncateForPreview(c.back),
      })),
    };
  }

  const tag = await withPublicFlashcardFallback(
    () =>
      prisma.flashcardTag.findFirst({
        where: { slug, decks: { some: { deck: deckWhere } } },
        select: {
          slug: true,
          name: true,
          decks: {
            where: { deck: deckWhere },
            take: 8,
            select: {
              deck: {
                select: {
                  title: true,
                  slug: true,
                  cards: {
                    where: { status: ContentStatus.PUBLISHED },
                    take: 1,
                    orderBy: { positionInDeck: "asc" },
                    select: { front: true, back: true },
                  },
                },
              },
            },
          },
        },
      }),
    null,
    `flashcard_slug_tag:${slug}`,
  );

  if (!tag || tag.decks.length === 0) return null;

  const samples: PublicTopicLanding["samples"] = [];
  const deckMap = new Map<string, string>();
  for (const row of tag.decks) {
    deckMap.set(row.deck.slug, row.deck.title);
    const c = row.deck.cards[0];
    if (!c) continue;
    samples.push({
      front: c.front,
      backTeaser: truncateForPreview(c.back),
      deckTitle: formatTitleCase(row.deck.title),
    });
    if (samples.length >= 6) break;
  }

  return {
    kind: "topic",
    slug: tag.slug,
    name: formatTitleCase(tag.name),
    decks: [...deckMap.entries()].map(([deckSlug, title]) => ({ slug: deckSlug, title: formatTitleCase(title) })),
    samples,
  };
}
