/**
 * My Exam Plan — /app/exam-plan
 *
 * Premium personalized exam-readiness dashboard. Combines all major study
 * systems into one command center: readiness, adaptive plan, weak areas,
 * smart review, performance forecast, benchmark, weekly plan, trend, notes.
 *
 * Loading architecture:
 *   Initial (server):  hero + summary row + today's plan + weak areas +
 *                      review preview + performance row + benchmark +
 *                      weekly plan + upgrade card
 *   Lazy (client):     progress trend + notes/saved rationales
 *
 * Page order (per spec §4 — strict):
 *   1.  Hero
 *   2.  Readiness summary row
 *   3.  Today's plan
 *   4.  Weak areas
 *   5.  Smart review due now
 *   6.  Performance + forecast row
 *   7.  Benchmark block
 *   8.  Weekly plan
 *   9.  Recent progress + trend (lazy)
 *  10.  Saved for review / notes (lazy)
 *  11.  Upgrade preview (free users only)
 */

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

// ── Feature components (server) ───────────────────────────────────────────────
import { MyExamPlanHero } from "@/components/study/my-exam-plan-hero";
import { ReadinessSummaryRow } from "@/components/study/readiness-summary-row";
import { TodaysPlanSection } from "@/components/study/todays-plan-section";
import { WeakAreasImpactSection } from "@/components/study/weak-areas-impact-section";
import { ReviewDueNowCards } from "@/components/study/review-due-now-cards";
import { PerformanceForecastRow } from "@/components/study/performance-forecast-row";
import { WeeklyStudyPlanSection } from "@/components/study/weekly-study-plan-section";
import { BenchmarkPercentileCard } from "@/components/study/benchmark-percentile-card";
import { ExamDateEditor } from "@/components/study/exam-date-editor";
import { PlanRegenerateControl } from "@/components/study/plan-regenerate-control";
import { PremiumExamPlanUpgradeCard } from "@/components/study/premium-exam-plan-upgrade-card";
// ── New countdown + recovery system ───────────────────────────────────────────
import { ExamCountdownHero } from "@/components/study/exam-countdown-hero";
import { WeeklyPacingPanel } from "@/components/study/weekly-pacing-panel";
import { RecoveryPlanCard } from "@/components/study/recovery-plan-card";
import { buildPaceForecast, buildRecoveryPlan } from "@/lib/learner/recovery-planner";
import {
  BROWSE_LESSONS_CTA,
  OPEN_STUDY_HUB_CTA,
  PRIMARY_CTA,
  SIGN_IN_CTA,
} from "@/lib/copy/cta-copy";

// ── Lazy client ───────────────────────────────────────────────────────────────
import { ExamPlanLazyClient } from "./exam-plan-lazy-client";

// ── Data ──────────────────────────────────────────────────────────────────────
import { loadExamPlanPageData } from "@/lib/study/exam-plan/exam-plan-data";
import { loadExamPlanTrendAction } from "./actions";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";

// ── Breadcrumbs ───────────────────────────────────────────────────────────────

