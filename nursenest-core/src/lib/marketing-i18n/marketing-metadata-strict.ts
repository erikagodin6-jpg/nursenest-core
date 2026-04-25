import { getRequiredPublicMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";
import { assertNoPublicPlaceholderCopy } from "@/lib/marketing-i18n/marketing-message-value-policy";

export type MarketingMetadataInterpolationParams = Record<string, string | number | undefined>;

function logMetadataRequiredFallback(key: string): void {
  const payload = JSON.stringify({
    scope: "i18n",
    event: "marketing_metadata_required_fallback",
    key: key.slice(0, 160),
  });

  const prefix = process.env.NODE_ENV === "production" ? "[nursenest-core]" : "[marketing-i18n]";
  console.error(`${prefix} ${payload}`);
}

function assertUsableMetadataFallback(value: string, context: string): string {
  const checked = assertNoPublicPlaceholderCopy(value.trim(), context).trim();

  if (!checked) {
    throw new Error(
      `[marketing-metadata-strict] fallback is empty or forbidden after validation (${context}).`,
    );
  }

  return checked;
}

function resolveRequiredMetadataTemplate(
  messages: MarketingMessages,
  key: string,
  fallbackMessages: MarketingMessages | undefined,
  productionOnlyFallback: string,
  context: string,
): string {
  const safeFallback = assertUsableMetadataFallback(productionOnlyFallback, `${context}:${key}`);

  try {
    const resolved = getRequiredPublicMessage(messages, key, fallbackMessages).trim();
    const checked = assertNoPublicPlaceholderCopy(resolved, `metadata-resolved:${key}`).trim();

    if (checked) return checked;

    throw new Error(`[marketing-metadata-strict] resolved metadata is empty for key "${key}".`);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      throw err instanceof Error ? err : new Error(String(err));
    }

    logMetadataRequiredFallback(key);
    return safeFallback;
  }
}

function interpolateTemplate(
  template: string,
  params: MarketingMetadataInterpolationParams,
): string {
  let output = template;

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    output = output.split(`{{${key}}}`).join(String(value));
  }

  return output.trim();
}

function hasUnresolvedInterpolationToken(value: string): boolean {
  return /\{\{[^{}]+\}\}/u.test(value);
}

/**
 * Required metadata / JSON-LD line.
 *
 * In development/test:
 * - missing or invalid message copy throws immediately
 *
 * In production:
 * - falls back only to the explicit productionOnlyFallback
 * - fallback itself must be real product copy, not a placeholder
 */
export function getRequiredPublicMetadataLine(
  messages: MarketingMessages,
  key: string,
  fallbackMessages: MarketingMessages | undefined,
  productionOnlyFallback: string,
): string {
  return resolveRequiredMetadataTemplate(
    messages,
    key,
    fallbackMessages,
    productionOnlyFallback,
    "metadata-fallback-constant",
  );
}

/**
 * Required metadata / JSON-LD line with {{param}} interpolation.
 */
export function getRequiredPublicMetadataInterpolated(
  messages: MarketingMessages,
  key: string,
  params: MarketingMetadataInterpolationParams,
  fallbackMessages: MarketingMessages | undefined,
  productionOnlyFallback: string,
): string {
  const safeFallback = assertUsableMetadataFallback(
    productionOnlyFallback,
    `metadata-fallback-constant-interpolated:${key}`,
  );

  let template: string;

  try {
    template = getRequiredPublicMessage(messages, key, fallbackMessages).trim();
    template = assertNoPublicPlaceholderCopy(template, `metadata-template:${key}`).trim();

    if (!template) {
      throw new Error(`[marketing-metadata-strict] resolved metadata template is empty for "${key}".`);
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      throw err instanceof Error ? err : new Error(String(err));
    }

    logMetadataRequiredFallback(`${key}:interpolated-template`);
    return safeFallback;
  }

  const interpolated = interpolateTemplate(template, params);

  try {
    if (!interpolated) {
      throw new Error(`[marketing-metadata-strict] interpolated metadata is empty for "${key}".`);
    }

    if (hasUnresolvedInterpolationToken(interpolated)) {
      throw new Error(
        `[marketing-metadata-strict] unresolved interpolation token in metadata key "${key}": ${interpolated}`,
      );
    }

    const checked = assertNoPublicPlaceholderCopy(interpolated, `metadata-interpolated:${key}`).trim();

    if (!checked) {
      throw new Error(`[marketing-metadata-strict] interpolated metadata was scrubbed empty for "${key}".`);
    }

    return checked;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      throw err instanceof Error ? err : new Error(String(err));
    }

    logMetadataRequiredFallback(`${key}:interpolated-invalid`);
    return safeFallback;
  }
}