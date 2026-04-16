import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { PH } from "@/lib/observability/posthog-conversion-events";

async function distinctUtcProgressDays(userId: string): Promise<number> {
  const [row] = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(DISTINCT (("updatedAt" AT TIME ZONE 'UTC')::date))::bigint AS n
    FROM "Progress"
    WHERE "userId" = ${userId}
  `;
  return Number(row?.n ?? 0);
}

export type StudyFunnelBeforeSnapshot = {
  progressCount: number;
  utcDistinctDays: number;
};

export async function loadStudyFunnelBeforeSnapshot(userId: string): Promise<StudyFunnelBeforeSnapshot> {
  const progressCount = await prisma.progress.count({ where: { userId } });
  const utcDistinctDays = await distinctUtcProgressDays(userId);
  return { progressCount, utcDistinctDays };
}

/**
 * Call after a successful progress upsert. Emits at most one “first study” and one “repeat study day”
 * milestone per user as they cross thresholds (avoids spamming repeat on every lesson update).
 */
export function captureStudyProgressFunnelAfterUpsert(
  userId: string,
  scope: AccessScope,
  before: StudyFunnelBeforeSnapshot,
): void {
  void (async () => {
    try {
      const totalAfter = await prisma.progress.count({ where: { userId } });
      if (before.progressCount === 0 && totalAfter >= 1) {
        void captureServerEvent(analyticsDistinctId(userId), PH.funnelFirstStudyProgress, {
          actor: "authenticated",
          country: scope.country ? String(scope.country) : undefined,
          tier: scope.tier ? String(scope.tier) : undefined,
        }).catch(() => {});
      }

      const daysAfter = await distinctUtcProgressDays(userId);
      if (before.utcDistinctDays < 2 && daysAfter >= 2) {
        void captureServerEvent(analyticsDistinctId(userId), PH.funnelRepeatStudyDay, {
          actor: "authenticated",
          distinct_study_days_utc: daysAfter,
          country: scope.country ? String(scope.country) : undefined,
          tier: scope.tier ? String(scope.tier) : undefined,
        }).catch(() => {});
      }
    } catch {
      // never block API
    }
  })();
}
