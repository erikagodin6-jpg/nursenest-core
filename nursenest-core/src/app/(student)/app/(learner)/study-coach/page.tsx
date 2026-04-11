/**
 * /app/study-coach — Premium Adaptive Study Engine
 *
 * A new, richer dashboard layered on top of the existing coach data.
 * Adds: time-budget planner, body-system weak area tabs, speed/consistency
 * analysis, probability uplift ranking, and a behind-schedule alert.
 *
 * All primary data: server-side (fast initial render, no layout shift).
 * Interactive widgets: client components (StudyTimeBudgetCard, WeakAreaDimensionsTabs).
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
import { loadAdaptiveEngineData } from "@/lib/study/adaptive-engine/adaptive-engine-data";
import { buildRecoveryRecommendations } from "@/lib/learner/exam-plan-engine";
import { urgencyFromDays } from "@/lib/learner/exam-timeline";
import { ExamDateEditor } from "@/components/study/exam-date-editor";
import { AdaptiveEngineHero } from "@/components/study/adaptive-engine-hero";
import { StudyTimeBudgetCard } from "@/components/study/study-time-budget-card";
import { WeakAreaDimensionsTabs } from "@/components/study/weak-area-dimensions-tabs";
import { ProbabilityUpliftCard } from "@/components/study/probability-uplift-card";
import { AdaptiveDailyPlanCard } from "@/components/study/adaptive-daily-plan-card";
import { BehindScheduleAlert } from "@/components/study/behind-schedule-alert";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Adaptive Study Coach — NurseNest",
      description:
        "A premium, always-current study plan that continuously adapts to your strengths, weak areas, and exam timeline.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/study-coach", routeGroup: "student.learner.study-coach" },
  );
}

export default async function StudyCoachPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs("Adaptive Study Coach");

  // ── Auth / DB guard ────────────────────────────────────────────────────────
  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Adaptive Study Coach"
          body="Sign in to access your personalised, always-current study plan."
          primaryCta={{
            label: "Sign in",
            href: loginWithCallback("/app/study-coach"),
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
          headline="Adaptive Study Coach"
          body="We couldn't verify your subscription status. Please try again."
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
          headline="Adaptive Study Coach"
          body="The adaptive study engine is part of a NurseNest subscription."
          tone="locked"
          primaryCta={{ label: "View plans", href: "/pricing", variant: "primary" }}
          secondaryCtas={[
            { label: "Open Study Hub", href: "/app", variant: "secondary" },
            { label: "Study Plan", href: "/app/study-plan", variant: "secondary" },
          ]}
          visualLayout="stack"
          ctaLayout="stack"
        />
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  // ── Load all adaptive engine data (server-side, bounded) ──────────────────
  const data = await loadAdaptiveEngineData(userId, entitlement);

  if (!data) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            Adaptive Study Coach
          </h1>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
            Complete a few practice sessions and lessons to generate your personalised adaptive plan.
          </p>
        </div>
        <ExamDateEditor />
        <div
          className="rounded-2xl px-6 py-8 text-center"
          style={{ border: "1px solid var(--semantic-border-soft)" }}
        >
          <p className="text-sm" style={{ color: "var(--semantic-text-muted)" }}>
            Your plan updates automatically after every quiz, CAT, and lesson assessment.
          </p>
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            <a
              href="/app/questions"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold"
              style={{ background: "var(--accent-primary)", color: "#fff" }}
            >
              Start practising
            </a>
            <a
              href="/app/lessons"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold"
              style={{
                background: "color-mix(in srgb, var(--accent-primary) 10%, var(--bg-card))",
                border: "1px solid color-mix(in srgb, var(--accent-primary) 22%, var(--border-subtle))",
                color: "var(--accent-primary)",
              }}
            >
              Browse lessons
            </a>
          </div>
        </div>
      </main>
    );
  }

  const {
    adaptive,
    passReadiness,
    timeBudget,
    weakAreaDimensions,
    uplift,
    dailyStudyMinutes,
    daysUntilExam,
    readiness,
    streakDays,
  } = data;

  // ── Recovery recommendations (when behind) ────────────────────────────────
  const planTrack = adaptive.planTrack;
  const isBehind = planTrack.status !== "on_track";

  const recoveryRecs = isBehind
    ? buildRecoveryRecommendations({
        daysRemaining: daysUntilExam,
        daysDelta: null,
        urgency: urgencyFromDays(daysUntilExam),
        readiness,
        mockCount: data.catSessionCount,
        streakDays,
        weakTopics: [], // buildRecoveryRecommendations uses weakTopics for extra context
        lessonPct: 0,
      })
    : [];

  const primaryAction = adaptive.primaryNext;
  const secondaryAction = adaptive.secondary[0] ?? null;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />

      {/* Page title */}
      <div className="nn-learner-page-hero">
        <h1 className="text-2xl font-bold" style={{ color: "var(--semantic-text-primary)" }}>
          Adaptive Study Coach
        </h1>
        <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
          Your plan adjusts automatically after every quiz, CAT, and lesson — always optimised for your exam date and weak areas.
        </p>
      </div>

      {/* 1 — Hero: readiness gauge + exam countdown + key stats + CTAs */}
      <AdaptiveEngineHero
        coach={data}
        passReadiness={passReadiness}
        timeBudget={timeBudget}
      />

      {/* 2 — Behind-schedule alert (conditional) */}
      {isBehind && (
        <BehindScheduleAlert
          assessment={planTrack}
          recoveryRecommendations={recoveryRecs}
        />
      )}

      {/* 3 — Two-column: Time budget (interactive) + Exam date */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StudyTimeBudgetCard
          timeBudget={timeBudget}
          currentDailyMinutes={dailyStudyMinutes}
          currentCadence={data.adaptive.planTrack.status === "on_track" ? null : null}
        />
        <ExamDateEditor
          initialData={{
            examDate: data.examDate,
            examDatePlanType: data.examDatePlanType,
          }}
        />
      </div>

      {/* 4 — Today's adaptive plan (time-blocked) */}
      <AdaptiveDailyPlanCard
        timeBudget={timeBudget}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
      />

      {/* 5 — Probability uplift opportunities */}
      <ProbabilityUpliftCard uplift={uplift} />

      {/* 6 — Weak area dimensions (tabbed: body system / cognitive / speed) */}
      <WeakAreaDimensionsTabs dimensions={weakAreaDimensions} />

      {/* Footer quick links */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-2xl px-5 py-4"
        style={{
          background: "color-mix(in srgb, var(--semantic-border-soft) 20%, transparent)",
          border: "1px solid var(--semantic-border-soft)",
        }}
      >
        <p className="mr-2 text-xs font-semibold" style={{ color: "var(--semantic-text-muted)" }}>
          Related:
        </p>
        {[
          { label: "Study Coach", href: "/app/coach" },
          { label: "Exam Plan", href: "/app/exam-plan" },
          { label: "Review Queue", href: "/app/review" },
          { label: "Flashcards", href: "/app/flashcards" },
          { label: "Analytics", href: "/app/account/analytics" },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-75"
            style={{
              background: "color-mix(in srgb, var(--accent-primary) 10%, var(--bg-card))",
              color: "var(--accent-primary)",
              border: "1px solid color-mix(in srgb, var(--accent-primary) 18%, var(--border-subtle))",
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </main>
  );
}
