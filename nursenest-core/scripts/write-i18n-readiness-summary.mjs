#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPORT_DIR = path.join(APP_ROOT, "reports");

function readJson(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(REPORT_DIR, name), "utf8"));
  } catch {
    return null;
  }
}

const en = readJson("english-i18n-regression-audit.json");
const fr = readJson("french-completeness-audit.json");
const es = readJson("spanish-completeness-audit.json");
const frResults = fr?.results ?? [];
const esResults = es?.surfaces ?? [];
const rex = frResults.filter((r) => /rex-pn|canada\/pn/.test(r.route));
const missingFrenchKeys = frResults.flatMap((r) => (r.missingKeys ?? []).map((key) => `${r.route}: ${key}`)).slice(0, 50);
const missingSpanishKeys = (es?.missingKeys ?? []).slice(0, 50);
const blocked = frResults.filter((r) => r.shouldNoindex);
const blockedEs = esResults.filter((r) => r.shouldNoindex);

const md = [
  "# I18n Readiness Summary",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `English status: ${en ? (en.summary.missingKeys + en.summary.frenchLeaks + en.summary.malformedTitles + en.summary.changedCriticalEnglishCopy === 0 ? "pass" : "blocked") : "not run"}`,
  `French status: ${fr ? (blocked.length === 0 ? "complete for audited indexable surfaces" : `${blocked.length} surfaces blocked from indexing`) : "not run"}`,
  `Spanish status: ${es ? (es.summary.missingKeys + es.summary.extraKeys + es.summary.placeholders + es.summary.englishLeakSuspicions === 0 ? "pass" : "blocked") : "not run"}`,
  `REx-PN French status: ${rex.length > 0 && rex.every((r) => !r.shouldNoindex) ? "indexable" : "noindex until translations pass"}`,
  `Spanish coverage: ${es ? `${es.coveragePct}% (${es.totalSpanishKeys}/${es.totalEnglishKeys})` : "not run"}`,
  "",
  "## Missing French Keys",
  "",
  ...(missingFrenchKeys.length ? missingFrenchKeys.map((x) => `- ${x}`) : ["- None in audited required key set."]),
  "",
  "## Missing Spanish Keys",
  "",
  ...(missingSpanishKeys.length ? missingSpanishKeys.map((x) => `- ${x}`) : ["- None."]),
  "",
  "## English Regression Findings",
  "",
  en ? `- Missing keys: ${en.summary.missingKeys}\n- French leaks: ${en.summary.frenchLeaks}\n- Malformed title/header/SEO fields: ${en.summary.malformedTitles}\n- Changed critical English files: ${en.summary.changedCriticalEnglishCopy}` : "- English audit has not run.",
  "",
  "## Indexability Decisions",
  "",
  ...(frResults.length ? frResults.map((r) => `- ${r.route}: ${r.indexable ? "indexable" : "noindex"} (${r.recommendedFix})`) : ["- French audit has not run."]),
  ...(esResults.length ? esResults.map((r) => `- ${r.route}: ${r.indexable ? "indexable" : "noindex"} (${r.recommendedFix})`) : ["- Spanish audit has not run."]),
  "",
  "## Next Required Translations",
  "",
  ...(blocked.length || blockedEs.length
    ? [...blocked, ...blockedEs].slice(0, 20).map((r) => `- ${r.route}: ${r.surfaceType}`)
    : ["- None from current static audit."]),
  "",
].join("\n");

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, "i18n-readiness-summary.md"), md);
console.log("[i18n:summary] wrote reports/i18n-readiness-summary.md");
