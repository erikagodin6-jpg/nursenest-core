/**
 * Normalizes learner `Link` targets so dashboard surfaces never receive
 * nullish, protocol-relative, or non-`/app` hrefs that crash Next.js `Link` in production.
 */

const DEFAULT_LEARNER_FALLBACK = "/app/questions";

/**
 * Returns a same-origin relative URL under `/app` suitable for `next/link`.
 * Rejects absolute URLs, scheme-relative URLs, and empty paths.
 */
export function coerceSafeLearnerNavHref(
  href: string | null | undefined,
  fallback: string = DEFAULT_LEARNER_FALLBACK,
): string {
  if (href == null || typeof href !== "string") return fallback;
  const t = href.trim();
  if (!t) return fallback;
  if (!t.startsWith("/")) return fallback;
  if (t.startsWith("//")) return fallback;
  // Block `javascript:`, `mailto:`, etc. if ever concatenated into a "relative" string
  if (/^[a-z][+a-z-]*:/i.test(t)) return fallback;
  if (!t.startsWith("/app/") && t !== "/app") return fallback;
  return t;
}
