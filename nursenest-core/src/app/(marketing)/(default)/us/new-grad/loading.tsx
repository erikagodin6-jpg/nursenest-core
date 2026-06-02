import { BrandedPageLoader } from "@/components/ui/premium-loader";

/**
 * Branded transition for US New Grad marketing hub + work-area routes.
 */
export default function UsNewGradMarketingSegmentLoading() {
  return (
    <BrandedPageLoader message="Loading New Grad hub" delayMs={320} tall>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6" aria-hidden>
        <div className="nn-skeleton h-8 max-w-xs rounded-lg" />
        <div className="nn-skeleton h-10 max-w-2xl rounded-xl" />
        <div className="nn-skeleton h-5 max-w-xl rounded-md" />
        <div className="nn-skeleton h-5 max-w-lg rounded-md" />
        <div className="nn-skeleton mt-6 min-h-[14rem] rounded-[1.75rem]" />
      </div>
    </BrandedPageLoader>
  );
}
