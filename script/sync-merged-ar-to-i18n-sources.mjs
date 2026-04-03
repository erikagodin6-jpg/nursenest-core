/**
 * Persist nursenest-core/public/i18n/ar.json into i18n-ar.ts + marketing-ar.json.
 * Usage: node script/sync-merged-ar-to-i18n-sources.mjs
 * Warning: overwrites marketing-ar.json from merged ar — re-apply hand edits after if needed.
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function extractKeysFromEnTs(source) {
  const objectRegex =
    /(?:const\s+\w+\s*(?::\s*Record<string,\s*string>)?\s*=\s*|export\s+default\s+)\{([\s\S]*)\}\s*(?:as\s+const)?\s*;?\s*(?:export\s+default\s+\w+;?\s*)?$/;
  const match = source.match(objectRegex);
  if (!match) throw new Error("could not parse i18n-en.ts");
  const body = match[1];
  const keys = [];
  const entryRegex = /["']([^"']+)["']\s*:/g;
  let m;
  while ((m = entryRegex.exec(body)) !== null) keys.push(m[1]);
  return keys;
}

const enTsPath = path.join(root, "tools/i18n/source/i18n-en.ts");
const mergedArPath = path.join(root, "nursenest-core/public/i18n/ar.json");
const mergedEnPath = path.join(root, "nursenest-core/public/i18n/en.json");
const marketingEnPath = path.join(root, "tools/i18n/marketing/marketing-en.json");
const outTsPath = path.join(root, "tools/i18n/source/i18n-ar.ts");
const outMarketingArPath = path.join(root, "tools/i18n/marketing/locale/marketing-ar.json");

const enSource = readFileSync(enTsPath, "utf8");
const monolithKeys = extractKeysFromEnTs(enSource);
const ar = JSON.parse(readFileSync(mergedArPath, "utf8"));
const en = JSON.parse(readFileSync(mergedEnPath, "utf8"));
const marketingEn = JSON.parse(readFileSync(marketingEnPath, "utf8"));

const lines = ['const arTranslations: Record<string, string> = {'];
for (const k of monolithKeys) {
  const v = ar[k] ?? en[k] ?? "";
  lines.push(`  ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
}
lines.push("};", "", "export default arTranslations;", "");
writeFileSync(outTsPath, lines.join("\n"));

const marketingAr = {};
for (const k of Object.keys(marketingEn).sort()) {
  marketingAr[k] = ar[k] !== undefined ? ar[k] : marketingEn[k];
}

writeFileSync(outMarketingArPath, JSON.stringify(marketingAr, null, 2) + "\n");

console.log(`Wrote ${outTsPath} (${monolithKeys.length} keys)`);
console.log(`Wrote ${outMarketingArPath} (${Object.keys(marketingAr).length} keys)`);
