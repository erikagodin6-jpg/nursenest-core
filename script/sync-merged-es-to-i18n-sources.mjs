/**
 * Persist nursenest-core/public/i18n/es.json into source files so `npm run i18n:compile` keeps Spanish:
 * - tools/i18n/source/i18n-es.ts (keys must match i18n-en.ts)
 * - tools/i18n/marketing/locale/marketing-es.json (all marketing-en keys → values from merged es.json)
 *
 * Usage: node script/sync-merged-es-to-i18n-sources.mjs
 *
 * Warning: overwrites tools/i18n/marketing/locale/marketing-es.json from merged es.
 * Re-apply hand-tuned keys in marketing-es.json (or extend this script) after sync if needed.
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

function tsStringLiteral(value) {
  return JSON.stringify(value);
}

const enTsPath = path.join(root, "tools/i18n/source/i18n-en.ts");
const mergedEsPath = path.join(root, "nursenest-core/public/i18n/es.json");
const mergedEnPath = path.join(root, "nursenest-core/public/i18n/en.json");
const marketingEnPath = path.join(root, "tools/i18n/marketing/marketing-en.json");
const outTsPath = path.join(root, "tools/i18n/source/i18n-es.ts");
const outMarketingEsPath = path.join(root, "tools/i18n/marketing/locale/marketing-es.json");

const enSource = readFileSync(enTsPath, "utf8");
const monolithKeys = extractKeysFromEnTs(enSource);
const es = JSON.parse(readFileSync(mergedEsPath, "utf8"));
const en = JSON.parse(readFileSync(mergedEnPath, "utf8"));
const marketingEn = JSON.parse(readFileSync(marketingEnPath, "utf8"));

const lines = ['const esTranslations: Record<string, string> = {'];
for (const k of monolithKeys) {
  const v = es[k] ?? en[k] ?? "";
  lines.push(`  ${tsStringLiteral(k)}: ${tsStringLiteral(v)},`);
}
lines.push("};", "", "export default esTranslations;", "");
writeFileSync(outTsPath, lines.join("\n"));

const marketingEs = {};
for (const k of Object.keys(marketingEn).sort()) {
  marketingEs[k] = es[k] !== undefined ? es[k] : marketingEn[k];
}

writeFileSync(outMarketingEsPath, JSON.stringify(marketingEs, null, 2) + "\n");

console.log(`Wrote ${outTsPath} (${monolithKeys.length} keys)`);
console.log(`Wrote ${outMarketingEsPath} (${Object.keys(marketingEs).length} keys)`);
