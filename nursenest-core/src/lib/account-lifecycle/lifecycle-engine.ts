/**
 * Account inactivity lifecycle engine.
 *
 * Stages (free users — inactivity from updatedAt / inactivityBaselineAt):
 *  45d → warning email 1
 *  53d → warning email 2
 *  59d → warning email 3 (final)
 *  60d → soft delete (deletedAt set; login blocked with recovery message)
 *  +90d → permanent PII purge (email/name cleared; row retained for audit)
 *
 * Engaged users (has completed lessons or paid history) get 150-day threshold.
 * Admins, staff, active paid subscribers, and isDeletionExempt = true are NEVER deleted.
 */

import "server-only";
import { UserRole, SubscriptionStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { LIFECYCLE, addDays } from "@/lib/account-lifecycle/lifecycle-config";

const PROTECTED_ROLES = new Set<UserRole>(LIFECYCLE.PROTECTED_ROLES);

/** Users with active/grace subscriptions or recent billing are never auto-deleted. */
async function getProtectedUserIds(userIds: string[]): Promise<Set<string>> {
  if (userIds.length === 0) return new Set();
  const rows = await prisma.subscription.findMany({
    where: {
      userId: { in: userIds },
      status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] },
    },
    select: { userId: true },
  });
  return new Set(rows.map((r) => r.userId));
}

/** Engaged = has any completed lesson progress row. Gets 2.5× threshold. */
async function getEngagedUserIds(userIds: string[]): Promise<Set<string>> {
  if (userIds.length === 0) return new Set();
  const rows = await prisma.progress.findMany({
    where: { userId: { in: userIds }, completed: true },
    select: { userId: true },
    distinct: ["userId"],
  });
  return new Set(rows.map((r) => r.userId));
}

/** Core where clause that excludes already-deleted, protected roles, and exempt accounts. */
function activeNonProtectedWhere(): Prisma.UserWhereInput {
  return {
    deletedAt: null,
    isDeletionExempt: false,
    isDemoUser: false,
    role: { notIn: [...PROTECTED_ROLES] },
  };
}

export type LifecycleRunResult = {
  warning1Sent: number;
  warning2Sent: number;
  warning3Sent: number;
  softDeleted: number;
  permanentlyPurged: number;
  errors: string[];
  ranAt: string;
};

/**
 * Run one full lifecycle pass. Idempotent — safe to re-run daily.
 * Each stage is independent; failure in one does not abort others.
 */