const CRUMBS = [
  { name: "Home", href: "/" as const },
  { name: "Study hub", href: "/app" as const },
  { name: "My Exam Plan", href: undefined as undefined },
];

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "My Exam Plan | NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/exam-plan", routeGroup: "student.learner.exam_plan" },
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ExamPlanPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={CRUMBS} />
        <PremiumEmptyState
          headline="My Exam Plan"
          body="Sign in to access your personalized exam readiness dashboard."
          primaryCta={{ label: SIGN_IN_CTA, href: loginWithCallback("/app/exam-plan"), variant: "primary" }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  // ── Entitlement error ─────────────────────────────────────────────────────
  if (entitlement === "error") {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={CRUMBS} />
        <PremiumEmptyState
          headline="My Exam Plan"
          body="We couldn't verify your access. Please try again."
          primaryCta={{ label: OPEN_STUDY_HUB_CTA, href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  // ── No subscription — preview mode ────────────────────────────────────────
  if (!entitlement.hasAccess) {
    const snap = await getFreemiumSnapshot(userId);
    return (
      <div className="space-y-8">
        <BreadcrumbTrail items={CRUMBS} />
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "var(--surface-emphasis, color-mix(in srgb, var(--theme-primary) 8%, var(--bg-page)))",
            border: "1px solid color-mix(in srgb, var(--semantic-brand) 15%, transparent)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            NurseNest
          </p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            My Exam Plan
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
            Get your personalized adaptive study plan, readiness forecast, weak-area targeting, and smart review queue.
          </p>
        </div>
        <SubscriptionPaywall
          context="questions"
          freemiumRemainingQuestions={snap?.questionRemaining ?? 0}
        />
        <PremiumExamPlanUpgradeCard />
      </div>
    );
  }

  // ── Load initial page data ────────────────────────────────────────────────
  const data = await loadExamPlanPageData(userId, entitlement);

  // No data yet (new user, no practice history)
  if (!data) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={CRUMBS} />
        <PremiumEmptyState
          headline="My Exam Plan"
          body="Complete a few practice sessions or your baseline assessment to activate your personalized exam plan."
          primaryCta={{ label: PRIMARY_CTA, href: "/app/questions", variant: "primary" }}
          secondaryCtas={[
            { label: BROWSE_LESSONS_CTA, href: "/app/lessons", variant: "secondary" },
            { label: "Baseline assessment", href: "/app/baseline-assessment", variant: "secondary" },
          ]}
          visualLayout="stack"
          ctaLayout="wrap"
        />
      </div>
    );
  }

  const { coach, weakAreas, pathwayId } = data;
  const { readiness, adaptive, passReadiness, benchmark, examDate, daysUntilExam, streakDays, overallAccuracyPct, catSessionCount } = coach;
  const premiumSnapshot = await loadPremiumDashboardSnapshot(userId, entitlement);
  const lessonsCompleted = premiumSnapshot?.overallLessons.completed ?? 0;
  const lessonsTotal = premiumSnapshot?.overallLessons.total ?? 0;

  // ── Derive recovery plan inputs from available data ──────────────────────
  // inactiveDays: if streak is 0 and user has prior history, treat as at least 1 missed day
  const hasPriorHistory = catSessionCount > 0 || weakAreas.length > 0;
  const inactiveDays = streakDays === 0 && hasPriorHistory ? 2 : 0;

  const recoveryPlan = buildRecoveryPlan({
    status: adaptive.planTrack.status,
    daysUntilExam,
    dailyStudyMinutes: null,
    cadence: adaptive.studyCadencePreference,
    overallAccuracyPct,
    weakTopics: adaptive.weakTop3,
    inactiveDays,
    mockCount: catSessionCount,
    lessonPct: 0, // approximate — lesson pct not directly exposed on CoachPageData
    readinessBand: readiness.band,
  });

  const completedMilestones = adaptive.milestones.filter((milestone) => milestone.complete).length;
  const paceForecast = buildPaceForecast({
    daysUntilExam,
    examDate,
    planTrack: adaptive.planTrack.status,
    weeklyPlan: adaptive.weeklyPlan,
    lessonsCompleted,
    lessonsTotal,
    milestonesCompleted: completedMilestones,
    milestonesTotal: adaptive.milestones.length,
  });

  const isBehind = adaptive.planTrack.status !== "on_track";
  const recoveryCompleted =
    !isBehind &&
    streakDays > 0 &&
    (paceForecast.state === "ahead" || paceForecast.state === "on_pace");

  // Trend data — loaded server-side (lightweight: last 8 practice tests)
  const trendPoints = await loadExamPlanTrendAction().catch(() => []);

  return (
    <div className="space-y-10 pb-16">
      <BreadcrumbTrail items={CRUMBS} />

      {/* 1. Hero ──────────────────────────────────────────────────────────── */}
      <MyExamPlanHero
        readiness={readiness}
        adaptive={adaptive}
        daysUntilExam={daysUntilExam}
        examDate={examDate}
        streakDays={streakDays}
        overallAccuracyPct={overallAccuracyPct}
      />

      {/* 2. Readiness summary row ─────────────────────────────────────────── */}
      <ReadinessSummaryRow
        daysUntilExam={daysUntilExam}
        examDate={examDate}
        readiness={readiness}
        passReadiness={passReadiness}
        weakTop3={adaptive.weakTop3}
        primaryNextTitle={adaptive.primaryNext.title}
      />

      {/* ── NEW: Exam countdown + pacing + recovery block ──────────────── */}
      <section aria-labelledby="countdown-heading" className="space-y-4">
        <h2
          id="countdown-heading"
          className="text-lg font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Exam Countdown &amp; Pacing
        </h2>

        {/* 2a. Premium countdown ring with milestones */}
        <ExamCountdownHero
          daysUntilExam={daysUntilExam}
          examDate={examDate}
          planTrack={adaptive.planTrack}
          milestones={adaptive.milestones}
          forecast={paceForecast}
          streakDays={streakDays}
          recoveryCompleted={recoveryCompleted}
        />

        {/* 2b. Exam date editor — inline */}
        <ExamDateEditor
          initialData={{
            examDate: examDate,
            examDatePlanType: coach.examDatePlanType,
          }}
        />

        {/* 2c. Day-by-day pacing grid */}
        <WeeklyPacingPanel
          plan={adaptive.weeklyPlan}
          planTrack={adaptive.planTrack}
          daysUntilExam={daysUntilExam}
        />

        {/* 2d. Recovery plan — only when behind */}
        {isBehind && recoveryPlan && (
          <RecoveryPlanCard plan={recoveryPlan} />
        )}
      </section>

      {/* 3. Today's plan ──────────────────────────────────────────────────── */}
      <TodaysPlanSection adaptive={adaptive} />

      {/* 4. Weak areas ────────────────────────────────────────────────────── */}
      <WeakAreasImpactSection weakAreas={weakAreas} pathwayId={pathwayId} />

      {/* 5. Smart review due now ──────────────────────────────────────────── */}
      <ReviewDueNowCards weakAreas={weakAreas} />

      {/* 6. Performance + forecast row ────────────────────────────────────── */}
      <PerformanceForecastRow
        overallAccuracyPct={overallAccuracyPct}
        streakDays={streakDays}
        readiness={readiness}
        adaptive={adaptive}
        passReadiness={passReadiness}
      />

      {/* 7. Benchmark / percentile ────────────────────────────────────────── */}
      <section aria-labelledby="benchmark-heading">
        <h2
          id="benchmark-heading"
          className="mb-4 text-lg font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          How You Compare
        </h2>
        <BenchmarkPercentileCard benchmark={benchmark} />
      </section>

      {/* 8. Weekly plan (existing summary cards) ─────────────────────────── */}
      <section aria-labelledby="weekly-plan-heading">
        <h2
          id="weekly-plan-heading"
          className="mb-4 text-lg font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          This Week&apos;s Plan
        </h2>
        <WeeklyStudyPlanSection adaptive={adaptive} daysUntilExam={daysUntilExam} />
      </section>

      {/* 9 & 10. Lazy sections (trend + notes) ───────────────────────────── */}
      <ExamPlanLazyClient readiness={readiness} initialTrendPoints={trendPoints} />

      {/* Plan regenerate control */}
      <PlanRegenerateControl />

      {/* Quick-link footer */}
      <nav
        aria-label="Study tools"
        className="flex flex-wrap gap-3 border-t pt-6"
        style={{ borderColor: "var(--semantic-border-soft)" }}
      >
        {[
          { label: "Practice questions", href: "/app/questions" },
          { label: "Lessons", href: "/app/lessons" },
          { label: "Adaptive CAT", href: "/app/exams" },
          { label: "Review queue", href: "/app/review" },
          { label: "Flashcards", href: "/app/flashcards" },
          { label: "Analytics", href: "/app/account/analytics" },
          { label: "Notes", href: "/app/account/notes" },
          { label: "Study coach", href: "/app/coach" },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="rounded-full border px-3 py-1.5 text-xs font-medium transition hover:opacity-90"
            style={{
              border: "1px solid var(--semantic-border-soft)",
              color: "var(--semantic-text-muted)",
              background: "var(--semantic-panel-muted)",
            }}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
