#!/usr/bin/env npx tsx
import "../../src/lib/db/script-env-bootstrap";
/**
 * Generates `data/blog-manifest/korea-nursing-200.manifest.json` with 200 planned entries.
 *
 * Distribution: EN 70, ko 95, ja 10, zh 10, tl 10, hi 5.
 *
 * Run from nursenest-core/: npx tsx scripts/blog/generate-korea-nursing-manifest.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "data", "blog-manifest", "korea-nursing-200.manifest.json");

const THEMES = [
  "korean-nursing-licensing-examination-guide",
  "how-to-become-a-nurse-in-south-korea",
  "korean-nurse-salary",
  "korean-nurse-licensure-process",
  "study-guide-for-korean-nursing-exam",
  "korean-nurses-moving-abroad",
  "nclex-for-korean-nurses",
  "australia-for-korean-nurses",
  "uk-for-korean-nurses",
  "language-requirements-for-nurses-in-korea",
] as const;

const LANG_DIST: { lang: string; count: number }[] = [
  { lang: "en", count: 70 },
  { lang: "ko", count: 95 },
  { lang: "ja", count: 10 },
  { lang: "zh", count: 10 },
  { lang: "tl", count: 10 },
  { lang: "hi", count: 5 },
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
    .slice(0, 72);
}

function main() {
  const rows: Row[] = [];
  const seenSlugs = new Set<string>();
  let n = 0;
  for (const { lang, count } of LANG_DIST) {
    for (let i = 0; i < count; i += 1) {
      n += 1;
      const theme = THEMES[(n - 1) % THEMES.length]!;
      const translationGroupId = `kr-nurse-${String(Math.floor((n - 1) / THEMES.length) + 1).padStart(4, "0")}-${theme}`;
      const titleBase = `${theme.replace(/-/g, " ")} — Korea nursing (${lang} ${i + 1})`;
      let slug = `${lang}-${String(n).padStart(4, "0")}-${theme}-${slugify(titleBase)}`.slice(0, 120);
      while (seenSlugs.has(slug)) {
        slug = `${slug}-x${Math.random().toString(36).slice(2, 6)}`.slice(0, 120);
      }
      seenSlugs.add(slug);
      rows.push({
        title: titleBase,
        slug,
        primaryKeyword: theme.replace(/-/g, " "),
        language: lang,
        category: "Korea nursing",
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
  console.log(`[korea-manifest] wrote ${rows.length} unique slugs to ${OUT}`);
}

main();
