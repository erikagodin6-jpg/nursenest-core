#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const I18N_ROOT = path.join(APP_ROOT, "public", "i18n");
const LOCALE = "fr";
const MIN_INDEXABLE_SCORE = Number(process.env.I18N_FR_MIN_INDEXABLE_SCORE ?? "100");

const PROTECTED = new Set(["NurseNest", "REx-PN", "NCLEX", "CPNRE", "OSCE", "CAT", "RN", "RPN", "PN", "NP", "NGN", "NCSBN", "CASN"]);
const SHARDS = ["nav", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "pages", "allied"];

const SURFACES = [
  { route: "/fr", surfaceType: "homepage", shards: ["pages", "nav", "brand", "marketing"], prefixes: ["pages.home.", "nav.", "footer.", "brand."], indexable: true },
  { route: "/fr/pricing", surfaceType: "pricing", shards: ["pages", "billing", "nav", "common"], prefixes: ["pages.pricing.", "pricing.", "nav.", "footer."], indexable: true },
  { route: "/canada/pn/rex-pn", surfaceType: "exam-pathway-hub", shards: ["pages", "marketing", "nav"], prefixes: ["pages.exam", "pages.pathway", "nav.", "footer."], indexable: true },
  { route: "/canada/pn/rex-pn/lessons", surfaceType: "lesson-library", shards: ["pages", "learner", "nav"], prefixes: ["pages.lessons.", "lesson.", "lessons.", "nav.", "footer."], indexable: true },
  { route: "/canada/pn/rex-pn/lessons/sample", surfaceType: "lesson-detail", shards: ["pages", "learner", "nav"], prefixes: ["lesson.", "lessons.", "pages.lesson", "nav.", "footer."], indexable: true },
  { route: "/canada/pn/rex-pn/questions", surfaceType: "practice-questions", shards: ["pages", "learner", "nav"], prefixes: ["questions.", "practice.", "pages.questionBank.", "nav.", "footer."], indexable: true },
  { route: "/canada/pn/rex-pn/cat", surfaceType: "cat", shards: ["pages", "learner", "nav"], prefixes: ["cat.", "adaptive.", "practice.", "nav."], indexable: false },
  { route: "/fr/question-bank", surfaceType: "practice-questions", shards: ["pages", "learner", "nav"], prefixes: ["questions.", "practice.", "pages.questionBank.", "nav.", "footer."], indexable: true },
  { route: "/fr/practice-exams", surfaceType: "practice-questions", shards: ["pages", "learner", "nav"], prefixes: ["practice.", "pages.practice", "nav.", "footer."], indexable: true },
  { route: "/app", surfaceType: "learner-dashboard", shards: ["learner", "nav", "common"], prefixes: ["dashboard.", "learner.", "nav."], indexable: false },
  { route: "/app/account/progress", surfaceType: "report-card", shards: ["learner", "pages"], prefixes: ["reportCard.", "progress.", "dashboard."], indexable: false },
  { route: "/fr/store", surfaceType: "printable-store", shards: ["pages", "billing", "nav"], prefixes: ["store.", "printables.", "pricing.", "nav.", "footer."], indexable: true },
  { route: "/fr/blog", surfaceType: "blog-hub", shards: ["pages", "marketing", "nav"], prefixes: ["blog.", "pages.blog.", "nav.", "footer."], indexable: true },
  { route: "/fr/blog/sample", surfaceType: "blog-detail", shards: ["pages", "marketing", "nav"], prefixes: ["blog.", "pages.blog.", "nav.", "footer."], indexable: true },
  { route: "/fr/login", surfaceType: "auth-account", shards: ["auth", "learner", "nav", "common"], prefixes: ["auth.", "account.", "nav.", "common."], indexable: false },
  { route: "/fr/rn", surfaceType: "exam-pathway-hub", shards: ["pages", "marketing", "nav"], prefixes: ["pages.exam", "pages.pathway", "nav.", "footer."], indexable: true },
  { route: "/fr/np", surfaceType: "exam-pathway-hub", shards: ["pages", "marketing", "nav"], prefixes: ["pages.exam", "pages.pathway", "nav.", "footer."], indexable: true },
  { route: "/fr/allied", surfaceType: "exam-pathway-hub", shards: ["pages", "marketing", "nav", "allied"], prefixes: ["pages.allied", "allied.", "nav.", "footer."], indexable: true },
  { route: "/fr/new-grad", surfaceType: "exam-pathway-hub", shards: ["pages", "marketing", "nav"], prefixes: ["pages.newGrad", "newGrad.", "nav.", "footer."], indexable: true },
];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function loadShard(locale, shard) {
  return readJson(path.join(I18N_ROOT, locale, `${shard}.json`)) ?? {};
}

function merged(locale) {
  const out = {};
  for (const shard of SHARDS) Object.assign(out, loadShard(locale, shard));
  return out;
}

function isProtectedOnly(value) {
  const words = String(value).match(/[A-Za-z][A-Za-z-]*/g) ?? [];
  return words.length > 0 && words.every((word) => PROTECTED.has(word));
}

