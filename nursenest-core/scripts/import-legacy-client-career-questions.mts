/**
 * Import legacy `client/src/data/career-questions/*.ts` MCQ rows into `exam_questions`.
 * Uses the same normalization path as Replit imports (stem hash, tier/exam mapping).
 *
 * Run: cd nursenest-core && npx tsx scripts/import-legacy-client-career-questions.mts [--dry-run] [--confirm-write] [--limit=1000] [--file=ota-questions.ts] [--resume]
 *
 * Live writes require `--confirm-write` or IMPORT_CONFIRM_WRITE=1. Cloud DB hosts also require
 * IMPORT_ACK_PRODUCTIONISH_DATABASE=I_UNDERSTAND (see scripts/lib/import-live-guards.mts).
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";

import { IMPORT_DB_UPSERT_CHUNK } from "../src/lib/content-pipeline/import-safeguards";
import { extractLegacyCareerQuestionExports } from "./legacy/legacy-career-question-ts-extract.mts";
import { normalizeRawQuestionRecord, toPrismaCreateInput } from "../src/lib/replit-import/replit-question-normalize";
import type { ProductTrack } from "../src/lib/replit-import/replit-question-types";
import type { ImportCountry } from "../src/lib/replit-import/replit-question-types";
import { withRetry } from "../src/lib/resilience/with-retry";

import { assertLiveImportPreconditions } from "./lib/import-live-guards.mts";
import { assertSourceFileBounded } from "./lib/import-fs-guards.mts";
import { examQuestionScopedDedupeKey, loadExistingScopedKeys } from "./lib/import-exam-question-dedupe.mts";
import { readCheckpoint, writeCheckpoint } from "./lib/import-checkpoint.mts";
import { logImportProgressLine, truncateImportMessage } from "./lib/import-safe-log.mts";

import "../src/lib/db/script-env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const CAREER_DIR = join(REPO_ROOT, "client", "src", "data", "career-questions");
const CHECKPOINT_NAME = "legacy-career-import";

const INSERT_BATCH = IMPORT_DB_UPSERT_CHUNK;

export type LegacyCareerImportArgs = {
  prisma: PrismaClient;
  dryRun: boolean;
  limit?: number;
  file?: string;
  skipDisconnect?: boolean;
  writeReport?: boolean;
  /** Skip files already listed in data/import-checkpoints/legacy-career-import.json */
  resume?: boolean;
};

