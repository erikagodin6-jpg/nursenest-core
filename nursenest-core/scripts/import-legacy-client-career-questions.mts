/**
 * Import legacy `client/src/data/career-questions/*.ts` MCQ rows into `exam_questions`.
 * Uses the same normalization path as Replit imports (stem hash, tier/exam mapping).
 *
 * Run: cd nursenest-core && npx tsx scripts/import-legacy-client-career-questions.mts [--dry-run] [--limit=1000] [--file=ota-questions.ts]
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";

import { extractLegacyCareerQuestionExports } from "./legacy/legacy-career-question-ts-extract.mts";
import { normalizeRawQuestionRecord, toPrismaCreateInput } from "../src/lib/replit-import/replit-question-normalize";
import type { ProductTrack } from "../src/lib/replit-import/replit-question-types";
import type { ImportCountry } from "../src/lib/replit-import/replit-question-types";
import { withRetry } from "../src/lib/resilience/with-retry";

import { requireDatabaseUrlForLiveImport } from "./lib/require-database-for-live-import.mts";

import "../src/lib/db/env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const CAREER_DIR = join(REPO_ROOT, "client", "src", "data", "career-questions");

const STEM_HASH_CHUNK = 400;
const INSERT_BATCH = 250;

export type LegacyCareerImportArgs = {
  prisma: PrismaClient;
  dryRun: boolean;
  limit?: number;
  file?: string;
  skipDisconnect?: boolean;
  writeReport?: boolean;
};

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

async function existingStemHashes(prisma: PrismaClient, hashes: string[]): Promise<Set<string>> {
  const set = new Set<string>();
  for (let i = 0; i < hashes.length; i += STEM_HASH_CHUNK) {
    const chunk = hashes.slice(i, i + STEM_HASH_CHUNK);
    const rows = await prisma.examQuestion.findMany({
      where: { stemHash: { in: chunk } },
      select: { stemHash: true },
    });
    for (const r of rows) {
      if (r.stemHash) set.add(r.stemHash);
    }
  }
  return set;
}

export async function runLegacyClientCareerImport(opts: LegacyCareerImportArgs): Promise<Record<string, unknown>> {
  const { prisma, dryRun, limit, file: oneFile, skipDisconnect, writeReport = true } = opts;

  if (!existsSync(CAREER_DIR)) {
    throw new Error(`Missing career-questions dir: ${CAREER_DIR}`);
  }

  const files = readdirSync(CAREER_DIR)
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => f !== "question-counts.ts" && f !== "career-question-pool.ts")
    .filter((f) => (oneFile ? f === oneFile : true))
    .sort();

  const defaultCountry: ImportCountry = "US";
  const report: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    phase: "legacy_career_ts",
    dryRun,
    filesScanned: files.length,
    rawQuestions: 0,
    normalizedOk: 0,
    normalizeErrors: 0,
    skippedDuplicateStemInDb: 0,
    skippedDuplicateInRun: 0,
    inserted: 0,
    insertErrors: [] as { message: string; batchSize: number }[],
    fileSummaries: [] as object[],
    errorSamples: [] as { file: string; id?: string; message: string }[],
  };

  const seenStemHashes = new Set<string>();
  let pending: ReturnType<typeof toPrismaCreateInput>[] = [];
  let inserted = 0;

  const flush = async () => {
    if (dryRun || pending.length === 0) return;
    let batch = pending;
    pending = [];
    const hashes = batch.map((r) => r.stemHash).filter((h): h is string => typeof h === "string" && h.length > 0);
    const existing = await existingStemHashes(prisma, hashes);
    let skippedDb = 0;
    batch = batch.filter((r) => {
      const h = r.stemHash;
      if (h && existing.has(h)) {
        skippedDb += 1;
        return false;
      }
      return true;
    });
    report.skippedDuplicateStemInDb = (report.skippedDuplicateStemInDb as number) + skippedDb;
    if (batch.length === 0) return;

    try {
      await withRetry(
        () =>
          prisma.examQuestion.createMany({
            data: batch,
          }),
        { maxAttempts: 4, baseMs: 100 },
      );
      inserted += batch.length;
    } catch (e) {
      const msg = e instanceof Error ? e.message.slice(0, 500) : String(e).slice(0, 500);
      (report.insertErrors as { message: string; batchSize: number }[]).push({
        message: msg,
        batchSize: batch.length,
      });
      for (const row of batch) {
        try {
          await prisma.examQuestion.create({ data: row });
          inserted += 1;
        } catch (e2) {
          const m2 = e2 instanceof Error ? e2.message.slice(0, 500) : String(e2).slice(0, 500);
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

      report.normalizedOk = (report.normalizedOk as number) + 1;
      fileSummary.normalized = (fileSummary.normalized as number) + 1;

      const row = toPrismaCreateInput(norm.row, "published");
      row.referenceSource = "legacy_client_career_ts";

      if (seenStemHashes.has(norm.row.stemHash)) {
        report.skippedDuplicateInRun = (report.skippedDuplicateInRun as number) + 1;
        continue;
      }
      seenStemHashes.add(norm.row.stemHash);

      pending.push(row);
      if (pending.length >= INSERT_BATCH) await flush();
    }

    (report.fileSummaries as object[]).push(fileSummary);
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
    requireDatabaseUrlForLiveImport("import:legacy-client-career-questions");
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
