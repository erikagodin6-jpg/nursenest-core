import { collectMergedLessonVirtualFlashcardsForPathway } from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { CheckpointQuestion } from "@/lib/lessons/lesson-recall-types";
import { pathwayLessonEligibleForLearnerStudyInventory } from "@/lib/learner-study-hub/pathway-lesson-learner-study-guards";

export function listPublishedPathwayLessonsForLearnerStudy(pathwayId: string) {
  const pid = pathwayId?.trim();
  if (!pid) return [];
  return getCatalogPathwayLessonsSync(pid).filter(pathwayLessonEligibleForLearnerStudyInventory);
}

function lessonReviewHref(pathwayId: string, lessonSlug: string): string {
  const pathway = getExamPathwayById(pathwayId);
  if (pathway) {
    const marketing = marketingPathwayLessonDetailPath(pathway, lessonSlug);
    if (marketing) return marketing;
  }
  return `/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}&q=${encodeURIComponent(lessonSlug)}`;
}

function normStem(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .slice(0, 240);
}

export type PathwayLessonDerivedPracticeQuestion = {
  stem: string;
  options: string[];
  correctIndex: number;
  rationale?: string;
  pathwayId: string;
  lessonSlug: string;
  lessonTitle: string;
  topicSlug: string;
  bodySystem: string;
  difficulty: number;
  source: "preTest" | "postTest" | "checkpoint" | "interactive_mini";
  lessonHref: string;
};

