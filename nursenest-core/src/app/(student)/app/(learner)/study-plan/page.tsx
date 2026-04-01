import { auth } from "@/lib/auth";
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

  let adaptive = null;
  let insightSnapshot = null;

  if (
    userId &&
    entitlement !== "error" &&
    entitlement.hasAccess &&
    isDatabaseUrlConfigured()
  ) {
    try {
      const [premiumSnapshot, topicPerf, userExam] = await Promise.all([
        loadPremiumDashboardSnapshot(userId, entitlement),
        loadUnifiedTopicPerformance(userId, entitlement, 12),
        prisma.user.findUnique({
          where: { id: userId },
          select: { examDate: true, examDatePlanType: true },
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
    <main className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Study plan</h1>
        <p className="mt-2 text-sm text-muted">
          Date-aware priorities from your performance, plus optional AI-assisted weekly structure. Enable server-side AI with{" "}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">AI_STUDY_PLAN_ENABLED=true</code> and an OpenAI-compatible API
          key. Not medical advice.
        </p>
      </div>

      {entitlement !== "error" && entitlement.hasAccess ? <ExamPlanSettingsCard /> : null}

      {insightSnapshot ? <LearnerInsightEnginePanel insights={insightSnapshot} /> : null}

      {adaptive ? <AdaptiveStudyOverview adaptive={adaptive} /> : null}

      <StudyPlanToolGateway />
    </main>
  );
}
