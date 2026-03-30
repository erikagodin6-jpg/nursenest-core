#!/usr/bin/env npx tsx
/**
 * Static + row-level dry report for Replit JSON exports (no DB writes).
 * Optional --probe-db runs read-only COUNT queries when the pg pool connects.
 *
 *   npx tsx scripts/replit-export-import/migration-dry-report.ts
 *   npx tsx scripts/replit-export-import/migration-dry-report.ts --dir nursenest-core/data/replit-exports
 *   npx tsx scripts/replit-export-import/migration-dry-report.ts --probe-db
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { loadJsonRows, rowVal, str } from "./helpers";
import { CATALOG_BY_FILE } from "./catalog";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type ExportBucket =
  | "phase1_production_db"
  | "phase2_optional_db"
  | "cdn_or_media"
  | "exclude_default";

export type FileReportRow = {
  file: string;
  bucket: ExportBucket;
  targetTableOrModel: string | null;
  pipeline: string;
  rowCount: number;
  transformNotes: string;
  mergeStrategy: string;
  validation: {
    validRows: number;
    invalidRows: number;
    invalidReasons: Record<string, number>;
  };
  safeToImportPhase1: boolean;
  manualReview: string | null;
};

const REGISTRY: Record<
  string,
  Omit<FileReportRow, "file" | "rowCount" | "validation" | "safeToImportPhase1" | "manualReview"> & {
    validateRow?: (row: Record<string, unknown>) => string | null;
  }
> = {
  "content_items.json": {
    bucket: "phase1_production_db",
    targetTableOrModel: "content_items (Prisma ContentItem)",
    pipeline: "nursenest-core/scripts/import-content-items-json.ts",
    transformNotes: "Map Drizzle-shaped rows; upsert by slug.",
    mergeStrategy: "Upsert on slug; dedupe by content hash within file.",
    validateRow: (row) => {
      if (!str(row, "slug").trim()) return "missing_slug";
      if (!str(row, "title").trim()) return "missing_title";
      return null;
    },
  },
  "content_translations.json": {
    bucket: "phase1_production_db",
    targetTableOrModel: "content_translations",
    pipeline: "monolith-table-import importContentTranslations",
    transformNotes: "Upsert on (content_type, content_id, field_name, language_code).",
    mergeStrategy: "Upsert; conflicts update translated text.",
    validateRow: (row) => {
      if (!str(row, "content_type").trim()) return "missing_content_type";
      if (!str(row, "content_id").trim()) return "missing_content_id";
      if (!str(row, "field_name").trim()) return "missing_field_name";
      if (!str(row, "language_code").trim()) return "missing_language_code";
      if (!str(row, "translated_text").trim()) return "missing_translated_text";
      return null;
    },
  },
  "exam_questions.json": {
    bucket: "phase1_production_db",
    targetTableOrModel: "exam_questions",
    pipeline: "monolith-table-import importExamQuestionsMonolith",
    transformNotes: "Full row upsert by id; aligns with Drizzle schema.",
    mergeStrategy: "ON CONFLICT(id) DO UPDATE.",
    validateRow: (row) => {
      const id = row.id != null ? String(row.id).trim() : "";
      if (!id) return "missing_id";
      if (!str(row, "stem").trim()) return "missing_stem";
      return null;
    },
  },
  "allied_questions.json": {
    bucket: "phase1_production_db",
    targetTableOrModel: "exam_questions (Prisma)",
    pipeline: "import-allied-json-to-prisma.ts (questions arm)",
    transformNotes: "Maps allied MCQ shape to Prisma ExamQuestion; stemHash dedupe.",
    mergeStrategy: "Insert if new stem_hash/id; skip duplicates.",
    validateRow: (row) => {
      if (!str(row, "stem").trim()) return "missing_stem";
      const opts = rowVal(row, "options");
      if (!Array.isArray(opts) || opts.length < 2) return "options_short";
      return null;
    },
  },
  "generated_questions.json": {
    bucket: "phase2_optional_db",
    targetTableOrModel: "generated_questions (legacy AI batches)",
    pipeline: "monolith-table-import importGeneratedQuestionsMonolith (--include-generated-questions)",
    transformNotes: "Not the live exam bank; optional cap via --max-generated-questions.",
    mergeStrategy: "ON CONFLICT(id) DO UPDATE.",
    validateRow: (row) => {
      const id = row.id != null ? String(row.id).trim() : "";
      if (!id) return "missing_id";
      if (!str(row, "generation_id").trim()) return "missing_generation_id";
      if (!str(row, "stem").trim()) return "missing_stem";
      const ch = rowVal(row, "choices");
      if (!Array.isArray(ch) || ch.length === 0) return "missing_choices";
      return null;
    },
  },
  "flashcard_bank.json": {
    bucket: "phase1_production_db",
    targetTableOrModel: "flashcard_bank",
    pipeline: "monolith-table-import importFlashcardBank",
    transformNotes: "Legacy bank; separate from Prisma Flashcard.",
    mergeStrategy: "ON CONFLICT(id) DO UPDATE; skip on content_hash conflict.",
    validateRow: (row) => {
      const id = row.id != null ? String(row.id).trim() : "";
      if (!id) return "missing_id";
      if (!str(row, "front").trim() || !str(row, "back").trim()) return "missing_front_or_back";
      return null;
    },
  },
  "deck_flashcards.json": {
    bucket: "phase1_production_db",
    targetTableOrModel: "deck_flashcards",
    pipeline: "import-pipeline importDeckFlashcards",
    transformNotes: "Junction rows; import after flashcard_decks.",
    mergeStrategy: "Upsert by primary key / importer logic.",
    validateRow: () => null,
  },
  "flashcard_decks.json": {
    bucket: "phase1_production_db",
    targetTableOrModel: "flashcard_decks",
    pipeline: "import-pipeline importFlashcardDecks",
    transformNotes: "May require --deck-owner-id for missing owner_id.",
    mergeStrategy: "Upsert.",
    validateRow: () => null,
  },
  "digital_products.json": {
    bucket: "phase1_production_db",
    targetTableOrModel: "digital_products",
    pipeline: "monolith-table-import importDigitalProducts",
    transformNotes: "Metadata only; files live in CDN/object storage.",
    mergeStrategy: "ON CONFLICT(id) DO UPDATE.",
    validateRow: (row) => {
      const id = row.id != null ? String(row.id).trim() : "";
      if (!id) return "missing_id";
      if (!str(row, "slug").trim()) return "missing_slug";
      if (!str(row, "title").trim()) return "missing_title";
      return null;
    },
  },
  "pricing_plans.json": {
    bucket: "phase1_production_db",
    targetTableOrModel: "pricing_plans",
    pipeline: "monolith-table-import importPricingPlans",
    transformNotes: "Maps label → plan_name, features → feature_list jsonb.",
    mergeStrategy: "ON CONFLICT(id) DO UPDATE.",
    validateRow: (row) => {
      const id = row.id != null ? String(row.id).trim() : "";
      if (!id) return "missing_id";
      if (!str(row, "tier").trim()) return "missing_tier";
      if (!str(row, "duration").trim()) return "missing_duration";
      return null;
    },
  },
};

function defaultEntry(file: string): Omit<FileReportRow, "file" | "rowCount" | "validation"> & {
  validateRow?: (row: Record<string, unknown>) => string | null;
} {
  const cat = CATALOG_BY_FILE.get(file);
  if (cat) {
    return {
      bucket: "phase1_production_db",
      targetTableOrModel: cat.table,
      pipeline: "scripts/replit-export-import/import-pipeline.ts",
      transformNotes: cat.notes,
      mergeStrategy: "See catalog notes; upsert where supported.",
      validateRow: () => null,
    };
  }
  if (
    file.includes("analytics") ||
    file.includes("audit") ||
    file.includes("page_views") ||
    file.includes("notification") ||
    file.includes("platform_") ||
    file.includes("verification_reports") ||
    file.includes("synthetic_test") ||
    file.includes("reliability") ||
    file.includes("incident") ||
    file === "users.json" ||
    file === "entitlement_cache.json" ||
    file === "dashboard_widgets.json"
  ) {
    return {
      bucket: "exclude_default",
      targetTableOrModel: null,
      pipeline: "(none for phase 1)",
      transformNotes: "Operational, PII, or analytics — exclude from first production migration.",
      mergeStrategy: "Skip unless explicitly required.",
      validateRow: () => null,
    };
  }
  if (
    file.includes("seo_") ||
    file.includes("blog") ||
    file.includes("clinical_seo") ||
    file.includes("design_") ||
    file.includes("paramedic_waveform") ||
    file.includes("image") ||
    file.endsWith("_assets.json")
  ) {
    return {
      bucket: "cdn_or_media",
      targetTableOrModel: "mixed (DB refs + blob URLs)",
      pipeline: "Separate CDN migration; DB importers may only store URLs.",
      transformNotes: "Copy files to R2/GCS/etc.; rewrite URLs in a second pass.",
      mergeStrategy: "DB first or assets first depending on FKs; manual plan.",
      validateRow: () => null,
    };
  }
  return {
    bucket: "phase2_optional_db",
    targetTableOrModel: "review per file",
    pipeline: "manual / future importer",
    transformNotes: "Not in phase-1 orchestrator; assess before importing.",
    mergeStrategy: "Unknown",
    validateRow: () => null,
  };
}

function repoRoot(): string {
  return path.resolve(__dirname, "../..");
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

/** Excluded from “phase 1 production content” in the report (orchestrator skips these by default). */
const OPERATIONAL_JSON = new Set([
  "ai_cache.json",
  "generation_jobs.json",
  "generation_events.json",
]);