function pushQuizItems(
  items: PathwayLessonQuizItem[] | undefined,
  args: {
    pathwayId: string;
    lessonSlug: string;
    lessonTitle: string;
    topicSlug: string;
    bodySystem: string;
    source: "preTest" | "postTest";
    seen: Set<string>;
    out: PathwayLessonDerivedPracticeQuestion[];
    cap: number;
  },
): void {
  const { pathwayId, lessonSlug, lessonTitle, topicSlug, bodySystem, source, seen, out, cap } = args;
  const href = lessonReviewHref(pathwayId, lessonSlug);
  for (const item of items ?? []) {
    if (out.length >= cap) return;
    const stem = String(item.question ?? "").trim();
    const opts = (item.options ?? []).map((o) => String(o ?? "").trim()).filter(Boolean);
    if (stem.length < 6 || opts.length < 2) continue;
    const correct = typeof item.correct === "number" && Number.isFinite(item.correct) ? Math.floor(item.correct) : 0;
    if (correct < 0 || correct >= opts.length) continue;
    const key = `${lessonSlug}|${normStem(stem)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      stem,
      options: opts,
      correctIndex: correct,
      rationale: item.rationale?.trim() || undefined,
      pathwayId,
      lessonSlug,
      lessonTitle,
      topicSlug,
      bodySystem,
      difficulty: 3,
      source,
      lessonHref: href,
    });
  }
}

function pushCheckpoint(
  cq: CheckpointQuestion,
  args: {
    pathwayId: string;
    lessonSlug: string;
    lessonTitle: string;
    topicSlug: string;
    bodySystem: string;
    seen: Set<string>;
    out: PathwayLessonDerivedPracticeQuestion[];
    cap: number;
  },
): void {
  const { pathwayId, lessonSlug, lessonTitle, topicSlug, bodySystem, seen, out, cap } = args;
  if (out.length >= cap) return;
  const stem = String(cq.question ?? "").trim();
  const opts = cq.options.map((o) => String(o.text ?? "").trim()).filter(Boolean);
  if (stem.length < 6 || opts.length < 2) return;
  const correctIdx = cq.options.findIndex((o) => o.id === cq.correctId);
  if (correctIdx < 0 || correctIdx >= opts.length) return;
  const key = `${lessonSlug}|${normStem(stem)}`;
  if (seen.has(key)) return;
  seen.add(key);
  const href = lessonReviewHref(pathwayId, lessonSlug);
  out.push({
    stem,
    options: opts,
    correctIndex: correctIdx,
    rationale: String(cq.explanation ?? "").trim() || undefined,
    pathwayId,
    lessonSlug,
    lessonTitle,
    topicSlug,
    bodySystem,
    difficulty: 3,
    source: "checkpoint",
    lessonHref: href,
  });
}

export type GetPracticeQuestionsForPathwayOptions = {
  maxLessons?: number;
  maxQuestions?: number;
  /** When set, only include lessons whose body/system/topic slug matches one of these (lowercase). */
  bodySystems?: string[];
  topicSlug?: string | null;
};

/**
 * Aggregates inline MCQ-style content from published PathwayLesson catalog rows (pre/post checks,
 * section checkpoints, interactive mini-questions). Dedupes by lesson slug + normalized stem.
 * Does not resolve `preTestQuestionIds` / `postTestQuestionIds` (bank ids) — those stay on the exam-question APIs.
 */
export function getPracticeQuestionsForPathway(
  pathwayId: string,
  opts: GetPracticeQuestionsForPathwayOptions = {},
): { pathwayId: string; questions: PathwayLessonDerivedPracticeQuestion[]; truncated: boolean } {
  const pid = pathwayId?.trim();
  if (!pid) return { pathwayId: "", questions: [], truncated: false };

  const maxLessons = Math.min(800, Math.max(1, opts.maxLessons ?? 400));
  const maxQuestions = Math.min(5000, Math.max(1, opts.maxQuestions ?? 2500));
  const lessons = listPublishedPathwayLessonsForLearnerStudy(pid).slice(0, maxLessons);
  const systemFilter = (opts.bodySystems ?? [])
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const topicFilter = opts.topicSlug?.trim().toLowerCase() ?? "";

  const seen = new Set<string>();
  const out: PathwayLessonDerivedPracticeQuestion[] = [];

  for (const lesson of lessons) {
    if (out.length >= maxQuestions) break;
    const bodyKey = ((lesson.bodySystem || lesson.system || "").trim().toLowerCase() || "general");
    if (systemFilter.length > 0 && !systemFilter.includes(bodyKey)) continue;
    if (topicFilter && (lesson.topicSlug ?? "").trim().toLowerCase() !== topicFilter) continue;

    const topicSlug = (lesson.topicSlug ?? "").trim().toLowerCase();
    const bodySystem = (lesson.bodySystem || lesson.system || "general").trim() || "general";
    const base = {
      pathwayId: pid,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      topicSlug,
      bodySystem,
      seen,
      out,
      cap: maxQuestions,
    };

    pushQuizItems(lesson.preTest, { ...base, source: "preTest" });
    pushQuizItems(lesson.postTest, { ...base, source: "postTest" });

    for (const section of lesson.sections ?? []) {
      if (out.length >= maxQuestions) break;
      for (const cq of section.checkpointQuestions ?? []) {
        pushCheckpoint(cq, base);
      }
    }

    for (const mod of lesson.interactiveModules ?? []) {
      if (out.length >= maxQuestions) break;
      if (mod.type !== "sound-library") continue;
      for (const item of mod.items ?? []) {
        if (out.length >= maxQuestions) break;
        const mq = item.miniQuestion;
        if (!mq?.question || !Array.isArray(mq.options) || mq.options.length < 2) continue;
        const stem = String(mq.question).trim();
        const opts = mq.options.map((o) => String(o ?? "").trim()).filter(Boolean);
        const correct = typeof mq.correctIndex === "number" ? Math.floor(mq.correctIndex) : 0;
        if (stem.length < 6 || correct < 0 || correct >= opts.length) continue;
        const key = `${lesson.slug}|${normStem(stem)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          stem,
          options: opts,
          correctIndex: correct,
          rationale: String(mq.rationale ?? "").trim() || undefined,
          pathwayId: pid,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          topicSlug,
          bodySystem,
          difficulty: 3,
          source: "interactive_mini",
          lessonHref: lessonReviewHref(pid, lesson.slug),
        });
      }
    }
  }

  return { pathwayId: pid, questions: out, truncated: out.length >= maxQuestions };
}

