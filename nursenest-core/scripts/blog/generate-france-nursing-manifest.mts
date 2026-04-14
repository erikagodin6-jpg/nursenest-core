#!/usr/bin/env npx tsx
/**
 * Generates `data/blog-manifest/france-nursing-200.manifest.json` with 200 planned entries.
 *
 * Distribution: EN 70, fr 100, ar 15, pt 10, es 5.
 *
 * Run from nursenest-core/: npx tsx scripts/blog/generate-france-nursing-manifest.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "data", "blog-manifest", "france-nursing-200.manifest.json");

const THEMES = [
  "how-to-become-a-nurse-in-france",
  "nurse-registration-france",
  "france-for-foreign-nurses",
  "language-requirements-france",
  "france-nursing-jobs",
  "france-to-canada-nurse-pathway",
  "france-to-australia-nurse-pathway",
] as const;

const LANG_DIST: { lang: string; count: number }[] = [
  { lang: "en", count: 70 },
  { lang: "fr", count: 100 },
  { lang: "ar", count: 15 },
  { lang: "pt", count: 10 },
  { lang: "es", count: 5 },
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
      const translationGroupId = `fr-nurse-${String(Math.floor((n - 1) / THEMES.length) + 1).padStart(4, "0")}-${theme}`;
      const titleBase = `${theme.replace(/-/g, " ")} — France nursing (${lang} ${i + 1})`;
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
        category: "France nursing",
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
  console.log(`[france-manifest] wrote ${rows.length} unique slugs to ${OUT}`);
}

main();
