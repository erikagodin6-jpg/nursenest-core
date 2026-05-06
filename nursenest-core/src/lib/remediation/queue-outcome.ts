import type { PrismaClient } from "@prisma/client";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";

/**
 * After a learner completes a remediation retest pass, adjust queue priority or resolve the row.
 */
export async function applyRemediationQueueOutcome(
  prisma: PrismaClient,
  args: { userId: string; queueItemId: string; wellPerformed: boolean },
): Promise<{ ok: boolean; error?: string }> {
  if (!isRemediationEngineEnabled()) return { ok: true };

  try {
    const row = await prisma.userRemediationQueue.findFirst({
      where: { id: args.queueItemId, userId: args.userId },
    });
    if (!row) return { ok: false, error: "not_found" };

    const now = new Date();
    if (args.wellPerformed) {
      await prisma.userRemediationQueue.update({
        where: { id: row.id },
        data: {
          resolved: true,
          resolvedAt: now,
          updatedAt: now,
        },
      });
    } else {
      const nextReviewAt = new Date(now.getTime() + 86400000);
      await prisma.userRemediationQueue.update({
        where: { id: row.id },
        data: {
          priorityScore: row.priorityScore + 12,
          nextReviewAt,
          updatedAt: now,
        },
      });
    }

    safeServerLog("remediation", "REMEDIATION_QUEUE_UPDATED", {
      userId: args.userId,
      queueItemId: args.queueItemId,
      wellPerformed: args.wellPerformed,
    });
    return { ok: true };
  } catch (e) {
    safeServerLog("remediation", "REMEDIATION_OUTCOME_FAILED", {
      userId: args.userId,
      queueItemId: args.queueItemId,
      message: e instanceof Error ? e.message : String(e),
    });
    return { ok: false, error: "server" };
  }
}
