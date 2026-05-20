#!/usr/bin/env npx tsx
/**
 * Read-only flashcard data health report (dry-run by design).
 * Run from `nursenest-core/`: `npx tsx scripts/flashcard-inventory-audit.ts`
 *
 * Reports: orphan cards (no deck), empty decks, cardCount vs actual count mismatches,
 * and orphan counts by country/tier/examFamily.
 *
 * Backfill/repair is intentionally not implemented here: use explicit ops scripts once
 * grouping rules are approved (see platform hardening backlog).
 */
import "../src/lib/db/env-bootstrap";
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const orphanCount = await prisma.flashcard.count({ where: { deckId: null } });

    const orphanByDim = await prisma.flashcard.groupBy({
      by: ["country", "tier", "examFamily"],
      where: { deckId: null, status: "PUBLISHED" },
      _count: { id: true },
    });

    const deckRows = await prisma.$queryRaw<
      { id: string; card_count: number; actual: number }[]
    >`
      SELECT d.id, d.card_count AS card_count, COUNT(f.id)::int AS actual
      FROM flashcard_decks d
      LEFT JOIN "Flashcard" f ON f.deck_id = d.id
      GROUP BY d.id, d.card_count
    `;

    const mismatched = deckRows.filter((r) => r.card_count !== r.actual);
    const emptyDecks = deckRows.filter((r) => r.actual === 0);

    const out = {
      ok: true,
      generatedAt: new Date().toISOString(),
      orphanCardsTotal: orphanCount,
      orphanPublishedByCountryTierExam: orphanByDim.map((r) => ({
        country: r.country,
        tier: r.tier,
        examFamily: r.examFamily,
        count: r._count.id,
      })),
      deckCount: deckRows.length,
      emptyDeckIds: emptyDecks.map((r) => r.id),
      emptyDecksTotal: emptyDecks.length,
      cardCountMismatches: mismatched.map((r) => ({
        deckId: r.id,
        storedCardCount: r.card_count,
        actualCards: r.actual,
      })),
      mismatchedDecksTotal: mismatched.length,
    };

    console.log(JSON.stringify(out, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
