import "server-only";
import { existsSync, statSync } from "fs";
import path from "path";
import { cache } from "react";
import { safeAwait } from "@/lib/async/safe-await";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { normalizeMarketingMessagesRecord } from "@/lib/marketing-i18n/safe-marketing-messages";
import { loadMarketingMessageShardsSync } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMergedMarketingMessagesFromNextPublicDir } from "@/lib/i18n/merge-next-public-i18n-shards";
import { getTranslationCacheGeneration } from "@/lib/i18n/i18n-translation-cache";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { shouldBypassMarketingI18nAtStartup } from "@/lib/marketing-i18n/marketing-i18n-startup";
import { PUBLIC_I18N_SHARD_FILENAMES } from "@shared/i18n-shard-policy";

/**
 * Canonical Next.js bundles live under `public/i18n/{locale}/{domain}.json` (built by
 * `script/compile-i18n.ts` + `script/merge-marketing-i18n.ts`). Legacy `public/i18n/{locale}.json`
 * is still read when present.
 *
 * Resolution: two `process.cwd()`-relative candidates (app root on DO; monorepo root in dev).
 * Note: `process.cwd()` is dynamic so Turbopack cannot statically trace the exact files.
 * The NFT warning for next.config.ts is suppressed via `outputFileTracingExcludes` in
 * next.config.ts, and the i18n files are explicitly included via `outputFileTracingIncludes`.
 * The `..` candidate is intentionally absent so tracing never escapes the package root.
 *
 * Optional: `MARKETING_I18N_CDN_BASE` loads bundles when files are not on disk. CDN payloads are
 * merged with on-disk English for any missing/empty keys so stale CDN objects cannot drop groups
 * like `home.landing.*`.
 *
 * **Caching:** On-disk JSON uses per-file mtime cache (`i18n-translation-cache.ts`). CDN responses
 * are cached in-memory per `{cacheGeneration, locale, shard}`; generation comes from deploy id or
 * `MARKETING_I18N_CDN_CACHE_REVISION` so new CDN blobs can invalidate without stale cross-locale reuse.
 */
const MAX_MERGED_BUNDLE_BYTES = 12 * 1024 * 1024;
const MARKETING_I18N_TIMEOUT_MS = 1500;
const MARKETING_BUILD_PHASE = "phase-production-build";
const diskMergedLocaleCache = new Map<string, MarketingMessages>();

/** Avoid re-reading/parsing the full English merged tree on every marketing load during `next build`. */
let englishDiskBundleSingleton: MarketingMessages | null | undefined;

async function withMarketingI18nSpan<T>(
  options: { name: string; op: string; attributes: Record<string, string | number | boolean | undefined> },
  fn: () => Promise<T>,
): Promise<T> {
  if (!isSentryServerRuntimeEnabled()) return fn();
  const { withSentryServerSpan } = await import("@/lib/observability/sentry-route-observability");
  return withSentryServerSpan(options as never, fn);
}

function captureMarketingI18nSoftError(opts: {
  scope: string;
  event: string;
  error?: unknown;
  meta?: Record<string, string | number | boolean | undefined>;
  route?: string;
  feature?: string;
  level?: "warning" | "error";
}): void {
  if (!isSentryServerRuntimeEnabled()) return;
  void import("@/lib/observability/sentry-route-observability")
    .then((m) => {
      m.captureSentrySoftError(opts);
    })
    .catch(() => {});
}

/** Cross-render / cross-static-page dedupe (React `cache` resets per prerender worker invocation). */
const loadMarketingMessagesModuleCache = new Map<string, Promise<MarketingMessages>>();

const isEmptyValue = (v: string | undefined): boolean =>
  v === undefined || (typeof v === "string" && v.trim() === "");

/** Fill holes in `primary` using `fallback` (same contract as client `formatMarketingMessage`). */
function mergeMissingMessageKeys(primary: MarketingMessages, fallback: MarketingMessages): MarketingMessages {
  const p = normalizeMarketingMessagesRecord(primary);
  const f = normalizeMarketingMessagesRecord(fallback);
  if (!f || Object.keys(f).length === 0) return p;
  const out: MarketingMessages = { ...p };
  for (const [k, v] of Object.entries(f)) {
    if (isEmptyValue(out[k]) && !isEmptyValue(v)) out[k] = v;
  }
  return out;
}

