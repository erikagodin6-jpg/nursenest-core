import { auth } from "@/lib/auth";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { AdaptiveStudyOverview } from "@/components/student/adaptive-study-overview";
import { ExamPlanSettingsCard } from "@/components/student/exam-plan-settings-card";
import { LearnerInsightEnginePanel } from "@/components/student/learner-insight-engine-panel";
import { StudyPlanToolGateway } from "@/components/student/study-plan-tool-gateway";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildAdaptiveRecommendations } from "@/lib/learner/adaptive-recommendations";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";

export default async function StudyPlanPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return <p className="text-sm text-muted-foreground">Unable to verify subscription status right now. Refresh and try again.</p>;
  }
  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Study plan</h1>
        <p className="text-sm text-muted-foreground">Study-plan recommendations are available to subscribers.</p>
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  let adaptive = null;
  let insightSnapshot = null;

  if (userId && entitlement.hasAccess && isDatabaseUrlConfigured()) {
    try {
      const [premiumSnapshot, topicPerf, userExam] = await Promise.all([
        loadPremiumDashboardSnapshot(userId, entitlement),
        loadUnifiedTopicPerformance(userId, entitlement, 12),
        prisma.user.findUnique({
          where: { id: userId },
          select: { examDate: true, examDatePlanType: true, studyCadencePreference: true },
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
        });
      }
    } catch {
      adaptive = null;
    }
  }

  return (
    <main className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Exam-first prep</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Study plan</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Your exam date, cadence, and practice signals drive weekly targets and checkpoints. Optional AI weekly structure still
          lives below — enable with{" "}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">AI_STUDY_PLAN_ENABLED=true</code> when configured. Not medical
          advice.
        </p>
      </div>

      <ExamPlanSettingsCard />

      {adaptive ? <AdaptiveStudyOverview adaptive={adaptive} showHeading userId={userId} /> : null}

      {insightSnapshot ? <LearnerInsightEnginePanel insights={insightSnapshot} /> : null}

      <StudyPlanToolGateway />
    </main>
  );
}
