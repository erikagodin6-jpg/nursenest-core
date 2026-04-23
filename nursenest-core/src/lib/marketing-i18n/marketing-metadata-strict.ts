import { getRequiredPublicMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";
import { assertNoPublicPlaceholderCopy } from "@/lib/marketing-i18n/marketing-message-value-policy";

export type MarketingMetadataInterpolationParams = Record<string, string | number | undefined>;

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

/**
 * Like {@link getRequiredPublicMetadataLine} but applies `{{param}}` interpolation after resolving the template.
 * Use for metadata strings that include dynamic segments (e.g. deck title). `productionOnlyFallback` must pass
 * {@link assertNoPublicPlaceholderCopy} and must not be empty.
 */
export function getRequiredPublicMetadataInterpolated(
  messages: MarketingMessages,
  key: string,
  params: MarketingMetadataInterpolationParams,
  fallbackMessages: MarketingMessages | undefined,
  productionOnlyFallback: string,
): string {
  const scrubbedFallback = assertNoPublicPlaceholderCopy(
    productionOnlyFallback.trim(),
    `metadata-fallback-constant-interpolated:${key}`,
  ).trim();
  if (!scrubbedFallback) {
    throw new Error(
      `[marketing-metadata-strict] productionOnlyFallback is empty or forbidden placeholder after scrub (interpolated key "${key}") — use an explicit string from marketing-safe-fallbacks.ts.`,
    );
  }
  let template: string;
  try {
    template = getRequiredPublicMessage(messages, key, fallbackMessages).trim();
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      throw e instanceof Error ? e : new Error(String(e));
    }
    logMetadataRequiredFallback(`${key}:interpolated-template`);
    return scrubbedFallback;
  }
  let s = template;
  for (const [k, val] of Object.entries(params)) {
    if (val === undefined) continue;
    s = s.split(`{{${k}}}`).join(String(val));
  }
  s = s.trim();
  const checked = assertNoPublicPlaceholderCopy(s, `metadata-interpolated:${key}`).trim();
  if (checked) return checked;
  if (process.env.NODE_ENV !== "production") {
    throw new Error(
      `[marketing-metadata-strict] interpolated metadata empty or scrubbed to empty (key "${key}") — check params and template.`,
    );
  }
  logMetadataRequiredFallback(`${key}:interpolated-empty`);
  return scrubbedFallback;
}