/** Two scoped candidates only — no `..` so paths never escape the package root. */
function resolveNextI18nPublicDir(): string | null {
  const candidates = [
    path.join(process.cwd(), "public", "i18n"),
    path.join(process.cwd(), "nursenest-core", "public", "i18n"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function marketingI18nCdnBase(): string | null {
  const b = process.env.MARKETING_I18N_CDN_BASE?.trim();
  return b && /^https?:\/\//i.test(b) ? b.replace(/\/$/, "") : null;
}

/** CDN: parsed JSON fragments and merged locale results (never mix locales — key includes locale). */
const cdnFragmentCache = new Map<string, MarketingMessages>();
const cdnLocaleMergedCache = new Map<string, MarketingMessages>();
const cdnInflight = new Map<string, Promise<MarketingMessages | null>>();

function tryLoadEnglishDiskBundle(): MarketingMessages | null {
  if (englishDiskBundleSingleton !== undefined) {
    return englishDiskBundleSingleton;
  }
  const dir = resolveNextI18nPublicDir();
  if (!dir) {
    safeServerLog("i18n", "merged_bundle_missing", { locale: DEFAULT_MARKETING_LOCALE });
    englishDiskBundleSingleton = null;
    return null;
  }
  try {
    const legacy = path.join(dir, `${DEFAULT_MARKETING_LOCALE}.json`);
    let bytes = 0;
    if (existsSync(legacy)) {
      bytes = statSync(/* turbopackIgnore: true */ legacy).size;
    } else {
      for (const name of PUBLIC_I18N_SHARD_FILENAMES) {
        const fp = path.join(dir, DEFAULT_MARKETING_LOCALE, `${name}.json`);
        if (existsSync(fp)) bytes += statSync(/* turbopackIgnore: true */ fp).size;
      }
    }
    if (bytes > MAX_MERGED_BUNDLE_BYTES) {
      safeServerLog("i18n", "merged_bundle_unusually_large", {
        locale: DEFAULT_MARKETING_LOCALE,
        bytes,
      });
    }
  } catch {
    /* best-effort stat */
  }
  try {
    const parsed = loadMergedMarketingMessagesFromNextPublicDir(dir, DEFAULT_MARKETING_LOCALE);
    if (!parsed || Object.keys(parsed).length === 0) {
      safeServerLog("i18n", "merged_bundle_read_failed", { locale: DEFAULT_MARKETING_LOCALE });
      englishDiskBundleSingleton = null;
      return null;
    }
    englishDiskBundleSingleton = parsed;
    return parsed;
  } catch {
    safeServerLog("i18n", "merged_bundle_read_failed", { locale: DEFAULT_MARKETING_LOCALE });
    englishDiskBundleSingleton = null;
    return null;
  }
}

function loadEnglishBundleFromDisk(): MarketingMessages {
  return tryLoadEnglishDiskBundle() ?? ({} as MarketingMessages);
}

function loadFromDiskSync(locale: string): MarketingMessages | null {
  const cached = diskMergedLocaleCache.get(locale);
  if (cached) return cached;

  const dir = resolveNextI18nPublicDir();
  if (!dir) return null;
  try {
    const parsed = loadMergedMarketingMessagesFromNextPublicDir(dir, locale);
    if (!parsed || Object.keys(parsed).length === 0) return null;
    diskMergedLocaleCache.set(locale, parsed);
    return parsed;
  } catch {
    safeServerLog("i18n", "merged_bundle_read_failed", { locale });
    return null;
  }
}

async function fetchCdnFragment(
  cacheGen: string,
  locale: string,
  label: string,
  url: string,
): Promise<MarketingMessages | null> {
  const fragmentKey = `${cacheGen}|${locale}|${label}`;
  const hit = cdnFragmentCache.get(fragmentKey);
  if (hit) return hit;

  const inflightKey = `frag:${fragmentKey}`;
  const pending = cdnInflight.get(inflightKey);
  if (pending) return pending;

  const work = withMarketingI18nSpan(
    {
      name: "marketing.i18n.fragment",
      op: "resource.fetch",
      attributes: { locale, label },
    },
    async () => {
      try {
        const res = await safeAwait(
          fetch(url, { cache: "force-cache" }),
          `marketing_i18n.fetch_fragment:${locale}:${label}`,
          MARKETING_I18N_TIMEOUT_MS,
        );
        if (!res?.ok) return null;
        const json = await safeAwait(
          res.json() as Promise<MarketingMessages>,
          `marketing_i18n.fetch_fragment_json:${locale}:${label}`,
          MARKETING_I18N_TIMEOUT_MS,
        );
        if (!json) return null;
        const part = normalizeMarketingMessagesRecord(json);
        if (Object.keys(part).length === 0) return null;
        cdnFragmentCache.set(fragmentKey, part);
        return part;
      } catch (error) {
        captureMarketingI18nSoftError({
          scope: "marketing_i18n",
          event: "cdn_fragment_failed",
          error,
          feature: "marketing_i18n",
          meta: { locale, label },
        });
        return null;
      } finally {
        cdnInflight.delete(inflightKey);
      }
    },
  );

  cdnInflight.set(inflightKey, work);
  return work;
}

async function loadFromCdn(locale: string): Promise<MarketingMessages | null> {
  const base = marketingI18nCdnBase();
  if (!base) return null;

  const cacheGen = getTranslationCacheGeneration();
  const mergedKey = `${cacheGen}|${locale}|merged`;
  const mergedHit = cdnLocaleMergedCache.get(mergedKey);
  if (mergedHit) return mergedHit;

  const mergedInflightKey = `merged:${mergedKey}`;
  const pendingMerged = cdnInflight.get(mergedInflightKey);
  if (pendingMerged) return pendingMerged;

  const work = withMarketingI18nSpan(
    {
      name: "marketing.i18n.bundle",
      op: "resource.fetch",
      attributes: { locale },
    },
    async () => {
      try {
      const legacyUrl = `${base}/${encodeURIComponent(locale)}.json`;
      const legacyRes = await safeAwait(
        fetch(legacyUrl, { cache: "force-cache" }),
        `marketing_i18n.fetch_legacy:${locale}`,
        MARKETING_I18N_TIMEOUT_MS,
      );

      const legacyStatus = legacyRes?.status ?? "timeout_or_missing";
      let data: MarketingMessages | null = null;
      if (legacyRes?.ok) {
        const json = await safeAwait(
          legacyRes.json() as Promise<MarketingMessages>,
          `marketing_i18n.fetch_legacy_json:${locale}`,
          MARKETING_I18N_TIMEOUT_MS,
        );
        if (!json) return null;
        const raw = normalizeMarketingMessagesRecord(json);
        if (Object.keys(raw).length === 0) {
          safeServerLog("i18n", "cdn_bundle_fetch_failed", { locale, status: legacyStatus });
          return null;
        }
        cdnFragmentCache.set(`${cacheGen}|${locale}|legacy`, raw);
        data = raw;
      } else {
        const merged: MarketingMessages = {};
        for (const name of PUBLIC_I18N_SHARD_FILENAMES) {
          const shardUrl = `${base}/${encodeURIComponent(locale)}/${encodeURIComponent(name)}.json`;
          const part = await fetchCdnFragment(cacheGen, locale, `shard:${name}`, shardUrl);
          if (!part) {
            safeServerLog("i18n", "cdn_shard_fetch_failed", {
              locale,
              shard: name,
              status: "missing",
            });
            return null;
          }
          for (const [k, v] of Object.entries(part)) {
            if (k in merged) {
              safeServerLog("i18n", "cdn_shard_duplicate_key_last_wins", {
                locale,
                shard: name,
                key: k.slice(0, 120),
              });
            }
            merged[k] = v;
          }
        }
        data = merged;
      }

      if (!data || Object.keys(data).length === 0) {
        safeServerLog("i18n", "cdn_bundle_fetch_failed", { locale, status: legacyStatus });
        return null;
      }

      const enDisk = tryLoadEnglishDiskBundle();
      if (enDisk && Object.keys(enDisk).length > 0) {
        data = mergeMissingMessageKeys(data, enDisk);
      }
      cdnLocaleMergedCache.set(mergedKey, data);
      return data;
    } catch (e) {
      const detail = e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200);
      safeServerLog("i18n", "cdn_bundle_fetch_error", { locale, detail });
      captureMarketingI18nSoftError({
        scope: "marketing_i18n",
        event: "cdn_bundle_fetch_error",
        error: e,
        feature: "marketing_i18n",
        meta: { locale, detail },
      });
      return null;
    } finally {
      cdnInflight.delete(mergedInflightKey);
    }
    },
  );

  cdnInflight.set(mergedInflightKey, work);
  return work;
}

/**
 * Synchronous load from local `public/i18n` only (no CDN). Prefer `loadMarketingMessages` in async contexts.
 * @deprecated Use `loadMarketingMessages` — CDN-backed bundles require async fetch when files are not on disk.
 */
export function loadMarketingMessagesSync(locale: string): MarketingMessages {
  const disk = loadFromDiskSync(locale);
  if (disk) return disk;
  safeServerLog("i18n", "merged_bundle_missing", { locale, syncOnly: true });
  if (locale === DEFAULT_MARKETING_LOCALE) {
    return loadEnglishBundleFromDisk();
  }
  return {} as MarketingMessages;
}

async function loadMarketingMessagesImpl(locale: string): Promise<MarketingMessages> {
  return withMarketingI18nSpan(
    {
      name: "marketing.i18n.load_messages",
      op: "resource.load",
      attributes: { locale },
    },
    async () => {
      if (shouldBypassMarketingI18nAtStartup()) {
        safeServerLog("i18n", "marketing_i18n_startup_bypass", {
          locale,
          mode: "merged",
          fallbackLocale: DEFAULT_MARKETING_LOCALE,
        });
        return loadEnglishBundleFromDisk();
      }

      if (process.env.NEXT_PHASE === MARKETING_BUILD_PHASE) {
        safeServerLog("i18n", "marketing_i18n_build_shard_only", {
          locale,
          mode: "build_shard_only",
          fallbackLocale: DEFAULT_MARKETING_LOCALE,
        });
        const chromeMessages = loadMarketingMessageShardsSync(locale, MARKETING_CHROME_MESSAGE_SHARDS);
        const fallbackChromeMessages =
          locale === DEFAULT_MARKETING_LOCALE
            ? chromeMessages
            : loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, MARKETING_CHROME_MESSAGE_SHARDS);
        return mergeMissingMessageKeys(chromeMessages, fallbackChromeMessages);
      }

      const disk = loadFromDiskSync(locale);
      if (disk) return disk;

      const fromCdn = await safeAwait(
        loadFromCdn(locale),
        `marketing_i18n.load_from_cdn:${locale}`,
        MARKETING_I18N_TIMEOUT_MS,
      );
      if (fromCdn) return fromCdn;

      safeServerLog("i18n", "merged_bundle_missing", { locale });
      if (locale === DEFAULT_MARKETING_LOCALE) {
        return loadEnglishBundleFromDisk();
      }
      return {} as MarketingMessages;
    },
  );
}

/** Server / Node: merged monolith + marketing strings. Tries disk first, then optional CDN, then English. */
export const loadMarketingMessages = cache(async function loadMarketingMessages(locale: string): Promise<MarketingMessages> {
  let p = loadMarketingMessagesModuleCache.get(locale);
  if (!p) {
    p = loadMarketingMessagesImpl(locale).catch((err) => {
      loadMarketingMessagesModuleCache.delete(locale);
      throw err;
    });
    loadMarketingMessagesModuleCache.set(locale, p);
  }
  return p;
});
