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
import {
  loadPremiumDashboardSnapshot,
  type PremiumDashboardSnapshot,
} from "@/lib/learner/premium-dashboard-snapshot";
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
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { LearnerStudyHomeDurabilityMinimal } from "@/components/student/learner-study-home-durability-minimal";

/** Match learner shell: CAT entry for nursing exam tracks; generic exams hub otherwise. */
function examsNavLabelFromLearnerContext(
  learnerPath: string | null | undefined,
  tier: string | null | undefined,
): "CAT Exams" | "Exams" {
  const pathway = learnerPath ? getExamPathwayById(learnerPath) : null;
  if (pathway) {
    const rt = pathway.roleTrack;
    if (rt === "rn" || rt === "rpn" || rt === "lpn" || rt === "np") return "CAT Exams";
  }
  const u = (tier ?? "").toUpperCase();
  if (u === "RN" || u === "RPN" || u === "LVN_LPN" || u === "NP") return "CAT Exams";
  return "Exams";
}

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
  const { t, locale } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appShellBreadcrumbs("dashboard");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
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
      </div>
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
      <div className="space-y-6">
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
      </div>
    );
  }

  if (entitlement.hasAccess && shouldSkipNonCriticalLearnerWork()) {
    safeServerLog("learner_dashboard", "optional_home_ui_skipped", {
      surface: "full_dashboard",
      reason: "durability_degraded",
    });
    const identity = resolveDashboardIdentity({
      tier: session?.user?.tier,
      learnerPathId: userLearnerPath,
      alliedProfessionKey: userAlliedProfessionKey,
    });
    return (
      <LearnerStudyHomeDurabilityMinimal
        crumbs={crumbs}
        t={t}
        locale={locale}
        examsNavLabel={examsNavLabelFromLearnerContext(userLearnerPath, session?.user?.tier)}
        identity={identity}
        heroHeading={userDisplayName ? `${userDisplayName}\u2019s Study Hub` : t("learner.dashboard.title")}
        pathwayId={userLearnerPath}
        banner="degraded"
      />
    );
  }

  if (!entitlement.hasAccess) {
    const lockedIdentity = resolveDashboardIdentity({
      tier: session?.user?.tier,
      learnerPathId: userLearnerPath,
      alliedProfessionKey: userAlliedProfessionKey,
    });
    return (
      <div className="nn-dash">
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
              {t("learner.dashboard.lockedTeaserBody")}
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
      </div>
    );
  }

  let snapshot: PremiumDashboardSnapshot | null = null;
  let studySnap: Awaited<ReturnType<typeof buildLearnerStudySnapshot>> = null;
  let weakTopicTitles: string[] = [];
  let benchmark: BenchmarkData | null = null;
  const studySettings = await loadStudySettings(userId);
  const skipNonCriticalHome = shouldSkipNonCriticalLearnerWork();
  try {
    const snap = await loadPremiumDashboardSnapshot(userId, entitlement);
    const [nextSnap, notes, todayGoal, questionBankGoal, retentionPrefs, daysSinceLastActivity] =
      await Promise.all([
        buildLearnerStudySnapshot(userId, entitlement, undefined, {
          topicPerformance: snap?.topicPerformance,
          studyBootstrap: snap
            ? {
                alliedProfessionKey: snap.studyBootstrap.alliedProfessionKey,
                tier: snap.studyBootstrap.tier,
                learnerPath: snap.studyBootstrap.learnerPath,
              }
            : undefined,
        }),
        loadRecentLearnerNotesSummary(userId),
        loadTodayGoalProgress(userId),
        loadDailyQuestionGoalProgress(userId),
        loadLearnerRetentionPreferences(userId),
        skipNonCriticalHome ? Promise.resolve(null) : loadDaysSinceLastActivity(userId),
      ]);
    snapshot = snap;
    studySnap = nextSnap;
    weakTopicTitles = studySnap?.weakTopics.map((w) => w.topic) ?? [];
    benchmark = snap && !skipNonCriticalHome ? await computeBenchmarkData(userId, snap.readiness) : null;
    const progressFeedbackLine = studySnap?.topicTrends.find((r) => r.momentum === "improving")?.summary ?? null;
    if (snapshot) {
      const premiumSnapshot = snapshot;
      const resume =
        premiumSnapshot.continueLesson ??
        (premiumSnapshot.lessonContinuations[0]
          ? {
              title: premiumSnapshot.lessonContinuations[0].title,
              href: premiumSnapshot.lessonContinuations[0].href,
            }
          : null);
      const momentumLine = premiumSnapshot.momentumMessages[0] ?? null;
      const continueLinks = continueLearningItemsToLinks(buildContinueLearningItems(premiumSnapshot), t);
      const personalNote = retentionPersonalNote(t, retentionPrefs);
      const streakProtect =
        todayGoal != null && premiumSnapshot.studyStreakDays > 0 && todayGoal.credits < todayGoal.target;

      const dashModel = buildDashboardModel(premiumSnapshot, studySnap, todayGoal, studySettings);
      const preferredPathwayId =
        premiumSnapshot.pathways.find((p) => p.pathwayId === premiumSnapshot.learnerPath)?.pathwayId ??
        premiumSnapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ??
        premiumSnapshot.pathways[0]?.pathwayId ??
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
        examDatePlanType: premiumSnapshot.studyBootstrap.examDatePlanType,
        examDate: premiumSnapshot.studyBootstrap.examDate,
      });

      const daysLeft = daysUntilExamUtc(premiumSnapshot.studyBootstrap.examDate);
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

      const isNewLearnerPriority =
        !premiumSnapshot.continueLesson &&
        premiumSnapshot.practice.gradedTotal === 0 &&
        premiumSnapshot.studyStreakDays === 0;

      const identity = resolveDashboardIdentity({
        tier: session?.user?.tier,
        learnerPathId: userLearnerPath,
        alliedProfessionKey: userAlliedProfessionKey,
      });

      const coachSummary =
        studySnap
          ? (() => {
              const b = buildCoachDashboardBundle(premiumSnapshot, studySnap, daysSinceLastActivity);
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
          locale={locale}
          examsNavLabel={examsNavLabelFromLearnerContext(userLearnerPath, session?.user?.tier)}
          identity={identity}
          heroHeading={userDisplayName ? `${userDisplayName}\u2019s Study Hub` : t("learner.dashboard.title")}
          snapshot={premiumSnapshot}
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
          priorityEyebrowKey={
            isNewLearnerPriority
              ? "learner.studyHome.sectionPriorityEyebrowNew"
              : "learner.studyHome.sectionPriorityEyebrow"
          }
        />
      );
    }
  } catch {
    snapshot = null;
  }

  const identityFallback = resolveDashboardIdentity({
    tier: session?.user?.tier,
    learnerPathId: userLearnerPath,
    alliedProfessionKey: userAlliedProfessionKey,
  });
  return (
    <LearnerStudyHomeDurabilityMinimal
      crumbs={crumbs}
      t={t}
      locale={locale}
      examsNavLabel={examsNavLabelFromLearnerContext(userLearnerPath, session?.user?.tier)}
      identity={identityFallback}
      heroHeading={userDisplayName ? `${userDisplayName}\u2019s Study Hub` : t("learner.dashboard.title")}
      pathwayId={userLearnerPath}
      banner="error_fallback"
    />
  );
}
