#!/usr/bin/env npx tsx
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  buildNpMergeExecutionReport,
  evaluateMergeExecutionRow,
  filterMergePlanRows,
  type NpMergeExecutionDbRow,
  type NpMergeExecutionReport,
  type NpMergePlanRow,
} from "@/lib/pathway-lessons/np-merge-execution";
import type { ExecutionPlanRow, NpExecutionPlanReport } from "@/lib/pathway-lessons/np-spine-execution-plan";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_PLAN = path.join(ROOT, "data/reports/pathway-lessons/np-execution-plan.json");
const DEFAULT_OUT_DIR = path.join(ROOT, "data/reports/pathway-lessons");
const REPORT_STEM = "np-merge-execution-report";

function parseArgs() {
  const argv = process.argv.slice(2);
  const useDb = argv.includes("--use-db");
  const apply = argv.includes("--apply");
  let plan = DEFAULT_PLAN;
  let outDir = DEFAULT_OUT_DIR;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--plan" && argv[i + 1]) {
      plan = path.resolve(argv[i + 1]!);
      i += 1;
    } else if (argv[i] === "--out-dir" && argv[i + 1]) {
      outDir = path.resolve(argv[i + 1]!);
      i += 1;
    }
  }
  return { useDb, apply, plan, outDir };
}

function loadPlan(planPath: string): NpExecutionPlanReport {
  return JSON.parse(fs.readFileSync(planPath, "utf8")) as NpExecutionPlanReport;
}

function startupSummary(useDb: boolean, apply: boolean, planPath: string) {
  console.log("\n=== NP merge executor startup ===");
  console.log(`plan: ${path.relative(ROOT, planPath)}`);
  console.log(`db access: ${useDb ? "enabled" : "disabled"}`);
  console.log(`apply/mutate: ${apply ? "enabled" : "disabled"}`);
  console.log("");
}

function pairsForMergeRows(rows: NpMergePlanRow[]) {
  const keys = new Set<string>();
  for (const row of rows) {
    keys.add(`${row.pathwayId}::${row.topicSlug}`);
    if (row.mergeTargetTopicSlug) keys.add(`${row.pathwayId}::${row.mergeTargetTopicSlug}`);
  }
  return [...keys]
    .map((key) => {
      const [pathwayId, topicSlug] = key.split("::");
      return { pathwayId: pathwayId!, topicSlug: topicSlug! };
    })
    .sort((a, b) => {
      const pathwayCmp = a.pathwayId.localeCompare(b.pathwayId);
      if (pathwayCmp !== 0) return pathwayCmp;
      return a.topicSlug.localeCompare(b.topicSlug);
    });
}

async function loadRelevantDbRows(mergeRows: NpMergePlanRow[]): Promise<NpMergeExecutionDbRow[]> {
  const pairs = pairsForMergeRows(mergeRows);
  if (pairs.length === 0) return [];
  const rows = await prisma.pathwayLesson.findMany({
    where: {
      locale: "en",
      OR: pairs.map((pair) => ({
        pathwayId: pair.pathwayId,
        topicSlug: pair.topicSlug,
      })),
    },
    select: {
      id: true,
      pathwayId: true,
      topicSlug: true,
      slug: true,
      title: true,
      locale: true,
      status: true,
      sortOrder: true,
    },
    orderBy: [{ pathwayId: "asc" }, { topicSlug: "asc" }, { sortOrder: "asc" }, { slug: "asc" }],
  });
  return rows as NpMergeExecutionDbRow[];
}

