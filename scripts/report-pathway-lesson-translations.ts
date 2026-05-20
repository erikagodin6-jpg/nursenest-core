#!/usr/bin/env npx tsx
/**
 * JSON report: pathway_lessons locales vs English slug baseline (no auto-translation).
 */
import "../src/lib/db/env-bootstrap";
import { buildPathwayLessonTranslationGapReport } from "@/lib/lessons/pathway-lesson-translation-diagnostics";

async function main() {
  const report = await buildPathwayLessonTranslationGapReport();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
