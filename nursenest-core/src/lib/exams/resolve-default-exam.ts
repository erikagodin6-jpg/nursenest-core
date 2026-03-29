import { ContentStatus, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { accessibleTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import { seedMinimalQuestionBankIfEmpty } from "@/lib/exams/seed-minimal-question-bank";

/** Best published Exam row for practice + scored attempts for this learner profile. */
export async function resolveDefaultExamForUser(
  userId: string,
): Promise<{ id: string; title: string } | null> {
  await seedMinimalQuestionBankIfEmpty();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { country: true, tier: true },
  });
  if (!user?.country || !user.tier) return null;

  const tiers = accessibleTiersForUserTier(user.tier as TierCode);
  const tier = user.tier as TierCode;
  const exact = await prisma.exam.findFirst({
    where: {
      status: ContentStatus.PUBLISHED,
      country: user.country,
      tier,
    },
    select: { id: true, title: true },
  });
  if (exact) return exact;

  return prisma.exam.findFirst({
    where: {
      status: ContentStatus.PUBLISHED,
      country: user.country,
      tier: { in: tiers },
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true },
  });
}
