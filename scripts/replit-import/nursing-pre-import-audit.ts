#!/usr/bin/env npx tsx
/**
 * Strict pre-import audit for nursing ai_cache extraction (read-only).
 * Uses the same helpers as nursing-dry-run-preview.ts and validate-import.ts.
 */
import "../../server/load-env";
import * as fs from "fs";
import * as path from "path";
import pg from "pg";
import { loadJsonRows } from "./json-load";
import {
  normalizeAiCacheOutputJson,
  iterateAiCacheOutputItems,
  parseAiCacheNursingExamItem,
  buildNursingParseContext,
  type MappedExamQuestion,
} from "./nursing-ai-cache-extract";
import { resolutionCategoryForAudit, type EnrichmentAudit } from "./nursing-exam-metadata-enrich";
import { computeHeuristicSuggestion } from "./nursing-review-metadata";

function getDbUrl(): string | null {
  return process.env.PROD_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || null;
}

async function stemHashesExist(pool: pg.Pool, hashes: string[]): Promise<Set<string>> {
  const found = new Set<string>();
  const chunk = 400;
  for (let i = 0; i < hashes.length; i += chunk) {
    const slice = hashes.slice(i, i + chunk);
    const r = await pool.query(`SELECT stem_hash FROM exam_questions WHERE stem_hash = ANY($1::text[])`, [slice]);
    for (const row of r.rows as { stem_hash: string }[]) {
      found.add(row.stem_hash);
    }
  }
  return found;
}

function bump(m: Record<string, number>, k: string, n = 1) {
  m[k] = (m[k] ?? 0) + n;
}

function topN(m: Record<string, number>, n: number): [string, number][] {
  return Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const dirIdx = argv.indexOf("--dir");
  const dirAbs =
    dirIdx >= 0 && argv[dirIdx + 1] ? path.resolve(argv[dirIdx + 1]) : path.resolve("data/replit-exports");
  const samplePathIdx = argv.indexOf("--sample-out");
  const sampleOut =
    samplePathIdx >= 0 && argv[samplePathIdx + 1]
      ? path.resolve(argv[samplePathIdx + 1]!)
      : path.resolve("scripts/replit-import/nursing-audit-samples.json");
  const checkDb = argv.includes("--check-db");
  const maxIdx = argv.indexOf("--max-exam-inserts");
  let maxExamInserts: number | undefined;
  if (maxIdx >= 0 && argv[maxIdx + 1]) {
    const n = parseInt(argv[maxIdx + 1]!, 10);
    if (Number.isFinite(n) && n >= 0) maxExamInserts = n;
  }
  const sampleLimit = 50;
  return { dirAbs, sampleOut, checkDb, sampleLimit, maxExamInserts };
}

/**
 * Mirrors import order in extractFromAiCacheOutputs: first-time stem_hash inserts only,
 * until maxExamInserts successful inserts would occur (same guard as import-pipeline).
 */
function simulateExamInsertCap(
  rows: Record<string, unknown>[],
  maxExamInserts: number | undefined,
  exportDirAbs: string,
  repoRoot: string,
): {
  maxExamInserts: number | null;
  simulatedSuccessfulInserts: number;
  stoppedByCap: boolean;
} {
  if (maxExamInserts === undefined) {
    return { maxExamInserts: null, simulatedSuccessfulInserts: -1, stoppedByCap: false };
  }
  const seenStem = new Set<string>();
  let examInsertCount = 0;
  let stoppedByCap = false;
  let rowIndex = -1;
  outer: for (const row of rows) {
    rowIndex += 1;
    const oj = normalizeAiCacheOutputJson(row.output_json ?? row.outputJson);
    if (oj === null || oj === undefined) continue;
    let outputItemIndex = -1;
    for (const item of iterateAiCacheOutputItems(oj)) {
      outputItemIndex += 1;
      const ctx = buildNursingParseContext(row, {
        exportDirAbs,
        sourceFileName: "ai_cache.json",
        rowIndex,
        outputItemIndex,
        repoRoot,
      });
      const parsed = parseAiCacheNursingExamItem(item as Record<string, unknown>, ctx);
      if (parsed.kind === "flashcard" || parsed.kind === "inconclusive") continue;
      const h = parsed.value.stemHash;
      if (seenStem.has(h)) continue;
      seenStem.add(h);
      if (examInsertCount >= maxExamInserts) {
        stoppedByCap = true;
        break outer;
      }
      examInsertCount += 1;
    }
  }
  return { maxExamInserts, simulatedSuccessfulInserts: examInsertCount, stoppedByCap };
}

