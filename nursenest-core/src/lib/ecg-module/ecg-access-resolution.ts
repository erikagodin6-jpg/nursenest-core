export type EcgModuleEntitlements = {
  hasBasicEcgAccess: boolean;
  hasAdvancedEcgAccess: boolean;
};

export function resolveEcgModuleEntitlements(input: {
  hasBaseLearnerAccess: boolean;
  hasAdvancedEcgEntitlement: boolean;
}): EcgModuleEntitlements {
  const hasAdvancedEcgAccess = input.hasAdvancedEcgEntitlement;
  return {
    hasBasicEcgAccess: input.hasBaseLearnerAccess || hasAdvancedEcgAccess,
    hasAdvancedEcgAccess,
  };
}
