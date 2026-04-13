import { auth } from "@/lib/auth";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { AdaptiveStudyOverview } from "@/components/student/adaptive-study-overview";
import { ExamPlanSettingsCard } from "@/components/student/exam-plan-settings-card";
import { LearnerInsightEnginePanel } from "@/components/student/learner-insight-engine-panel";
import { StudyPlanToolGateway } from "@/components/student/study-plan-tool-gateway";
import { StructuredStudyPathSection } from "@/components/student/structured-study-path-section";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildAdaptiveRecommendations } from "@/lib/learner/adaptive-recommendations";
import {
  coalesceStudyPathKindParam,
  inferStudyPathKindFromLearnerProfile,
  loadStructuredStudyPathForSubscriber,
  STUDY_PATH_KINDS,
} from "@/lib/learner/structured-study-path";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

const KIND_LOOKUP = new Set<string>(STUDY_PATH_KINDS);

type Props = { searchParams: Promise<{ kind?: string }> };

export default async function StudyPlanPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return <p className="text-sm text-muted-foreground">{t("learner.entitlement.verifyFailedShort")}</p>;
  }
  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.studyPlan.kicker")}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">{t("learner.studyPlan.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.studyPlan.subtitle.locked")}</p>
        </div>
        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  let adaptive = null;
  let insightSnapshot = null;
  let structuredPath: Awaited<ReturnType<typeof loadStructuredStudyPathForSubscriber>> | null = null;
  let inferredStudyKind = inferStudyPathKindFromLearnerProfile({});
  let studyKindFromQuery: (typeof STUDY_PATH_KINDS)[number] | null = null;

  if (userId && entitlement.hasAccess && isDatabaseUrlConfigured()) {
    try {
      const [premiumSnapshot, topicPerf, userExam] = await Promise.all([
        loadPremiumDashboardSnapshot(userId, entitlement),
        loadUnifiedTopicPerformance(userId, entitlement, 12),
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            examDate: true,
            examDatePlanType: true,
            studyCadencePreference: true,
            tier: true,
            learnerPath: true,
          },
        }),
      ]);
      if (premiumSnapshot && topicPerf) {
        insightSnapshot = premiumSnapshot.insights;
        adaptive = buildAdaptiveRecommendations({
          examDatePlanType: userExam?.examDatePlanType,
          examDate: userExam?.examDate ?? null,
          readiness: premiumSnapshot.readiness,
          weakTopics: topicPerf.weakTopics,
          topicTrends: topicPerf.trends,
          streakDays: premiumSnapshot.studyStreakDays,
          lessonPct: premiumSnapshot.overallLessons.pct,
          lessonsCompleted: premiumSnapshot.overallLessons.completed,
          lessonsTotal: premiumSnapshot.overallLessons.total,
          studyCadencePreference: userExam?.studyCadencePreference,
          continueLesson: premiumSnapshot.continueLesson,
          recommendedQuizTopic: premiumSnapshot.recommendedQuizTopic,
          mockCount: premiumSnapshot.mockCount,
          practiceSessionCount: premiumSnapshot.practice.sessionCount,
          subscriberCountry: entitlement.country,
          preferredPathwayId:
            premiumSnapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? premiumSnapshot.pathways[0]?.pathwayId ?? null,
          availablePathwayIds: premiumSnapshot.pathways.map((p) => p.pathwayId),
        });
      }

      if (userExam) {
        inferredStudyKind = inferStudyPathKindFromLearnerProfile({
          tier: userExam.tier,
          learnerPathId: userExam.learnerPath,
        });
        const rawKind = sp.kind?.trim().toLowerCase() ?? "";
        if (rawKind && KIND_LOOKUP.has(rawKind)) {
          studyKindFromQuery = rawKind as (typeof STUDY_PATH_KINDS)[number];
        }
        const activeKind = coalesceStudyPathKindParam(sp.kind, inferredStudyKind);
        structuredPath = await loadStructuredStudyPathForSubscriber({
          kind: activeKind,
          pathwayId: userExam.learnerPath,
          userId,
          entitlement,
        });
      }
    } catch {
      adaptive = null;
      structuredPath = null;
    }
  }

  return (
    <main className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.studyPlan.kicker")}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">{t("learner.studyPlan.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.studyPlan.subtitle.subscriber")}</p>
      </div>

      <ExamPlanSettingsCard />

      {structuredPath ? (
        <StructuredStudyPathSection
          path={structuredPath}
          t={t}
          inferredKind={inferredStudyKind}
          kindFromQuery={studyKindFromQuery !== inferredStudyKind ? studyKindFromQuery : null}
        />
      ) : null}

      {adaptive ? <AdaptiveStudyOverview adaptive={adaptive} showHeading userId={userId} /> : null}

      {insightSnapshot ? <LearnerInsightEnginePanel insights={insightSnapshot} /> : null}

      <StudyPlanToolGateway />
    </main>
  );
}
