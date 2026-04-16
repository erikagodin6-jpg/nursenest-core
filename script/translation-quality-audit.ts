#!/usr/bin/env npx tsx
/**
 * Structural translation quality audit: merged locale bundles vs English reference.
 *
 * Does not require human fluency — uses key parity, placeholders, empties, identity to English,
 * raw-key-shaped values, HTML balance vs English, and script heuristics for non-Latin locales.
 *
 * Run after `npm run i18n:compile`:
 *   npm run i18n:audit:translation
 *
 * Outputs:
 *   tools/i18n/reports/translation-quality-audit.json
 *   tools/i18n/reports/translation-quality-audit.md
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { I18N_LANGUAGES } from "./merge-marketing-i18n";
import { REPO_ROOT } from "./repo-root";

const CLIENT_I18N = path.join(REPO_ROOT, "client/public/i18n");
const MARKETING_EN = path.join(REPO_ROOT, "tools/i18n/marketing/marketing-en.json");
const MARKETING_LOCALE_DIR = path.join(REPO_ROOT, "tools/i18n/marketing/locale");
const REPORT_DIR = path.join(REPO_ROOT, "tools/i18n/reports");
/** Condensed report (safe to commit; capped samples). */
const JSON_SUMMARY_OUT = path.join(REPORT_DIR, "translation-quality-audit.json");
/** Only when `--full` — large file; listed in .gitignore. */
const JSON_FULL_OUT = path.join(REPORT_DIR, "translation-quality-audit-full.json");
const MD_OUT = path.join(REPORT_DIR, "translation-quality-audit.md");

const SAMPLE_KEYS = 40;
const SAMPLE_IDENTICAL = 15;

function loadJson(p: string): Record<string, string> | null {
  if (!existsSync(p)) return null;
  try {
    const raw = JSON.parse(readFileSync(p, "utf8"));
    if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, string>;
  } catch {
    return null;
  }
  return null;
}

function placeholderNames(s: string): string[] {
  const re = /\{\{\s*([^}]+?)\s*\}\}/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    names.push(m[1].trim());
  }
  return [...new Set(names)].sort();
}

/** Looks like a leaked i18n key path shown as UI text (e.g. `pages.home.hero`). Excludes `host.tld`. */
function looksLikeRawKeyPath(s: string): boolean {
  const t = s.trim();
  if (t.length < 8 || t.length > 120) return false;
  if (!t.includes(".")) return false;
  const segments = t.split(".").filter((seg) => seg.length > 0);
  /** Require ≥3 segments so `nursenest.ca` is not flagged. */
  if (segments.length < 3) return false;
  return segments.every((seg) => /^[a-z][a-z0-9_]*$/i.test(seg));
}

function htmlOpenCloseDelta(s: string): { open: number; close: number } {
  const open = (s.match(/<[^/!][^>]*>/g) ?? []).length;
  const close = (s.match(/<\/[^>]+>/g) ?? []).length;
  return { open, close };
}

const ENGLISH_STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "your",
  "from",
  "have",
  "are",
  "was",
  "will",
  "can",
  "our",
  "you",
  "not",
]);

function englishStopwordRatio(line: string): number {
  const words = line.toLowerCase().replace(/[^a-z\s]/gi, " ").split(/\s+/).filter((w) => w.length > 1);
  if (words.length === 0) return 0;
  let hit = 0;
  for (const w of words) {
    if (ENGLISH_STOPWORDS.has(w)) hit += 1;
  }
  return hit / words.length;
}

