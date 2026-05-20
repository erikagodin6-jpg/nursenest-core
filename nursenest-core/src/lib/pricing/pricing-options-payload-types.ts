import type { TierCode } from "@prisma/client";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";

export type NursingPlanRowPayload = {
  tier: TierCode;
  country: "CA";
  duration: BillingDuration;
  checkoutAvailable: boolean;
  totalLabel: string;
  monthlyEquivalentLabel: string;
  savingsVsMonthlyPercent: number;
  isBestValue: boolean;
  isMostPopular: boolean;
  anchorPriceLabel: string | null;
  planCode: string;
};

export type AlliedPlanRowPayload = {
  tier: "ALLIED";
  alliedCareer: AlliedCareerKey;
  alliedCareerLabel: string;
  country: "CA";
  duration: BillingDuration;
  checkoutAvailable: boolean;
  totalLabel: string;
  monthlyEquivalentLabel: string;
  savingsVsMonthlyPercent: number;
  isBestValue: boolean;
  isMostPopular: boolean;
  planCode: string;
};

/** Anonymous display pricing JSON for marketing + `GET /api/pricing/options`. */
export type PricingOptionsPayload = {
  durations: readonly BillingDuration[];
  nursingTiers: readonly TierCode[];
  alliedCareers: readonly AlliedCareerKey[];
  alliedCareerLabels: Record<AlliedCareerKey, string>;
  plans: NursingPlanRowPayload[];
  alliedPlans: AlliedPlanRowPayload[];
  trialDays: number;
};
