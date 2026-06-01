#!/usr/bin/env tsx
/**
 * Sprint 1 — Backfill questionFormat on all NCLEX-RN questions.
 *
 * Detects format from questionType, options JSON shape, stem text, and tags.
 * Maps to the canonical questionFormat string used by the renderer registry.
 *
 * FORMAT MAP
 *   bowtie           → questionType includes BOWTIE or TREND; options.format === "bowtie"
 *   matrix_mcq       → questionType includes MATRIX (single-select per row)
 *   matrix_mr        → questionType includes MATRIX_MR (multi-select per row)
 *   sata             → questionType === SATA | SELECT_ALL_THAT_APPLY; or ≥5 options + correctAnswer array length ≥2
 *   ordering         → questionType === ORDERING | ORDERED_RESPONSE
 *   hotspot          → questionType includes HOTSPOT; or exhibitData.type === "image"
 *   fib_numeric      → questionType === FIB_NUMERIC
 *   ecg_video        → questionType includes ECG
 *   multiple_choice  → default (MCQ, single correct answer, 2–4 options)
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/sprint-1-backfill-question-format.mts               # dry-run — prints plan
 *   npx tsx scripts/sprint-1-backfill-question-format.mts --apply        # write to DB
 *   npx tsx scripts/sprint-1-backfill-question-format.mts --apply --exam=NCLEX-RN
 *   npx tsx scripts/sprint-1-backfill-question-format.mts --apply --batch=500
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

// ── Config ──────────────────────────────────────────────────────────────────

const APPLY  = process.argv.includes("--apply");
const DRY    = !APPLY;

const EXAM_FILTER = (() => {
  const i = process.argv.indexOf("--exam");
  if (i >= 0) return process.argv[i + 1];
  return null; // null = all exams
})();

const BATCH_SIZE = (() => {
  const i = process.argv.indexOf("--batch");
  return i >= 0 ? parseInt(process.argv[i + 1] ?? "500", 10) : 500;
})();

const REPORT_DIR = resolve(process.cwd(), "reports/sprint/nclex-rn-launch");
const REPORT_PATH = resolve(REPORT_DIR, "sprint-1-format-backfill.json");

// ── Env ──────────────────────────────────────────────────────────────────────

function loadEnv(): void {
  for (const name of [".env", ".env.local", ".env.production.local"]) {
    const f = resolve(process.cwd(), name);
    if (!existsSync(f)) continue;
    const parsed = parseDotenv(readFileSync(f, "utf8"));
    for (const [k, v] of Object.entries(parsed)) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

// ── Format detection ─────────────────────────────────────────────────────────

type FormatBucket = {
  format: string;
  ids: string[];
};

type DetectionResult = {
  id: string;
  detectedFormat: string;
  source: string; // what signal triggered detection
};

function detectFormat(q: {
  id: string;
  questionType: string;
  questionFormat: string | null;
  stem: string;
  options: unknown;
  correctAnswer: unknown;
  tags: string[];
  exhibitData: unknown;
}): DetectionResult {
  const qt = (q.questionType ?? "").toUpperCase().replace(/[-_ ]/g, "");
  const tags = (q.tags ?? []).map((t) => t.toLowerCase());
  const opts = q.options;
  const ca = q.correctAnswer;

  // ── Bowtie / Trend ──────────────────────────────────────────────────────
  if (
    qt.includes("BOWTIE") || qt.includes("TREND") || qt === "NGNBOWTIE" ||
    tags.includes("bowtie") || tags.includes("trend") ||
    (opts && typeof opts === "object" && !Array.isArray(opts) &&
      ((opts as Record<string, unknown>).format === "bowtie" ||
       (opts as Record<string, unknown>).bowtie !== undefined))
  ) {
    return { id: q.id, detectedFormat: "bowtie", source: "questionType/options/tags" };
  }

  // ── Matrix ──────────────────────────────────────────────────────────────
  if (qt.includes("MATRIXMR") || qt.includes("MATRIX_MR") || qt === "NGNMATRIXMR") {
    return { id: q.id, detectedFormat: "matrix_mr", source: "questionType" };
  }
  if (qt.includes("MATRIX") || tags.includes("matrix") || qt === "NGNMATRIX") {
    return { id: q.id, detectedFormat: "matrix_mcq", source: "questionType/tags" };
  }

  // ── Ordering ────────────────────────────────────────────────────────────
  if (qt.includes("ORDER") || qt.includes("RANK") || qt.includes("SEQUENCE") || tags.includes("ordering")) {
    return { id: q.id, detectedFormat: "ordering", source: "questionType/tags" };
  }

  // ── FIB / Numeric ────────────────────────────────────────────────────────
  if (qt.includes("FIB") || qt.includes("FILL") || qt.includes("NUMERIC") || qt.includes("CALCULATION")) {
    return { id: q.id, detectedFormat: "fib_numeric", source: "questionType" };
  }

  // ── ECG / Video ──────────────────────────────────────────────────────────
  if (qt.includes("ECG") || qt.includes("EKG") || qt.includes("VIDEO") || tags.includes("ecg-video")) {
    return { id: q.id, detectedFormat: "ecg_video", source: "questionType/tags" };
  }

  // ── Hotspot ──────────────────────────────────────────────────────────────
  if (
    qt.includes("HOTSPOT") || tags.includes("hotspot") ||
    (q.exhibitData &&
      typeof q.exhibitData === "object" &&
      (q.exhibitData as Record<string, unknown>).type === "image")
  ) {
    return { id: q.id, detectedFormat: "hotspot", source: "questionType/exhibitData" };
  }

  // ── SATA ─────────────────────────────────────────────────────────────────
  if (
    qt === "SATA" || qt === "SELECTALLTHATAPPLY" || qt === "MULTISELECT" ||
    qt.includes("SATA") || tags.includes("sata") || tags.includes("select-all") ||
    q.stem.includes("Select all that apply") || q.stem.includes("SELECT ALL THAT APPLY")
  ) {
    return { id: q.id, detectedFormat: "sata", source: "questionType/stem/tags" };
  }

  // Heuristic SATA: correctAnswer is array with ≥2 elements AND options array has ≥5 items
  if (
    Array.isArray(ca) && ca.length >= 2 &&
    Array.isArray(opts) && opts.length >= 5
  ) {
    return { id: q.id, detectedFormat: "sata", source: "correctAnswer_heuristic" };
  }

  // ── Default: MCQ ─────────────────────────────────────────────────────────
  return { id: q.id, detectedFormat: "multiple_choice", source: "default" };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnv();

  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl || dbUrl.includes("PASSWORD") || dbUrl.includes("USER:PASSWORD")) {
    console.error("DATABASE_URL is not configured. Set a real connection string and re-run.");
    process.exit(1);
  }

  const prisma = new PrismaClient({ log: ["error"] });

  try {
    // Count target rows
    const examWhere = EXAM_FILTER
      ? { exam: { in: [EXAM_FILTER, EXAM_FILTER.replace("-", "_")] } }
      : {};

    const total = await prisma.examQuestion.count({
      where: {
        status: { in: ["published", "PUBLISHED"] },
        questionFormat: null, // only questions without a format tag
        ...examWhere,
      },
    });

    console.log(`\n=== Sprint 1: questionFormat Backfill ===`);
    console.log(`Mode: ${DRY ? "DRY RUN (pass --apply to write)" : "APPLY"}`);
    console.log(`Target: ${total.toLocaleString()} questions missing questionFormat`);
    if (EXAM_FILTER) console.log(`Exam filter: ${EXAM_FILTER}`);
    console.log();

    if (total === 0) {
      console.log("✓ All questions already have questionFormat set. Nothing to do.");
      return;
    }

    // Process in batches
    const results: DetectionResult[] = [];
    const formatCounts: Record<string, number> = {};
    let cursor: string | undefined;
    let processed = 0;

    while (processed < total) {
      const batch = await prisma.examQuestion.findMany({
        where: {
          status: { in: ["published", "PUBLISHED"] },
          questionFormat: null,
          ...examWhere,
        },
        select: {
          id: true,
          questionType: true,
          questionFormat: true,
          stem: true,
          options: true,
          correctAnswer: true,
          tags: true,
          exhibitData: true,
        },
        take: BATCH_SIZE,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { id: "asc" },
      });

      if (batch.length === 0) break;
      cursor = batch[batch.length - 1]!.id;

      for (const q of batch) {
        const detection = detectFormat({
          id: q.id,
          questionType: q.questionType,
          questionFormat: q.questionFormat,
          stem: q.stem,
          options: q.options,
          correctAnswer: q.correctAnswer,
          tags: q.tags,
          exhibitData: q.exhibitData,
        });
        results.push(detection);
        formatCounts[detection.detectedFormat] = (formatCounts[detection.detectedFormat] ?? 0) + 1;
      }

      processed += batch.length;
      process.stdout.write(`\r  Analyzed: ${processed.toLocaleString()} / ${total.toLocaleString()}`);
    }
    console.log();

    // Print distribution
    console.log("\nDetected format distribution:");
    const sorted = Object.entries(formatCounts).sort((a, b) => b[1] - a[1]);
    for (const [fmt, cnt] of sorted) {
      const pct = ((cnt / results.length) * 100).toFixed(1);
      console.log(`  ${fmt.padEnd(18)} ${cnt.toLocaleString().padStart(7)}  (${pct}%)`);
    }

    // Apply updates
    if (!DRY) {
      console.log("\nWriting format tags to database...");
      let written = 0;

      // Group by format for efficient batched updates
      const byFormat = new Map<string, string[]>();
      for (const r of results) {
        const ids = byFormat.get(r.detectedFormat) ?? [];
        ids.push(r.id);
        byFormat.set(r.detectedFormat, ids);
      }

      for (const [format, ids] of byFormat) {
        // Prisma updateMany with ID list
        for (let i = 0; i < ids.length; i += 1000) {
          const chunk = ids.slice(i, i + 1000);
          await prisma.examQuestion.updateMany({
            where: { id: { in: chunk } },
            data: { questionFormat: format },
          });
          written += chunk.length;
          process.stdout.write(`\r  Written: ${written.toLocaleString()} / ${results.length.toLocaleString()}`);
        }
      }
      console.log();
      console.log("✓ questionFormat backfill complete.");
    }

    // Write report
    mkdirSync(REPORT_DIR, { recursive: true });
    const report = {
      generatedAt: new Date().toISOString(),
      mode: DRY ? "dry_run" : "applied",
      examFilter: EXAM_FILTER ?? "all",
      totalAnalyzed: results.length,
      formatDistribution: formatCounts,
      topSamples: Object.fromEntries(
        Object.entries(byFormatSamples(results)).map(([fmt, ids]) => [fmt, ids.slice(0, 5)])
      ),
    };
    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    console.log(`\nReport: ${REPORT_PATH}`);

  } finally {
    await prisma.$disconnect();
  }
}

function byFormatSamples(results: DetectionResult[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const r of results) {
    const arr = out[r.detectedFormat] ?? [];
    arr.push(r.id);
    out[r.detectedFormat] = arr;
  }
  return out;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
