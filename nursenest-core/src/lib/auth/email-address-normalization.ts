/** Domains where Google treats dot/alias variants as the same mailbox (see {@link normalizeEmailForDedup}). */
const GMAIL_LIKE_DOMAINS = new Set(["gmail.com", "googlemail.com"]);

/**
 * True when the address is on Gmail / Googlemail. Credentials login uses this to fall back to
 * `User.normalizedEmail` when the typed local part differs only by dots or +aliases from `User.email`.
 */
export function isGmailLikeAddress(email: string): boolean {
  const lower = email.trim().toLowerCase();
  const at = lower.lastIndexOf("@");
  if (at < 1 || at === lower.length - 1) return false;
  return GMAIL_LIKE_DOMAINS.has(lower.slice(at + 1));
}

/**
 * Strips dots and the `+alias` portion from gmail-style addresses to produce a
 * canonical form. For non-gmail domains, lowercases and strips + from the local part.
 * Must stay aligned with signup (`/api/signup`) which writes `User.normalizedEmail`.
 */
export function normalizeEmailForDedup(email: string): string {
  const lower = email.trim().toLowerCase();
  const [localRaw, domain] = lower.split("@");
  if (!localRaw || !domain) return lower;

  if (GMAIL_LIKE_DOMAINS.has(domain)) {
    const withoutPlus = localRaw.split("+")[0] ?? localRaw;
    const withoutDots = withoutPlus.replace(/\./g, "");
    return `${withoutDots}@${domain}`;
  }

  const plusStripped = localRaw.split("+")[0] ?? localRaw;
  return `${plusStripped}@${domain}`;
}
