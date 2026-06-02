/**
 * Restore ar.json key parity: for every key in en.json, ar[k] = ar[k] ?? en[k].
 * Writes nursenest-core/public/i18n/ar.json and client/public/i18n/ar.json.
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const enPath = path.join(root, "nursenest-core/public/i18n/en.json");
const arPath = path.join(root, "nursenest-core/public/i18n/ar.json");
const clientPath = path.join(root, "client/public/i18n/ar.json");

const en = JSON.parse(readFileSync(enPath, "utf8"));
let ar = {};
try {
  ar = JSON.parse(readFileSync(arPath, "utf8"));
} catch {
  ar = {};
}

const merged = { ...en };
for (const k of Object.keys(en)) {
  if (ar[k] !== undefined) merged[k] = ar[k];
}

const json = JSON.stringify(merged);
if (Object.keys(merged).length !== Object.keys(en).length) {
  throw new Error("key count mismatch after merge");
}
writeFileSync(arPath, json);
writeFileSync(clientPath, json);
console.log(`Merged ar.json: ${Object.keys(merged).length} keys (parity with en)`);