function analyzeFile(fullPath: string, base: string): FileReportRow {
  let spec = REGISTRY[base] ?? defaultEntry(base);
  if (OPERATIONAL_JSON.has(base)) {
    spec = {
      bucket: "exclude_default",
      targetTableOrModel: spec.targetTableOrModel,
      pipeline: spec.pipeline,
      transformNotes:
        "Operational / audit data — excluded from first production content migration. Use --include-operational-imports in orchestrator if needed.",
      mergeStrategy: "Skip in phase 1.",
      validateRow: spec.validateRow,
    };
  }
  const rows = loadJsonRows(fullPath);
  const invalidReasons: Record<string, number> = {};
  let invalid = 0;
  let valid = 0;
  const validateRow = spec.validateRow;
  for (const row of rows) {
    if (!row || typeof row !== "object") {
      invalid++;
      invalidReasons.non_object = (invalidReasons.non_object ?? 0) + 1;
      continue;
    }
    const r = row as Record<string, unknown>;
    const reason = validateRow ? validateRow(r) : null;
    if (reason) {
      invalid++;
      invalidReasons[reason] = (invalidReasons[reason] ?? 0) + 1;
    } else {
      valid++;
    }
  }

  let manualReview: string | null = null;
  if (base === "encyclopedia_entries.json") {
    manualReview = "Importer expects overview + snake_case fields; many exports skip overview — expect skips until mapping is fixed.";
  }
  if (base === "generated_questions.json") {
    manualReview = "Legacy AI output; not promoted exam content. Enable only with --include-generated-questions.";
  }
  if (spec.bucket === "cdn_or_media") {
    manualReview = "Verify URLs and migrate binaries to production CDN; do not import blobs as JSON only.";
  }
  if (spec.bucket === "exclude_default") {
    manualReview = "Do not import into production learner surfaces by default.";
  }

  let safeToImportPhase1 =
    spec.bucket === "phase1_production_db" && invalid === 0 && rows.length > 0;
  if (base === "encyclopedia_entries.json") {
    safeToImportPhase1 = false;
  }

  return {
    file: base,
    bucket: spec.bucket,
    targetTableOrModel: spec.targetTableOrModel,
    pipeline: spec.pipeline,
    rowCount: rows.length,
    transformNotes: spec.transformNotes,
    mergeStrategy: spec.mergeStrategy,
    validation: { validRows: valid, invalidRows: invalid, invalidReasons },
    safeToImportPhase1: rows.length === 0 ? false : safeToImportPhase1,
    manualReview,
  };
}

