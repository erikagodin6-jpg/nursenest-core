import { BrandedPageLoader } from "@/components/ui/premium-loader";
import { PracticeTestRunPageSkeleton } from "@/components/skeletons/hub-page-skeleton";

export default function PracticeTestRunLoading() {
  return (
    <BrandedPageLoader message="Loading practice test…" contentClassName="!p-0">
      <PracticeTestRunPageSkeleton withRouteAria={false} />
    </BrandedPageLoader>
  );
}
