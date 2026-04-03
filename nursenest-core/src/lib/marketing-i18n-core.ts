export type MarketingMessages = Record<string, string>;

type Params = Record<string, string | number | undefined>;

/**
 * Resolves copy for a flat key. When `fallbackMessages` is provided, missing keys in the primary
 * bundle resolve from fallback before the explicit `[missing:…]` placeholder.
 */
export function formatMarketingMessage(
  messages: MarketingMessages,
  key: string,
  params?: Params,
  fallbackMessages?: MarketingMessages,
): string {
  let raw = messages[key];
  const isEmpty = (v: string | undefined) => v === undefined || (typeof v === "string" && v.trim() === "");
  if (isEmpty(raw) && fallbackMessages) {
    raw = fallbackMessages[key];
  }
  if (isEmpty(raw)) {
    console.error(`[marketing-i18n] missing key: ${key} (locale bundle)`);
    return `[missing:${key}]`;
  }
  let s: string = raw;
  if (params) {
    for (const [k, val] of Object.entries(params)) {
      if (val === undefined) continue;
      s = s.split(`{{${k}}}`).join(String(val));
    }
  }
  return s;
}

/**
 * Server-side helper: pick a string without logging when both bundles lack the key.
 * Use for metadata and props where a short English default is acceptable.
 */
export function resolveMarketingCopy(
  messages: MarketingMessages,
  key: string,
  fallbackMessages: MarketingMessages | undefined,
  ultimateFallback: string,
): string {
  const raw = messages[key] ?? fallbackMessages?.[key];
  if (raw !== undefined && String(raw).trim() !== "") return raw;
  return ultimateFallback;
}
