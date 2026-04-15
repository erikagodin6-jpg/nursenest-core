/**
 * Import legacy `client/src/data/flashcards*.ts` decks into Prisma (FlashcardDeck + Flashcard).
 * Idempotent: sourceKey = legacy_ts:{fileBase}:{cardId}
 *
 * Run: cd nursenest-core && npx tsx scripts/import-legacy-client-flashcards.mts [--dry-run] [--limit=500] [--file=flashcards-community.ts]
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  PrismaClient,
  CountryCode,
  TierCode,
  ExamFamily,
  ContentStatus,
  FlashcardDeckVisibility,
} from "@prisma/client";

import { extractLegacyFlashcardExports, legacyFrontBack } from "./legacy/legacy-flashcard-ts-extract.mts";

import "../src/lib/db/env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const CLIENT_DATA = join(REPO_ROOT, "client", "src", "data");

const prisma = new PrismaClient();

function parseArgs() {
  const out: { dryRun: boolean; limit?: number; file?: string } = { dryRun: false };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") out.dryRun = true;
    const lim = /^--limit=(\d+)$/.exec(a);
    if (lim) out.limit = parseInt(lim[1], 10);
    const f = /^--file=(.+)$/.exec(a);
    if (f) out.file = f[1].trim();
  }
  return out;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function tierExamFromFile(base: string): { tier: TierCode; examFamily: ExamFamily } {
  const b = base.toLowerCase();
  if (b.includes("np")) return { tier: TierCode.NP, examFamily: ExamFamily.NP };
  if (b.includes("rpn")) return { tier: TierCode.RPN, examFamily: ExamFamily.NCLEX_PN };
  return { tier: TierCode.RN, examFamily: ExamFamily.NCLEX_RN };
}

async function ensureLegacyCategory(): Promise<string> {
  const row = await prisma.category.upsert({
    where: { slug: "legacy-client-flashcards" },
    create: { name: "Legacy client flashcards", slug: "legacy-client-flashcards" },
    update: {},
  });
  return row.id;
}

async function main() {
  const { dryRun, limit, file: oneFile } = parseArgs();
  if (!existsSync(CLIENT_DATA)) {
    console.error("Missing client data dir:", CLIENT_DATA);
    process.exit(1);
  }

  const files = readdirSync(CLIENT_DATA)
    .filter((f) => f.startsWith("flashcards") && f.endsWith(".ts"))
    .filter((f) => (oneFile ? f === oneFile : true))
    .sort();

  let totalCards = 0;
  const report: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    dryRun,
    files: [] as object[],
  };

  const categoryId = dryRun ? "" : await ensureLegacyCategory();

  for (const fname of files) {
    const fp = join(CLIENT_DATA, fname);
    const text = readFileSync(fp, "utf8");
    const base = fname.replace(/\.ts$/, "");
    const deckSlug = `legacy-${slugify(base)}`;
    const { tier, examFamily } = tierExamFromFile(base);
    const blocks = extractLegacyFlashcardExports(text, fname);
    const allCards = blocks.flatMap((b) => b.cards);
    let processed = 0;

    const fileReport: {
      file: string;
      deckSlug: string;
      cardCount: number;
      upserted?: number;
      error?: string;
    } = { file: fname, deckSlug, cardCount: allCards.length };

    try {
      if (dryRun) {
        fileReport.upserted = 0;
        fileReport.error = undefined;
      } else if (allCards.length > 0) {
        const deck = await prisma.flashcardDeck.upsert({
          where: { slug: deckSlug },
          create: {
            slug: deckSlug,
            title: base.replace(/^flashcards-/, "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " (legacy)",
            description: `Imported from client/src/data/${fname}`,
            country: CountryCode.US,
            tier,
            examFamily,
            visibility: FlashcardDeckVisibility.SUBSCRIBER,
            status: ContentStatus.PUBLISHED,
            cardCount: 0,
            sortOrder: 0,
          },
          update: {
            title:
              base.replace(/^flashcards-/, "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " (legacy)",
            tier,
            examFamily,
            status: ContentStatus.PUBLISHED,
          },
        });

        let pos = 0;
        let upserted = 0;
        for (const row of allCards) {
          if (limit !== undefined && totalCards >= limit) break;
          const { front, back } = legacyFrontBack(row);
          const sourceKey = `legacy_ts:${base}:${row.id}`.slice(0, 200);
          await prisma.flashcard.upsert({
            where: { sourceKey },
            create: {
              front: front.slice(0, 20000),
              back: back.slice(0, 20000),
              country: CountryCode.US,
              tier,
              examFamily,
              status: ContentStatus.PUBLISHED,
              categoryId,
              deckId: deck.id,
              positionInDeck: pos,
              sourceKey,
            },
            update: {
              front: front.slice(0, 20000),
              back: back.slice(0, 20000),
              positionInDeck: pos,
              deckId: deck.id,
            },
          });
          pos += 1;
          upserted += 1;
          totalCards += 1;
        }

        await prisma.flashcardDeck.update({
          where: { id: deck.id },
          data: { cardCount: pos },
        });
        fileReport.upserted = upserted;
      }
    } catch (e) {
      fileReport.error = e instanceof Error ? e.message : String(e);
    }

    (report.files as object[]).push(fileReport);
    console.log(`${fname}: ${allCards.length} cards${fileReport.error ? ` ERROR ${fileReport.error}` : ""}`);
    if (limit !== undefined && totalCards >= limit) break;
  }

  if (!dryRun) {
    const [deckC, cardC] = await Promise.all([prisma.flashcardDeck.count(), prisma.flashcard.count()]);
    report.postImportCounts = { flashcardDecks: deckC, flashcards: cardC };
  }

  const outPath = join(REPO_ROOT, "data", "audit", "legacy-flashcard-import-validation.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`Report: ${outPath}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
