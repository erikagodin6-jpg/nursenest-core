import type { MarketingMessages } from "@/lib/marketing-i18n-core";

type MarketingTFn = (key: string, params?: Record<string, string | number | undefined>) => string;

/**
 * True when visible UI text looks like an unresolved flat i18n path (e.g. `pages.home.foo`
 * or `PAGES.HOME.FOO` after CSS uppercase), not end-user prose.
 */
export function looksLikeRawMarketingI18nKeyVisibleText(text: string): boolean {
  const v = text.trim();
  if (!v) return false;

  if (/^(pages|learner|marketing|components|home)(\.[a-z0-9_]+){2,}$/i.test(v)) return true;

  const dotParts = v.split(".").filter(Boolean);
  if (dotParts.length >= 3 && /^[A-Za-z0-9_]+$/.test(v.replaceAll(".", ""))) {
    const root = dotParts[0]?.toLowerCase() ?? "";
    if (
      root === "pages" ||
      root === "learner" ||
      root === "marketing" ||
      root === "components" ||
      root === "home"
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Regex for Playwright / CI: visible copy must not look like a raw shard key path.
 * Case-insensitive so it catches CSS `text-transform: uppercase` leaks.
 * Non-global so repeated `.test()` does not stick on `lastIndex`.
 */
export const HOMEPAGE_VISIBLE_RAW_I18N_PATH_RE =
  /\b(?:pages|learner|marketing|components|home)(?:\.[A-Za-z0-9_]+){2,}\b/i;

export function safeHomepageMarketingCopy(
  t: MarketingTFn | undefined,
  key: string,
  fallback: string,
  params?: Record<string, string | number | undefined>,
): string {
  if (!t) return fallback;
  try {
    const raw = params ? t(key, params) : t(key);
    const trimmed = typeof raw === "string" ? raw.trim() : "";
    if (!trimmed) return fallback;
    if (trimmed.toLowerCase() === key.toLowerCase()) return fallback;
    if (looksLikeRawMarketingI18nKeyVisibleText(trimmed)) return fallback;
    return raw;
  } catch {
    return fallback;
  }
}

/** For server-only metadata helpers that use a messages record instead of `t`. */
export function pickHomepageMessage(
  messages: MarketingMessages | Record<string, string> | undefined,
  key: string,
  fallback: string,
): string {
  if (!messages) return fallback;
  try {
    const raw = messages[key];
    const trimmed = typeof raw === "string" ? raw.trim() : "";
    if (!trimmed) return fallback;
    if (trimmed.toLowerCase() === key.toLowerCase()) return fallback;
    if (looksLikeRawMarketingI18nKeyVisibleText(trimmed)) return fallback;
    return raw;
  } catch {
    return fallback;
  }
}
