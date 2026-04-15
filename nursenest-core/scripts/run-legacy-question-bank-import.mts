/**
 * Orchestrates legacy question bank imports: advanced (MCQ/SATA) then career MCQ.
 * Writes machine-readable audit under `data/audit/legacy-question-bank-import-report.json`.
 *
 * Run: cd nursenest-core && npx tsx scripts/run-legacy-question-bank-import.mts [--dry-run] [--limit=5000]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";

import { runLegacyClientAdvancedImport } from "./import-legacy-client-advanced-questions.mts";
import { runLegacyClientCareerImport } from "./import-legacy-client-career-questions.mts";
import { isDatabaseUrlConfigured } from "../src/lib/db/safe-database";
import { requireDatabaseUrlForLiveImport } from "./lib/require-database-for-live-import.mts";

import "../src/lib/db/env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const AUDIT_PATH = join(REPO_ROOT, "data", "audit", "legacy-question-bank-import-report.json");

function parseArgs() {
  const out: { dryRun: boolean; limit?: number } = { dryRun: false };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") out.dryRun = true;
    const lim = /^--limit=(\d+)$/.exec(a);
    if (lim) out.limit = parseInt(lim[1], 10);
  }
  return out;
}

async function snapshotCounts(prisma: PrismaClient) {
  const total = await prisma.examQuestion.count();
  const bySource = await prisma.examQuestion.groupBy({
    by: ["referenceSource"],
    _count: { _all: true },
  });
  return {
    totalExamQuestions: total,
    byReferenceSource: bySource.map((r) => ({
      referenceSource: r.referenceSource,
      count: r._count._all,
    })),
  };
}

async function main() {
  const { dryRun, limit } = parseArgs();
  if (!dryRun) {
    requireDatabaseUrlForLiveImport("import:legacy-question-bank");
  }
  const prisma = new PrismaClient();
  const generatedAt = new Date().toISOString();

  try {
    const preImport = isDatabaseUrlConfigured() ? await snapshotCounts(prisma) : { skipped: true as const, reason: "DATABASE_URL not set" };

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

    const postImport = isDatabaseUrlConfigured() ? await snapshotCounts(prisma) : { skipped: true as const, reason: "DATABASE_URL not set" };

    const combined = {
      generatedAt,
      dryRun,
      limit: limit ?? null,
      preImport,
      phases: {
        legacy_advanced_ts: advancedReport,
        legacy_career_ts: careerReport,
      },
      postImport,
      deltaTotal:
        !isDatabaseUrlConfigured() ||
        "skipped" in preImport ||
        "skipped" in postImport ||
        !("totalExamQuestions" in preImport) ||
        !("totalExamQuestions" in postImport)
          ? null
          : postImport.totalExamQuestions - preImport.totalExamQuestions,
    };

    mkdirSync(dirname(AUDIT_PATH), { recursive: true });
    writeFileSync(AUDIT_PATH, JSON.stringify(combined, null, 2));
    console.log(`Combined audit: ${AUDIT_PATH}`);
    console.log(
      JSON.stringify(
        {
          dryRun,
          preTotal: "totalExamQuestions" in preImport ? preImport.totalExamQuestions : null,
          postTotal: "totalExamQuestions" in postImport ? postImport.totalExamQuestions : null,
          delta: combined.deltaTotal,
        },
        null,
        2,
      ),
    );
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
