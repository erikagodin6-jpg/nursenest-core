#!/usr/bin/env npx tsx
/**
 * Ordered Replit export → database import (idempotent upserts, no truncates).
 *
 * Phase order: content_items (Prisma) → content_translations → exam_questions (+ allied questions) →
 * flashcard_bank + standard replit pipeline (decks, imaging, …) → allied Prisma flashcards →
 * digital_products + pricing_plans.
 *
 * Usage (repo root):
 *   npx tsx scripts/replit-export-import/orchestrated-import.ts
 *   npx tsx scripts/replit-export-import/orchestrated-import.ts --apply
 *   npx tsx scripts/replit-export-import/orchestrated-import.ts --dir nursenest-core/data/replit-exports
 *   npx tsx scripts/replit-export-import/orchestrated-import.ts --apply --deck-owner-id=<user-cuid>
 *
 * Production-first defaults:
 *   --include-operational-imports   Also import ai_cache rows, generation_jobs, generation_events (off by default).
 *   --include-generated-questions Import generated_questions.json → legacy generated_questions table (off by default).
 *   --max-generated-questions=N    Cap rows for generated_questions import.
 */
import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import "../../server/load-env";
import { getPool, logStartupDatabaseResolution } from "../../server/db";
import { runImportPipeline } from "./import-pipeline";
import {
  importContentTranslations,
  importDigitalProducts,
  importExamQuestionsMonolith,
  importFlashcardBank,
  importGeneratedQuestionsMonolith,
  importPricingPlans,
} from "./monolith-table-import";
import type { ImportStats } from "./helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function repoRoot(): string {
  return path.resolve(__dirname, "../..");
}

function nursenestCoreRoot(): string {
  return path.join(repoRoot(), "nursenest-core");
}

function parseArgs(argv: string[]) {
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    return hit ? hit.slice(pref.length) : undefined;
  };
  const dirIdx = argv.indexOf("--dir");
  const dirArg = dirIdx >= 0 && argv[dirIdx + 1] ? path.resolve(argv[dirIdx + 1]!) : null;
  const apply = argv.includes("--apply");
  const deckOwnerFallback =
    get("deck-owner-id")?.trim() || process.env.REPLIT_IMPORT_DECK_OWNER_ID?.trim() || null;
  const includeOperationalImports = argv.includes("--include-operational-imports");
  const skipOperationalPipeline = !includeOperationalImports;
  const includeGeneratedQuestions = argv.includes("--include-generated-questions");
  const maxGenRaw = get("max-generated-questions");
  let maxGeneratedQuestions: number | null = null;
  if (maxGenRaw !== undefined) {
    const n = parseInt(maxGenRaw, 10);
    if (Number.isFinite(n) && n >= 0) maxGeneratedQuestions = n;
  }
  return {
    dirArg,
    apply,
    deckOwnerFallback,
    skipOperationalPipeline,
    includeGeneratedQuestions,
    maxGeneratedQuestions,
  };
}

function resolveExportDir(dirArg: string | null): string {
  if (dirArg) return dirArg;
  const candidates = [
    path.join(repoRoot(), "nursenest-core", "data", "replit-exports"),
    path.join(repoRoot(), "data", "replit-exports"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) return c;
  }
  return candidates[0]!;
}