function parseArgs() {
  const out: { dryRun: boolean; limit?: number; file?: string; resume: boolean } = {
    dryRun: false,
    resume: false,
  };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    if (a === "--resume") out.resume = true;
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

function defaultTrackForCareerFile(base: string): ProductTrack {
  const b = base.toLowerCase();
  if (b.includes("nursing-questions")) return "RN";
  return "ALLIED";
}

function padRationale(raw: string): string {
  let s = raw.trim();
  if (s.length >= 10) return s;
  s = `${s} Legacy client import; editorial review may expand this rationale.`.trim();
  if (s.length >= 10) return s;
  return "Legacy client career question; rationale pending editorial review.";
}

export async function runLegacyClientCareerImport(opts: LegacyCareerImportArgs): Promise<Record<string, unknown>> {
  const { prisma, dryRun, limit, file: oneFile, skipDisconnect, writeReport = true, resume } = opts;

  if (!existsSync(CAREER_DIR)) {
    throw new Error(`Missing career-questions dir: ${CAREER_DIR}`);
  }

  let files = readdirSync(CAREER_DIR)
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => f !== "question-counts.ts" && f !== "career-question-pool.ts")
    .filter((f) => (oneFile ? f === oneFile : true))
    .sort();

  const cp = resume ? readCheckpoint(REPO_ROOT, CHECKPOINT_NAME) : null;
  if (cp?.completedFiles?.length) {
    const done = new Set(cp.completedFiles);
    files = files.filter((f) => !done.has(f));
  }

  const defaultCountry: ImportCountry = "US";
  const report: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    phase: "legacy_career_ts",
    dryRun,
    resume: resume === true,
    filesScanned: files.length,
    rawQuestions: 0,
    normalizedOk: 0,
    normalizeErrors: 0,
    scopeRejections: 0,
    skippedDuplicateStemInDb: 0,
    skippedDuplicateInRun: 0,
    inserted: 0,
    insertErrors: [] as { message: string; batchSize: number }[],
    fileSummaries: [] as object[],
    errorSamples: [] as { file: string; id?: string; message: string }[],
  };

  const seenScoped = new Set<string>();
  let pending: ReturnType<typeof toPrismaCreateInput>[] = [];
  let inserted = 0;
  const completedForCheckpoint: string[] = [...(cp?.completedFiles ?? [])];

  const flush = async (fileHint?: string) => {
    if (dryRun || pending.length === 0) return;
    let batch = pending;
    pending = [];
    const keyObjs = batch.map((r) => ({
      stemHash: r.stemHash!,
      exam: r.exam,
      tier: r.tier,
      countryCode: r.countryCode ?? null,
    }));
    const existing = await loadExistingScopedKeys(prisma, keyObjs);
    let skippedDb = 0;
    batch = batch.filter((r) => {
      const k = examQuestionScopedDedupeKey({
        stemHash: r.stemHash!,
        exam: r.exam,
        tier: r.tier,
        countryCode: r.countryCode ?? null,
      });
      if (existing.has(k)) {
        skippedDb += 1;
        return false;
      }
      return true;
    });
    report.skippedDuplicateStemInDb = (report.skippedDuplicateStemInDb as number) + skippedDb;
    if (batch.length === 0) return;

    logImportProgressLine("legacy_career_ts", {
      file: fileHint,
      pendingBatch: batch.length,
      inserted,
      skipped: skippedDb,
    });

    try {
      await withRetry(() => prisma.examQuestion.createMany({ data: batch }), { maxAttempts: 4, baseMs: 100 });
      inserted += batch.length;
    } catch (e) {
      const msg = truncateImportMessage(e instanceof Error ? e.message : String(e));
      (report.insertErrors as { message: string; batchSize: number }[]).push({
        message: msg,
        batchSize: batch.length,
      });
      for (const row of batch) {
        try {
          await prisma.examQuestion.create({ data: row });
          inserted += 1;
        } catch (e2) {
          const m2 = truncateImportMessage(e2 instanceof Error ? e2.message : String(e2));
          (report.insertErrors as { message: string; batchSize: number }[]).push({
            message: m2,
            batchSize: 1,
          });
        }
      }
    }
  };

  outer: for (const fname of files) {
    const fp = join(CAREER_DIR, fname);
    assertSourceFileBounded(fp);
    const text = readFileSync(fp, "utf8");
    const base = fname.replace(/\.ts$/, "");
    const defaultTrack = defaultTrackForCareerFile(base);
    const blocks = extractLegacyCareerQuestionExports(text, fname);
    const questions = blocks.flatMap((b) => b.questions);

    const fileSummary: Record<string, unknown> = {
      file: fname,
      exportBlocks: blocks.length,
      questionCount: questions.length,
      normalized: 0,
      errors: 0,
    };

    for (const q of questions) {
      if (limit !== undefined && (report.rawQuestions as number) >= limit) break outer;
      report.rawQuestions = (report.rawQuestions as number) + 1;

      const rationale = padRationale(q.rationale);
      const raw = {
        stem: q.stem,
        options: q.options,
        correctIndex: q.correctIndex,
        rationale,
        difficulty: q.difficulty,
        topic: q.topic || q.category || undefined,
        category: q.category,
        track: defaultTrack === "RN" ? "NCLEX_RN" : "ALLIED",
        tags: ["legacy_career_ts", base.slice(0, 48)],
      };

      const norm = normalizeRawQuestionRecord(raw, {
        defaultCountry,
        defaultTrack,
        statusPublished: true,
      });

      if (!norm.ok) {
        report.normalizeErrors = (report.normalizeErrors as number) + 1;
        fileSummary.errors = (fileSummary.errors as number) + 1;
        if ((report.errorSamples as object[]).length < 40) {
          (report.errorSamples as { file: string; id?: string; message: string }[]).push({
            file: fname,
            id: q.id,
            message: norm.message,
          });
        }
        continue;
      }

      if (process.env.IMPORT_STRICT_SCOPE === "1") {
        const cc = norm.row.countryCode ?? null;
        if (cc && cc !== defaultCountry) {
          report.scopeRejections = (report.scopeRejections as number) + 1;
          fileSummary.errors = (fileSummary.errors as number) + 1;
          continue;
        }
      }

      report.normalizedOk = (report.normalizedOk as number) + 1;
      fileSummary.normalized = (fileSummary.normalized as number) + 1;

      const row = toPrismaCreateInput(norm.row, "published");
      row.referenceSource = "legacy_client_career_ts";

      const scopeKey = examQuestionScopedDedupeKey({
        stemHash: norm.row.stemHash,
        exam: norm.row.exam,
        tier: norm.row.tier,
        countryCode: norm.row.countryCode ?? null,
      });

      if (seenScoped.has(scopeKey)) {
        report.skippedDuplicateInRun = (report.skippedDuplicateInRun as number) + 1;
        continue;
      }
      seenScoped.add(scopeKey);

      pending.push(row);
      if (pending.length >= INSERT_BATCH) await flush(fname);
    }

    (report.fileSummaries as object[]).push(fileSummary);
    if (!dryRun && resume) {
      completedForCheckpoint.push(fname);
      writeCheckpoint(REPO_ROOT, CHECKPOINT_NAME, completedForCheckpoint);
    }
  }

  await flush();

  report.inserted = inserted;

  if (!dryRun) {
    report.postPhaseExamQuestionCount = await prisma.examQuestion.count();
  }

  if (writeReport) {
    const outPath = join(REPO_ROOT, "data", "audit", "legacy-career-questions-import-validation.json");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`Report: ${outPath}`);
  }

  console.log(
    JSON.stringify(
      {
        phase: "legacy_career_ts",
        dryRun,
        rawQuestions: report.rawQuestions,
        normalizedOk: report.normalizedOk,
        normalizeErrors: report.normalizeErrors,
        scopeRejections: report.scopeRejections,
        inserted: report.inserted,
        skippedDuplicateStemInDb: report.skippedDuplicateStemInDb,
        skippedDuplicateInRun: report.skippedDuplicateInRun,
      },
      null,
      2,
    ),
  );

  if (!skipDisconnect) await prisma.$disconnect();

  return report;
}

async function main() {
  const args = parseArgs();
  if (!args.dryRun) {
    assertLiveImportPreconditions({
      dryRun: false,
      argv: process.argv,
      scriptLabel: "import:legacy-client-career-questions",
    });
  }
  const prisma = new PrismaClient();
  try {
    await runLegacyClientCareerImport({
      prisma,
      dryRun: args.dryRun,
      limit: args.limit,
      file: args.file,
      skipDisconnect: false,
      writeReport: true,
      resume: args.resume,
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

const isDirectRun =
  typeof process.argv[1] === "string" && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
}
