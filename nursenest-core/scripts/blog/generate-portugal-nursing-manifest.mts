#!/usr/bin/env npx tsx
import "../../src/lib/db/script-env-bootstrap";
/**
 * Generates `data/blog-manifest/portugal-nursing-200.manifest.json` with 200 planned entries.
 *
 * Distribution: EN 70, pt 100, es 15, fr 10, ar 5.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "data", "blog-manifest", "portugal-nursing-200.manifest.json");

const THEMES = [
  "how-to-become-a-nurse-in-portugal",
  "nurse-registration-portugal",
  "foreign-nurses-in-portugal",
  "nursing-jobs-portugal",
  "portuguese-nurses-abroad",
  "portugal-to-uk-nurse-pathway",
  "portugal-to-germany-nurse-pathway",
] as const;

const LANG_DIST: { lang: string; count: number }[] = [
  { lang: "en", count: 70 },
  { lang: "pt", count: 100 },
  { lang: "es", count: 15 },
  { lang: "fr", count: 10 },
  { lang: "ar", count: 5 },
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
      const translationGroupId = `pt-nurse-${String(Math.floor((n - 1) / THEMES.length) + 1).padStart(4, "0")}-${theme}`;
      const titleBase = `${theme.replace(/-/g, " ")} — Portugal nursing (${lang} ${i + 1})`;
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
        category: "Portugal nursing",
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
  console.log(`[portugal-manifest] wrote ${rows.length} unique slugs to ${OUT}`);
}

main();
