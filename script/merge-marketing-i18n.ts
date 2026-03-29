import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

/** Must match `script/compile-i18n.ts` */
export const I18N_LANGUAGES = [
  "en", "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id",
] as const;

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
  const root = path.resolve(process.cwd());
  const marketingEnPath = path.join(root, "tools/i18n/marketing/marketing-en.json");
  if (!existsSync(marketingEnPath)) {
    throw new Error(`[i18n] merge: missing ${marketingEnPath}`);
  }
  const marketingEn = JSON.parse(readFileSync(marketingEnPath, "utf8")) as Record<string, string>;
  const localeDir = path.join(root, "tools/i18n/marketing/locale");
  const clientOut = path.join(root, "client/public/i18n");
  const nextOut = path.join(root, "nursenest-core/public/i18n");
  mkdirSync(nextOut, { recursive: true });

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
    const merged = { ...monolith, ...marketingEn, ...overlay };
    const json = JSON.stringify(merged);
    if (json.length < 100) {
      throw new Error(`[i18n] merge: suspiciously small output for ${lang}`);
    }
    writeFileSync(path.join(clientOut, `${lang}.json`), json);
    writeFileSync(path.join(nextOut, `${lang}.json`), json);
  }
}
