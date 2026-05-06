import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCenterOverview } from "@/components/student/learner-account-center-overview";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountHubBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.center.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account", routeGroup: "student.learner.account_hub" },
  );
}

export default async function LearnerAccountIndexPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={appAccountHubBreadcrumbs()} />
      <LearnerAccountCenterOverview t={t} locale={locale} />
    </div>
  );
}
