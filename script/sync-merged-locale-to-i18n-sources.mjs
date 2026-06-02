/**
 * Persist nursenest-core/public/i18n/{LOCALE}.json into tools/i18n/source/i18n-{LOCALE}.ts + marketing-{LOCALE}.json.
 *
 * Usage: LOCALE=hi node script/sync-merged-locale-to-i18n-sources.mjs
 * Warning: overwrites marketing locale JSON from merged bundle — re-apply hand edits after if needed.
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const LOCALE = (process.env.LOCALE || "").toLowerCase();
if (!/^[a-z]{2}(-[a-z]{2})?$/.test(LOCALE)) {
  console.error("Set LOCALE=hi (or zh-tw, etc.)");
  process.exit(1);
}

function localeToExportName(locale) {
  const parts = locale.split("-");
  const camel =
    parts[0] +
    parts
      .slice(1)
      .map((p) => (p.length ? p.charAt(0).toUpperCase() + p.slice(1) : ""))
      .join("");
  return `${camel}Translations`;
}

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

const exportName = localeToExportName(LOCALE);
const enTsPath = path.join(root, "tools/i18n/source/i18n-en.ts");
const mergedLocalePath = path.join(root, `nursenest-core/public/i18n/${LOCALE}.json`);
const mergedEnPath = path.join(root, "nursenest-core/public/i18n/en.json");
const marketingEnPath = path.join(root, "tools/i18n/marketing/marketing-en.json");
const outTsPath = path.join(root, `tools/i18n/source/i18n-${LOCALE}.ts`);
const outMarketingPath = path.join(root, `tools/i18n/marketing/locale/marketing-${LOCALE}.json`);

const enSource = readFileSync(enTsPath, "utf8");
const monolithKeys = extractKeysFromEnTs(enSource);
const localeBundle = JSON.parse(readFileSync(mergedLocalePath, "utf8"));
const en = JSON.parse(readFileSync(mergedEnPath, "utf8"));
const marketingEn = JSON.parse(readFileSync(marketingEnPath, "utf8"));

const lines = [`const ${exportName}: Record<string, string> = {`];
for (const k of monolithKeys) {
  const v = localeBundle[k] ?? en[k] ?? "";
  lines.push(`  ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
}
lines.push("};", "", `export default ${exportName};`, "");
writeFileSync(outTsPath, lines.join("\n"));

const marketingLocale = {};
for (const k of Object.keys(marketingEn).sort()) {
  marketingLocale[k] = localeBundle[k] !== undefined ? localeBundle[k] : marketingEn[k];
}

writeFileSync(outMarketingPath, JSON.stringify(marketingLocale, null, 2) + "\n");

console.log(`Wrote ${outTsPath} (${monolithKeys.length} keys)`);
console.log(`Wrote ${outMarketingPath} (${Object.keys(marketingLocale).length} keys)`);
