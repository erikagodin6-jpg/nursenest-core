#!/usr/bin/env npx tsx
/**
 * Per-lesson related question bank coverage (same predicate as lesson detail “Practice questions”).
 *
 * - Tiers: critical (0), low (<5), below_minimum (<8), adequate (8–14), ideal (15+)
 * - Writes `reports/lesson-question-link-coverage.json`
 * - Does not mutate the database. To align empty-topic bank rows, use `scripts/lesson-question-gap-fill.ts --apply`.
 *
 * Run (from nursenest-core):
 *   npx tsx scripts/lesson-question-link-coverage.ts
 *   npx tsx scripts/lesson-question-link-coverage.ts --pathway=us-rn-nclex-rn
 *   npx tsx scripts/lesson-question-link-coverage.ts --json-out=./tmp/lesson-q-coverage.json
 */
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/db";
import {
  RELATED_EXAM_QUESTIONS_CAP,
  RELATED_EXAM_QUESTIONS_IDEAL_MIN,
  RELATED_EXAM_QUESTIONS_MIN_TARGET,
} from "@/lib/lessons/lesson-question-cross-links";
import { scanLessonQuestionLinkCoverage } from "@/lib/lessons/lesson-question-link-coverage-core";

type Row = Awaited<ReturnType<typeof scanLessonQuestionLinkCoverage>>["rows"][number] & {
  autoFillHint: string;
};

function parseArgs(argv: string[]) {
  let pathwayFilter: string | null = null;
  let jsonOut: string | null = path.join(process.cwd(), "reports", "lesson-question-link-coverage.json");
  for (const a of argv) {
    if (a.startsWith("--pathway=")) pathwayFilter = a.slice("--pathway=".length).trim() || null;
    if (a.startsWith("--json-out=")) jsonOut = a.slice("--json-out=".length).trim() || null;
  }
  return { pathwayFilter, jsonOut };
}

function hintForRow(r: Pick<Row, "relatedQuestionCount" | "neededForMin" | "pathwayId" | "slug">): string {
  if (r.relatedQuestionCount >= RELATED_EXAM_QUESTIONS_MIN_TARGET) {
    if (r.relatedQuestionCount >= RELATED_EXAM_QUESTIONS_IDEAL_MIN) return "none";
    return `optional: add ${RELATED_EXAM_QUESTIONS_IDEAL_MIN - r.relatedQuestionCount}+ aligned items to reach ideal band (15–25 visible)`;
  }
  return `add ${r.neededForMin} published question(s) in ${r.pathwayId} scope matching topic/tags/bodySystem for slug ${r.slug} (salvage: npx tsx scripts/lesson-question-gap-fill.ts --apply; AI drafts: --ai-drafts); UI shows up to ${RELATED_EXAM_QUESTIONS_CAP} matches`;
}

async function main() {
  const { pathwayFilter, jsonOut } = parseArgs(process.argv.slice(2));

  const { rows: baseRows, summary } = await scanLessonQuestionLinkCoverage(pathwayFilter);
  const rows: Row[] = baseRows.map((r) => ({
    ...r,
    autoFillHint: hintForRow({
      pathwayId: r.pathwayId,
      slug: r.slug,
      relatedQuestionCount: r.relatedQuestionCount,
      neededForMin: r.neededForMin,
    }),
  }));

  const payload = { summary, rows };

  console.log(`Lesson ↔ question link coverage — ${summary.generatedAt}`);
  console.log(`Lessons scanned: ${summary.lessonRows} (pathways: ${summary.pathwayCount})`);
  console.log(
    `Tiers: critical=${summary.byTier.critical} low=${summary.byTier.low} below_minimum=${summary.byTier.below_minimum} adequate=${summary.byTier.adequate} ideal=${summary.byTier.ideal}`,
  );
  console.log(`Zero questions: ${summary.zeroQuestions}; under five: ${summary.underFiveQuestions}`);
  console.log(`Below minimum (${RELATED_EXAM_QUESTIONS_MIN_TARGET}): ${summary.belowMinTarget}`);
  if (summary.skippedPathways.length) console.log(`Skipped unknown pathway ids: ${summary.skippedPathways.join(", ")}`);

  if (jsonOut) {
    const abs = path.resolve(process.cwd(), jsonOut);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log(`Wrote ${abs}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  void prisma.$disconnect();
  process.exit(1);
});