async function applyMergeRow(row: NpMergePlanRow): Promise<{
  result: ReturnType<typeof evaluateMergeExecutionRow>;
}> {
  const pairs = [
    { pathwayId: row.pathwayId, topicSlug: row.topicSlug },
    ...(row.mergeTargetTopicSlug ? [{ pathwayId: row.pathwayId, topicSlug: row.mergeTargetTopicSlug }] : []),
  ];

  return prisma.$transaction(async (tx) => {
    const liveRows = (await tx.pathwayLesson.findMany({
      where: {
        locale: "en",
        OR: pairs,
      },
      select: {
        id: true,
        pathwayId: true,
        topicSlug: true,
        slug: true,
        title: true,
        locale: true,
        status: true,
        sortOrder: true,
      },
      orderBy: [{ topicSlug: "asc" }, { sortOrder: "asc" }, { slug: "asc" }],
    })) as NpMergeExecutionDbRow[];

    const preview = evaluateMergeExecutionRow({
      row,
      dbRows: liveRows,
      applyEnabled: false,
      dbAccessEnabled: true,
    });
    if (preview.status !== "WOULD_APPLY") {
      return { result: preview };
    }

    const archiveIds = preview.sourceLessonIds;
    const update = await tx.pathwayLesson.updateMany({
      where: {
        id: { in: archiveIds },
        status: ContentStatus.PUBLISHED,
      },
      data: {
        status: ContentStatus.ARCHIVED,
      },
    });

    return {
      result: evaluateMergeExecutionRow({
        row,
        dbRows: liveRows,
        applyEnabled: true,
        dbAccessEnabled: true,
        appliedArchiveCount: update.count,
      }),
    };
  });
}

