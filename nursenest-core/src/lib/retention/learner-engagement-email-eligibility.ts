import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { LEARNER_ENGAGEMENT_EMAIL_KINDS } from "@/lib/retention/learner-engagement-email-kinds";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const MS_DAY = 24 * 60 * 60 * 1000;

/** Max engagement emails (any kind in {@link LEARNER_ENGAGEMENT_EMAIL_KINDS}) per rolling week. */
export const ENGAGEMENT_EMAIL_GLOBAL_WEEKLY_CAP = 4;

export type LearnerEngagementEmailUserRow = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isDemoUser: boolean;
  emailEngagementOptOut: boolean;
  emailVerified: boolean;
  enableWeaknessAlerts: boolean | null;
  examFocus: string | null;
  studyGoal: string | null;
  dailyStudyMinutes: number | null;
  tier: import("@prisma/client").TierCode;
  learnerPath: string | null;
  alliedProfessionKey: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
  updatedAt: Date;
};

export const learnerEngagementEmailUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isDemoUser: true,
  emailEngagementOptOut: true,
  emailVerified: true,
  enableWeaknessAlerts: true,
  examFocus: true,
  studyGoal: true,
  dailyStudyMinutes: true,
  tier: true,
  learnerPath: true,
  alliedProfessionKey: true,
  createdAt: true,
  lastLoginAt: true,
  updatedAt: true,
} as const;

export function isLearnerAccountForEngagementEmails(row: Pick<LearnerEngagementEmailUserRow, "role" | "isDemoUser">): boolean {
  if (row.isDemoUser) return false;
  if (row.role !== UserRole.LEARNER) return false;
  return true;
}

export function shouldSkipEngagementEmailForUserRow(
  row: Pick<
    LearnerEngagementEmailUserRow,
    "emailEngagementOptOut" | "emailVerified" | "email" | "role" | "isDemoUser"
  >,
  opts?: { requireVerifiedEmail?: boolean },
): string | null {
  if (!isLearnerAccountForEngagementEmails(row)) return "not_learner_or_demo";
  if (row.emailEngagementOptOut) return "opt_out";
  if (opts?.requireVerifiedEmail && !row.emailVerified) return "email_unverified";
  if (!row.email?.trim()) return "no_email";
  return null;
}

export async function countEngagementEmailsSince(userId: string, since: Date): Promise<number> {
  return prisma.emailNotificationLog.count({
    where: {
      userId,
      createdAt: { gte: since },
      kind: { in: [...LEARNER_ENGAGEMENT_EMAIL_KINDS] },
    },
  });
}

export async function engagementGlobalCapReached(userId: string): Promise<boolean> {
  const since = new Date(Date.now() - 7 * MS_DAY);
  const n = await countEngagementEmailsSince(userId, since);
  return n >= ENGAGEMENT_EMAIL_GLOBAL_WEEKLY_CAP;
}

/**
 * Central gate before sending any learner engagement email.
 * Returns a skip reason string, or null when send is allowed (caller still applies per-kind cooldowns).
 */
export async function gateLearnerEngagementEmailSend(args: {
  userId: string;
  /** When true, skip if weekly cap already hit (welcome sequence may bypass via caller). */
  enforceWeeklyCap?: boolean;
  requireVerifiedEmail?: boolean;
}): Promise<{ ok: true; user: LearnerEngagementEmailUserRow } | { ok: false; reason: string }> {
  const row = await prisma.user.findUnique({
    where: { id: args.userId },
    select: learnerEngagementEmailUserSelect,
  });
  if (!row) return { ok: false, reason: "user_not_found" };
  const skip = shouldSkipEngagementEmailForUserRow(row, { requireVerifiedEmail: args.requireVerifiedEmail });
  if (skip) return { ok: false, reason: skip };
  if (args.enforceWeeklyCap && (await engagementGlobalCapReached(args.userId))) {
    safeServerLog("retention", "engagement_skipped_weekly_cap", { userIdPrefix: args.userId.slice(0, 8) });
    return { ok: false, reason: "weekly_cap" };
  }
  return { ok: true, user: row };
}
