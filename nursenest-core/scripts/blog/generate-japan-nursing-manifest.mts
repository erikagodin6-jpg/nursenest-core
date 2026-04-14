#!/usr/bin/env npx tsx
/**
 * Generates `data/blog-manifest/japan-nursing-200.manifest.json` with 200 planned entries.
 *
 * Distribution: EN 70, ja 100, zh 10, tl 10, vi 10.
 *
 * Run from nursenest-core/: npx tsx scripts/blog/generate-japan-nursing-manifest.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "data", "blog-manifest", "japan-nursing-200.manifest.json");

const THEMES = [
  "national-nursing-examination-japan",
  "how-to-become-a-nurse-in-japan",
  "japanese-nursing-licensure-guide",
  "nursing-jobs-in-japan",
  "japanese-nurses-abroad",
  "nclex-for-japanese-nurses",
  "australia-for-japanese-nurses",
  "english-test-pathways-for-japanese-nurses",
  "study-tips-for-nursing-exam-japan",
  "working-in-japanese-hospitals",
] as const;

const LANG_DIST: { lang: string; count: number }[] = [
  { lang: "en", count: 70 },
  { lang: "ja", count: 100 },
  { lang: "zh", count: 10 },
  { lang: "tl", count: 10 },
  { lang: "vi", count: 10 },
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
      const translationGroupId = `jp-nurse-${String(Math.floor((n - 1) / THEMES.length) + 1).padStart(4, "0")}-${theme}`;
      const titleBase = `${theme.replace(/-/g, " ")} — Japan nursing (${lang} ${i + 1})`;
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
        category: "Japan nursing",
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
  console.log(`[japan-manifest] wrote ${rows.length} unique slugs to ${OUT}`);
}

main();
