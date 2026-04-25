import "server-only";

import path from "path";
import { existsSync } from "fs";

import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const DEFAULT_LOCALE = "en";

/**
 * SAFE: resolve i18n dir across environments
 */
function resolveI18nDir(): string | null {
  try {
    const env = process.env.NN_MARKETING_I18N_DIR;
    if (env && existsSync(env)) return env;

    const candidates = [
      path.join(process.cwd(), "public", "i18n"),
      path.join(process.cwd(), ".next", "static", "i18n"),
      path.join(process.cwd(), "i18n"),
    ];

    const main = process.argv[1];
    if (main) {
      const entry = path.dirname(main);
      candidates.push(path.join(entry, "public", "i18n"));
      candidates.push(path.join(entry, ".next", "static", "i18n"));
    }

    for (const p of candidates) {
      try {
        if (existsSync(p)) return p;
      } catch {}
    }

    console.warn("[i18n] no directory found");
    return null;
  } catch (err) {
    console.error("[i18n] resolve failed", err);
    return null;
  }
}

/**
 * SAFE: load full locale bundle
 */
function loadLocaleBundle(dir: string, locale: string): MarketingMessages {
  try {
    const file = path.join(dir, `${locale}.json`);
    if (!existsSync(file)) return {};
    return require(file);
  } catch {
    return {};
  }
}

/**
 * SAFE: merge fallback
 */
function mergeFallback(
  primary: MarketingMessages,
  fallback: MarketingMessages
): MarketingMessages {
  const out: MarketingMessages = { ...primary };

  for (const [k, v] of Object.entries(fallback)) {
    if (!out[k]) out[k] = v;
  }

  return out;
}

/**
 * SYNC SAFE LOAD
 */
export function loadMarketingMessagesSync(
  locale: string
): MarketingMessages {
  try {
    const dir = resolveI18nDir();
    if (!dir) return {};

    const safeLocale = locale || DEFAULT_LOCALE;

    const primary = loadLocaleBundle(dir, safeLocale);

    if (
      Object.keys(primary).length === 0 &&
      safeLocale !== DEFAULT_LOCALE
    ) {
      const fallback = loadLocaleBundle(dir, DEFAULT_LOCALE);
      return mergeFallback(primary, fallback);
    }

    return primary;
  } catch {
    return {};
  }
}

/**
 * ASYNC SAFE LOAD
 */
export async function loadMarketingMessages(
  locale: string
): Promise<MarketingMessages> {
  try {
    return loadMarketingMessagesSync(locale);
  } catch {
    return {};
  }
}