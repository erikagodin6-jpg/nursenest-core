import type { Metadata } from "next";
import { auth } from "@/lib/auth";
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
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs("Analytics");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Analytics"
          body="Sign in to access your performance analytics."
          primaryCta={{
            label: "Sign in",
            href: loginWithCallback("/app/account/analytics"),
            variant: "primary",
          }}
          secondaryCtas={[{ label: "Browse lessons", href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Analytics"
          body="We could not verify your subscription status. Please try again."
          tone="default"
          primaryCta={{ label: "Open Study Hub", href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: "Browse lessons", href: "/lessons", variant: "secondary" }]}
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
          headline="Analytics"
          body="Deeper analytics are available with a NurseNest subscription."
          tone="locked"
          primaryCta={{ label: "View plans", href: "/pricing", variant: "primary" }}
          secondaryCtas={[{ label: "Open Study Hub", href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  // Load summary + trend window — fast initial queries
  const payload = await loadAnalyticsPagePayload(userId);
  const { summary, trendWindow, hasMorTrend, trendCursor } = payload;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />

      {/* Page header */}
      <div className="nn-learner-page-hero">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Analytics</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Understand what you know, where you struggle, and how your readiness is evolving.
        </p>
      </div>

      {/* 1 — Hero (surface-emphasis) */}
      <AnalyticsHero
        latestReadinessScore={summary.latestReadinessScore}
        latestReadinessBand={summary.latestReadinessBand}
        streakDays={summary.streakDays}
        studySessionCount={summary.studySessionCount}
        catSessionCount={summary.catSessionCount}
      />

      {/* 2 — Summary cards (mixed soft surfaces) */}
      <AnalyticsSummaryCards
        totalQuestionsAnswered={summary.totalQuestionsAnswered}
        overallAccuracyPct={summary.overallAccuracyPct}
        streakDays={summary.streakDays}
        latestReadinessScore={summary.latestReadinessScore}
        topicRows={[]}
      />

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
      />
    </main>
  );
}
