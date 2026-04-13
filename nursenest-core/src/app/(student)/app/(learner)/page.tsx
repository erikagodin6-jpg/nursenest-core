import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { LockedDashboardOverlay } from "@/components/student/dashboard/locked-dashboard-overlay";
import { WeaknessHeatmap, type HeatmapTopic } from "@/components/student/dashboard/weakness-heatmap";
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
import { LearnerStudyHome } from "@/components/student/learner-study-home";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";
import { buildDashboardModel } from "@/lib/learner/next-best-action";
import { buildCountdownCopy, daysUntilExamUtc } from "@/lib/learner/exam-timeline";
import { isStudyCoachEnabled } from "@/lib/ai/learner-ai-policy";
import {
  buildCoachDashboardBundle,
  loadDaysSinceLastActivity,
} from "@/lib/coach/study-coach-intelligence";
import { computeBenchmarkData, type BenchmarkData } from "@/lib/learner/benchmark-engine";
import { BenchmarkLockedCard } from "@/components/student/dashboard/benchmark-card";
import { resolveDisplayName } from "@/lib/user/resolve-display-name";
import { resolveDashboardIdentity } from "@/lib/learner/resolve-dashboard-identity";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { withPathwayScopeHref } from "@/lib/learner/pathway-scoped-href";

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
  let userLearnerPath: string | null = null;
  let userAlliedProfessionKey: string | null = null;

  // Redirect to onboarding if user hasn't completed it yet
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboardingCompletedAt: true,
        firstName: true,
        displayName: true,
        name: true,
        learnerPath: true,
        alliedProfessionKey: true,
      },
    });
    if (user && !user.onboardingCompletedAt) {
      redirect("/app/onboarding");
    }
    userDisplayName = user ? resolveDisplayName(user) : null;
    userLearnerPath = user?.learnerPath ?? null;
    userAlliedProfessionKey = user?.alliedProfessionKey ?? null;
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
    const lockedIdentity = resolveDashboardIdentity({
      tier: session?.user?.tier,
      learnerPathId: userLearnerPath,
      alliedProfessionKey: userAlliedProfessionKey,
    });
    return (
      <main className="nn-dash">
        <BreadcrumbTrail items={crumbs} />

        {/* Page header */}
        <section className="nn-dash-section">
          <div className="nn-learner-page-hero">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
                {lockedIdentity.pill}
              </span>
              <p className="text-[0.6875rem] font-medium text-[var(--semantic-text-secondary)]">{lockedIdentity.subtitle}</p>
            </div>
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
  const studySettings = await loadStudySettings(userId);
  try {
    const [snap, nextSnap, notes, todayGoal, questionBankGoal, retentionPrefs, examUser, daysSinceLastActivity] =
      await Promise.all([
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
        loadDaysSinceLastActivity(userId),
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

      const dashModel = buildDashboardModel(snapshot, studySnap, todayGoal, studySettings);
      const preferredPathwayId =
        snapshot.pathways.find((p) => p.pathwayId === snapshot.learnerPath)?.pathwayId ??
        snapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ??
        snapshot.pathways[0]?.pathwayId ??
        null;
      const scopedContinueLinks = continueLinks.map((link) => ({
        ...link,
        href: withPathwayScopeHref(link.href, preferredPathwayId),
      }));
      const scopedNextAction = {
        ...dashModel.nextAction,
        href: withPathwayScopeHref(dashModel.nextAction.href, preferredPathwayId),
      };

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

      const identity = resolveDashboardIdentity({
        tier: session?.user?.tier,
        learnerPathId: userLearnerPath,
        alliedProfessionKey: userAlliedProfessionKey,
      });

      const coachSummary =
        snapshot && studySnap
          ? (() => {
              const b = buildCoachDashboardBundle(snapshot, studySnap, daysSinceLastActivity);
              return {
                readiness: b.readiness,
                priorities: b.priorities,
                patterns: b.patterns,
                topIntervention: b.topIntervention,
              };
            })()
          : null;

      return (
        <LearnerStudyHome
          crumbs={crumbs}
          t={t}
          identity={identity}
          heroHeading={userDisplayName ? `${userDisplayName}\u2019s Study Hub` : t("learner.dashboard.title")}
          snapshot={snapshot}
          studySnap={studySnap}
          benchmark={benchmark}
          heatmapTopics={heatmapTopics}
          weakTopicTitles={weakTopicTitles}
          continueLinks={scopedContinueLinks}
          nextAction={scopedNextAction}
          todayGoal={todayGoal}
          questionBankGoal={questionBankGoal}
          resume={resume}
          momentumLine={momentumLine}
          personalNote={personalNote}
          streakProtect={streakProtect}
          progressFeedbackLine={progressFeedbackLine}
          countdown={countdown}
          questionsPerDay={questionsPerDay}
          daysLeft={daysLeft}
          recentNotes={notes}
          readinessDeferHint={t("learner.dashboard.hub.readinessDeferHint")}
          showCoach={isStudyCoachEnabled()}
          coachSummary={coachSummary}
          studySettings={studySettings}
        />
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
