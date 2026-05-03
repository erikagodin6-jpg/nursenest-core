#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n", "en");
const ALLOW_ENGLISH_WRITE = process.argv.includes("--allow-english-write");

const CRITICAL_FILES = [
  "nursenest-core/public/i18n/en/nav.json",
  "nursenest-core/public/i18n/en/pages.json",
  "nursenest-core/public/i18n/en/marketing.json",
  "nursenest-core/public/i18n/en/learner.json",
  "nursenest-core/public/i18n/en/billing.json",
  "nursenest-core/public/i18n/en/auth.json",
];

const CRITICAL_KEYS = [
  "pages.home.hero.headline",
  "pages.home.hero.subheading",
  "pages.home.metaTitleCA",
  "pages.home.metaDescriptionCA",
  "pages.pricing.title",
  "pages.pricing.hero.subheadMain",
  "nav.home",
  "nav.pricing",
  "nav.lessons",
  "nav.login",
  "footer.brandTagline",
];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function loadMergedEnglish() {
  const out = {};
  for (const name of fs.readdirSync(I18N_ROOT).filter((f) => f.endsWith(".json"))) {
    Object.assign(out, readJson(path.join(I18N_ROOT, name)));
  }
  return out;
}

function gitShow(rel) {
  try {
    return execFileSync("git", ["show", `HEAD:${rel}`], { cwd: REPO_ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hasFrenchLeak(value) {
  return /\b(le|la|les|des|avec|votre|vous|apprendre|tarifs|connexion|soins|infirmier|infirmière|abonnement)\b/i.test(String(value));
}

function malformed(value) {
  const s = String(value ?? "").trim();
  return !s || /\b(?:pages|nav|footer|brand|components|common|billing|learner|auth)\.[a-z0-9_.-]+/i.test(s) || /\[missing[:\]]|\{\{missing|TODO\b|TBD\b|lorem ipsum|content unavailable right now/i.test(s);
}

fs.mkdirSync(REPORT_DIR, { recursive: true });
const en = loadMergedEnglish();
const missingKeys = CRITICAL_KEYS.filter((key) => malformed(en[key]));
const frenchLeaks = Object.entries(en)
  .filter(([, value]) => typeof value === "string" && hasFrenchLeak(value))
  .slice(0, 80)
  .map(([key, value]) => `${key}: ${String(value).slice(0, 120)}`);
const malformedTitles = Object.entries(en)
  .filter(([key, value]) => /title|headline|hero|header|meta|seo/i.test(key) && malformed(value))
  .slice(0, 80)
  .map(([key]) => key);

const changedCriticalEnglishCopy = [];
for (const rel of CRITICAL_FILES) {
  const before = gitShow(rel);
  const currentPath = path.join(REPO_ROOT, rel);
  if (!before || !fs.existsSync(currentPath)) continue;
  const after = fs.readFileSync(currentPath, "utf8");
  if (hash(before) !== hash(after)) changedCriticalEnglishCopy.push(rel);
}

const results = [{
  route: "/",
  locale: "en",
  surfaceType: "english-canonical",
  englishOnly: frenchLeaks.length === 0,
  missingKeys,
  frenchLeakSuspicions: frenchLeaks,
  malformedTitles,
  brokenHeaders: missingKeys.filter((key) => /nav|header|hero/i.test(key)),
  emptyHeroText: CRITICAL_KEYS.filter((key) => /hero/i.test(key) && malformed(en[key])),
  changedCriticalEnglishCopy: ALLOW_ENGLISH_WRITE ? [] : changedCriticalEnglishCopy,
  seoIssues: CRITICAL_KEYS.filter((key) => /meta|seo/i.test(key) && malformed(en[key])),
  jsonLdIssues: [],
}];

const report = {
  generatedAt: new Date().toISOString(),
  allowEnglishWrite: ALLOW_ENGLISH_WRITE,
  results,
  summary: {
    missingKeys: missingKeys.length,
    frenchLeaks: frenchLeaks.length,
    malformedTitles: malformedTitles.length,
    changedCriticalEnglishCopy: ALLOW_ENGLISH_WRITE ? 0 : changedCriticalEnglishCopy.length,
  },
};

const md = [
  "# English I18n Regression Audit",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  `English status: ${report.summary.missingKeys + report.summary.frenchLeaks + report.summary.malformedTitles + report.summary.changedCriticalEnglishCopy === 0 ? "pass" : "blocked"}`,
  "",
  `- Missing critical keys: ${report.summary.missingKeys}`,
  `- French leak suspicions: ${report.summary.frenchLeaks}`,
  `- Malformed titles/headers/hero/SEO fields: ${report.summary.malformedTitles}`,
  `- Changed critical English files: ${report.summary.changedCriticalEnglishCopy}`,
  "",
  "## Findings",
  "",
  ...[...missingKeys, ...frenchLeaks, ...malformedTitles, ...changedCriticalEnglishCopy].slice(0, 80).map((x) => `- ${x}`),
  "",
].join("\n");

fs.writeFileSync(path.join(REPORT_DIR, "english-i18n-regression-audit.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(REPORT_DIR, "english-i18n-regression-audit.md"), md);

const failures = report.summary.missingKeys + report.summary.frenchLeaks + report.summary.malformedTitles + report.summary.changedCriticalEnglishCopy;
if (failures > 0) {
  console.error(`[i18n:en] English regression audit failed with ${failures} findings.`);
  process.exit(1);
}
console.log("[i18n:en] wrote reports/english-i18n-regression-audit.{json,md}; English canonical copy passed.");
