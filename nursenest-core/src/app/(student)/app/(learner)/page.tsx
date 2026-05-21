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
import { prisma } from "@/lib/db";
import {
  buildContinueLearningItems,
  continueLearningItemsToLinks,
} from "@/lib/learner/build-continue-learning-items";
import { loadStudyResumeExtras } from "@/lib/learner/load-study-resume-extras";
import { buildSmartStudyNextRecommendations } from "@/lib/learner/smart-study-next-engine";
import { loadLearnerRetentionPreferences } from "@/lib/learner/load-learner-retention-preferences";
import { loadTodayGoalProgress } from "@/lib/learner/load-today-goal-progress";
import { loadDailyQuestionGoalProgress } from "@/lib/learner/load-daily-question-goal-progress";
import {
  loadPremiumDashboardSnapshot,
  type PremiumDashboardSnapshot,
} from "@/lib/learner/premium-dashboard-snapshot";
import { loadRecentLearnerNotesSummary } from "@/lib/learner/load-recent-learner-notes-summary";
import { LearnerStudyHome } from "@/components/student/learner-study-home";
import { inferContinueStudyFromActivity } from "@/lib/learner/infer-continue-study-from-activity";
import { buildLearnerReportCardViewModel } from "@/lib/learner/learner-report-card-model";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
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
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  getLearnerExamsSurfaceLabel,
  type LearnerExamsSurfaceLabel,
} from "@/lib/testing/testing-model";
import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { LearnerStudyHomeDurabilityMinimal } from "@/components/student/learner-study-home-durability-minimal";
import { LearnerDashboardPageShell } from "@/components/student/learner-dashboard-page-shell";
import { isAdaptiveLearningEnabled } from "@/lib/learner/adaptive-learning-env";
import { loadLearnerAdaptiveWireBundle } from "@/lib/learner/build-learner-adaptive-wire-bundle";
import { emitLearnerDashboardGraphTelemetry } from "@/lib/educational-cognition/emit-learner-dashboard-graph-telemetry";
import { LearnerAdaptiveRecommendationsSection } from "@/components/student/learner-adaptive-recommendations-section";
import { SocialStudyDashboardCard } from "@/components/student/social-study-dashboard-card";

type DashboardSessionLike = {
  user?: {
    id?: string;
    tier?: string | null;
  };
} | null;

/** Match learner shell: CAT entry for nursing exam tracks; generic exams hub otherwise. */
function examsNavLabelFromLearnerContext(
  learnerPath: string | null | undefined,
  tier: string | null | undefined,
): LearnerExamsSurfaceLabel {
  const pathway = learnerPath ? getExamPathwayById(learnerPath) : null;
  if (pathway) {
    return getLearnerExamsSurfaceLabel(pathway.id);
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
      <section className="nn-dash-band nn-dash-band--priority" aria-hidden>
        <div className="nn-dash-skeleton-priority-matrix">
          <div className="nn-dash-skeleton-priority-matrix__primary nn-skeleton-block rounded-2xl" />
          <div className="nn-dash-skeleton-priority-matrix__rail nn-skeleton-block rounded-2xl" />
        </div>
      </section>

      <section className="nn-dash-band" aria-hidden>
        <div className="nn-skeleton-block nn-skeleton-block--short rounded-2xl" />
      </section>
    </>
  );
}

function LearnerDashboardShellFallback({ t }: { t: LearnerMarketingT }) {
  return (
    <LearnerDashboardPageShell t={t} heroHeading={t("learner.dashboard.title")}>
      <LearnerDashboardBodyFallback />
    </LearnerDashboardPageShell>
  );
}

