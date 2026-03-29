export type MarketingMessages = Record<string, string>;

type Params = Record<string, string | number | undefined>;

const missingToken = (key: string) => `[missing:${key}]`;

/**
 * Resolves copy for a flat key. No English fallback — missing keys log and return
 * a visible placeholder (production-safe: does not crash the tree).
 */
export function formatMarketingMessage(messages: MarketingMessages, key: string, params?: Params): string {
  const raw = messages[key];
  if (raw === undefined) {
    console.error(`[marketing-i18n] missing key: ${key} (locale bundle)`);
    return missingToken(key);
  }
  let s = raw;
  if (params) {
    for (const [k, val] of Object.entries(params)) {
      if (val === undefined) continue;
      s = s.split(`{{${k}}}`).join(String(val));
    }
  }
  return s;
}
