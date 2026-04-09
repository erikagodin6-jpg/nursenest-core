#!/usr/bin/env npx tsx
/**
 * Lesson blueprint coverage dashboard — static catalog.json only (no DB).
 * Writes `data/reports/lesson-blueprint-coverage.json` and prints a short console summary.
 */
import fs from "node:fs";
import path from "node:path";
import catalog from "@/content/pathway-lessons/catalog.json";
import { buildLessonBlueprintCoverageDashboard } from "@/lib/content-blueprint/lesson-blueprint-coverage-dashboard";

function summarize(dashboard: ReturnType<typeof buildLessonBlueprintCoverageDashboard>) {
  console.log(`Lesson blueprint coverage — ${dashboard.generatedAt}`);
  console.log(`Data source: ${dashboard.dataSource}`);
  console.log(`Pathways: ${dashboard.pathwayIdsIncluded.join(", ")}`);
  for (const p of dashboard.pathways) {
    const pr = p.progress;
    console.log(
      `\n${p.displayName} (${p.pathwayId})\n` +
        `  lessons: ${p.totalLessons} | min ${pr.minFloor}: ${pr.pctOfMinFloor}% | stretch ${pr.stretchGoal}: ${pr.pctOfStretchGoal}%\n` +
        `  short of min: ${pr.lessonsShortOfMin} | short of stretch: ${pr.lessonsShortOfStretch}`,
    );
    const types = p.byLessonType.map((t) => `${t.type.replace(/_/g, " ")}: ${t.count}`).join(" · ");
    console.log(`  types: ${types}`);
    const topWeak = p.weakDomains[0];
    if (topWeak) {
      console.log(
        `  weakest domain (weight-adjusted): ${topWeak.label} (${topWeak.count} vs ~${topWeak.expectedApprox})`,
      );
    }
    if (p.majorGaps[0]) console.log(`  gap: ${p.majorGaps[0]}`);
  }
}

async function main() {
  const dashboard = buildLessonBlueprintCoverageDashboard(catalog);
  const outDir = path.join(process.cwd(), "data/reports");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "lesson-blueprint-coverage.json");
  fs.writeFileSync(outFile, `${JSON.stringify(dashboard, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outFile}\n`);
  summarize(dashboard);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
