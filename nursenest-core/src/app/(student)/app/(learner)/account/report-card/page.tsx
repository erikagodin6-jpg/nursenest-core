import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerReportCardPremium } from "@/components/student/learner-report-card-premium";
import { LearnerStudyQuickLinksCard } from "@/components/student/learner-study-quick-links-card";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadReportCardData } from "@/lib/learner/load-report-card-data";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { resolveStudySurfaceCatHref } from "@/lib/exam-pathways/pathway-cat-flow";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

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
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.reportCard.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/report-card"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  if (entitlement === "error") {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.reportCard.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.reportCard.title")}
          body={t("learner.account.reportCard.lockedBody")}
          hint={emptyStateCopy.entitlementLocked.body}
          tone="locked"
          primaryCta={{ label: t("cta.continuePlan"), href: "/pricing", variant: "primary" }}
          secondaryCtas={[{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
        <SubscriptionPaywall context="exams" />
        <Link href="/pricing" className="nn-premium-action-chip inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary">
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
        <PremiumEmptyState
          headline={t("learner.account.reportCard.title")}
          body={t("learner.reportCard.loadFailed")}
          tone="default"
          primaryCta={{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: t("learner.account.nav.overview"), href: "/app/account/overview", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  const weakTopicKey =
    report.weakTopics[0]?.normalizedTopic?.trim() ||
    report.weakTopics[0]?.topic?.trim() ||
    report.recommendedQuizTopic?.trim() ||
    undefined;
  const preferredPathwayId =
    report.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? report.pathways[0]?.pathwayId ?? null;
  const catHref = resolveStudySurfaceCatHref({
    pathwayId: preferredPathwayId,
    availablePathwayIds: report.pathways.map((p) => p.pathwayId),
  });

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div className="nn-learner-page-hero">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">{t("learner.account.reportCard.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">{t("learner.account.reportCard.intro")}</p>
      </div>

      <LearnerStudyQuickLinksCard t={t} id="report-card-study-quick-links" catHref={catHref} />

      <LearnerReportCardPremium data={report} t={t} localeTag={localeTag} />

      <LearnerAccountCrossLinks variant="report-card" t={t} weakTopicKey={weakTopicKey} pathwayId={preferredPathwayId} />
    </main>
  );
}
