import * as path from "path";
import * as fs from "fs";
import { loadJsonRows } from "./json-load";
import { getRegistryEntry } from "./file-registry";
import { stemHashHex } from "./field-maps/exam-question-from-legacy";
import {
  iterateAiCacheOutputItems,
  normalizeAiCacheOutputJson,
  parseAiCacheNursingExamItem,
  buildNursingParseContext,
} from "./nursing-ai-cache-extract";
import { resolutionCategoryForAudit } from "./nursing-exam-metadata-enrich";
import { computeHeuristicSuggestion } from "./nursing-review-metadata";

export type FileValidationResult = {
  fileName: string;
  domain: string;
  targetTable: string;
  /** Rows in JSON array */
  rowCount: number;
  valid: number;
  invalid: number;
  skipped: number;
  duplicates: number;
  failed: number;
  skipReasons: Record<string, number>;
  duplicateReasons: Record<string, number>;
  errors: string[];
  /** First N error samples */
  errorSamples: string[];
};

export type ValidationReport = {
  generatedAt: string;
  sourceDir: string;
  dryRun: boolean;
  files: FileValidationResult[];
  totals: {
    valid: number;
    invalid: number;
    skipped: number;
    duplicates: number;
    failed: number;
  };
  nursingStemHashesSeen: number;
  /** Populated when ai_cache.json is validated with enrichment enabled. */
  nursingEnrichmentSummary?: {
    examMapSucceeded: number;
    alreadyHadTierExamOnItem: number;
    enrichedSuccessfully: number;
    stillRejectedMissingTier: number;
    stillRejectedMissingExam: number;
    ambiguousAfterEnrichment: number;
    sentToReview: number;
    suggestionOnlyRows: number;
    /** Counts by resolutionCategoryForAudit (successful rows) plus `unresolved` for inconclusive. */
    provenanceTotals: Record<string, number>;
    topAmbiguousKeyPatterns: [string, number][];
  };
};

const MAX_ERROR_SAMPLES = 30;

function bump(m: Record<string, number>, key: string): void {
  m[key] = (m[key] ?? 0) + 1;
}

