import { ToolsHubPageSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { BrandedPageLoader } from "@/components/ui/premium-loader";

export default function LocalizedToolsHubLoading() {
  return (
    <BrandedPageLoader message="Loading nursing tools" delayMs={320} contentClassName="p-0 sm:p-0">
      <ToolsHubPageSkeleton />
    </BrandedPageLoader>
  );
}
