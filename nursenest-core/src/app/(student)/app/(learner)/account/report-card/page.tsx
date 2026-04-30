import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import {
  LearnerAccountShell,
  LearnerCategoryProgressGrid,
  LearnerProfileSummaryCard,
  LearnerReportCardHero,
} from "@/components/learner-account-ui";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerPerformanceWorkspaceNav } from "@/components/student/learner-performance-workspace-nav";
import { LearnerReportCardPremium } from "@/components/student/learner-report-card-premium";
import { LearnerSilentSectionDegradedFallback } from "@/components/student/learner-silent-section-degraded-fallback";
import { StudyToolsReportCardInset } from "@/components/study-tools/study-tools-report-card-inset";
import { VerifiedStudyReportCardDigest } from "@/components/verified-study/verified-study-report-card-digest";
import { LearnerStudyQuickLinksCard } from "@/components/student/learner-study-quick-links-card";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { aggregateTopicsByCanonicalStudyCategory } from "@/lib/learner/learner-account-category-aggregate";
import { loadReportCardData } from "@/lib/learner/load-report-card-data";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";
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
  const session = await getProtectedRouteSession("(student).app.(learner).account.report-card");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.reportCard"));
  const localeTag = locale.replace(/_/g, "-");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  if (entitlement === "error") {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <LearnerPerformanceWorkspaceNav t={t} pathname="/app/account/report-card" />
        <PremiumEmptyState
          headline={t("learner.account.reportCard.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <LearnerPerformanceWorkspaceNav t={t} pathname="/app/account/report-card" />
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
      </div>
    );
  }

  const report = await loadReportCardData(userId, entitlement);
  const weakTopicKey =
    report?.weakTopics[0]?.normalizedTopic?.trim() ||
    report?.weakTopics[0]?.topic?.trim() ||
    report?.recommendedQuizTopic?.trim() ||
    undefined;
  const preferredPathwayId =
    report?.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? report?.pathways[0]?.pathwayId ?? null;
  const catHref = resolveStudyLoopCatHref({
    authState: "signed_in",
    pathwayId: preferredPathwayId,
    availablePathwayIds: report?.pathways.map((p) => p.pathwayId),
    intent: "start",
  });

  const reportCategoryItems = report
    ? aggregateTopicsByCanonicalStudyCategory(preferredPathwayId, [
        ...report.weakTopics.map((w) => ({ topic: w.topic, weight: Math.max(1, w.attempted) })),
        ...report.strongTopics.map((s) => ({ topic: s.topic, weight: Math.max(1, s.attempted) })),
      ])
    : [];

  if (!report || report.degraded?.active) {
    return (
      <LearnerAccountShell className="py-2">
        <BreadcrumbTrail items={crumbs} />
        <LearnerPerformanceWorkspaceNav t={t} pathname="/app/account/report-card" />
        <LearnerReportCardHero title={t("learner.account.reportCard.title")} intro={t("learner.account.reportCard.intro")} />
        <LearnerStudyQuickLinksCard t={t} id="report-card-study-quick-links" catHref={catHref} />
        <StudyToolsReportCardInset userId={userId} />
        <VerifiedStudyReportCardDigest userId={userId} />
        {report ? (
          <LearnerProfileSummaryCard
            title={t("learner.profile.categoryProgress.title")}
            subtitle={t("learner.profile.categoryProgress.subtitle")}
          >
            <LearnerCategoryProgressGrid items={reportCategoryItems} emptyHint={t("learner.profile.categoryProgress.empty")} />
          </LearnerProfileSummaryCard>
        ) : null}
        <LearnerSilentSectionDegradedFallback surfaceName="report-card" />
        <LearnerAccountCrossLinks variant="report-card" t={t} weakTopicKey={weakTopicKey} pathwayId={preferredPathwayId} />
      </LearnerAccountShell>
    );
  }

  return (
    <LearnerAccountShell className="py-2">
      <BreadcrumbTrail items={crumbs} />
      <LearnerPerformanceWorkspaceNav t={t} pathname="/app/account/report-card" />
      <LearnerReportCardHero title={t("learner.account.reportCard.title")} intro={t("learner.account.reportCard.intro")} />

      <LearnerStudyQuickLinksCard t={t} id="report-card-study-quick-links" catHref={catHref} />

      <StudyToolsReportCardInset userId={userId} />
      <VerifiedStudyReportCardDigest userId={userId} />

      <LearnerProfileSummaryCard
        title={t("learner.profile.categoryProgress.title")}
        subtitle={t("learner.profile.categoryProgress.subtitle")}
      >
        <LearnerCategoryProgressGrid items={reportCategoryItems} emptyHint={t("learner.profile.categoryProgress.empty")} />
      </LearnerProfileSummaryCard>

      <LearnerReportCardPremium data={report} t={t} localeTag={localeTag} />

      <LearnerAccountCrossLinks variant="report-card" t={t} weakTopicKey={weakTopicKey} pathwayId={preferredPathwayId} />
    </LearnerAccountShell>
  );
}
