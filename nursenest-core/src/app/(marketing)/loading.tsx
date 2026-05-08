import { BrandedPageLoader } from "@/components/ui/premium-loader";

export default function MarketingLoading() {
  return (
    <BrandedPageLoader message="Loading page" delayMs={360}>
      <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-12 sm:px-6 sm:py-14" aria-hidden>
        <div className="nn-skeleton h-8 max-w-md rounded-lg" />
        <div className="nn-skeleton h-4 max-w-lg rounded-md" />
        <div className="nn-skeleton h-4 max-w-sm rounded-md" />
      </div>
    </BrandedPageLoader>
  );
}