async function main() {
  const { dirAbs, sampleOut, checkDb, sampleLimit, maxExamInserts } = parseArgs();
  const repoRoot = process.cwd();
  const filePath = path.join(dirAbs, "ai_cache.json");
  if (!fs.existsSync(filePath)) {
    console.error(JSON.stringify({ error: "file_not_found", filePath }, null, 2));
    process.exit(1);
  }

  const rows = loadJsonRows(filePath) as Record<string, unknown>[];

  let totalOutputItems = 0;
  let missingOutputJson = 0;
  let flashcardShapes = 0;
  let examMcqCandidates = 0;
  let rejected = 0;
  const rejectionReasons: Record<string, number> = {};
  const byExam: Record<string, number> = {};
  const byTier: Record<string, number> = {};
  const byTrack: Record<string, number> = {};

  /** First occurrence per stem_hash (global export order). */
  const firstSeenStem = new Map<
    string,
    { cacheKey: string | null; rowIndex: number; value: MappedExamQuestion; enrichment?: EnrichmentAudit }
  >();
  /** Global order: which stem appeared first — Map insertion order = would-insert order. */
  const seenStemForDup = new Set<string>();
  /** Per cache_key: exam MCQ items; items that are 2nd+ occurrence of same stem (batch dup). */
  const cacheKeyStats: Record<string, { examMcqItems: number; inExportBatchDuplicateItems: number }> = {};
  const provenanceTotals: Record<string, number> = {};
  let sentToReview = 0;
  let suggestionOnlyRows = 0;

  function touchCk(ck: string | null) {
    const key = ck ?? "__null_cache_key__";
    if (!cacheKeyStats[key]) cacheKeyStats[key] = { examMcqItems: 0, inExportBatchDuplicateItems: 0 };
    return key;
  }

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]!;
    const cacheKey =
      typeof row.cache_key === "string"
        ? row.cache_key
        : typeof row.cacheKey === "string"
          ? row.cacheKey
          : null;
    const ckLabel = touchCk(cacheKey);

    const oj = normalizeAiCacheOutputJson(row.output_json ?? row.outputJson);
    if (oj === null || oj === undefined) {
      missingOutputJson += 1;
      continue;
    }

    let outputItemIndex = -1;
    for (const item of iterateAiCacheOutputItems(oj)) {
      outputItemIndex += 1;
      totalOutputItems += 1;
      const ctx = buildNursingParseContext(row, {
        exportDirAbs: dirAbs,
        sourceFileName: "ai_cache.json",
        rowIndex,
        outputItemIndex,
        repoRoot,
      });
      const parsed = parseAiCacheNursingExamItem(item as Record<string, unknown>, ctx);

      if (parsed.kind === "flashcard") {
        flashcardShapes += 1;
        continue;
      }
      if (parsed.kind === "inconclusive") {
        rejected += 1;
        const key = parsed.mapErrors.join(",") || "unknown";
        bump(rejectionReasons, key);
        sentToReview += 1;
        bump(provenanceTotals, "unresolved");
        const sug = computeHeuristicSuggestion(item as Record<string, unknown>, ctx);
        if (sug.suggestion_reasons.length) suggestionOnlyRows += 1;
        continue;
      }

      examMcqCandidates += 1;
      const v = parsed.value;
      if (parsed.enrichment) bump(provenanceTotals, resolutionCategoryForAudit(parsed.enrichment));
      cacheKeyStats[ckLabel].examMcqItems += 1;

      if (seenStemForDup.has(v.stemHash)) {
        cacheKeyStats[ckLabel].inExportBatchDuplicateItems += 1;
      } else {
        seenStemForDup.add(v.stemHash);
      }

      bump(byExam, v.exam);
      bump(byTier, v.tier);
      const tr = v.careerType === "nursing" ? "nursing" : v.careerType;
      bump(byTrack, tr);

      if (!firstSeenStem.has(v.stemHash)) {
        firstSeenStem.set(v.stemHash, {
          cacheKey,
          rowIndex,
          value: v,
          enrichment: parsed.enrichment,
        });
      }
    }
  }

  const uniqueStemHashes = firstSeenStem.size;
  const duplicateWithinExport = examMcqCandidates - uniqueStemHashes;
  const wouldInsertHashes = Array.from(firstSeenStem.keys());
  const wouldInsertCount = wouldInsertHashes.length;

  const capSim = simulateExamInsertCap(rows, maxExamInserts, dirAbs, repoRoot);

  let inDb = new Set<string>();
  const dbUrlPresent = Boolean(getDbUrl());
  if (checkDb && dbUrlPresent) {
    const pool = new pg.Pool({
      connectionString: getDbUrl()!,
      max: 2,
      connectionTimeoutMillis: 10000,
    });
    try {
      inDb = await stemHashesExist(pool, wouldInsertHashes);
    } finally {
      await pool.end();
    }
  }

  const topDupCacheKeys = topN(
    Object.fromEntries(
      Object.entries(cacheKeyStats).map(([k, v]) => [k, v.inExportBatchDuplicateItems]),
    ),
    20,
  ).filter(([, n]) => n > 0);

  const topExamVolumeCacheKeys = topN(
    Object.fromEntries(Object.entries(cacheKeyStats).map(([k, v]) => [k, v.examMcqItems])),
    15,
  );

  const samples: {
    stemHash: string;
    cacheKey: string | null;
    rowIndex: number;
    mapped: MappedExamQuestion;
  }[] = [];
  for (const h of wouldInsertHashes) {
    if (samples.length >= sampleLimit) break;
    const e = firstSeenStem.get(h);
    if (!e) continue;
    samples.push({ stemHash: h, cacheKey: e.cacheKey, rowIndex: e.rowIndex, mapped: e.value });
  }

  fs.writeFileSync(
    sampleOut,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceFile: filePath,
        sampleCount: samples.length,
        samples: samples.map((s) => ({
          stemHash: s.stemHash,
          cacheKey: s.cacheKey,
          rowIndex: s.rowIndex,
          stem: s.mapped.stem,
          exam: s.mapped.exam,
          tier: s.mapped.tier,
          careerType: s.mapped.careerType,
          topic: s.mapped.topic,
          bodySystem: s.mapped.bodySystem,
          questionType: s.mapped.questionType,
          difficulty: s.mapped.difficulty,
          optionsCount: s.mapped.options.length,
          correctAnswer: s.mapped.correctAnswer,
          options: s.mapped.options,
          rationalePreview: s.mapped.rationale?.slice(0, 200) ?? null,
          enrichment: firstSeenStem.get(s.stemHash)?.enrichment ?? null,
        })),
      },
      null,
      2,
    ),
    "utf8",
  );

  const dbSkipped = checkDb && !dbUrlPresent;

  const report = {
    type: "nursing_pre_import_audit",
    readOnly: true,
    filesInspected: [path.relative(process.cwd(), filePath), path.relative(process.cwd(), sampleOut)],
    sourceDir: dirAbs,
    aiCacheRows: rows.length,
    totalOutputItemsNested: totalOutputItems,
    missingOutputJsonRows: missingOutputJson,
    summary: {
      totalCandidateExamRows: examMcqCandidates,
      totalFlashcardRows: flashcardShapes,
      totalRejectedRows: rejected,
      topRejectionReasons: topN(rejectionReasons, 25),
      uniqueStemHashesAmongExamCandidates: uniqueStemHashes,
      duplicateExamRowsWithinExportOnly: duplicateWithinExport,
      wouldInsertFirstOccurrenceRows: wouldInsertCount,
      firstBatchMaxExamInserts: capSim.maxExamInserts,
      simulatedSuccessfulInsertsAfterCap:
        capSim.maxExamInserts != null ? capSim.simulatedSuccessfulInserts : wouldInsertCount,
      importStoppedEarlyByCap: capSim.stoppedByCap,
    },
    importPolicy: {
      objectOptionsNormalized: true,
      stemHashUsesNormalizedDedupe: true,
      tierRequired: true,
      examRequiredNoDefault: true,
      defaultStatusDraftWhenAbsent: true,
      note: "Rows without tier or exam are rejected (not defaulted to free or NCLEX-RN). Options may be an array or A/B/C/D object; flashcards are detected before exam mapping.",
    },
    distributions: {
      byExam: topN(byExam, 50),
      byTier: topN(byTier, 30),
      byTrack: topN(byTrack, 20),
    },
    databaseDuplicatePreview: checkDb
      ? {
          ran: !dbSkipped,
          skippedReason: dbSkipped ? "DATABASE_URL and PROD_DATABASE_URL both unset" : undefined,
          wouldInsertUniqueStemHashes: wouldInsertCount,
          stemHashesFoundInExamQuestions: inDb.size,
          appearNewNotInDb: wouldInsertCount - inDb.size,
          note: "Read-only SELECT on exam_questions.stem_hash; no writes.",
        }
      : { ran: false, note: "Pass --check-db with DATABASE_URL or PROD_DATABASE_URL set." },
    clustering: {
      singleSourceFile: "ai_cache.json",
      topCacheKeysByInExportDuplicateItems: topDupCacheKeys,
      topCacheKeysByExamMcqVolume: topExamVolumeCacheKeys,
      note: "Duplicates are 2nd+ occurrences of the same stem_hash in file order; attributed to the cache_key of the duplicate row.",
    },
    samplesWritten: sampleOut,
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
