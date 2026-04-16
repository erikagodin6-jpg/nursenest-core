#!/usr/bin/env npx tsx
/**
 * Fast consistency check: merged `client/public/i18n/en.json` must equal
 * monolith (`tools/i18n/source/i18n-en.ts`) overlaid with `tools/i18n/marketing/marketing-en.json`,
 * matching `mergeMarketingIntoI18n` (marketing wins on key collisions).
 *
 * Run after editing marketing or monolith sources; use `npm run i18n:compile` to regenerate bundles.
 */
import { existsSync, readFileSync } from "fs";
import path from "path";
import { REPO_ROOT } from "./repo-root";

const ROOT = REPO_ROOT;
const I18N_EN_TS = path.join(ROOT, "tools/i18n/source/i18n-en.ts");
const MARKETING_EN = path.join(ROOT, "tools/i18n/marketing/marketing-en.json");
const MERGED_EN = path.join(ROOT, "client/public/i18n/en.json");

function extractTranslationsFromSource(filePath: string): Record<string, string> | null {
  if (!existsSync(filePath)) return null;
  const source = readFileSync(filePath, "utf-8");
  const objectRegex =
    /(?:const\s+\w+\s*(?::\s*Record<string,\s*string>)?\s*=\s*|export\s+default\s+)\{([\s\S]*)\}\s*(?:as\s+const)?\s*;?\s*(?:export\s+default\s+\w+;?\s*)?$/;
  const match = source.match(objectRegex);
  if (!match) return null;
  const body = match[1];
  const result: Record<string, string> = {};
  const entryRegex = /["']([^"']+)["']\s*:\s*["'`]((?:[^"'`\\]|\\.)*)["'`]/g;
  let m: RegExpExecArray | null;
  while ((m = entryRegex.exec(body)) !== null) {
    result[m[1]] = m[2].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  }
  return result;
}

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

function main(): void {
  const monolith = extractTranslationsFromSource(I18N_EN_TS);
  const marketing = loadJson(MARKETING_EN);
  const merged = loadJson(MERGED_EN);

  if (!monolith || Object.keys(monolith).length < 10) {
    console.error(`[i18n:check-sync] FAIL: could not read monolith ${path.relative(ROOT, I18N_EN_TS)}`);
    process.exit(1);
  }
  if (!marketing) {
    console.error(`[i18n:check-sync] FAIL: missing or invalid ${path.relative(ROOT, MARKETING_EN)}`);
    process.exit(1);
  }
  if (!merged) {
    console.error(`[i18n:check-sync] FAIL: missing ${path.relative(ROOT, MERGED_EN)} — run npm run i18n:compile`);
    process.exit(1);
  }

  const expected: Record<string, string> = { ...monolith, ...marketing };
  const expKeys = new Set(Object.keys(expected));
  const diskKeys = new Set(Object.keys(merged));

  const extraOnDisk = [...diskKeys].filter((k) => !expKeys.has(k));
  const missingOnDisk = [...expKeys].filter((k) => !diskKeys.has(k));

  if (extraOnDisk.length || missingOnDisk.length) {
    console.error(
      `[i18n:check-sync] FAIL: key set mismatch vs monolith + marketing-en (disk ${diskKeys.size} keys, expected ${expKeys.size})`,
    );
    if (extraOnDisk.length) console.error(`  extra on disk (sample): ${extraOnDisk.slice(0, 12).join(", ")}`);
    if (missingOnDisk.length) console.error(`  missing on disk (sample): ${missingOnDisk.slice(0, 12).join(", ")}`);
    console.error(`  Run: npm run i18n:compile`);
    process.exit(1);
  }

  const mismatches: string[] = [];
  for (const k of expKeys) {
    if (expected[k] !== merged[k]) mismatches.push(k);
  }
  if (mismatches.length) {
    console.error(`[i18n:check-sync] FAIL: ${mismatches.length} value(s) differ from monolith+marketing (sample):`);
    for (const k of mismatches.slice(0, 15)) {
      console.error(`  ${k}`);
    }
    console.error(`  Run: npm run i18n:compile`);
    process.exit(1);
  }

  console.log(
    `[i18n:check-sync] OK — en.json matches i18n-en.ts + marketing-en.json (${expKeys.size} keys)`,
  );
}

main();
