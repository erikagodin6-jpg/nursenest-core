export type MarketingMessages = Record<string, string>;

type Params = Record<string, string | number | undefined>;

/**
 * Resolves copy for a flat key. When `fallbackMessages` is provided, missing keys in the primary
 * bundle resolve from fallback before the explicit `[missing:…]` placeholder.
 */
function humanizedKeyFallback(key: string): string {
  const tail = key.includes(".") ? (key.split(".").pop() ?? key) : key;
  const words = tail.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").trim();
  if (!words) return "NurseNest";
  const t = words.charAt(0).toUpperCase() + words.slice(1);
  return t.length > 80 ? `${t.slice(0, 77)}…` : t;
}

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
    const payload = JSON.stringify({
      scope: "i18n",
      event: "marketing_message_key_missing",
      key: key.slice(0, 160),
    });
    if (process.env.NODE_ENV !== "production") {
      console.error(`[marketing-i18n] missing key: ${key} (locale bundle)`);
    } else {
      console.error(`[nursenest-core] ${payload}`);
    }
    return process.env.NODE_ENV === "production" ? humanizedKeyFallback(key) : `[missing:${key}]`;
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
