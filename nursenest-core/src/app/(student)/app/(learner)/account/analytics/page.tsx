import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadAnalyticsPagePayload } from "@/lib/study/analytics-data";
import { AnalyticsHero } from "@/components/study/analytics-hero";
import { AnalyticsSummaryCards } from "@/components/study/analytics-summary-cards";
import { AnalyticsDetailClient } from "./analytics-detail-client";
import {
  BROWSE_LESSONS_CTA,
  OPEN_STUDY_HUB_CTA,
  SIGN_IN_CTA,
  VIEW_PRICING_CTA,
} from "@/lib/copy/cta-copy";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Analytics — NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/account/analytics", routeGroup: "student.learner.account_analytics" },
  );
}

export default async function AccountAnalyticsPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).account.analytics");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs("Analytics");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Analytics"
          body="Sign in to access your performance analytics."
          primaryCta={{
            label: SIGN_IN_CTA,
            href: loginWithCallback("/app/account/analytics"),
            variant: "primary",
          }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Analytics"
          body="We could not verify your subscription status. Please try again."
          tone="default"
          primaryCta={{ label: OPEN_STUDY_HUB_CTA, href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/lessons", variant: "secondary" }]}
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
        <PremiumEmptyState
          headline="Analytics"
          body="Deeper analytics are available with a NurseNest subscription."
          tone="locked"
          primaryCta={{ label: VIEW_PRICING_CTA, href: "/pricing", variant: "primary" }}
          secondaryCtas={[{ label: OPEN_STUDY_HUB_CTA, href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  // Load summary + trend window — fast initial queries
  const payload = await loadAnalyticsPagePayload(userId);
  const {
    summary,
    trendWindow,
    hasMorTrend,
    trendCursor,
    initialTopicRows,
    questionTypeRows,
    confidenceScatterPoints,
  } = payload;

  const noAnalyticsYet =
    summary.totalQuestionsAnswered === 0 &&
    summary.studySessionCount === 0 &&
    summary.catSessionCount === 0;
  const analyticsIntro = emptyStateCopy.noAnalyticsYet();

  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={crumbs} />

      {/* Page header */}
      <div className="nn-learner-page-hero">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Analytics</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Understand what you know, where you struggle, and how your readiness is evolving.
        </p>
      </div>

      {noAnalyticsYet ? (
        <PremiumEmptyState
          data-nn-empty="account-analytics-quiet"
          brandMark="leaf"
          tone="early"
          density="compact"
          headline={analyticsIntro.headline}
          body={analyticsIntro.body}
          hint={analyticsIntro.hint}
          primaryCta={{ label: "Open question bank", href: "/app/questions", variant: "primary" }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/app/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      ) : (
        <>
          <AnalyticsHero
            latestReadinessScore={summary.latestReadinessScore}
            latestReadinessBand={summary.latestReadinessBand}
            streakDays={summary.streakDays}
            studySessionCount={summary.studySessionCount}
            catSessionCount={summary.catSessionCount}
          />
          <AnalyticsSummaryCards
            totalQuestionsAnswered={summary.totalQuestionsAnswered}
            overallAccuracyPct={summary.overallAccuracyPct}
            streakDays={summary.streakDays}
            latestReadinessScore={summary.latestReadinessScore}
            topicRows={initialTopicRows}
          />
        </>
      )}

      {/*
        3–7: Trend, Time, Confidence, Topics, Next Steps
        Client component loads detail panels after mount (lazy).
        No blocking — summary + cards render server-side.
      */}
      <AnalyticsDetailClient
        summary={summary}
        initialTrendPoints={trendWindow}
        hasMorTrend={hasMorTrend}
        trendCursor={trendCursor}
        questionTypeRows={questionTypeRows}
        initialTopicRows={initialTopicRows}
        confidenceScatterPoints={confidenceScatterPoints}
      />
    </div>
  );
}
