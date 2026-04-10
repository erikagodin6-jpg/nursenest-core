#!/usr/bin/env npx tsx
/**
 * NP canonical spine ↔ PathwayLesson execution planner (read-only).
 *
 * Usage:
 *   npx tsx scripts/np-lesson-spine-vs-db.mts
 *   npx tsx scripts/np-lesson-spine-vs-db.mts --use-db
 *   npx tsx scripts/np-lesson-spine-vs-db.mts --use-db --pathway us-np-fnp
 *
 * Output:
 *   data/reports/pathway-lessons/np-execution-plan.json
 *   data/reports/pathway-lessons/np-execution-plan.csv
 *   data/reports/pathway-lessons/np-execution-plan.md
 */
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  loadNpSpineJson,
  type ContentItemMatchRow,
  type PathwayLessonMatchRow,
} from "@/lib/pathway-lessons/np-spine-db-alignment";
import {
  buildFullNpExecutionPlan,
  validateExecutionPlan,
  type ExecutionDecision,
  type ExecutionPlanRow,
  type ExecutionPlanSummary,
  type NpExecutionPlanReport,
} from "@/lib/pathway-lessons/np-spine-execution-plan";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_SPINE = path.join(ROOT, "data/reports/pathway-lessons/np-canonical-coverage-map.json");
const DEFAULT_OUT_DIR = path.join(ROOT, "data/reports/pathway-lessons");
const DEFAULT_REPORT_STEM = "np-execution-plan";

const NP_PATHWAY_IDS = [
  "ca-np-cnple",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "us-np-pmhnp",
];

function parseArgs() {
  const argv = process.argv.slice(2);
  const useDb = argv.includes("--use-db");
  const includeContentItems = argv.includes("--include-content-items");
  const emitSqlPreview = argv.includes("--emit-sql-preview");
  const emitSeedPlan = argv.includes("--emit-seed-plan");
  const applyRequested = argv.includes("--apply");
  let spine = DEFAULT_SPINE;
  let outDir = DEFAULT_OUT_DIR;
  let pathwayFilter: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--spine" && argv[i + 1]) {
      spine = path.resolve(argv[i + 1]!);
      i++;
    } else if (argv[i] === "--out-dir" && argv[i + 1]) {
      outDir = path.resolve(argv[i + 1]!);
      i++;
    } else if (argv[i] === "--pathway" && argv[i + 1]) {
      pathwayFilter = argv[i + 1]!;
      i++;
    }
  }
  return {
    useDb,
    includeContentItems,
    emitSqlPreview,
    emitSeedPlan,
    applyRequested,
    spine,
    outDir,
    pathwayFilter,
  };
}

function printStartupSummary(params: {
  mode: "report" | "db";
  dbAccessEnabled: boolean;
  applyEnabled: boolean;
  pathwayFilter: string | null;
  includeContentItems: boolean;
}) {
  console.log("\n=== NP execution planner startup ===");
  console.log(`mode: ${params.mode}`);
  console.log(`db access: ${params.dbAccessEnabled ? "enabled" : "disabled"}`);
  console.log(`apply/mutate: ${params.applyEnabled ? "enabled" : "disabled"}`);
  if (params.pathwayFilter) console.log(`pathway filter: ${params.pathwayFilter}`);
  console.log(`content-item hints: ${params.includeContentItems ? "enabled" : "disabled"}`);
  console.log("");
}

function printSummaryTable(report: NpExecutionPlanReport) {
  console.log("=== NP execution plan summary (by pathway) ===\n");
  for (const pid of Object.keys(report.summaryByPathway).sort()) {
    const s = report.summaryByPathway[pid]!;
    console.log(
      `${pid.padEnd(16)} SKIP=${String(s.EXISTS_STRONG_SKIP).padStart(4)} UPGRADE=${String(s.EXISTS_UPGRADE).padStart(4)} CREATE=${String(s.CREATE_NEW).padStart(4)} MERGE=${String(s.MERGE).padStart(4)} REVIEW=${String(s.REVIEW_NEEDED).padStart(4)} DUP=${String(s.DUPLICATE_CLUSTER_REVIEW).padStart(3)} (rows=${s.rowsEvaluated})`,
    );
  }
  console.log("\nValidation issues:", report.validationIssues.length);
  console.log("");
}

