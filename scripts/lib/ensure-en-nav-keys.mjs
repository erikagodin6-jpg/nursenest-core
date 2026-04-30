/**
 * Idempotent: merge required marketing `nav.*` strings into English nav i18n if absent.
 * Supports legacy `public/i18n/en.json` or shard layout `public/i18n/en/nav.json`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadLocaleFlatMarketingMap, resolveMarketingI18nAppRoot } from "./i18n-app-root.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..");

export const REQUIRED_EN_NAV_STRINGS = {
  "nav.getStarted": "Get Started",
  "nav.pathwayHubsAria": "Pathway hub navigation",
  "nav.chooseYourExam": "Choose your exam",
  "nav.topicAdaptiveTests": "Adaptive topic tests",
  "nav.studyPlanShort": "Study plan",
  "nav.articlesAndTips": "Articles & tips",
  "nav.caseStudiesShort": "Case studies",
};

function writeJsonStable(p, obj) {
  fs.writeFileSync(p, `${JSON.stringify(obj, null, 2)}\n`, "utf8");
}

export function ensureRequiredEnNavKeys() {
  const appRoot = resolveMarketingI18nAppRoot(REPO_ROOT);
  const flatPath = path.join(appRoot, "public", "i18n", "en.json");
  const navShardPath = path.join(appRoot, "public", "i18n", "en", "nav.json");

  if (fs.existsSync(navShardPath)) {
    const nav = JSON.parse(fs.readFileSync(navShardPath, "utf8"));
    let changed = false;
    for (const [k, v] of Object.entries(REQUIRED_EN_NAV_STRINGS)) {
      if (nav[k] === undefined || nav[k] === null) {
        nav[k] = v;
        changed = true;
      }
    }
    if (changed) writeJsonStable(navShardPath, nav);
    return;
  }

  if (!fs.existsSync(flatPath)) {
    return;
  }

  const en = JSON.parse(fs.readFileSync(flatPath, "utf8"));
  let changed = false;
  for (const [k, v] of Object.entries(REQUIRED_EN_NAV_STRINGS)) {
    if (en[k] === undefined || en[k] === null) {
      en[k] = v;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(flatPath, JSON.stringify(en));
  }
}
