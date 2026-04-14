#!/usr/bin/env node
/**
 * Merge locale JSON files into bundle.json + word counts.
 * Run: node data/blog/ards-pathophysiology-nclex-multilingual/build-bundle.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = __dirname;
const locales = ["en", "fr", "es", "pt", "tl", "ar", "hi", "zh", "pa", "vi"];

function wordCount(text) {
  if (!text) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Space-delimited wc undercounts CJK; use Han character count as floor for zh. */
function effectiveWordCount(text, locale) {
  const base = wordCount(text);
  if (locale === "zh") {
    const han = [...text].filter((ch) => /[\u4e00-\u9fff]/.test(ch)).length;
    return Math.max(base, han);
  }
  return base;
}

const languages = {};
const wordCounts = {};
let minW = Infinity;
let minLocale = "";

for (const loc of locales) {
  const p = path.join(DIR, `${loc}.json`);
  if (!fs.existsSync(p)) {
    console.error("Missing:", p);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  const wc = effectiveWordCount(raw.bodyMarkdown, loc);
  wordCounts[loc] = wc;
  languages[loc] = raw;
  if (wc < minW) {
    minW = wc;
    minLocale = loc;
  }
}

const slug = languages.en?.slug ?? "ards-pathophysiology-nclex-nursing-exam-guide";

const bundle = {
  slug,
  languages,
  wordCounts,
  validation: {
    allAbove1200: Object.values(wordCounts).every((n) => n >= 1200),
    apaComplete: Object.values(languages).every(
      (L) =>
        typeof L.referencesApa7 === "string" &&
        L.referencesApa7.includes("doi.org") &&
        !L.referencesApa7.includes("[Same") &&
        L.referencesApa7.includes("Ranieri"),
    ),
    sectionsComplete: locales.every((loc) => {
      const L = languages[loc];
      const b = typeof L.bodyMarkdown === "string" ? L.bodyMarkdown : "";
      const refs = typeof L.referencesApa7 === "string" ? L.referencesApa7 : "";
      const han = [...b].filter((ch) => /[\u4e00-\u9fff]/.test(ch)).length;
      const bodySubstantial =
        loc === "zh" ? b.length > 3500 && han >= 1200 : b.length > 7000;
      return (
        bodySubstantial &&
        /##\s/.test(b) &&
        refs.length > 400 &&
        /Ranieri|Thompson|McCance|Hinkle/.test(refs)
      );
    }),
  },
  minWordCount: { locale: minLocale, words: minW },
};

fs.writeFileSync(path.join(DIR, "bundle.json"), JSON.stringify(bundle, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ wordCounts, validation: bundle.validation, minWordCount: bundle.minWordCount }, null, 2));
