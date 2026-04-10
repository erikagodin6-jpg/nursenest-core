import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerReportCardPremium } from "@/components/student/learner-report-card-premium";
import { LearnerStudyQuickLinksCard } from "@/components/student/learner-study-quick-links-card";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadReportCardData } from "@/lib/learner/load-report-card-data";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.reportCard.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/report-card", routeGroup: "student.learner.account_report_card" },
  );
}

export default async function AccountReportCardPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.reportCard"));
  const localeTag = locale.replace(/_/g, "-");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
      </main>
    );
  }

  if (entitlement === "error") {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">{t("learner.account.reportCard.title")}</h1>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.account.reportCard.lockedBody")}</p>
        </div>
        <SubscriptionPaywall context="exams" />
        <Link href="/pricing" className="inline-flex text-sm font-semibold text-primary underline">
          {t("learner.profile.cta.plansPricing")}
        </Link>
      </main>
    );
  }

  const report = await loadReportCardData(userId, entitlement);

  if (!report) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">{t("learner.account.reportCard.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">{t("learner.reportCard.loadFailed")}</p>
        </div>
      </main>
    );
  }

  const weakTopicKey =
    report.weakTopics[0]?.normalizedTopic?.trim() ||
    report.weakTopics[0]?.topic?.trim() ||
    report.recommendedQuizTopic?.trim() ||
    undefined;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div className="nn-learner-page-hero">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">{t("learner.account.reportCard.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">{t("learner.account.reportCard.intro")}</p>
      </div>

      <LearnerStudyQuickLinksCard t={t} id="report-card-study-quick-links" />

      <LearnerReportCardPremium data={report} t={t} localeTag={localeTag} />

      <LearnerAccountCrossLinks variant="report-card" t={t} weakTopicKey={weakTopicKey} />
    </main>
  );
}
