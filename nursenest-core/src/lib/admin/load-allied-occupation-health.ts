import "server-only";

import { SubscriptionStatus, TierCode } from "@prisma/client";
import { isValidAlliedCareerKey } from "@/lib/allied/allied-billing-career-resolution";
import { prisma } from "@/lib/db";

const ACTIVE_LIKE: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.GRACE,
  SubscriptionStatus.PAST_DUE,
];

export type AlliedOccupationHealthRow = {
  userId: string;
  email: string;
  subscriptionId: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  planTier: TierCode | null;
  alliedCareer: string | null;
  userAlliedProfessionKey: string | null;
  updatedAt: Date;
  issue: "ok" | "missing_occupation" | "invalid_occupation";
};

export async function loadAlliedOccupationHealth(params?: { take?: number }): Promise<{
  rows: AlliedOccupationHealthRow[];
  counts: {
    total: number;
    missingOccupation: number;
    invalidOccupation: number;
    ok: number;
  };
}> {
  const take = Math.min(Math.max(params?.take ?? 120, 1), 500);

  const subs = await prisma.subscription.findMany({
    where: {
      planTier: TierCode.ALLIED,
      status: { in: ACTIVE_LIKE },
    },
    orderBy: { updatedAt: "desc" },
    take,
    select: {
      id: true,
      stripeSubscriptionId: true,
      status: true,
      planTier: true,
      alliedCareer: true,
      updatedAt: true,
      user: { select: { id: true, email: true, alliedProfessionKey: true } },
    },
  });

  const rows: AlliedOccupationHealthRow[] = subs.map((s) => {
    const raw = s.alliedCareer?.trim() ?? "";
    let issue: AlliedOccupationHealthRow["issue"] = "ok";
    if (!raw) {
      issue = "missing_occupation";
    } else if (!isValidAlliedCareerKey(raw)) {
      issue = "invalid_occupation";
    }
    return {
      userId: s.user.id,
      email: s.user.email,
      subscriptionId: s.id,
      stripeSubscriptionId: s.stripeSubscriptionId,
      status: s.status,
      planTier: s.planTier,
      alliedCareer: s.alliedCareer,
      userAlliedProfessionKey: s.user.alliedProfessionKey,
      updatedAt: s.updatedAt,
      issue,
    };
  });

  const missingOccupation = rows.filter((r) => r.issue === "missing_occupation").length;
  const invalidOccupation = rows.filter((r) => r.issue === "invalid_occupation").length;
  const ok = rows.filter((r) => r.issue === "ok").length;

  return {
    rows,
    counts: {
      total: rows.length,
      missingOccupation,
      invalidOccupation,
      ok,
    },
  };
}
