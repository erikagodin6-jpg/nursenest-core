/**
 * **Single-locale loading** — never preload all languages in one request.
 *
 * Marketing copy uses merged bundles per locale (`public/i18n/{locale}/*.json` shards, legacy
 * `{locale}.json`, or CDN) via
 * {@link loadMarketingMessages}. Callers must pass **one** active locale; do not `Promise.all`
 * over every supported language.
 *
 * Namespace-split JSON under `./locales/{locale}/{namespace}.json` is not the primary pipeline
 * for this app (see `docs/i18n-architecture.md`); this module keeps the contract explicit.
 */
import "server-only";

import { loadMarketingMessages, type MarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export type { MarketingMessages };

/**
 * Loads messages for **one** locale (merged marketing bundle). Safe for RSC / route handlers.
 */
export async function loadActiveLocaleMessages(locale: string): Promise<MarketingMessages> {
  return loadMarketingMessages(locale);
}

/**
 * Guardrail for tests / audits: supported locales list must not be used to batch-load bundles.
 */
export const DO_NOT_PRELOAD_ALL_LOCALES = true;