async function LearnerDashboardHeavyContent({
  t,
  locale,
  session,
  userId,
  entitlement,
  userDisplayName,
  userLearnerPath,
  userAlliedProfessionKey,
}: {
  t: LearnerMarketingT;
  locale: string;
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

  try {
    const [socialPrivacy, socialInviteCode] = await Promise.all([
      prisma.socialPrivacySetting.findUnique({
        where: { userId },
        select: { socialEnabled: true, statsHidden: true, visibilityScope: true },
      }),
      prisma.socialInviteCode.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { displayCode: true, enabled: true },
      }),
    ]);
    const snap = await loadPremiumDashboardSnapshot(userId, entitlement);
    const [nextSnap, notes, todayGoal, questionBankGoal, retentionPrefs, daysSinceLastActivity, resumeExtras] =
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
        loadStudyResumeExtras(userId),
      ]);
    snapshot = snap;
    studySnap = nextSnap;
    weakTopicTitles = studySnap?.weakTopics.map((w) => w.topic) ?? [];
    benchmark = snap && !skipNonCriticalHome ? await computeBenchmarkData(userId, snap.readiness) : null;
    const progressFeedbackLine = studySnap?.topicTrends.find((r) => r.momentum === "improving")?.summary ?? null;
    let adaptiveStudyNextRecs: Awaited<ReturnType<typeof buildSmartStudyNextRecommendations>> | undefined;
    if (studySnap && !skipNonCriticalHome) {
      adaptiveStudyNextRecs = await buildSmartStudyNextRecommendations(userId, studySnap, { maxTotal: 2 });
    }
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
      const continueLinks = continueLearningItemsToLinks(
        buildContinueLearningItems(premiumSnapshot, resumeExtras),
        t,
      );
      const personalNote = retentionPersonalNote(t, retentionPrefs);
      const streakProtect =
        todayGoal != null && premiumSnapshot.studyStreakDays > 0 && todayGoal.credits < todayGoal.target;

      const dashModel = buildDashboardModel(premiumSnapshot, studySnap, todayGoal, studySettings);
      const preferredPathwayId =
        premiumSnapshot.pathways.find((p) => p.pathwayId === premiumSnapshot.learnerPath)?.pathwayId ??
        premiumSnapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ??
        premiumSnapshot.pathways[0]?.pathwayId ??
        null;
      const continueCheckpoint =
        preferredPathwayId && !skipNonCriticalHome
          ? await inferContinueStudyFromActivity(userId, preferredPathwayId)
          : null;
      const reportCard =
        preferredPathwayId && studySnap
          ? buildLearnerReportCardViewModel({
              pathwayId: preferredPathwayId,
              snapshot: premiumSnapshot,
              studySnap,
              continueCheckpoint,
            })
          : null;
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

      let adaptiveWireBundle: Awaited<ReturnType<typeof loadLearnerAdaptiveWireBundle>> = null;
      if (isAdaptiveLearningEnabled() && !skipNonCriticalHome) {
        adaptiveWireBundle = await loadLearnerAdaptiveWireBundle(userId, entitlement, {
          source: "rsc:learner-dashboard-adaptive",
          topicPerformance: premiumSnapshot.topicPerformance,
          supplementalWeakTopicRows: studySnap?.weakTopics ?? null,
        });
      }

      if (preferredPathwayId && entitlement.hasAccess && !skipNonCriticalHome) {
        emitLearnerDashboardGraphTelemetry({
          userId,
          entitlement,
          pathwayId: preferredPathwayId,
          readiness: premiumSnapshot.readiness,
          topicTrends: premiumSnapshot.topicPerformance?.trends,
          weakTopics: studySnap?.weakTopics ?? undefined,
        });
      }

      return (
        <>
          <LearnerStudyHome
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
            showShell={false}
            entitlement={entitlement}
            adaptiveStudyNextRecs={adaptiveStudyNextRecs}
            reportCard={reportCard}
            adaptiveRecommendations={
              adaptiveWireBundle ? (
                <LearnerAdaptiveRecommendationsSection t={t} bundle={adaptiveWireBundle} />
              ) : null
            }
          />
          <section className="nn-dash-band">
            <SocialStudyDashboardCard
              initialCode={socialInviteCode?.enabled ? socialInviteCode.displayCode : null}
              socialEnabled={socialPrivacy?.socialEnabled ?? false}
              statsHidden={socialPrivacy?.statsHidden ?? true}
              visibilityScope={socialPrivacy?.visibilityScope ?? "PRIVATE"}
            />
          </section>
        </>
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
      t={t}
      locale={locale}
      examsNavLabel={examsNavLabelFromLearnerContext(userLearnerPath, session?.user?.tier)}
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
}: {
  t: LearnerMarketingT;
  locale: string;
}) {
  const session = (await getProtectedRouteSession("(student).app.(learner)")) as DashboardSessionLike;
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <LearnerDashboardPageShell t={t} heroHeading={t("learner.dashboard.title")}>
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

  const identity = resolveDashboardIdentity({
    tier: session?.user?.tier,
    learnerPathId: userLearnerPath,
    alliedProfessionKey: userAlliedProfessionKey,
  });
  const heroHeading = userDisplayName ? `${userDisplayName}\u2019s Study Hub` : t("learner.dashboard.title");
  const examsNavLabel = examsNavLabelFromLearnerContext(userLearnerPath, session?.user?.tier);

  if (entitlement === "error") {
    return (
      <LearnerDashboardPageShell t={t} heroHeading={heroHeading} identity={identity}>
        <PremiumEmptyState
          headline={t("learner.dashboard.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("learner.dashboard.openAccountHub"), href: "/app/account/overview", variant: "primary" }}
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
      <LearnerDashboardPageShell t={t} heroHeading={heroHeading} identity={identity}>
        <LearnerStudyHomeDurabilityMinimal
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
      <LearnerDashboardPageShell t={t} heroHeading={heroHeading} identity={identity}>
        <section className="nn-dash-section">
          <div className="nn-learner-page-hero">
            <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--semantic-text-secondary)]">
              {t("learner.dashboard.lockedTeaserBody")}
            </p>
          </div>
        </section>

        <section className="nn-dash-section">
          <ReadinessLockedCard t={t} />
          <BenchmarkLockedCard />
        </section>

        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        <LockedDashboardOverlay />
      </LearnerDashboardPageShell>
    );
  }

  return (
    <LearnerDashboardPageShell t={t} heroHeading={heroHeading} identity={identity}>
      <LearnerDashboardHeavyContent
        t={t}
        locale={locale}
        session={session}
        userId={userId}
        entitlement={entitlement}
        userDisplayName={userDisplayName}
        userLearnerPath={userLearnerPath}
        userAlliedProfessionKey={userAlliedProfessionKey}
      />
    </LearnerDashboardPageShell>
  );
}

export default async function LearnerDashboardPage() {
  const { t, locale } = await getLearnerMarketingBundle();

  return (
    <Suspense fallback={<LearnerDashboardShellFallback t={t} />}>
      <LearnerDashboardDeferredContent t={t} locale={locale} />
    </Suspense>
  );
}
