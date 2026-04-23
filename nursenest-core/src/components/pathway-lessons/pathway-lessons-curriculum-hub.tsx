import { LessonSystemCard } from "@/components/pathway-lessons/lesson-system-card";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import {
  buildPathwayLessonSystemSections,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";
import { dedupePathwayLessonsForLibrary } from "@/lib/lessons/pathway-lesson-dedupe";
import { organizeHubLessonsForPresentation } from "@/lib/lessons/pathway-lesson-hub-organize";
import { filterLessonsForProfessionalPracticeHubGuard } from "@/lib/taxonomy/nursing-taxonomy-validation";

/**
 * Single pipeline for hub chrome + curriculum grid: library dedupe (id/slug), clinical organize
 * (slug + concept + canonical titles), taxonomy guard, then drop rows that cannot build a marketing
 * detail href (so counts and {@link LessonSystemCard} rows never diverge).
 */
export function prepareLessonsForHubCurriculum(
  lessons: PathwayLessonRecord[],
  args: { pathwayId?: string; lessonsBasePath: string },
): PathwayLessonRecord[] {
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const dedupedSafeLessons = dedupePathwayLessonsForLibrary(safeLessons, {
    pathwayIdHint: args.pathwayId,
    source: `curriculum_hub_prepare:${args.pathwayId ?? "unknown"}`,
    devLog: false,
  }).items;
  const organized = organizeHubLessonsForPresentation(dedupedSafeLessons, args.pathwayId);
  const hubGuardLessons = filterLessonsForProfessionalPracticeHubGuard(organized);
  return hubGuardLessons.filter((l) => pathwayLessonMarketingDetailHref(args.lessonsBasePath, l.slug) != null);
}

type Props = {
  lessons: PathwayLessonRecord[];
  /**
   * When the parent already ran {@link prepareLessonsForHubCurriculum} for counts/toolbar,
   * pass it here to avoid duplicate work and guarantee the grid matches that dataset exactly.
   */
  preparedLessons?: PathwayLessonRecord[];
  lessonsBasePath: string;
  pathwayId?: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
  canShowProgressMap?: boolean;
  showLockedState?: boolean;
};

export function PathwayLessonsCurriculumHub({
  lessons,
  preparedLessons,
  lessonsBasePath,
  pathwayId,
  progressMap = {},
  canShowProgressMap = false,
}: Props) {
  const hubLessons =
    preparedLessons ?? prepareLessonsForHubCurriculum(lessons, { pathwayId, lessonsBasePath });
  const sections = buildPathwayLessonSystemSections(hubLessons, pathwayId);

  if (sections.length === 0) {
    const thinInventoryCopy = emptyStateCopy.thinInventory();
    const hadIncoming = lessons.some(pathwayLessonHasRenderableHubSlug);
    return (
      <PremiumEmptyState
        data-nn-empty="curriculum-hub-empty"
        tone="growth"
        density="compact"
        visualLayout="stack"
        headline={thinInventoryCopy.headline}
        body={
          hadIncoming
            ? "Some rows are temporarily hidden while taxonomy checks finish, or filters removed them from this grid. Use Browse lessons to open the full library."
            : "No lessons are available in this pathway yet. The curriculum hub will expand here as more indexed sections go live."
        }
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
