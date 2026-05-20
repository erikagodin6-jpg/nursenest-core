import fs from "node:fs";
import path from "node:path";

const localesDir = path.resolve(process.cwd(), "src/i18n");
const baseFile = path.join(localesDir, "en.json");

function loadJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function flattenKeys(obj: any, prefix = "", out: string[] = []) {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenKeys(value, fullKey, out);
    } else {
      out.push(fullKey);
    }
  }
  return out;
}

function getLocaleFiles() {
  return fs
    .readdirSync(localesDir)
    .filter((f) => f.endsWith(".json") && f !== "en.json");
}

const base = loadJson(baseFile);
const baseKeys = new Set(flattenKeys(base));

const results: Record<string, { missing: string[]; extra: string[] }> = {};

for (const file of getLocaleFiles()) {
  const locale = loadJson(path.join(localesDir, file));
  const keys = new Set(flattenKeys(locale));

  const missing = [...baseKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !baseKeys.has(k));

  results[file] = { missing, extra };
}

let hasErrors = false;

for (const [locale, data] of Object.entries(results)) {
  if (data.missing.length || data.extra.length) {
    hasErrors = true;
    console.log(`\n❌ ${locale}`);
    if (data.missing.length) {
      console.log("  Missing keys:");
      data.missing.forEach((k) => console.log(`   - ${k}`));
    }
    if (data.extra.length) {
      console.log("  Extra keys:");
      data.extra.forEach((k) => console.log(`   - ${k}`));
    }
  }
}

if (!hasErrors) {
  console.log("\n✅ All translations are fully synchronized.");
}

process.exit(hasErrors ? 1 : 0);
