#!/usr/bin/env node
/**
 * Build per-locale JSON files from bodies/*.md + locale-metadata.json + en.json references.
 * Run: node data/blog/ards-pathophysiology-nclex-multilingual/assemble-locales.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = __dirname;

const en = JSON.parse(fs.readFileSync(path.join(DIR, "en.json"), "utf8"));
const meta = JSON.parse(fs.readFileSync(path.join(DIR, "locale-metadata.json"), "utf8"));
const refs = en.referencesApa7;

const locales = ["en", "fr", "es", "pt", "tl", "ar", "hi", "zh", "pa", "vi"];

for (const loc of locales) {
  if (loc === "en") {
    continue;
  }
  const bodyPath = path.join(DIR, "bodies", `${loc}.md`);
  if (!fs.existsSync(bodyPath)) {
    console.error("Missing body:", bodyPath);
    process.exit(1);
  }
  const bodyMarkdown = fs.readFileSync(bodyPath, "utf8");
  const m = meta[loc];
  if (!m) {
    console.error("Missing metadata for", loc);
    process.exit(1);
  }
  const out = {
    locale: m.locale,
    slug: m.slug,
    seoTitle: m.seoTitle,
    metaDescription: m.metaDescription,
    primaryKeyword: m.primaryKeyword,
    secondaryKeywords: m.secondaryKeywords,
    internalLinks: m.internalLinks,
    bodyMarkdown,
    referencesApa7: refs,
  };
  fs.writeFileSync(path.join(DIR, `${loc}.json`), JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log("Wrote", `${loc}.json`);
}

console.log("Done (en.json unchanged).");