function looksPlaceholder(value) {
  return /\b(?:pages|nav|footer|brand|components|common|billing|learner|auth)\.[a-z0-9_.-]+/i.test(value) ||
    /\[missing[:\]]|\{\{missing|TODO\b|TBD\b|lorem ipsum|translate this|translation needed|content unavailable right now/i.test(value);
}

function englishLeak(value) {
  const text = String(value).replace(/\b(?:NurseNest|REx-PN|NCLEX|CPNRE|OSCE|CAT|RN|RPN|PN|NP|NGN|NCSBN|CASN)\b/g, " ");
  if (text.trim().length < 8) return false;
  return /\b(the|and|your|with|for|this|that|from|learn|practice|questions|flashcards|pricing|dashboard|subscribe|lesson|lessons|account|sign in|get started)\b/i.test(text) &&
    !/[éèêëàâùûîïôçœ]/i.test(text);
}

function keysForSurface(en, surface) {
  const keys = Object.keys(en).filter((key) => surface.prefixes.some((prefix) => key.startsWith(prefix)));
  if (keys.length > 0) return keys;
  return Object.keys(en).filter((key) => surface.shards.some((shard) => key.startsWith(`${shard}.`))).slice(0, 200);
}

function issueList(limit, items) {
  return items.slice(0, limit);
}

function auditSurface(surface, en, fr) {
  const keys = keysForSurface(en, surface);
  const missingKeys = [];
  const englishLeakSuspicions = [];
  const untranslatedFields = [];
  const placeholderFields = [];

  for (const key of keys) {
    const ev = en[key];
    const fv = fr[key];
    if (typeof fv !== "string" || fv.trim() === "") {
      missingKeys.push(key);
      continue;
    }
    if (looksPlaceholder(fv)) placeholderFields.push(key);
    if (fv === ev && !isProtectedOnly(fv)) untranslatedFields.push(key);
    if (englishLeak(fv)) englishLeakSuspicions.push(`${key}: ${String(fv).slice(0, 120)}`);
  }

  const seoKeys = keys.filter((key) => /meta|seo|title|description|headline|openGraph|twitter/i.test(key));
  const seoIssues = seoKeys.filter((key) => missingKeys.includes(key) || untranslatedFields.includes(key) || placeholderFields.includes(key));
  const jsonLdIssues = keys.filter((key) => /jsonld|schema|structured|headline|articleBody/i.test(key) && (missingKeys.includes(key) || untranslatedFields.includes(key)));
  const denominator = Math.max(keys.length, 1);
  const issueCount = missingKeys.length + untranslatedFields.length + englishLeakSuspicions.length + placeholderFields.length + seoIssues.length + jsonLdIssues.length;
  const completionScore = Math.max(0, Math.round(((denominator - issueCount) / denominator) * 100));
  const shouldNoindex = surface.indexable && completionScore < MIN_INDEXABLE_SCORE;

  return {
    route: surface.route,
    locale: LOCALE,
    surfaceType: surface.surfaceType,
    completionScore,
    missingKeys: issueList(40, missingKeys),
    englishLeakSuspicions: issueList(40, englishLeakSuspicions),
    untranslatedFields: issueList(40, [...untranslatedFields, ...placeholderFields]),
    seoIssues: issueList(40, seoIssues),
    jsonLdIssues: issueList(40, jsonLdIssues),
    indexable: surface.indexable && !shouldNoindex,
    shouldNoindex,
    recommendedFix: !surface.indexable
      ? "Non-indexable learner/auth/tooling surface; keep noindex."
      : shouldNoindex
        ? "Keep noindex,follow and complete/review French translations before sitemap or hreflang inclusion."
        : "Ready for French indexing under the current static audit.",
    totals: { requiredKeys: keys.length, missing: missingKeys.length, untranslated: untranslatedFields.length, englishLeaks: englishLeakSuspicions.length },
  };
}

function markdown(results) {
  const rex = results.filter((r) => /rex-pn|canada\/pn/.test(r.route));
  const blocked = results.filter((r) => r.shouldNoindex);
  return [
    "# French Completeness Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `French status: ${blocked.length === 0 ? "complete for audited indexable surfaces" : `${blocked.length} audited surfaces require noindex`}`,
    `REx-PN French status: ${rex.every((r) => !r.shouldNoindex) ? "indexable" : "blocked from indexing until complete"}`,
    "",
    "| Route | Surface | Score | Indexable | Noindex | Top issue |",
    "| --- | --- | ---: | --- | --- | --- |",
    ...results.map((r) => `| ${r.route} | ${r.surfaceType} | ${r.completionScore} | ${r.indexable ? "yes" : "no"} | ${r.shouldNoindex ? "yes" : "no"} | ${(r.missingKeys[0] ?? r.untranslatedFields[0] ?? r.englishLeakSuspicions[0] ?? r.seoIssues[0] ?? "none").replace(/\|/g, "\\|")} |`),
    "",
    "## Next Required Translations",
    "",
    ...blocked.slice(0, 12).map((r) => `- ${r.route}: ${r.recommendedFix}`),
    "",
  ].join("\n");
}

fs.mkdirSync(REPORT_DIR, { recursive: true });
const en = merged("en");
const fr = merged(LOCALE);
const results = SURFACES.map((surface) => auditSurface(surface, en, fr));
const report = {
  generatedAt: new Date().toISOString(),
  locale: LOCALE,
  minIndexableScore: MIN_INDEXABLE_SCORE,
  results,
  summary: {
    auditedRoutes: results.length,
    noindexRequired: results.filter((r) => r.shouldNoindex).length,
    indexable: results.filter((r) => r.indexable).length,
  },
};

fs.writeFileSync(path.join(REPORT_DIR, "french-completeness-audit.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(REPORT_DIR, "french-completeness-audit.md"), markdown(results));

const indexedWhileIncomplete = results.filter((r) => r.indexable && r.completionScore < MIN_INDEXABLE_SCORE);
if (indexedWhileIncomplete.length > 0) {
  console.error(`[i18n:fr] French surfaces indexed while incomplete: ${indexedWhileIncomplete.map((r) => r.route).join(", ")}`);
  process.exit(1);
}
console.log(`[i18n:fr] wrote reports/french-completeness-audit.{json,md}; noindex required for ${report.summary.noindexRequired} surfaces.`);