function mergeSummaryMarkdown(report: NpMergeExecutionReport): string {
  const appliedRows = report.rows.filter((row) => row.status === "APPLIED" || row.status === "WOULD_APPLY");
  const rejectedRows = report.rows.filter((row) => row.status === "REJECTED");
  const unchangedRows = report.rows.filter((row) => row.status === "UNCHANGED");
  return [
    "# NP merge execution summary",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Plan file: ${report.planFile}`,
    `- DB access: ${report.dbAccessEnabled ? "enabled" : "disabled"}`,
    `- Apply/mutate: ${report.applyEnabled ? "enabled" : "disabled"}`,
    "",
    "## Summary",
    "",
    `- DEFERRED: ${report.summary.DEFERRED}`,
    `- WOULD_APPLY: ${report.summary.WOULD_APPLY}`,
    `- APPLIED: ${report.summary.APPLIED}`,
    `- REJECTED: ${report.summary.REJECTED}`,
    `- UNCHANGED: ${report.summary.UNCHANGED}`,
    `- TOTAL: ${report.summary.totalRows}`,
    "",
    "## Applied or ready rows",
    "",
    ...(appliedRows.length
      ? appliedRows.map(
          (row) =>
            `- ${row.pathwayId} / ${row.topicSlug} -> ${row.mergeTargetTopicSlug}: ${row.status} (${row.reasonCode})`,
        )
      : ["- None"]),
    "",
    "## Rejected rows",
    "",
    ...(rejectedRows.length
      ? rejectedRows.map(
          (row) =>
            `- ${row.pathwayId} / ${row.topicSlug} -> ${row.mergeTargetTopicSlug}: ${row.reasonCode}`,
        )
      : ["- None"]),
    "",
    "## Unchanged rows",
    "",
    ...(unchangedRows.length
      ? unchangedRows.map(
          (row) =>
            `- ${row.pathwayId} / ${row.topicSlug} -> ${row.mergeTargetTopicSlug}: ${row.reasonCode}`,
        )
      : ["- None"]),
    "",
  ].join("\n");
}

function mergeRowsCsv(report: NpMergeExecutionReport): string {
  const headers = [
    "pathwayId",
    "topicSlug",
    "mergeTargetTopicSlug",
    "status",
    "reasonCode",
    "sourceLessonIds",
    "sourceLessonSlugs",
    "targetLessonIds",
    "targetLessonSlugs",
    "appliedArchiveCount",
    "notes",
  ];
  const escape = (value: string | number | null) => {
    const text = value == null ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [headers.join(",")];
  for (const row of report.rows) {
    lines.push(
      [
        row.pathwayId,
        row.topicSlug,
        row.mergeTargetTopicSlug,
        row.status,
        row.reasonCode,
        row.sourceLessonIds.join("|"),
        row.sourceLessonSlugs.join("|"),
        row.targetLessonIds.join("|"),
        row.targetLessonSlugs.join("|"),
        row.appliedArchiveCount,
        row.notes.join(" | "),
      ]
        .map(escape)
        .join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

function outputPaths(outDir: string, apply: boolean) {
  const suffix = apply ? "" : ".dry-run";
  return {
    json: path.join(outDir, `${REPORT_STEM}${suffix}.json`),
    csv: path.join(outDir, `${REPORT_STEM}${suffix}.csv`),
    md: path.join(outDir, `${REPORT_STEM}${suffix}.md`),
  };
}

async function main() {
  const { useDb, apply, plan, outDir } = parseArgs();
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`execute-np-plan-merges.mts — execute MERGE rows from NP execution plan

Options:
  --use-db                  Explicitly enable Prisma validation reads
  --apply                   Archive source PUBLISHED rows when merge validation passes
  --plan <path>             Execution plan JSON (default: data/reports/pathway-lessons/np-execution-plan.json)
  --out-dir <path>          Report directory (default: data/reports/pathway-lessons)
`);
    process.exit(0);
  }

  if (!fs.existsSync(plan)) throw new Error(`Execution plan file not found: ${plan}`);
  if (apply && !useDb) throw new Error("--apply requires --use-db.");
  if (useDb && !isDatabaseUrlConfigured()) throw new Error("--use-db was provided but DATABASE_URL is not configured.");

  startupSummary(useDb, apply, plan);

  const fullPlan = loadPlan(plan);
  const mergeRows = filterMergePlanRows(fullPlan.rows as ExecutionPlanRow[]);
  let report = buildNpMergeExecutionReport({
    planRows: mergeRows,
    dbRows: [],
    applyEnabled: apply,
    planFile: path.relative(ROOT, plan),
    dbAccessEnabled: useDb,
  });

  if (useDb && !apply) {
    const dbRows = await loadRelevantDbRows(mergeRows);
    report = buildNpMergeExecutionReport({
      planRows: mergeRows,
      dbRows,
      applyEnabled: false,
      planFile: path.relative(ROOT, plan),
      dbAccessEnabled: true,
    });
  }

  if (useDb && apply) {
    const rows = [];
    for (const row of mergeRows) {
      const { result } = await applyMergeRow(row);
      rows.push(result);
    }
    const summary = {
      DEFERRED: 0,
      WOULD_APPLY: 0,
      APPLIED: 0,
      REJECTED: 0,
      UNCHANGED: 0,
      totalRows: rows.length,
    } as NpMergeExecutionReport["summary"];
    for (const row of rows) summary[row.status] += 1;
    report = {
      generatedAt: new Date().toISOString(),
      planFile: path.relative(ROOT, plan),
      dbAccessEnabled: true,
      applyEnabled: true,
      summary,
      rows,
    };
  }

  const paths = outputPaths(outDir, apply);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(paths.json, JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(paths.csv, mergeRowsCsv(report), "utf8");
  fs.writeFileSync(paths.md, mergeSummaryMarkdown(report), "utf8");
  console.log(`Wrote ${path.relative(ROOT, paths.json)}.`);
  console.log(`Wrote ${path.relative(ROOT, paths.csv)}.`);
  console.log(`Wrote ${path.relative(ROOT, paths.md)}.`);
  console.log(
    `Summary: deferred=${report.summary.DEFERRED} would_apply=${report.summary.WOULD_APPLY} applied=${report.summary.APPLIED} rejected=${report.summary.REJECTED} unchanged=${report.summary.UNCHANGED}`,
  );

  if (useDb) await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  void prisma.$disconnect();
  process.exit(1);
});
