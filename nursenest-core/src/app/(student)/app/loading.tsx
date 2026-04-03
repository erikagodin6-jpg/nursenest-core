import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

export default async function LearnerLoading() {
  const { t } = await getLearnerMarketingBundle();
  return (
    <div className="nn-card p-6">
      <p className="text-sm text-muted">{t("learner.loading.app")}</p>
    </div>
  );
}
