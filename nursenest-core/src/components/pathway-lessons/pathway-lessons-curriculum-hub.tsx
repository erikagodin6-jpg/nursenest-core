import { LessonSystemCard } from "@/components/pathway-lessons/lesson-system-card";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import {
  buildPathwayLessonSystemSections,
  type PathwayLessonSystemSection,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  pathwayLessonHasRenderableHubSlug,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";
import { dedupePathwayLessonsForLibrary } from "@/lib/lessons/pathway-lesson-dedupe";

type Props = {
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  pathwayId?: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
  canShowProgressMap?: boolean;
  showLockedState?: boolean;
};

export function PathwayLessonsCurriculumHub({
  lessons,
  lessonsBasePath,
  pathwayId,
  progressMap = {},
  canShowProgressMap = false,
}: Props) {
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const dedupedSafeLessons = dedupePathwayLessonsForLibrary(safeLessons, {
    pathwayIdHint: pathwayId,
    source: `curriculum_hub:${pathwayId ?? "unknown"}`,
    devLog: true,
  }).items;
  const sections = buildPathwayLessonSystemSections(dedupedSafeLessons, pathwayId);

  if (sections.length === 0 && dedupedSafeLessons.length > 0) {
    if (process.env.NODE_ENV !== "production") {
      safeServerLog("pathway_lessons", "curriculum_hub_uncategorized_fallback", {
        pathwayId: pathwayId ?? "",
        lesson_count: dedupedSafeLessons.length,
      });
    }
    const sorted = [...dedupedSafeLessons].sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
    );
    const fallbackSection: PathwayLessonSystemSection = {
      id: "pathway-lessons-fallback",
      label: "Lessons in this pathway",
      systemLabel: "professional-practice-ethics",
      description: "Browse the lesson list while clinical-area grouping catches up.",
      lessons: sorted,
      count: sorted.length,
    };
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <LessonSystemCard
          section={fallbackSection}
          lessonsBasePath={lessonsBasePath}
          progressMap={progressMap}
          showProgress={canShowProgressMap}
        />
      </div>
    );
  }

  if (sections.length === 0) {
    const thinInventoryCopy = emptyStateCopy.thinInventory();
    return (
      <PremiumEmptyState
        data-nn-empty="curriculum-hub-empty"
        tone="growth"
        density="compact"
        visualLayout="stack"
        headline={thinInventoryCopy.headline}
        body="No published lessons are available for this pathway in the current region and exam context yet. The curriculum hub will expand as lessons meet the public lesson bar."
        hint={thinInventoryCopy.hint}
        primaryCta={{ label: "Browse lessons", href: lessonsBasePath, variant: "primary" }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {sections.map((section) => (
        <LessonSystemCard
          key={section.id}
          section={section}
          lessonsBasePath={lessonsBasePath}
          progressMap={progressMap}
          showProgress={canShowProgressMap}
        />
      ))}
    </div>
  );
}
