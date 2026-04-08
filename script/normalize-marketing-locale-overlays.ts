/**
 * Single source of truth: `tools/i18n/marketing/marketing-en.json`
 *
 * For each `tools/i18n/marketing/locale/marketing-{lang}.json`:
 * - Output contains exactly the same keys as marketing-en (sorted).
 * - Missing keys → English value (fallback; does not overwrite existing translation).
 * - Keys not present in English → removed (orphans).
 *
 * English locale has no overlay file; `marketing-en.json` lives at repo root under marketing/.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import path from "path";
import { REPO_ROOT } from "./repo-root";

const ROOT = REPO_ROOT;
const MARKETING_EN = path.join(ROOT, "tools/i18n/marketing/marketing-en.json");
const LOCALE_DIR = path.join(ROOT, "tools/i18n/marketing/locale");

export function normalizeMarketingLocaleOverlays(): { files: number; keys: number } {
  if (!existsSync(MARKETING_EN)) {
    throw new Error(`[i18n] normalize: missing ${MARKETING_EN}`);
  }
  mkdirSync(LOCALE_DIR, { recursive: true });
  const marketingEn = JSON.parse(readFileSync(MARKETING_EN, "utf8")) as Record<string, string>;
  const canonicalKeys = Object.keys(marketingEn).sort();
  const canonicalSet = new Set(canonicalKeys);

  const files = readdirSync(LOCALE_DIR).filter((f) => /^marketing-[a-z]{2}(-[a-z]{2})?\.json$/i.test(f));
  let count = 0;
  for (const f of files) {
    if (f === "marketing-en.json") continue;
    const fp = path.join(LOCALE_DIR, f);
    let overlay: Record<string, string> = {};
    if (existsSync(fp)) {
      try {
        overlay = JSON.parse(readFileSync(fp, "utf8")) as Record<string, string>;
      } catch {
        overlay = {};
      }
    }
    const orphans = Object.keys(overlay).filter((k) => !canonicalSet.has(k));
    const out: Record<string, string> = {};
    for (const k of canonicalKeys) {
      const v = overlay[k];
      out[k] = v !== undefined && v !== null ? String(v) : marketingEn[k];
    }
    writeFileSync(fp, JSON.stringify(out, null, 2) + "\n");
    if (orphans.length > 0) {
      console.warn(`[i18n] normalize: removed ${orphans.length} orphan key(s) from ${f}`);
    }
    count++;
  }
  return { files: count, keys: canonicalKeys.length };
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("normalize-marketing-locale-overlays.ts")) {
  const r = normalizeMarketingLocaleOverlays();
  console.log(`[i18n] normalize: ${r.files} locale file(s), ${r.keys} keys each (canonical)`);
}
