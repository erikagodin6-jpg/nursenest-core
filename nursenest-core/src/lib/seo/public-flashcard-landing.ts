import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { publicMarketingFlashcardDeckWhere } from "@/lib/entitlements/content-access-scope";
import { truncateForPreview } from "@/lib/flashcards/flashcard-access";

export type PublicFlashcardTopicRow = { slug: string; name: string };

export type PublicFeaturedDeck = {
  slug: string;
  title: string;
  description: string | null;
  cardCount: number;
  sampleFront: string | null;
};

export async function loadPublicFlashcardHub(): Promise<{
  topics: PublicFlashcardTopicRow[];
  featuredDecks: PublicFeaturedDeck[];
}> {
  return withDatabaseFallback(async () => {
    const deckWhere = publicMarketingFlashcardDeckWhere();
    // Fetch more than 12 so dedup doesn't leave us short
    const [topics, rawDecks] = await Promise.all([
      prisma.flashcardTag.findMany({
        where: { decks: { some: { deck: deckWhere } } },
        orderBy: { name: "asc" },
        take: 48,
        select: { slug: true, name: true },
      }),
      prisma.flashcardDeck.findMany({
        where: { ...deckWhere, cardCount: { gt: 0 } },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
        take: 24,
        select: {
          slug: true,
          title: true,
          description: true,
          cardCount: true,
          cards: {
            where: { status: ContentStatus.PUBLISHED },
            take: 1,
            orderBy: { positionInDeck: "asc" },
            select: { front: true },
          },
        },
      }),
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

    return {
      topics,
      featuredDecks: nursingDecks.slice(0, 12).map((d) => ({
        slug: d.slug,
        title: d.title,
        description: d.description,
        cardCount: d.cardCount,
        sampleFront: d.cards[0]?.front?.slice(0, 200) ?? null,
      })),
    };
  }, { topics: [], featuredDecks: [] });
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
  return withDatabaseFallback(async () => {
    const deckWhere = publicMarketingFlashcardDeckWhere();
    const deck = await prisma.flashcardDeck.findFirst({
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
    });

    if (deck) {
      return {
        kind: "deck",
        slug: deck.slug,
        title: deck.title,
        description: deck.description,
        cardCount: deck.cardCount,
        samples: deck.cards.map((c) => ({
          front: c.front,
          backTeaser: truncateForPreview(c.back),
        })),
      };
    }

    const tag = await prisma.flashcardTag.findFirst({
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
    });

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
        deckTitle: row.deck.title,
      });
      if (samples.length >= 6) break;
    }

    return {
      kind: "topic",
      slug: tag.slug,
      name: tag.name,
      decks: [...deckMap.entries()].map(([slug, title]) => ({ slug, title })),
      samples,
    };
  }, null);
}
