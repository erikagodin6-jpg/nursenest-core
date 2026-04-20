import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountHub } from "@/components/student/learner-account-hub";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountHubBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.menu.accountHub"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account", routeGroup: "student.learner.account_hub" },
  );
}

export default async function LearnerAccountIndexPage() {
  const { t } = await getLearnerMarketingBundle();
  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={appAccountHubBreadcrumbs()} />
      <LearnerAccountHub t={t} />
    </div>
  );
}
