/**
 * Loads recovered Replit / legacy JSON exports from `data/imports/` (or `REPLIT_IMPORT_DIR`)
 * using `scripts/replit-export-import/import-pipeline.ts` (upsert, no deletes).
 *
 * Enable with `REPLIT_IMPORT_ENABLED=1` (otherwise this step is a no-op).
 *
 * Optional env:
 * - REPLIT_IMPORT_EXTRACT_AI_CACHE=1 — derive flashcard_bank / exam_questions rows from ai_cache.output_json
 * - REPLIT_IMPORT_APPLY_KILL_SWITCHES=1 — restore exported enabled flags (default: import rows with enabled=false)
 * - REPLIT_IMPORT_DECK_OWNER_ID — required user id when flashcard_decks.json rows omit owner_id
 */
import fs from "fs";
import path from "path";
import type { Pool } from "pg";
import { logStartupDatabaseResolution } from "./db";

function envFlag(name: string): boolean {
  const v = String(process.env[name] || "").toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export async function seedReplitJsonImports(pool: Pool): Promise<void> {
  logStartupDatabaseResolution();

  if (!envFlag("REPLIT_IMPORT_ENABLED")) {
    console.log(
      "[replitJsonImports] Skipped — set REPLIT_IMPORT_ENABLED=1 and place JSON files under data/imports/ (or REPLIT_IMPORT_DIR).",
    );
    return;
  }

  const dir = process.env.REPLIT_IMPORT_DIR
    ? path.resolve(process.env.REPLIT_IMPORT_DIR)
    : path.resolve(process.cwd(), "data", "imports");

  if (!fs.existsSync(dir)) {
    console.warn(`[replitJsonImports] Directory missing: ${dir} — nothing to import.`);
    return;
  }

  const { runImportPipeline } = await import("../scripts/replit-export-import/import-pipeline");

  const result = await runImportPipeline(pool, dir, {
    apply: true,
    extractAiCache: envFlag("REPLIT_IMPORT_EXTRACT_AI_CACHE"),
    applyKillSwitchState: envFlag("REPLIT_IMPORT_APPLY_KILL_SWITCHES"),
    deckOwnerFallback: process.env.REPLIT_IMPORT_DECK_OWNER_ID?.trim() || null,
    maxExamInserts: undefined,
  });

  const summary = {
    type: "replit_import_verification",
    dir: result.inventory.dir,
    files: result.inventory.files.map((f) => ({
      name: f.name,
      rows: f.rows,
      table: f.catalog?.table,
    })),
    perFileStats: result.stats.map((s) => ({
      file: s.file,
      table: s.table,
      inserted: s.inserted,
      updated: s.updated,
      skipped: s.skipped,
      skipReasons: s.skipReasons,
      errorCount: s.errors.length,
    })),
    errorsFlat: result.stats.flatMap((s) => s.errors.map((e) => `${s.file}: ${e}`)),
  };

  console.log("\n=== Replit JSON import (recovered DB exports) ===");
  console.log(JSON.stringify(summary));
  if (summary.errorsFlat.length > 0) {
    console.warn(`[replitJsonImports] ${summary.errorsFlat.length} row-level messages (see JSON errorsFlat).`);
  }
}
