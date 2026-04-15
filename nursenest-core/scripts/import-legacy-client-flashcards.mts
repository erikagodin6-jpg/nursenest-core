/**
 * Import legacy `client/src/data/flashcards*.ts` decks into Prisma (FlashcardDeck + Flashcard).
 * Idempotent: sourceKey = legacy_ts:{fileBase}:{cardId}
 *
 * Run: cd nursenest-core && npx tsx scripts/import-legacy-client-flashcards.mts [--dry-run] [--confirm-write] [--limit=500] [--file=flashcards-community.ts]
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  PrismaClient,
  CountryCode,
  TierCode,
  ExamFamily,
  ContentStatus,
  FlashcardDeckVisibility,
} from "@prisma/client";

import { IMPORT_FLASHCARD_TX_BATCH } from "../src/lib/content-pipeline/import-safeguards";
import { extractLegacyFlashcardExports, legacyFrontBack } from "./legacy/legacy-flashcard-ts-extract.mts";

import { assertLiveImportPreconditions } from "./lib/import-live-guards.mts";
import { assertSourceFileBounded } from "./lib/import-fs-guards.mts";
import { logImportProgressLine, truncateImportMessage } from "./lib/import-safe-log.mts";

import "../src/lib/db/env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const CLIENT_DATA = join(REPO_ROOT, "client", "src", "data");

const TX_BATCH = IMPORT_FLASHCARD_TX_BATCH;

export type LegacyFlashcardImportArgs = {
  prisma: PrismaClient;
  dryRun: boolean;
  limit?: number;
  file?: string;
  skipDisconnect?: boolean;
  writeReport?: boolean;
};

function parseArgs() {
  const out: { dryRun: boolean; limit?: number; file?: string } = { dryRun: false };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    const limEq = /^--limit=(\d+)$/.exec(a);
    if (limEq) out.limit = parseInt(limEq[1], 10);
    if (a === "--limit" && argv[i + 1] && /^\d+$/.test(argv[i + 1]!)) {
      out.limit = parseInt(argv[i + 1]!, 10);
      i += 1;
    }
    const f = /^--file=(.+)$/.exec(a);
    if (f) out.file = f[1].trim();
    if (a === "--file" && argv[i + 1]) {
      out.file = argv[i + 1]!.trim();
      i += 1;
    }
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

async function ensureLegacyCategory(prisma: PrismaClient): Promise<string> {
  const row = await prisma.category.upsert({
    where: { slug: "legacy-client-flashcards" },
    create: { name: "Legacy client flashcards", slug: "legacy-client-flashcards" },
    update: {},
  });
  return row.id;
}

export async function runLegacyClientFlashcardImport(opts: LegacyFlashcardImportArgs): Promise<Record<string, unknown>> {
  const { prisma, dryRun, limit, file: oneFile, skipDisconnect, writeReport = true } = opts;

  if (!existsSync(CLIENT_DATA)) {
    throw new Error(`Missing client data dir: ${CLIENT_DATA}`);
  }

  const files = readdirSync(CLIENT_DATA)
    .filter((f) => f.startsWith("flashcards") && f.endsWith(".ts"))
    .filter((f) => (oneFile ? f === oneFile : true))
    .sort();

  let totalCards = 0;
  const report: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    phase: "legacy_client_flashcard_ts",
    dryRun,
    files: [] as object[],
  };

  const categoryId = dryRun ? "" : await ensureLegacyCategory(prisma);

  for (const fname of files) {
    const fp = join(CLIENT_DATA, fname);
    assertSourceFileBounded(fp);
    const text = readFileSync(fp, "utf8");
    const base = fname.replace(/\.ts$/, "");
    const deckSlug = `legacy-${slugify(base)}`;
    const { tier, examFamily } = tierExamFromFile(base);
    const blocks = extractLegacyFlashcardExports(text, fname);
    const allCards = blocks.flatMap((b) => b.cards);

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
            title:
              base
                .replace(/^flashcards-/, "")
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ") + " (legacy)",
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
              base
                .replace(/^flashcards-/, "")
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ") + " (legacy)",
            tier,
            examFamily,
            status: ContentStatus.PUBLISHED,
          },
        });

        let pos = 0;
        let upserted = 0;
        let i = 0;
        while (i < allCards.length) {
          if (limit !== undefined && totalCards >= limit) break;
          const roomLeft = limit === undefined ? TX_BATCH : Math.max(0, limit - totalCards);
          const take = Math.min(TX_BATCH, allCards.length - i, roomLeft);
          if (take <= 0) break;
          const slice = allCards.slice(i, i + take);

          await prisma.$transaction(
            slice.map((row, idx) => {
              const { front, back } = legacyFrontBack(row);
              const sourceKey = `legacy_ts:${base}:${row.id}`.slice(0, 200);
              const positionInDeck = pos + idx;
              return prisma.flashcard.upsert({
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
                  positionInDeck,
                  sourceKey,
                },
                update: {
                  front: front.slice(0, 20000),
                  back: back.slice(0, 20000),
                  positionInDeck,
                  deckId: deck.id,
                },
              });
            }),
          );

          pos += take;
          upserted += take;
          totalCards += take;
          i += take;

          if (totalCards % 200 === 0 && totalCards > 0) {
            logImportProgressLine("legacy_flashcards", { file: fname, processed: totalCards, inserted: upserted });
          }
        }

        await prisma.flashcardDeck.update({
          where: { id: deck.id },
          data: { cardCount: pos },
        });
        fileReport.upserted = upserted;
      }
    } catch (e) {
      fileReport.error = truncateImportMessage(e instanceof Error ? e.message : String(e));
    }

    (report.files as object[]).push(fileReport);
    logImportProgressLine("legacy_flashcards", {
      file: fname,
      processed: allCards.length,
      inserted: fileReport.upserted ?? 0,
    });
    if (fileReport.error) {
      console.error(`[legacy_flashcards] ${fname} ERROR ${fileReport.error}`);
    }
    if (limit !== undefined && totalCards >= limit) break;
  }

  if (!dryRun) {
    const [deckC, cardC] = await Promise.all([prisma.flashcardDeck.count(), prisma.flashcard.count()]);
    report.postImportCounts = { flashcardDecks: deckC, flashcards: cardC };
  }

  if (writeReport) {
    const outPath = join(REPO_ROOT, "data", "audit", "legacy-flashcard-import-validation.json");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`Report: ${outPath}`);
  }

  if (!skipDisconnect) await prisma.$disconnect();

  return report;
}

async function main() {
  const args = parseArgs();
  if (!args.dryRun) {
    assertLiveImportPreconditions({
      dryRun: false,
      argv: process.argv,
      scriptLabel: "import:legacy-client-flashcards",
    });
  }
  if (!existsSync(CLIENT_DATA)) {
    console.error("Missing client data dir:", CLIENT_DATA);
    process.exit(1);
  }
  const prisma = new PrismaClient();
  try {
    await runLegacyClientFlashcardImport({
      prisma,
      dryRun: args.dryRun,
      limit: args.limit,
      file: args.file,
      skipDisconnect: false,
      writeReport: true,
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

const isDirectRun = typeof process.argv[1] === "string" && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
