#!/usr/bin/env npx tsx
import "../../server/load-env";
import * as fs from "fs";
import * as path from "path";
import { getPool, logStartupDatabaseResolution } from "../../server/db";
import { listJsonFiles, loadJsonRows } from "./helpers";
import { REPLIT_EXPORT_CATALOG, CATALOG_BY_FILE } from "./catalog";
import { runImportPipeline } from "./import-pipeline";

function parseArgs(argv: string[]) {
  const isInventory = argv[0] === "inventory" || argv.includes("inventory");
  const apply = argv.includes("--apply");
  const applyKillSwitchState = argv.includes("--apply-kill-switch-state");
  const extractAiCache = !argv.includes("--no-ai-cache-extract");
  const dirIdx = argv.indexOf("--dir");
  const dir =
    dirIdx >= 0 && argv[dirIdx + 1]
      ? path.resolve(argv[dirIdx + 1])
      : fs.existsSync(path.resolve("nursenest-core/data/replit-exports"))
        ? path.resolve("nursenest-core/data/replit-exports")
        : path.resolve("data/replit-exports");
  const ownerIdx = argv.indexOf("--deck-owner-id");
  const deckOwnerFallback =
    ownerIdx >= 0 && argv[ownerIdx + 1]
      ? argv[ownerIdx + 1]
      : process.env.REPLIT_IMPORT_DECK_OWNER_ID?.trim() || null;

  const maxExamIdx = argv.indexOf("--max-exam-inserts");
  let maxExamInserts: number | undefined;
  if (maxExamIdx >= 0 && argv[maxExamIdx + 1]) {
    const n = parseInt(argv[maxExamIdx + 1]!, 10);
    if (Number.isFinite(n) && n >= 0) maxExamInserts = n;
  }

  const skipOperationalPipeline = argv.includes("--skip-operational-imports");

  return {
    isInventory,
    apply,
    applyKillSwitchState,
    extractAiCache,
    dir,
    deckOwnerFallback,
    maxExamInserts,
    skipOperationalPipeline,
  };
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(`
Replit / legacy JSON export → Postgres import pipeline

Commands:
  inventory              List JSON files in --dir and classify (no database writes)
  import                 Run importers (default: dry-run; use --apply to write)

Options:
  --dir <path>           Directory containing *.json exports (default: data/replit-exports)
  --apply                Execute upserts (without this, only validates + counts)
  --deck-owner-id <id>   Fallback owner_id for flashcard_decks rows missing owner_id
                         (or set REPLIT_IMPORT_DECK_OWNER_ID)
  --no-ai-cache-extract  Skip extracting flashcard_bank / exam_questions from ai_cache.output_json
  --max-exam-inserts N    Cap successful exam_questions rows from ai_cache extract (default: unlimited)
  --skip-operational-imports  Skip ai_cache raw rows, generation_jobs, generation_events (recommended for prod content-only).
  --apply-kill-switch-state  Import kill_switches.enabled as exported (DANGEROUS).
                         Default: import kill switch rows with enabled=false.

Environment:
  DATABASE_URL / PROD_DATABASE_URL  Target database (same pool resolution as the app)

Examples:
  npx tsx scripts/replit-export-import/cli.ts inventory
  npx tsx scripts/replit-export-import/cli.ts import --dir data/replit-exports
  npx tsx scripts/replit-export-import/cli.ts import --apply --deck-owner-id <user-uuid>
`);
    process.exit(0);
  }

  const opts = parseArgs(argv);

  if (opts.isInventory) {
    console.log(JSON.stringify({ type: "replit_export_inventory", dir: opts.dir, catalog: REPLIT_EXPORT_CATALOG }, null, 2));
    const files = listJsonFiles(opts.dir);
    const found = files.map((fp) => {
      const name = path.basename(fp);
      const rowsArr = loadJsonRows(fp);
      const rows = rowsArr.length;
      const keys = rows > 0 ? Object.keys(rowsArr[0] as object).slice(0, 12) : [];
      return { file: name, rowCount: rows, sampleKeys: keys, mapsTo: CATALOG_BY_FILE.get(name)?.table ?? null };
    });
    console.log(JSON.stringify({ type: "replit_export_files", files: found }, null, 2));
    if (files.length === 0) {
      console.log(
        `\nNo .json files in ${opts.dir}. Copy your Replit exports here (see catalog above for expected filenames).`,
      );
    }
    return;
  }

  logStartupDatabaseResolution();
  const pool = getPool();
  const result = await runImportPipeline(pool, opts.dir, {
    apply: opts.apply,
    extractAiCache: opts.extractAiCache,
    applyKillSwitchState: opts.applyKillSwitchState,
    deckOwnerFallback: opts.deckOwnerFallback,
    maxExamInserts: opts.maxExamInserts,
    skipOperationalPipeline: opts.skipOperationalPipeline,
  });

  console.log(
    JSON.stringify(
      {
        type: "replit_import_report",
        ok: true,
        dryRun: !opts.apply,
        dir: opts.dir,
        inventory: result.inventory,
        stats: result.stats,
        warnings: [
          !opts.apply ? "Dry run only — no rows were written. Pass --apply to upsert." : null,
          !opts.applyKillSwitchState ? "Kill switches imported with enabled=false (safe default)." : "Kill switch ENABLED states were applied from export — use only if intentional.",
        ].filter(Boolean),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
