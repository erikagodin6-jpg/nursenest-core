/**
 * Homepage-visible marketing copy: never show raw i18n keys (e.g. `pages.home.*`)
 * when the provider echoes a key, omits a translation, or throws.
 */

import { humanizedMarketingKeyFallback } from "@/lib/marketing-i18n/marketing-message-value-policy";

type MarketingT = (key: string, params?: Record<string, string | number | undefined>) => string;

const HOMEPAGE_PLACEHOLDER_LEAVES = new Set(
  [
    "eyebrow",
    "kicker",
    "lead",
    "title",
    "body",
    "link",
    "label",
    "heading",
    "description",
    "subtitle",
    "cta",
    "button",
    "placeholder",
    "todo",
    "tbd",
  ].map((s) => s.toLowerCase()),
);

function warnHomepageFallbackDev(key: string, resolved: string) {
  if (process.env.NODE_ENV !== "development") return;
  console.warn("[homepage-marketing-copy] missing or placeholder copy", {
    key,
    resolved: resolved.slice(0, 120),
  });
}

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
  if (HOMEPAGE_PLACEHOLDER_LEAVES.has(r.toLowerCase())) return true;
  if (/^(KICKER|LEAD|TITLE|BODY|LINK|LABEL|HEADING|CTA|BUTTON)$/u.test(r)) return true;

  // Editor / stub titles that slipped into flat `pages.json` (camelCase tail humanization).
  if (/\bheadline\s+premium\b/iu.test(r)) return true;
  if (/\bsubheading\s+premium\b/iu.test(r)) return true;
  if (/\breadiness\s+label\b/iu.test(r)) return true;

  // MarketingI18n returns {@link humanizedMarketingKeyFallback} for missing keys — treat as untranslated
  // so homepage sections keep their authored fallbacks (and never show "Eyebrow", "Headline premium", etc.).
  try {
    const humanized = humanizedMarketingKeyFallback(key).trim();
    if (humanized && r.toLowerCase() === humanized.toLowerCase()) return true;
  } catch {
    /* ignore */
  }

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
  if (!isUntranslatedHomepageMarketingCopy(resolved, key)) return resolved;
  warnHomepageFallbackDev(key, resolved);
  return fallback;
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
