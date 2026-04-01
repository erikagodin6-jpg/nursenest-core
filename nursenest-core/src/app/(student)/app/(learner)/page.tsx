import Link from "next/link";
import { auth } from "@/lib/auth";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { LearnerInsightEnginePanel } from "@/components/student/learner-insight-engine-panel";
import { PremiumLearnerHub } from "@/components/student/premium-learner-hub";
import { WeakAreasDashboardClient } from "@/components/student/weak-areas-dashboard-client";
import { SubscriberPracticeRollups } from "@/components/student/subscriber-practice-rollups";
import {
  loadPremiumDashboardSnapshot,
  type PremiumDashboardSnapshot,
} from "@/lib/learner/premium-dashboard-snapshot";
import { buildAdaptiveRecommendations } from "@/lib/learner/adaptive-recommendations";
import { loadUnifiedTopicPerformance, type TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import { ExamPlanSettingsCard } from "@/components/student/exam-plan-settings-card";
import { AdaptiveStudyOverview } from "@/components/student/adaptive-study-overview";
import { LearnerDashboardActionCards } from "@/components/student/learner-dashboard-action-cards";
import { LearnerDashboardHero } from "@/components/student/learner-dashboard-hero";

export default async function DashboardPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Learner dashboard</h1>
        </div>
        <section className="nn-card p-6">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Access status</h2>
          <p className="mt-2 text-sm text-muted">Subscription status could not be loaded. Refresh the page.</p>
        </section>
      </main>
    );
  }

  let nextLessonTitle: string | null = null;
  let userPrefs: {
    examFocus: string | null;
    studyGoal: string | null;
    dailyStudyMinutes: number | null;
  } | null = null;

  let topicPerfInitial: TopicPerformanceSnapshot | null = null;
  let premiumSnapshot: PremiumDashboardSnapshot | null = null;
  let adaptiveRecommendations: ReturnType<typeof buildAdaptiveRecommendations> | null = null;
  let baselineWeakTopics: string[] = [];

  if (userId && isDatabaseUrlConfigured()) {
    try {
      const prefsRow = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          examFocus: true,
          studyGoal: true,
          dailyStudyMinutes: true,
          baselineAssessmentSummary: true,
        },
      });
      userPrefs = prefsRow
        ? { examFocus: prefsRow.examFocus, studyGoal: prefsRow.studyGoal, dailyStudyMinutes: prefsRow.dailyStudyMinutes }
        : null;
      const raw = prefsRow?.baselineAssessmentSummary;
      if (raw && typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
        const w = (raw as { weakTopics?: unknown }).weakTopics;
        if (Array.isArray(w)) {
          baselineWeakTopics = w.filter((x): x is string => typeof x === "string" && x.length > 0).slice(0, 8);
        }
      }
    } catch {
      /* optional */
    }
    try {
      const incomplete = await prisma.progress.findFirst({
        where: { userId, completed: false },
        orderBy: { updatedAt: "desc" },
        select: { lessonId: true },
      });
      const lessonRow = incomplete?.lessonId
        ? await prisma.contentItem.findFirst({
            where: { id: incomplete.lessonId, type: "lesson" },
            select: { title: true },
          })
        : null;
      nextLessonTitle = lessonRow?.title ?? null;
    } catch {
      nextLessonTitle = null;
    }
  }

  if (userId && entitlement.hasAccess && isDatabaseUrlConfigured()) {
    try {
      topicPerfInitial = await loadUnifiedTopicPerformance(userId, entitlement, 12);
    } catch {
      topicPerfInitial = null;
    }
    try {
      premiumSnapshot = await loadPremiumDashboardSnapshot(userId, entitlement);
    } catch {
      premiumSnapshot = null;
    }
    if (premiumSnapshot && topicPerfInitial) {
      try {
        const userExam = await prisma.user.findUnique({
          where: { id: userId },
          select: { examDate: true, examDatePlanType: true, studyCadencePreference: true },
        });
        const built = buildAdaptiveRecommendations({
          examDatePlanType: userExam?.examDatePlanType,
          examDate: userExam?.examDate ?? null,
          readiness: premiumSnapshot.readiness,
          weakTopics: topicPerfInitial.weakTopics,
          topicTrends: topicPerfInitial.trends,
          streakDays: premiumSnapshot.studyStreakDays,
          lessonPct: premiumSnapshot.overallLessons.pct,
          lessonsCompleted: premiumSnapshot.overallLessons.completed,
          lessonsTotal: premiumSnapshot.overallLessons.total,
          studyCadencePreference: userExam?.studyCadencePreference,
          continueLesson: premiumSnapshot.continueLesson,
          recommendedQuizTopic: premiumSnapshot.recommendedQuizTopic,
          mockCount: premiumSnapshot.mockCount,
          practiceSessionCount: premiumSnapshot.practice.sessionCount,
        });
        if (baselineWeakTopics.length > 0) {
          const hint = `Baseline run: prioritize ${baselineWeakTopics.slice(0, 2).join(" & ")}`;
          adaptiveRecommendations = {
            ...built,
            weeklyPriorities: [hint, ...built.weeklyPriorities].slice(0, 5),
          };
        } else {
          adaptiveRecommendations = built;
        }
      } catch {
        adaptiveRecommendations = null;
      }
    }
  }

  return (
    <main className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Learner dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          {formatMarketingMessage(messages, "pages.pricing.social.passRateLine")}
        </p>
      </div>

      <section className="nn-card p-6">
        <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Access status</h2>
        <p className="mt-2 text-sm text-muted">
          {entitlement.hasAccess ? "Active subscription — full bank, lessons, and mocks." : "No active subscription — previews may still be available on lessons/questions."}
        </p>
        {!entitlement.hasAccess ? (
          <Link className="mt-3 inline-block text-sm font-semibold text-primary underline" href="/pricing">
            Upgrade to unlock everything
          </Link>
        ) : null}
      </section>

      {entitlement.hasAccess ? (
        <>
          {premiumSnapshot && adaptiveRecommendations && topicPerfInitial ? (
            <>
              <LearnerDashboardHero
                adaptive={adaptiveRecommendations}
                readiness={premiumSnapshot.readiness}
                practice={{
                  gradedTotal: premiumSnapshot.practice.gradedTotal,
                  accuracyPct: premiumSnapshot.practice.accuracyPct,
                  sessionCount: premiumSnapshot.practice.sessionCount,
                }}
                overallLessons={premiumSnapshot.overallLessons}
                streakDays={premiumSnapshot.studyStreakDays}
                flashcardReviews={premiumSnapshot.flashcards?.cardsReviewedTotal ?? null}
                weakTopicTitles={topicPerfInitial.weakTopics.map((w) => w.topic)}
                continueLesson={premiumSnapshot.continueLesson}
              />
              <AdaptiveStudyOverview adaptive={adaptiveRecommendations} compact />
              <ExamPlanSettingsCard />
              <LearnerDashboardActionCards
                continueLesson={premiumSnapshot.continueLesson}
                quizTopic={premiumSnapshot.recommendedQuizTopic}
                showCatHint={
                  adaptiveRecommendations.countdown.urgency === "near" ||
                  adaptiveRecommendations.countdown.urgency === "final_stretch"
                }
              />
            </>
          ) : (
            <ExamPlanSettingsCard />
          )}

          {premiumSnapshot?.insights ? <LearnerInsightEnginePanel insights={premiumSnapshot.insights} /> : null}

          {premiumSnapshot && adaptiveRecommendations && topicPerfInitial ? null : (
            <section className="nn-card p-6">
              <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Continue where you left off</h2>
              {nextLessonTitle ? (
                <p className="mt-2 text-sm text-muted">
                  Next open lesson: <span className="font-medium text-foreground">{nextLessonTitle}</span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted">Pick a lesson or jump to the question bank for a timed block.</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-menu-text)] transition-colors hover:bg-muted/80"
                  href="/app/lessons"
                >
                  Open lessons
                </Link>
                <Link
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-menu-text)] transition-colors hover:bg-muted/80"
                  href="/app/questions"
                >
                  Question bank
                </Link>
                <Link
                  className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                  href="/app/exams"
                >
                  Mock exams
                </Link>
              </div>
            </section>
          )}

          {premiumSnapshot ? (
            <PremiumLearnerHub
              snapshot={premiumSnapshot}
              weakTopicTitles={topicPerfInitial?.weakTopics.map((w) => w.topic) ?? []}
              compactIntro={Boolean(premiumSnapshot && adaptiveRecommendations && topicPerfInitial)}
            />
          ) : (
            <section className="nn-card p-6">
              <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Progress overview</h2>
              <p className="mt-2 text-sm text-muted">
                We could not load your full member progress summary (temporary data issue). Topic performance and lessons
                below still work—refresh in a moment or continue studying.
              </p>
            </section>
          )}

          {userId ? <WeakAreasDashboardClient initial={topicPerfInitial} /> : null}

          <section className="nn-card p-6">
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Question bank on this device</h2>
            <p className="mt-1 text-xs text-muted">
              Optional local summary from your browser. Account-wide topic stats and readiness use the sections above.
            </p>
            {userId ? <SubscriberPracticeRollups userId={userId} /> : null}
          </section>

          <section className="nn-card p-6">
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Features to use this week</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
              <li>Timed mock exams with autosave and score history</li>
              <li>SATA and NGN-style judgment stems in the question bank</li>
              <li>Full rationales after each block</li>
              <li>Exam report card on the exams page</li>
            </ul>
          </section>
        </>
      ) : null}

      {userPrefs && (userPrefs.examFocus || userPrefs.studyGoal || userPrefs.dailyStudyMinutes) ? (
        <section className="nn-card p-6">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Your onboarding targets</h2>
          <ul className="mt-2 text-sm text-muted">
            {userPrefs.examFocus ? <li>Exam focus: {userPrefs.examFocus}</li> : null}
            {userPrefs.studyGoal ? <li>Goal: {userPrefs.studyGoal}</li> : null}
            {userPrefs.dailyStudyMinutes ? <li>Daily cadence: ~{userPrefs.dailyStudyMinutes} minutes</li> : null}
          </ul>
          <p className="mt-2 text-xs text-muted">We will use this to prioritize recommendations as the product evolves.</p>
        </section>
      ) : null}
    </main>
  );
}
