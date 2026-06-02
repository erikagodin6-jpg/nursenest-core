import "server-only";

import { SubscriptionStatus, TierCode } from "@prisma/client";
import {
  canonicalProfessionKeyForAlliedCareer,
  isValidAlliedCareerKey,
} from "@/lib/allied/allied-billing-career-resolution";
import { prisma } from "@/lib/db";

const ACTIVE_LIKE: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.GRACE,
  SubscriptionStatus.PAST_DUE,
];

export type AlliedProfessionLockState = {
  /** True once an active allied subscription has a resolved occupation — learner cannot self-change. */
  locked: boolean;
  /** Canonical marketing profession slug from profile or billing career mapping. */
  effectiveProfessionKey: string | null;
};

/**
 * Allied occupation is **locked** after purchase when there is an active-like allied subscription
 * and a resolved profession key (profile and/or subscription billing career).
 * Pending occupation (active allied sub but no key yet) stays unlocked for completion flows.
 */
export async function getAlliedProfessionLockState(userId: string): Promise<AlliedProfessionLockState> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { alliedProfessionKey: true },
  });

  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      planTier: TierCode.ALLIED,
      status: { in: ACTIVE_LIKE },
    },
    orderBy: { updatedAt: "desc" },
    select: { alliedCareer: true },
  });

  const fromProfile = user?.alliedProfessionKey?.trim().toLowerCase() || null;
  const careerRaw = sub?.alliedCareer?.trim();
  let fromBilling: string | null = null;
  if (careerRaw && isValidAlliedCareerKey(careerRaw)) {
    fromBilling = canonicalProfessionKeyForAlliedCareer(careerRaw);
  }

  const effectiveProfessionKey = fromProfile ?? fromBilling ?? null;
  const hasActiveAlliedSub = Boolean(sub);
  const locked = hasActiveAlliedSub && effectiveProfessionKey !== null;

  return { locked, effectiveProfessionKey };
}
