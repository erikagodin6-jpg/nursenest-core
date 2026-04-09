import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

export default async function LearnerSectionLoading() {
  const { t } = await getLearnerMarketingBundle();
  return (
    <div className="nn-card overflow-hidden p-5 sm:p-6" aria-busy="true" aria-label={t("learner.loading.section")}>
      <div className="flex items-center gap-3">
        <div className="nn-skeleton h-12 w-12 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="nn-skeleton h-3 w-28 rounded-md" />
          <div className="nn-skeleton h-5 w-full max-w-md rounded-md" />
          <div className="nn-skeleton h-3 w-full max-w-lg rounded-md" />
        </div>
      </div>
      <div className="mt-8 space-y-3">
        <div className="nn-skeleton h-2.5 w-full rounded-full" />
        <div className="nn-skeleton h-2.5 w-[88%] rounded-full" />
        <div className="nn-skeleton h-2.5 w-[72%] rounded-full" />
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="nn-skeleton h-24 rounded-xl" />
        <div className="nn-skeleton h-24 rounded-xl" />
      </div>
      <p className="mt-6 text-center text-xs text-[var(--semantic-text-muted)]">{t("learner.loading.section")}</p>
    </div>
  );
}
