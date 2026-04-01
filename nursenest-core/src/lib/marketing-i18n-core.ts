export type MarketingMessages = Record<string, string>;

type Params = Record<string, string | number | undefined>;

/** Last-resort label when no locale (including English) defines the key — readable, not blank. */
export function humanizeMarketingKey(key: string): string {
  const segment = key.includes(".") ? key.slice(key.lastIndexOf(".") + 1) : key;
  const spaced = segment
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim();
  if (!spaced) return key;
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Resolves copy for a flat key. When `fallbackMessages` is provided (typically English),
 * missing keys in the primary bundle resolve from fallback before logging.
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
    /** Last resort: readable fragment — prefer fixing bundles or passing fallbackMessages (see marketing layouts). */
    return humanizeMarketingKey(key);
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
