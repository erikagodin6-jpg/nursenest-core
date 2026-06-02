#!/usr/bin/env npx tsx
/**
 * Ensures every compiled marketing/locale bundle includes all production-chrome keys
 * with non-empty values and {{placeholder}} names matching English (structural parity).
 *
 * Run after `npm run i18n:compile` from repo root or nursenest-core:
 *   cd nursenest-core && npm run i18n:validate-chrome-all-locales
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MARKETING_LOCALE_CODES } from "../src/lib/i18n/marketing-locale-policy";
import prodChromeKeys from "../src/lib/i18n/production-chrome-i18n-keys.ts";

const PRODUCTION_CHROME_I18N_KEYS: readonly string[] = Array.isArray(prodChromeKeys)
  ? prodChromeKeys
  : (prodChromeKeys as { PRODUCTION_CHROME_I18N_KEYS: readonly string[] }).PRODUCTION_CHROME_I18N_KEYS;

if (!Array.isArray(PRODUCTION_CHROME_I18N_KEYS) || PRODUCTION_CHROME_I18N_KEYS.length === 0) {
  console.error(
    "[i18n:validate-chrome-all-locales] Could not load PRODUCTION_CHROME_I18N_KEYS from production-chrome-i18n-keys.ts",
  );
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.join(__dirname, "..");
const REPO_ROOT = path.join(PKG_ROOT, "..");

const COMPILED_LOCALES = new Set([
  "en",
  "fr",
  "tl",
  "hi",
  "es",
  "zh",
  "zh-tw",
  "ar",
  "ko",
  "pt",
  "pa",
  "vi",
  "ht",
  "ur",
  "ja",
  "fa",
  "de",
  "th",
  "tr",
  "id",
  "it",
  "ru",
]);

function placeholderNames(s: string): string[] {
  const re = /\{\{\s*([^}]+?)\s*\}\}/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    names.push(m[1].trim());
  }
  return [...new Set(names)].sort();
}

function loadLocale(lang: string): Record<string, string> | null {
  const monolith = path.join(REPO_ROOT, "client", "public", "i18n", `${lang}.json`);
  if (!existsSync(monolith)) return null;
  try {
    return JSON.parse(readFileSync(monolith, "utf8")) as Record<string, string>;
  } catch {
    return null;
  }
}

function main(): void {
  const errors: string[] = [];
  const en = loadLocale("en");
  if (!en) {
    console.error("[i18n:validate-chrome-all-locales] Missing client/public/i18n/en.json (run i18n:compile from repo root)");
    process.exit(1);
  }

  for (const key of PRODUCTION_CHROME_I18N_KEYS) {
    const v = en[key];
    if (v === undefined || (typeof v === "string" && v.trim() === "")) {
      errors.push(`en missing/empty production chrome key: ${key}`);
    }
  }

  for (const locale of MARKETING_LOCALE_CODES) {
    if (!COMPILED_LOCALES.has(locale)) continue;
    const bundle = loadLocale(locale);
    if (!bundle) {
      errors.push(`[${locale}] missing merged bundle`);
      continue;
    }
    for (const key of PRODUCTION_CHROME_I18N_KEYS) {
      const val = bundle[key];
      if (val === undefined) {
        errors.push(`[${locale}] missing production chrome key: ${key}`);
        continue;
      }
      if (typeof val !== "string" || val.trim() === "") {
        errors.push(`[${locale}] empty production chrome key: ${key}`);
        continue;
      }
      const enVal = en[key] ?? "";
      const pEn = placeholderNames(enVal);
      const pLoc = placeholderNames(val);
      if (JSON.stringify(pEn) !== JSON.stringify(pLoc)) {
        errors.push(
          `[${locale}] placeholder mismatch for ${key}: en [${pEn.join(", ")}] vs [${pLoc.join(", ")}]`,
        );
      }
    }
  }

  if (errors.length) {
    console.error(`[i18n:validate-chrome-all-locales] FAILED — ${errors.length} issue(s)`);
    for (const e of errors.slice(0, 120)) console.error(" ", e);
    if (errors.length > 120) console.error(`  … and ${errors.length - 120} more`);
    process.exit(1);
  }
  console.log(
    `[i18n:validate-chrome-all-locales] OK — ${PRODUCTION_CHROME_I18N_KEYS.length} keys × ${[...MARKETING_LOCALE_CODES].filter((l) => COMPILED_LOCALES.has(l)).length} locales`,
  );
}

main();
