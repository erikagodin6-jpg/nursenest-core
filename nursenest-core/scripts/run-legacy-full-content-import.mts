/**
 * Full legacy content import: flashcard TS decks, then advanced MCQ/SATA, then career MCQ.
 * Writes `data/audit/legacy-full-content-import-report.json`.
 *
 * Run: cd nursenest-core && npx tsx scripts/run-legacy-full-content-import.mts [--dry-run] [--confirm-write] [--limit=5000]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";

import { runLegacyClientFlashcardImport } from "./import-legacy-client-flashcards.mts";
import { runLegacyClientAdvancedImport } from "./import-legacy-client-advanced-questions.mts";
import { runLegacyClientCareerImport } from "./import-legacy-client-career-questions.mts";
import { isDatabaseUrlConfigured } from "../src/lib/db/safe-database";
import { assertLiveImportPreconditions } from "./lib/import-live-guards.mts";

import "../src/lib/db/script-env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const AUDIT_PATH = join(REPO_ROOT, "data", "audit", "legacy-full-content-import-report.json");

function parseArgs() {
  const out: { dryRun: boolean; limit?: number } = { dryRun: false };
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
  }
  return out;
}

async function snapshotAll(prisma: PrismaClient) {
  const [examQuestionTotal, flashcardDeckTotal, flashcardTotal, examBySource] = await Promise.all([
    prisma.examQuestion.count(),
    prisma.flashcardDeck.count(),
    prisma.flashcard.count(),
    prisma.examQuestion.groupBy({
      by: ["referenceSource"],
      _count: { _all: true },
    }),
  ]);
  return {
    examQuestions: examQuestionTotal,
    flashcardDecks: flashcardDeckTotal,
    flashcards: flashcardTotal,
    examQuestionsByReferenceSource: examBySource.map((r) => ({
      referenceSource: r.referenceSource,
      count: r._count._all,
    })),
  };
}

async function main() {
  const { dryRun, limit } = parseArgs();
  if (!dryRun) {
    assertLiveImportPreconditions({
      dryRun: false,
      argv: process.argv,
      scriptLabel: "import:legacy-full-content",
    });
  }
  const prisma = new PrismaClient();
  const generatedAt = new Date().toISOString();

  try {
    const preImport = isDatabaseUrlConfigured()
      ? await snapshotAll(prisma)
      : { skipped: true as const, reason: "DATABASE_URL not set" };

    const flashcardReport = await runLegacyClientFlashcardImport({
      prisma,
      dryRun,
      limit,
      skipDisconnect: true,
      writeReport: true,
    });

    const advancedReport = await runLegacyClientAdvancedImport({
      prisma,
      dryRun,
      limit,
      skipDisconnect: true,
      writeReport: true,
    });

    const careerReport = await runLegacyClientCareerImport({
      prisma,
      dryRun,
      limit,
      skipDisconnect: true,
      writeReport: true,
    });

    const postImport = isDatabaseUrlConfigured()
      ? await snapshotAll(prisma)
      : { skipped: true as const, reason: "DATABASE_URL not set" };

    const combined = {
      generatedAt,
      dryRun,
      limit: limit ?? null,
      preImport,
      phases: {
        legacy_flashcard_ts: flashcardReport,
        legacy_advanced_ts: advancedReport,
        legacy_career_ts: careerReport,
      },
      postImport,
      deltas:
        !isDatabaseUrlConfigured() || "skipped" in preImport || "skipped" in postImport
          ? null
          : {
              examQuestions: postImport.examQuestions - preImport.examQuestions,
              flashcards: postImport.flashcards - preImport.flashcards,
              flashcardDecks: postImport.flashcardDecks - preImport.flashcardDecks,
            },
    };

    mkdirSync(dirname(AUDIT_PATH), { recursive: true });
    writeFileSync(AUDIT_PATH, JSON.stringify(combined, null, 2));
    console.log(`Full import audit: ${AUDIT_PATH}`);
    console.log(JSON.stringify({ dryRun, deltas: combined.deltas }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  const errReport = {
    generatedAt: new Date().toISOString(),
    fatalError: e instanceof Error ? e.message : String(e),
  };
  mkdirSync(dirname(AUDIT_PATH), { recursive: true });
  writeFileSync(AUDIT_PATH, JSON.stringify(errReport, null, 2));
  process.exit(1);
});