export function validateStagedExports(repoRoot: string, sourceDirRel: string): ValidationReport {
  const sourceDir = path.resolve(repoRoot, sourceDirRel);
  const names = fs
    .readdirSync(sourceDir)
    .filter((f) => f.endsWith(".json"))
    .sort((a, b) => {
      const pa = getRegistryEntry(a)?.importPriority ?? 999;
      const pb = getRegistryEntry(b)?.importPriority ?? 999;
      if (pa !== pb) return pa - pb;
      return a.localeCompare(b);
    });

  const globalStemHashes = new Set<string>();
  const files: FileValidationResult[] = [];
  const exportDirAbs = sourceDir;
  const ambiguousKeyBump: Record<string, number> = {};

  let ne = {
    examMapSucceeded: 0,
    alreadyHadTierExamOnItem: 0,
    enrichedSuccessfully: 0,
    stillRejectedMissingTier: 0,
    stillRejectedMissingExam: 0,
    ambiguousAfterEnrichment: 0,
  };

  for (const fileName of names) {
    const reg = getRegistryEntry(fileName);
    const filePath = path.join(sourceDir, fileName);
    const rows = loadJsonRows(filePath);

    const result: FileValidationResult = {
      fileName,
      domain: reg?.domain ?? "unknown",
      targetTable: reg?.targetTable ?? "unknown",
      rowCount: rows.length,
      valid: 0,
      invalid: 0,
      skipped: 0,
      duplicates: 0,
      failed: 0,
      skipReasons: {},
      duplicateReasons: {},
      errors: [],
      errorSamples: [],
    };

    const pushErr = (msg: string) => {
      result.errors.push(msg);
      if (result.errorSamples.length < MAX_ERROR_SAMPLES) result.errorSamples.push(msg);
    };

    if (fileName === "ai_cache.json") {
      let rowIndex = -1;
      for (const row of rows) {
        rowIndex += 1;
        const oj = normalizeAiCacheOutputJson(row.output_json ?? row.outputJson);
        if (oj === null || oj === undefined) {
          result.skipped += 1;
          bump(result.skipReasons, "missing_or_invalid_output_json");
          continue;
        }
        let outputItemIndex = -1;
        for (const item of iterateAiCacheOutputItems(oj)) {
          outputItemIndex += 1;
          const r = row as Record<string, unknown>;
          const ctx = buildNursingParseContext(r, {
            exportDirAbs,
            sourceFileName: fileName,
            rowIndex,
            outputItemIndex,
            repoRoot,
          });
          const parsed = parseAiCacheNursingExamItem(item as Record<string, unknown>, ctx);
          if (parsed.kind === "flashcard") {
            result.skipped += 1;
            bump(result.skipReasons, "flashcard_shape_not_nursing_exam_question");
            continue;
          }
          if (parsed.kind === "inconclusive") {
            result.invalid += 1;
            bump(result.skipReasons, parsed.mapErrors.join(",") || "map_failed");
            pushErr(`${fileName}: ${parsed.mapErrors.join(",")}`);
            const en = parsed.enrichment;
            ne.sentToReview += 1;
            bump(provenanceTotals, "unresolved");
            const sug = computeHeuristicSuggestion(item as Record<string, unknown>, ctx);
            if (sug.suggestion_reasons.length) ne.suggestionOnlyRows += 1;
            if (en?.ambiguous) {
              ne.ambiguousAfterEnrichment += 1;
              const ck = ctx.cacheKey ?? "__null_cache_key__";
              bump(ambiguousKeyBump, ck);
            }
            if (parsed.mapErrors.some((e) => e.includes("missing_tier"))) ne.stillRejectedMissingTier += 1;
            if (parsed.mapErrors.some((e) => e.includes("missing_exam"))) ne.stillRejectedMissingExam += 1;
            continue;
          }
          ne.examMapSucceeded += 1;
          const en = parsed.enrichment;
          if (en) {
            bump(provenanceTotals, resolutionCategoryForAudit(en));
            if (en.originalTier && en.originalExam) ne.alreadyHadTierExamOnItem += 1;
            else if (en.mergedTier && en.mergedExam) ne.enrichedSuccessfully += 1;
          }
          const h = parsed.value.stemHash;
          if (globalStemHashes.has(h)) {
            result.duplicates += 1;
            bump(result.duplicateReasons, "duplicate_stem_hash_across_export");
          } else {
            globalStemHashes.add(h);
            result.valid += 1;
          }
        }
      }
      files.push(result);
      continue;
    }

    if (reg?.domain === "users_auth") {
      result.skipped = rows.length;
      bump(result.skipReasons, "excluded_domain_users_auth");
      files.push(result);
      continue;
    }

    if (reg?.domain === "ops_analytics") {
      result.skipped = rows.length;
      bump(result.skipReasons, "excluded_domain_ops_analytics");
      files.push(result);
      continue;
    }

    if (!reg) {
      result.skipped = rows.length;
      bump(result.skipReasons, "unmapped_registry");
      files.push(result);
      continue;
    }

    /** Default: structural validation only — row has non-empty id or primary key from sample keys */
    for (const row of rows) {
      const keys = Object.keys(row);
      if (keys.length === 0) {
        result.invalid += 1;
        pushErr(`${fileName}: empty_object`);
        continue;
      }
      result.valid += 1;
    }

    files.push(result);
  }

  const totals = files.reduce(
    (acc, f) => ({
      valid: acc.valid + f.valid,
      invalid: acc.invalid + f.invalid,
      skipped: acc.skipped + f.skipped,
      duplicates: acc.duplicates + f.duplicates,
      failed: acc.failed + f.failed,
    }),
    { valid: 0, invalid: 0, skipped: 0, duplicates: 0, failed: 0 },
  );

  const topAmbiguous = Object.entries(ambiguousKeyBump)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25) as [string, number][];

  return {
    generatedAt: new Date().toISOString(),
    sourceDir,
    dryRun: true,
    files,
    totals,
    nursingStemHashesSeen: globalStemHashes.size,
    nursingEnrichmentSummary: {
      ...ne,
      provenanceTotals,
      topAmbiguousKeyPatterns: topAmbiguous,
    },
  };
}

export { stemHashHex };
