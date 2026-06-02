import { ContentStatus, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { accessibleTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import { seedMinimalQuestionBankIfEmpty } from "@/lib/exams/seed-minimal-question-bank";
import { allowRuntimeMinimalQuestionBankSeed } from "@/lib/jobs/runtime-heavy-work-policy";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { readDefaultPublishedExamSnapshot } from "@/lib/study-content-failover/practice-exams-published-snapshot-read";
import { snapshotAgeMs as computeSnapshotAgeMs } from "@/lib/study-content-failover/study-published-snapshot-store";

/** Best published Exam row for practice + scored attempts for this learner profile. */
export async function resolveDefaultExamForUser(
  userId: string,
): Promise<{ id: string; title: string } | null> {
  if (allowRuntimeMinimalQuestionBankSeed()) {
    await seedMinimalQuestionBankIfEmpty();
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { country: true, tier: true },
  });
  if (!user?.country || !user.tier) return null;

  const tiers = accessibleTiersForUserTier(user.tier as TierCode);
  const tier = user.tier as TierCode;
  try {
    const exact = await prisma.exam.findFirst({
      where: {
        status: ContentStatus.PUBLISHED,
        country: user.country,
        tier,
      },
      select: { id: true, title: true },
    });
    if (exact) return exact;

    return await prisma.exam.findFirst({
      where: {
        status: ContentStatus.PUBLISHED,
        country: user.country,
        tier: { in: tiers },
      },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true },
    });
  } catch (primaryErr) {
    const snap = await readDefaultPublishedExamSnapshot({
      country: String(user.country),
      tier: String(tier),
    });
    const exam = snap?.payload?.exam ?? null;
    if (exam && snap) {
      const age = computeSnapshotAgeMs(snap.capturedAt);
      safeServerLog("exams", "study_content_failover", {
        event: "study_content_failover",
        surface: "practice_exams_default",
        source_used: "secondary",
        failover_reason: "primary_db_failed",
        snapshot_version: snap.version.slice(0, 120),
        snapshot_age_ms: String(Math.round(age)),
        user_id_prefix: userId.slice(0, 8),
      });
      return exam;
    }
    throw primaryErr;
  }
}
