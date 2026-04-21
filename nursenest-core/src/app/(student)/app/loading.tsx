import { getLearnerShellMarketingBundle } from "@/lib/learner/learner-marketing-server";

export default async function LearnerLoading() {
  const { t } = await getLearnerShellMarketingBundle();
  return (
    <div className="nn-card overflow-hidden p-6" aria-busy="true" aria-label={t("learner.loading.app")}>
      <div className="flex items-center gap-3">
        <div className="nn-skeleton nn-skeleton-fade h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="nn-skeleton nn-skeleton-fade h-3 w-32 rounded-md" />
          <div className="nn-skeleton nn-skeleton-fade h-5 w-full max-w-sm rounded-md" />
        </div>
      </div>
      <div className="mt-8 space-y-2.5">
        <div className="nn-skeleton nn-skeleton-fade h-2.5 w-full rounded-full" />
        <div className="nn-skeleton nn-skeleton-fade h-2.5 w-[90%] rounded-full" />
        <div className="nn-skeleton nn-skeleton-fade h-2.5 w-[76%] rounded-full" />
      </div>
      <p className="mt-6 text-center text-xs text-[var(--semantic-text-muted)]">{t("learner.loading.app")}</p>
    </div>
  );
}
