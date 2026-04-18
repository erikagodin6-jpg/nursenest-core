import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { LearnerSilentSectionDegradedFallback } from "@/components/student/learner-silent-section-degraded-fallback";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadMotivationPayload } from "@/lib/study/motivation-data";
import { StudyStreakCard } from "@/components/study/study-streak-card";
import { TopicProgressGrid } from "@/components/study/topic-progress-grid";
import { ReadinessProgressCard } from "@/components/study/readiness-progress-card";
import { MilestoneCard } from "@/components/study/milestone-card";
import { loadMoreTopicsAction } from "./actions";
import {
  BROWSE_LESSONS_CTA,
  OPEN_STUDY_HUB_CTA,
  SIGN_IN_CTA,
  VIEW_PRICING_CTA,
} from "@/lib/copy/cta-copy";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Progress & Motivation — NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/account/motivation", routeGroup: "student.learner.account_motivation" },
  );
}

export default async function AccountMotivationPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).account.motivation");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs("Progress");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Progress & Motivation"
          body="Sign in to see your study streak, topic progress, and readiness evolution."
          primaryCta={{
            label: SIGN_IN_CTA,
            href: loginWithCallback("/app/account/motivation"),
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
          headline="Progress & Motivation"
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
          headline="Progress & Motivation"
          body="Detailed progress tracking is available with a NurseNest subscription."
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

  // Server-side: load all motivation data (bounded queries)
  const payload = await loadMotivationPayload(userId);

  if (payload.degraded?.active) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">
            Progress
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
            Track your consistency, topic mastery, and readiness evolution over time.
          </p>
        </div>
        <LearnerSilentSectionDegradedFallback surfaceName="motivation" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={crumbs} />

      {/* Page header */}
      <div className="nn-learner-page-hero">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">
          Progress
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Track your consistency, topic mastery, and readiness evolution over time.
        </p>
      </div>

      {/*
        Top row: streak card + milestone card
        Two-column on desktop, stacked on mobile
      */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 1 — Study streak (surface-soft-a + brand) */}
        <StudyStreakCard
          streakDays={payload.streakDays}
          lastActiveDaysAgo={payload.lastActiveDaysAgo}
          weeklyActivity={payload.weeklyActivity}
        />

        {/* 2 — Readiness progress (surface-soft-b + band accent) */}
        <ReadinessProgressCard recentReadiness={payload.recentReadiness} />
      </div>

      {/* 3 — Milestones (surface-soft-c) */}
      {payload.milestones.length > 0 && (
        <MilestoneCard milestones={payload.milestones} />
      )}

      {/* 4 — Topic progress grid (paginated) */}
      <TopicProgressGrid
        initialRows={payload.topicRows}
        topicTotal={payload.topicTotal}
        hasMoreTopics={payload.hasMoreTopics}
        onLoadMore={loadMoreTopicsAction}
      />

      {/* Footer context: quick links to other study tools */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-2xl px-5 py-4"
        style={{
          background:
            "color-mix(in srgb, var(--semantic-border-soft) 20%, transparent)",
          border: "1px solid var(--semantic-border-soft)",
        }}
      >
        <p
          className="mr-2 text-xs font-semibold"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Continue studying:
        </p>
        {[
          { label: "Review queue", href: "/app/review" },
          { label: "Analytics", href: "/app/account/analytics" },
          { label: "Guided study", href: "/app/guided" },
          { label: "Practice", href: "/app/practice" },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-75"
            style={{
              background:
                "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
              color: "var(--semantic-brand)",
              border:
                "1px solid color-mix(in srgb, var(--semantic-brand) 18%, transparent)",
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
