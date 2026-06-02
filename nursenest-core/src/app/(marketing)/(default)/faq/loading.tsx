import { FaqMarketingPageSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { BrandedPageLoader } from "@/components/ui/premium-loader";

export default function FaqLoading() {
  return (
    <BrandedPageLoader message="Loading FAQ" delayMs={320} contentClassName="p-0 sm:p-0">
      <FaqMarketingPageSkeleton />
    </BrandedPageLoader>
  );
}
