import { BrandedPageLoader } from "@/components/ui/premium-loader";
import { FlashcardsHubSkeleton } from "@/components/skeletons/hub-page-skeleton";

export default function FlashcardsSegmentLoading() {
  return (
    <BrandedPageLoader message="Loading flashcards…" contentClassName="!p-0">
      <FlashcardsHubSkeleton withRouteAria={false} />
    </BrandedPageLoader>
  );
}
