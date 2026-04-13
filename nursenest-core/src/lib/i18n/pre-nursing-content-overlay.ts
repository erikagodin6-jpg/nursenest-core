import "server-only";

import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { safeServerLog } from "@/lib/observability/safe-server-log";

// Re-export types and the pure apply helper from the shared (client-safe) module
// so that server imports from this path continue to work unchanged.
export type { PreNursingModuleOverlay, PreNursingQuestionOverlay } from "./pre-nursing-overlay-types";
export { applyPreNursingQuestionsOverlay } from "./pre-nursing-overlay-types";

// ── Caches ────────────────────────────────────────────────────────────────────

import type { PreNursingModuleOverlay, PreNursingQuestionOverlay } from "./pre-nursing-overlay-types";

const moduleOverlayCache = new Map<string, PreNursingModuleOverlay | null>();
const questionOverlayCache = new Map<string, Record<string, PreNursingQuestionOverlay> | null>();

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveEducationalI18nRoot(): string {
  const cwd = /* turbopackIgnore: true */ process.cwd();
  const primary = path.join(cwd, "public", "i18n", "educational-overlays");
  const nestedMonorepo = path.join(cwd, "nursenest-core", "public", "i18n", "educational-overlays");
  if (existsSync(primary)) return primary;
  if (existsSync(nestedMonorepo)) return nestedMonorepo;
  return primary;
}

function readJsonFile<T>(fp: string): T | null {
  if (!existsSync(fp)) return null;
  try {
    return JSON.parse(readFileSync(/* turbopackIgnore: true */ fp, "utf8")) as T;
  } catch (e) {
    safeServerLog("i18n", "pre_nursing_overlay_parse_failed", {
      path: fp,
      detail: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the module prose overlay for a given locale and slug.
 * English always returns `null` (modules render native TSX).
 * Non-English locales return `null` when the overlay file is absent — callers
 * should treat `null` as "render English content".
 *
 * Files are cached per `locale:slug` after first read.
 */
export function loadPreNursingModuleOverlay(
  locale: string,
  slug: string,
): PreNursingModuleOverlay | null {
  if (locale === DEFAULT_MARKETING_LOCALE) return null;
  const key = `${locale}:${slug}`;
  if (moduleOverlayCache.has(key)) return moduleOverlayCache.get(key) ?? null;
  const base = resolveEducationalI18nRoot();
  const fp = path.join(base, locale, "pre-nursing-modules", `${slug}.json`);
  const data = readJsonFile<PreNursingModuleOverlay>(fp);
  const overlay = data && typeof data === "object" ? data : null;
  moduleOverlayCache.set(key, overlay);
  return overlay;
}

/**
 * Returns the full question overlay bundle for a locale.
 * English always returns `{}`.  Non-English returns an empty object when the
 * overlay file is absent.
 *
 * Bundle is cached per locale after first read.
 */
export function loadPreNursingQuestionsOverlay(
  locale: string,
): Record<string, PreNursingQuestionOverlay> {
  if (locale === DEFAULT_MARKETING_LOCALE) return {};
  const hit = questionOverlayCache.get(locale);
  if (hit !== undefined) return hit ?? {};
  const base = resolveEducationalI18nRoot();
  const fp = path.join(base, locale, "pre-nursing-questions.json");
  const data = readJsonFile<Record<string, PreNursingQuestionOverlay>>(fp);
  const bundle = data && typeof data === "object" ? data : null;
  questionOverlayCache.set(locale, bundle);
  return bundle ?? {};
}

/**
 * Returns the set of module slugs that have an overlay file for the given locale.
 * Used by the sitemap generator to avoid emitting URLs that would 404.
 * English always returns an empty set (no overlay files needed for the default locale).
 */
export function getPreNursingOverlaySlugsForLocale(locale: string): Set<string> {
  if (locale === DEFAULT_MARKETING_LOCALE) return new Set();
  const base = resolveEducationalI18nRoot();
  const dir = path.join(base, locale, "pre-nursing-modules");
  if (!existsSync(dir)) return new Set();
  try {
    return new Set(
      readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(/\.json$/, "")),
    );
  } catch {
    return new Set();
  }
}
