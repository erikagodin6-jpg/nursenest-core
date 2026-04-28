import "server-only";

import { ContentStatus, type CountryCode, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { PRISMA_ID_IN_CHUNK_SIZE, takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  bankExamQuestionRowToFlashcardStudySelectRow,
  type BankExamRowForFlashcard,
} from "@/lib/flashcards/bank-exam-question-to-flashcard-select";
import type { FlashcardStudySelectRow } from "@/lib/flashcards/flashcard-study-serialize";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  appLearnerLessonDetailPath,
  APP_LEARNER_LESSONS_INDEX_PATH,
  marketingPathwayLessonDetailPath,
} from "@/lib/lessons/lesson-routes";

const MAX_LESSON_QUESTION_LINKS = 4_000;

export type LessonLinkedFlashcardVirtual = {
  /** Stable synthetic id (not a `Flashcard` PK). */
  id: string;
  row: FlashcardStudySelectRow;
  lessonSlug: string;
  lessonTitle: string;
  lessonHref: string;
  examQuestionId: string;
  source: "pre" | "post";
};

function regionWhereForCountry(country: CountryCode): Prisma.ExamQuestionWhereInput {
  return {
    OR: [{ regionScope: "BOTH" }, { regionScope: country === "CA" ? "CA_ONLY" : "US_ONLY" }],
  };
}

function appLessonsFallbackHubHref(pathwayId: string, lessonSlug: string): string {
  const qs = new URLSearchParams();
  qs.set("pathwayId", pathwayId);
  qs.set("q", lessonSlug);
  return `${APP_LEARNER_LESSONS_INDEX_PATH}?${qs.toString()}`;
}

function resolveLessonHref(pathwayId: string, lessonSlug: string, idBySlug: ReadonlyMap<string, string>): string {
  const rowId = idBySlug.get(lessonSlug);
  if (rowId) return appLearnerLessonDetailPath(rowId);
  const pathway = getExamPathwayById(pathwayId);
  const marketing = pathway ? marketingPathwayLessonDetailPath(pathway, lessonSlug) : null;
  return marketing ?? appLessonsFallbackHubHref(pathwayId, lessonSlug);
}

type WorkItem = { lesson: PathwayLessonRecord; qid: string; source: "pre" | "post" };

function collectLessonQuestionWork(pathwayId: string): WorkItem[] {
  const lessons = getCatalogPathwayLessonsSync(pathwayId);
  const work: WorkItem[] = [];
  for (const lesson of lessons) {
    const pre = lesson.preTestQuestionIds ?? [];
    const post = lesson.postTestQuestionIds ?? [];
    for (const raw of pre) {
      const qid = typeof raw === "string" ? raw.trim() : "";
      if (qid.length >= 8 && qid.length <= 80) work.push({ lesson, qid, source: "pre" });
    }
    for (const raw of post) {
      const qid = typeof raw === "string" ? raw.trim() : "";
      if (qid.length >= 8 && qid.length <= 80) work.push({ lesson, qid, source: "post" });
    }
  }
  return work.slice(0, MAX_LESSON_QUESTION_LINKS);
}

async function loadPathwayLessonSlugToId(pathwayId: string, slugs: string[]): Promise<Map<string, string>> {
  const uniq = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))];
  if (!uniq.length) return new Map();
  const out = new Map<string, string>();
  for (let i = 0; i < uniq.length; i += PRISMA_ID_IN_CHUNK_SIZE) {
    const chunk = uniq.slice(i, i + PRISMA_ID_IN_CHUNK_SIZE);
    const rows = await withDatabaseFallback(
      () =>
        prisma.pathwayLesson.findMany({
          where: {
            pathwayId,
            slug: { in: chunk },
            status: ContentStatus.PUBLISHED,
          },
          select: { id: true, slug: true },
          take: takeForIdIn(chunk, 500),
        }),
      [] as Array<{ id: string; slug: string }>,
    );
    for (const r of rows) {
      if (r.slug && !out.has(r.slug)) out.set(r.slug, r.id);
    }
  }
  return out;
}

async function loadExamRowsByIds(
  ids: string[],
  entitlement: AccessScope,
  country: CountryCode,
): Promise<Map<string, BankExamRowForFlashcard>> {
  const out = new Map<string, BankExamRowForFlashcard>();
  const uniq = [...new Set(ids)];
  for (let i = 0; i < uniq.length; i += PRISMA_ID_IN_CHUNK_SIZE) {
    const chunk = uniq.slice(i, i + PRISMA_ID_IN_CHUNK_SIZE);
    const rows = await withDatabaseFallback(
      () =>
        prisma.examQuestion.findMany({
          where: {
            AND: [questionAccessWhere(entitlement), { id: { in: chunk } }, regionWhereForCountry(country)],
          },
          select: {
            id: true,
            stem: true,
            options: true,
            correctAnswer: true,
            questionType: true,
            rationale: true,
            distractorRationales: true,
            incorrectAnswerRationale: true,
            correctAnswerExplanation: true,
          },
          take: takeForIdIn(chunk),
        }),
      [] as BankExamRowForFlashcard[],
    );
    for (const r of rows) {
      out.set(r.id, r as BankExamRowForFlashcard);
    }
  }
  return out;
}

/**
 * Builds pathway-scoped “virtual” flashcard rows from bundled catalog lessons that reference bank
 * `ExamQuestion` ids (pre/post checks). Intended to augment empty `Flashcard` tables without inventing stems.
 */
export async function loadLessonLinkedFlashcardVirtuals(args: {
  pathwayId: string;
  entitlement: AccessScope;
  /** When set, skip synthesizing a row if a published subscriber flashcard already references this question. */
  existingExamQuestionIds?: ReadonlySet<string>;
}): Promise<LessonLinkedFlashcardVirtual[]> {
  const { pathwayId, entitlement } = args;
  const country = entitlement.country as CountryCode | null;
  if (!country || !entitlement.hasAccess) return [];

  const work = collectLessonQuestionWork(pathwayId);
  if (!work.length) return [];

  const slugToId = await loadPathwayLessonSlugToId(
    pathwayId,
    work.map((w) => w.lesson.slug),
  );

  const uniqQids = [...new Set(work.map((w) => w.qid))];
  const examById = await loadExamRowsByIds(uniqQids, entitlement, country);

  const skipIds = args.existingExamQuestionIds ?? new Set<string>();
  const out: LessonLinkedFlashcardVirtual[] = [];

  for (const { lesson, qid, source } of work) {
    if (skipIds.has(qid)) continue;
    const examRow = examById.get(qid);
    if (!examRow) continue;

    const base = bankExamQuestionRowToFlashcardStudySelectRow(examRow);
    if (!base) continue;

    const stableId = `lq:${pathwayId}:${lesson.slug}:${qid}:${source}`;
    const catName = (lesson.system ?? lesson.bodySystem ?? lesson.topic ?? "").trim() || lesson.topic;
    const topicCode = lesson.topicSlug?.trim() ? lesson.topicSlug.trim().toLowerCase() : null;

    const row: FlashcardStudySelectRow = {
      ...base,
      id: stableId,
      sourceKey: `lessonq:${pathwayId}:${lesson.slug}:${qid}:${source}`,
      category: { name: catName, topicCode },
      deck: { pathwayId, title: lesson.title },
    };

    out.push({
      id: stableId,
      row,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      lessonHref: resolveLessonHref(pathwayId, lesson.slug, slugToId),
      examQuestionId: qid,
      source,
    });
  }

  return out;
}
