#!/usr/bin/env npx tsx
/**
 * Link flashcards (lessonId → PathwayLesson.id), exam questions, and clinical scenarios to canonical pathway lessons
 * when pathwayId + topic resolve to exactly one published lesson.
 *
 * Dry-run unless --apply.
 *
 * Usage:
 *   npx tsx scripts/link-study-content.ts
 *   npx tsx scripts/link-study-content.ts --pathwayId=us-rn-nclex-rn
 *   npx tsx scripts/link-study-content.ts --apply --pathwayId=us-rn-nclex-rn
 */
import "dotenv/config";
import { ContentStatus } from "@prisma/client";
import { prisma } from "./lib/prisma-script-client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  indexLessonsByPathwayTopic,
  planExamQuestionStudyLink,
  planFlashcardLessonLink,
  resolveUniqueLessonForTopic,
  type LessonTopicIndexRow,
} from "@/lib/study/study-content-link-plan";
import { normalizeTopicSlugInput } from "@/lib/study/topic-slug-normalize";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

function parseArgs() {
  const argv = process.argv.slice(2);
  let apply = false;
  let pathwayId: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--apply") apply = true;
    else if (a === "--pathwayId" && argv[i + 1]) {
      pathwayId = argv[i + 1]!.trim();
      i++;
    }
  }
  return { apply, pathwayId };
}

async function loadLessonIndexForPathway(pid: string): Promise<Map<string, LessonTopicIndexRow[]>> {
  const rows = await prisma.pathwayLesson.findMany({
    where: { pathwayId: pid },
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      topicSlug: true,
      topic: true,
      locale: true,
      status: true,
    },
    take: 8000,
  });
  return indexLessonsByPathwayTopic(rows as LessonTopicIndexRow[]);
}

