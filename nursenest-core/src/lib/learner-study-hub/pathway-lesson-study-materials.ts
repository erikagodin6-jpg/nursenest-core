import { collectMergedLessonVirtualFlashcardsForPathway } from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonEligibleForLearnerStudyInventory } from "@/lib/learner-study-hub/pathway-lesson-learner-study-guards";
import { loadPublishedPathwayLessonsForStudyFromDb } from "@/lib/learner-study-hub/load-published-pathway-lessons-for-study-from-db";
import {
  aggregatePracticeQuestionsFromInventoryLessons,
  type GetPracticeQuestionsForPathwayOptions,
  type PathwayLessonDerivedPracticeQuestion,
  type PracticeQuestionsPathwayAggregation,
} from "@/lib/learner-study-hub/pathway-lesson-practice-aggregation";

export type { PathwayLessonDerivedPracticeQuestion, GetPracticeQuestionsForPathwayOptions, PracticeQuestionsPathwayAggregation };
export { aggregatePracticeQuestionsFromInventoryLessons };

export async function listPublishedPathwayLessonsForLearnerStudy(pathwayId: string): Promise<PathwayLessonRecord[]> {
  return loadPublishedPathwayLessonsForStudyFromDb(pathwayId);
}

export async function getPracticeQuestionsForPathway(
  pathwayId: string,
  opts: GetPracticeQuestionsForPathwayOptions = {},
): Promise<PracticeQuestionsPathwayAggregation> {
  const pid = pathwayId?.trim();
  if (!pid) return { pathwayId: "", questions: [], truncated: false, byBodySystem: [] };

  const lessons =
    opts.lessonsOverride ?? (await loadPublishedPathwayLessonsForStudyFromDb(pid, { take: opts.maxLessons ?? 800 }));
  return aggregatePracticeQuestionsFromInventoryLessons(pid, lessons, opts);
}

export type StudySystemRow = { id: string; label: string; count: number };

export async function getStudySystemsForPathway(pathwayId: string): Promise<{
  pathwayId: string;
  systems: StudySystemRow[];
  publishedLessonCount: number;
}> {
  const pid = pathwayId?.trim();
  if (!pid) return { pathwayId: "", systems: [], publishedLessonCount: 0 };

  const lessons = await loadPublishedPathwayLessonsForStudyFromDb(pid);
  const eligible = lessons.filter(pathwayLessonEligibleForLearnerStudyInventory);
  const counts = new Map<string, number>();
  for (const l of eligible) {
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

  return { pathwayId: pid, systems, publishedLessonCount: eligible.length };
}

export type FlashcardsPathwayStudySummary = {
  pathwayId: string;
  mergedVirtualCount: number;
  diagnostics: ReturnType<typeof collectMergedLessonVirtualFlashcardsForPathway>["diagnostics"];
  byBodySystem: { bodySystem: string; count: number }[];
};

export async function getFlashcardsForPathway(pathwayId: string): Promise<FlashcardsPathwayStudySummary> {
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
      byBodySystem: [],
    };
  }
  const lessons = await loadPublishedPathwayLessonsForStudyFromDb(pid);
  const { virtuals, diagnostics } = collectMergedLessonVirtualFlashcardsForPathway(pid, lessons);
  const slugToSystem = new Map<string, string>();
  for (const l of lessons) {
    slugToSystem.set(
      l.slug,
      ((l.bodySystem || l.system || "general").trim().toLowerCase() || "general") as string,
    );
  }
  const counts = new Map<string, number>();
  for (const v of virtuals) {
    const sys = slugToSystem.get(v.lessonSlug) ?? "general";
    counts.set(sys, (counts.get(sys) ?? 0) + 1);
  }
  const byBodySystem = [...counts.entries()]
    .map(([bodySystem, count]) => ({ bodySystem, count }))
    .sort((a, b) => b.count - a.count || a.bodySystem.localeCompare(b.bodySystem));

  return { pathwayId: pid, mergedVirtualCount: virtuals.length, diagnostics, byBodySystem };
}

export async function flashcardLessonVirtualDiagnosticsForPathway(
  pathwayId: string,
  filter: { selectedCategories: string[]; filterModeLabel: string },
): Promise<FlashcardLessonVirtualDiagnostics | null> {
  const pid = pathwayId?.trim();
  if (!pid) return null;
  const lessons = await loadPublishedPathwayLessonsForStudyFromDb(pid);
  const { diagnostics } = collectMergedLessonVirtualFlashcardsForPathway(pid, lessons);
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

export async function getPathwayLessonPracticeHubSnapshot(pathwayId: string) {
  const trimmed = pathwayId.trim();
  const lessons = await loadPublishedPathwayLessonsForStudyFromDb(trimmed, { take: 800 });
  const practice = aggregatePracticeQuestionsFromInventoryLessons(trimmed, lessons, {
    maxQuestions: 4000,
    maxLessons: 600,
  });
  const eligible = lessons.filter(pathwayLessonEligibleForLearnerStudyInventory);
  const counts = new Map<string, number>();
  for (const l of eligible) {
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
  const { virtuals, diagnostics } = collectMergedLessonVirtualFlashcardsForPathway(trimmed, lessons);
  const mergedVirtualCount = virtuals.length;
  return {
    pathwayId: trimmed,
    practiceQuestionCount: practice.questions.length,
    practiceTruncated: practice.truncated,
    publishedLessonCount: eligible.length,
    topSystems: systems.slice(0, 14),
    lessonLinkedVirtualCards: mergedVirtualCount,
    catalogLessonCountPublished: diagnostics.catalogLessonCount,
  };
}

export type PathwayLessonPracticeHubSnapshot = Awaited<ReturnType<typeof getPathwayLessonPracticeHubSnapshot>>;
