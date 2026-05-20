import { ToolDetailPageSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { BrandedPageLoader } from "@/components/ui/premium-loader";

export default function LocalizedToolDetailLoading() {
  return (
    <BrandedPageLoader message="Loading calculator" delayMs={320} contentClassName="p-0 sm:p-0">
      <ToolDetailPageSkeleton />
    </BrandedPageLoader>
  );
}