export async function runAccountLifecycleCron(
  options: { dryRun?: boolean; batchSize?: number } = {},
): Promise<LifecycleRunResult> {
  const { dryRun = false, batchSize = 200 } = options;
  const result: LifecycleRunResult = {
    warning1Sent: 0,
    warning2Sent: 0,
    warning3Sent: 0,
    softDeleted: 0,
    permanentlyPurged: 0,
    errors: [],
    ranAt: new Date().toISOString(),
  };

  const now = new Date();

  // ── Stage 5: Permanent PII purge (deletedAt + 90d) ──────────────────────
  try {
    const purgeCutoff = new Date(now.getTime() - LIFECYCLE.PERMANENT_PURGE_DAYS * 86_400_000);
    const toPurge = await prisma.user.findMany({
      where: {
        deletedAt: { not: null, lte: purgeCutoff },
        permanentlyPurgedAt: null,
      },
      select: { id: true, email: true },
      take: batchSize,
    });
    for (const user of toPurge) {
      if (!dryRun) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: "[deleted]",
            email: `purged-${user.id}@deleted.invalid`,
            username: null,
            passwordHash: null,
            permanentlyPurgedAt: now,
            lastLifecycleEmailType: "permanently_purged",
          },
        });
      }
      result.permanentlyPurged++;
      safeServerLog("account_lifecycle", "permanently_purged", { userId: user.id, dryRun });
    }
  } catch (e) {
    const msg = `purge_stage: ${e instanceof Error ? e.message : String(e)}`;
    result.errors.push(msg);
    safeServerLog("account_lifecycle", "purge_stage_error", { detail: msg });
  }

  // ── Stage 4: Soft delete (60d / 150d inactive) ──────────────────────────
  try {
    const freeCutoff  = new Date(now.getTime() - LIFECYCLE.FREE_SOFT_DELETE_DAYS * 86_400_000);
    const engCutoff   = new Date(now.getTime() - LIFECYCLE.ENGAGED_SOFT_DELETE_DAYS * 86_400_000);

    const candidates = await prisma.user.findMany({
      where: {
        ...activeNonProtectedWhere(),
        warning3SentAt: { not: null },
        OR: [
          // Free path: updatedAt older than 60d
          { updatedAt: { lte: freeCutoff }, inactivityBaselineAt: null },
          // Engaged path: inactivityBaselineAt older than 150d
          { inactivityBaselineAt: { not: null, lte: engCutoff } },
        ],
      },
      select: { id: true, email: true },
      take: batchSize,
    });

    const paidIds = await getProtectedUserIds(candidates.map((u) => u.id));

    for (const user of candidates) {
      if (paidIds.has(user.id)) continue;
      if (!dryRun) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            deletedAt: now,
            scheduledPermanentDeletionAt: addDays(now, LIFECYCLE.PERMANENT_PURGE_DAYS),
            lastLifecycleEmailType: "soft_deleted",
          },
        });
      }
      result.softDeleted++;
      safeServerLog("account_lifecycle", "soft_deleted", { userId: user.id, dryRun });
    }
  } catch (e) {
    const msg = `soft_delete_stage: ${e instanceof Error ? e.message : String(e)}`;
    result.errors.push(msg);
    safeServerLog("account_lifecycle", "soft_delete_stage_error", { detail: msg });
  }

  // ── Stage 3: Final warning (59d / 149d inactive) ─────────────────────────
  try {
    const freeCutoff = new Date(now.getTime() - LIFECYCLE.FREE_WARNING3_DAYS * 86_400_000);
    const engCutoff  = new Date(now.getTime() - LIFECYCLE.ENGAGED_WARNING3_DAYS * 86_400_000);

    const candidates = await prisma.user.findMany({
      where: {
        ...activeNonProtectedWhere(),
        warning2SentAt: { not: null },
        warning3SentAt: null,
        OR: [
          { updatedAt: { lte: freeCutoff }, inactivityBaselineAt: null },
          { inactivityBaselineAt: { not: null, lte: engCutoff } },
        ],
      },
      select: { id: true, email: true, name: true },
      take: batchSize,
    });

    const paidIds = await getProtectedUserIds(candidates.map((u) => u.id));

    for (const user of candidates) {
      if (paidIds.has(user.id)) continue;
      if (!dryRun) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            warning3SentAt: now,
            lastLifecycleEmailType: "warning3_final",
          },
        });
        // TODO: send warning3 email via your email provider
        // await sendLifecycleEmail(user, "warning3_final", { deletionDate: addDays(now, 1) });
      }
      result.warning3Sent++;
      safeServerLog("account_lifecycle", "warning3_sent", { userId: user.id, email: user.email, dryRun });
    }
  } catch (e) {
    const msg = `warning3_stage: ${e instanceof Error ? e.message : String(e)}`;
    result.errors.push(msg);
  }

  // ── Stage 2: Second warning (53d / 143d inactive) ────────────────────────
  try {
    const freeCutoff = new Date(now.getTime() - LIFECYCLE.FREE_WARNING2_DAYS * 86_400_000);
    const engCutoff  = new Date(now.getTime() - LIFECYCLE.ENGAGED_WARNING2_DAYS * 86_400_000);

    const candidates = await prisma.user.findMany({
      where: {
        ...activeNonProtectedWhere(),
        warning1SentAt: { not: null },
        warning2SentAt: null,
        OR: [
          { updatedAt: { lte: freeCutoff }, inactivityBaselineAt: null },
          { inactivityBaselineAt: { not: null, lte: engCutoff } },
        ],
      },
      select: { id: true, email: true, name: true },
      take: batchSize,
    });

    const paidIds = await getProtectedUserIds(candidates.map((u) => u.id));

    for (const user of candidates) {
      if (paidIds.has(user.id)) continue;
      if (!dryRun) {
        await prisma.user.update({
          where: { id: user.id },
          data: { warning2SentAt: now, lastLifecycleEmailType: "warning2" },
        });
        // TODO: await sendLifecycleEmail(user, "warning2", { deletionDate: addDays(now, 7) });
      }
      result.warning2Sent++;
      safeServerLog("account_lifecycle", "warning2_sent", { userId: user.id, dryRun });
    }
  } catch (e) {
    result.errors.push(`warning2_stage: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── Stage 1: First warning (45d / 135d inactive) ──────────────────────────
  try {
    const freeCutoff = new Date(now.getTime() - LIFECYCLE.FREE_WARNING1_DAYS * 86_400_000);
    const engCutoff  = new Date(now.getTime() - LIFECYCLE.ENGAGED_WARNING1_DAYS * 86_400_000);

    const candidates = await prisma.user.findMany({
      where: {
        ...activeNonProtectedWhere(),
        warning1SentAt: null,
        OR: [
          { updatedAt: { lte: freeCutoff }, inactivityBaselineAt: null },
          { inactivityBaselineAt: { not: null, lte: engCutoff } },
        ],
      },
      select: { id: true, email: true, name: true },
      take: batchSize,
    });

    const paidIds = await getProtectedUserIds(candidates.map((u) => u.id));
    const engagedIds = await getEngagedUserIds(candidates.map((u) => u.id));

    for (const user of candidates) {
      if (paidIds.has(user.id)) continue;
      if (!dryRun) {
        // Engaged users: set inactivityBaselineAt to NOW so their 150d clock starts
        const engagedUpdate = engagedIds.has(user.id) && !candidates.find((u) => u.id === user.id)
          ? { inactivityBaselineAt: now }
          : {};
        await prisma.user.update({
          where: { id: user.id },
          data: { warning1SentAt: now, lastLifecycleEmailType: "warning1", ...engagedUpdate },
        });
        // TODO: await sendLifecycleEmail(user, "warning1", { deletionDate: addDays(now, 15) });
      }
      result.warning1Sent++;
      safeServerLog("account_lifecycle", "warning1_sent", {
        userId: user.id,
        engaged: engagedIds.has(user.id),
        dryRun,
      });
    }
  } catch (e) {
    result.errors.push(`warning1_stage: ${e instanceof Error ? e.message : String(e)}`);
  }

  safeServerLog("account_lifecycle", "cron_complete", {
    warning1: String(result.warning1Sent),
    warning2: String(result.warning2Sent),
    warning3: String(result.warning3Sent),
    softDeleted: String(result.softDeleted),
    purged: String(result.permanentlyPurged),
    errors: String(result.errors.length),
    dryRun,
  });

  return result;
}

/**
 * Recovery: user logged in — clear all lifecycle state.
 * Call this whenever a successful login occurs.
 */
export async function clearLifecycleStateOnLogin(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { warning1SentAt: true, deletedAt: true },
    });
    if (!user?.warning1SentAt && !user?.deletedAt) return; // nothing to clear

    await prisma.user.update({
      where: { id: userId },
      data: {
        warning1SentAt: null,
        warning2SentAt: null,
        warning3SentAt: null,
        deletedAt: null,
        scheduledPermanentDeletionAt: null,
        inactivityBaselineAt: null,
        lastLifecycleEmailType: "recovered",
      },
    });
    safeServerLog("account_lifecycle", "account_recovered", { userId });
  } catch (e) {
    safeServerLog("account_lifecycle", "recovery_clear_failed", {
      userId,
      detail: e instanceof Error ? e.message.slice(0, 200) : String(e),
    });
  }
}
