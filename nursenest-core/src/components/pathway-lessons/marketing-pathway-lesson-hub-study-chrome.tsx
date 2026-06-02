import { LessonHubClinicalModulesStrip } from "@/components/pathway-lessons/lesson-hub-clinical-modules-strip";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { MarketingLessonsHubStickyStudyChrome } from "@/components/pathway-lessons/marketing-lessons-hub-sticky-study-chrome";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { MarketingLessonHubSurfaceChip } from "@/lib/marketing/marketing-lesson-hub-surface-chips";

type Props = {
  pathway: ExamPathwayDefinition;
  marketingLocale: string;
  viewerSignedIn: boolean;
  surfaceChips: MarketingLessonHubSurfaceChip[];
};

/** Unified study chrome row for marketing lesson hubs and lesson detail pages. */
export function MarketingPathwayLessonHubStudyChrome({
  pathway,
  marketingLocale,
  viewerSignedIn,
  surfaceChips,
}: Props) {
  return (
    <MarketingLessonsHubStickyStudyChrome>
      <LessonHubSurfaceChips links={surfaceChips} />
      <LessonHubClinicalModulesStrip
        pathway={pathway}
        marketingLocale={marketingLocale}
        signedIn={viewerSignedIn}
        compact
      />
    </MarketingLessonsHubStickyStudyChrome>
  );
}
