import { LessonSystemCard } from "@/components/pathway-lessons/lesson-system-card";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import {
  buildPathwayLessonSystemSections,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import {
  pathwayLessonHasRenderableHubSlug,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

type Props = {
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
  canShowProgressMap?: boolean;
  showLockedState?: boolean;
};

export function PathwayLessonsCurriculumHub({
  lessons,
  lessonsBasePath,
  progressMap = {},
  canShowProgressMap = false,
}: Props) {
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const sections = buildPathwayLessonSystemSections(safeLessons);

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
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