async function main() {
  const { apply, pathwayId: pathwayFilter } = parseArgs();
  if (!isDatabaseUrlConfigured()) {
    console.log("[STUDY_LINK_PLAN] DATABASE_URL not configured — exiting.");
    process.exit(0);
  }

  const pathways = pathwayFilter
    ? EXAM_PATHWAYS.filter((p) => p.id === pathwayFilter)
    : EXAM_PATHWAYS;
  if (pathways.length === 0) {
    console.error("[STUDY_LINK_PLAN] unknown pathwayId");
    process.exit(1);
  }

  let appliedFlash = 0;
  let appliedQ = 0;
  let appliedSc = 0;
  let skipAmbFlash = 0;
  let skipAmbQ = 0;
  let skipAmbSc = 0;

  for (const pathway of pathways) {
    const pid = pathway.id;
    const lessonIndex = await loadLessonIndexForPathway(pid);
    const examKeys = [...new Set(pathway.contentExamKeys)];

    let fcCursor: string | undefined;
    for (;;) {
      const batch = await prisma.flashcard.findMany({
        where: {
          lessonId: null,
          deck: { pathwayId: pid },
          status: ContentStatus.PUBLISHED,
        },
        orderBy: { id: "asc" },
        take: 300,
        ...(fcCursor ? { cursor: { id: fcCursor }, skip: 1 } : {}),
        select: {
          id: true,
          lessonId: true,
          deck: { select: { pathwayId: true } },
          category: { select: { slug: true, topicCode: true } },
        },
      });
      if (batch.length === 0) break;
      fcCursor = batch[batch.length - 1]!.id;
      for (const c of batch) {
        const plan = planFlashcardLessonLink(
          {
            id: c.id,
            deckPathwayId: c.deck?.pathwayId ?? null,
            lessonId: c.lessonId,
            categorySlug: c.category.slug,
            categoryTopicCode: c.category.topicCode,
          },
          lessonIndex,
        );
        if (plan.action === "skip") {
          if (apply === false && plan.reason === "lesson_id_set") continue;
          continue;
        }
        if (plan.action === "ambiguous") {
          console.log(`[STUDY_LINK_SKIPPED_AMBIGUOUS] Flashcard id=${c.id} pathway=${pid} reason=${plan.reason}`);
          skipAmbFlash++;
          continue;
        }
        console.log(`[STUDY_LINK_PLAN] Flashcard id=${c.id} pathway=${pid} set lessonId=${plan.pathwayLessonId}`);
        if (apply) {
          await prisma.flashcard.update({
            where: { id: c.id },
            data: { lessonId: plan.pathwayLessonId },
          });
          appliedFlash++;
        }
      }
    }

    let qCursor: string | undefined;
    for (;;) {
      const batch = await prisma.examQuestion.findMany({
        where: {
          exam: { in: examKeys },
          status: "published",
          topic: { not: null },
          studyLinkLessonSlug: null,
        },
        orderBy: { id: "asc" },
        take: 400,
        ...(qCursor ? { cursor: { id: qCursor }, skip: 1 } : {}),
        select: {
          id: true,
          exam: true,
          topic: true,
          studyLinkPathwayId: true,
          studyLinkLessonSlug: true,
        },
      });
      if (batch.length === 0) break;
      qCursor = batch[batch.length - 1]!.id;
      for (const q of batch) {
        const plan = planExamQuestionStudyLink(pid, examKeys, q, lessonIndex);
        if (plan.action === "skip") continue;
        if (plan.action === "ambiguous") {
          console.log(`[STUDY_LINK_SKIPPED_AMBIGUOUS] ExamQuestion id=${q.id} pathway=${pid} topic=${q.topic}`);
          skipAmbQ++;
          continue;
        }
        console.log(
          `[STUDY_LINK_PLAN] ExamQuestion id=${q.id} pathway=${pid} set studyLinkLessonSlug=${plan.lessonSlug}`,
        );
        if (apply) {
          await prisma.examQuestion.update({
            where: { id: q.id },
            data: { studyLinkPathwayId: pid, studyLinkLessonSlug: plan.lessonSlug },
          });
          appliedQ++;
        }
      }
    }

    let scCursor: string | undefined;
    for (;;) {
      const batch = await prisma.clinicalNursingScenario.findMany({
        where: { pathwayId: pid, studyLinkLessonSlug: null },
        orderBy: { id: "asc" },
        take: 200,
        ...(scCursor ? { cursor: { id: scCursor }, skip: 1 } : {}),
        select: {
          id: true,
          pathwayId: true,
          title: true,
          studyLinkLessonSlug: true,
          canonicalCategoryId: true,
        },
      });
      if (batch.length === 0) break;
      scCursor = batch[batch.length - 1]!.id;
      const catIds = [...new Set(batch.map((b) => b.canonicalCategoryId))];
      const cats = await prisma.category.findMany({
        where: { id: { in: catIds } },
        select: { id: true, slug: true, topicCode: true },
      });
      const catMap = new Map(cats.map((c) => [c.id, c]));
      for (const s of batch) {
        const cat = catMap.get(s.canonicalCategoryId);
        const topicSlug = normalizeTopicSlugInput(cat?.topicCode?.trim() || cat?.slug || "");
        if (!topicSlug) continue;
        const res = resolveUniqueLessonForTopic(pid, topicSlug, lessonIndex);
        if (res.status === "none") continue;
        if (res.status === "ambiguous") {
          console.log(`[STUDY_LINK_SKIPPED_AMBIGUOUS] ClinicalScenario id=${s.id} pathway=${pid} topicSlug=${topicSlug}`);
          skipAmbSc++;
          continue;
        }
        console.log(`[STUDY_LINK_PLAN] ClinicalScenario id=${s.id} pathway=${pid} set studyLinkLessonSlug=${res.lesson.slug}`);
        if (apply) {
          await prisma.clinicalNursingScenario.update({
            where: { id: s.id },
            data: { studyLinkLessonSlug: res.lesson.slug },
          });
          appliedSc++;
        }
      }
    }
  }

  console.log(
    `[STUDY_LINK_APPLIED] apply=${apply} flashcards=${appliedFlash} questions=${appliedQ} scenarios=${appliedSc} ambiguous_flash=${skipAmbFlash} ambiguous_q=${skipAmbQ} ambiguous_sc=${skipAmbSc}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
