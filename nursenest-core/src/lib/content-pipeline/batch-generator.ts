import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type {
  ContentBatchInput,
  ContentBatchOutput,
  GeneratedPathwayLesson,
  GeneratedExamQuestion,
} from "./types";
import { generatePathwayLesson } from "./lesson-generator";
import { generateExamQuestions } from "./question-generator";
import { lessonDedupeKey, topicSlugToLessonSlug, questionStemHash } from "./pipeline-hashes";

// ---------------------------------------------------------------------------
// Deduplication helpers (DB lookups)
// ---------------------------------------------------------------------------

/**
 * Load all existing PathwayLesson slugs for this pathway+locale from the DB.
 * Returns a Set of `pathwayId|slug|locale` strings for O(1) lookup.
 */
async function loadExistingLessonKeys(
  pathwayId: string,
  locale: string,
): Promise<Set<string>> {
  if (!isDatabaseUrlConfigured()) return new Set();
  const rows = await prisma.pathwayLesson.findMany({
    where: { pathwayId, locale },
    select: { slug: true },
  });
  return new Set(rows.map((r) => lessonDedupeKey(pathwayId, r.slug, locale)));
}

/**
 * Load all existing ExamQuestion stemHashes from the DB for the given topic slugs.
 * Returns a Set of stemHash strings for O(1) lookup.
 */
async function loadExistingStemHashes(topicSlugs: string[]): Promise<Set<string>> {
  if (!isDatabaseUrlConfigured() || topicSlugs.length === 0) return new Set();
  const rows = await prisma.examQuestion.findMany({
    where: {
      topic: { in: topicSlugs },
      stemHash: { not: null },
    },
    select: { stemHash: true },
  });
  return new Set(rows.map((r) => r.stemHash).filter((h): h is string => h !== null));
}

// ---------------------------------------------------------------------------
// In-memory dedup (within the batch itself)
// ---------------------------------------------------------------------------

function buildBatchLessonKeySet(lessons: GeneratedPathwayLesson[]): Set<string> {
  return new Set(lessons.map((l) => l._meta.dedupeKey));
}

function buildBatchStemHashSet(questions: GeneratedExamQuestion[]): Set<string> {
  return new Set(questions.map((q) => q.stemHash));
}

// ---------------------------------------------------------------------------
// Concurrency limiter
// ---------------------------------------------------------------------------

async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number,
): Promise<T[]> {
  const results: T[] = [];
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]!();
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

/**
 * Generate a batch of PathwayLesson + ExamQuestion rows ready for Prisma import.
 *
 * Processing order per topic:
 *  1. Check existing lesson in DB (skip if duplicate and !allowDuplicates)
 *  2. Generate lesson via AI
 *  3. Check in-batch lesson dedup
 *  4. Generate questions via AI
 *  5. Per-question: DB + in-batch stemHash dedup
 *
 * All AI calls run with concurrency = 3 to avoid rate-limit hammering.
 */
