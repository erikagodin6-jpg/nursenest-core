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
import { prisma } from "@/lib/db";
import { loadAnalyticsPagePayload } from "@/lib/study/analytics-data";
import { analyticsResolvedData } from "@/lib/study/analytics-load-result";
import { AnalyticsPerformanceReport } from "@/components/study/analytics-performance-report";
import { AnalyticsDetailClient } from "./analytics-detail-client";
import { loadMoreTrendData } from "./actions";
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

  const [payload, profile] = await Promise.all([
    loadAnalyticsPagePayload(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, examDate: true, examFocus: true, learnerPath: true, tier: true },
    }),
  ]);
  const {
    summary,
    trend,
    initialTopicRows,
    questionTypeRows,
    confidenceScatterPoints,
    supplemental,
    dailyActivity,
    analyticsQuality,
  } = payload;

  const displayName =
    (profile?.name ?? (session?.user as { name?: string } | undefined)?.name)?.trim() || "Learner";
  const credentialLine = (() => {
    const parts = [profile?.examFocus?.trim(), profile?.learnerPath?.trim()].filter(Boolean) as string[];
    if (parts.length > 0) return parts.join(" · ");
    return profile?.tier ? `${profile.tier.replace(/_/g, " ")} · NCLEX-style prep` : "RN / NCLEX-style prep";
  })();
  const targetExamLine =
    profile?.examDate != null
      ? `Target exam: ${profile.examDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}.`
      : null;

  const summaryData = analyticsResolvedData(summary);
  const noAnalyticsYet =
    summary.kind !== "error" &&
    summaryData != null &&
    summaryData.totalQuestionsAnswered === 0 &&
    summaryData.studySessionCount === 0 &&
    summaryData.catSessionCount === 0;
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
          <AnalyticsPerformanceReport
            displayName={displayName}
            credentialLine={credentialLine}
            targetExamLine={targetExamLine}
            summary={summary}
            trend={trend}
            supplemental={supplemental}
            dailyActivity={dailyActivity}
            initialTopicRows={initialTopicRows}
            analyticsQuality={analyticsQuality}
            onLoadMoreTrend={loadMoreTrendData}
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
        questionTypeRows={questionTypeRows}
        initialTopicRows={initialTopicRows}
        confidenceScatterPoints={confidenceScatterPoints}
      />
    </div>
  );
}
