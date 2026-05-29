"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";

const referralDb = prisma as typeof prisma & { referralRewardRule: any; referralRewardGrant: any; referralFraudSignal: any };

function adminUserId(session: Awaited<ReturnType<typeof requireAdmin>>): string | null {
  return (session.user as { id?: string })?.id ?? null;
}

const ruleSchema = z.object({
  name: z.string().min(2).max(160),
  description: z.string().max(800).optional(),
  trigger: z.enum(["QUALIFIED_REFERRAL_COUNT", "PAID_REFERRAL_COUNT"]),
  threshold: z.coerce.number().int().min(1).max(1000),
  rewardKind: z.enum(["FREE_DAYS", "FREE_MONTH", "ACCOUNT_CREDIT", "FEATURE_UNLOCK", "AMBASSADOR_STATUS", "MANUAL"]),
  rewardValue: z.coerce.number().int().min(0).max(100000).optional(),
  durationDays: z.coerce.number().int().min(0).max(3650).optional(),
  featureKey: z.string().max(96).optional(),
});

export async function createReferralRewardRule(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = ruleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  await referralDb.referralRewardRule.create({
    data: {
      ...parsed.data,
      description: parsed.data.description?.trim() || null,
      featureKey: parsed.data.featureKey?.trim() || null,
      rewardValue: Number.isFinite(parsed.data.rewardValue) ? parsed.data.rewardValue : null,
      durationDays: Number.isFinite(parsed.data.durationDays) ? parsed.data.durationDays : null,
      createdByUserId: adminUserId(admin),
      enabled: true,
    },
  });
  revalidatePath("/admin/referrals");
}

export async function toggleReferralRewardRule(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const enabled = String(formData.get("enabled") ?? "") === "true";
  if (!id) return;
  await referralDb.referralRewardRule.update({ where: { id }, data: { enabled } }).catch(() => null);
  revalidatePath("/admin/referrals");
}

export async function grantManualReferralReward(formData: FormData) {
  const admin = await requireAdmin();
  const referrerUserId = String(formData.get("referrerUserId") ?? "");
  const reason = String(formData.get("reason") ?? "Manual referral reward").slice(0, 240);
  if (!referrerUserId) return;
  await referralDb.referralRewardGrant.create({
    data: {
      referrerUserId,
      recipientUserId: referrerUserId,
      status: "GRANTED",
      rewardKind: "MANUAL",
      reason,
      grantedAt: new Date(),
      grantedByUserId: adminUserId(admin),
    },
  });
  revalidatePath("/admin/referrals");
}

export async function resolveReferralFraudSignal(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await referralDb.referralFraudSignal.update({ where: { id }, data: { resolvedAt: new Date(), reviewedByUserId: adminUserId(admin) } }).catch(() => null);
  revalidatePath("/admin/referrals");
}
