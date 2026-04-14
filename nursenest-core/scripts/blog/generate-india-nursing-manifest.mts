#!/usr/bin/env npx tsx
/**
 * Generates `data/blog-manifest/india-nursing-200.manifest.json` with 200 planned entries
 * across languages and themes. Does not touch the database.
 *
 * Run from nursenest-core/: npx tsx scripts/blog/generate-india-nursing-manifest.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "data", "blog-manifest", "india-nursing-200.manifest.json");

const THEMES = [
  "how-to-become-nurse-india",
  "best-nursing-exams-india",
  "aiims-nursing-prep",
  "state-nursing-registration",
  "indian-nurses-abroad",
  "nclex-indian-nurses",
  "oet-vs-ielts-india",
  "nursing-salary-india",
  "government-nursing-jobs-india",
  "nursing-entrance-exams-india",
] as const;

const LANG_DIST: { lang: string; count: number }[] = [
  { lang: "en", count: 60 },
  { lang: "hi", count: 40 },
  { lang: "ta", count: 25 },
  { lang: "te", count: 25 },
  { lang: "bn", count: 20 },
  { lang: "mr", count: 15 },
  { lang: "gu", count: 15 },
];

type Row = {
  title: string;
  slug: string;
  primaryKeyword: string;
  language: string;
  category: string;
  intentType: "informational" | "transactional";
  translationGroupId: string;
  status: "planned";
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u0bff\u0c00-\u0c7f\u0980-\u09ff\u0a80-\u0aff]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function main() {
  const rows: Row[] = [];
  let n = 0;
  for (const { lang, count } of LANG_DIST) {
    for (let i = 0; i < count; i += 1) {
      n += 1;
      const theme = THEMES[(n - 1) % THEMES.length]!;
      const translationGroupId = `in-nurse-${String(Math.floor((n - 1) / THEMES.length) + 1).padStart(4, "0")}-${theme}`;
      const titleBase = `${theme.replace(/-/g, " ")} — India nursing (${lang.toUpperCase()} guide ${i + 1})`;
      const slug = `${lang}-${theme}-${String(n).padStart(3, "0")}-${slugify(titleBase).slice(0, 40)}`;
      rows.push({
        title: titleBase,
        slug: slug.slice(0, 120),
        primaryKeyword: theme.replace(/-/g, " "),
        language: lang,
        category: "India nursing",
        intentType: i % 5 === 0 ? "transactional" : "informational",
        translationGroupId,
        status: "planned",
      });
    }
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), count: rows.length, entries: rows }, null, 2), "utf8");
  console.log(`[india-manifest] wrote ${rows.length} entries to ${OUT}`);
}

main();
