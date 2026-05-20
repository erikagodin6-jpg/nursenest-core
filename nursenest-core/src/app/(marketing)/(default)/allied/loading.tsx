import { BrandedPageLoader } from "@/components/ui/premium-loader";

/**
 * Branded transition for `/allied/*` marketing hubs (global + occupation-scoped).
 * Presentation only — does not alter data fetching or route logic.
 */
export default function AlliedMarketingSegmentLoading() {
  return (
    <BrandedPageLoader message="Loading Allied Health hub" delayMs={320} tall>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6" aria-hidden>
        <div className="nn-skeleton h-9 max-w-sm rounded-xl" />
        <div className="nn-skeleton h-6 max-w-2xl rounded-lg" />
        <div className="nn-skeleton h-4 max-w-xl rounded-md" />
        <div className="nn-skeleton h-4 max-w-lg rounded-md" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="nn-skeleton h-40 rounded-[1.35rem]" />
          <div className="nn-skeleton h-40 rounded-[1.35rem]" />
          <div className="nn-skeleton h-40 rounded-[1.35rem]" />
        </div>
      </div>
    </BrandedPageLoader>
  );
}
