/**
 * Normalize login identifiers for credentials auth.
 * Usernames: trim + lowercase (matches monolith-style handles like `erikanim`).
 * Emails: trim + lowercase.
 */
export function normalizeLoginIdentifier(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isEmailLikeIdentifier(normalized: string): boolean {
  return normalized.includes("@");
}
