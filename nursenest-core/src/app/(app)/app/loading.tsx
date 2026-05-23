import { BrandedPageLoader } from "@/components/ui/premium-loader";
import { getLearnerShellMarketingBundle } from "@/lib/learner/learner-marketing-server";

export default async function LearnerLoading() {
  const { t } = await getLearnerShellMarketingBundle();
  return (
    <BrandedPageLoader message={t("learner.loading.app")} tall>
      <div className="space-y-6" aria-hidden>
        <div className="flex items-center gap-3">
          <div className="nn-skeleton nn-skeleton-fade h-11 w-11 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="nn-skeleton nn-skeleton-fade h-3 w-32 rounded-md" />
            <div className="nn-skeleton nn-skeleton-fade h-5 w-full max-w-sm rounded-md" />
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="nn-skeleton nn-skeleton-fade h-2.5 w-full rounded-full" />
          <div className="nn-skeleton nn-skeleton-fade h-2.5 w-[90%] rounded-full" />
          <div className="nn-skeleton nn-skeleton-fade h-2.5 w-[76%] rounded-full" />
        </div>
      </div>
    </BrandedPageLoader>
  );
}
