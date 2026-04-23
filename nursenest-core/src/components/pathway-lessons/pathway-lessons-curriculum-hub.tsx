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
import type { MarketingHubLessonVerifyDiagnostics } from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { dedupePathwayLessonsForLibrary } from "@/lib/lessons/pathway-lesson-dedupe";
import { organizeHubLessonsForPresentation } from "@/lib/lessons/pathway-lesson-hub-organize";

/**
 * Single pipeline for hub chrome + curriculum grid: library dedupe (id/slug), hub organize
 * (**slug-only**; concept merge disabled + guarded), then drop rows that cannot build a marketing detail href.
 * Professional-practice corpus suppression is **not** applied here — hub list rows are hub-stripped
 * (`sections: []`) so that guard diverged from full-lesson marketing detail; {@link verifyMarketingHubLessonRowsResolve}
 * already re-checks the hydrated document with the same gates as the public lesson detail route.
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
  /** Slug-only organization: never merge different public slugs that share a topic/title pattern (hub card count bug). */
  const organized = organizeHubLessonsForPresentation(dedupedSafeLessons, args.pathwayId, {
    mergeNearDuplicateTitles: false,
    marketingLessonsHubInvocation: true,
  });
  return organized.filter((l) => pathwayLessonMarketingDetailHref(args.lessonsBasePath, l.slug) != null);
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
  /** When the list pipeline had rows but post-verify inventory is empty, surface explicit diagnostics (never vague “no lessons yet”). */
  hubVerifyDiagnostics?: MarketingHubLessonVerifyDiagnostics | null;
};

export function PathwayLessonsCurriculumHub({
  lessons,
  preparedLessons,
  lessonsBasePath,
  pathwayId,
  progressMap = {},
  canShowProgressMap = false,
  hubVerifyDiagnostics = null,
}: Props) {
  const hubLessons =
    preparedLessons ?? prepareLessonsForHubCurriculum(lessons, { pathwayId, lessonsBasePath });
  const sections = buildPathwayLessonSystemSections(hubLessons, pathwayId);

  if (sections.length === 0) {
    const thinInventoryCopy = emptyStateCopy.thinInventory();
    const hadIncoming = lessons.some(pathwayLessonHasRenderableHubSlug);
    const preparedCount = hubVerifyDiagnostics?.incomingPreparedRowCount ?? 0;
    const verifyPipelineDroppedAll =
      Boolean(hubVerifyDiagnostics) && preparedCount > 0 && (hubVerifyDiagnostics?.keptRowCount ?? 0) === 0;
    const diagSummary =
      verifyPipelineDroppedAll && hubVerifyDiagnostics
        ? `Lesson list had ${preparedCount} prepared row(s) but detail verification dropped every slug (locale ${hubVerifyDiagnostics.lessonContentLocale}). Drop reasons: ${JSON.stringify(hubVerifyDiagnostics.excludedByReason)}.`
        : null;
    if (process.env.NODE_ENV !== "production" && verifyPipelineDroppedAll && hubVerifyDiagnostics) {
      safeServerLog("pathway_lessons", "hub_verify_pipeline_zero_grid_dev", {
        pathway_id: hubVerifyDiagnostics.pathwayId,
        lesson_content_locale: hubVerifyDiagnostics.lessonContentLocale,
        reasons_json: JSON.stringify(hubVerifyDiagnostics.excludedByReason),
      });
    }
    return (
      <PremiumEmptyState
        data-nn-empty="curriculum-hub-empty"
        tone="growth"
        density="compact"
        visualLayout="stack"
        headline={thinInventoryCopy.headline}
        body={
          verifyPipelineDroppedAll && diagSummary
            ? diagSummary
            : hadIncoming
              ? "Some rows were removed because they could not be matched to a live public lesson for this pathway (stale slug, incomplete publish, or pathway metadata mismatch). Open Browse lessons to retry the full library."
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
