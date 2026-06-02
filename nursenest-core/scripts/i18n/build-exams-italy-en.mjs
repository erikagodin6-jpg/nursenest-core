#!/usr/bin/env node
/**
 * Validates `exams-italy.en.json` (source of truth for Italy hub copy).
 * Edit that JSON directly; run `npm run i18n:merge-exams-italy` after changes.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const p = join(__dirname, "exams-italy.en.json");
const obj = JSON.parse(readFileSync(p, "utf8"));
const n = Object.keys(obj).length;
console.log(`exams-italy.en.json OK — ${n} keys`);
if (n < 100) {
  console.error("unexpected key count");
  process.exit(1);
}
