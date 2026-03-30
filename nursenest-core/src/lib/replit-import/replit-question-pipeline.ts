import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { withRetry } from "@/lib/resilience/with-retry";
import { extractQuestionLikeRecords } from "./replit-json-extract";
import { normalizeRawQuestionRecord, toPrismaCreateInput } from "./replit-question-normalize";
import type { ImportPipelineOptions, ImportReport, NormalizedExamQuestion } from "./replit-question-types";

async function collectJsonFiles(dir: string, acc: string[]): Promise<void> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await collectJsonFiles(full, acc);
    } else if (e.isFile() && e.name.toLowerCase().endsWith(".json")) {
      acc.push(full);
    }
  }
}

async function listJsonFiles(rootDir: string): Promise<string[]> {
  const files: string[] = [];
  await collectJsonFiles(rootDir, files);
  return files.sort();
}

const STEM_HASH_CHUNK = 400;

async function existingStemHashes(hashes: string[]): Promise<Set<string>> {
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

async function insertBatchWithFallback(
  batch: ReturnType<typeof toPrismaCreateInput>[],
  opts: ImportPipelineOptions,
  report: ImportReport,
): Promise<void> {
  if (batch.length === 0) return;
  try {
    await withRetry(
      () =>
        prisma.examQuestion.createMany({
          data: batch,
        }),
      { maxAttempts: opts.maxRetries, baseMs: 80 },
    );
    report.inserted += batch.length;
    return;
  } catch (e) {
    const msg = e instanceof Error ? e.message.slice(0, 500) : String(e).slice(0, 500);
    report.insertErrors.push({ message: msg, batchSize: batch.length });
  }

  for (const row of batch) {
    try {
      await prisma.examQuestion.create({ data: row });
      report.inserted += 1;
      report.singleRowFallbackInserts += 1;
    } catch (e2) {
      const msg = e2 instanceof Error ? e2.message.slice(0, 500) : String(e2).slice(0, 500);
      report.insertErrors.push({ message: msg, batchSize: 1 });
    }
  }
}

export async function runReplitQuestionImportPipeline(opts: ImportPipelineOptions): Promise<ImportReport> {
  const startedAt = new Date().toISOString();
  const report: ImportReport = {
    startedAt,
    finishedAt: "",
    dryRun: opts.dryRun,
    filesScanned: 0,
    rawRecordsSeen: 0,
    normalizedOk: 0,
    validationErrors: 0,
    duplicateSkippedInRun: 0,
    duplicateSkippedInDb: 0,
    rowsReadyToInsert: 0,
    inserted: 0,
    singleRowFallbackInserts: 0,
    parseErrors: [],
    normalizationErrors: [],
    insertErrors: [],
  };

  let files: string[];
  try {
    files = await listJsonFiles(opts.rootDir);
  } catch (e) {
    report.parseErrors.push({
      file: opts.rootDir,
      message: e instanceof Error ? e.message : String(e),
    });
    report.finishedAt = new Date().toISOString();
    return report;
  }

  report.filesScanned = files.length;
  const normalized: NormalizedExamQuestion[] = [];
  const seenHashes = new Set<string>();

  const statusPublished = opts.statusDb === "published";

  for (const file of files) {
    let text: string;
    try {
      text = await fs.readFile(file, "utf8");
    } catch (e) {
      report.parseErrors.push({
        file,
        message: e instanceof Error ? e.message : String(e),
      });
      continue;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text) as unknown;
    } catch (e) {
      report.parseErrors.push({
        file,
        message: e instanceof Error ? `json_parse: ${e.message}` : "json_parse",
      });
      continue;
    }

    const records = extractQuestionLikeRecords(parsed, file);
    let idx = 0;
    for (const rec of records) {
      report.rawRecordsSeen += 1;
      const n = normalizeRawQuestionRecord(rec, {
        defaultCountry: opts.defaultCountry,
        defaultTrack: opts.defaultTrack,
        statusPublished,
      });
      if (!n.ok) {
        report.validationErrors += 1;
        report.normalizationErrors.push({ file, index: idx, message: n.message });
        idx += 1;
        continue;
      }
      if (seenHashes.has(n.row.stemHash)) {
        report.duplicateSkippedInRun += 1;
        idx += 1;
        continue;
      }
      seenHashes.add(n.row.stemHash);
      normalized.push(n.row);
      report.normalizedOk += 1;
      idx += 1;
    }
  }

  const hashes = normalized.map((r) => r.stemHash);
  let inDb = new Set<string>();
  let stemHashLookupFailed = false;
  if (hashes.length > 0) {
    try {
      inDb = await existingStemHashes(hashes);
    } catch (e) {
      stemHashLookupFailed = true;
      const msg = e instanceof Error ? e.message.slice(0, 500) : String(e).slice(0, 500);
      report.insertErrors.push({ message: `stem_hash_lookup_failed: ${msg}`, batchSize: hashes.length });
    }
  }

  const toInsert = stemHashLookupFailed ? [] : normalized.filter((r) => !inDb.has(r.stemHash));
  report.duplicateSkippedInDb = stemHashLookupFailed ? 0 : normalized.length - toInsert.length;
  report.rowsReadyToInsert = toInsert.length;

  if (opts.dryRun) {
    report.finishedAt = new Date().toISOString();
    return report;
  }

  if (stemHashLookupFailed && normalized.length > 0) {
    report.finishedAt = new Date().toISOString();
    return report;
  }

  const batchSize = Math.max(1, Math.min(250, opts.batchSize));
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const slice = toInsert.slice(i, i + batchSize);
    const data = slice.map((r) => toPrismaCreateInput(r, opts.statusDb));
    await insertBatchWithFallback(data, opts, report);
  }

  report.finishedAt = new Date().toISOString();
  return report;
}
