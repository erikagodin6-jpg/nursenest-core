#!/usr/bin/env npx tsx
/**
 * Nursing-only dry-run preview for ai_cache.json (no writes).
 * Optional read-only duplicate check against exam_questions.stem_hash when --check-db-duplicates is set.
 */
import "../../server/load-env";
import * as fs from "fs";
import * as path from "path";
import pg from "pg";
import { loadJsonRows } from "./json-load";
import {
  NURSING_EXAM_TARGET_TABLE,
  normalizeAiCacheOutputJson,
  iterateAiCacheOutputItems,
  parseAiCacheNursingExamItem,
  buildNursingParseContext,
} from "./nursing-ai-cache-extract";
import { resolutionCategoryForAudit, type EnrichmentAudit } from "./nursing-exam-metadata-enrich";
import { computeHeuristicSuggestion } from "./nursing-review-metadata";

export type NursingPreviewRow = {
  sourceFile: string;
  cacheKey: string | null;
  rowIndex: number;
  outputItemIndex: number;
  normalizedStem: string;
  stemHash: string;
  examType: string;
  tier: string;
  mergedTier: string | null;
  mergedExam: string | null;
  provenanceTier: string | null;
  provenanceExam: string | null;
  importable: boolean;
  reviewRequired: boolean;
  track: string;
  targetTable: string;
  would: "insert" | "skip";
  reason: string;
  enrichment?: EnrichmentAudit | null;
  /** True when text heuristics matched an exam label but row is still not importable. */
  suggestionHintsPresent?: boolean;
};

function bump(m: Record<string, number>, k: string): void {
  m[k] = (m[k] ?? 0) + 1;
}

function getDuplicateCheckDatabaseUrl(): string | null {
  const u = process.env.PROD_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim();
  return u || null;
}

async function stemHashExistsInExamQuestions(pool: pg.Pool, stemHash: string): Promise<boolean> {
  const r = await pool.query(`SELECT 1 FROM exam_questions WHERE stem_hash = $1 LIMIT 1`, [stemHash]);
  return r.rows.length > 0;
}

