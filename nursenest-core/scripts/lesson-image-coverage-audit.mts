/**
 * Lesson Image Coverage Audit — production inventory for clinical illustration.
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/lesson-image-coverage-audit.mts
 *   npx tsx scripts/lesson-image-coverage-audit.mts --pathway us-rn-nclex-rn
 *
 * Outputs (repo root reports/):
 *   lesson-image-audit/lesson-image-audit.json
 *   lesson-image-audit/lesson-image-audit.csv
 *   lesson-image-audit/missing-images.json
 *   lesson-image-audit/high-priority-images.json
 *   lesson-image-audit/duplicate-opportunities.json
 *   lesson-image-audit/LESSON-IMAGE-AUDIT-SUMMARY.md
 *   lesson-image-audit/critical-images.md
 *   lesson-image-audit/high-priority-images.md
 *   lesson-image-audit/medium-priority-images.md
 *   lesson-image-audit/duplicate-visual-systems.md
 *   lesson-image-audit/image-production-roadmap.csv
 *   lesson-image-audit/image-production-roadmap.json
 *   lesson-image-audit/IMAGE-PRODUCTION-ROADMAP.md
 *   lesson-image-audit/cluster-image-queues.md
 *
 * Sync Spaces inventory first for accurate matches:
 *   SPACES_KEY=… SPACES_SECRET=… node ../scripts/sync-lesson-image-inventory.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildLessonImageAuditReport,
  getDuplicateOpportunitiesFromReport,
  selectHighPriorityQueue,
  selectMissingImageQueue,
} from "@/lib/content/lesson-image-audit/build-report";
import {
  lessonImageAuditToCsv,
  writeAuditJsonArtifacts,
} from "@/lib/content/lesson-image-audit/export-formats";
import { STYLE_GOVERNANCE } from "@/lib/content/lesson-image-audit/constants";
import { buildImageProductionRoadmap } from "@/lib/content/lesson-image-audit/production-roadmap";
import {
  clusterImageQueuesMarkdown,
  duplicateVisualSystemsMarkdown,
  imageProductionRoadmapSummaryMarkdown,
  imageProductionRoadmapToCsv,
  priorityBacklogMarkdown,
} from "@/lib/content/lesson-image-audit/production-roadmap-export";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..");
const OUT_DIR = path.join(REPO_ROOT, "reports", "lesson-image-audit");

function parsePathwayArgs(argv: string[]): string[] | undefined {
  const pathways: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--pathway" && argv[i + 1]) {
      pathways.push(argv[++i]!);
    }
  }
  return pathways.length ? pathways : undefined;
}

function writeSummaryMd(
  outPath: string,
  artifacts: ReturnType<typeof writeAuditJsonArtifacts>,
): void {
  const s = artifacts.fullReport.summary;
  const lines = [
    "# Lesson Image Coverage Audit",
    "",
    `Generated: ${s.generatedAt}`,
    "",
    "## Coverage",
    "",
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Pathways scanned | ${s.pathwayCount} |`,
    `| Marketing-renderable lessons | ${s.marketingRenderableCount} |`,
    `| Lessons with any resolved image | ${s.withImageCount} (${s.coveragePct}%) |`,
    `| Lessons missing images | ${s.missingImageCount} |`,
    `| Lessons that should have images | ${s.shouldHaveImageCount} |`,
    `| Should-have still missing/low quality | ${s.missingAmongShouldHave} |`,
    `| Should-have coverage | ${s.shouldHaveCoveragePct}% |`,
    "",
    "## Status breakdown",
    "",
    ...Object.entries(s.byStatus)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `- **${k}**: ${v}`),
    "",
    "## Priority breakdown (should-have cohort)",
    "",
    ...Object.entries(s.byPriority).map(([k, v]) => `- **${k}**: ${v}`),
    "",
    "## Production clusters",
    "",
    ...Object.entries(s.byCluster)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `- **${k}**: ${v}`),
    "",
    "## Visual style governance",
    "",
    `- Theme: ${STYLE_GOVERNANCE.theme}`,
    `- ${STYLE_GOVERNANCE.aesthetic}`,
    `- Avoid: ${STYLE_GOVERNANCE.avoid.join("; ")}`,
    "",
    "## Output files",
    "",
    "- `lesson-image-audit.json` — full row-level audit",
    "- `lesson-image-audit.csv` — spreadsheet import",
    "- `missing-images.json` — production queue (no/low/fuzzy match among should-have)",
    "- `high-priority-images.json` — CRITICAL + HIGH roadmap",
    "- `duplicate-opportunities.json` — shared visual systems / reuse",
    "- `critical-images.md` / `high-priority-images.md` / `medium-priority-images.md` — human production queues",
    "- `image-production-roadmap.csv` / `.json` — full prioritized backlog",
    "- `duplicate-visual-systems.md` — modular reuse opportunities",
    "- `IMAGE-PRODUCTION-ROADMAP.md` — what to create next (executive summary)",
    "",
    "## Next steps",
    "",
    "1. Produce CRITICAL/HIGH assets in cluster batches (cardiac ECG, respiratory PE, pharm insulin, etc.).",
    "2. Upload to Spaces using `recommendedFilename` (prefer `.webp` / `.avif`).",
    "3. Run `node scripts/sync-lesson-image-inventory.mjs` and re-run this audit.",
    "",
  ];
  fs.writeFileSync(outPath, `${lines.join("\n")}\n`);
}

function main(): void {
  const pathwayIds = parsePathwayArgs(process.argv.slice(2));
  const report = buildLessonImageAuditReport({ pathwayIds });
  const missingQueue = selectMissingImageQueue(report.rows);
  const highPriorityQueue = selectHighPriorityQueue(report.rows);
  const duplicateOpportunities = getDuplicateOpportunitiesFromReport(report);

  const artifacts = writeAuditJsonArtifacts({
    report,
    missingQueue,
    highPriorityQueue,
    duplicateOpportunities,
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  fs.writeFileSync(
    path.join(OUT_DIR, "lesson-image-audit.json"),
    `${JSON.stringify(artifacts.fullReport, null, 2)}\n`,
  );
  fs.writeFileSync(path.join(OUT_DIR, "lesson-image-audit.csv"), lessonImageAuditToCsv(report));
  fs.writeFileSync(
    path.join(OUT_DIR, "missing-images.json"),
    `${JSON.stringify(artifacts.missingImages, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "high-priority-images.json"),
    `${JSON.stringify(artifacts.highPriorityImages, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "duplicate-opportunities.json"),
    `${JSON.stringify(artifacts.duplicateOpportunities, null, 2)}\n`,
  );
  writeSummaryMd(path.join(OUT_DIR, "LESSON-IMAGE-AUDIT-SUMMARY.md"), artifacts);

  const roadmap = buildImageProductionRoadmap(
    report.rows,
    duplicateOpportunities,
    report.summary.generatedAt,
  );

  fs.writeFileSync(
    path.join(OUT_DIR, "image-production-roadmap.json"),
    `${JSON.stringify(roadmap, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "image-production-roadmap.csv"),
    imageProductionRoadmapToCsv(roadmap),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "IMAGE-PRODUCTION-ROADMAP.md"),
    `${imageProductionRoadmapSummaryMarkdown(roadmap)}\n`,
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "critical-images.md"),
    priorityBacklogMarkdown(
      "CRITICAL Image Production Backlog",
      "Flagship NCLEX/clinical concepts — missing or inadequate imagery. Create these first.",
      roadmap.critical,
      roadmap.generatedAt,
    ),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "high-priority-images.md"),
    priorityBacklogMarkdown(
      "HIGH Priority Image Production Backlog",
      "Important reinforcement visuals and common confusion topics.",
      roadmap.high,
      roadmap.generatedAt,
    ),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "medium-priority-images.md"),
    priorityBacklogMarkdown(
      "MEDIUM Priority Image Production Backlog",
      "Beneficial but non-essential visuals — schedule after CRITICAL/HIGH batches.",
      roadmap.medium,
      roadmap.generatedAt,
    ),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "duplicate-visual-systems.md"),
    duplicateVisualSystemsMarkdown(
      duplicateOpportunities,
      roadmap.generatedAt,
      roadmap.proposedVisualSystems,
    ),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "cluster-image-queues.md"),
    `${clusterImageQueuesMarkdown(roadmap)}\n`,
  );

  const s = report.summary;
  console.info("[lesson-image-audit] wrote", OUT_DIR);
  console.info(
    `[lesson-image-audit] lessons=${s.lessonCount} with_image=${s.withImageCount} (${s.coveragePct}%) should_have_missing=${s.missingAmongShouldHave} high_priority_queue=${highPriorityQueue.length} missing_queue=${missingQueue.length} duplicates=${duplicateOpportunities.length}`,
  );
  console.info(
    `[lesson-image-audit] production_roadmap critical=${roadmap.summary.criticalCount} high=${roadmap.summary.highCount} medium=${roadmap.summary.mediumCount} total=${roadmap.summary.totalBacklog}`,
  );
}

main();
