#!/usr/bin/env npx tsx
/**
 * Generates `data/blog-manifest/australia-nursing-200.manifest.json` with 200 planned entries.
 * Full article bodies are generated in batches separately.
 *
 * Run from nursenest-core/: npx tsx scripts/blog/generate-australia-nursing-manifest.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "data", "blog-manifest", "australia-nursing-200.manifest.json");

const THEMES = [
  "how-to-become-nurse-australia",
  "ahpra-registration-guide",
  "osce-nursing-australia",
  "oba-nursing-exam-australia",
  "nurses-moving-to-australia",
  "ielts-vs-oet-australia",
  "nursing-salary-australia",
  "best-pathway-international-nurses",
  "en-vs-rn-australia",
  "bridging-programs-australia-nursing",
] as const;

/** EN 90, HI 30, TL 30, AR 20, PA 15, ZH 15 */
const LANG_DIST: { lang: string; count: number }[] = [
  { lang: "en", count: 90 },
  { lang: "hi", count: 30 },
  { lang: "tl", count: 30 },
  { lang: "ar", count: 20 },
  { lang: "pa", count: 15 },
  { lang: "zh", count: 15 },
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
      const translationGroupId = `au-nurse-${String(Math.floor((n - 1) / THEMES.length) + 1).padStart(4, "0")}-${theme}`;
      const titleBase = `${theme.replace(/-/g, " ")} — Australia nursing (${lang} ${i + 1})`;
      const slug = `${lang}-${theme}-${String(n).padStart(3, "0")}-${slugify(titleBase).slice(0, 48)}`;
      rows.push({
        title: titleBase,
        slug: slug.slice(0, 120),
        primaryKeyword: theme.replace(/-/g, " "),
        language: lang,
        category: "Australia nursing",
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
  console.log(`[australia-manifest] wrote ${rows.length} entries to ${OUT}`);
}

main();
