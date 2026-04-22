import { getRequiredPublicMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";
import { assertNoPublicPlaceholderCopy } from "@/lib/marketing-i18n/marketing-message-value-policy";

function logMetadataRequiredFallback(key: string): void {
  const payload = JSON.stringify({
    scope: "i18n",
    event: "marketing_metadata_required_fallback",
    key: key.slice(0, 160),
  });
  if (process.env.NODE_ENV !== "production") {
    console.error(`[marketing-i18n] ${payload}`);
  } else {
    console.error(`[nursenest-core] ${payload}`);
  }
}

/**
 * Required metadata / JSON-LD line: {@link getRequiredPublicMessage} in dev/test; in production
 * only, falls back to `productionOnlyFallback` (must be explicit product copy from
 * {@link marketing-safe-fallbacks} or {@link @/lib/marketing/nursing-tier-public-labels}).
 */
export function getRequiredPublicMetadataLine(
  messages: MarketingMessages,
  key: string,
  fallbackMessages: MarketingMessages | undefined,
  productionOnlyFallback: string,
): string {
  const scrubbedFallback = assertNoPublicPlaceholderCopy(
    productionOnlyFallback.trim(),
    `metadata-fallback-constant:${key}`,
  ).trim();
  if (!scrubbedFallback) {
    throw new Error(
      `[marketing-metadata-strict] productionOnlyFallback is empty or forbidden placeholder after scrub (key "${key}") — use an explicit string from marketing-safe-fallbacks.ts or nursing-tier-public-labels.`,
    );
  }
  try {
    return getRequiredPublicMessage(messages, key, fallbackMessages).trim();
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      throw e instanceof Error ? e : new Error(String(e));
    }
    logMetadataRequiredFallback(key);
    return scrubbedFallback;
  }
}
