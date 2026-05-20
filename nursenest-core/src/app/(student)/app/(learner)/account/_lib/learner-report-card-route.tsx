import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import {
  LearnerAccountShell,
  LearnerCategoryProgressGrid,
  LearnerProfileSummaryCard,
  LearnerReportCardHero,
} from "@/components/learner-account-ui";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerPerformanceWorkspaceNav } from "@/components/student/learner-performance-workspace-nav";
import { LearnerReportCardPremium } from "@/components/student/learner-report-card-premium";
import { LearnerSilentSectionDegradedFallback } from "@/components/student/learner-silent-section-degraded-fallback";
import { MedCalcReportCardInset } from "@/components/med-calculations/med-calc-report-card-inset";
import { StudyToolsReportCardInset } from "@/components/study-tools/study-tools-report-card-inset";
import { VerifiedStudyReportCardDigest } from "@/components/verified-study/verified-study-report-card-digest";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { aggregateTopicsByCanonicalStudyCategory } from "@/lib/learner/learner-account-category-aggregate";
import { loadReportCardData } from "@/lib/learner/load-report-card-data";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export async function LearnerReportCardRouteBody({
  t,
  locale,
  sessionLabel,
  navPathname,
  signInReturnPath,
  breadcrumbLeaf,
}: {
  t: LearnerMarketingT;
  locale: string;
  sessionLabel: string;
  navPathname: string;
  signInReturnPath: string;
  breadcrumbLeaf: string;
}) {
  const session = await getProtectedRouteSession(sessionLabel);
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appAccountBreadcrumbs(breadcrumbLeaf);
  const localeTag = locale.replace(/_/g, "-");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
        <PremiumEmptyState
          headline={t("learner.account.reportCard.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback(signInReturnPath), variant: "primary" }}
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
        <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
        <LearnerPerformanceWorkspaceNav t={t} pathname={navPathname} />
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
        <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
        <LearnerPerformanceWorkspaceNav t={t} pathname={navPathname} />
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
  const reportCategoryItems = report
    ? aggregateTopicsByCanonicalStudyCategory(preferredPathwayId, [
        ...report.weakTopics.map((w) => ({ topic: w.topic, weight: Math.max(1, w.attempted) })),
        ...report.strongTopics.map((s) => ({ topic: s.topic, weight: Math.max(1, s.attempted) })),
      ])
    : [];

  if (!report || report.degraded?.active) {
    return (
      <LearnerAccountShell
        className="py-2 nn-learner-report-card-convergence"
        data-nn-learner-report-card-convergence=""
      >
        <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
        <LearnerPerformanceWorkspaceNav t={t} pathname={navPathname} />
        <LearnerReportCardHero title={t("learner.account.reportCard.title")} intro={t("learner.account.reportCard.intro")} />
        <StudyToolsReportCardInset userId={userId} />
        <MedCalcReportCardInset userId={userId} />
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
        <p className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-muted-foreground">
          {t("learner.account.report.emptyHint")}
        </p>
        <LearnerAccountCrossLinks variant="report-card" t={t} weakTopicKey={weakTopicKey} pathwayId={preferredPathwayId} />
      </LearnerAccountShell>
    );
  }

  return (
    <LearnerAccountShell
      className="py-2 nn-learner-report-card-convergence"
      data-nn-learner-report-card-convergence=""
    >
      <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
      <LearnerPerformanceWorkspaceNav t={t} pathname={navPathname} />
      <LearnerReportCardHero title={t("learner.account.reportCard.title")} intro={t("learner.account.reportCard.intro")} />

      <StudyToolsReportCardInset userId={userId} />
      <MedCalcReportCardInset userId={userId} />
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
