/**
 * One-shot merge: hero / exam-card / home.quickEntry keys into public/i18n/en.json.
 * Run: node scripts/patch-home-hero-i18n-en.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_PATH = path.join(__dirname, "..", "public", "i18n", "en.json");

const PATCH = {
  // Header / country-exam-offerings (were referenced but missing from en.json)
  "home.quickEntry.rnQuestions": "NCLEX-RN questions",
  "home.quickEntry.pnQuestionsUS": "NCLEX-PN (LPN) questions",
  "home.quickEntry.pnQuestionsCA": "REx-PN (RPN) questions",
  "home.quickEntry.npQuestionsUS": "NP practice questions (US)",
  "home.quickEntry.npQuestionsCA": "CNPLE / NP questions",
  "home.quickEntry.alliedUS": "Allied health questions (US)",
  "home.quickEntry.alliedCA": "Allied health questions (Canada)",

  // Compact hero tier pills (country-aware PN)
  "home.conversion.heroTierIntro": "Choose your track, then open your exam hub.",
  "home.conversion.heroTierNavAria": "Nursing and allied exam pathways",
  "home.conversion.tierPill.rn": "RN",
  "home.conversion.tierPill.pnUS": "LPN · NCLEX-PN",
  "home.conversion.tierPill.pnCA": "RPN · REx-PN",
  "home.conversion.tierPill.np": "NP",
  "home.conversion.tierPill.allied": "Allied",
  "home.conversion.tierPill.preNursing": "Pre-nursing",

  // Exam card chips (replaces hardcoded meta strings)
  "home.conversion.examCard.metaRn": "NCLEX-RN",
  "home.conversion.examCard.metaPnUS": "NCLEX-PN (LPN)",
  "home.conversion.examCard.metaPnCA": "REx-PN (RPN)",
  "home.conversion.examCard.metaNpUS": "FNP · PMHNP · AGPCNP",
  "home.conversion.examCard.metaNpCA": "CNPLE",
  "home.conversion.examCard.metaAllied": "Allied health",
  "home.conversion.examCard.metaPreNursing": "Pre-nursing",

  // Was referenced by HomeExamSelectionSection but missing
  "home.conversion.examCard.newGradTitle": "Foundations before nursing school",
  "home.conversion.examCard.newGradDesc":
    "Science refreshers, TEAS-style practice, and study skills so you start strong.",
  "home.conversion.examCard.ctaNewGrad": "Explore pre-nursing",
};

const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
let changed = false;
for (const [k, v] of Object.entries(PATCH)) {
  if (en[k] === undefined || en[k] === null || String(en[k]).trim() === "") {
    en[k] = v;
    changed = true;
  }
}
if (changed) {
  fs.writeFileSync(EN_PATH, JSON.stringify(en));
  console.log("Updated en.json with hero / quickEntry keys.");
} else {
  console.log("No changes (keys already present).");
}