/** Long Latin-only line in locales expected to use non-Latin scripts. */
function scriptSuspicion(locale: string, value: string): string | null {
  if (value.length < 48) return null;
  const rtl = new Set(["ar", "fa", "ur"]);
  const cjk = new Set(["ja", "ko", "zh", "zh-tw"]);
  const cy = new Set(["ru"]);
  if (!rtl.has(locale) && !cjk.has(locale) && !cy.has(locale)) return null;
  const letters = value.replace(/[\s\d.,;:()[\]%°\-+/\\'"’“”{}#]/gu, "");
  if (letters.length < 36) return null;
  let latin = 0;
  for (const ch of letters) {
    if (/[A-Za-z]/.test(ch)) latin += 1;
  }
  const ratio = latin / letters.length;
  if (rtl.has(locale) && ratio > 0.55) return `high_latin_ratio_${(ratio * 100).toFixed(0)}pct`;
  if (cjk.has(locale) && ratio > 0.72) return `high_latin_ratio_${(ratio * 100).toFixed(0)}pct`;
  if (cy.has(locale) && ratio > 0.85 && !/[А-Яа-яЁё]/.test(value)) return `missing_cyrillic_chars`;
  return null;
}

/** Keys where identical English is common (brand, exams). */
const IDENTICAL_OK_PREFIXES = [
  "pages.admin",
  "staff.",
  "pages.staff",
  "exam.",
  "nclex",
  "NurseNest",
];

function allowIdentical(key: string): boolean {
  const k = key.toLowerCase();
  return IDENTICAL_OK_PREFIXES.some((p) => k.startsWith(p.toLowerCase()) || k.includes(p.toLowerCase()));
}

type LocaleReport = {
  locale: string;
  file: string;
  keyCount: number;
  missingVsEn: string[];
  extraVsEn: string[];
  emptyKeys: string[];
  placeholderMismatches: { key: string; en: string[]; loc: string[] }[];
  identicalToEnglish: string[];
  rawKeyShapedValues: { key: string; value: string }[];
  htmlBalanceMismatchesVsEn: { key: string; enDelta: string; locDelta: string }[];
  scriptSuspicions: { key: string; reason: string }[];
  englishStopwordHeavy: { key: string; ratio: string }[];
};

function auditLocale(en: Record<string, string>, locale: string, data: Record<string, string>): LocaleReport {
  const enKeys = Object.keys(en).sort();
  const locKeys = Object.keys(data).sort();
  const enSet = new Set(enKeys);
  const locSet = new Set(locKeys);
  const missingVsEn = enKeys.filter((k) => !locSet.has(k));
  const extraVsEn = locKeys.filter((k) => !enSet.has(k));
  const emptyKeys = locKeys.filter((k) => (data[k] ?? "").trim() === "");

  const placeholderMismatches: LocaleReport["placeholderMismatches"] = [];
  const identicalToEnglish: string[] = [];
  const rawKeyShapedValues: LocaleReport["rawKeyShapedValues"] = [];
  const htmlBalanceMismatchesVsEn: LocaleReport["htmlBalanceMismatchesVsEn"] = [];
  const scriptSuspicions: LocaleReport["scriptSuspicions"] = [];
  const englishStopwordHeavy: LocaleReport["englishStopwordHeavy"] = [];

  for (const k of enKeys) {
    if (!locSet.has(k)) continue;
    const enVal = en[k] ?? "";
    const locVal = data[k] ?? "";
    const pEn = placeholderNames(enVal);
    const pLoc = placeholderNames(locVal);
    if (JSON.stringify(pEn) !== JSON.stringify(pLoc)) {
      placeholderMismatches.push({ key: k, en: pEn, loc: pLoc });
    }
    if (locVal === enVal && locVal.length > 0 && locale !== "en" && !allowIdentical(k)) {
      if (locVal.length >= 12) identicalToEnglish.push(k);
    }
    if (looksLikeRawKeyPath(locVal)) {
      rawKeyShapedValues.push({ key: k, value: locVal.slice(0, 160) });
    }
    const enH = htmlOpenCloseDelta(enVal);
    const locH = htmlOpenCloseDelta(locVal);
    if (enH.open !== locH.open || enH.close !== locH.close) {
      if (enVal.includes("<") || locVal.includes("<")) {
        htmlBalanceMismatchesVsEn.push({
          key: k,
          enDelta: `${enH.open}/${enH.close}`,
          locDelta: `${locH.open}/${locH.close}`,
        });
      }
    }
    const scr = scriptSuspicion(locale, locVal);
    if (scr) scriptSuspicions.push({ key: k, reason: scr });
    if (locale !== "en" && locVal.length > 40) {
      const r = englishStopwordRatio(locVal);
      if (r > 0.38 && /^[\x00-\x7F\n\r\t]+$/.test(locVal)) {
        englishStopwordHeavy.push({ key: k, ratio: r.toFixed(2) });
      }
    }
  }

  return {
    locale,
    file: path.relative(REPO_ROOT, path.join(CLIENT_I18N, `${locale}.json`)),
    keyCount: locKeys.length,
    missingVsEn,
    extraVsEn,
    emptyKeys,
    placeholderMismatches,
    identicalToEnglish,
    rawKeyShapedValues,
    htmlBalanceMismatchesVsEn,
    scriptSuspicions,
    englishStopwordHeavy,
  };
}

type MarketingOverlayReport = {
  locale: string;
  file: string;
  missingVsEn: string[];
  extraVsEn: string[];
  emptyKeys: string[];
};

function auditMarketingOverlays(marketingEn: Record<string, string>): MarketingOverlayReport[] {
  const canonical = Object.keys(marketingEn).sort();
  const enKeys = new Set(canonical);
  const out: MarketingOverlayReport[] = [];
  for (const lang of I18N_LANGUAGES) {
    if (lang === "en") continue;
    const fp = path.join(MARKETING_LOCALE_DIR, `marketing-${lang}.json`);
    const data = loadJson(fp);
    if (!data) {
      out.push({
        locale: lang,
        file: path.relative(REPO_ROOT, fp),
        missingVsEn: [...canonical],
        extraVsEn: [],
        emptyKeys: [],
      });
      continue;
    }
    const keys = new Set(Object.keys(data));
    const missingVsEn = [...enKeys].filter((k) => !keys.has(k));
    const extraVsEn = [...keys].filter((k) => !enKeys.has(k));
    const emptyKeys = [...keys].filter((k) => (data[k] ?? "").trim() === "");
    out.push({
      locale: lang,
      file: path.relative(REPO_ROOT, fp),
      missingVsEn,
      extraVsEn,
      emptyKeys,
    });
  }
  return out;
}

function summarizeLocale(l: LocaleReport): Record<string, unknown> {
  return {
    locale: l.locale,
    file: l.file,
    keyCount: l.keyCount,
    missingVsEnCount: l.missingVsEn.length,
    missingVsEnSample: l.missingVsEn.slice(0, SAMPLE_KEYS),
    extraVsEnCount: l.extraVsEn.length,
    extraVsEnSample: l.extraVsEn.slice(0, SAMPLE_KEYS),
    emptyKeysCount: l.emptyKeys.length,
    emptyKeysSample: l.emptyKeys.slice(0, SAMPLE_KEYS),
    placeholderMismatches: l.placeholderMismatches.slice(0, 80),
    identicalToEnglishCount: l.identicalToEnglish.length,
    identicalToEnglishSample: l.identicalToEnglish.slice(0, SAMPLE_IDENTICAL),
    rawKeyShapedValues: l.rawKeyShapedValues.slice(0, 120),
    htmlBalanceMismatchesVsEn: l.htmlBalanceMismatchesVsEn.slice(0, 80),
    scriptSuspicions: l.scriptSuspicions.slice(0, 120),
    englishStopwordHeavy: l.englishStopwordHeavy.slice(0, 25),
  };
}

function summarizeMarketing(m: MarketingOverlayReport): Record<string, unknown> {
  return {
    locale: m.locale,
    file: m.file,
    missingVsEnCount: m.missingVsEn.length,
    missingVsEnSample: m.missingVsEn.slice(0, SAMPLE_KEYS),
    extraVsEnCount: m.extraVsEn.length,
    extraVsEnSample: m.extraVsEn.slice(0, SAMPLE_KEYS),
    emptyKeysCount: m.emptyKeys.length,
    emptyKeysSample: m.emptyKeys.slice(0, SAMPLE_KEYS),
  };
}

function main(): void {
  mkdirSync(REPORT_DIR, { recursive: true });
  const en = loadJson(path.join(CLIENT_I18N, "en.json"));
  if (!en) {
    console.error("[translation-quality-audit] Missing client/public/i18n/en.json — run npm run i18n:compile");
    process.exit(1);
  }
  const marketingEn = loadJson(MARKETING_EN);
  if (!marketingEn) {
    console.error("[translation-quality-audit] Missing tools/i18n/marketing/marketing-en.json");
    process.exit(1);
  }

  const locales: LocaleReport[] = [];
  for (const lang of I18N_LANGUAGES) {
    const fp = path.join(CLIENT_I18N, `${lang}.json`);
    const data = loadJson(fp);
    if (!data) {
      locales.push({
        locale: lang,
        file: path.relative(REPO_ROOT, fp),
        keyCount: 0,
        missingVsEn: Object.keys(en),
        extraVsEn: [],
        emptyKeys: [],
        placeholderMismatches: [],
        identicalToEnglish: [],
        rawKeyShapedValues: [],
        htmlBalanceMismatchesVsEn: [],
        scriptSuspicions: [],
        englishStopwordHeavy: [],
      });
      continue;
    }
    locales.push(auditLocale(en, lang, data));
  }

  const marketingOverlays = auditMarketingOverlays(marketingEn);
  const fullMode = process.argv.includes("--full");

  const summary = {
    generatedAt: new Date().toISOString(),
    referenceEnKeys: Object.keys(en).length,
    localesAudited: I18N_LANGUAGES.length,
    totals: {
      missingVsEnAcrossLocales: locales.reduce((a, l) => a + l.missingVsEn.length, 0),
      emptyKeysAcrossLocales: locales.reduce((a, l) => a + l.emptyKeys.length, 0),
      placeholderMismatchesAcrossLocales: locales.reduce((a, l) => a + l.placeholderMismatches.length, 0),
      identicalToEnglishKeysAcrossLocales: locales.reduce((a, l) => a + l.identicalToEnglish.length, 0),
      rawKeyShapedAcrossLocales: locales.reduce((a, l) => a + l.rawKeyShapedValues.length, 0),
      marketingOverlayMissingKeys: marketingOverlays.reduce((a, m) => a + m.missingVsEn.length, 0),
    },
    locales: locales.map(summarizeLocale),
    marketingOverlays: marketingOverlays.map(summarizeMarketing),
    note: "Capped samples — run with --full to write translation-quality-audit-full.json (large).",
  };

  writeFileSync(JSON_SUMMARY_OUT, JSON.stringify(summary, null, 2), "utf8");
  if (fullMode) {
    writeFileSync(
      JSON_FULL_OUT,
      JSON.stringify(
        {
          generatedAt: summary.generatedAt,
          referenceEnKeys: summary.referenceEnKeys,
          localesAudited: summary.localesAudited,
          totals: summary.totals,
          locales,
          marketingOverlays,
        },
        null,
        2,
      ),
      "utf8",
    );
  }

  const md: string[] = [];
  md.push(`# Translation quality audit`);
  md.push(``);
  md.push(`Generated: ${summary.generatedAt}`);
  md.push(``);
  md.push(`## Summary`);
  md.push(``);
  md.push(`| Metric | Count |`);
  md.push(`|--------|-------|`);
  md.push(`| English reference keys | ${summary.referenceEnKeys} |`);
  md.push(`| Missing keys vs en (all locales) | ${summary.totals.missingVsEnAcrossLocales} |`);
  md.push(`| Empty values (all locales) | ${summary.totals.emptyKeysAcrossLocales} |`);
  md.push(`| Placeholder mismatches vs en | ${summary.totals.placeholderMismatchesAcrossLocales} |`);
  md.push(`| Keys identical to English (non-admin heuristics) | ${summary.totals.identicalToEnglishKeysAcrossLocales} |`);
  md.push(`| Raw-key-shaped values | ${summary.totals.rawKeyShapedAcrossLocales} |`);
  md.push(`| Marketing overlay keys missing vs marketing-en | ${summary.totals.marketingOverlayMissingKeys} |`);
  md.push(``);
  md.push(`## Per-locale highlights`);
  md.push(``);
  for (const l of locales) {
    if (l.locale === "en") continue;
    const problems =
      l.missingVsEn.length +
      l.emptyKeys.length +
      l.placeholderMismatches.length +
      l.rawKeyShapedValues.length;
    if (problems === 0 && l.identicalToEnglish.length < 500) {
      md.push(`- **${l.locale}**: OK (structural); ${l.identicalToEnglish.length} keys still identical to English (review for real translation)`);
      continue;
    }
    md.push(`- **${l.locale}**: missing ${l.missingVsEn.length}, empty ${l.emptyKeys.length}, placeholder issues ${l.placeholderMismatches.length}, raw-key-shaped ${l.rawKeyShapedValues.length}, identical-to-en ${l.identicalToEnglish.length}`);
  }
  md.push(``);
  md.push(`Summary JSON (capped samples): \`${path.relative(REPO_ROOT, JSON_SUMMARY_OUT)}\``);
  if (fullMode) {
    md.push(`Full JSON: \`${path.relative(REPO_ROOT, JSON_FULL_OUT)}\``);
  }
  writeFileSync(MD_OUT, md.join("\n"), "utf8");

  console.log(`[translation-quality-audit] Wrote ${path.relative(REPO_ROOT, JSON_SUMMARY_OUT)}`);
  if (fullMode) console.log(`[translation-quality-audit] Wrote ${path.relative(REPO_ROOT, JSON_FULL_OUT)}`);
  console.log(`[translation-quality-audit] Wrote ${path.relative(REPO_ROOT, MD_OUT)}`);

  const hardFailures =
    summary.totals.missingVsEnAcrossLocales +
    summary.totals.placeholderMismatchesAcrossLocales +
    marketingOverlays.reduce((a, m) => a + m.missingVsEn.length + m.extraVsEn.length, 0);

  if (hardFailures > 0) {
    console.error(
      `[translation-quality-audit] WARNING: ${hardFailures} structural issues — fix keys or run npm run i18n:validate`,
    );
  }
}

main();
