#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EN = join(__dirname, "exams-italy.en.json");
const IT = join(__dirname, "exams-italy.it.json");
const nEn = Object.keys(JSON.parse(readFileSync(EN, "utf8"))).length;
const nIt = Object.keys(JSON.parse(readFileSync(IT, "utf8"))).length;
if (nEn !== nIt) {
  console.error(`exams-italy key mismatch: en=${nEn} it=${nIt}`);
  process.exit(1);
}
console.log(`exams-italy.en.json / exams-italy.it.json keys ${nEn} (parity OK)`);
