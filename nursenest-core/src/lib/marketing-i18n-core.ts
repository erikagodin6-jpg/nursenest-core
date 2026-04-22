import {
  assertNoPublicPlaceholderCopy,
  missingMarketingCopyFallback,
  normalizeResolvedMarketingLeaf,
} from "@/lib/marketing-i18n/marketing-message-value-policy";
import {
  coerceFlatMessageValue,
  safeMessageKey,
} from "@/lib/marketing-i18n/safe-marketing-messages";

export type MarketingMessages = Record<string, string>;

/**
 * Legacy sentinel string — kept so build gates / greps stay stable. {@link formatMarketingMessage}
 * no longer returns this for missing keys (it implied a global outage on marketing pages including `/`).
 */
export const MARKETING_PRODUCTION_MISSING_PAGE_KEY_PLACEHOLDER =
  "Content unavailable right now. Please refresh the page.";

/** Known keys are generated in {@link marketing-message-keys.generated.ts}; dynamic keys use `string`. */
export type { MarketingMessageKey } from "@/lib/i18n/marketing-message-keys.generated";

type Params = Record<string, string | number | undefined>;

/** Optional logging context (never include user content / PII). */
export type FormatMarketingMessageOptions = {
  /** BCP 47 / app locale code for structured logs. */
  locale?: string;
};

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

/**
 * Resolves a flat marketing key with optional `{{param}}` interpolation.
 * Missing keys resolve to an empty string (never humanized key tails like `Title`).
 */
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

    const normalizedLeaf = normalizeResolvedMarketingLeaf(rawResolved, safeKey);
    if (rawResolved !== undefined && normalizedLeaf === undefined) {
      logI18nStructured("marketing_message_placeholder_value", safeKey, locale, {
        hadFallbackMap: Boolean(fallbackMessages),
        sample: String(rawResolved).slice(0, 80),
      });
    }
    rawResolved = normalizedLeaf;

    if (rawResolved === undefined) {
      logI18nStructured("marketing_message_key_missing", safeKey, locale, {
        hadFallbackMap: Boolean(fallbackMessages),
      });
      return assertNoPublicPlaceholderCopy(
        missingMarketingCopyFallback(safeKey),
        `missing:${safeKey}`,
      );
    }

    let s: string = rawResolved;
    if (params) {
      for (const [k, val] of Object.entries(params)) {
        if (val === undefined) continue;
        s = s.split(`{{${k}}}`).join(String(val));
      }
    }
    return assertNoPublicPlaceholderCopy(s, `resolved:${safeKey}`);
  } catch (e) {
    if (e instanceof Error && e.message.includes("[marketing]")) {
      throw e;
    }
    logI18nStructured("marketing_message_runtime_error", safeKey || "(unknown)", locale, {
      hadFallbackMap: Boolean(fallbackMessages),
      errorName: e instanceof Error ? e.name.slice(0, 80) : "non_error",
    });
    try {
      const sk = safeKey || "message";
      return assertNoPublicPlaceholderCopy(missingMarketingCopyFallback(sk), `catch:${sk}`);
    } catch (inner) {
      if (inner instanceof Error && inner.message.includes("[marketing]")) {
        throw inner;
      }
      return process.env.NODE_ENV === "production" ? "" : "NurseNest";
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
  const sk = safeMessageKey(key);
  const origin = sk ? `resolve:${sk}` : "resolve:invalid-key";
  try {
    if (!sk) return assertNoPublicPlaceholderCopy(ultimateFallback, origin);
    const raw = lookupFlatMessage(messages, sk) ?? lookupFlatMessage(fallbackMessages, sk);
    const normalized = normalizeResolvedMarketingLeaf(raw, sk);
    const out = normalized !== undefined ? normalized : ultimateFallback;
    return assertNoPublicPlaceholderCopy(out, origin);
  } catch {
    return assertNoPublicPlaceholderCopy(ultimateFallback, `${origin}:catch`);
  }
}

/**
 * Required public marketing string: throws when the resolved leaf is missing or a forbidden placeholder.
 * Prefer in server loaders / build gates — not in hot client paths without try/catch.
 */
export function getRequiredMarketingMessage(
  messages: MarketingMessages,
  key: string,
  fallbackMessages?: MarketingMessages,
): string {
  const sk = safeMessageKey(key);
  if (!sk) throw new Error(`[marketing-i18n] getRequiredMarketingMessage: empty key`);
  const raw = lookupFlatMessage(messages, sk) ?? lookupFlatMessage(fallbackMessages, sk);
  const normalized = normalizeResolvedMarketingLeaf(raw, sk);
  if (normalized === undefined) {
    throw new Error(`[marketing-i18n] getRequiredMarketingMessage: missing or forbidden value for key "${sk}"`);
  }
  return assertNoPublicPlaceholderCopy(normalized, `required:${sk}`);
}

/**
 * Same contract as {@link getRequiredMarketingMessage} — explicit name for public/marketing surfaces
 * where copy must never be placeholder/stub text.
 */
export const getRequiredPublicMessage = getRequiredMarketingMessage;

/** Optional copy: never returns forbidden placeholders; uses `fallback` when missing or unsafe. */
export function getOptionalMarketingMessage(
  messages: MarketingMessages,
  key: string,
  opts: { fallbackMessages?: MarketingMessages; fallback: string },
): string {
  const sk = safeMessageKey(key);
  if (!sk) return assertNoPublicPlaceholderCopy(opts.fallback, "optional:empty-key");
  const raw = lookupFlatMessage(messages, sk) ?? lookupFlatMessage(opts.fallbackMessages, sk);
  const normalized = normalizeResolvedMarketingLeaf(raw, sk);
  const chosen = normalized ?? opts.fallback;
  return assertNoPublicPlaceholderCopy(chosen, `optional:${sk}`);
}

/**
 * Optional public UI copy: resolved value or empty string — never placeholder tokens, never humanized key tails.
 */
export function getOptionalPublicMessage(
  messages: MarketingMessages,
  key: string,
  opts?: { fallbackMessages?: MarketingMessages },
): string {
  const sk = safeMessageKey(key);
  if (!sk) return "";
  const raw = lookupFlatMessage(messages, sk) ?? lookupFlatMessage(opts?.fallbackMessages, sk);
  const normalized = normalizeResolvedMarketingLeaf(raw, sk);
  if (normalized === undefined) return "";
  return assertNoPublicPlaceholderCopy(normalized, `optional-public:${sk}`);
}
