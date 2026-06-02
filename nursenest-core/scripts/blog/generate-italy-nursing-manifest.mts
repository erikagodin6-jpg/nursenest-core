#!/usr/bin/env npx tsx
import "../../src/lib/db/script-env-bootstrap";
/**
 * Generates `data/blog-manifest/italy-nursing-200.manifest.json` with 200 planned entries.
 *
 * Distribution: EN 70, it 100, ar 10, ro 10, es 10.
 *
 * Run from nursenest-core/: npx tsx scripts/blog/generate-italy-nursing-manifest.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "data", "blog-manifest", "italy-nursing-200.manifest.json");

const THEMES = [
  "how-to-become-a-nurse-in-italy",
  "nurse-registration-italy",
  "foreign-nurses-in-italy",
  "nursing-jobs-italy",
  "italian-nurses-abroad",
  "italy-to-germany-nurse-pathway",
  "italy-to-canada-nurse-pathway",
] as const;

const LANG_DIST: { lang: string; count: number }[] = [
  { lang: "en", count: 70 },
  { lang: "it", count: 100 },
  { lang: "ar", count: 10 },
  { lang: "ro", count: 10 },
  { lang: "es", count: 10 },
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
      const translationGroupId = `it-nurse-${String(Math.floor((n - 1) / THEMES.length) + 1).padStart(4, "0")}-${theme}`;
      const titleBase = `${theme.replace(/-/g, " ")} — Italy nursing (${lang} ${i + 1})`;
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
        category: "Italy nursing",
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
  console.log(`[italy-manifest] wrote ${rows.length} unique slugs to ${OUT}`);
}

main();
