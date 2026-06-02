#!/usr/bin/env npx tsx
/**
 * Machine-readable translation gap reports (read-only).
 *
 * - Groups missing / empty keys vs English by namespace (first dot segment).
 * - Summarizes educational overlay file presence + lesson key counts vs a reference locale.
 * - Lists `[locale]` marketing routes whose `page.tsx` does not import `loadMarketingMessages`
 *   (layout still provides `MarketingI18nProvider`; this flags pages that may rely on layout-only strings).
 * - Subsets hardcoded scan output to learner/auth/lesson/flashcard/question/dashboard-ish paths when
 *   `data/audit/hardcoded-ui-strings-nursenest-core.json` exists.
 *
 * Run after: `npm run i18n:compile` (repo root) and optionally
 * `npx tsx scripts/i18n-scan.ts --preset=nursenest-ui` (repo root).
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_MARKETING_LOCALE, MARKETING_LOCALE_CODES } from "@/lib/i18n/marketing-locale-policy";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "../..");
const REPO_ROOT = join(APP_ROOT, "..");
const OUT = join(REPO_ROOT, "data/audit");
const I18N_PUBLIC = join(APP_ROOT, "public", "i18n");
const EDU_OVERLAYS = join(I18N_PUBLIC, "educational-overlays");
const LOCALE_PAGES_DIR = join(APP_ROOT, "src/app/(marketing)/[locale]");
const HARDCODED_FULL = join(REPO_ROOT, "data/audit/hardcoded-ui-strings-nursenest-core.json");

function namespaceOf(key: string): string {
  const i = key.indexOf(".");
  return i === -1 ? key : key.slice(0, i);
}

function groupKeysByNamespace(keys: string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const k of keys) {
    const ns = namespaceOf(k);
    if (!out[ns]) out[ns] = [];
    out[ns].push(k);
  }
  for (const ns of Object.keys(out)) {
    out[ns].sort();
  }
  return out;
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

function emptyValueKeys(bundle: Record<string, string>): string[] {
  return Object.keys(bundle).filter((k) => typeof bundle[k] === "string" && bundle[k].trim() === "");
}

function countLessonOverlayKeys(path: string): number {
  if (!existsSync(path)) return 0;
  try {
    const j = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
    return Object.keys(j).length;
  } catch {
    return 0;
  }
}

/** Path segments suggesting user-facing chrome the product cares about (excludes admin). */
const USER_SURFACE_PATH_SUBSTRINGS = [
  "/auth/",
  "/learner/",
  "/lessons/",
  "/lesson",
  "/flashcard",
  "/question",
  "/dashboard",
  "/account",
  "/profile",
  "/shell/",
  "/marketing/",
  "/layout/site-",
  "/site-header",
  "/site-footer",
  "/pathway-lesson",
  "/practice",
] as const;

function isUserSurfacePath(file: string): boolean {
  const lower = file.toLowerCase();
  return USER_SURFACE_PATH_SUBSTRINGS.some((s) => lower.includes(s));
}

type Violation = {
  file: string;
  line: number;
  column: number;
  text: string;
  context: string;
  severity: string;
};

type ScanReport = {
  violations: Violation[];
  totalViolations?: number;
  totalFiles?: number;
  bySeverity?: Record<string, number>;
};

function walkPageFiles(dir: string, acc: string[]): void {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walkPageFiles(p, acc);
    } else if (name === "page.tsx") {
      acc.push(p);
    }
  }
}

