/** Strip invisible characters often pasted from docs / password managers (breaks DB email match). */
const ZERO_WIDTH_AND_NBSP = /[\u200B-\u200D\uFEFF]/g;

/**
 * Normalize login identifiers for credentials auth.
 * Usernames: trim + lowercase (matches monolith-style handles like `erikanim`).
 * Emails: trim + lowercase.
 */
export function sanitizeRawLoginIdentifier(raw: string): string {
  return raw.replace(ZERO_WIDTH_AND_NBSP, "").replace(/\u00A0/g, " ").trim();
}

export function normalizeLoginIdentifier(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isEmailLikeIdentifier(normalized: string): boolean {
  return normalized.includes("@");
}
