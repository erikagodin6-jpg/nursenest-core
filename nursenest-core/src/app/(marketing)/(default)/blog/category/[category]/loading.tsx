import { BlogIndexPageSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { BrandedPageLoader } from "@/components/ui/premium-loader";

export default function BlogCategoryLoading() {
  return (
    <BrandedPageLoader message="Loading category" delayMs={320} contentClassName="p-0 sm:p-0">
      <BlogIndexPageSkeleton />
    </BrandedPageLoader>
  );
}
