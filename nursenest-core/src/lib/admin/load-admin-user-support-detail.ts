/**
 * Read-only learner/support snapshot for admin troubleshooting.
 * Never returns password hashes or full Stripe identifiers.
 */
import { Prisma, UserRole } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { resolveEntitlement, type AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isAccountSharingMonitorEnabled } from "@/lib/security/account-sharing-env";
import { buildAccountActivityEvidence, type AccountActivityEvidence } from "@/lib/admin/account-activity-evidence";

function maskStripeRef(id: string | null | undefined): string | null {
  if (!id?.trim()) return null;
  const s = id.trim();
  if (s.length <= 10) return "••••";
  return `${s.slice(0, 4)}…${s.slice(-6)}`;
}

const pathwayName = (id: string | null): string | null => {
  if (!id) return null;
  return EXAM_PATHWAYS.find((p) => p.id === id)?.displayName ?? id;
};

export type AdminUserSupportDetail =
  | { found: false }
  | {
      found: true;
      user: {
        id: string;
        email: string;
        username: string | null;
        name: string;
        role: string;
        country: string;
        tier: string;
        examFocus: string | null;
        learnerPath: string | null;
        targetExamPathwayId: string | null;
        targetPathwayLabel: string | null;
        alliedProfessionKey: string | null;
        studyGoal: string | null;
        dailyStudyMinutes: number | null;
        studyCadencePreference: string | null;
        examDate: string | null;
        examDatePlanType: string | null;
        preNursingTargetDate: string | null;
        preNursingDatePlanType: string | null;
        preNursingFuturePathwayHint: string | null;
        trialStatus: string;
        trialStartedAt: string | null;
        trialEndsAt: string | null;
        trialUsedAt: string | null;
        freeQuestionViews: number;
        freeLessonOpens: number;
        onboardingCompletedAt: string | null;
        baselineAssessmentCompletedAt: string | null;
        baselineAssessmentSkippedAt: string | null;
        legalPoliciesAcceptedAt: string | null;
        legalPoliciesVersion: string | null;
        createdAt: string;
        updatedAt: string;
      };
      entitlement: AccessScope;
      subscriptions: Array<{
        id: string;
        status: string;
        planTier: string | null;
        planCountry: string | null;
        stripeCustomerMasked: string | null;
        stripeSubscriptionMasked: string | null;
        createdAt: string;
        updatedAt: string;
      }>;
      accountSafety: {
        hasPassword: boolean;
        credentialVersion: number;
        activePasswordResetTokens: number;
        trialDeviceBindings: number;
      };
      accountSharingTelemetry: {
        monitorEnabled: boolean;
        activeSessionSlots7d: number;
        distinctIpHashes24h: number;
        lastActivityAt: string | null;
        recentSoftFlags: Array<{
          createdAt: string;
          reason: string;
          score: number;
          dismissedAt: string | null;
        }>;
      };
      activityEvidence: AccountActivityEvidence | null;
      usage: {
        examAttempts: number;
        examSessions: number;
        examSessionsWithAdaptiveState: number;
        practiceTests: number;
        practiceTestsWithAdaptiveState: number;
        progressRows: number;
        progressCompleted: number;
        progressEngaged: number;
        flashcardProgressRows: number;
        flashcardStudySessions: number;
        topicStatRows: number;
        learnerNotesCount: number;
      };
      topicTop: Array<{
        topic: string;
        correctCount: number;
        wrongCount: number;
        lastAttemptAt: string | null;
      }>;
      recent: {
        examAttempts: Array<{
          id: string;
          createdAt: string;
          score: number;
          total: number;
          examTitle: string;
        }>;
        practiceTests: Array<{
          id: string;
          title: string | null;
          status: string;
          updatedAt: string;
          hasAdaptiveState: boolean;
        }>;
        examSessions: Array<{
          id: string;
          status: string;
          examMode: string;
          updatedAt: string;
          hasAdaptiveState: boolean;
        }>;
        progress: Array<{
          lessonId: string;
          completed: boolean;
          engagedAt: string | null;
          updatedAt: string;
        }>;
      };
      notifications: Array<{ kind: string; createdAt: string }>;
      supportNotes: string[];
    };

