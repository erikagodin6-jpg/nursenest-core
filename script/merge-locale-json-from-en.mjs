/**
 * Restore public i18n JSON parity with en: for every key in en.json, locale[k] = locale[k] ?? en[k].
 *
 * Usage: LOCALE=hi node script/merge-locale-json-from-en.mjs
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

const enPath = path.join(root, "nursenest-core/public/i18n/en.json");
const localePath = path.join(root, `nursenest-core/public/i18n/${LOCALE}.json`);
const clientPath = path.join(root, `client/public/i18n/${LOCALE}.json`);

const en = JSON.parse(readFileSync(enPath, "utf8"));
let partial = {};
try {
  partial = JSON.parse(readFileSync(localePath, "utf8"));
} catch {
  partial = {};
}

const merged = { ...en };
for (const k of Object.keys(en)) {
  if (partial[k] !== undefined) merged[k] = partial[k];
}

const json = JSON.stringify(merged);
if (Object.keys(merged).length !== Object.keys(en).length) {
  throw new Error("key count mismatch after merge");
}
writeFileSync(localePath, json);
writeFileSync(clientPath, json);
console.log(`Merged ${LOCALE}.json: ${Object.keys(merged).length} keys (parity with en)`);