export async function runContentBatch(
  input: ContentBatchInput,
): Promise<ContentBatchOutput> {
  const locale = input.locale ?? "en";
  const allowDuplicates = input.allowDuplicates ?? false;

  const pathwayLessons: GeneratedPathwayLesson[] = [];
  const examQuestions: GeneratedExamQuestion[] = [];
  const errors: ContentBatchOutput["errors"] = [];

  let lessonsDuplicateSkipped = 0;
  let questionsDuplicateSkipped = 0;

  // Pre-load DB keys once (two queries regardless of topic count).
  const topicSlugs = input.topics.map((t) => t.topicSlug);
  const [existingLessonKeys, existingStemHashes] = await Promise.all([
    loadExistingLessonKeys(input.pathwayId, locale),
    loadExistingStemHashes(topicSlugs),
  ]);

  // In-batch sets accumulate as we generate (within-batch dedup).
  const batchLessonKeys = new Set<string>();
  const batchStemHashes = new Set<string>();

  // Build per-topic task functions (sequential within a topic; topics run in parallel).
  const topicTasks = input.topics.map((topic) => async () => {
    // ── Lesson ────────────────────────────────────────────────────────────
    const slug = topicSlugToLessonSlug(topic.topicSlug);
    const dedupeKey = lessonDedupeKey(input.pathwayId, slug, locale);

    const lessonAlreadyExists =
      !allowDuplicates && (existingLessonKeys.has(dedupeKey) || batchLessonKeys.has(dedupeKey));

    if (lessonAlreadyExists) {
      lessonsDuplicateSkipped++;
    } else {
      try {
        const lesson = await generatePathwayLesson({
          topic,
          pathwayId: input.pathwayId,
          exam: input.exam,
          country: input.country,
          locale,
        });
        // Check dedup again using the lesson's own computed dedupeKey.
        if (!allowDuplicates && batchLessonKeys.has(lesson._meta.dedupeKey)) {
          lessonsDuplicateSkipped++;
        } else {
          pathwayLessons.push(lesson);
          batchLessonKeys.add(lesson._meta.dedupeKey);
        }
      } catch (e) {
        errors.push({
          topicSlug: topic.topicSlug,
          type: "lesson",
          message: e instanceof Error ? e.message : String(e),
        });
      }
    }

    // ── Questions ─────────────────────────────────────────────────────────
    const questionCount = topic.questionCount ?? 5;

    try {
      const generated = await generateExamQuestions({
        topic,
        exam: input.exam,
        country: input.country,
        count: questionCount,
      });

      for (const q of generated) {
        const hash = q.stemHash;
        const isDup =
          !allowDuplicates && (existingStemHashes.has(hash) || batchStemHashes.has(hash));

        if (isDup) {
          questionsDuplicateSkipped++;
        } else {
          examQuestions.push(q);
          batchStemHashes.add(hash);
          existingStemHashes.add(hash); // prevent same-batch duplicates across topics
        }
      }
    } catch (e) {
      errors.push({
        topicSlug: topic.topicSlug,
        type: "question",
        message: e instanceof Error ? e.message : String(e),
      });
    }
  });

  await runWithConcurrency(topicTasks, 3);

  return {
    generatedAt: new Date().toISOString(),
    input: {
      pathwayId: input.pathwayId,
      exam: input.exam,
      country: input.country,
      topicCount: input.topics.length,
    },
    stats: {
      lessonsGenerated: pathwayLessons.length,
      lessonsDuplicateSkipped,
      questionsGenerated: examQuestions.length,
      questionsDuplicateSkipped,
      errors: errors.length,
    },
    pathwayLessons,
    examQuestions,
    errors,
  };
}

// ---------------------------------------------------------------------------
// Prisma import helpers
// ---------------------------------------------------------------------------

/**
 * Strip `_meta` from a lesson and return a plain object ready for
 * `prisma.pathwayLesson.createMany({ data: [...] })`.
 *
 * Note: PathwayLesson.sections expects `Json` — `GeneratedLessonSection[]`
 * serializes correctly via JSON.stringify / Prisma's Json handling.
 */
export function lessonToPrismaCreateInput(
  lesson: GeneratedPathwayLesson,
): Omit<GeneratedPathwayLesson, "_meta"> {
  const { _meta: _, ...rest } = lesson;
  return rest;
}

/**
 * Convert a batch output to two arrays ready for `createMany`.
 *
 * Usage:
 *   const { lessons, questions } = batchToPrismaInputs(output);
 *   await prisma.pathwayLesson.createMany({ data: lessons, skipDuplicates: true });
 *   await prisma.examQuestion.createMany({ data: questions, skipDuplicates: true });
 */
export function batchToPrismaInputs(output: ContentBatchOutput): {
  lessons: ReturnType<typeof lessonToPrismaCreateInput>[];
  questions: GeneratedExamQuestion[];
} {
  return {
    lessons: output.pathwayLessons.map(lessonToPrismaCreateInput),
    questions: output.examQuestions,
  };
}
