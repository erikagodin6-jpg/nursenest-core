import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { listExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingHubInventoryWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import { resolveBuilderCategoryId } from "@/lib/flashcards/flashcard-builder-taxonomy";
import {
  collectMergedLessonVirtualFlashcardsForPathway,
  FLASHCARD_PADDING_CARD_RATIONALE_MARKER,
} from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import { loadPublishedPathwayLessonsForStudyFromDb } from "@/lib/learner-study-hub/load-published-pathway-lessons-for-study-from-db";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { catReadinessMinCompletePoolRows } from "@/lib/practice-tests/cat-readiness-floor";
import {
  CANONICAL_STUDY_CATEGORIES,
  normalizeStudyCategory,
  type CanonicalStudyCategoryId,
} from "@/lib/study/normalize-study-category";

type CountMap = Record<CanonicalStudyCategoryId, number>;
type GroupRow = { bodySystem: string | null; topic: string | null; _count: { _all: number } };
type DedicatedFlashcardRow = {
  front: string;
  back: string;
  category: { name: string; topicCode: string | null };
  deck: { pathwayId: string | null; title: string } | null;
};

const outPath = join(process.cwd(), "docs", "flashcard-platform-parity-audit.generated.md");

function emptyCounts(): CountMap {
  return Object.fromEntries(CANONICAL_STUDY_CATEGORIES.map((c) => [c.id, 0])) as CountMap;
}

function addGroupCounts(groups: GroupRow[], pathwayId: string): CountMap {
  const out = emptyCounts();
  for (const row of groups) {
    const id = normalizeStudyCategory({
      pathwayId,
      bodySystem: row.bodySystem,
      topic: row.topic,
    }).id;
    out[id] += row._count._all;
  }
  return out;
}

function addLessonRecordCounts(lessons: PathwayLessonRecord[], pathwayId: string): CountMap {
  const out = emptyCounts();
  for (const lesson of lessons) {
    const id = normalizeStudyCategory({
      pathwayId,
      bodySystem: lesson.bodySystem ?? lesson.system ?? null,
      topic: lesson.topic,
    }).id;
    out[id] += 1;
  }
  return out;
}

function addLessonVirtualCounts(pathwayId: string, pathwayLessonsForVirtuals: PathwayLessonRecord[], out: CountMap): number {
  const { virtuals } = collectMergedLessonVirtualFlashcardsForPathway(
    pathwayId,
    pathwayLessonsForVirtuals.length > 0 ? pathwayLessonsForVirtuals : undefined,
  );
  let total = 0;
  for (const v of virtuals) {
    if (
      v.sourceSectionKind === "padding" ||
      (v.row.rationaleCorrect ?? "").includes(FLASHCARD_PADDING_CARD_RATIONALE_MARKER)
    ) continue;
    const id = resolveBuilderCategoryId({
      label: v.row.category.name,
      topicCode: v.row.category.topicCode,
      pathwayId,
      deckTitle: null,
      front: v.row.front,
      back: v.row.back,
    });
    out[id] += 1;
    total += 1;
  }
  return total;
}

function addDedicatedFlashcardCounts(pathwayId: string, rows: DedicatedFlashcardRow[], out: CountMap): number {
  let total = 0;
  for (const row of rows) {
    const id = resolveBuilderCategoryId({
      label: row.category.name,
      topicCode: row.category.topicCode,
      pathwayId: row.deck?.pathwayId ?? pathwayId,
      deckTitle: row.deck?.title ?? null,
      front: row.front,
      back: row.back,
    });
    out[id] += 1;
    total += 1;
  }
  return total;
}

function mdEscape(s: string): string {
  return s.replace(/\|/g, "\\|");
}

function catLabel(count: number, min: number): string {
  return count >= min ? `Available (${count})` : `Not ready (${count}/${min})`;
}

async function main() {
  const lines: string[] = [
    "# Flashcard Platform Parity Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This report compares shared question-bank pools, flashcard-derived availability, lessons, and CAT readiness by canonical study system.",
    "",
  ];

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    lines.push(
      "## Audit Unavailable",
      "",
      "The audit could not query the database in this environment.",
      "",
      `Reason: \`${error instanceof Error ? error.message.replace(/`/g, "'").slice(0, 500) : String(error).slice(0, 500)}\``,
      "",
      "Run with a valid production or staging `DATABASE_URL`:",
      "",
      "```bash",
      "npx tsx scripts/audit-flashcard-platform-parity.ts",
      "```",
      "",
    );
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, `${lines.join("\n")}\n`);
    return;
  }

  const pathways = listExamPathways().filter((p) => p.status !== "hidden");
  for (const pathway of pathways) {
    const questionWhere = pathwayExamQuestionMarketingHubInventoryWhere(pathway);
    const [questionGroups, learnerStudyLessons, dedicatedFlashcards, catReady] = await Promise.all([
      prisma.examQuestion.groupBy({
        by: ["bodySystem", "topic"],
        where: questionWhere,
        _count: { _all: true },
      }),
      loadPublishedPathwayLessonsForStudyFromDb(pathway.id),
      prisma.flashcard.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          deck: { pathwayId: pathway.id },
        },
        select: {
          front: true,
          back: true,
          category: { select: { name: true, topicCode: true } },
          deck: { select: { pathwayId: true, title: true } },
        },
        take: 5000,
      }),
      prisma.examQuestion.count({
        where: {
          ...questionWhere,
          isAdaptiveEligible: true,
        },
      }),
    ]);

    const qCounts = addGroupCounts(questionGroups as GroupRow[], pathway.id);
    const fCounts = { ...qCounts };
    const dedicatedTotal = addDedicatedFlashcardCounts(pathway.id, dedicatedFlashcards, fCounts);
    const lessonVirtualTotal = addLessonVirtualCounts(pathway.id, learnerStudyLessons, fCounts);
    const lessonCounts = addLessonRecordCounts(learnerStudyLessons, pathway.id);
    const minCat = catReadinessMinCompletePoolRows(pathway.id);

    lines.push(`## ${mdEscape(pathway.displayName ?? pathway.shortName)} (${pathway.id})`, "");
    lines.push("| System | Question Count | Flashcard Count | Lesson Count | CAT Availability | Finding |");
    lines.push("| --- | ---: | ---: | ---: | --- | --- |");
    for (const system of CANONICAL_STUDY_CATEGORIES) {
      const questions = qCounts[system.id] ?? 0;
      const lessons = lessonCounts[system.id] ?? 0;
      const flashcards = fCounts[system.id] ?? 0;
      const mismatch = (questions > 0 || lessons > 0) && flashcards === 0;
      lines.push(
        `| ${mdEscape(system.label)} | ${questions} | ${flashcards} | ${lessons} | ${catLabel(catReady, minCat)} | ${
          mismatch ? "DEFECT: content exists but flashcard-derived pool is zero" : "OK"
        } |`,
      );
    }
    lines.push("", `Dedicated Flashcard table rows for this pathway: ${dedicatedTotal}`);
    lines.push(`Lesson-derived virtual flashcards counted: ${lessonVirtualTotal}`, "");
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${lines.join("\n")}\n`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
