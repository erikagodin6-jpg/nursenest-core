#!/usr/bin/env npx tsx
import "../../src/lib/db/script-env-bootstrap";
/**
 * Generates `data/blog-manifest/middle-east-nursing-200.manifest.json` with 200 planned entries.
 * Content files are generated separately in batches; this manifest drives the pipeline.
 *
 * Run from nursenest-core/: npx tsx scripts/blog/generate-middle-east-nursing-manifest.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "data", "blog-manifest", "middle-east-nursing-200.manifest.json");

const THEMES = [
  "prometric-nursing-exam-guide",
  "saudi-nursing-exam-preparation",
  "dha-exam-requirements",
  "haad-vs-dha-differences",
  "work-as-nurse-in-uae",
  "dataflow-verification-explained",
  "nurses-moving-to-saudi-arabia",
  "best-country-middle-east-for-nurses",
  "nurse-salary-uae-saudi",
  "prometric-exam-questions-tips",
] as const;

/** EN 80, AR 60, HI 25, TL 20, UR 15 */
const LANG_DIST: { lang: string; count: number }[] = [
  { lang: "en", count: 80 },
  { lang: "ar", count: 60 },
  { lang: "hi", count: 25 },
  { lang: "tl", count: 20 },
  { lang: "ur", count: 15 },
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
    .replace(/[^a-z0-9]+/g, "-")
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
      const translationGroupId = `me-nurse-${String(Math.floor((n - 1) / THEMES.length) + 1).padStart(4, "0")}-${theme}`;
      const titleBase = `${theme.replace(/-/g, " ")} — Gulf nursing (${lang} ${i + 1})`;
      const slug = `${lang}-${theme}-${String(n).padStart(3, "0")}-${slugify(titleBase).slice(0, 48)}`;
      rows.push({
        title: titleBase,
        slug: slug.slice(0, 120),
        primaryKeyword: theme.replace(/-/g, " "),
        language: lang,
        category: "Middle East nursing",
        intentType: i % 5 === 0 ? "transactional" : "informational",
        translationGroupId,
        status: "planned",
      });
    }
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify({ generatedAt: new Date().toISOString(), count: rows.length, entries: rows }, null, 2),
    "utf8",
  );
  console.log(`[middle-east-manifest] wrote ${rows.length} entries to ${OUT}`);
}

main();
