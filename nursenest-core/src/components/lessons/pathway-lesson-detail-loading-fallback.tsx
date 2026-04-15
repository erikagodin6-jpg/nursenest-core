import { ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PathwayLessonDetailHeaderSkeleton } from "@/components/lessons/pathway-lesson-detail-header";

/**
 * Suspense fallback for marketing pathway lesson detail: keeps the same shell classes and
 * `header[data-nn-pathway-id]` as the loaded page (unlike the lessons-hub skeleton used by the old
 * route `loading.tsx`).
 */
export function PathwayLessonDetailLessonLoadingFallback({ pathway }: { pathway: ExamPathwayDefinition }) {
  const shellNp = pathway.examFamily === ExamFamily.NP;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-1 pb-4 sm:px-6 sm:pt-2 sm:pb-5 lg:px-8">
      <div
        className={`nn-lesson-page-shell px-3 py-3 sm:px-6 sm:py-5${shellNp ? " nn-lesson-page-shell--np" : ""}`}
      >
        <PathwayLessonDetailHeaderSkeleton pathway={pathway} />
        <div className="mt-6 space-y-3" aria-hidden>
          <div className="nn-skeleton h-4 w-2/3 max-w-md rounded-md" />
          <div className="nn-skeleton h-4 w-full max-w-2xl rounded-md" />
          <div className="nn-skeleton h-36 w-full max-w-5xl rounded-xl" />
        </div>
      </div>
    </div>
  );
}
