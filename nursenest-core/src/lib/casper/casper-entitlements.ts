import { CASPER_ENTITLEMENT } from "@/lib/casper/casper-scenarios";

export type CasperEntitlementState = {
  learnerId: string;
  hasPremiumAccess: boolean;
  entitlementKey: typeof CASPER_ENTITLEMENT;
  reason?: string;
};

export async function getCasperEntitlementState(
  learnerId: string,
): Promise<CasperEntitlementState> {
  return {
    learnerId,
    hasPremiumAccess: false,
    entitlementKey: CASPER_ENTITLEMENT,
    reason:
      "CASPer premium entitlement scaffold is awaiting integration with the shared billing entitlement store.",
  };
}

export async function requireCasperPremiumAccess(
  learnerId: string,
): Promise<CasperEntitlementState> {
  const state = await getCasperEntitlementState(learnerId);

  if (!state.hasPremiumAccess) {
    return state;
  }

  return state;
}

export function isCasperPremiumFeatureLocked(input: {
  hasPremiumAccess: boolean;
  featureKey: string;
}): boolean {
  if (input.hasPremiumAccess) return false;
  return input.featureKey !== "free-mini-simulation";
}
