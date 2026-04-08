import "server-only";
import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Canonical merged bundles live at `public/i18n/{locale}.json` (built by
 * `script/compile-i18n.ts` + `script/merge-marketing-i18n.ts`).
 *
 * Resolution order:
 * 1) Walk up from this module until `public/i18n/{locale}.json` exists (works when `process.cwd()`
 *    is the monorepo root, the app package, or `.next` output differs from deploy cwd).
 * 2) `process.cwd()`-relative paths for `public/i18n` and `nursenest-core/public/i18n`.
 *
 * Optional: `MARKETING_I18N_CDN_BASE` loads bundles when files are not on disk. CDN payloads are
 * merged with on-disk English for any missing/empty keys so stale CDN objects cannot drop groups
 * like `home.landing.*`.
 */
const MAX_MERGED_BUNDLE_BYTES = 12 * 1024 * 1024;

const isEmptyValue = (v: string | undefined): boolean =>
  v === undefined || (typeof v === "string" && v.trim() === "");

/** Fill holes in `primary` using `fallback` (same contract as client `formatMarketingMessage`). */
function mergeMissingMessageKeys(primary: MarketingMessages, fallback: MarketingMessages): MarketingMessages {
  if (!fallback || Object.keys(fallback).length === 0) return primary;
  const out: MarketingMessages = { ...primary };
  for (const [k, v] of Object.entries(fallback)) {
    if (isEmptyValue(out[k]) && !isEmptyValue(v)) out[k] = v;
  }
  return out;
}

function resolveMergedI18nPath(locale: string): string | null {
  const file = `${locale}.json`;

  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < 20; depth += 1) {
    const candidate = path.join(dir, "public", "i18n", file);
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  const root = process.cwd();
  const cwdCandidates = [
    path.join(root, "public", "i18n", file),
    path.join(root, "nursenest-core", "public", "i18n", file),
    path.join(root, "..", "nursenest-core", "public", "i18n", file),
  ];
  for (const p of cwdCandidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function marketingI18nCdnBase(): string | null {
  const b = process.env.MARKETING_I18N_CDN_BASE?.trim();
  return b && /^https?:\/\//i.test(b) ? b.replace(/\/$/, "") : null;
}

/** In-flight dedupe for CDN fetches (locale key). */
const cdnInflight = new Map<string, Promise<MarketingMessages | null>>();
const cdnResolved = new Map<string, MarketingMessages>();

/** Cached successful parse of on-disk English only (never cache empty/missing). */
let englishDiskBundleCache: MarketingMessages | null = null;
let englishDiskBundleLoadAttempted = false;

function tryLoadEnglishDiskBundle(): MarketingMessages | null {
  if (englishDiskBundleCache) return englishDiskBundleCache;
  if (englishDiskBundleLoadAttempted) return null;
  englishDiskBundleLoadAttempted = true;
  const fp = resolveMergedI18nPath(DEFAULT_MARKETING_LOCALE);
  if (!fp) {
    safeServerLog("i18n", "merged_bundle_missing", { locale: DEFAULT_MARKETING_LOCALE });
    return null;
  }
  try {
    const st = statSync(fp);
    if (st.size > MAX_MERGED_BUNDLE_BYTES) {
      safeServerLog("i18n", "merged_bundle_unusually_large", {
        locale: DEFAULT_MARKETING_LOCALE,
        bytes: st.size,
      });
    }
  } catch {
    /* best-effort stat */
  }
  try {
    const raw = readFileSync(fp, "utf8");
    const parsed = JSON.parse(raw) as MarketingMessages;
    englishDiskBundleCache = parsed;
    return parsed;
  } catch {
    safeServerLog("i18n", "merged_bundle_read_failed", { locale: DEFAULT_MARKETING_LOCALE });
    return null;
  }
}

function loadEnglishBundleFromDisk(): MarketingMessages {
  return tryLoadEnglishDiskBundle() ?? ({} as MarketingMessages);
}

function loadFromDiskSync(locale: string): MarketingMessages | null {
  const fp = resolveMergedI18nPath(locale);
  if (!fp) return null;
  try {
    const raw = readFileSync(fp, "utf8");
    return JSON.parse(raw) as MarketingMessages;
  } catch {
    safeServerLog("i18n", "merged_bundle_read_failed", { locale });
    return null;
  }
}

async function loadFromCdn(locale: string): Promise<MarketingMessages | null> {
  const base = marketingI18nCdnBase();
  if (!base) return null;

  const hit = cdnResolved.get(locale);
  if (hit) return hit;

  const pending = cdnInflight.get(locale);
  if (pending) return pending;

  const url = `${base}/${encodeURIComponent(locale)}.json`;
  const work = (async () => {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) {
        safeServerLog("i18n", "cdn_bundle_fetch_failed", { locale, status: res.status });
        return null;
      }
      let data = (await res.json()) as MarketingMessages;
      const enDisk = tryLoadEnglishDiskBundle();
      if (enDisk && Object.keys(enDisk).length > 0) {
        data = mergeMissingMessageKeys(data, enDisk);
      }
      cdnResolved.set(locale, data);
      return data;
    } catch (e) {
      const detail = e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200);
      safeServerLog("i18n", "cdn_bundle_fetch_error", { locale, detail });
      return null;
    } finally {
      cdnInflight.delete(locale);
    }
  })();

  cdnInflight.set(locale, work);
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

/** Server / Node: merged monolith + marketing strings. Tries disk first, then optional CDN, then English. */
export async function loadMarketingMessages(locale: string): Promise<MarketingMessages> {
  const disk = loadFromDiskSync(locale);
  if (disk) return disk;

  const fromCdn = await loadFromCdn(locale);
  if (fromCdn) return fromCdn;

  safeServerLog("i18n", "merged_bundle_missing", { locale });
  if (locale === DEFAULT_MARKETING_LOCALE) {
    return loadEnglishBundleFromDisk();
  }
  return {} as MarketingMessages;
}
