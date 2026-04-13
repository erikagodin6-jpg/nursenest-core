import "../src/lib/db/env-bootstrap";

import { PrismaClient } from "@prisma/client";

const NP_PATHWAYS = [
  "ca-np-cnple",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
] as const;

const prisma = new PrismaClient();

async function main() {
  const rows = [];
  for (const pathwayId of NP_PATHWAYS) {
    const decks = await prisma.flashcardDeck.findMany({
      where: { pathwayId, status: "PUBLISHED" },
      select: { id: true, slug: true, title: true, cardCount: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
    const deckIds = decks.map((deck) => deck.id);
    const publishedCards = deckIds.length
      ? await prisma.flashcard.count({
          where: { deckId: { in: deckIds }, status: "PUBLISHED" },
        })
      : 0;

    rows.push({
      pathwayId,
      flashcardDecksPublished: decks.length,
      flashcardsPublished: publishedCards,
      decks: decks.map((deck) => ({
        slug: deck.slug,
        title: deck.title,
        cardCount: deck.cardCount,
      })),
    });
  }

  const totals = rows.reduce(
    (acc, row) => {
      acc.flashcardDecksPublished += row.flashcardDecksPublished;
      acc.flashcardsPublished += row.flashcardsPublished;
      return acc;
    },
    { flashcardDecksPublished: 0, flashcardsPublished: 0 },
  );

  console.log(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totals,
        pathways: rows,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`coverage report failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
