import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { normalizeMarketingMessagesRecord } from "@/lib/marketing-i18n/safe-marketing-messages";

const DEFAULT_LOCALE = "en";
const MARKETING_LOCALE_RE = /^[a-z]{2}(-[a-z]{2})?$/i;
const KNOWN_I18N_ROOTS = Array.from(
  new Set([
    path.resolve(/* turbopackIgnore: true */ process.cwd(), "public", "i18n"),
    path.resolve(/* turbopackIgnore: true */ process.cwd(), ".next", "static", "i18n"),
    path.resolve(/* turbopackIgnore: true */ process.cwd(), "..", "client", "public", "i18n"),
  ]),
);

function isWithinAllowedRoot(resolvedPath: string, allowedRoot: string): boolean {
  return resolvedPath === allowedRoot || resolvedPath.startsWith(`${allowedRoot}${path.sep}`);
}

/**
 * SAFE: resolve i18n dir across environments
 */
function resolveI18nDir(): string | null {
  try {
    for (const p of KNOWN_I18N_ROOTS) {
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
function readJsonFileSafe(file: string): Record<string, unknown> {
  try {
    const resolved = path.resolve(file);
    if (!KNOWN_I18N_ROOTS.some((root) => isWithinAllowedRoot(resolved, root))) {
      return {};
    }
    if (!existsSync(resolved)) return {};
    const parsed = JSON.parse(readFileSync(resolved, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function loadLocaleBundle(dir: string, locale: string): MarketingMessages {
  try {
    if (!MARKETING_LOCALE_RE.test(locale)) return {};
    const resolvedDir = path.resolve(dir);
    if (!KNOWN_I18N_ROOTS.includes(resolvedDir)) return {};
    const file = path.resolve(resolvedDir, `${locale}.json`);
    if (!isWithinAllowedRoot(file, resolvedDir)) return {};
    return normalizeMarketingMessagesRecord(readJsonFileSafe(file));
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