#!/usr/bin/env npx tsx
/**
 * Incremental pathway lesson completion (safe batching).
 *
 * - Finds incomplete lessons (default: `--onlyNotComplete`), fills **missing** premium sections without
 *   clobbering sections that already have substantive copy (≥50 words).
 * - Merges bank-matched pre/post quizzes into `nnLessonPayloadV2` JSON (deduped); does not duplicate items.
 * - Skips lessons already **COMPLETE** under the internal completion gate (no overwrite).
 * - Batch size clamped to **10–20** per run.
 * - Appends a run record to `data/audit/content-completion-progress.json` at monorepo root.
 *
 * Usage (from `nursenest-core/` app directory):
 *   npx tsx scripts/content-completion-incremental.ts --pathwayId=ca-rn-nclex-rn
 *   npx tsx scripts/content-completion-incremental.ts --pathwayId=us-rn-nclex-rn --write
 *   npx tsx scripts/content-completion-incremental.ts --pathwayId=us-rn-nclex-rn --write --batchSize=15 --offset=0
 *
 * Dry-run (default): no DB writes; still updates the progress JSON with snapshot + report.
 */
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../src/lib/db";
import {
  estimatePathwayContentCompleteness,
  runLessonCompletionBatch,
  type LessonCompletionBatchReport,
} from "../src/lib/lessons/lesson-batch-completion";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..");
const PROGRESS_PATH = path.join(REPO_ROOT, "data/audit/content-completion-progress.json");

type ProgressRun = {
  at: string;
  pathwayId: string;
  batchSize: number;
  offset: number;
  write: boolean;
  mode: "complete" | "refine";
  onlyNotComplete: boolean;
  completenessApproxPctBefore: number;
  completenessApproxPctAfter: number;
  report: LessonCompletionBatchReport;
  notes: string[];
};

type ProgressFile = {
  schemaVersion: 1;
  description: string;
  lastUpdated: string;
  /** Most recent run per pathway id (rough completeness snapshot after the run). */
  latestSnapshotByPathway: Record<
    string,
    {
      completenessApproxPct: number;
      total: number;
      completeRough: number;
      partialRough: number;
      emptyRough: number;
      lastRunAt: string;
    }
  >;
  runs: ProgressRun[];
};

type FocusAreaArg =
  | "cardiovascular"
  | "respiratory"
  | "neurological"
  | "endocrine"
  | "renal"
  | "gi"
  | "hematology"
  | "pharmacology"
  | "maternity"
  | "pediatrics"
  | "mental_health"
  | "prioritization_safety";

function parseArgs(argv: string[]) {
  let pathwayId = "us-rn-nclex-rn";
  let batchSize = 15;
  let offset = 0;
  let write = false;
  let mode: "complete" | "refine" = "complete";
  let onlyNotComplete = true;
  let focusArea: FocusAreaArg | undefined;

  for (const a of argv) {
    if (a.startsWith("--pathwayId=")) pathwayId = a.slice("--pathwayId=".length).trim() || pathwayId;
    if (a.startsWith("--batchSize=")) batchSize = Math.max(1, Number(a.slice("--batchSize=".length)) || 15);
    if (a.startsWith("--offset=")) offset = Math.max(0, Number(a.slice("--offset=".length)) || 0);
    if (a === "--write") write = true;
    if (a === "--onlyNotComplete") onlyNotComplete = true;
    if (a === "--includeComplete") onlyNotComplete = false;
    if (a === "--refine") mode = "refine";
    if (a.startsWith("--focusArea=")) {
      const v = a.slice("--focusArea=".length).trim() as FocusAreaArg;
      if (v) focusArea = v;
    }
  }
  return { pathwayId, batchSize, offset, write, mode, onlyNotComplete, focusArea };
}

function loadProgress(): ProgressFile {
  if (!fs.existsSync(PROGRESS_PATH)) {
    return {
      schemaVersion: 1,
      description:
        "Append-only log for incremental lesson + quiz completion batches. completenessApproxPct is a rough hub metric (section spine + word count), not full bank-linked validation.",
      lastUpdated: new Date().toISOString(),
      latestSnapshotByPathway: {},
      runs: [],
    };
  }
  try {
    const raw = fs.readFileSync(PROGRESS_PATH, "utf8");
    const parsed = JSON.parse(raw) as ProgressFile;
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.runs)) {
      throw new Error("Invalid progress file shape");
    }
    return parsed;
  } catch {
    return {
      schemaVersion: 1,
      description:
        "Append-only log for incremental lesson + quiz completion batches. completenessApproxPct is a rough hub metric (section spine + word count), not full bank-linked validation.",
      lastUpdated: new Date().toISOString(),
      latestSnapshotByPathway: {},
      runs: [],
    };
  }
}

function saveProgress(next: ProgressFile) {
  fs.mkdirSync(path.dirname(PROGRESS_PATH), { recursive: true });
  next.lastUpdated = new Date().toISOString();
  const maxRuns = 200;
  if (next.runs.length > maxRuns) {
    next.runs = next.runs.slice(-maxRuns);
  }
  fs.writeFileSync(PROGRESS_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf8");
}

async function main() {
  const { pathwayId, batchSize, offset, write, mode, onlyNotComplete, focusArea } = parseArgs(process.argv.slice(2));

  const beforeSnap = await estimatePathwayContentCompleteness(pathwayId);

  const report = await runLessonCompletionBatch({
    pathwayId,
    batchSize,
    offset,
    write,
    mode,
    onlyNotComplete,
    ...(focusArea ? { focusArea } : {}),
  });

  const afterSnap = await estimatePathwayContentCompleteness(pathwayId);

  const notes = [
    "Rough completeness uses section kinds + word count; for strict publish gates run pathway lesson QA / content audits separately.",
    write ? "DB writes applied." : "Dry-run: no prisma updates.",
  ];

  const run: ProgressRun = {
    at: new Date().toISOString(),
    pathwayId,
    batchSize,
    offset,
    write,
    mode,
    onlyNotComplete,
    completenessApproxPctBefore: beforeSnap.completenessApproxPct,
    completenessApproxPctAfter: afterSnap.completenessApproxPct,
    report,
    notes,
  };

  const progress = loadProgress();
  progress.runs.push(run);
  progress.latestSnapshotByPathway[pathwayId] = {
    completenessApproxPct: afterSnap.completenessApproxPct,
    total: afterSnap.total,
    completeRough: afterSnap.completeRough,
    partialRough: afterSnap.partialRough,
    emptyRough: afterSnap.emptyRough,
    lastRunAt: run.at,
  };
  saveProgress(progress);

  console.log(JSON.stringify({ beforeSnap, afterSnap, report, progressFile: PROGRESS_PATH }, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  void prisma.$disconnect();
  process.exit(1);
});
