import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { LockedDashboardOverlay } from "@/components/student/dashboard/locked-dashboard-overlay";
import { WeaknessHeatmap, type HeatmapTopic } from "@/components/student/dashboard/weakness-heatmap";
import { ReadinessLockedCard } from "@/components/student/dashboard/readiness-score-card";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { buildSmartStudyNextRecommendations } from "@/lib/learner/smart-study-next-engine";
import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";
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
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { LearnerStudyHomeDurabilityMinimal } from "@/components/student/learner-study-home-durability-minimal";
import { LearnerDashboardPageShell } from "@/components/student/learner-dashboard-page-shell";
import { LearnerDashboardUserPanelBand } from "@/components/student/learner-dashboard-user-panel-band";

type DashboardSessionLike = {
  user?: {
    id?: string;
    tier?: string | null;
  };
} | null;

/** Match learner shell: CAT entry for nursing exam tracks; generic exams hub otherwise. */
function examsNavLabelFromLearnerContext(
  getExamPathwayById: (id: string) => ExamPathwayDefinition | undefined,
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

function LearnerDashboardBodyFallback() {
  return (
    <>
      <section className="nn-dash-band" aria-hidden>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
          <div className="min-h-[13rem] animate-pulse rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]" />
          <div className="min-h-[13rem] animate-pulse rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]" />
        </div>
      </section>

      <section className="nn-dash-band" aria-hidden>
        <div className="min-h-[8rem] animate-pulse rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]" />
      </section>
    </>
  );
}

function LearnerDashboardShellFallback({
  t,
  crumbs,
}: {
  t: LearnerMarketingT;
  crumbs: ReturnType<typeof appShellBreadcrumbs>;
}) {
  return (
    <LearnerDashboardPageShell crumbs={crumbs} t={t} heroHeading={t("learner.dashboard.title")}>
      <LearnerDashboardBodyFallback />
    </LearnerDashboardPageShell>
  );
}

async function LearnerDashboardHeavyContent({
  t,
  locale,
  crumbs,
  session,
  userId,
  entitlement,
  userDisplayName,
  userLearnerPath,
  userAlliedProfessionKey,
}: {
  t: LearnerMarketingT;
  locale: string;
  crumbs: ReturnType<typeof appShellBreadcrumbs>;
  session: DashboardSessionLike;
  userId: string;
  entitlement: Exclude<Awaited<ReturnType<typeof resolveEntitlementForPage>>, "error">;
  userDisplayName: string | null;
  userLearnerPath: string | null;
  userAlliedProfessionKey: string | null;
}) {
  let snapshot: PremiumDashboardSnapshot | null = null;
  let studySnap: Awaited<ReturnType<typeof buildLearnerStudySnapshot>> = null;
  let weakTopicTitles: string[] = [];
  let benchmark: BenchmarkData | null = null;
  const studySettings = await loadStudySettings(userId);
  const skipNonCriticalHome = shouldSkipNonCriticalLearnerWork();
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
  /** Prefer DB-resolved entitlement (includes admin learner QA overlay) over JWT tier for chrome copy. */
  const tierForDashboardCopy =
    entitlement.tier != null ? String(entitlement.tier) : session?.user?.tier ?? null;
  const alliedKeyForDashboardCopy = entitlement.alliedCareer ?? userAlliedProfessionKey;

  try {
    const snap = await loadPremiumDashboardSnapshot(userId, entitlement);
    const [nextSnap, notes, todayGoal, questionBankGoal, retentionPrefs, daysSinceLastActivity] = await Promise.all([
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
      let adaptiveStudyNextRecs: StudyNextRecommendation[] | undefined;
      if (studySnap) {
        adaptiveStudyNextRecs = await buildSmartStudyNextRecommendations(userId, studySnap, { maxTotal: 2 });
      }
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
        tier: tierForDashboardCopy,
        learnerPathId: userLearnerPath,
        alliedProfessionKey: alliedKeyForDashboardCopy,
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
          examsNavLabel={examsNavLabelFromLearnerContext(getExamPathwayById, userLearnerPath, tierForDashboardCopy)}
          identity={identity}
          entitlement={entitlement}
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
          adaptiveStudyNextRecs={adaptiveStudyNextRecs}
          priorityEyebrowKey={
            isNewLearnerPriority
              ? "learner.studyHome.sectionPriorityEyebrowNew"
              : "learner.studyHome.sectionPriorityEyebrow"
          }
          showShell={false}
        />
      );
    }
  } catch {
    snapshot = null;
  }

  const identityFallback = resolveDashboardIdentity({
    tier: tierForDashboardCopy,
    learnerPathId: userLearnerPath,
    alliedProfessionKey: alliedKeyForDashboardCopy,
  });
  return (
    <LearnerStudyHomeDurabilityMinimal
      crumbs={crumbs}
      t={t}
      locale={locale}
      examsNavLabel={examsNavLabelFromLearnerContext(getExamPathwayById, userLearnerPath, tierForDashboardCopy)}
      identity={identityFallback}
      heroHeading={userDisplayName ? `${userDisplayName}\u2019s Study Hub` : t("learner.dashboard.title")}
      pathwayId={userLearnerPath}
      entitlement={entitlement}
      banner="error_fallback"
      showShell={false}
    />
  );
}

async function LearnerDashboardDeferredContent({
  t,
  locale,
  crumbs,
}: {
  t: LearnerMarketingT;
  locale: string;
  crumbs: ReturnType<typeof appShellBreadcrumbs>;
}) {
  const session = (await getProtectedRouteSession("(student).app.(learner)")) as DashboardSessionLike;
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <LearnerDashboardPageShell crumbs={crumbs} t={t} heroHeading={t("learner.dashboard.title")}>
        <PremiumEmptyState
          headline={t("learner.dashboard.signedOutTitle")}
          body={t("learner.dashboard.signedOutHint")}
          hint={t("learner.profile.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </LearnerDashboardPageShell>
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

  const tierForDashboardCopy =
    entitlement !== "error" && entitlement.tier != null
      ? String(entitlement.tier)
      : session?.user?.tier ?? null;
  const alliedKeyForDashboardCopy =
    entitlement !== "error" && entitlement.alliedCareer != null
      ? String(entitlement.alliedCareer)
      : userAlliedProfessionKey;
  const identity = resolveDashboardIdentity({
    tier: tierForDashboardCopy,
    learnerPathId: userLearnerPath,
    alliedProfessionKey: alliedKeyForDashboardCopy,
  });
  const heroHeading = userDisplayName ? `${userDisplayName}\u2019s Study Hub` : t("learner.dashboard.title");
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
  const examsNavLabel = examsNavLabelFromLearnerContext(getExamPathwayById, userLearnerPath, tierForDashboardCopy);

  if (entitlement === "error") {
    return (
      <LearnerDashboardPageShell crumbs={crumbs} t={t} heroHeading={heroHeading} identity={identity}>
        <LearnerDashboardUserPanelBand
          t={t}
          locale={locale}
          pathwayId={userLearnerPath}
          examsNavLabel={examsNavLabel}
          entitlement="error"
          includeStudyShortcuts={false}
        />
        <PremiumEmptyState
          headline={t("learner.dashboard.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("learner.dashboard.openAccountHub"), href: "/app/account", variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </LearnerDashboardPageShell>
    );
  }

  if (entitlement.hasAccess && shouldSkipNonCriticalLearnerWork()) {
    safeServerLog("learner_dashboard", "optional_home_ui_skipped", {
      surface: "full_dashboard",
      reason: "durability_degraded",
    });
    return (
      <LearnerDashboardPageShell crumbs={crumbs} t={t} heroHeading={heroHeading} identity={identity}>
        <LearnerStudyHomeDurabilityMinimal
          crumbs={crumbs}
          t={t}
          locale={locale}
          examsNavLabel={examsNavLabel}
          identity={identity}
          heroHeading={heroHeading}
          pathwayId={userLearnerPath}
          entitlement={entitlement}
          banner="degraded"
          showShell={false}
        />
      </LearnerDashboardPageShell>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <LearnerDashboardPageShell crumbs={crumbs} t={t} heroHeading={heroHeading} identity={identity}>
        <LearnerDashboardUserPanelBand
          t={t}
          locale={locale}
          pathwayId={userLearnerPath}
          examsNavLabel={examsNavLabel}
          entitlement={entitlement}
          includeStudyShortcuts
        />
        <section className="nn-dash-section">
          <div className="nn-learner-page-hero">
            <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--semantic-text-secondary)]">
              {t("learner.dashboard.lockedTeaserBody")}
            </p>
          </div>
        </section>

        <section className="nn-dash-section">
          <ReadinessLockedCard />
          <BenchmarkLockedCard />
        </section>

        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        <LockedDashboardOverlay />
      </LearnerDashboardPageShell>
    );
  }

  return (
    <LearnerDashboardPageShell crumbs={crumbs} t={t} heroHeading={heroHeading} identity={identity}>
      <Suspense fallback={<LearnerDashboardBodyFallback />}>
        <LearnerDashboardHeavyContent
          t={t}
          locale={locale}
          crumbs={crumbs}
          session={session}
          userId={userId}
          entitlement={entitlement}
          userDisplayName={userDisplayName}
          userLearnerPath={userLearnerPath}
          userAlliedProfessionKey={userAlliedProfessionKey}
        />
      </Suspense>
    </LearnerDashboardPageShell>
  );
}

export default async function LearnerDashboardPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const crumbs = appShellBreadcrumbs("dashboard");

  return (
    <Suspense fallback={<LearnerDashboardShellFallback t={t} crumbs={crumbs} />}>
      <LearnerDashboardDeferredContent t={t} locale={locale} crumbs={crumbs} />
    </Suspense>
  );
}
