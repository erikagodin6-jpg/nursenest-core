import { BlogPostPageSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { BrandedPageLoader } from "@/components/ui/premium-loader";

export default function BlogPostLoading() {
  return (
    <BrandedPageLoader message="Loading article" delayMs={340} contentClassName="p-0 sm:p-0">
      <BlogPostPageSkeleton />
    </BrandedPageLoader>
  );
}
