import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { withRetry } from "@/lib/resilience/with-retry";

const LEARNER_REQUEST_USER_SELECT = {
  alliedProfessionKey: true,
  baselineAssessmentCompletedAt: true,
  baselineAssessmentSkippedAt: true,
  bankQuestionsGradedCount: true,
  bankQuestionsGradedUtcDay: true,
  country: true,
  credentialVersion: true,
  dailyStudyMinutes: true,
  displayName: true,
  email: true,
  emailEngagementOptOut: true,
  enableAdaptivePlan: true,
  enableConfidenceTracking: true,
  enableDecayAlerts: true,
  enablePrePostQuizzes: true,
  enableSpacedRepetition: true,
  enableWeaknessAlerts: true,
  examDate: true,
  examDatePlanType: true,
  examFocus: true,
  examGoalSetAt: true,
  firstName: true,
  lastName: true,
  learnerPath: true,
  measurementPreference: true,
  name: true,
  onboardingCompletedAt: true,
  preferredSessionLength: true,
  role: true,
  showAdvancedInsights: true,
  showHeatmap: true,
  studyCadencePreference: true,
  studyGoal: true,
  dailyQuestionGoal: true,
  lessonStudyLoopEnabled: true,
  targetExamPathwayId: true,
  tier: true,
  trialEndsAt: true,
  trialStatus: true,
} as const;

export type LearnerRequestUser = Awaited<
  ReturnType<typeof loadLearnerRequestUser>
>;

async function loadLearnerRequestUserCore(userId: string) {
  if (!userId || !isDatabaseUrlConfigured()) return null;
  return withRetry(() =>
    prisma.user.findUnique({
      where: { id: userId },
      select: LEARNER_REQUEST_USER_SELECT,
    }),
  );
}

/**
 * Request-scoped learner profile row.
 *
 * Keep this select broad enough for entitlement, learnerPath, measurement
 * preference, onboarding, and lightweight identity display so one request does
 * not perform several narrow `User.findUnique` calls for the same account.
 */
export const loadLearnerRequestUser = cache(loadLearnerRequestUserCore);
