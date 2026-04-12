import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LearnerDailyMomentumCard } from "@/components/student/learner-daily-momentum-card";
import { LearnerDashboardAdvantageStrip } from "@/components/student/learner-dashboard-advantage-strip";
import { LearnerDashboardCommandCenter } from "@/components/student/learner-dashboard-command-center";
import { EngagementNudgeStrip } from "@/components/student/engagement-nudge-strip";
import { SpacedReviewReminder } from "@/components/student/spaced-review-reminder";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { PremiumLearnerHub } from "@/components/student/premium-learner-hub";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { LockedDashboardOverlay } from "@/components/student/dashboard/locked-dashboard-overlay";
import { PrimaryActionCard } from "@/components/student/dashboard/primary-action-card";
import { ExamCountdownCard } from "@/components/student/dashboard/exam-countdown-card";
import { WeaknessHeatmap, type HeatmapTopic } from "@/components/student/dashboard/weakness-heatmap";
import { SmartActionsBar } from "@/components/student/dashboard/smart-actions-bar";
import { ReadinessLockedCard } from "@/components/student/dashboard/readiness-score-card";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { prisma } from "@/lib/db";
import {
  buildContinueLearningItems,
  continueLearningItemsToLinks,
} from "@/lib/learner/build-continue-learning-items";
import { loadLearnerRetentionPreferences } from "@/lib/learner/load-learner-retention-preferences";
import { loadTodayGoalProgress } from "@/lib/learner/load-today-goal-progress";
import { loadDailyQuestionGoalProgress } from "@/lib/learner/load-daily-question-goal-progress";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadRecentLearnerNotesSummary } from "@/lib/learner/load-recent-learner-notes-summary";
import { LearnerAdaptiveFocusCard } from "@/components/student/learner-adaptive-focus-card";
import { LearnerContinueLearningCard } from "@/components/student/learner-continue-learning-card";
import { LearnerDashboardInsightPanels } from "@/components/student/learner-dashboard-insight-panels";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";
import { buildDashboardModel } from "@/lib/learner/next-best-action";
import { buildCountdownCopy, daysUntilExamUtc } from "@/lib/learner/exam-timeline";
import { DashboardCoachCard } from "@/components/student/dashboard/coach-card";
import { CoachWeakSummary } from "@/components/study/coach-weak-summary";
import { isStudyCoachEnabled } from "@/lib/ai/learner-ai-policy";
import { computeBenchmarkData, type BenchmarkData } from "@/lib/learner/benchmark-engine";
import { BenchmarkCard, BenchmarkLockedCard } from "@/components/student/dashboard/benchmark-card";
import { resolveDisplayName } from "@/lib/user/resolve-display-name";

function retentionPersonalNote(t: LearnerMarketingT, prefs: Awaited<ReturnType<typeof loadLearnerRetentionPreferences>>): string | null {
  if (!prefs) return null;
  if (prefs.dailyStudyMinutes != null) {
    return t("learner.retention.personalMinutesHint", { n: prefs.dailyStudyMinutes });
  }
  if (prefs.studyGoal?.trim()) {
    return t("learner.retention.studyGoalEcho", { goal: prefs.studyGoal.trim() });
  }
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.dashboard.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app", routeGroup: "student.learner.dashboard" },
  );
}

