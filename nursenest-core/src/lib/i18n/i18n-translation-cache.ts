import "server-only";
import { existsSync, readFileSync, statSync } from "fs";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { normalizeMarketingMessagesRecord } from "@/lib/marketing-i18n/safe-marketing-messages";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Safe server-side translation caching: **per absolute file path** on disk, with
 * mtime+size invalidation. Public JSON under `public/i18n` and staff JSON under
 * `i18n-admin-only` are **never** stored under the same cache key (different paths).
 *
 * CDN / in-memory fetch cache uses a separate map keyed by generation + URL (see
 * `load-marketing-messages.ts`).
 */

type DiskEntry = {
  mtimeMs: number;
  size: number;
  messages: MarketingMessages;
};

const diskCache = new Map<string, DiskEntry>();

/**
 * Bump via deploy (`VERCEL_DEPLOYMENT_ID`) or set `MARKETING_I18N_CDN_CACHE_REVISION` after
 * publishing new CDN objects without redeploying the app.
 */
export function getTranslationCacheGeneration(): string {
  return (
    process.env.MARKETING_I18N_CDN_CACHE_REVISION?.trim() ||
    process.env.VERCEL_DEPLOYMENT_ID?.trim() ||
    process.env.BUILD_ID?.trim() ||
    "0"
  );
}

/**
 * Read and parse a single JSON messages file with mtime-based cache invalidation.
 * The **absolute path** is the isolation key (not a separate locale label) so public vs
 * staff files cannot be confused.
 */
export function readCachedI18nJsonFile(
  absPath: string,
  logCtx: { locale: string; shard: string },
): MarketingMessages | null {
  try {
    if (!existsSync(absPath)) {
      diskCache.delete(absPath);
      return null;
    }
    const st = statSync(/* turbopackIgnore: true */ absPath);
    const hit = diskCache.get(absPath);
    if (hit && hit.mtimeMs === st.mtimeMs && hit.size === st.size) {
      return hit.messages;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(absPath, "utf8"));
    } catch {
      safeServerLog("i18n", "shard_json_invalid", logCtx);
      diskCache.delete(absPath);
      return null;
    }
    const normalized = normalizeMarketingMessagesRecord(parsed as Record<string, unknown> | null | undefined);
    if (Object.keys(normalized).length === 0) return null;
    diskCache.set(absPath, {
      mtimeMs: st.mtimeMs,
      size: st.size,
      messages: normalized,
    });
    return normalized;
  } catch {
    diskCache.delete(absPath);
    return null;
  }
}

/** Drop all disk parse caches (tests or hot-reload tooling only). */
export function clearI18nDiskTranslationCache(): void {
  diskCache.clear();
}
