#!/usr/bin/env npx tsx
/**
 * Scan ai_cache.json in an export bundle and write a review artifact for rows still missing tier/exam after enrichment.
 */
import "../../server/load-env";
import * as fs from "fs";
import * as path from "path";
import { loadJsonRows } from "./json-load";
import {
  normalizeAiCacheOutputJson,
  iterateAiCacheOutputItems,
  parseAiCacheNursingExamItem,
  buildNursingParseContext,
} from "./nursing-ai-cache-extract";
import {
  buildNursingUnresolvedReviewEntry,
  type NursingReviewArtifactFileV1,
} from "./nursing-review-artifact-shared";
import { resolutionCategoryForAudit } from "./nursing-exam-metadata-enrich";

function parseArgs(argv: string[]) {
  const dirIdx = argv.indexOf("--dir");
  const dirAbs =
    dirIdx >= 0 && argv[dirIdx + 1] ? path.resolve(argv[dirIdx + 1]) : path.resolve("data/replit-exports");
  const outIdx = argv.indexOf("--out");
  const outAbs =
    outIdx >= 0 && argv[outIdx + 1]
      ? path.resolve(argv[outIdx + 1]!)
      : path.join(dirAbs, "review", "nursing-unresolved-metadata-review.json");
  return { dirAbs, outAbs };
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(`
Generate nursing unresolved-metadata review artifact (JSON).

Usage:
  npx tsx scripts/replit-import/nursing-generate-review-artifact.ts [--dir <exportDir>] [--out <file.json>]

Defaults:
  --dir  data/replit-exports
  --out  <dir>/review/nursing-unresolved-metadata-review.json
`);
    process.exit(0);
  }

  const { dirAbs, outAbs } = parseArgs(argv);
  const repoRoot = process.cwd();
  const filePath = path.join(dirAbs, "ai_cache.json");
  if (!fs.existsSync(filePath)) {
    console.error(JSON.stringify({ error: "file_not_found", filePath }, null, 2));
    process.exit(1);
  }

  const rows = loadJsonRows(filePath) as Record<string, unknown>[];
  const sourceFile = "ai_cache.json";

  let totalNursingRowsScanned = 0;
  let validRows = 0;
  let unresolvedRows = 0;
  const unresolvedKeys = new Set<string>();
  let suggestionOnlyRows = 0;
  const provenanceTotals: Record<string, number> = {};

  const entries: ReturnType<typeof buildNursingUnresolvedReviewEntry>[] = [];
  const seenEntryIds = new Set<string>();

  let rowIndex = -1;
  for (const row of rows) {
    rowIndex += 1;
    const oj = normalizeAiCacheOutputJson(row.output_json ?? row.outputJson);
    if (oj === null || oj === undefined) continue;

    let outputItemIndex = -1;
    for (const item of iterateAiCacheOutputItems(oj)) {
      outputItemIndex += 1;
      const ctx = buildNursingParseContext(row as Record<string, unknown>, {
        exportDirAbs: dirAbs,
        sourceFileName: sourceFile,
        rowIndex,
        outputItemIndex,
        repoRoot,
      });
      const parsed = parseAiCacheNursingExamItem(item as Record<string, unknown>, ctx);
      if (parsed.kind === "flashcard") continue;

      totalNursingRowsScanned += 1;

      if (parsed.kind === "exam_mcq") {
        validRows += 1;
        const en = parsed.enrichment;
        if (en) {
          const cat = resolutionCategoryForAudit(en);
          provenanceTotals[cat] = (provenanceTotals[cat] ?? 0) + 1;
        }
        continue;
      }

      unresolvedRows += 1;
      const ck = ctx.cacheKey ?? "__null__";
      unresolvedKeys.add(ck);
      const en = parsed.enrichment;
      if (en) {
        const cat = resolutionCategoryForAudit(en);
        provenanceTotals[cat] = (provenanceTotals[cat] ?? 0) + 1;
      }

      const rec = buildNursingUnresolvedReviewEntry(
        item as Record<string, unknown>,
        ctx,
        parsed.mapErrors,
        parsed.enrichment ?? null,
        sourceFile,
      );
      if (rec.heuristic.suggestion_reasons.length) suggestionOnlyRows += 1;
      if (!seenEntryIds.has(rec.id)) {
        seenEntryIds.add(rec.id);
        entries.push(rec);
      }
    }
  }

  const artifact: NursingReviewArtifactFileV1 = {
    version: 1,
    kind: "nursing_unresolved_metadata_review",
    generatedAt: new Date().toISOString(),
    sourceDir: dirAbs,
    sourceFile,
    counts: {
      totalNursingRowsScanned,
      validRows,
      unresolvedRows,
      uniqueUnresolvedCacheKeys: unresolvedKeys.size,
      suggestionOnlyRows,
    },
    entries,
  };

  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, JSON.stringify(artifact, null, 2), "utf8");

  const summary = {
    type: "nursing_generate_review_artifact",
    ok: true,
    written: outAbs,
    counts: artifact.counts,
    provenanceTotals,
    note: "Fill reviewed_tier and reviewed_exam in entries, then run npm run nursing:apply-reviewed-metadata",
  };
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
