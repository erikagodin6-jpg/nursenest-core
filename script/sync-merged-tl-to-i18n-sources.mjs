/**
 * Persist nursenest-core/public/i18n/tl.json into:
 * - tools/i18n/source/i18n-tl.ts (keys match i18n-en.ts)
 * - tools/i18n/marketing/locale/marketing-tl.json (all marketing-en keys)
 *
 * Usage: node script/sync-merged-tl-to-i18n-sources.mjs
 *
 * Warning: overwrites marketing-tl.json from merged tl. Re-apply hand-tuned keys after sync if needed.
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
const mergedTlPath = path.join(root, "nursenest-core/public/i18n/tl.json");
const mergedEnPath = path.join(root, "nursenest-core/public/i18n/en.json");
const marketingEnPath = path.join(root, "tools/i18n/marketing/marketing-en.json");
const outTsPath = path.join(root, "tools/i18n/source/i18n-tl.ts");
const outMarketingTlPath = path.join(root, "tools/i18n/marketing/locale/marketing-tl.json");

const enSource = readFileSync(enTsPath, "utf8");
const monolithKeys = extractKeysFromEnTs(enSource);
const tl = JSON.parse(readFileSync(mergedTlPath, "utf8"));
const en = JSON.parse(readFileSync(mergedEnPath, "utf8"));
const marketingEn = JSON.parse(readFileSync(marketingEnPath, "utf8"));

const lines = ['const tlTranslations: Record<string, string> = {'];
for (const k of monolithKeys) {
  const v = tl[k] ?? en[k] ?? "";
  lines.push(`  ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
}
lines.push("};", "", "export default tlTranslations;", "");
writeFileSync(outTsPath, lines.join("\n"));

const marketingTl = {};
for (const k of Object.keys(marketingEn).sort()) {
  marketingTl[k] = tl[k] !== undefined ? tl[k] : marketingEn[k];
}

writeFileSync(outMarketingTlPath, JSON.stringify(marketingTl, null, 2) + "\n");

console.log(`Wrote ${outTsPath} (${monolithKeys.length} keys)`);
console.log(`Wrote ${outMarketingTlPath} (${Object.keys(marketingTl).length} keys)`);
