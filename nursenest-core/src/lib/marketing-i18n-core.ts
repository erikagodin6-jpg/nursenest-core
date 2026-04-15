import {
  coerceFlatMessageValue,
  safeMessageKey,
} from "@/lib/marketing-i18n/safe-marketing-messages";

export type MarketingMessages = Record<string, string>;

/** Known keys are generated in {@link marketing-message-keys.generated.ts}; dynamic keys use `string`. */
export type { MarketingMessageKey } from "@/lib/i18n/marketing-message-keys.generated";

type Params = Record<string, string | number | undefined>;

/** Optional logging context (never include user content / PII). */
export type FormatMarketingMessageOptions = {
  /** BCP 47 / app locale code for structured logs. */
  locale?: string;
};

/**
 * Resolves copy for a flat key. When `fallbackMessages` is provided, missing keys in the primary
 * bundle resolve from fallback before the humanized placeholder (never raw key paths in UI).
 */
function humanizedKeyFallback(key: string): string {
  const tail = key.includes(".") ? (key.split(".").pop() ?? key) : key;
  const words = tail.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").trim();
  if (!words) return "NurseNest";
  const t = words.charAt(0).toUpperCase() + words.slice(1);
  return t.length > 80 ? `${t.slice(0, 77)}…` : t;
}

function lookupFlatMessage(messages: MarketingMessages | undefined, key: string): string | undefined {
  if (!messages) return undefined;
  return coerceFlatMessageValue(messages[key]);
}

function logI18nStructured(
  event: string,
  key: string,
  locale: string | undefined,
  extra?: Record<string, string | boolean>,
): void {
  const payload = JSON.stringify({
    scope: "i18n",
    event,
    key: key.slice(0, 160),
    ...(locale ? { locale } : {}),
    ...extra,
  });
  if (process.env.NODE_ENV !== "production") {
    console.error(`[marketing-i18n] ${payload}`);
  } else {
    console.error(`[nursenest-core] ${payload}`);
  }
}

export function formatMarketingMessage(
  messages: MarketingMessages,
  key: string,
  params?: Params,
  fallbackMessages?: MarketingMessages,
  options?: FormatMarketingMessageOptions,
): string {
  const locale = options?.locale;
  const safeKey = safeMessageKey(key);
  try {
    if (!safeKey) {
      logI18nStructured("marketing_message_invalid_key", "(empty)", locale, { reason: "empty_key" });
      return "NurseNest";
    }

    let rawResolved = lookupFlatMessage(messages, safeKey);
    const primaryMissing = rawResolved === undefined;
    if (primaryMissing && fallbackMessages) {
      rawResolved = lookupFlatMessage(fallbackMessages, safeKey);
    }
    const usedEnglishFallback = primaryMissing && rawResolved !== undefined && Boolean(fallbackMessages);

    if (usedEnglishFallback && locale && locale !== "en" && process.env.NODE_ENV === "development") {
      console.warn(
        JSON.stringify({
          scope: "i18n",
          event: "marketing_message_locale_fallback_used",
          key: safeKey.slice(0, 160),
          locale,
        }),
      );
    }

    if (rawResolved === undefined) {
      logI18nStructured("marketing_message_key_missing", safeKey, locale, {
        hadFallbackMap: Boolean(fallbackMessages),
      });
      return humanizedKeyFallback(safeKey);
    }

    let s: string = rawResolved;
    if (params) {
      for (const [k, val] of Object.entries(params)) {
        if (val === undefined) continue;
        s = s.split(`{{${k}}}`).join(String(val));
      }
    }
    return s;
  } catch (e) {
    logI18nStructured("marketing_message_runtime_error", safeKey || "(unknown)", locale, {
      hadFallbackMap: Boolean(fallbackMessages),
      errorName: e instanceof Error ? e.name.slice(0, 80) : "non_error",
    });
    try {
      return humanizedKeyFallback(safeKey || "message");
    } catch {
      return "NurseNest";
    }
  }
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
  try {
    const sk = safeMessageKey(key);
    if (!sk) return ultimateFallback;
    const raw = lookupFlatMessage(messages, sk) ?? lookupFlatMessage(fallbackMessages, sk);
    if (raw !== undefined) return raw;
  } catch {
    /* fall through */
  }
  return ultimateFallback;
}
