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

export const MARKETING_PRODUCTION_MISSING_PAGE_KEY_PLACEHOLDER =
  "Content unavailable right now. Please refresh the page.";

export type { MarketingMessageKey } from "@/lib/i18n/marketing-message-keys.generated";

type Params = Record<string, string | number | undefined>;

export type FormatMarketingMessageOptions = {
  locale?: string;
};

function lookupFlatMessage(messages: MarketingMessages | undefined, key: string): string | undefined {
  if (!messages) return undefined;
  return coerceFlatMessageValue(messages[key]);
}

function logI18n(event: string, key: string, locale?: string) {
  console.error(
    JSON.stringify({
      scope: "i18n",
      event,
      key: key.slice(0, 160),
      ...(locale ? { locale } : {}),
    }),
  );
}

/**
 * STRICT version:
 * - NEVER silently returns ""
 * - ALWAYS returns usable string OR throws (dev)
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

  if (!safeKey) {
    logI18n("invalid_key", "(empty)", locale);
    return "NurseNest";
  }

  let raw =
    lookupFlatMessage(messages, safeKey) ??
    lookupFlatMessage(fallbackMessages, safeKey);

  const normalized = normalizeResolvedMarketingLeaf(raw, safeKey);

  if (normalized === undefined) {
    logI18n("missing_or_invalid", safeKey, locale);

    const fallback = missingMarketingCopyFallback(safeKey);

    return assertNoPublicPlaceholderCopy(
      fallback,
      `fallback:${safeKey}`,
    );
  }

  let out = normalized;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) {
        out = out.replaceAll(`{{${k}}}`, String(v));
      }
    }
  }

  return assertNoPublicPlaceholderCopy(out, `resolved:${safeKey}`);
}

/**
 * SAFE resolver (used in metadata / non-critical UI)
 */
export function resolveMarketingCopy(
  messages: MarketingMessages,
  key: string,
  fallbackMessages: MarketingMessages | undefined,
  ultimateFallback: string,
): string {
  const sk = safeMessageKey(key);

  if (!sk) {
    return assertNoPublicPlaceholderCopy(ultimateFallback, "resolve:invalid");
  }

  const raw =
    lookupFlatMessage(messages, sk) ??
    lookupFlatMessage(fallbackMessages, sk);

  const normalized = normalizeResolvedMarketingLeaf(raw, sk);

  return assertNoPublicPlaceholderCopy(
    normalized ?? ultimateFallback,
    `resolve:${sk}`,
  );
}

/**
 * REQUIRED (throws always if invalid)
 */
export function getRequiredMarketingMessage(
  messages: MarketingMessages,
  key: string,
  fallbackMessages?: MarketingMessages,
): string {
  const sk = safeMessageKey(key);

  if (!sk) {
    throw new Error("[marketing-i18n] empty key");
  }

  const raw =
    lookupFlatMessage(messages, sk) ??
    lookupFlatMessage(fallbackMessages, sk);

  const normalized = normalizeResolvedMarketingLeaf(raw, sk);

  if (!normalized) {
    throw new Error(`[marketing-i18n] missing key: ${sk}`);
  }

  return assertNoPublicPlaceholderCopy(normalized, `required:${sk}`);
}

export const getRequiredPublicMessage = getRequiredMarketingMessage;

/**
 * Optional (explicit empty allowed)
 */
export function getOptionalPublicMessage(
  messages: MarketingMessages,
  key: string,
  opts?: { fallbackMessages?: MarketingMessages },
): string {
  const sk = safeMessageKey(key);

  if (!sk) return "";

  const raw =
    lookupFlatMessage(messages, sk) ??
    lookupFlatMessage(opts?.fallbackMessages, sk);

  const normalized = normalizeResolvedMarketingLeaf(raw, sk);

  if (!normalized) return "";

  return assertNoPublicPlaceholderCopy(normalized, `optional:${sk}`);
}