function pageImportsLoadMarketingMessages(file: string): boolean {
  const src = readFileSync(file, "utf8");
  return (
    src.includes("loadMarketingMessages") ||
    src.includes("useMarketingI18n") ||
    src.includes("getTranslations(")
  );
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const generatedAt = new Date().toISOString();

  const en = loadBundle(DEFAULT_MARKETING_LOCALE);
  if (!en) {
    console.error("[translation-gaps] Missing merged en.json — run npm run i18n:compile from repo root.");
    process.exit(1);
  }
  const enKeys = Object.keys(en);

  const missingOrEmptyByLocale: Record<
    string,
    {
      missingVsEnglish: string[];
      empty: string[];
      missingVsEnglishByNamespace: Record<string, string[]>;
      emptyByNamespace: Record<string, string[]>;
    }
  > = {};

  for (const locale of MARKETING_LOCALE_CODES) {
    const bundle = loadBundle(locale);
    if (!bundle) {
      missingOrEmptyByLocale[locale] = {
        missingVsEnglish: [...enKeys],
        empty: [],
        missingVsEnglishByNamespace: groupKeysByNamespace([...enKeys]),
        emptyByNamespace: {},
      };
      continue;
    }
    const missingVsEnglish = enKeys.filter((k) => bundle[k] === undefined);
    const empty = emptyValueKeys(bundle);
    missingOrEmptyByLocale[locale] = {
      missingVsEnglish,
      empty,
      missingVsEnglishByNamespace: groupKeysByNamespace(missingVsEnglish),
      emptyByNamespace: groupKeysByNamespace(empty),
    };
  }

  const eduLocales = existsSync(EDU_OVERLAYS) ? readdirSync(EDU_OVERLAYS).filter((x) => statSync(join(EDU_OVERLAYS, x)).isDirectory()) : [];
  eduLocales.sort();

  const referenceLocale = eduLocales.includes("fr") ? "fr" : eduLocales[0] ?? "";
  const refLessonPath = referenceLocale ? join(EDU_OVERLAYS, referenceLocale, "lessons.json") : "";
  const refLessonKeys = referenceLocale ? countLessonOverlayKeys(refLessonPath) : 0;

  const educationalOverlaySummary = {
    referenceLocale: referenceLocale || null,
    referenceLessonOverlayKeyCount: refLessonKeys,
    note:
      "Lesson/question/flashcard bodies are primarily catalog/DB; overlays supplement selected keys. Locales without overlay files rely on English or in-app fallbacks.",
    perLocale: Object.fromEntries(
      MARKETING_LOCALE_CODES.map((loc) => {
        const base = join(EDU_OVERLAYS, loc);
        const lessons = join(base, "lessons.json");
        const questions = join(base, "questions.json");
        const flashcards = join(base, "flashcards.json");
        return [
          loc,
          {
            hasLessonsOverlay: existsSync(lessons),
            hasQuestionsOverlay: existsSync(questions),
            hasFlashcardsOverlay: existsSync(flashcards),
            lessonOverlayKeyCount: countLessonOverlayKeys(lessons),
            gapVsReferenceLessonKeys:
              referenceLocale && loc !== referenceLocale && refLessonKeys > 0
                ? Math.max(0, refLessonKeys - countLessonOverlayKeys(lessons))
                : null,
          },
        ];
      }),
    ),
  };

  const localePageFiles: string[] = [];
  walkPageFiles(LOCALE_PAGES_DIR, localePageFiles);
  const marketingLocalePagesWithoutDirectMessagesImport = localePageFiles
    .filter((f) => !pageImportsLoadMarketingMessages(f))
    .map((f) => relative(APP_ROOT, f).replace(/\\/g, "/"));

  const report = {
    generatedAt,
    sources: {
      mergedBundles: "nursenest-core/public/i18n/{locale}.json",
      educationalOverlays: "nursenest-core/public/i18n/educational-overlays/{locale}/",
      marketingLocalePages: "nursenest-core/src/app/(marketing)/[locale]/**/page.tsx",
    },
    missingOrEmptyByLocaleAndNamespace: missingOrEmptyByLocale,
    educationalOverlaySummary,
    localizedMarketingRoutes: {
      note:
        "Parent layout loads `loadMarketingMessages` for `MarketingI18nProvider`. Pages listed here do not import message loaders in `page.tsx` — metadata and some child components may still be English-only.",
      pageFilesWithoutDirectLoaderImport: marketingLocalePagesWithoutDirectMessagesImport.sort(),
    },
  };

  writeFileSync(join(OUT, "translation-gaps-by-namespace.json"), JSON.stringify(report, null, 2));
  console.log(`[translation-gaps] wrote ${relative(REPO_ROOT, join(OUT, "translation-gaps-by-namespace.json"))}`);

  if (existsSync(HARDCODED_FULL)) {
    const raw = JSON.parse(readFileSync(HARDCODED_FULL, "utf8")) as ScanReport;
    const violations = raw.violations ?? [];
    const filtered = violations.filter((v) => isUserSurfacePath(v.file));
    const subset: ScanReport = {
      ...raw,
      totalViolations: filtered.length,
      violations: filtered,
    };
    const outPath = join(OUT, "hardcoded-ui-strings-nursenest-core-user-surfaces.json");
    writeFileSync(outPath, JSON.stringify(subset, null, 2));
    console.log(`[translation-gaps] wrote ${relative(REPO_ROOT, outPath)} (${filtered.length} violations, filtered from ${violations.length})`);
  } else {
    console.log(
      `[translation-gaps] skip user-surface hardcoded subset — run: npx tsx scripts/i18n-scan.ts --preset=nursenest-ui`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
