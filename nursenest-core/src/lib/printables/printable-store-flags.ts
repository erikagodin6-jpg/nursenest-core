import "server-only";

/**
 * Learner-facing printables store. When false, learner APIs stay locked/not found.
 * Defaults to false when unset.
 */
export function isPrintableStoreEnabledForLearners(): boolean {
  const v = process.env.PRINTABLE_STORE_ENABLED?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

/** Client/nav hint only — server must still enforce {@link isPrintableStoreEnabledForLearners}. */
export function isPrintableStorePublicNavEnabled(): boolean {
  const pub = process.env.NEXT_PUBLIC_PRINTABLE_STORE_ENABLED?.trim().toLowerCase();
  return (pub === "true" || pub === "1") && isPrintableStoreEnabledForLearners();
}

/**
 * When the learner store is off, admin APIs/pages remain available if this is true (default true when unset).
 * Set `ADMIN_PRINTABLES_ENABLED=false` to hard-disable admin management while the store is off.
 */
export function isAdminPrintablesSurfaceEnabled(): boolean {
  const v = process.env.ADMIN_PRINTABLES_ENABLED?.trim().toLowerCase();
  if (!v) return true;
  return v === "true" || v === "1" || v === "yes";
}

export function isPrintableAdminApiAllowed(): boolean {
  if (isPrintableStoreEnabledForLearners()) return true;
  return isAdminPrintablesSurfaceEnabled();
}
