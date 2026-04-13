/**
 * Language completeness checker — server-only script/admin utility.
 *
 * Reads translation bundles from disk and reports coverage vs English.
 * Use this as part of the add-new-language workflow (see `language-readiness.ts`)
 * and in CI to gate language tier promotions.
 *
 * NOT imported by page rendering — keep in scripts or admin API routes only.
 *
 * Usage (in a script or admin route):
 *
 *   import { checkLocaleCompleteness, checkAllLocalesCompleteness } from "@/lib/i18n/language-completeness";
 *   const report = checkLocaleCompleteness("fr");
 *   console.log(report);
 */

import "server-only";

import { existsSync, readFileSync } from "fs";
import path from "path";
import { MARKETING_LOCALE_CODES, DEFAULT_MARKETING_LOCALE } from "./marketing-locale-policy";
import { getLanguageStatus, LANGUAGE_PROMOTION_CHECKLIST } from "./language-readiness";

// ─── Critical key groups ──────────────────────────────────────────────────────

/**
 * Key prefixes that must reach ≥80% translation coverage for a language to be
 * considered functionally complete (ready for tier=full promotion).
 */
export const CRITICAL_KEY_PREFIXES = [
  "nav.",
  "footer.",
  "pages.home.",
  "pages.pricing.",
  "pages.faq.",
  "pages.lessons.",
  "pages.questionBank.",
] as const;

export type CriticalKeyPrefix = (typeof CRITICAL_KEY_PREFIXES)[number];

// ─── Report type ──────────────────────────────────────────────────────────────

export interface LocaleCompletenessReport {
  locale: string;
  /** Resolved lifecycle status from language-readiness. */
  status: ReturnType<typeof getLanguageStatus>;
  /** Total number of keys in the English reference bundle. */
  totalEnglishKeys: number;
  /** Keys present in the locale bundle with non-empty, non-identical-to-English values. */
  translatedKeys: number;
  /** Percentage of English keys with a distinct translation (0–100). */
  coveragePct: number;
  /** Critical prefixes where locale coverage is below the 80% threshold. */
  missingCriticalPrefixes: string[];
  /** True when all critical prefixes pass and overall coverage ≥ 80%. */
  isReadyForPromotion: boolean;
  /** Human-readable summary for CI logs / admin dashboards. */
  summary: string;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function loadBundle(locale: string): Record<string, string> | null {
  const file = `${locale}.json`;
  const candidates = [
    path.join(process.cwd(), "public", "i18n", file),
    path.join(process.cwd(), "nursenest-core", "public", "i18n", file),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      try {
        const raw = readFileSync(p, "utf-8");
        return JSON.parse(raw) as Record<string, string>;
      } catch {
        return null;
      }
    }
  }
  return null;
}

function prefixCoverage(
  prefix: string,
  enBundle: Record<string, string>,
  localeBundle: Record<string, string>,
): { total: number; translated: number; pct: number } {
  const keys = Object.keys(enBundle).filter((k) => k.startsWith(prefix));
  if (keys.length === 0) return { total: 0, translated: 0, pct: 100 };
  const translated = keys.filter(
    (k) => localeBundle[k] && localeBundle[k].trim() !== "" && localeBundle[k] !== enBundle[k],
  ).length;
  return { total: keys.length, translated, pct: Math.round((translated / keys.length) * 100) };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Check translation completeness for a single locale. */
export function checkLocaleCompleteness(locale: string): LocaleCompletenessReport {
  const status = getLanguageStatus(locale);

  const enBundle = loadBundle(DEFAULT_MARKETING_LOCALE);
  if (!enBundle) {
    return {
      locale,
      status,
      totalEnglishKeys: 0,
      translatedKeys: 0,
      coveragePct: 0,
      missingCriticalPrefixes: [...CRITICAL_KEY_PREFIXES],
      isReadyForPromotion: false,
      summary: `[${locale}] ERROR: English reference bundle not found on disk.`,
    };
  }

  const localeBundle = loadBundle(locale);
  if (!localeBundle) {
    return {
      locale,
      status,
      totalEnglishKeys: Object.keys(enBundle).length,
      translatedKeys: 0,
      coveragePct: 0,
      missingCriticalPrefixes: [...CRITICAL_KEY_PREFIXES],
      isReadyForPromotion: false,
      summary: `[${locale}] MISSING: No bundle found at public/i18n/${locale}.json`,
    };
  }

  const enKeys = Object.keys(enBundle);
  const totalEnglishKeys = enKeys.length;
  const translatedKeys = enKeys.filter(
    (k) => localeBundle[k] && localeBundle[k].trim() !== "" && localeBundle[k] !== enBundle[k],
  ).length;
  const coveragePct = totalEnglishKeys > 0 ? Math.round((translatedKeys / totalEnglishKeys) * 100) : 0;

  const missingCriticalPrefixes = CRITICAL_KEY_PREFIXES.filter((prefix) => {
    const { pct } = prefixCoverage(prefix, enBundle, localeBundle);
    return pct < 80;
  });

  const isReadyForPromotion = missingCriticalPrefixes.length === 0 && coveragePct >= 80;

  const summary = [
    `[${locale}] status=${status} coverage=${coveragePct}% (${translatedKeys}/${totalEnglishKeys} keys)`,
    missingCriticalPrefixes.length > 0
      ? `  ⚠ Missing critical prefixes (<80%): ${missingCriticalPrefixes.join(", ")}`
      : "  ✓ All critical prefixes pass",
    isReadyForPromotion ? "  → READY for tier=full promotion" : "  → NOT ready for promotion",
  ].join("\n");

  return {
    locale,
    status,
    totalEnglishKeys,
    translatedKeys,
    coveragePct,
    missingCriticalPrefixes,
    isReadyForPromotion,
    summary,
  };
}

/** Check completeness for all registered locale codes and return sorted by coverage descending. */
export function checkAllLocalesCompleteness(): LocaleCompletenessReport[] {
  return MARKETING_LOCALE_CODES.map(checkLocaleCompleteness).sort((a, b) => b.coveragePct - a.coveragePct);
}

/**
 * Print a human-readable completeness table to the given log function.
 * Safe to call from scripts, admin routes, or CI pipelines.
 *
 * @example
 * import { printCompletenessTable } from "@/lib/i18n/language-completeness";
 * printCompletenessTable(console.log);
 */
export function printCompletenessTable(log: (msg: string) => void = console.log): void {
  const reports = checkAllLocalesCompleteness();
  log("\n=== Language Completeness Report ===");
  log(`${"Locale".padEnd(8)} ${"Status".padEnd(10)} ${"Coverage".padEnd(12)} ${"Ready?".padEnd(8)} Missing critical`);
  log("-".repeat(72));
  for (const r of reports) {
    const readyMark = r.isReadyForPromotion ? "✓" : "✗";
    const missing = r.missingCriticalPrefixes.length > 0 ? r.missingCriticalPrefixes.join(", ") : "—";
    log(
      `${r.locale.padEnd(8)} ${r.status.padEnd(10)} ${`${r.coveragePct}%`.padEnd(12)} ${readyMark.padEnd(8)} ${missing}`,
    );
  }
  log("\nPromotion checklist:");
  LANGUAGE_PROMOTION_CHECKLIST.forEach((item, i) => log(`  ${i + 1}. ${item}`));
  log("===================================\n");
}
