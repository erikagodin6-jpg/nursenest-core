/**
 * After a live legacy import, run against the configured database to emit totals and breakdowns.
 * Requires DATABASE_URL. Writes data/audit/post-import-db-validation.json
 *
 * Run: cd nursenest-core && npm run validate:legacy-post-import
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";

import { requireDatabaseUrlForLiveImport } from "./lib/require-database-for-live-import.mts";

import "../src/lib/db/env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const OUT = join(REPO_ROOT, "data", "audit", "post-import-db-validation.json");
const OUT_MD = join(REPO_ROOT, "data", "audit", "post-import-db-validation.md");

const LEGACY_QUESTION_SOURCES = [
  "legacy_client_advanced_ts",
  "legacy_client_career_ts",
] as const;

async function main() {
  requireDatabaseUrlForLiveImport("validate:legacy-post-import");
  const prisma = new PrismaClient();
  const generatedAt = new Date().toISOString();

  try {
    const [
      examQuestionTotal,
      flashcardTotal,
      flashcardDeckTotal,
      examByTier,
      examByExam,
      examByReferenceSource,
      flashcardDeckByTier,
      legacyDeckSlugs,
    ] = await Promise.all([
      prisma.examQuestion.count(),
      prisma.flashcard.count(),
      prisma.flashcardDeck.count(),
      prisma.examQuestion.groupBy({ by: ["tier"], _count: { _all: true } }),
      prisma.examQuestion.groupBy({ by: ["exam"], _count: { _all: true } }),
      prisma.examQuestion.groupBy({ by: ["referenceSource"], _count: { _all: true } }),
      prisma.flashcardDeck.groupBy({ by: ["tier"], _count: { _all: true } }),
      prisma.flashcardDeck.findMany({
        where: { slug: { startsWith: "legacy-" } },
        select: { slug: true, title: true, cardCount: true, tier: true },
        orderBy: { slug: "asc" },
        take: 200,
      }),
    ]);

    const legacyImportRows = await prisma.examQuestion.count({
      where: {
        OR: [
          { referenceSource: { in: [...LEGACY_QUESTION_SOURCES] } },
          { tags: { has: "legacy_advanced_ts" } },
          { tags: { has: "legacy_career_ts" } },
        ],
      },
    });

    const report = {
      generatedAt,
      kind: "post_import_db_validation",
      totals: {
        examQuestions: examQuestionTotal,
        flashcards: flashcardTotal,
        flashcardDecks: flashcardDeckTotal,
        examQuestionsTaggedLegacyImport: legacyImportRows,
      },
      examQuestions: {
        byTier: examByTier.map((r) => ({ tier: r.tier, count: r._count._all })),
        byExam: examByExam.map((r) => ({ exam: r.exam, count: r._count._all })),
        byReferenceSource: examByReferenceSource.map((r) => ({
          referenceSource: r.referenceSource,
          count: r._count._all,
        })),
      },
      flashcardDecks: {
        byTier: flashcardDeckByTier.map((r) => ({ tier: r.tier, count: r._count._all })),
        legacyDeckSample: legacyDeckSlugs,
      },
      notes: [
        "This report reflects the database state at generation time.",
        "For mapping-quality heuristics (tier sanity, stem hash collisions), run: npm run audit:legacy-question-mapping",
      ],
    };

    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify(report, null, 2));
    const md = [
      `# Post-import database validation`,
      ``,
      `Generated: \`${generatedAt}\``,
      ``,
      `Machine-readable JSON: [\`data/audit/post-import-db-validation.json\`](./post-import-db-validation.json)`,
      ``,
      `## Totals`,
      ``,
      `| Metric | Count |`,
      `| --- | ---: |`,
      `| Exam questions (all) | ${report.totals.examQuestions} |`,
      `| Flashcards (all) | ${report.totals.flashcards} |`,
      `| Flashcard decks (all) | ${report.totals.flashcardDecks} |`,
      `| Exam questions (legacy import heuristics) | ${report.totals.examQuestionsTaggedLegacyImport} |`,
      ``,
      `## Next step`,
      ``,
      `Run mapping quality: \`cd nursenest-core && npm run audit:legacy-question-mapping\``,
      ``,
      `How to run imports and validation on a real database: [\`LIVE-DATABASE-IMPORT-INSTRUCTIONS.md\`](./LIVE-DATABASE-IMPORT-INSTRUCTIONS.md).`,
      ``,
    ].join("\n");
    writeFileSync(OUT_MD, md);
    console.log(`Wrote ${OUT}`);
    console.log(`Wrote ${OUT_MD}`);
    console.log(JSON.stringify(report.totals, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
