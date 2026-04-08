#!/usr/bin/env node
/**
 * Copy region-aware nursing tier / metadata strings from en.json into every other
 * `public/i18n/*.json` locale bundle so marketing no longer depends on runtime fallback for these keys.
 *
 * Exam names (NCLEX-RN, NCLEX-PN, REx-PN) stay in English per product rules; surrounding copy is
 * English from en until human-translated.
 *
 * Usage (from nursenest-core/): `node scripts/sync-nursing-tier-parity-all-locales.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const I18N_DIR = path.join(ROOT, "public", "i18n");
const EN_PATH = path.join(I18N_DIR, "en.json");

/** @param {string} x */
function isNursingTierParityKey(x) {
  if (x.startsWith("nav.examStrip.")) return true;
  if (x.startsWith("home.quickEntry.")) return true;
  if (/^home\.landing\.(heroPath|pathways)\./.test(x)) return true;
  if (x.startsWith("home.region.")) return true;
  if (/^pages\.home\.meta/.test(x)) return true;
  if (/^pages\.publicLessons\.meta/.test(x)) return true;
  if (/^pages\.publicQuestionBank\.(meta|cardPn)/.test(x)) return true;
  if (/^pages\.publicPracticeExams\.meta/.test(x)) return true;
  if (/^pages\.publicFlashcardsHub\.meta/.test(x)) return true;
  if (x.startsWith("components.footer.pnExamPrep")) return true;
  if (/^pages\.pricing\.examCard\.(rn|pn)/.test(x)) return true;
  if (/^pages\.signup\.examFocus\.(nclexRn|nclexPn|rexPn)/.test(x)) return true;
  if (x === "home.landing.faq.a1" || x === "home.landing.why.why1Body" || x === "home.conversion.why1Body")
    return true;
  return false;
}

const enRaw = fs.readFileSync(EN_PATH, "utf8");
const en = JSON.parse(enRaw);
const parityKeys = Object.keys(en).filter(isNursingTierParityKey).sort();

let filesUpdated = 0;
let totalWrites = 0;

for (const name of fs.readdirSync(I18N_DIR)) {
  if (!name.endsWith(".json") || name === "en.json") continue;
  const fp = path.join(I18N_DIR, name);
  const loc = JSON.parse(fs.readFileSync(fp, "utf8"));
  let n = 0;
  for (const k of parityKeys) {
    const v = en[k];
    if (v === undefined) continue;
    if (loc[k] !== v) {
      loc[k] = v;
      n++;
    }
  }
  if (n > 0) {
    fs.writeFileSync(fp, JSON.stringify(loc));
    console.log(`${name}: +${n} nursing-tier parity keys synced from en`);
    filesUpdated++;
    totalWrites += n;
  }
}

console.log(`\nDone: ${filesUpdated} locale files updated, ${totalWrites} key assignments (parity key count in en: ${parityKeys.length}).`);
