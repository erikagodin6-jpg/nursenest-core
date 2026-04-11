import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { LessonSystemCard } from "@/components/pathway-lessons/lesson-system-card";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { buildPathwayLessonBoard } from "@/lib/lessons/pathway-lesson-board";
import {
  pathwayLessonHasRenderableHubSlug,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

type Props = {
  pathway: Pick<ExamPathwayDefinition, "roleTrack">;
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
  canShowProgressMap?: boolean;
  showLockedState?: boolean;
};

export function PathwayLessonsCurriculumHub({
  pathway,
  lessons,
  lessonsBasePath,
  progressMap = {},
  canShowProgressMap = false,
  showLockedState = false,
}: Props) {
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const { sections } = buildPathwayLessonBoard({
    pathway,
    lessons: safeLessons,
    progressMap: canShowProgressMap ? progressMap : {},
  });

  if (sections.length === 0) {
    const thinInventoryCopy = emptyStateCopy.thinInventory();
    return (
      <PremiumEmptyState
        data-nn-empty="curriculum-hub-empty"
        tone="growth"
        density="compact"
        visualLayout="stack"
        headline={thinInventoryCopy.headline}
        body="No lessons are available in this pathway yet. The curriculum hub will expand here as more indexed sections go live."
        hint={thinInventoryCopy.hint}
        primaryCta={{ label: "Browse lessons", href: lessonsBasePath, variant: "primary" }}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sections.map((section, sectionIndex) => (
        <LessonSystemCard
          key={section.id}
          section={section}
          lessonsBasePath={lessonsBasePath}
          showLockedState={showLockedState}
          sectionIndex={sectionIndex}
        />
      ))}
    </div>
  );
}
