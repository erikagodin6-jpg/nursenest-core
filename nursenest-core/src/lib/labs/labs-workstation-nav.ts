import type { LabCategoryDefinition, LabLessonDefinition } from "@/lib/labs/labs-engine";
import type { LabsWorkstationNavCategory } from "@/components/labs/labs-workstation-sidebar";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export function lessonBlockCount(lesson: LabLessonDefinition): number {
  return (
    lesson.physiology.length +
    lesson.priorityThresholds.length +
    lesson.patternRecognition.length +
    lesson.microScenarios.length +
    lesson.trendInterpretation.length
  );
}

export function buildLabsWorkstationNav(
  categories: Array<LabCategoryDefinition & { lessons: LabLessonDefinition[] }>,
): LabsWorkstationNavCategory[] {
  return categories.map((cat) => ({
    slug: cat.slug,
    title: cat.title,
    lessons: cat.lessons.map((lesson) => ({
      slug: lesson.slug,
      shortTitle: lesson.shortTitle,
      category: lesson.category,
      blockCount: lessonBlockCount(lesson),
    })),
  }));
}

export function pickLabsContinueTarget(
  categories: Array<LabCategoryDefinition & { lessons: LabLessonDefinition[] }>,
  progressMap?: Record<string, PathwayLessonProgressStatus>,
  lastTouch?: { category: string; slug: string } | null,
): { href: string; title: string } {
  const flat = categories.flatMap((c) => c.lessons);
  if (flat.length === 0) {
    return { href: "/app/labs", title: "Labs overview" };
  }

  if (lastTouch) {
    const resumed = flat.find((l) => l.slug === lastTouch.slug && l.category === lastTouch.category);
    if (resumed) {
      return {
        href: `/app/labs/${resumed.category}/${resumed.slug}`,
        title: resumed.shortTitle,
      };
    }
  }

  if (progressMap) {
    const inProgress = flat.find((l) => progressMap[l.slug] === "in_progress");
    if (inProgress) {
      return {
        href: `/app/labs/${inProgress.category}/${inProgress.slug}`,
        title: inProgress.shortTitle,
      };
    }
    const notStarted = flat.find((l) => (progressMap[l.slug] ?? "not_started") === "not_started");
    if (notStarted) {
      return {
        href: `/app/labs/${notStarted.category}/${notStarted.slug}`,
        title: notStarted.shortTitle,
      };
    }
  }

  const first = flat[0]!;
  return {
    href: `/app/labs/${first.category}/${first.slug}`,
    title: first.shortTitle,
  };
}
