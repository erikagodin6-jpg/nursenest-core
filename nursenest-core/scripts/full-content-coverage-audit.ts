#!/usr/bin/env npx tsx
/**
 * Full content coverage across tiers, countries, and domains (RN / PN / NP / Allied / New Grad).
 *
 * Output: JSON report + console summary. Deep lesson�bank scan can take several minutes.
 *
 *   npx tsx scripts/full-content-coverage-audit.ts
 *   npx tsx scripts/full-content-coverage-audit.ts --json-out=./reports/full-content-coverage.json
 */
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { buildFullContentCoverageAudit } from "@/lib/content-audit/full-content-coverage-audit";
import { prisma } from "@/lib/db";

function parseArgs(argv: string[]) {
  let jsonOut: string | null = path.join(process.cwd(), "reports", "full-content-coverage.json");
  for (const a of argv) {
    if (a.startsWith("--json-out=")) jsonOut = a.slice("--json-out=".length).trim() || null;
  }
  return { jsonOut };
}

function printSummary(report: Awaited<ReturnType<typeof buildFullContentCoverageAudit>>) {
  const { coverageStatus, criticalGaps, lessonsPerDomain, lessonsPerCountry, lessonsPerTier, lessonLinkScan, degraded } =
    report;
  console.log("\n=== Full content coverage audit ===\n");
  console.log(`Generated: ${report.generatedAt}`);
  console.log(`Degraded (partial DB): ${degraded}`);
  console.log(`Coverage status: ${coverageStatus.toUpperCase()}`);
  console.log("\n--- Lessons by domain (published EN pathway lessons) ---");
  for (const [k, v] of Object.entries(lessonsPerDomain)) {
    console.log(`  ${k}: ${v}`);
  }
  console.log("\n--- Lessons by country ---");
  for (const r of lessonsPerCountry) console.log(`  ${r.country}: ${r.count}`);
  console.log("\n--- Lessons by tier (Stripe / pathway) ---");
  for (const r of lessonsPerTier) console.log(`  ${r.tier}: ${r.count}`);
  console.log("\n--- Lesson ↔ bank link scan (all resolved pathways) ---");
  console.log(`  Pathways scanned: ${lessonLinkScan.pathwayIdsScanned}; lesson rows: ${lessonLinkScan.rowCount}`);
  const s = lessonLinkScan.summary;
  console.log(`  Zero bank links: ${s.zeroQuestions}; under five: ${s.underFiveQuestions}`);
  console.log(`  Below min (${s.thresholds.minTarget}): ${s.belowMinTarget}; below ideal band: ${s.belowIdealBand}`);
  console.log("\n--- Questions by topic (global published, top topics) ---");
  for (const r of report.questionsByTopic.slice(0, 15)) {
    console.log(`  ${r.topic}: ${r.count}`);
  }
  console.log("\n--- Critical gaps ---");
  console.log(`  Lessons with 0 related questions: ${criticalGaps.lessonRowsZeroBankLinks}`);
  console.log(`  Lessons below min target: ${criticalGaps.lessonRowsBelowMinTarget}`);
  console.log(
    `  Questions (heuristic) no lesson topic match: ${criticalGaps.questionsNoLessonTopicMatch}${criticalGaps.questionsNoLessonTopicMatchCapped ? " (capped scan)" : ""}`,
  );
  console.log(`  Unmapped pathway ids (lessons exist, no resolver): ${criticalGaps.unmappedPathwayIds.length}`);
  if (criticalGaps.unmappedLessonCount) {
    console.log(`  Unmapped lesson rows: ${criticalGaps.unmappedLessonCount}`);
  }
  console.log("\n  Top pathways by sub-min lesson count:");
  for (const p of criticalGaps.topPathwaysBySubMinLessonCount) {
    console.log(`    ${p.pathwayId} (${p.displayName ?? "?"}) — ${p.subMinLessons}`);
  }
  if (criticalGaps.sampleCriticalLessons.length) {
    console.log("\n  Sample lessons with zero bank links (first 8):");
    for (const x of criticalGaps.sampleCriticalLessons.slice(0, 8)) {
      console.log(`    ${x.pathwayId} / ${x.slug} — ${x.title}`);
    }
  }
  console.log("\n--- Registry dashboard notes (200-lesson sample) ---");
  for (const n of report.registryDashboard.notes.slice(0, 4)) console.log(`  • ${n}`);
  console.log("\nAudit notes:");
  for (const n of report.notes) console.log(`  • ${n}`);
}

async function main() {
  const { jsonOut } = parseArgs(process.argv.slice(2));
  console.log("Running full content coverage audit (this may take a while)…");
  const report = await buildFullContentCoverageAudit();
  printSummary(report);

  if (jsonOut) {
    const abs = path.resolve(process.cwd(), jsonOut);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(`\nWrote ${abs}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  void prisma.$disconnect();
  process.exit(1);
});
