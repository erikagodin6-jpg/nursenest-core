/** Bump when material policy text changes (checkout + stored acceptance). */
export const LEGAL_POLICY_BUNDLE_VERSION = "2026-04-01";

export const LEGAL_EFFECTIVE_DATE_LABEL = "April 1, 2026";

export const LEGAL_LAST_UPDATED_LABEL = "April 1, 2026";

/** Display / filings — override via env for the operating legal entity when known. */
export function legalEntityName(): string {
  return process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME?.trim() || "NurseNest";
}

export function legalMailingAddress(): string {
  return process.env.NEXT_PUBLIC_LEGAL_MAILING_ADDRESS?.trim() || "Ontario, Canada";
}

export function supportEmail(): string {
  return (
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
    "support@nursenest.ca"
  );
}

export function optionalBusinessPhone(): string | null {
  const p = process.env.NEXT_PUBLIC_BUSINESS_PHONE?.trim();
  return p || null;
}