export async function loadAdminUserSupportDetail(userId: string): Promise<AdminUserSupportDetail> {
  if (!isDatabaseUrlConfigured() || !userId.trim()) {
    return { found: false };
  }

  try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          country: true,
          tier: true,
          passwordHash: true,
          credentialVersion: true,
          examFocus: true,
          learnerPath: true,
          targetExamPathwayId: true,
          alliedProfessionKey: true,
          studyGoal: true,
          dailyStudyMinutes: true,
          studyCadencePreference: true,
          examDate: true,
          examDatePlanType: true,
          preNursingTargetDate: true,
          preNursingDatePlanType: true,
          preNursingFuturePathwayHint: true,
          trialStatus: true,
          trialStartedAt: true,
          trialEndsAt: true,
          trialUsedAt: true,
          freeQuestionViews: true,
          freeLessonOpens: true,
          onboardingCompletedAt: true,
          baselineAssessmentCompletedAt: true,
          baselineAssessmentSkippedAt: true,
          legalPoliciesAcceptedAt: true,
          legalPoliciesVersion: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return { found: false };
      }

      const now = new Date();
      const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const entitlement = await resolveEntitlement(user.id);

      const [
        subscriptions,
        examAttemptsCount,
        examSessionsCount,
        examSessionsAdaptiveCount,
        practiceTestsCount,
        practiceTestsAdaptiveCount,
        progressStats,
        flashcardProgressCount,
        flashcardSessionCount,
        topicStatCount,
        learnerNotesCount,
        trialBindings,
        resetTokens,
        recentAttempts,
        recentPractice,
        recentSessions,
        recentProgress,
        topicTop,
        emailNotifs,
        sharingIpGroups,
        sharingDeviceGroups,
        sharingLastActivity,
        sharingAbuseReviews,
        activityEvidence,
      ] = await Promise.all([
        prisma.subscription.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
            planTier: true,
            planCountry: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.examAttempt.count({ where: { userId: user.id } }),
        prisma.examSession.count({ where: { userId: user.id } }),
        prisma.examSession.count({
          where: {
            userId: user.id,
            adaptiveState: { not: Prisma.JsonNull },
          },
        }),
        prisma.practiceTest.count({ where: { userId: user.id } }),
        prisma.practiceTest.count({
          where: {
            userId: user.id,
            adaptiveState: { not: Prisma.JsonNull },
          },
        }),
        prisma.progress.groupBy({
          by: ["completed"],
          where: { userId: user.id },
          _count: { _all: true },
        }),
        prisma.flashcardProgress.count({ where: { userId: user.id } }),
        prisma.flashcardStudySession.count({ where: { userId: user.id } }),
        prisma.userTopicStat.count({ where: { userId: user.id } }),
        prisma.learnerNote.count({ where: { userId: user.id } }),
        prisma.trialDeviceBinding.count({ where: { userId: user.id } }),
        prisma.passwordResetToken.count({
          where: { userId: user.id, expiresAt: { gt: now } },
        }),
        prisma.examAttempt.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 60,
          select: {
            id: true,
            createdAt: true,
            score: true,
            total: true,
            exam: { select: { title: true } },
          },
        }),
        prisma.practiceTest.findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
          take: 12,
          select: {
            id: true,
            title: true,
            status: true,
            updatedAt: true,
            adaptiveState: true,
          },
        }),
        prisma.examSession.findMany({
          where: { userId: user.id },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 12,
          select: {
            id: true,
            status: true,
            examMode: true,
            updatedAt: true,
            adaptiveState: true,
          },
        }),
        prisma.progress.findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
          take: 12,
          select: {
            lessonId: true,
            completed: true,
            engagedAt: true,
            updatedAt: true,
          },
        }),
        prisma.userTopicStat.findMany({
          where: { userId: user.id },
          orderBy: { lastAttemptAt: "desc" },
          take: 12,
          select: {
            topic: true,
            correctCount: true,
            wrongCount: true,
            lastAttemptAt: true,
          },
        }),
        prisma.emailNotificationLog.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 15,
          select: { kind: true, createdAt: true },
        }),
        prisma.learnerSessionIpObservation.groupBy({
          by: ["ipHash"],
          where: { userId: user.id, lastSeenAt: { gte: ago24h } },
        }),
        prisma.learnerSessionActivity.groupBy({
          by: ["sessionKeyHash"],
          where: { userId: user.id, lastSeenAt: { gte: ago7d }, revokedAt: null },
        }),
        prisma.learnerSessionActivity.findFirst({
          where: { userId: user.id },
          orderBy: { lastSeenAt: "desc" },
          select: { lastSeenAt: true },
        }),
        prisma.protectionAbuseReview.findMany({
          where: { userId: user.id, reason: "account_sharing_soft" },
          orderBy: { createdAt: "desc" },
          take: 8,
          select: { createdAt: true, reason: true, score: true, dismissedAt: true },
        }),
        buildAccountActivityEvidence(user.id),
      ]);

      let completedProgress = 0;
      let incompleteProgress = 0;
      let engaged = 0;
      for (const g of progressStats) {
        if (g.completed) completedProgress = g._count._all;
        else incompleteProgress = g._count._all;
      }
      const progressRows = completedProgress + incompleteProgress;
      const progressEngaged = await prisma.progress.count({
        where: { userId: user.id, engagedAt: { not: null } },
      });

      const supportNotes: string[] = [
        "Account operations on this page require explicit dry-run/confirm intent and are logged through admin API gates.",
        "Stripe IDs are masked. Local access revocation does not replace Stripe-side billing cancellation.",
      ];
      if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
        supportNotes.push("This account has full admin role — treat changes with extra care.");
      }

      return {
        found: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          country: user.country,
          tier: user.tier,
          examFocus: user.examFocus,
          learnerPath: user.learnerPath,
          targetExamPathwayId: user.targetExamPathwayId,
          targetPathwayLabel: pathwayName(user.targetExamPathwayId),
          alliedProfessionKey: user.alliedProfessionKey,
          studyGoal: user.studyGoal,
          dailyStudyMinutes: user.dailyStudyMinutes,
          studyCadencePreference: user.studyCadencePreference,
          examDate: user.examDate?.toISOString() ?? null,
          examDatePlanType: user.examDatePlanType ?? null,
          preNursingTargetDate: user.preNursingTargetDate?.toISOString() ?? null,
          preNursingDatePlanType: user.preNursingDatePlanType ?? null,
          preNursingFuturePathwayHint: user.preNursingFuturePathwayHint,
          trialStatus: user.trialStatus,
          trialStartedAt: user.trialStartedAt?.toISOString() ?? null,
          trialEndsAt: user.trialEndsAt?.toISOString() ?? null,
          trialUsedAt: user.trialUsedAt?.toISOString() ?? null,
          freeQuestionViews: user.freeQuestionViews,
          freeLessonOpens: user.freeLessonOpens,
          onboardingCompletedAt: user.onboardingCompletedAt?.toISOString() ?? null,
          baselineAssessmentCompletedAt: user.baselineAssessmentCompletedAt?.toISOString() ?? null,
          baselineAssessmentSkippedAt: user.baselineAssessmentSkippedAt?.toISOString() ?? null,
          legalPoliciesAcceptedAt: user.legalPoliciesAcceptedAt?.toISOString() ?? null,
          legalPoliciesVersion: user.legalPoliciesVersion,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        entitlement,
        subscriptions: subscriptions.map((s) => ({
          id: s.id,
          status: s.status,
          planTier: s.planTier,
          planCountry: s.planCountry,
          stripeCustomerMasked: maskStripeRef(s.stripeCustomerId),
          stripeSubscriptionMasked: maskStripeRef(s.stripeSubscriptionId),
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
        })),
        accountSafety: {
          hasPassword: Boolean(user.passwordHash),
          credentialVersion: user.credentialVersion,
          activePasswordResetTokens: resetTokens,
          trialDeviceBindings: trialBindings,
        },
        accountSharingTelemetry: {
          monitorEnabled: isAccountSharingMonitorEnabled(),
          activeSessionSlots7d: sharingDeviceGroups.length,
          distinctIpHashes24h: sharingIpGroups.length,
          lastActivityAt: sharingLastActivity?.lastSeenAt.toISOString() ?? null,
          recentSoftFlags: sharingAbuseReviews.map((r) => ({
            createdAt: r.createdAt.toISOString(),
            reason: r.reason,
            score: r.score,
            dismissedAt: r.dismissedAt?.toISOString() ?? null,
          })),
        },
        activityEvidence,
        usage: {
          examAttempts: examAttemptsCount,
          examSessions: examSessionsCount,
          examSessionsWithAdaptiveState: examSessionsAdaptiveCount,
          practiceTests: practiceTestsCount,
          practiceTestsWithAdaptiveState: practiceTestsAdaptiveCount,
          progressRows,
          progressCompleted: completedProgress,
          progressEngaged,
          flashcardProgressRows: flashcardProgressCount,
          flashcardStudySessions: flashcardSessionCount,
          topicStatRows: topicStatCount,
          learnerNotesCount,
        },
        topicTop: topicTop.map((t) => ({
          topic: t.topic,
          correctCount: t.correctCount,
          wrongCount: t.wrongCount,
          lastAttemptAt: t.lastAttemptAt?.toISOString() ?? null,
        })),
        recent: {
          examAttempts: recentAttempts.slice(0, 10).map((a) => ({
            id: a.id,
            createdAt: a.createdAt.toISOString(),
            score: a.score,
            total: a.total,
            examTitle: a.exam?.title ?? "(exam removed)",
          })),
          practiceTests: recentPractice.slice(0, 10).map((p) => ({
            id: p.id,
            title: p.title,
            status: p.status,
            updatedAt: p.updatedAt.toISOString(),
            hasAdaptiveState: p.adaptiveState != null,
          })),
          examSessions: recentSessions.slice(0, 10).map((s) => ({
            id: s.id,
            status: s.status,
            examMode: s.examMode,
            updatedAt: s.updatedAt.toISOString(),
            hasAdaptiveState: s.adaptiveState != null,
          })),
          progress: recentProgress.map((p) => ({
            lessonId: p.lessonId,
            completed: p.completed,
            engagedAt: p.engagedAt?.toISOString() ?? null,
            updatedAt: p.updatedAt.toISOString(),
          })),
        },
        notifications: emailNotifs.map((n) => ({
          kind: n.kind,
          createdAt: n.createdAt.toISOString(),
        })),
        supportNotes,
      };
  } catch {
    return { found: false };
  }
}
