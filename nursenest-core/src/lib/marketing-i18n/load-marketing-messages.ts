import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { MARKETING_PUBLIC_I18N_SHARD_FILENAMES } from "@/lib/i18n/marketing-public-shard-filenames";
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

/**
 * Next.js ships `public/i18n/{locale}/*.json` domain shards (see `merge-marketing-i18n.ts`).
 * When no legacy monolith `{locale}.json` exists, merge shards in stable policy order.
 */
function loadPublicShardTreeMerged(resolvedI18nRoot: string, locale: string): Record<string, unknown> | null {
  const shardDir = path.resolve(resolvedI18nRoot, locale);
  if (!KNOWN_I18N_ROOTS.some((root) => isWithinAllowedRoot(shardDir, path.resolve(root)))) {
    return null;
  }
  if (!existsSync(shardDir)) return null;

  const merged: Record<string, unknown> = {};
  for (const name of MARKETING_PUBLIC_I18N_SHARD_FILENAMES) {
    const fp = path.join(shardDir, `${name}.json`);
    if (!existsSync(fp)) continue;
    const part = readJsonFileSafe(fp);
    for (const [k, v] of Object.entries(part)) {
      if (k in merged) {
        throw new Error(`[loadMarketingMessages] duplicate i18n key "${k}" under ${fp}`);
      }
      merged[k] = v;
    }
  }
  return Object.keys(merged).length > 0 ? merged : null;
}

function loadLocaleBundle(dir: string, locale: string): MarketingMessages {
  try {
    if (!MARKETING_LOCALE_RE.test(locale)) return {};
    const resolvedDir = path.resolve(dir);
    if (!KNOWN_I18N_ROOTS.includes(resolvedDir)) return {};

    const legacyFile = path.resolve(resolvedDir, `${locale}.json`);
    if (existsSync(legacyFile) && isWithinAllowedRoot(legacyFile, resolvedDir)) {
      const monolith = readJsonFileSafe(legacyFile);
      if (Object.keys(monolith).length > 0) {
        return normalizeMarketingMessagesRecord(monolith);
      }
    }

    const fromShards = loadPublicShardTreeMerged(resolvedDir, locale);
    if (fromShards) {
      return normalizeMarketingMessagesRecord(fromShards);
    }

    return {};
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