export type StudySystemRow = { id: string; label: string; count: number };

/**
 * Body-system (catalog) counts for published lessons only — used for pathway-scoped study hubs.
 */
export function getStudySystemsForPathway(pathwayId: string): {
  pathwayId: string;
  systems: StudySystemRow[];
  publishedLessonCount: number;
} {
  const pid = pathwayId?.trim();
  if (!pid) return { pathwayId: "", systems: [], publishedLessonCount: 0 };

  const lessons = listPublishedPathwayLessonsForLearnerStudy(pid);
  const counts = new Map<string, number>();
  for (const l of lessons) {
    const key = (l.bodySystem || l.system || "general").trim().toLowerCase() || "general";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const systems: StudySystemRow[] = [...counts.entries()]
    .map(([id, count]) => ({
      id,
      label: id
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  return { pathwayId: pid, systems, publishedLessonCount: lessons.length };
}

export type FlashcardsPathwayStudySummary = {
  pathwayId: string;
  mergedVirtualCount: number;
  diagnostics: ReturnType<typeof collectMergedLessonVirtualFlashcardsForPathway>["diagnostics"];
};

/** Summary of catalog-derived flashcard inventory for a pathway (virtual merge + diagnostics). */
export function getFlashcardsForPathway(pathwayId: string): FlashcardsPathwayStudySummary {
  const pid = pathwayId?.trim();
  if (!pid) {
    return {
      pathwayId: "",
      mergedVirtualCount: 0,
      diagnostics: {
        pathwayId: "",
        catalogLessonCount: 0,
        lessonsWithVirtualCards: 0,
        totalVirtualCards: 0,
        recallVirtualCount: 0,
        sectionDerivedVirtualCount: 0,
        genericFillerSourcedSectionCards: 0,
      },
    };
  }
  const { virtuals, diagnostics } = collectMergedLessonVirtualFlashcardsForPathway(pid);
  return { pathwayId: pid, mergedVirtualCount: virtuals.length, diagnostics };
}

/** Hub / flashcards page: stable diagnostics when the Prisma-backed custom session builder fails. */
export function flashcardLessonVirtualDiagnosticsForPathway(
  pathwayId: string,
  filter: { selectedCategories: string[]; filterModeLabel: string },
): FlashcardLessonVirtualDiagnostics | null {
  const pid = pathwayId?.trim();
  if (!pid) return null;
  const { diagnostics } = collectMergedLessonVirtualFlashcardsForPathway(pid);
  return {
    pathwayId: diagnostics.pathwayId,
    catalogLessonCount: diagnostics.catalogLessonCount,
    lessonsWithDerivedCards: diagnostics.lessonsWithVirtualCards,
    totalGeneratedVirtualCards: diagnostics.totalVirtualCards,
    recallVirtualCount: diagnostics.recallVirtualCount,
    sectionDerivedVirtualCount: diagnostics.sectionDerivedVirtualCount,
    genericFillerSectionCardHits: diagnostics.genericFillerSourcedSectionCards,
    selectedCategoryIds: filter.selectedCategories,
    filterModeLabel: filter.filterModeLabel,
  };
}

export function getPathwayLessonPracticeHubSnapshot(pathwayId: string) {
  const practice = getPracticeQuestionsForPathway(pathwayId, { maxQuestions: 4000, maxLessons: 600 });
  const systems = getStudySystemsForPathway(pathwayId);
  const flash = getFlashcardsForPathway(pathwayId);
  return {
    pathwayId: pathwayId.trim(),
    practiceQuestionCount: practice.questions.length,
    practiceTruncated: practice.truncated,
    publishedLessonCount: systems.publishedLessonCount,
    topSystems: systems.systems.slice(0, 14),
    lessonLinkedVirtualCards: flash.mergedVirtualCount,
    catalogLessonCountPublished: flash.diagnostics.catalogLessonCount,
  };
}

export type PathwayLessonPracticeHubSnapshot = ReturnType<typeof getPathwayLessonPracticeHubSnapshot>;