function parseArgs(argv: string[]) {
  const dirIdx = argv.indexOf("--dir");
  const dirAbs =
    dirIdx >= 0 && argv[dirIdx + 1] ? path.resolve(argv[dirIdx + 1]) : path.resolve("data/replit-exports");
  const limitIdx = argv.indexOf("--limit");
  const limit = limitIdx >= 0 && argv[limitIdx + 1] ? Math.max(1, parseInt(argv[limitIdx + 1]!, 10)) : undefined;
  const checkDbDuplicates = argv.includes("--check-db-duplicates");
  const maxIdx = argv.indexOf("--max-exam-inserts");
  let maxExamInserts: number | undefined;
  if (maxIdx >= 0 && argv[maxIdx + 1]) {
    const n = parseInt(argv[maxIdx + 1]!, 10);
    if (Number.isFinite(n) && n >= 0) maxExamInserts = n;
  }
  return { dirAbs, limit, checkDbDuplicates, maxExamInserts };
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(`
Nursing import dry-run preview (ai_cache.json only). No database writes.

Usage:
  npx tsx scripts/replit-import/nursing-dry-run-preview.ts [--dir <path>] [--limit N] [--check-db-duplicates]

Options:
  --dir <path>           Directory containing ai_cache.json (default: data/replit-exports)
  --limit N              Max preview rows to print (default: unlimited)
  --check-db-duplicates  Read-only SELECT on exam_questions.stem_hash when
                         DATABASE_URL or PROD_DATABASE_URL is set (no writes)
  --max-exam-inserts N   Stop after N successful exam inserts (mirrors import pipeline);
                         remaining ai_cache rows are not processed (default: unlimited)

Examples:
  npx tsx scripts/replit-import/nursing-dry-run-preview.ts --dir data/replit-exports
  npx tsx scripts/replit-import/nursing-dry-run-preview.ts --dir data/replit-exports --check-db-duplicates --limit 200
  npx tsx scripts/replit-import/nursing-dry-run-preview.ts --dir data/replit-exports --max-exam-inserts 75
`);
    process.exit(0);
  }

  const { dirAbs, limit, checkDbDuplicates, maxExamInserts } = parseArgs(argv);
  const repoRoot = process.cwd();
  const filePath = path.join(dirAbs, "ai_cache.json");
  if (!fs.existsSync(filePath)) {
    console.error(JSON.stringify({ type: "nursing_preview_error", error: "file_not_found", path: filePath }, null, 2));
    process.exit(1);
  }

  const rows = loadJsonRows(filePath) as Record<string, unknown>[];
  const pool: pg.Pool | null = (() => {
    if (!checkDbDuplicates) return null;
    const url = getDuplicateCheckDatabaseUrl();
    if (!url) {
      console.error(
        JSON.stringify(
          {
            type: "nursing_preview_warning",
            message: "--check-db-duplicates requested but DATABASE_URL and PROD_DATABASE_URL are unset; skipping DB lookup",
          },
          null,
          2,
        ),
      );
      return null;
    }
    return new pg.Pool({ connectionString: url, max: 2, connectionTimeoutMillis: 8000 });
  })();

  try {
    const preview: NursingPreviewRow[] = [];
    const seenStemHashes = new Set<string>();
    let examSuccessfulInserts = 0;
    let stoppedByExamInsertCap = false;
    let rowIndex = -1;

    outer: for (const row of rows) {
      rowIndex += 1;
      const cacheKey =
        typeof row.cache_key === "string"
          ? row.cache_key
          : typeof row.cacheKey === "string"
            ? row.cacheKey
            : null;
      const oj = normalizeAiCacheOutputJson(row.output_json ?? row.outputJson);
      if (oj === null) continue;

      let outputItemIndex = -1;
      for (const item of iterateAiCacheOutputItems(oj)) {
        outputItemIndex += 1;
        const ctx = buildNursingParseContext(row as Record<string, unknown>, {
          exportDirAbs: dirAbs,
          sourceFileName: "ai_cache.json",
          rowIndex,
          outputItemIndex,
          repoRoot,
        });
        const parsed = parseAiCacheNursingExamItem(item as Record<string, unknown>, ctx);
        if (parsed.kind === "flashcard") {
          const previewRow: NursingPreviewRow = {
            sourceFile: "ai_cache.json",
            cacheKey,
            rowIndex,
            outputItemIndex,
            normalizedStem: "",
            stemHash: "",
            examType: "",
            tier: "",
            mergedTier: null,
            mergedExam: null,
            provenanceTier: null,
            provenanceExam: null,
            importable: false,
            reviewRequired: false,
            track: "flashcard",
            targetTable: "flashcard_bank",
            would: "skip",
            reason: "flashcard_shape_not_nursing_exam_question",
          };
          preview.push(previewRow);
          if (limit !== undefined && preview.length >= limit) break outer;
          continue;
        }
        if (parsed.kind === "inconclusive") {
          const en = parsed.enrichment ?? null;
          const sug = computeHeuristicSuggestion(item as Record<string, unknown>, ctx);
          preview.push({
            sourceFile: "ai_cache.json",
            cacheKey,
            rowIndex,
            outputItemIndex,
            normalizedStem: "",
            stemHash: "",
            examType: "",
            tier: "",
            mergedTier: en?.mergedTier ?? null,
            mergedExam: en?.mergedExam ?? null,
            provenanceTier: en?.tierSource ?? null,
            provenanceExam: en?.examSource ?? null,
            importable: false,
            reviewRequired: true,
            track: "unknown",
            targetTable: NURSING_EXAM_TARGET_TABLE,
            would: "skip",
            reason: `map_failed:${parsed.mapErrors.join(",")}`,
            enrichment: en,
            suggestionHintsPresent: sug.suggestion_reasons.length > 0,
          });
          if (limit !== undefined && preview.length >= limit) break outer;
          continue;
        }

        const v = parsed.value;
        const stem = v.stem.trim();
        const dupInExport = seenStemHashes.has(v.stemHash);
        if (!dupInExport) seenStemHashes.add(v.stemHash);

        let reason = dupInExport ? "duplicate_stem_hash_in_export_batch" : "ready_for_insert";
        let would: "insert" | "skip" = dupInExport ? "skip" : "insert";

        if (!dupInExport && pool) {
          const inDb = await stemHashExistsInExamQuestions(pool, v.stemHash);
          if (inDb) {
            would = "skip";
            reason = "duplicate_stem_hash_in_database";
          }
        }

        if (would === "insert" && maxExamInserts !== undefined) {
          if (examSuccessfulInserts >= maxExamInserts) {
            would = "skip";
            reason = "max_exam_inserts_cap_reached";
            stoppedByExamInsertCap = true;
          } else {
            examSuccessfulInserts += 1;
          }
        }

        const en = parsed.enrichment ?? null;
        preview.push({
          sourceFile: "ai_cache.json",
          cacheKey,
          rowIndex,
          outputItemIndex,
          normalizedStem: stem.length > 400 ? `${stem.slice(0, 400)}…` : stem,
          stemHash: v.stemHash,
          examType: v.exam,
          tier: v.tier,
          mergedTier: en?.mergedTier ?? v.tier,
          mergedExam: en?.mergedExam ?? v.exam,
          provenanceTier: en?.tierSource ?? null,
          provenanceExam: en?.examSource ?? null,
          importable: en?.importable ?? true,
          reviewRequired: en?.reviewRequired ?? false,
          track: v.careerType === "nursing" ? "nursing" : v.careerType,
          targetTable: NURSING_EXAM_TARGET_TABLE,
          would,
          reason,
          enrichment: en,
        });
        if (limit !== undefined && preview.length >= limit) break outer;
        if (stoppedByExamInsertCap) break outer;
      }
    }

    const provenanceTotals: Record<string, number> = {};
    let sentToReview = 0;
    let suggestionOnly = 0;
    for (const r of preview) {
      if (r.reviewRequired && r.targetTable === NURSING_EXAM_TARGET_TABLE) {
        sentToReview += 1;
        bump(provenanceTotals, "unresolved");
        if (r.suggestionHintsPresent) suggestionOnly += 1;
      } else if (r.enrichment) {
        bump(provenanceTotals, resolutionCategoryForAudit(r.enrichment));
      }
    }

    console.log(
      JSON.stringify(
        {
          type: "nursing_import_preview",
          dryRun: true,
          sourceDir: dirAbs,
          sourceFile: "ai_cache.json",
          cacheRows: rows.length,
          previewRows: preview.length,
          checkDbDuplicates: Boolean(checkDbDuplicates && pool),
          maxExamInserts: maxExamInserts ?? null,
          examSuccessfulInsertsSimulated: examSuccessfulInserts,
          stoppedEarlyByMaxExamInserts: stoppedByExamInsertCap,
          summary: {
            sentToReview,
            provenanceTotals,
            suggestionOnly,
          },
          rows: preview,
        },
        null,
        2,
      ),
    );
  } finally {
    await pool?.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
