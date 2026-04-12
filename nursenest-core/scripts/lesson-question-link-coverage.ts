#!/usr/bin/env npx tsx
/**
 * Per-lesson related question bank coverage (same predicate as lesson detail “Practice questions”).
 *
 * - Tiers: critical (0), low (<5), below_minimum (<8), adequate (8–14), ideal (15+)
 * - Writes `reports/lesson-question-link-coverage.json`
 * - Does not mutate the database. “Gaps filled” in-product = raise pool + authoring; UI shows up to
 *   {@link RELATED_EXAM_QUESTIONS_CAP} matching items per lesson.
 *
 * Run (from nursenest-core):
 *   npx tsx scripts/lesson-question-link-coverage.ts
 *   npx tsx scripts/lesson-question-link-coverage.ts --pathway=us-rn-nclex-rn
 *   npx tsx scripts/lesson-question-link-coverage.ts --json-out=./tmp/lesson-q-coverage.json
 */
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getExamPathwayById, listExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import {
  countRelatedExamQuestionsForPathwayLesson,
  lessonQuestionCoverageTierFromCount,
  relatedExamQuestionsNeededForMinTarget,
  RELATED_EXAM_QUESTIONS_CAP,
  RELATED_EXAM_QUESTIONS_IDEAL_MIN,
  RELATED_EXAM_QUESTIONS_MIN_TARGET,
} from "@/lib/lessons/lesson-question-cross-links";

type Row = {
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  relatedQuestionCount: number;
  tier: ReturnType<typeof lessonQuestionCoverageTierFromCount>;
  neededForMin: number;
  /** Suggested authoring / bank actions when below minimum */
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
  return `add ${r.neededForMin} published question(s) in ${r.pathwayId} scope matching topic/tags/bodySystem for slug ${r.slug} (admin AI batch or bank import); UI shows up to ${RELATED_EXAM_QUESTIONS_CAP} matches`;
}

async function main() {
  const { pathwayFilter, jsonOut } = parseArgs(process.argv.slice(2));

  const pathwayIds = pathwayFilter
    ? [pathwayFilter]
    : listExamPathways()
        .map((p) => p.id)
        .sort((a, b) => a.localeCompare(b));

  const rows: Row[] = [];
  const skippedPathways: string[] = [];

  for (const pathwayId of pathwayIds) {
    const pathway = getExamPathwayById(pathwayId);
    if (!pathway) {
      skippedPathways.push(pathwayId);
      continue;
    }

    const lessons = await prisma.pathwayLesson.findMany({
      where: { pathwayId, status: ContentStatus.PUBLISHED, locale: "en" },
      select: { slug: true, title: true, topic: true, topicSlug: true, bodySystem: true },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    });

    for (const L of lessons) {
      const relatedQuestionCount = await countRelatedExamQuestionsForPathwayLesson({
        pathway,
        lessonTitle: L.title,
        lessonTopic: L.topic,
        lessonTopicSlug: L.topicSlug,
        bodySystem: L.bodySystem,
        lessonSlug: L.slug,
      });
      const tier = lessonQuestionCoverageTierFromCount(relatedQuestionCount);
      const neededForMin = relatedExamQuestionsNeededForMinTarget(relatedQuestionCount);
      rows.push({
        pathwayId,
        slug: L.slug,
        title: L.title,
        topic: L.topic,
        topicSlug: L.topicSlug,
        relatedQuestionCount,
        tier,
        neededForMin,
        autoFillHint: hintForRow({
          pathwayId,
          slug: L.slug,
          relatedQuestionCount,
          neededForMin,
        }),
      });
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    pathwayCount: pathwayIds.length - skippedPathways.length,
    lessonRows: rows.length,
    byTier: {
      critical: rows.filter((r) => r.tier === "critical").length,
      low: rows.filter((r) => r.tier === "low").length,
      below_minimum: rows.filter((r) => r.tier === "below_minimum").length,
      adequate: rows.filter((r) => r.tier === "adequate").length,
      ideal: rows.filter((r) => r.tier === "ideal").length,
    },
    belowMinTarget: rows.filter((r) => r.relatedQuestionCount < RELATED_EXAM_QUESTIONS_MIN_TARGET).length,
    skippedPathways,
    thresholds: {
      minTarget: RELATED_EXAM_QUESTIONS_MIN_TARGET,
      idealMin: RELATED_EXAM_QUESTIONS_IDEAL_MIN,
      displayCap: RELATED_EXAM_QUESTIONS_CAP,
    },
  };

  const payload = { summary, rows };

  console.log(`Lesson ↔ question link coverage — ${summary.generatedAt}`);
  console.log(`Lessons scanned: ${summary.lessonRows} (pathways: ${summary.pathwayCount})`);
  console.log(`Tiers: critical=${summary.byTier.critical} low=${summary.byTier.low} below_minimum=${summary.byTier.below_minimum} adequate=${summary.byTier.adequate} ideal=${summary.byTier.ideal}`);
  console.log(`Below minimum (${RELATED_EXAM_QUESTIONS_MIN_TARGET}): ${summary.belowMinTarget}`);
  if (skippedPathways.length) console.log(`Skipped unknown pathway ids: ${skippedPathways.join(", ")}`);

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
