/**
 * Import legacy `client/src/data/advanced-questions/*mcq*` and `*sata*` MCQ/SATA rows into `exam_questions`.
 * Nursing order: RN → RPN → NP file prefixes. Dedupes by stem hash (+ in-run set).
 *
 * Run: cd nursenest-core && npx tsx scripts/import-legacy-client-advanced-questions.mts [--dry-run] [--limit=1000] [--file=rn-advanced-mcq-01.ts]
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";

import { extractLegacyAdvancedQuestionExports } from "./legacy/legacy-advanced-question-ts-extract.mts";
import type { LegacyAdvancedQuestion } from "./legacy/legacy-advanced-question-ts-extract.mts";
import { normalizeRawQuestionRecord, toPrismaCreateInput } from "../src/lib/replit-import/replit-question-normalize";
import type { ProductTrack } from "../src/lib/replit-import/replit-question-types";
import type { ImportCountry } from "../src/lib/replit-import/replit-question-types";
import { withRetry } from "../src/lib/resilience/with-retry";

import "../src/lib/db/env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const ADVANCED_DIR = join(REPO_ROOT, "client", "src", "data", "advanced-questions");

const STEM_HASH_CHUNK = 400;
const INSERT_BATCH = 250;

export type LegacyAdvancedImportArgs = {
  prisma: PrismaClient;
  dryRun: boolean;
  limit?: number;
  file?: string;
  /** When true, caller owns prisma lifecycle (orchestrator). */
  skipDisconnect?: boolean;
  /** Write JSON report under data/audit (default true for CLI). */
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

function defaultTrackFromFilename(base: string): ProductTrack {
  const b = base.toLowerCase();
  if (b.startsWith("rn-")) return "RN";
  if (b.startsWith("rpn-")) return "PN";
  if (b.startsWith("np-")) return "NP";
  return "RN";
}

function tierSortKey(fname: string): number {
  const f = fname.toLowerCase();
  if (f.startsWith("rn-")) return 0;
  if (f.startsWith("rpn-")) return 1;
  if (f.startsWith("np-")) return 2;
  return 9;
}

function padRationale(raw: string): string {
  let s = raw.trim();
  if (s.length >= 10) return s;
  s = `${s} Legacy advanced import; editorial review may expand this rationale.`.trim();
  if (s.length >= 10) return s;
  return "Legacy advanced question; rationale pending editorial review.";
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

function buildRawForNormalize(q: LegacyAdvancedQuestion, base: string, defaultTrack: ProductTrack): Record<string, unknown> {
  const tagLineage = `legacy_adv:${base.slice(0, 40)}:${q.id}`;
  const tags = [...(q.tags ?? []).map((t) => t.trim()).filter(Boolean), "legacy_advanced_ts", tagLineage];

  const raw: Record<string, unknown> = {
    stem: q.stem,
    options: q.options,
    rationale: padRationale(q.rationale),
    difficulty: q.difficulty,
    questionType: q.questionType === "sata" ? "sata" : "mcq",
    tier: q.tier,
    topic: q.bodySystem,
    bodySystem: q.bodySystem,
    tags,
    track: defaultTrack === "RN" ? "NCLEX_RN" : defaultTrack === "PN" ? "NCLEX_PN" : "NP",
  };

  if (q.blueprintCategory) {
    raw.blueprintCategory = q.blueprintCategory;
  }

  if (q.questionType === "mcq") {
    raw.correctIndex = q.correctAnswer;
  } else {
    raw.correctAnswers = q.correctAnswers;
  }

  return raw;
}

export async function runLegacyClientAdvancedImport(opts: LegacyAdvancedImportArgs): Promise<Record<string, unknown>> {
  const { prisma, dryRun, limit, file: oneFile, skipDisconnect, writeReport = true } = opts;

  if (!existsSync(ADVANCED_DIR)) {
    throw new Error(`Missing advanced-questions dir: ${ADVANCED_DIR}`);
  }

  const files = readdirSync(ADVANCED_DIR)
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => f !== "index.ts")
    .filter((f) => /-mcq-|-sata-/i.test(f))
    .filter((f) => (oneFile ? f === oneFile : true))
    .sort((a, b) => {
      const da = tierSortKey(a);
      const db = tierSortKey(b);
      if (da !== db) return da - db;
      return a.localeCompare(b);
    });

  const defaultCountry: ImportCountry = "US";
  const report: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    phase: "legacy_advanced_ts",
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
    const fp = join(ADVANCED_DIR, fname);
    const text = readFileSync(fp, "utf8");
    const base = fname.replace(/\.ts$/, "");
    const defaultTrack = defaultTrackFromFilename(base);
    const blocks = extractLegacyAdvancedQuestionExports(text, fname);
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

      const raw = buildRawForNormalize(q, base, defaultTrack);

      const norm = normalizeRawQuestionRecord(raw, {
        defaultCountry,
        defaultTrack,
        statusPublished: true,
      });

      if (!norm.ok) {
        report.normalizeErrors = (report.normalizeErrors as number) + 1;
        fileSummary.errors = (fileSummary.errors as number) + 1;
        if ((report.errorSamples as object[]).length < 60) {
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
      row.referenceSource = "legacy_client_advanced_ts";
      const cat = q.blueprintCategory?.trim();
      if (cat) {
        row.nclexClientNeedsCategory = cat.slice(0, 64);
      }

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
    const outPath = join(REPO_ROOT, "data", "audit", "legacy-advanced-questions-import-validation.json");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`Report: ${outPath}`);
  }

  console.log(
    JSON.stringify(
      {
        phase: "legacy_advanced_ts",
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

const prismaSingleton = new PrismaClient();

async function main() {
  const args = parseArgs();
  try {
    await runLegacyClientAdvancedImport({
      prisma: prismaSingleton,
      dryRun: args.dryRun,
      limit: args.limit,
      file: args.file,
      skipDisconnect: false,
      writeReport: true,
    });
  } catch (e) {
    console.error(e);
    await prismaSingleton.$disconnect();
    process.exit(1);
  }
}

main().catch(async (e) => {
  console.error(e);
  await prismaSingleton.$disconnect();
  process.exit(1);
});
