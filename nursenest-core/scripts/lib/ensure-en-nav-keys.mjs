/**
 * Idempotent: merge required marketing `nav.*` strings into `public/i18n/en.json` if absent.
 * Keeps header + learner shell labels audited even when the canonical JSON is regenerated.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const EN_PATH = path.join(ROOT, "public", "i18n", "en.json");

export const REQUIRED_EN_NAV_STRINGS = {
  "nav.getStarted": "Get Started",
  "nav.chooseYourExam": "Choose your exam",
  "nav.topicAdaptiveTests": "Adaptive topic tests",
  "nav.studyPlanShort": "Study plan",
  "nav.articlesAndTips": "Articles & tips",
  "nav.caseStudiesShort": "Case studies",
};

export function ensureRequiredEnNavKeys() {
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  let changed = false;
  for (const [k, v] of Object.entries(REQUIRED_EN_NAV_STRINGS)) {
    if (en[k] === undefined || en[k] === null) {
      en[k] = v;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(EN_PATH, JSON.stringify(en));
  }
}
