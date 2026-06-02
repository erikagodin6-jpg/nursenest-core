import { ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { PathwayLessonDetailHeaderSkeleton } from "@/components/lessons/pathway-lesson-detail-header";

/**
 * Suspense fallback for marketing pathway lesson detail: matches the premium lessons hub shell
 * (`LessonsPageShell`) and keeps `header[data-nn-pathway-id]` for route-level loading parity.
 */
export function PathwayLessonDetailPageLoadingFallback({ pathway }: { pathway: ExamPathwayDefinition }) {
  const shellNp = pathway.examFamily === ExamFamily.NP;
  const base = marketingPathwayLessonsIndexPath(pathway);
  const examName = pathwayRegionAwareExamName(pathway);

  return (
    <LessonsPageShell
      omitHeroBand
      title="Loading lesson"
      eyebrow={pathway.shortName.trim() || pathway.displayName}
      pathwayTrack={pathway.roleTrack}
      backLink={{ label: `${examName} lessons`, href: base }}
    >
      <div
        className={`nn-lesson-page-shell nn-premium-lesson-detail-shell nn-lesson-reading-shell--blossom px-0 py-2 sm:px-6 sm:py-4${shellNp ? " nn-lesson-page-shell--np" : ""}`}
        data-nn-premium-lessons-system="detail"
      >
        <PathwayLessonDetailHeaderSkeleton pathway={pathway} />
        <div
          className="nn-lesson-leaf-loader mt-5"
          data-testid="pathway-lesson-detail-leaf-loader"
          aria-hidden="true"
        >
          <span className="nn-lesson-leaf-loader__leaf" />
          <span className="nn-lesson-leaf-loader__leaf nn-lesson-leaf-loader__leaf--d1" />
          <span className="nn-lesson-leaf-loader__leaf nn-lesson-leaf-loader__leaf--d2" />
        </div>
        <div className="mt-6 space-y-3" aria-hidden>
          <div className="nn-skeleton h-4 w-2/3 max-w-md rounded-md" />
          <div className="nn-skeleton h-4 w-full max-w-2xl rounded-md" />
          <div className="nn-skeleton h-36 w-full max-w-5xl rounded-xl" />
        </div>
      </div>
    </LessonsPageShell>
  );
}
