/**
 * Homepage-visible marketing copy: never show raw i18n keys (e.g. `pages.home.*`)
 * when the provider echoes a key, omits a translation, or throws.
 */

type MarketingT = (key: string, params?: Record<string, string | number | undefined>) => string;

/**
 * True when `resolved` is not safe human copy for the given dotted `key`.
 */
export function isUntranslatedHomepageMarketingCopy(resolved: string, key: string): boolean {
  const r = resolved.trim();
  if (!r) return true;

  const kl = key.toLowerCase();
  if (r === key) return true;
  if (r.toLowerCase() === kl) return true;

  // Single-token paths that should never appear as user-facing sentences
  const singleSegmentPath =
    /^(pages|learner|marketing|components|home|nav|footer)\.[a-z0-9_.]+$/i.test(r) && !/\s/u.test(r);
  if (singleSegmentPath) return true;

  if (/^\[missing:/iu.test(r)) return true;

  return false;
}

/**
 * Prefer resolved marketing `t()` output when it looks like real copy; otherwise `fallback`.
 */
export function resolveHomepageMarketingVisibleCopy(
  resolved: string,
  key: string,
  fallback: string,
): string {
  return isUntranslatedHomepageMarketingCopy(resolved, key) ? fallback : resolved;
}

/**
 * Call marketing `t` with optional interpolation params, then scrub raw keys for homepage surfaces.
 */
export function safeHomepageMarketingT(
  t: MarketingT | undefined,
  key: string,
  fallback: string,
  params?: Record<string, string | number | undefined>,
): string {
  if (!t) return fallback;
  let raw = "";
  try {
    raw = t(key, params);
  } catch {
    return fallback;
  }
  return resolveHomepageMarketingVisibleCopy(raw, key, fallback);
}
