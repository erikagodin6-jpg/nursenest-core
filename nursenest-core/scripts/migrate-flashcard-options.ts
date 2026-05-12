/**
 * Backfill script: migrate existing JSON answerOptions / correctAnswer / rationaleIncorrect
 * into the canonical FlashcardOption table.
 *
 * Safe to run multiple times (upsert — idempotent).
 * Cards that already have FlashcardOption rows are skipped.
 * Cards with unparseable JSON are logged and skipped without failing.
 *
 * Usage:
 *   npx tsx scripts/migrate-flashcard-options.ts [--dry-run] [--tier RN] [--limit 500] [--batch 50]
 *
 * Flags:
 *   --dry-run    Print what would be written, write nothing to DB
 *   --tier RN    Only process cards with this tier code
 *   --limit N    Max cards to process (default 5000)
 *   --batch N    DB upsert batch size (default 50)
 */

import { PrismaClient, ContentStatus } from "@prisma/client";
import { normalizeLegacyAnswerPayload } from "../src/lib/flashcards/flashcard-option-normalize";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const tierArg = args[args.indexOf("--tier") + 1]?.toUpperCase() ?? null;
const limitArg = Number(args[args.indexOf("--limit") + 1] ?? "5000");
const batchArg = Number(args[args.indexOf("--batch") + 1] ?? "50");
const limit = Number.isFinite(limitArg) && limitArg > 0 ? limitArg : 5000;
const batchSize = Number.isFinite(batchArg) && batchArg > 0 ? batchArg : 50;

async function main() {
  console.log(`\nFlashcard Option Migration`);
  console.log(`==========================`);
  console.log(`Mode: ${dryRun ? "DRY RUN (no writes)" : "LIVE"}`);
  console.log(`Tier filter: ${tierArg ?? "ALL"} | Limit: ${limit} | Batch: ${batchSize}\n`);

  // Find cards that have exam-style JSON data but no canonical option rows yet
  const cards = await prisma.flashcard.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      examItemKind: { not: null },
      answerOptions: { not: null },
      correctAnswer: { not: null },
      ...(tierArg ? { tier: tierArg as never } : {}),
      // Only cards with zero canonical rows — skip already-migrated
      options: { none: {} },
    },
    select: {
      id: true,
      examItemKind: true,
      answerOptions: true,
      correctAnswer: true,
      rationaleIncorrect: true,
      tier: true,
    },
    take: limit,
    orderBy: { updatedAt: "asc" },
  });

  console.log(`Found ${cards.length} cards to migrate.\n`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < cards.length; i += batchSize) {
    const batch = cards.slice(i, i + batchSize);

    for (const card of batch) {
      const opts = normalizeLegacyAnswerPayload({
        answerOptions: card.answerOptions,
        correctAnswer: card.correctAnswer,
        rationaleIncorrect: card.rationaleIncorrect,
      });

      if (!opts || opts.length < 3) {
        console.log(`  SKIP [${card.id.slice(0, 10)}] tier=${card.tier} — could not parse JSON`);
        skipped++;
        continue;
      }

      if (dryRun) {
        console.log(
          `  DRY  [${card.id.slice(0, 10)}] tier=${card.tier} kind=${card.examItemKind} → ${opts.length} options (${opts.filter((o) => o.isCorrect).length} correct)`,
        );
        migrated++;
        continue;
      }

      try {
        await prisma.$transaction(
          opts.map((opt) =>
            prisma.flashcardOption.upsert({
              where: {
                flashcardId_optionKey: { flashcardId: card.id, optionKey: opt.optionKey },
              },
              create: {
                flashcardId: card.id,
                optionKey: opt.optionKey,
                content: opt.content,
                isCorrect: opt.isCorrect,
                rationale: opt.rationale,
                displayOrder: opt.displayOrder,
              },
              update: {
                content: opt.content,
                isCorrect: opt.isCorrect,
                rationale: opt.rationale,
                displayOrder: opt.displayOrder,
              },
            }),
          ),
        );
        migrated++;
      } catch (e) {
        console.error(`  FAIL [${card.id.slice(0, 10)}] — ${e instanceof Error ? e.message : String(e)}`);
        failed++;
      }
    }

    process.stdout.write(`\rProgress: ${Math.min(i + batchSize, cards.length)} / ${cards.length}  `);
  }

  console.log(`\n\nResults:`);
  console.log(`  Migrated : ${migrated}`);
  console.log(`  Skipped  : ${skipped} (unparseable JSON)`);
  console.log(`  Failed   : ${failed} (DB errors)`);
  console.log(`  Mode     : ${dryRun ? "DRY RUN — no rows written" : "LIVE — rows written"}\n`);

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