export default async function LearnerDashboardPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appShellBreadcrumbs("dashboard");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.dashboard.signedOutTitle")}
          body={t("learner.dashboard.signedOutHint")}
          hint={t("learner.profile.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  let userDisplayName: string | null = null;

  // Redirect to onboarding if user hasn't completed it yet
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingCompletedAt: true, firstName: true, displayName: true, name: true },
    });
    if (user && !user.onboardingCompletedAt) {
      redirect("/app/onboarding");
    }
    userDisplayName = user ? resolveDisplayName(user) : null;
  } catch (e) {
    // redirect() throws a NEXT_REDIRECT error; re-throw it
    if (e && typeof e === "object" && "digest" in e) throw e;
    // DB errors: continue to dashboard rather than blocking
  }

  if (entitlement === "error") {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.dashboard.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("learner.dashboard.openAccountHub"), href: "/app/account/overview", variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="nn-dash">
        <BreadcrumbTrail items={crumbs} />

        {/* Page header */}
        <section className="nn-dash-section">
          <div className="nn-learner-page-hero">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-[var(--semantic-brand)]">{t("learner.dashboard.kicker")}</p>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">{t("learner.dashboard.title")}</h1>
            <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--semantic-text-secondary)]">
              Your study system is ready. Unlock it to get started.
            </p>
          </div>
        </section>

        {/* Locked readiness + benchmark previews */}
        <section className="nn-dash-section">
          <ReadinessLockedCard />
          <BenchmarkLockedCard />
        </section>

        {/* Blurred preview of adaptive study recommendations */}
        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />

        {/* Full locked dashboard with feature grid + conversion CTAs */}
        <LockedDashboardOverlay />
      </main>
    );
  }

  let snapshot = null;
  let studySnap: Awaited<ReturnType<typeof buildLearnerStudySnapshot>> = null;
  let weakTopicTitles: string[] = [];
  let benchmark: BenchmarkData | null = null;
  try {
    const [snap, nextSnap, notes, todayGoal, questionBankGoal, retentionPrefs, examUser] = await Promise.all([
      loadPremiumDashboardSnapshot(userId, entitlement),
      buildLearnerStudySnapshot(userId, entitlement, undefined),
      loadRecentLearnerNotesSummary(userId),
      loadTodayGoalProgress(userId),
      loadDailyQuestionGoalProgress(userId),
      loadLearnerRetentionPreferences(userId),
      prisma.user.findUnique({
        where: { id: userId },
        select: { examDate: true, examDatePlanType: true },
      }),
    ]);
    snapshot = snap;
    studySnap = nextSnap;
    weakTopicTitles = studySnap?.weakTopics.map((w) => w.topic) ?? [];
    benchmark = snap ? await computeBenchmarkData(userId, snap.readiness) : null;
    const progressFeedbackLine = studySnap?.topicTrends.find((r) => r.momentum === "improving")?.summary ?? null;
    if (snapshot) {
      const resume =
        snapshot.continueLesson ??
        (snapshot.lessonContinuations[0]
          ? { title: snapshot.lessonContinuations[0].title, href: snapshot.lessonContinuations[0].href }
          : null);
      const momentumLine = snapshot.momentumMessages[0] ?? null;
      const continueLinks = continueLearningItemsToLinks(buildContinueLearningItems(snapshot), t);
      const personalNote = retentionPersonalNote(t, retentionPrefs);
      const streakProtect =
        todayGoal != null && snapshot.studyStreakDays > 0 && todayGoal.credits < todayGoal.target;

      const dashModel = buildDashboardModel(snapshot, studySnap, todayGoal);

      const countdown = buildCountdownCopy({
        examDatePlanType: examUser?.examDatePlanType ?? null,
        examDate: examUser?.examDate ?? null,
      });

      const daysLeft = daysUntilExamUtc(examUser?.examDate ?? null);
      const questionsPerDay =
        daysLeft != null && daysLeft > 0
          ? Math.max(5, Math.ceil(200 / daysLeft))
          : null;

      const heatmapTopics: HeatmapTopic[] = (studySnap?.weakTopics ?? [])
        .concat(studySnap?.strongTopicsHighlight ?? [])
        .map((w) => ({
          topic: w.topic,
          missRate: w.missRate,
          attempted: w.attempted,
        }));

      return (
        <main className="nn-dash">
          <BreadcrumbTrail items={crumbs} />

          {/* ── Hero + Primary CTA ────────────────────────────────── */}
          <section className="nn-dash-section">
            <div className="nn-learner-page-hero">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-[var(--semantic-brand)]">{t("learner.dashboard.kicker")}</p>
              <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
                {userDisplayName ? `${userDisplayName}\u2019s Study Hub` : t("learner.dashboard.title")}
              </h1>
              <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.dashboard.subtitle.subscriber")}</p>
            </div>
            <PrimaryActionCard action={dashModel.nextAction} />
          </section>

          {/* ── KPI Snapshot + Exam Countdown ─────────────────────── */}
          <section className="nn-dash-section">
            <p className="nn-dash-section-label">Your Progress</p>
            <LearnerDashboardCommandCenter snapshot={snapshot} t={t} />
            <ExamCountdownCard countdown={countdown} questionsPerDay={questionsPerDay} />
          </section>

          <div className="nn-dash-divider" />

          {/* ── Today's Focus ─────────────────────────────────────── */}
          <section className="nn-dash-section">
            <p className="nn-dash-section-label">Today&apos;s Focus</p>
            {todayGoal ? (
              <LearnerDailyMomentumCard
                t={t}
                streakDays={snapshot.studyStreakDays}
                todayGoal={todayGoal}
                questionGoal={questionBankGoal}
                resume={resume}
                momentumLine={momentumLine}
                focusTopic={weakTopicTitles[0] ?? null}
                personalNote={personalNote}
                showStreakProtectNudge={streakProtect}
                progressFeedbackLine={progressFeedbackLine}
              />
            ) : null}
            <EngagementNudgeStrip maxItems={3} />
            <SpacedReviewReminder />
          </section>

          <div className="nn-dash-divider" />

          {/* ── Analytics + Weakness Map ───────────────────────────── */}
          <section className="nn-dash-section">
            <p className="nn-dash-section-label">Performance &amp; Gaps</p>
            <LearnerDashboardInsightPanels snapshot={snapshot} t={t} />
            {benchmark && <BenchmarkCard data={benchmark} />}
            {heatmapTopics.length > 0 && <WeaknessHeatmap topics={heatmapTopics} />}
            {isStudyCoachEnabled() && weakTopicTitles.length > 0 && (
              <CoachWeakSummary
                weakTopics={weakTopicTitles}
                examTarget={undefined}
                daysUntilExam={daysLeft}
              />
            )}
          </section>

          <div className="nn-dash-divider" />

          {/* ── Continue Learning + Focus ──────────────────────────── */}
          <section className="nn-dash-section">
            <p className="nn-dash-section-label">Study Plan</p>
            {studySnap ? <LearnerAdaptiveFocusCard snapshot={studySnap} /> : null}
            {isStudyCoachEnabled() && (
              <DashboardCoachCard
                weakTopics={weakTopicTitles}
                examTarget={undefined}
                daysUntilExam={daysLeft}
              />
            )}
            <LearnerContinueLearningCard t={t} links={continueLinks} />
            <PremiumLearnerHub
              snapshot={snapshot}
              weakTopicTitles={weakTopicTitles}
              recentNotes={notes}
              suppressFlashcardWeakLine={weakTopicTitles.length > 0}
              compactIntro
              omitReadinessBreakdown
              omitRecentMocks
              readinessDeferHint={t("learner.dashboard.hub.readinessDeferHint")}
            />
          </section>

          <div className="nn-dash-divider" />

          {/* ── Quick Launch + Account ─────────────────────────────── */}
          <section className="nn-dash-section">
            <p className="nn-dash-section-label">Quick Actions</p>
            <SmartActionsBar />
            <LearnerDashboardAdvantageStrip t={t} />
            <section className="nn-card flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">{t("learner.dashboard.accountTeaser")}</p>
              <Link
                href="/app/account/overview"
                className="inline-flex w-full shrink-0 justify-center rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2.5 text-sm font-semibold text-role-cta-on-soft sm:w-auto"
              >
                {t("learner.dashboard.openAccountHub")}
              </Link>
            </section>
          </section>
        </main>
      );
    }
  } catch {
    snapshot = null;
  }

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <PremiumEmptyState
        headline={t("learner.dashboard.title")}
        body={t("learner.dashboard.loadFailed")}
        tone="default"
        primaryCta={{ label: t("learner.dashboard.openAccountHub"), href: "/app/account/overview", variant: "primary" }}
        secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
        visualLayout="stack"
        ctaLayout="stack"
      />
    </main>
  );
}
