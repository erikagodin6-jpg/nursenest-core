import type { Metadata } from "next";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { LearnerReportCardRouteBody } from "../_lib/learner-report-card-route";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.report.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/report", routeGroup: "student.learner.account_report" },
  );
}

export default async function AccountReportPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  return (
    <LearnerReportCardRouteBody
      t={t}
      locale={locale}
      sessionLabel="(student).app.(learner).account.report"
      navPathname="/app/account/report"
      signInReturnPath="/app/account/report"
      breadcrumbLeaf={t("learner.account.nav.report")}
    />
  );
}
