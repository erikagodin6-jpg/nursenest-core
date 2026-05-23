import { BrandedPageLoader } from "@/components/ui/premium-loader";
import { LearnerLessonDetailSkeleton } from "@/components/skeletons/hub-page-skeleton";

export default function LearnerLessonDetailLoading() {
  return (
    <BrandedPageLoader message="Loading lesson…" contentClassName="!p-0">
      <LearnerLessonDetailSkeleton withRouteAria={false} />
    </BrandedPageLoader>
  );
}
