import { SubscriptionStatus } from "@prisma/client";
import {
  activeLikePaidWindowOpen,
  cancelledPaidThroughActive,
} from "@/lib/entitlements/subscription-paid-access";
import {
  ADVANCED_ECG_MODULE_ENTITLEMENT,
  ADVANCED_ECG_MODULE_NAME,
  ADVANCED_ECG_PRICE_LABEL,
  ADVANCED_ECG_PURCHASE_MODEL,
  isAdvancedEcgPlanCode,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";

export type AdvancedEcgPackageRow = {
  status: SubscriptionStatus;
  planCode: string | null;
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
  updatedAt: Date;
  createdAt: Date;
};

export type AdvancedEcgPackageSummary = {
  entitlementKey: typeof ADVANCED_ECG_MODULE_ENTITLEMENT;
  productName: typeof ADVANCED_ECG_MODULE_NAME;
  priceLabel: typeof ADVANCED_ECG_PRICE_LABEL;
  purchaseModel: typeof ADVANCED_ECG_PURCHASE_MODEL;
  planCode: string;
  purchasedAt: Date;
  accessActive: boolean;
  status: SubscriptionStatus;
};

export function pickLatestAdvancedEcgPackageRow<T extends AdvancedEcgPackageRow>(
  rows: readonly T[],
): T | null {
  return rows.find((row) => isAdvancedEcgPlanCode(row.planCode)) ?? null;
}

export function buildAdvancedEcgPackageSummary<T extends AdvancedEcgPackageRow>(
  rows: readonly T[],
  nowMs = Date.now(),
): AdvancedEcgPackageSummary | null {
  const row = pickLatestAdvancedEcgPackageRow(rows);
  if (!row) return null;

  const accessActive =
    row.status === SubscriptionStatus.PAST_DUE ||
    activeLikePaidWindowOpen(row, nowMs) ||
    cancelledPaidThroughActive(row, nowMs);

  const planCode = row.planCode?.trim();
  if (!planCode) return null;

  return {
    entitlementKey: ADVANCED_ECG_MODULE_ENTITLEMENT,
    productName: ADVANCED_ECG_MODULE_NAME,
    priceLabel: ADVANCED_ECG_PRICE_LABEL,
    purchaseModel: ADVANCED_ECG_PURCHASE_MODEL,
    planCode,
    purchasedAt: row.createdAt,
    accessActive,
    status: row.status,
  };
}
