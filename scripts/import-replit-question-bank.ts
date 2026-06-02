#!/usr/bin/env npx tsx
/**
 * Bulk import Replit-exported MCQs into `exam_questions` (Prisma).
 *
 *   # Preview (no writes); reads JSON under data/replit-exports/
 *   npm run import:replit-questions -- --dry-run
 *
 *   # Import with defaults (US, RN track, draft status, batch 80)
 *   npm run import:replit-questions -- --dir=data/replit-exports
 *
 *   # Explicit mapping defaults + report file
 *   npm run import:replit-questions -- --dir=data/replit-exports --default-country=CA --default-track=PN --status=draft --batch-size=80 --report=.replit-import-report.json
 *
 * Env: REPLIT_EXPORTS_DIR overrides default directory when --dir omitted.
 */
import "../src/lib/db/env-bootstrap";

import fs from "node:fs";
import path from "node:path";
import { runReplitQuestionImportPipeline } from "@/lib/replit-import/replit-question-pipeline";
import type { ImportCountry, ProductTrack } from "@/lib/replit-import/replit-question-types";

function argValue(prefix: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(prefix));
  if (!hit) return undefined;
  return hit.slice(prefix.length);
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const dirArg = argValue("--dir=") ?? process.env.REPLIT_EXPORTS_DIR ?? "data/replit-exports";
  const rootDir = path.resolve(process.cwd(), dirArg);

  const batchRaw = argValue("--batch-size=");
  const batchSize = batchRaw ? Math.max(1, Math.min(250, Number(batchRaw) || 80)) : 80;

  const retriesRaw = argValue("--max-retries=");
  const maxRetries = retriesRaw ? Math.max(1, Math.min(8, Number(retriesRaw) || 3)) : 3;

  const dc = (argValue("--default-country=") ?? "US").toUpperCase();
  const defaultCountry: ImportCountry = dc === "CA" ? "CA" : "US";

  const dt = (argValue("--default-track=") ?? "RN").toUpperCase();
  const trackMap: Record<string, ProductTrack> = {
    RN: "RN",
    PN: "PN",
    NP: "NP",
    ALLIED: "ALLIED",
  };
  const defaultTrack = trackMap[dt] ?? "RN";

  const st = (argValue("--status=") ?? "draft").toLowerCase();
  const statusDb = st === "published" ? "published" : "draft";

  const reportPath = argValue("--report=");

  void (async () => {
    console.error(`[replit-import] rootDir=${rootDir} dryRun=${dryRun} batchSize=${batchSize} country=${defaultCountry} track=${defaultTrack} status=${statusDb}`);

    const report = await runReplitQuestionImportPipeline({
      rootDir,
      dryRun,
      batchSize,
      maxRetries,
      defaultCountry,
      defaultTrack,
      statusDb,
    });

    const summary = {
      dryRun: report.dryRun,
      filesScanned: report.filesScanned,
      rawRecordsSeen: report.rawRecordsSeen,
      normalizedOk: report.normalizedOk,
      validationErrors: report.validationErrors,
      duplicateSkippedInRun: report.duplicateSkippedInRun,
      duplicateSkippedInDb: report.duplicateSkippedInDb,
      rowsReadyToInsert: report.rowsReadyToInsert,
      inserted: report.inserted,
      singleRowFallbackInserts: report.singleRowFallbackInserts,
      parseErrorsCount: report.parseErrors.length,
      normalizationErrorsCount: report.normalizationErrors.length,
      insertErrorsCount: report.insertErrors.length,
    };

    console.log(JSON.stringify({ summary, report }, null, 2));

    if (reportPath) {
      fs.writeFileSync(path.resolve(process.cwd(), reportPath), JSON.stringify(report, null, 2), "utf8");
      console.error(`[replit-import] wrote ${reportPath}`);
    }

    const dedupeFailed = report.insertErrors.some((e) => e.message.startsWith("stem_hash_lookup_failed"));
    if (dedupeFailed && !dryRun && report.normalizedOk > 0) {
      process.exitCode = 2;
    }
  })().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
}

main();
