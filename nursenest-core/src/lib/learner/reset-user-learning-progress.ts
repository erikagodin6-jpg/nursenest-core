import "server-only";

import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

export { RESET_PROGRESS_CONFIRMATION_PHRASE, USER_PROGRESS_RESET_ACTION } from "@/lib/learner/reset-progress-confirmation";

/**
 * Deletes **learning progress** rows for `userId` only. Does not touch subscriptions, billing,
 * `User` identity/profile columns (name, email, tier, exam date prefs, study setting toggles), `LearnerNote`,
 * abuse-protection telemetry, or content catalog tables.
 *
 * **Ambiguous / intentionally skipped** (review before expanding):
 * - `LearnerSessionActivity`, `LearnerSessionIpObservation` — account-sharing heuristics, not learner-facing progress.
 * - `PremiumProtectionUserDay`, `ProtectionAbuseReview` — fraud / ops.
 * - `EmailNotificationLog`, `PrintableDownloadEvent`, `PrintableAccess` — transactional / commerce.
 * - `TrialDeviceBinding` — entitlement / trial integrity.
 * - `UserFeedbackReport` — support feedback, not progress.
 * - `critical_route_errors`, `fallback_delivery_events`, `exam_load_incidents` — reliability telemetry.
 * - `cross_section_events`, `provisional_access_log` — funnel / billing-adjacent records.
 */
export async function resetUserLearningProgress(
  db: PrismaClient,
  userId: string,
): Promise<{ ok: true }> {
  if (!userId || userId.length < 8) {
    throw new Error("resetUserLearningProgress: invalid userId");
  }

  await db.$transaction(async (tx) => {
    await tx.examSession.deleteMany({ where: { userId } });
    await tx.examAttempt.deleteMany({ where: { userId } });
    await tx.practiceTest.deleteMany({ where: { userId } });
    await tx.progress.deleteMany({ where: { userId } });

    await tx.flashcardProgress.deleteMany({ where: { userId } });
    await tx.flashcardStudySession.deleteMany({ where: { userId } });
    await tx.flashcardUserStats.delete({ where: { userId } }).catch(() => {
      /* optional 1:1 row */
    });

    await tx.verifiedStudyCardProgress.deleteMany({ where: { userId } });

    await tx.examQuestionPracticeAnswerAttempt.deleteMany({ where: { userId } });
    await tx.ecgVideoQuestionPracticeAnswerAttempt.deleteMany({ where: { userId } });

    await tx.userTopicStat.deleteMany({ where: { userId } });
    await tx.userRemediationEvent.deleteMany({ where: { userId } });
    await tx.userRemediationQueue.deleteMany({ where: { userId } });

    await tx.baselineAssessmentAttempt.deleteMany({ where: { userId } });

    await tx.clinicalScenarioSimulationRun.deleteMany({ where: { userId } });

    // Legacy snake_case models (catalog content untouched)
    await tx.accuracy_trends.deleteMany({ where: { user_id: userId } });
    await tx.analytics_events.deleteMany({ where: { user_id: userId } });
    await tx.custom_practice_sessions.deleteMany({ where: { user_id: userId } });
    await tx.exam_attempts.deleteMany({ where: { user_id: userId } });
    await tx.exam_followup_responses.deleteMany({ where: { user_id: userId } });
    await tx.lesson_bookmarks.deleteMany({ where: { user_id: userId } });
    await tx.practice_recommendations.deleteMany({ where: { user_id: userId } });
    await tx.readiness_history.deleteMany({ where: { user_id: userId } });
    await tx.spaced_repetition_cards.deleteMany({ where: { user_id: userId } });
    await tx.student_study_profiles.deleteMany({ where: { user_id: userId } });
    await tx.study_milestones.deleteMany({ where: { user_id: userId } });
    await tx.study_plan_schedule.deleteMany({ where: { user_id: userId } });
    await tx.test_bank_progress.deleteMany({ where: { user_id: userId } });
    await tx.topic_mastery_scores.deleteMany({ where: { user_id: userId } });
    await tx.unified_question_history.deleteMany({ where: { user_id: userId } });
    await tx.weak_area_alerts.deleteMany({ where: { user_id: userId } });
    await tx.flashcard_preview_usage.deleteMany({ where: { user_id: userId } });

    // Keep planner preference columns; drop cached generated plan only.
    await tx.exam_planner_settings.updateMany({
      where: { user_id: userId },
      data: {
        generated_plan: Prisma.JsonNull,
        planner_last_updated: null,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        freeQuestionViews: 0,
        freeLessonOpens: 0,
        bankQuestionsGradedCount: 0,
        bankQuestionsGradedUtcDay: null,
        baselineAssessmentSkippedAt: null,
        baselineAssessmentCompletedAt: null,
        baselineAssessmentSummary: Prisma.JsonNull,
      },
    });
  });

  return { ok: true };
}
