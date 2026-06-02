#!/usr/bin/env node
/**
 * Validate a single NurseNest blog import JSON (data/blog-import/{slug}.json).
 * Exit 0 if valid for "import-ready", 1 otherwise.
 *
 * Run: node scripts/blog-pipeline/validate-post.mjs data/blog-import/foo.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BLOG_LOCALES } from "./constants.mjs";

const __filename = fileURLToPath(import.meta.url);

function wordCountLatin(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hanCount(text) {
  return [...(text || "")].filter((ch) => /[\u4e00-\u9fff]/.test(ch)).length;
}

/** Japanese / Korean / CJK-heavy text often has few spaces; approximate "word" density. */
function eastAsianCharUnits(text) {
  return [...(text || "")].filter((ch) =>
    /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(ch),
  ).length;
}

function effectiveWords(body, locale) {
  const w = wordCountLatin(body);
  if (locale === "zh") return Math.max(w, hanCount(body));
  if (locale === "ja" || locale === "ko") {
    const units = eastAsianCharUnits(body);
    return Math.max(w, Math.floor(units / 1.65));
  }
  return w;
}

const REQUIRED_SECTIONS_EN = [
  "## Introduction",
  "## Key NCLEX takeaway",
  "## Normal physiology",
  "## Pathophysiology",
  "## Signs and symptoms",
  "## Labs and diagnostics",
  "## Complications",
  "## Nursing interventions",
  "## Treatments",
  "## Clinical pearls",
  "## NCLEX traps",
  "## Practice question",
  "## Summary",
  "## FAQ",
  "## References",
];

function hasInternalLinks(links) {
  if (!Array.isArray(links)) return false;
  const hrefs = new Set(links.map((x) => x.href).filter(Boolean));
  const hasLessons = [...hrefs].some((h) => h.includes("/lessons"));
  const hasTools = [...hrefs].some((h) => h.includes("/tools"));
  return hasLessons && hasTools;
}

function countApaEntries(refs) {
  if (!refs || typeof refs !== "string") return 0;
  const blocks = refs.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  return blocks.length;
}

export function validatePostObject(data, { strictAllLocales = true } = {}) {
  const errors = [];
  if (!data.slug) errors.push("missing slug");
  if (!data.pathway) errors.push("missing pathway");
  if (!data.breadcrumb || !data.breadcrumb.level1) errors.push("missing breadcrumb");

  const langs = data.languages || {};
  const presentLocales = BLOG_LOCALES.filter((loc) => langs[loc] != null);
  if (presentLocales.length === 0) errors.push("no language blocks present");

  for (const loc of BLOG_LOCALES) {
    const L = langs[loc];
    if (L == null) {
      if (strictAllLocales) errors.push(`locale ${loc} is null/missing`);
      continue;
    }
    const body = L.bodyMarkdown || "";
    if (body.length < 100) errors.push(`locale ${loc}: body too short or empty`);
    const wc = effectiveWords(body, loc);
    if (wc < 1200) errors.push(`locale ${loc}: word count ${wc} < 1200`);
    if (/(\[Same as en\]|TBD|TBD\]|PLACEHOLDER)/i.test(body + (L.referencesApa7 || ""))) {
      errors.push(`locale ${loc}: forbidden placeholder text`);
    }
    for (const sec of REQUIRED_SECTIONS_EN) {
      if (!body.includes(sec)) {
        errors.push(`${loc}: missing required section heading "${sec}"`);
      }
    }
    const refs = L.referencesApa7 || "";
    if (countApaEntries(refs) < 5) errors.push(`locale ${loc}: APA entries < 5`);
    if (!/doi\.org|ISBN|Retrieved from|http/i.test(refs)) {
      errors.push(`locale ${loc}: APA block should include identifiers (DOI/URL/publisher)`);
    }
    if (!hasInternalLinks(L.internalLinks)) errors.push(`locale ${loc}: internal links must include /lessons and /tools`);
  }

  const v = data.validation || {};
  return { errors, validation: v };
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: validate-post.mjs <path-to-json>");
    process.exit(1);
  }
  const abs = path.resolve(file);
  const raw = JSON.parse(fs.readFileSync(abs, "utf8"));
  const draft = process.argv.includes("--draft");
  const { errors } = validatePostObject(raw, { strictAllLocales: !draft });
  if (errors.length) {
    console.error(JSON.stringify({ file: abs, errors }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ ok: true, file: abs }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
