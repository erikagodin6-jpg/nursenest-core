export type EcgBasicAccessState = "no_access" | "basic_only" | "advanced_includes_basic";

export type EcgModuleEntitlements = {
  accessState: EcgBasicAccessState;
  hasBasicEcgAccess: boolean;
  hasAdvancedEcgAccess: boolean;
};

type EcgAccessInput = {
  hasBaseLearnerAccess: boolean;
  hasAdvancedEcgEntitlement: boolean;
};

export function hasAdvancedEcgAccess(input: EcgAccessInput): boolean {
  return input.hasAdvancedEcgEntitlement;
}

export function hasBasicEcgAccess(input: EcgAccessInput): boolean {
  return input.hasBaseLearnerAccess || hasAdvancedEcgAccess(input);
}

export function resolveEcgModuleEntitlements(input: EcgAccessInput): EcgModuleEntitlements {
  const advancedAccess = hasAdvancedEcgAccess(input);
  const basicAccess = hasBasicEcgAccess(input);
  return {
    accessState: advancedAccess ? "advanced_includes_basic" : basicAccess ? "basic_only" : "no_access",
    hasBasicEcgAccess: basicAccess,
    hasAdvancedEcgAccess: advancedAccess,
  };
}
