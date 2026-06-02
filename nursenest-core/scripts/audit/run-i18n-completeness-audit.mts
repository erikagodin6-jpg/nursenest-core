#!/usr/bin/env npx tsx
/**
 * Evidence-based i18n completeness audit (read-only, chunked).
 * Writes repo-root data/audit/i18n-*.json, data/audit/i18n-summary.md,
 * and data/import-reports/i18n-fixes-report.json
 *
 * Run after: `npm run i18n:compile` (repo root) so merged bundles are fresh.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { MARKETING_LOCALE_CODES, DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_LANGUAGES } from "@/lib/i18n/marketing-languages";
import { getLanguageStatus } from "@/lib/i18n/language-readiness";
import {
  REQUIRED_USER_UI_I18N_KEYS,
  validateRequiredUserUiI18nKeys,
} from "@/lib/i18n/required-user-ui-i18n-keys";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

/** Keep in sync with `language-completeness.ts` CRITICAL_KEY_PREFIXES (script cannot import that module — `server-only`). */
const CRITICAL_KEY_PREFIXES = [
  "nav.",
  "footer.",
  "pages.home.",
  "pages.pricing.",
  "pages.faq.",
  "pages.lessons.",
  "pages.questionBank.",
] as const;

type AuditLocaleCompleteness = {
  locale: string;
  status: ReturnType<typeof getLanguageStatus>;
  totalEnglishKeys: number;
  translatedKeys: number;
  coveragePct: number;
  missingCriticalPrefixes: string[];
  isReadyForPromotion: boolean;
};

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

