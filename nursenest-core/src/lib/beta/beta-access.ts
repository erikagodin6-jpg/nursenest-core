import crypto from "crypto";
import { BetaFeatureKey, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { BETA_FEATURE_OPTIONS, BETA_FEATURE_LABELS, betaFeaturesToLabels } from "@/lib/beta/beta-feature-options";

export { BETA_FEATURE_OPTIONS, BETA_FEATURE_LABELS, betaFeaturesToLabels };

export function normalizeBetaCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "-");
}

export function hashBetaCode(raw: string): string {
  return crypto.createHash("sha256").update(normalizeBetaCode(raw), "utf8").digest("hex");
}

export function generateDisplayBetaCode(name: string): string {
  const prefix =
    normalizeBetaCode(name)
      .replace(/[^A-Z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 36) || "NURSENEST-BETA";
  return `${prefix}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export function parseBetaFeatures(values: FormDataEntryValue[]): BetaFeatureKey[] {
  const allowed = new Set<string>(BETA_FEATURE_OPTIONS.map((feature) => feature.key));
  return Array.from(
    new Set(
      values
        .map((value) => String(value).trim())
        .filter((value): value is BetaFeatureKey => allowed.has(value)),
    ),
  );
}

export type RedeemBetaCodeResult =
  | { ok: true; alreadyRedeemed: boolean; codeName: string; features: BetaFeatureKey[] }
  | { ok: false; code: "missing" | "not_found" | "disabled" | "expired" | "limit_reached" | "empty_features" | "db_error"; message: string };

export async function redeemBetaCode(userId: string, rawCode: string): Promise<RedeemBetaCodeResult> {
  const normalized = normalizeBetaCode(rawCode);
  if (!userId || !normalized) {
    return { ok: false, code: "missing", message: "Enter a beta access code." };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const code = await tx.betaAccessCode.findUnique({
        where: { codeHash: hashBetaCode(normalized) },
        select: {
          id: true,
          name: true,
          enabled: true,
          features: true,
          expiresAt: true,
          maxRedemptions: true,
          usageCount: true,
        },
      });

      if (!code) return { ok: false as const, code: "not_found" as const, message: "That beta access code was not found." };
      if (!code.enabled) return { ok: false as const, code: "disabled" as const, message: "That beta access code is no longer active." };
      if (code.expiresAt && code.expiresAt.getTime() <= Date.now()) {
        return { ok: false as const, code: "expired" as const, message: "That beta access code has expired." };
      }
      if (code.features.length === 0) {
        return { ok: false as const, code: "empty_features" as const, message: "That beta code does not unlock any features yet." };
      }

      const existing = await tx.betaAccessGrant.findUnique({
        where: { codeId_userId: { codeId: code.id, userId } },
        select: { revokedAt: true },
      });
      if (existing && !existing.revokedAt) {
        await tx.betaActivityEvent.create({
          data: { userId, eventType: "BETA_CODE_REDEEMED_AGAIN", metadata: { codeId: code.id } },
        });
        return { ok: true as const, alreadyRedeemed: true, codeName: code.name, features: code.features };
      }

      if (code.maxRedemptions != null && code.usageCount >= code.maxRedemptions) {
        return { ok: false as const, code: "limit_reached" as const, message: "That beta access code has reached its usage limit." };
      }

      if (existing?.revokedAt) {
        await tx.betaAccessGrant.update({
          where: { codeId_userId: { codeId: code.id, userId } },
          data: { features: code.features, revokedAt: null, revokedByUserId: null, revokeReason: null, redeemedAt: new Date() },
        });
      } else {
        await tx.betaAccessGrant.create({
          data: { codeId: code.id, userId, features: code.features },
        });
      }
      await tx.betaAccessCode.update({ where: { id: code.id }, data: { usageCount: { increment: 1 } } });
      await tx.betaActivityEvent.create({
        data: { userId, eventType: "BETA_CODE_REDEEMED", metadata: { codeId: code.id, features: code.features } },
      });

      return { ok: true as const, alreadyRedeemed: false, codeName: code.name, features: code.features };
    });
  } catch (error) {
    safeServerLog("beta_access", "redeem_failed", {
      userIdPrefix: userId.slice(0, 8),
      detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
    });
    return { ok: false, code: "db_error", message: "We could not redeem that code. Try again." };
  }
}

export async function getUserBetaFeatures(userId: string): Promise<BetaFeatureKey[]> {
  if (!userId) return [];
  const grants = await prisma.betaAccessGrant.findMany({
    where: { userId, revokedAt: null },
    select: { features: true },
  });
  return Array.from(new Set(grants.flatMap((grant) => grant.features)));
}

export async function userHasBetaFeature(userId: string, feature: BetaFeatureKey): Promise<boolean> {
  const features = await getUserBetaFeatures(userId);
  return features.includes(feature);
}

export function prismaKnownMissingTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}
