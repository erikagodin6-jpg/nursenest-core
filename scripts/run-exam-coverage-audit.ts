#!/usr/bin/env npx tsx
/**
 * Writes `reports/exam-coverage-audit.json` and prints a short console summary.
 * Read-only; does not change CAT, grading, or entitlements.
 */
import fs from "node:fs";
import path from "node:path";
import "../src/lib/db/env-bootstrap";
import { buildExamBlueprintCoverageReport } from "@/lib/content-blueprint/build-blueprint-coverage-report";

function summarizeToConsole(report: Awaited<ReturnType<typeof buildExamBlueprintCoverageReport>>) {
  console.log(`Exam coverage audit — generatedAt=${report.generatedAt} db=${report.databaseConfigured}`);
  for (const n of report.notes) console.log(`  note: ${n}`);
  for (const p of report.pathways) {
    const rt = p.rationaleTiers;
    console.log(
      `\n${p.displayName} (${p.pathwayId})\n` +
        `  questions in scope: ${p.totals.publishedQuestionsInScope} (below floor: ${p.totals.belowMinTotal})\n` +
        `  rationale: missing ${rt.pctMissing}% | thin ${rt.pctThin}% | acceptable ${rt.pctAcceptable}% | strong ${rt.pctStrong}%\n` +
        `  lessons DB topic slugs: ${p.totals.lessonTopicSlugsWithAtLeastOneLesson}` +
        (p.catalogLessons
          ? ` | catalog lessons: ${p.catalogLessons.catalogLessonCount} (${p.catalogLessons.distinctTopicSlugs} topic slugs)`
          : " | catalog: n/a"),
    );
    const topGap = p.prioritizedGaps[0];
    if (topGap) console.log(`  top gap: [${topGap.kind}] ${topGap.title}`);
  }
}

async function main() {
  const report = await buildExamBlueprintCoverageReport();
  const outDir = path.join(process.cwd(), "reports");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "exam-coverage-audit.json");
  fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outFile}`);
  summarizeToConsole(report);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
