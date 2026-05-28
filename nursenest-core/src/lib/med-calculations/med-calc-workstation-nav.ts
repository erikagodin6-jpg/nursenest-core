import type { MedCalcCategoryDefinition, MedCalcLessonDefinition } from "@/lib/med-calculations/med-calculations-engine";
import type { MedCalcCategorySlug } from "@/lib/med-calculations/med-calculations-engine";

export type MedCalcWorkstationNavCategory = {
  slug: MedCalcCategorySlug;
  title: string;
  lessons: Array<{
    slug: string;
    shortTitle: string;
    category: MedCalcCategorySlug;
    blockCount: number;
    difficulty: string;
  }>;
};

import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export function medCalcLessonBlockCount(lesson: MedCalcLessonDefinition): number {
  return (
    lesson.conceptExplanation.length +
    lesson.workedExamples.length +
    lesson.formulaMethod.length +
    lesson.safetyConsiderations.length
  );
}

export function estimateMedCalcLessonMinutes(blockCount: number): number {
  return Math.max(10, Math.min(32, Math.round(blockCount * 1.6)));
}

export function buildMedCalcWorkstationNav(
  categories: Array<MedCalcCategoryDefinition & { lessons: MedCalcLessonDefinition[] }>,
): MedCalcWorkstationNavCategory[] {
  return categories.map((cat) => ({
    slug: cat.slug,
    title: cat.title,
    lessons: cat.lessons.map((lesson) => ({
      slug: lesson.slug,
      shortTitle: lesson.shortTitle,
      category: lesson.category,
      blockCount: medCalcLessonBlockCount(lesson),
      difficulty: "intermediate",
    })),
  }));
}

export function pickMedCalcContinueTarget(
  categories: Array<MedCalcCategoryDefinition & { lessons: MedCalcLessonDefinition[] }>,
  progressMap?: Record<string, PathwayLessonProgressStatus>,
  lastTouch?: { category: string; slug: string } | null,
): { href: string; title: string } {
  const flat = categories.flatMap((c) => c.lessons);
  if (flat.length === 0) {
    return { href: "/app/med-calculations", title: "Medication calculations overview" };
  }

  if (lastTouch) {
    const resumed = flat.find((l) => l.slug === lastTouch.slug && l.category === lastTouch.category);
    if (resumed) {
      return {
        href: `/app/med-calculations/${resumed.category}/${resumed.slug}`,
        title: resumed.shortTitle,
      };
    }
  }

  if (progressMap) {
    const inProgress = flat.find((l) => progressMap[l.slug] === "in_progress");
    if (inProgress) {
      return {
        href: `/app/med-calculations/${inProgress.category}/${inProgress.slug}`,
        title: inProgress.shortTitle,
      };
    }
    const notStarted = flat.find((l) => (progressMap[l.slug] ?? "not_started") === "not_started");
    if (notStarted) {
      return {
        href: `/app/med-calculations/${notStarted.category}/${notStarted.slug}`,
        title: notStarted.shortTitle,
      };
    }
  }

  const first = flat[0]!;
  return {
    href: `/app/med-calculations/${first.category}/${first.slug}`,
    title: first.shortTitle,
  };
}
