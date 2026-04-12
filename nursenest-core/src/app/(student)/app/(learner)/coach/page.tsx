/**
 * Adaptive Study Coach page — /app/coach
 *
 * Loads all coach data server-side (fast initial render), then renders:
 *   1. AdaptiveCoachHero (exam countdown + readiness + forecast)
 *   2. AdaptiveCoachSummary (1–2 sentence interpretation)
 *   3. ExamDateEditor (set/edit/remove exam date)
 *   4. PassReadinessCard (forecast with disclaimer)
 *   5. DailyStudyPlanCard (today's ordered blocks)
 *   6. WeeklyStudyPlanSection (week overview)
 *   7. BenchmarkPercentileCard (threshold-gated)
 *
 * Performance: all primary data loads server-side. Page is fast.
 * The ExamDateEditor is client-side (uses fetch), but non-blocking.
 */

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
import { loadCoachPageData } from "@/lib/study/coach-page-data";
import { AdaptiveCoachHero } from "@/components/study/adaptive-coach-hero";
import { AdaptiveCoachSummary } from "@/components/study/adaptive-coach-summary";
import { ExamDateEditor } from "@/components/study/exam-date-editor";
import { PassReadinessCard } from "@/components/study/pass-readiness-card";
import { DailyStudyPlanCard } from "@/components/study/daily-study-plan-card";
import { WeeklyStudyPlanSection } from "@/components/study/weekly-study-plan-section";
import { BenchmarkPercentileCard } from "@/components/study/benchmark-percentile-card";
import {
  BROWSE_LESSONS_CTA,
  OPEN_STUDY_HUB_CTA,
  PRIMARY_CTA,
  SIGN_IN_CTA,
  VIEW_PRICING_CTA,
} from "@/lib/copy/cta-copy";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Study Coach — NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/coach", routeGroup: "student.learner.coach" },
  );
}

export default async function CoachPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs("Study Coach");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Adaptive Study Coach"
          body="Sign in to access your personalized study coach."
          primaryCta={{
            label: SIGN_IN_CTA,
            href: loginWithCallback("/app/coach"),
            variant: "primary",
          }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/lessons", variant: "secondary" }]}
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
          headline="Adaptive Study Coach"
          body="We could not verify your subscription status. Please try again."
          tone="default"
          primaryCta={{ label: OPEN_STUDY_HUB_CTA, href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/lessons", variant: "secondary" }]}
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
          headline="Adaptive Study Coach"
          body="The full study coach is available with a NurseNest subscription."
          tone="locked"
          primaryCta={{ label: VIEW_PRICING_CTA, href: "/pricing", variant: "primary" }}
          secondaryCtas={[
            { label: OPEN_STUDY_HUB_CTA, href: "/app", variant: "secondary" },
            { label: "Study Plan", href: "/app/study-plan", variant: "secondary" },
          ]}
          visualLayout="stack"
          ctaLayout="stack"
        />
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  // Load all coach data server-side (bounded queries)
  const coachData = await loadCoachPageData(userId, entitlement);

  if (!coachData) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />

        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">
            Adaptive Study Coach
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
            Start studying to generate your personalized coaching plan.
          </p>
        </div>

        <ExamDateEditor />

        <div
          className="rounded-2xl px-6 py-8 text-center"
          style={{ border: "1px solid var(--semantic-border-soft)" }}
        >
          <p className="text-sm" style={{ color: "var(--semantic-text-muted)" }}>
            Complete practice sessions and lessons to generate your adaptive coach plan.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <a
              href="/app/practice"
              className="rounded-xl px-5 py-2 text-sm font-semibold"
              style={{
                background: "var(--semantic-brand)",
                color: "var(--semantic-surface, white)",
              }}
            >
              {PRIMARY_CTA}
            </a>
          </div>
        </div>
      </main>
    );
  }

  const { readiness, adaptive, passReadiness, benchmark, daysUntilExam, examDatePlanType, streakDays, overallAccuracyPct } = coachData;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />

      {/* Page header */}
      <div className="nn-learner-page-hero">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">
          Adaptive Study Coach
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          A personalized plan that evolves as you study — built on your strengths, gaps, and exam timeline.
        </p>
      </div>

      {/* 1 — Hero: countdown + readiness + forecast + CTA row */}
      <AdaptiveCoachHero
        readiness={readiness}
        passReadiness={passReadiness}
        daysUntilExam={daysUntilExam}
        examDatePlanType={examDatePlanType}
        streakDays={streakDays}
        overallAccuracyPct={overallAccuracyPct}
      />

      {/* 2 — Coach interpretation (1–2 sentences) */}
      <AdaptiveCoachSummary
        adaptive={adaptive}
        passReadiness={passReadiness}
        daysUntilExam={daysUntilExam}
      />

      {/* Two-column: exam date + pass readiness */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 3 — Exam date editor */}
        <ExamDateEditor
          initialData={{
            examDate: coachData.examDate,
            examDatePlanType: coachData.examDatePlanType,
          }}
        />

        {/* 4 — Pass readiness card */}
        <PassReadinessCard forecast={passReadiness} />
      </div>

      {/* 5 — Daily study plan */}
      <DailyStudyPlanCard
        primaryNext={adaptive.primaryNext}
        secondary={adaptive.secondary}
        todayFocus={adaptive.todayFocus}
      />

      {/* 6 — Weekly overview */}
      <WeeklyStudyPlanSection
        adaptive={{
          trajectory: adaptive.trajectory,
          weeklyPriorities: adaptive.weeklyPriorities,
          weakTop3: adaptive.weakTop3,
          planTrack: adaptive.planTrack,
        }}
        daysUntilExam={daysUntilExam}
      />

      {/* 7 — Benchmark (threshold-gated) */}
      <BenchmarkPercentileCard benchmark={benchmark} />

      {/* Footer quick links */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-2xl px-5 py-4"
        style={{
          background: "color-mix(in srgb, var(--semantic-border-soft) 20%, transparent)",
          border: "1px solid var(--semantic-border-soft)",
        }}
      >
        <p
          className="mr-2 text-xs font-semibold"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Study tools:
        </p>
        {[
          { label: "Adaptive Engine", href: "/app/study-coach" },
          { label: "Study Plan", href: "/app/study-plan" },
          { label: "Review Queue", href: "/app/review" },
          { label: "Analytics", href: "/app/account/analytics" },
          { label: "Flashcards", href: "/app/flashcards" },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-75"
            style={{
              background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
              color: "var(--semantic-brand)",
              border: "1px solid color-mix(in srgb, var(--semantic-brand) 18%, transparent)",
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </main>
  );
}