function checkLocaleCompletenessForAudit(
  locale: string,
  enBundle: Record<string, string>,
  getLocaleBundle: (code: string) => Record<string, string> | null,
): AuditLocaleCompleteness {
  const status = getLanguageStatus(locale);
  if (!enBundle || Object.keys(enBundle).length === 0) {
    return {
      locale,
      status,
      totalEnglishKeys: 0,
      translatedKeys: 0,
      coveragePct: 0,
      missingCriticalPrefixes: [...CRITICAL_KEY_PREFIXES],
      isReadyForPromotion: false,
    };
  }
  const localeBundle = getLocaleBundle(locale);
  if (!localeBundle) {
    return {
      locale,
      status,
      totalEnglishKeys: Object.keys(enBundle).length,
      translatedKeys: 0,
      coveragePct: 0,
      missingCriticalPrefixes: [...CRITICAL_KEY_PREFIXES],
      isReadyForPromotion: false,
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
  return {
    locale,
    status,
    totalEnglishKeys,
    translatedKeys,
    coveragePct,
    missingCriticalPrefixes,
    isReadyForPromotion,
  };
}

function checkAllLocalesCompletenessForAudit(
  enBundle: Record<string, string>,
  getLocaleBundle: (code: string) => Record<string, string> | null,
): AuditLocaleCompleteness[] {
  return MARKETING_LOCALE_CODES.map((locale) =>
    checkLocaleCompletenessForAudit(locale, enBundle, getLocaleBundle),
  ).sort((a, b) => b.coveragePct - a.coveragePct);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "../..");
const REPO_ROOT = join(APP_ROOT, "..");
const OUT = join(REPO_ROOT, "data/audit");
const IMPORT_REPORTS = join(REPO_ROOT, "data/import-reports");
const I18N_PUBLIC = join(APP_ROOT, "public", "i18n");
const PLACEHOLDER_REPORT = join(REPO_ROOT, "tools/i18n/reports/placeholder-fallbacks.json");
const COMPILE_I18N_TS = join(REPO_ROOT, "script/compile-i18n.ts");
const GLOBAL_LOCALE_MATRIX = join(REPO_ROOT, "data/config/global-locale-matrix.json");
const I18N_SCAN_REPORT = join(REPO_ROOT, "scripts/i18n-scan-report.json");
const EDU_OVERLAYS = join(I18N_PUBLIC, "educational-overlays");

function readJson<T>(p: string): T | null {
  try {
    return JSON.parse(readFileSync(p, "utf8")) as T;
  } catch {
    return null;
  }
}

function loadBundle(locale: string): Record<string, string> | null {
  const p = join(I18N_PUBLIC, `${locale}.json`);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8")) as Record<string, string>;
  } catch {
    return null;
  }
}

function compilePipelineLanguages(): string[] {
  const src = readFileSync(COMPILE_I18N_TS, "utf8");
  const m = src.match(/const\s+LANGUAGES\s*=\s*\[([\s\S]*?)\]/);
  if (!m) return [];
  return m[1]
    .split(",")
    .map((s) => s.replace(/["'\s]/g, "").trim())
    .filter(Boolean);
}

function namespaceOf(key: string): string {
  const i = key.indexOf(".");
  return i === -1 ? key : key.slice(0, i);
}

/** Keys in en that are empty strings (should be rare). */
function emptyValueKeys(bundle: Record<string, string>): string[] {
  return Object.keys(bundle).filter((k) => typeof bundle[k] === "string" && bundle[k].trim() === "");
}

/** Non-English: values identical to English (compile-time alignment → English leakage for copy). */
function identicalToEnglishKeys(
  en: Record<string, string>,
  loc: Record<string, string>,
  locale: string,
): { count: number; sample: string[] } {
  if (locale === DEFAULT_MARKETING_LOCALE) return { count: 0, sample: [] };
  const sample: string[] = [];
  let count = 0;
  for (const k of Object.keys(en)) {
    const ev = en[k];
    const lv = loc[k];
    if (typeof lv !== "string" || lv.trim() === "") continue;
    if (lv === ev) {
      count++;
      if (sample.length < 40) sample.push(k);
    }
  }
  return { count, sample };
}

/** Namespace key counts present in English bundle. */
function namespaceHistogram(en: Record<string, string>): Record<string, number> {
  const h: Record<string, number> = {};
  for (const k of Object.keys(en)) {
    const ns = namespaceOf(k);
    h[ns] = (h[ns] ?? 0) + 1;
  }
  return h;
}

/** Per-locale overlay files under tools/i18n/marketing/locale/ */
function marketingOverlayPaths(): Record<string, string> {
  const dir = join(REPO_ROOT, "tools/i18n/marketing/locale");
  const out: Record<string, string> = {};
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const m = name.match(/^marketing-([a-z-]+)\.json$/);
    if (m) out[m[1]] = join("tools/i18n/marketing/locale", name);
  }
  return out;
}

function educationalOverlayInventory(): {
  locales: string[];
  byLocale: Record<string, { lessons: boolean; questions: boolean; flashcards: boolean }>;
} {
  const byLocale: Record<string, { lessons: boolean; questions: boolean; flashcards: boolean }> = {};
  if (!existsSync(EDU_OVERLAYS)) {
    return { locales: [], byLocale: {} };
  }
  const locales: string[] = [];
  for (const loc of readdirSync(EDU_OVERLAYS)) {
    const p = join(EDU_OVERLAYS, loc);
    if (!statSync(p).isDirectory()) continue;
    locales.push(loc);
    byLocale[loc] = {
      lessons: existsSync(join(p, "lessons.json")),
      questions: existsSync(join(p, "questions.json")),
      flashcards: existsSync(join(p, "flashcards.json")),
    };
  }
  locales.sort();
  return { locales, byLocale };
}

/** Line counts via ripgrep (optional) — avoids loading huge JSON. */
function rgCountLinesMatching(file: string, pattern: string): number | null {
  const r = spawnSync("rg", ["-F", "-c", pattern, file], { encoding: "utf8" });
  if (r.status !== 0 || !r.stdout) return null;
  const line = r.stdout.trim().split("\n")[0];
  const m = line?.match(/:(\d+)$/);
  return m ? Number(m[1]) : null;
}

function countNursenestScanViolations(): {
  reportBytes: number;
  linesMatchingPath: number | null;
  linesCritical: number | null;
  note: string;
} {
  if (!existsSync(I18N_SCAN_REPORT)) {
    return {
      reportBytes: 0,
      linesMatchingPath: null,
      linesCritical: null,
      note: "scripts/i18n-scan-report.json not found; run repo-root i18n scan to populate.",
    };
  }
  const reportBytes = statSync(I18N_SCAN_REPORT).size;
  const linesMatchingPath = rgCountLinesMatching(I18N_SCAN_REPORT, "nursenest-core/");
  const linesCritical = rgCountLinesMatching(I18N_SCAN_REPORT, '"severity": "critical"');
  return {
    reportBytes,
    linesMatchingPath,
    linesCritical,
    note:
      linesMatchingPath == null
        ? "ripgrep (rg) not available or no matches — install ripgrep for line counts."
        : "Approximate: counts matching substrings in i18n-scan-report.json lines.",
  };
}

function rgHasKeyRef(key: string): boolean {
  const r = spawnSync("rg", ["-F", "-q", key, join(APP_ROOT, "src")], { encoding: "utf8" });
  return r.status === 0;
}

/** Sample unused-key detection for `nav.*` keys only (bounded). */
function sampleUnusedNavKeys(en: Record<string, string>, maxCheck: number): { unchecked: number; possiblyUnused: string[] } {
  const navKeys = Object.keys(en).filter((k) => k.startsWith("nav."));
  const possiblyUnused: string[] = [];
  let checked = 0;
  for (const k of navKeys) {
    if (checked >= maxCheck) break;
    checked++;
    if (!rgHasKeyRef(k)) possiblyUnused.push(k);
  }
  return { unchecked: Math.max(0, navKeys.length - checked), possiblyUnused };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(IMPORT_REPORTS, { recursive: true });

  const generatedAt = new Date().toISOString();
  const compileLangs = compilePipelineLanguages();
  const en = loadBundle("en");
  if (!en) {
    console.error("[i18n-audit] Missing merged en.json — run npm run i18n:compile from repo root.");
    process.exit(1);
  }

  const enKeys = Object.keys(en);
  const nsHist = namespaceHistogram(en);
  const placeholderFallbacks = readJson<{
    generatedAt?: string;
    totalFallbacks?: number;
    byLocale?: Record<string, number>;
    events?: unknown[];
  }>(PLACEHOLDER_REPORT);

  const localeInventory = {
    generatedAt,
    supportedMarketingLocales: [...MARKETING_LOCALE_CODES],
    marketingLanguageMetadata: MARKETING_LANGUAGES,
    compilePipelineLanguages: compileLangs,
    compileVsMarketingMismatch:
      compileLangs.length !== MARKETING_LOCALE_CODES.length
        ? { compile: compileLangs.length, marketing: MARKETING_LOCALE_CODES.length }
        : null,
    defaultLocale: DEFAULT_MARKETING_LOCALE,
    bundleLoadPath: "nursenest-core/public/i18n/{locale}.json",
    sources: {
      monolith: "tools/i18n/source/i18n-{lang}.ts",
      marketingEnglish: "tools/i18n/marketing/marketing-en.json",
      marketingOverlays: marketingOverlayPaths(),
    },
    rtlLocalesNote: "ar, fa, ur — see marketing-locale-policy isRtlMarketingLocale",
  };

  const requiredUiResults: ReturnType<typeof validateRequiredUserUiI18nKeys>[] = [];
  for (const locale of MARKETING_LOCALE_CODES) {
    const bundle = loadBundle(locale);
    if (!bundle) {
      requiredUiResults.push({
        ok: false,
        locale,
        missing: [...REQUIRED_USER_UI_I18N_KEYS],
        empty: [],
      });
      continue;
    }
    requiredUiResults.push(validateRequiredUserUiI18nKeys(bundle as MarketingMessages, locale));
  }

  const keyCoverageByLocale: Record<
    string,
    {
      totalKeys: number;
      emptyKeys: number;
      identicalToEnglishCount: number;
      identicalToEnglishSample: string[];
      namespacesInLocale: number;
    }
  > = {};

  const missingKeysReport: {
    locale: string;
    missingVsEnglish: string[];
    empty: string[];
    requiredUserUiMissing: string[];
    requiredUserUiEmpty: string[];
  }[] = [];

  for (const locale of MARKETING_LOCALE_CODES) {
    const bundle = loadBundle(locale);
    if (!bundle) {
      missingKeysReport.push({
        locale,
        missingVsEnglish: [...enKeys],
        empty: [],
        requiredUserUiMissing: [...REQUIRED_USER_UI_I18N_KEYS],
        requiredUserUiEmpty: [],
      });
      keyCoverageByLocale[locale] = {
        totalKeys: 0,
        emptyKeys: 0,
        identicalToEnglishCount: 0,
        identicalToEnglishSample: [],
        namespacesInLocale: 0,
      };
      continue;
    }

    const missingVsEnglish = enKeys.filter((k) => bundle[k] === undefined);
    const empty = emptyValueKeys(bundle);
    const idEn = identicalToEnglishKeys(en, bundle, locale);
    const nsSet = new Set(Object.keys(bundle).map(namespaceOf));

    keyCoverageByLocale[locale] = {
      totalKeys: Object.keys(bundle).length,
      emptyKeys: empty.length,
      identicalToEnglishCount: idEn.count,
      identicalToEnglishSample: idEn.sample,
      namespacesInLocale: nsSet.size,
    };

    const req = requiredUiResults.find((r) => r.locale === locale)!;
    missingKeysReport.push({
      locale,
      missingVsEnglish,
      empty,
      requiredUserUiMissing: req.missing,
      requiredUserUiEmpty: req.empty,
    });
  }

  const completenessReports = checkAllLocalesCompletenessForAudit(en, loadBundle);

  const keyCoverageAudit = {
    generatedAt,
    englishKeyCount: enKeys.length,
    namespacesInEnglish: Object.keys(nsHist).length,
    topNamespacesByKeyCount: Object.entries(nsHist)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([ns, n]) => ({ namespace: ns, keys: n })),
    perLocale: keyCoverageByLocale,
    languageCompleteness: completenessReports.map((r) => ({
      locale: r.locale,
      status: r.status,
      coveragePct: r.coveragePct,
      translatedKeys: r.translatedKeys,
      totalEnglishKeys: r.totalEnglishKeys,
      missingCriticalPrefixes: r.missingCriticalPrefixes,
      isReadyForPromotion: r.isReadyForPromotion,
    })),
    criticalKeyPrefixes: [...CRITICAL_KEY_PREFIXES],
  };

  const fallbackLeakage = {
    generatedAt,
    compileTimeEnglishAlignment:
      "Non-en locales are aligned to English key set; identical string values indicate untranslated or same-as-English copy — see identicalToEnglishCount per locale in key coverage.",
    placeholderInterpolationFallbacks: placeholderFallbacks ?? { note: "report missing" },
    byLocaleIdenticalToEnglish: Object.fromEntries(
      MARKETING_LOCALE_CODES.map((loc) => [loc, keyCoverageByLocale[loc]?.identicalToEnglishCount ?? 0]),
    ),
  };

  const navUnusedSample = sampleUnusedNavKeys(en, 80);

  const unusedKeysReport = {
    generatedAt,
    methodology:
      "Full unused-key detection needs a static reference index for 15k+ keys. This report includes nav.* sampling (rg) and total English key count.",
    englishKeyCount: enKeys.length,
    navKeySample: navUnusedSample,
  };

  const scanCounts = countNursenestScanViolations();
  const dynamicStringAudit = {
    generatedAt,
    recommendation:
      "Repo-wide: `npx tsx scripts/i18n-scan.ts` (see i18n-scan.config.json). Report may be large; filter violations where file path contains `nursenest-core/`.",
    nursenestCoreViolationStreamScan: scanCounts,
  };

  const mixedLanguageAudit = {
    generatedAt,
    note: "Route-level mixed-language detection is not automated in this pass. Use identicalToEnglishCount + content overlay presence + manual QA for prioritized locales.",
    heuristicSignals: {
      highIdenticalToEnglishLocales: MARKETING_LOCALE_CODES.filter(
        (loc) => loc !== "en" && (keyCoverageByLocale[loc]?.identicalToEnglishCount ?? 0) > 5000,
      ),
    },
  };

  const eduInv = educationalOverlayInventory();
  const contentLocalizationAudit = {
    generatedAt,
    educationalOverlayLocales: eduInv.locales,
    perLocaleFiles: eduInv.byLocale,
    note: "Lesson/question/flashcard body text is primarily DB + catalog; overlays supplement. See docs/i18n-architecture.md.",
  };

  const userSurfaceAudit = {
    generatedAt,
    requiredUserUiChrome: {
      keyCount: REQUIRED_USER_UI_I18N_KEYS.length,
      allLocalesPass: requiredUiResults.every((r) => r.ok),
      failures: requiredUiResults.filter((r) => !r.ok).map((r) => ({ locale: r.locale, missing: r.missing, empty: r.empty })),
    },
    criticalPrefixesVsEnglish: completenessReports.map((r) => ({
      locale: r.locale,
      missingCriticalPrefixes: r.missingCriticalPrefixes,
    })),
  };

  let routeCountryMatrix: unknown = null;
  if (existsSync(GLOBAL_LOCALE_MATRIX)) {
    try {
      routeCountryMatrix = JSON.parse(readFileSync(GLOBAL_LOCALE_MATRIX, "utf8"));
    } catch {
      routeCountryMatrix = { error: "parse failed" };
    }
  }

  const runtimeRiskRegister = {
    generatedAt,
    risks: [
      {
        id: "placeholder-mismatch",
        severity: "medium",
        detail: "Locale strings missing {{vars}} vs English — see tools/i18n/reports/placeholder-fallbacks.json",
        count: placeholderFallbacks?.totalFallbacks ?? 0,
      },
      {
        id: "wide-english-copy",
        severity: "low",
        detail: "High identicalToEnglishCount means UI may read as English for that locale",
        locales: MARKETING_LOCALE_CODES.filter(
          (loc) => loc !== "en" && (keyCoverageByLocale[loc]?.identicalToEnglishCount ?? 0) > 8000,
        ),
      },
    ],
    adminExcludedFromPass: true,
  };

  const repairPlan = {
    generatedAt,
    priority: [
      "Run npm run i18n:compile after any marketing-en.json or overlay edit.",
      "Fix placeholder interpolation gaps listed in tools/i18n/reports/placeholder-fallbacks.json.",
      "Raise coverage for locales with missingCriticalPrefixes (language-completeness CRITICAL_KEY_PREFIXES).",
      "Expand educational-overlays for priority non-English locales (batched JSON).",
    ],
    automatedFixesThisPass: [] as string[],
  };

  const finalStatus = {
    generatedAt,
    requiredUserUiChrome: requiredUiResults.every((r) => r.ok) ? "pass" : "fail",
    marketingLocalesAudited: MARKETING_LOCALE_CODES.length,
    englishKeys: enKeys.length,
    placeholderFallbackEvents: placeholderFallbacks?.totalFallbacks ?? null,
    compilePipelineLanguageCount: compileLangs.length,
  };

  const summaryMd = `# i18n completeness audit

Generated: ${generatedAt}

## Scope

- **Admin surfaces** are excluded from required-user UI key gating (see \`required-user-ui-i18n-keys.ts\`).
- Merged bundles: \`nursenest-core/public/i18n/{locale}.json\` (regenerate via repo root \`npm run i18n:compile\`).

## Required user UI chrome (nav, pills, auth, dashboard breadcrumbs, learner account shell)

- Keys checked: **${REQUIRED_USER_UI_I18N_KEYS.length}**
- Status: **${finalStatus.requiredUserUiChrome}**
- Locales: **${MARKETING_LOCALE_CODES.join(", ")}**

## Counts

| Locale | Coverage % (distinct from en) | Identical-to-English keys | Empty keys |
|--------|------------------------------|---------------------------|------------|
${completenessReports
  .map(
    (r) =>
      `| ${r.locale} | ${r.coveragePct}% | ${keyCoverageByLocale[r.locale]?.identicalToEnglishCount ?? "—"} | ${keyCoverageByLocale[r.locale]?.emptyKeys ?? "—"} |`,
  )
  .join("\n")}

## Placeholder / interpolation fallbacks

- Total events (compile report): **${placeholderFallbacks?.totalFallbacks ?? "n/a"}**
- Details: \`tools/i18n/reports/placeholder-fallbacks.json\`

## Artifacts

| File | Purpose |
|------|---------|
| i18n-locale-inventory.json | Locales, tiers, sources |
| i18n-key-coverage-audit.json | Namespace + per-locale coverage |
| i18n-missing-keys.json | Missing vs en, empty, required UI |
| i18n-unused-keys.json | Nav key sampling + methodology |
| i18n-fallback-leakage.json | Placeholder report + identical-to-en |
| i18n-mixed-language-surface-audit.json | Heuristic signals |
| i18n-dynamic-string-audit.json | i18n scan pointers |
| i18n-user-surface-audit.json | Required UI + critical prefixes |
| i18n-content-localization-audit.json | Educational overlay files |
| i18n-route-country-exam-locale-audit.json | global-locale-matrix snapshot |
| i18n-runtime-risk-register.json | Risks |
| i18n-repair-plan.json | Next steps |
| i18n-final-status.json | Pass/fail summary |

## CI

- Run: \`npm run test:i18n-user-ui\` (in nursenest-core) — fails if any marketing locale misses required non-admin chrome keys.
`;

  await writeFile(join(OUT, "i18n-locale-inventory.json"), JSON.stringify(localeInventory, null, 2));
  await writeFile(join(OUT, "i18n-key-coverage-audit.json"), JSON.stringify(keyCoverageAudit, null, 2));
  await writeFile(join(OUT, "i18n-missing-keys.json"), JSON.stringify({ generatedAt, locales: missingKeysReport }, null, 2));
  await writeFile(join(OUT, "i18n-unused-keys.json"), JSON.stringify(unusedKeysReport, null, 2));
  await writeFile(join(OUT, "i18n-fallback-leakage.json"), JSON.stringify(fallbackLeakage, null, 2));
  await writeFile(join(OUT, "i18n-mixed-language-surface-audit.json"), JSON.stringify(mixedLanguageAudit, null, 2));
  await writeFile(join(OUT, "i18n-dynamic-string-audit.json"), JSON.stringify(dynamicStringAudit, null, 2));
  await writeFile(join(OUT, "i18n-user-surface-audit.json"), JSON.stringify(userSurfaceAudit, null, 2));
  await writeFile(join(OUT, "i18n-content-localization-audit.json"), JSON.stringify(contentLocalizationAudit, null, 2));
  await writeFile(
    join(OUT, "i18n-route-country-exam-locale-audit.json"),
    JSON.stringify(
      {
        generatedAt,
        sourceFile: "data/config/global-locale-matrix.json",
        matrix: routeCountryMatrix,
      },
      null,
      2,
    ),
  );
  await writeFile(join(OUT, "i18n-runtime-risk-register.json"), JSON.stringify(runtimeRiskRegister, null, 2));
  await writeFile(join(OUT, "i18n-repair-plan.json"), JSON.stringify(repairPlan, null, 2));
  await writeFile(join(OUT, "i18n-final-status.json"), JSON.stringify(finalStatus, null, 2));
  await writeFile(join(OUT, "i18n-summary.md"), summaryMd);

  await writeFile(
    join(IMPORT_REPORTS, "i18n-fixes-report.json"),
    JSON.stringify(
      {
        generatedAt,
        fixes: [] as { locale?: string; key?: string; action?: string }[],
        note: "Populate when applying low-risk key additions or overlay fills; keep in sync with git commits.",
      },
      null,
      2,
    ),
  );

  console.log(`[i18n-audit] wrote artifacts under ${OUT} and ${IMPORT_REPORTS}`);
  console.log(`[i18n-audit] required user UI chrome: ${finalStatus.requiredUserUiChrome}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
