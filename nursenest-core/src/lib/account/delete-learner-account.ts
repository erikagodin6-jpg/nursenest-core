import "server-only";

import { Prisma, SubscriptionStatus, UserRole, type PrismaClient, type UserRole as UserRoleType } from "@prisma/client";
import {
  ACCOUNT_DELETION_BILLING_WARNING,
  ACCOUNT_DELETION_CONFIRMATION_PHRASE,
} from "@/lib/account/account-deletion-copy";
import { isStaffRole } from "@/lib/auth/staff-roles";
import { resetUserLearningProgress } from "@/lib/learner/reset-user-learning-progress";

export {
  ACCOUNT_DELETION_BILLING_WARNING,
  ACCOUNT_DELETION_CONFIRMATION_PHRASE,
  ACCOUNT_DELETION_RETAINED_RECORDS_COPY,
} from "@/lib/account/account-deletion-copy";

type DeleteLearnerAccountOptions = {
  sessionUserId: string;
  requestedUserId?: string | null;
  confirmation: string;
};

type DeleteLearnerAccountResult = {
  ok: true;
  signOutRequired: true;
  subscriptionCancellationRequired: boolean;
  message: string;
};

type DeletionUser = {
  id: string;
  email: string;
  role: UserRoleType;
};

export class AccountDeletionError extends Error {
  constructor(
    public readonly code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "STAFF_FORBIDDEN"
      | "ALREADY_DELETED"
      | "CONFIRMATION_REQUIRED",
    message: string,
  ) {
    super(message);
    this.name = "AccountDeletionError";
  }
}

export function buildDeletedAccountEmail(userId: string): string {
  const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48) || "unknown";
  return `deleted+${safeId}@nursenest.invalid`;
}

export function isDeletedAccountEmail(email: string | null | undefined): boolean {
  return typeof email === "string" && /^deleted\+[a-zA-Z0-9_-]+@nursenest\.invalid$/i.test(email);
}

function normalizeConfirmation(input: string): string {
  return input.trim();
}

function confirmationMatches(confirmation: string, email: string): boolean {
  const normalized = normalizeConfirmation(confirmation);
  return normalized === ACCOUNT_DELETION_CONFIRMATION_PHRASE || normalized.toLowerCase() === email.trim().toLowerCase();
}

export async function deleteLearnerAccount(
  db: PrismaClient,
  options: DeleteLearnerAccountOptions,
): Promise<DeleteLearnerAccountResult> {
  const sessionUserId = options.sessionUserId?.trim();
  if (!sessionUserId) {
    throw new AccountDeletionError("UNAUTHORIZED", "Sign in to delete your account.");
  }

  const requestedUserId = options.requestedUserId?.trim();
  if (requestedUserId && requestedUserId !== sessionUserId) {
    throw new AccountDeletionError("FORBIDDEN", "You can only delete your own account.");
  }

  const user = (await db.user.findUnique({
    where: { id: sessionUserId },
    select: { id: true, email: true, role: true },
  })) as DeletionUser | null;

  if (!user) {
    throw new AccountDeletionError("NOT_FOUND", "Account not found.");
  }

  if (isDeletedAccountEmail(user.email)) {
    throw new AccountDeletionError("ALREADY_DELETED", "This account has already been deleted.");
  }

  if (isStaffRole(user.role)) {
    throw new AccountDeletionError("STAFF_FORBIDDEN", "Staff and admin accounts cannot be deleted from the learner endpoint.");
  }

  if (user.role !== UserRole.LEARNER) {
    throw new AccountDeletionError("STAFF_FORBIDDEN", "Only learner accounts can be deleted from this endpoint.");
  }

  if (!confirmationMatches(options.confirmation, user.email)) {
    throw new AccountDeletionError("CONFIRMATION_REQUIRED", "Type DELETE or your email address to confirm.");
  }

  await resetUserLearningProgress(db, sessionUserId);

  await db.$transaction(async (tx) => {
    await tx.subscription.updateMany({
      where: { userId: sessionUserId },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelAtPeriodEnd: true,
        currentPeriodEnd: new Date(0),
        trialEnd: null,
      },
    });

    await tx.learnerSessionActivity.updateMany({
      where: { userId: sessionUserId, revokedAt: null },
      data: { revokedAt: new Date(), suspiciousReason: "account_deleted" },
    });

    await tx.passwordResetToken.deleteMany({ where: { userId: sessionUserId } });
    await tx.emailVerificationToken.deleteMany({ where: { userId: sessionUserId } });
    await tx.learnerNote.deleteMany({ where: { userId: sessionUserId } });

    await tx.user.update({
      where: { id: sessionUserId },
      data: {
        email: buildDeletedAccountEmail(sessionUserId),
        username: null,
        name: "Deleted account",
        firstName: null,
        lastName: null,
        displayName: null,
        passwordHash: null,
        emailVerified: false,
        normalizedEmail: null,
        authProvider: "deleted",
        lastLoginIp: null,
        signupIp: null,
        trialStatus: "EXHAUSTED",
        trialEndsAt: null,
        trialStartedAt: null,
        trialUsedAt: null,
        onboardingCompletedAt: null,
        examDate: null,
        examDatePlanType: null,
        examGoalSetAt: null,
        targetExamPathwayId: null,
        studyCadencePreference: null,
        dailyStudyMinutes: null,
        studyGoal: null,
        enableAdaptivePlan: false,
        enableSpacedRepetition: false,
        enableConfidenceTracking: false,
        enablePrePostQuizzes: false,
        showHeatmap: false,
        showAdvancedInsights: false,
        enableWeaknessAlerts: false,
        enableDecayAlerts: false,
        preferredSessionLength: null,
        lessonStudyLoopEnabled: false,
        emailEngagementOptOut: true,
        legalPoliciesAcceptedAt: null,
        legalPoliciesVersion: null,
        baselineAssessmentSummary: Prisma.JsonNull,
        credentialVersion: { increment: 1 },
      },
    });
  });

  return {
    ok: true,
    signOutRequired: true,
    subscriptionCancellationRequired: true,
    message: ACCOUNT_DELETION_BILLING_WARNING,
  };
}