function runNursenestScript(
  scriptRel: string,
  extraArgs: string[],
  apply: boolean,
): { ok: boolean; status: number | null; stderr: string } {
  const nc = nursenestCoreRoot();
  const scriptPath = path.join(nc, scriptRel);
  const args = ["tsx", scriptPath, ...extraArgs];
  if (apply) args.push("--apply");
  const r = spawnSync("npx", args, {
    cwd: nc,
    env: { ...process.env },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  return { ok: r.status === 0, status: r.status, stderr: r.stderr || "" };
}

function fileInDir(dir: string, name: string): string | null {
  const p = path.join(dir, name);
  return fs.existsSync(p) ? p : null;
}

async function verifyTableCounts(pool: ReturnType<typeof getPool>): Promise<Record<string, number | null>> {
  const out: Record<string, number | null> = {};
  const queries: [string, string][] = [
    ["exam_questions", "SELECT COUNT(*)::bigint AS c FROM exam_questions"],
    ["content_items", "SELECT COUNT(*)::bigint AS c FROM content_items"],
    ["content_items_lessons", "SELECT COUNT(*)::bigint AS c FROM content_items WHERE type = 'lesson'"],
    ["pathway_lessons", "SELECT COUNT(*)::bigint AS c FROM pathway_lessons"],
    ["content_translations", "SELECT COUNT(*)::bigint AS c FROM content_translations"],
    ["Flashcard", 'SELECT COUNT(*)::bigint AS c FROM "Flashcard"'],
    ["flashcard_bank", "SELECT COUNT(*)::bigint AS c FROM flashcard_bank"],
    ["digital_products", "SELECT COUNT(*)::bigint AS c FROM digital_products"],
    ["generated_questions", "SELECT COUNT(*)::bigint AS c FROM generated_questions"],
  ];
  for (const [label, sql] of queries) {
    try {
      const r = await pool.query(sql);
      out[label] = Number(r.rows[0]?.c ?? 0);
    } catch {
      out[label] = null;
    }
  }
  return out;
}

function summarizeStats(s: ImportStats) {
  return {
    file: s.file,
    table: s.table,
    inserted: s.inserted,
    updated: s.updated,
    skipped: s.skipped,
    skipReasons: s.skipReasons,
    errorCount: s.errors.length,
  };
}

async function main() {
  const pool = getPool();
  let code = 1;
  try {
    code = await runWithPool(pool);
  } finally {
    await pool.end();
  }
  process.exit(code);
}

async function runWithPool(pool: ReturnType<typeof getPool>): Promise<number> {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(`
orchestrated-import.ts — full Replit export import in dependency-safe order.

  --dir <path>           Export folder (default: nursenest-core/data/replit-exports or data/replit-exports)
  --apply                Perform writes (default: dry-run)
  --deck-owner-id <id>   flashcard_decks rows missing owner_id (replit pipeline)

Sub-steps:
  - import-content-items-json.ts (content_items)
  - content_translations, exam_questions.json, optional generated_questions, import-allied-json (questions then flashcards)
  - flashcard_bank.json + replit-export-import pipeline + digital_products + pricing_plans

Defaults skip operational JSON imports (generation_jobs/events, raw ai_cache rows). Pass --include-operational-imports for full parity.
`);
    return 0;
  }

  const {
    dirArg,
    apply,
    deckOwnerFallback,
    skipOperationalPipeline,
    includeGeneratedQuestions,
    maxGeneratedQuestions,
  } = parseArgs(argv);
  const exportDir = resolveExportDir(dirArg);

  if (!fs.existsSync(exportDir)) {
    console.log(JSON.stringify({ ok: false, error: "export_dir_missing", exportDir }, null, 2));
    return 2;
  }

  const emptyArrayPath = path.join(__dirname, "empty-array.json");
  const contentItemsFile = fileInDir(exportDir, "content_items.json");
  const translationsFile = fileInDir(exportDir, "content_translations.json");
  const examQuestionsFile = fileInDir(exportDir, "exam_questions.json");
  const alliedQuestionsFile = fileInDir(exportDir, "allied_questions.json");
  const generatedQuestionsFile = fileInDir(exportDir, "generated_questions.json");
  const alliedFlashcardsFile = fileInDir(exportDir, "allied_flashcards.json");
  const flashcardBankFile = fileInDir(exportDir, "flashcard_bank.json");
  const digitalProductsFile = fileInDir(exportDir, "digital_products.json");
  const pricingPlansFile = fileInDir(exportDir, "pricing_plans.json");

  const report: {
    type: string;
    dryRun: boolean;
    exportDir: string;
    options: {
      skipOperationalPipeline: boolean;
      includeGeneratedQuestions: boolean;
      maxGeneratedQuestions: number | null;
    };
    phases: unknown[];
    verify?: Record<string, number | null>;
    ok: boolean;
  } = {
    type: "orchestrated_replit_import",
    dryRun: !apply,
    exportDir,
    options: {
      skipOperationalPipeline,
      includeGeneratedQuestions,
      maxGeneratedQuestions,
    },
    phases: [],
    ok: true,
  };

  logStartupDatabaseResolution();

  const beforeCounts = await verifyTableCounts(pool);
  report.phases.push({ phase: "verify_before", counts: beforeCounts });

  // 1 — content_items (Prisma)
  if (contentItemsFile) {
    const r = runNursenestScript(
      "scripts/import-content-items-json.ts",
      [`--file=${contentItemsFile}`],
      apply,
    );
    report.phases.push({
      phase: "content_items_prisma",
      file: contentItemsFile,
      subprocessOk: r.ok,
    });
    if (!r.ok) report.ok = false;
  } else {
    report.phases.push({ phase: "content_items_prisma", skipped: true, reason: "no_file" });
  }

  // 2 — translations
  if (translationsFile) {
    const st = await importContentTranslations(pool, translationsFile, apply);
    report.phases.push({ phase: "content_translations", ...summarizeStats(st) });
  } else {
    report.phases.push({ phase: "content_translations", skipped: true, reason: "no_file" });
  }

  // 3 — exam_questions (monolith export)
  if (examQuestionsFile) {
    const st = await importExamQuestionsMonolith(pool, examQuestionsFile, apply);
    report.phases.push({ phase: "exam_questions_monolith", ...summarizeStats(st) });
  } else {
    report.phases.push({ phase: "exam_questions_monolith", skipped: true, reason: "no_file" });
  }

  // 3a — optional legacy generated_questions (AI batch artifacts; not live exam bank)
  if (includeGeneratedQuestions && generatedQuestionsFile) {
    const st = await importGeneratedQuestionsMonolith(
      pool,
      generatedQuestionsFile,
      apply,
      maxGeneratedQuestions,
    );
    report.phases.push({ phase: "generated_questions_monolith", ...summarizeStats(st) });
  } else {
    report.phases.push({
      phase: "generated_questions_monolith",
      skipped: true,
      reason: includeGeneratedQuestions ? "no_file" : "not_enabled_pass_--include-generated-questions",
    });
  }

  // 3b — allied questions → Prisma exam_questions (dedupe by stem hash)
  if (alliedQuestionsFile) {
    const r = runNursenestScript(
      "scripts/import-allied-json-to-prisma.ts",
      [`--questions=${alliedQuestionsFile}`, `--flashcards=${emptyArrayPath}`],
      apply,
    );
    report.phases.push({
      phase: "allied_questions_prisma",
      file: alliedQuestionsFile,
      subprocessOk: r.ok,
    });
    if (!r.ok) report.ok = false;
  } else {
    report.phases.push({ phase: "allied_questions_prisma", skipped: true, reason: "no_file" });
  }

  // 4 — flashcard_bank + replit pipeline (decks, imaging, …)
  if (flashcardBankFile) {
    const st = await importFlashcardBank(pool, flashcardBankFile, apply);
    report.phases.push({ phase: "flashcard_bank", ...summarizeStats(st) });
  } else {
    report.phases.push({ phase: "flashcard_bank", skipped: true, reason: "no_file" });
  }

  const pipelineResult = await runImportPipeline(pool, exportDir, {
    apply,
    extractAiCache: true,
    applyKillSwitchState: false,
    deckOwnerFallback,
    skipOperationalPipeline,
  });
  report.phases.push({
    phase: "replit_sql_pipeline",
    inventory: pipelineResult.inventory,
    stats: pipelineResult.stats.map(summarizeStats),
  });

  // 4b — allied Prisma flashcards
  if (alliedFlashcardsFile) {
    const r = runNursenestScript(
      "scripts/import-allied-json-to-prisma.ts",
      [`--questions=${emptyArrayPath}`, `--flashcards=${alliedFlashcardsFile}`],
      apply,
    );
    report.phases.push({
      phase: "allied_flashcards_prisma",
      file: alliedFlashcardsFile,
      subprocessOk: r.ok,
    });
    if (!r.ok) report.ok = false;
  } else {
    report.phases.push({ phase: "allied_flashcards_prisma", skipped: true, reason: "no_file" });
  }

  // 5 — products
  if (digitalProductsFile) {
    const st = await importDigitalProducts(pool, digitalProductsFile, apply);
    report.phases.push({ phase: "digital_products", ...summarizeStats(st) });
  } else {
    report.phases.push({ phase: "digital_products", skipped: true, reason: "no_file" });
  }

  if (pricingPlansFile) {
    const st = await importPricingPlans(pool, pricingPlansFile, apply);
    report.phases.push({ phase: "pricing_plans", ...summarizeStats(st) });
  } else {
    report.phases.push({ phase: "pricing_plans", skipped: true, reason: "no_file" });
  }

  const afterCounts = await verifyTableCounts(pool);
  report.verify = afterCounts;
  report.phases.push({ phase: "verify_after", counts: afterCounts });

  console.log(JSON.stringify(report, null, 2));

  if (!apply) {
    console.log("\nDry run only — no writes were performed. Re-run with --apply after review.");
  }

  return report.ok ? 0 : 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
