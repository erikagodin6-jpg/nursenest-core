import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { REPO_ROOT } from "./repo-root";

/** Must match `script/compile-i18n.ts` */
export const I18N_LANGUAGES = [
  "en", "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id",
] as const;

/** Placeholder *names* inside {{ }}, sorted uniquely — must match English merged strings per key. */
function placeholderNames(s: string): string[] {
  const re = /\{\{\s*([^}]+?)\s*\}\}/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    names.push(m[1].trim());
  }
  return [...new Set(names)].sort();
}

/** One row in `placeholder-fallbacks.json` when a locale string was replaced with English for placeholder safety. */
export type PlaceholderFallbackEvent = {
  locale: string;
  key: string;
  localizedValue: string;
  englishValue: string;
  placeholdersInEnglish: string[];
  placeholdersInLocalized: string[];
};

/** Predictable path for the JSON audit trail (REPO_ROOT-anchored). */
export const PLACEHOLDER_FALLBACK_REPORT_PATH = path.join(REPO_ROOT, "tools/i18n/reports/placeholder-fallbacks.json");

/** If locale value has different {{}} names than English, use English (structural parity; no new keys). */
function enforcePlaceholderParityToEnglish(
  locale: string,
  enRef: Record<string, string>,
  loc: Record<string, string>,
): { merged: Record<string, string>; fallbacks: PlaceholderFallbackEvent[] } {
  const out: Record<string, string> = { ...loc };
  const fallbacks: PlaceholderFallbackEvent[] = [];
  for (const k of Object.keys(out)) {
    const enVal = enRef[k];
    if (enVal === undefined) continue;
    const localizedVal = out[k] ?? "";
    const pEn = placeholderNames(enVal);
    const pLoc = placeholderNames(localizedVal);
    if (JSON.stringify(pEn) !== JSON.stringify(pLoc)) {
      fallbacks.push({
        locale,
        key: k,
        localizedValue: localizedVal,
        englishValue: enVal,
        placeholdersInEnglish: pEn,
        placeholdersInLocalized: pLoc,
      });
      out[k] = enVal;
    }
  }
  return { merged: out, fallbacks };
}

/**
 * After monolith JSON is written to `client/public/i18n/{lang}.json`, merge in
 * canonical marketing strings from `tools/i18n/marketing/` (English base +
 * per-locale overlays). This is the single marketing copy location; do not
 * maintain a parallel tree under nursenest-core/src/content.
 *
 * Writes canonical merged files to:
 * - `client/public/i18n/{lang}.json`
 * - `nursenest-core/public/i18n/{lang}.json` (Next.js static `/i18n/{lang}.json`)
 */
export function mergeMarketingIntoI18n(): void {
  const root = REPO_ROOT;
  const marketingEnPath = path.join(root, "tools/i18n/marketing/marketing-en.json");
  if (!existsSync(marketingEnPath)) {
    throw new Error(`[i18n] merge: missing ${marketingEnPath}`);
  }
  const marketingEn = JSON.parse(readFileSync(marketingEnPath, "utf8")) as Record<string, string>;
  const localeDir = path.join(root, "tools/i18n/marketing/locale");
  const clientOut = path.join(root, "client/public/i18n");
  const nextOut = path.join(root, "nursenest-core/public/i18n");
  mkdirSync(nextOut, { recursive: true });

  const mergedByLang: Record<string, Record<string, string>> = {};

  for (const lang of I18N_LANGUAGES) {
    const monolithPath = path.join(clientOut, `${lang}.json`);
    if (!existsSync(monolithPath)) {
      throw new Error(`[i18n] merge: missing compiled file ${monolithPath}`);
    }
    const monolith = JSON.parse(readFileSync(monolithPath, "utf8")) as Record<string, string>;
    let overlay: Record<string, string> = {};
    if (lang !== "en") {
      const overlayPath = path.join(localeDir, `marketing-${lang}.json`);
      if (existsSync(overlayPath)) {
        overlay = JSON.parse(readFileSync(overlayPath, "utf8")) as Record<string, string>;
      }
    }
    mergedByLang[lang] = { ...monolith, ...marketingEn, ...overlay };
  }

  const enMerged = mergedByLang["en"];
  if (!enMerged) {
    throw new Error(`[i18n] merge: missing built merge for en`);
  }

  const allFallbacks: PlaceholderFallbackEvent[] = [];

  for (const lang of I18N_LANGUAGES) {
    let merged = mergedByLang[lang];
    if (lang !== "en") {
      const { merged: fixed, fallbacks } = enforcePlaceholderParityToEnglish(lang, enMerged, merged);
      merged = fixed;
      allFallbacks.push(...fallbacks);
    }
    const json = JSON.stringify(merged);
    if (json.length < 100) {
      throw new Error(`[i18n] merge: suspiciously small output for ${lang}`);
    }
    const buf = Buffer.from(json, "utf8");
    const clientPath = path.join(clientOut, `${lang}.json`);
    const nextPath = path.join(nextOut, `${lang}.json`);
    writeFileSync(clientPath, buf);
    writeFileSync(nextPath, buf);
    const rClient = readFileSync(clientPath);
    const rNext = readFileSync(nextPath);
    if (!rClient.equals(rNext)) {
      throw new Error(`[i18n] merge: client/next drift for ${lang}.json (bytes differ)`);
    }
  }

  const reportsDir = path.join(root, "tools/i18n/reports");
  mkdirSync(reportsDir, { recursive: true });
  const byLocale: Record<string, number> = {};
  for (const ev of allFallbacks) {
    byLocale[ev.locale] = (byLocale[ev.locale] ?? 0) + 1;
  }
  const reportPayload = {
    generatedAt: new Date().toISOString(),
    totalFallbacks: allFallbacks.length,
    byLocale,
    events: allFallbacks,
  };
  writeFileSync(PLACEHOLDER_FALLBACK_REPORT_PATH, JSON.stringify(reportPayload, null, 2) + "\n", "utf8");

  const relReport = path.relative(root, PLACEHOLDER_FALLBACK_REPORT_PATH);
  if (allFallbacks.length === 0) {
    console.log(`[i18n] placeholder fallbacks: 0 (report: ${relReport})`);
  } else {
    const locales = Object.keys(byLocale).sort().join(", ");
    console.log(
      `[i18n] placeholder fallbacks: ${allFallbacks.length} in ${Object.keys(byLocale).length} locale(s) [${locales}] — see ${relReport}`,
    );
  }
}
