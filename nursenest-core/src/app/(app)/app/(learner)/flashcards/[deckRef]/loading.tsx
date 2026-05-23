import { BrandedPageLoader } from "@/components/ui/premium-loader";
import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";

export default function FlashcardDeckSegmentLoading() {
  return (
    <BrandedPageLoader message="Loading flashcard session…" contentClassName="!p-0">
      <FlashcardStudySessionSkeleton withRouteAria={false} />
    </BrandedPageLoader>
  );
}