async function probeDbCounts(): Promise<Record<string, number | null> | null> {
  try {
    await import("../../server/load-env");
    const { getPool } = await import("../../server/db");
    const pool = getPool();
    const q: [string, string][] = [
      ["exam_questions", "SELECT COUNT(*)::bigint AS c FROM exam_questions"],
      ["content_items", "SELECT COUNT(*)::bigint AS c FROM content_items"],
      ["pathway_lessons", "SELECT COUNT(*)::bigint AS c FROM pathway_lessons"],
      ["content_translations", "SELECT COUNT(*)::bigint AS c FROM content_translations"],
      ["Flashcard", 'SELECT COUNT(*)::bigint AS c FROM "Flashcard"'],
      ["flashcard_bank", "SELECT COUNT(*)::bigint AS c FROM flashcard_bank"],
      ["digital_products", "SELECT COUNT(*)::bigint AS c FROM digital_products"],
      ["generated_questions", "SELECT COUNT(*)::bigint AS c FROM generated_questions"],
    ];
    const out: Record<string, number | null> = {};
    for (const [k, sql] of q) {
      try {
        const r = await pool.query(sql);
        out[k] = Number(r.rows[0]?.c ?? 0);
      } catch {
        out[k] = null;
      }
    }
    await pool.end();
    return out;
  } catch {
    return null;
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const dirIdx = argv.indexOf("--dir");
  const dirArg = dirIdx >= 0 && argv[dirIdx + 1] ? path.resolve(argv[dirIdx + 1]!) : null;
  const probeDb = argv.includes("--probe-db");

  const exportDir = resolveExportDir(dirArg);
  if (!fs.existsSync(exportDir)) {
    console.log(JSON.stringify({ ok: false, error: "export_dir_missing", exportDir }, null, 2));
    process.exit(2);
  }

  const jsonFiles = fs
    .readdirSync(exportDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const files: FileReportRow[] = jsonFiles.map((f) => analyzeFile(path.join(exportDir, f), f));

  const summary = {
    phase1_files: files.filter((f) => f.bucket === "phase1_production_db").length,
    phase2_files: files.filter((f) => f.bucket === "phase2_optional_db").length,
    cdn_files: files.filter((f) => f.bucket === "cdn_or_media").length,
    excluded_files: files.filter((f) => f.bucket === "exclude_default").length,
    safe_phase1_ready: files.filter((f) => f.safeToImportPhase1).map((f) => f.file),
  };

  let dbSnapshot: Record<string, number | null> | null = null;
  if (probeDb) {
    dbSnapshot = await probeDbCounts();
  }

  console.log(
    JSON.stringify(
      {
        type: "replit_migration_dry_report",
        exportDir,
        generatedAt: new Date().toISOString(),
        summary,
        files,
        dbSnapshotReadOnly: dbSnapshot,
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