function executionDecisionKeys(): ExecutionDecision[] {
  return [
    "EXISTS_STRONG_SKIP",
    "EXISTS_UPGRADE",
    "CREATE_NEW",
    "MERGE",
    "REVIEW_NEEDED",
    "DUPLICATE_CLUSTER_REVIEW",
  ];
}

function csvEscape(value: string | number | boolean | null | undefined): string {
  const text = value == null ? "" : String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows: ExecutionPlanRow[]): string {
  const headers = [
    "pathwayId",
    "systemId",
    "systemName",
    "topicSlug",
    "canonicalTitle",
    "decision",
    "confidence",
    "winningLessonId",
    "winningLessonSlug",
    "recommendedCanonicalSlug",
    "mergeTargetTopicSlug",
    "matchedLessonIds",
    "matchedLessonSlugs",
    "sharedLessonReuseSufficient",
    "overlayNeeded",
    "reuseStatus",
    "reasonCodes",
    "validationIssues",
    "notes",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.pathwayId,
        row.systemId,
        row.systemName,
        row.topicSlug,
        row.canonicalTitle,
        row.decision,
        row.confidence.toFixed(3),
        row.winningLessonId,
        row.winningLessonSlug,
        row.recommendedCanonicalSlug,
        row.mergeTargetTopicSlug,
        row.matchedLessonIds.join("|"),
        row.matchedLessonSlugs.join("|"),
        row.sharedLessonReuseSufficient,
        row.overlayNeeded,
        row.reuseStatus,
        row.reasonCodes.join("|"),
        row.validationIssues.join("|"),
        row.notes.join(" | "),
      ].map(csvEscape).join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

function renderPathwaySummaryTable(summaryByPathway: Record<string, ExecutionPlanSummary>): string {
  const lines = [
    "| Pathway | Skip | Upgrade | Create | Merge | Review | Duplicate cluster | Rows |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const pathwayId of Object.keys(summaryByPathway).sort()) {
    const summary = summaryByPathway[pathwayId]!;
    lines.push(
      `| ${pathwayId} | ${summary.EXISTS_STRONG_SKIP} | ${summary.EXISTS_UPGRADE} | ${summary.CREATE_NEW} | ${summary.MERGE} | ${summary.REVIEW_NEEDED} | ${summary.DUPLICATE_CLUSTER_REVIEW} | ${summary.rowsEvaluated} |`,
    );
  }
  return lines.join("\n");
}

function toMarkdown(report: NpExecutionPlanReport): string {
  const reviewRows = report.rows.filter(
    (row) => row.decision === "REVIEW_NEEDED" || row.decision === "DUPLICATE_CLUSTER_REVIEW",
  );
  const previewRows = reviewRows.slice(0, 12);
  const validationPreview = report.validationIssues.slice(0, 12);
  return [
    "# NP PathwayLesson execution plan",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Mode: ${report.mode}`,
    `- DB access: ${report.dbAccessEnabled ? "enabled" : "disabled"}`,
    `- Apply/mutate: ${report.applyEnabled ? "enabled" : "disabled"}`,
    `- Data sources: ${report.dataSources.join(", ")}`,
    "",
    "## Decision totals",
    "",
    ...executionDecisionKeys().map((decision) => `- ${decision}: ${report.summaryByDecision[decision]}`),
    "",
    "## Pathway summary",
    "",
    renderPathwaySummaryTable(report.summaryByPathway),
    "",
    "## Review queue preview",
    "",
    ...(previewRows.length
      ? previewRows.map(
          (row) =>
            `- ${row.pathwayId} / ${row.topicSlug}: ${row.decision} (${row.reasonCodes.join(", ") || "no reasons"})`,
        )
      : ["- None"]),
    "",
    "## Validation issues",
    "",
    ...(validationPreview.length
      ? validationPreview.map((issue) => `- ${issue.code}: ${issue.message}`)
      : ["- None"]),
    "",
  ].join("\n");
}

function outputPaths(outDir: string, pathwayFilter: string | null) {
  const suffix = pathwayFilter ? `.${pathwayFilter}` : "";
  return {
    json: path.join(outDir, `${DEFAULT_REPORT_STEM}${suffix}.json`),
    csv: path.join(outDir, `${DEFAULT_REPORT_STEM}${suffix}.csv`),
    md: path.join(outDir, `${DEFAULT_REPORT_STEM}${suffix}.md`),
  };
}

function summarizeRows(rows: ExecutionPlanRow[]) {
  const summaryByDecision = {
    EXISTS_STRONG_SKIP: 0,
    EXISTS_UPGRADE: 0,
    CREATE_NEW: 0,
    MERGE: 0,
    REVIEW_NEEDED: 0,
    DUPLICATE_CLUSTER_REVIEW: 0,
  } satisfies Record<ExecutionDecision, number>;
  const summaryByPathway: Record<string, ExecutionPlanSummary> = {};
  const summaryBySystemCategory: Record<string, Omit<ExecutionPlanSummary, "rowsEvaluated">> = {};

  for (const row of rows) {
    summaryByDecision[row.decision] += 1;
    summaryByPathway[row.pathwayId] ??= {
      EXISTS_STRONG_SKIP: 0,
      EXISTS_UPGRADE: 0,
      CREATE_NEW: 0,
      MERGE: 0,
      REVIEW_NEEDED: 0,
      DUPLICATE_CLUSTER_REVIEW: 0,
      rowsEvaluated: 0,
    };
    summaryByPathway[row.pathwayId]![row.decision] += 1;
    summaryByPathway[row.pathwayId]!.rowsEvaluated += 1;

    summaryBySystemCategory[row.systemId] ??= {
      EXISTS_STRONG_SKIP: 0,
      EXISTS_UPGRADE: 0,
      CREATE_NEW: 0,
      MERGE: 0,
      REVIEW_NEEDED: 0,
      DUPLICATE_CLUSTER_REVIEW: 0,
    };
    summaryBySystemCategory[row.systemId]![row.decision] += 1;
  }

  return { summaryByDecision, summaryByPathway, summaryBySystemCategory };
}

function filterPlan(report: NpExecutionPlanReport, pathwayFilter: string | null): NpExecutionPlanReport {
  if (!pathwayFilter) return report;
  const rows = report.rows.filter((row) => row.pathwayId === pathwayFilter);
  const summaries = summarizeRows(rows);
  const base = {
    ...report,
    rows,
    ...summaries,
  };
  return {
    ...base,
    validationIssues: validateExecutionPlan(base),
  };
}

async function loadPathwayLessons(pathwayFilter: string | null): Promise<PathwayLessonMatchRow[]> {
  const ids = pathwayFilter ? NP_PATHWAY_IDS.filter((id) => id === pathwayFilter) : NP_PATHWAY_IDS;
  if (pathwayFilter && ids.length === 0) {
    throw new Error(`Unknown pathway ${pathwayFilter}. Expected one of: ${NP_PATHWAY_IDS.join(", ")}`);
  }
  const rows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: { in: ids },
      locale: "en",
      status: ContentStatus.PUBLISHED,
    },
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      status: true,
      sections: true,
    },
  });
  return rows as PathwayLessonMatchRow[];
}

async function loadNpContentItems(): Promise<ContentItemMatchRow[]> {
  const rows = await prisma.contentItem.findMany({
    where: {
      type: "lesson",
      tier: { equals: "np", mode: "insensitive" },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      tags: true,
      bodySystem: true,
      tier: true,
      category: true,
    },
    take: 8000,
  });
  return rows as ContentItemMatchRow[];
}

async function main() {
  const { useDb, includeContentItems, emitSqlPreview, emitSeedPlan, applyRequested, spine, outDir, pathwayFilter } =
    parseArgs();
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`np-lesson-spine-vs-db.mts — read-only NP PathwayLesson execution planner

Options:
  --use-db                  Explicitly enable Prisma reads
  --spine <path>            Spine JSON (default: data/reports/pathway-lessons/np-canonical-coverage-map.json)
  --out-dir <path>          Artifact directory (default: data/reports/pathway-lessons)
  --pathway <id>            Limit to one pathway (e.g. us-np-fnp)
  --include-content-items   Add legacy ContentItem tier=np hints (requires --use-db)
  --emit-sql-preview        Reserved preview flag; does not mutate
  --emit-seed-plan          Reserved preview flag; does not mutate
  --apply                   Reserved write flag; not supported in this pass
`);
    process.exit(0);
  }

  if (!fs.existsSync(spine)) {
    console.error("Spine file not found:", spine);
    process.exit(2);
  }
  if (pathwayFilter && !NP_PATHWAY_IDS.includes(pathwayFilter)) {
    throw new Error(`Unknown pathway ${pathwayFilter}. Expected one of: ${NP_PATHWAY_IDS.join(", ")}`);
  }

  printStartupSummary({
    mode: useDb ? "db" : "report",
    dbAccessEnabled: useDb,
    applyEnabled: false,
    pathwayFilter,
    includeContentItems,
  });

  if (includeContentItems && !useDb) {
    throw new Error("--include-content-items requires --use-db because content item hints come from Prisma.");
  }
  if (applyRequested) {
    throw new Error("--apply is reserved for a future mutating executor and is disabled in this read-only pass.");
  }
  if (useDb && !isDatabaseUrlConfigured()) {
    throw new Error("--use-db was provided but DATABASE_URL is not configured.");
  }
  if (emitSqlPreview) {
    console.log("[preview] --emit-sql-preview is reserved; no SQL preview emitted in this read-only pass.");
  }
  if (emitSeedPlan) {
    console.log("[preview] --emit-seed-plan is reserved; no seed plan emitted in this read-only pass.");
  }

  const map = loadNpSpineJson(spine);
  let lessons: PathwayLessonMatchRow[] = [];
  let contentItems: ContentItemMatchRow[] | undefined;

  if (!useDb) {
    console.log("[report mode] Skipping Prisma reads; planning from canonical spine only.");
  } else {
    lessons = await loadPathwayLessons(pathwayFilter);
    console.log(`Loaded ${lessons.length} published PathwayLesson rows (en).`);
    if (includeContentItems) {
      contentItems = await loadNpContentItems();
      console.log(`Loaded ${contentItems.length} ContentItem lesson rows (tier np) for hint pass.`);
    }
  }

  let report = buildFullNpExecutionPlan({
    map,
    lessons,
    spineFile: path.relative(ROOT, spine),
    contentItems,
    mode: useDb ? "db" : "report",
    dbAccessEnabled: useDb,
    applyEnabled: false,
  });
  report = filterPlan(report, pathwayFilter);

  const paths = outputPaths(outDir, pathwayFilter);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(paths.json, JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(paths.csv, toCsv(report.rows), "utf8");
  fs.writeFileSync(paths.md, toMarkdown(report), "utf8");
  console.log(`Wrote ${path.relative(ROOT, paths.json)} (${report.rows.length} execution rows).`);
  console.log(`Wrote ${path.relative(ROOT, paths.csv)}.`);
  console.log(`Wrote ${path.relative(ROOT, paths.md)}.`);
  printSummaryTable(report);

  if (useDb) {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  void prisma.$disconnect();
  process.exit(1);
});
