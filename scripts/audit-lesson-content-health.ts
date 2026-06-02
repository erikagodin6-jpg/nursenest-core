#!/usr/bin/env npx tsx
/**
 * Code-level pathway lesson health using catalog.json + allied-bundled-catalog.json + scoped-gold merge only.
 * Avoids importing pathway-lesson-loader (server-only / DB graph) so this runs under plain `tsx`.
 *
 * Run: npx tsx scripts/audit-lesson-content-health.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { prependScopedGoldCatalogLessons } from "../src/lib/lessons/scoped-lessons/scoped-gold-registry";
import { listExamPathways } from "../src/lib/exam-pathways/exam-product-registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const ALLIED_BUNDLED = path.join(ROOT, "src/content/pathway-lessons/allied-bundled-catalog.json");

type RawLesson = {
  slug: string;
  sections?: Array<{ body?: string }>;
  relatedLessonRefs?: Array<{ slug?: string }>;
};

type CatalogJson = { pathways?: Record<string, { lessons?: RawLesson[] }> };

function loadAlliedBundledLessons(pathwayId: string): RawLesson[] {
  if (!fs.existsSync(ALLIED_BUNDLED)) return [];
  const j = JSON.parse(fs.readFileSync(ALLIED_BUNDLED, "utf8")) as {
    pathways?: Record<string, RawLesson[]>;
  };
  return j.pathways?.[pathwayId] ?? [];
}

function mergeCatalogBucketWithAllied(pathwayId: string, raw: CatalogJson): RawLesson[] {
  const bucket = raw.pathways?.[pathwayId]?.lessons ?? [];
  const allied = loadAlliedBundledLessons(pathwayId);
  const seen = new Set(bucket.map((l) => l.slug));
  return [...bucket, ...allied.filter((l) => !seen.has(l.slug))];
}

function wordCountSections(sections: Array<{ body?: string }> | undefined): number {
  if (!Array.isArray(sections)) return 0;
  let n = 0;
  for (const s of sections) {
    const b = typeof s.body === "string" ? s.body : "";
    n += b.split(/\s+/).filter(Boolean).length;
  }
  return n;
}

function main() {
  if (!fs.existsSync(CATALOG)) {
    console.error("Missing catalog:", CATALOG);
    process.exit(2);
  }
  const raw = JSON.parse(fs.readFileSync(CATALOG, "utf8")) as CatalogJson;
  const pathways = listExamPathways().filter((p) => p.status !== "hidden");

  /** All lesson slugs across pathways — `LESSON:slug` links may target another hub’s slug. */
  const globalSlugs = new Set<string>();
  for (const p of pathways) {
    const combined = mergeCatalogBucketWithAllied(p.id, raw);
    const merged = prependScopedGoldCatalogLessons(p.id, combined);
    for (const l of merged) {
      const s = typeof l.slug === "string" ? l.slug.trim() : "";
      if (s) globalSlugs.add(s);
    }
  }

  let totalLessons = 0;
  let thinBody = 0;
  let fewSections = 0;
  let missingRelatedTarget = 0;
  let brokenWikiLinks = 0;

  const byPathway: Record<
    string,
    { lessons: number; thin: number; fewSec: number; badRelated: number; badWiki: number }
  > = {};

  for (const p of pathways) {
    byPathway[p.id] = { lessons: 0, thin: 0, fewSec: 0, badRelated: 0, badWiki: 0 };
    const combined = mergeCatalogBucketWithAllied(p.id, raw);
    const merged = prependScopedGoldCatalogLessons(p.id, combined);

    for (const lesson of merged) {
      totalLessons += 1;
      byPathway[p.id].lessons += 1;

      const wc = wordCountSections(lesson.sections);
      if (wc < 80) {
        thinBody += 1;
        byPathway[p.id].thin += 1;
      }
      const secN = Array.isArray(lesson.sections) ? lesson.sections.length : 0;
      if (secN > 0 && secN < 3) {
        fewSections += 1;
        byPathway[p.id].fewSec += 1;
      }

      for (const ref of lesson.relatedLessonRefs ?? []) {
        const slug = typeof ref.slug === "string" ? ref.slug.trim() : "";
        /** Cross-pathway refs are valid — resolve against all merged pathway slugs. */
        if (!slug || !globalSlugs.has(slug)) {
          missingRelatedTarget += 1;
          byPathway[p.id].badRelated += 1;
        }
      }

      for (const sec of lesson.sections ?? []) {
        const body = typeof sec.body === "string" ? sec.body : "";
        for (const m of body.matchAll(/\]\(LESSON:([^)]+)\)/g)) {
          const target = m[1]?.trim() ?? "";
          if (!target || !globalSlugs.has(target)) {
            brokenWikiLinks += 1;
            byPathway[p.id].badWiki += 1;
          }
        }
      }
    }
  }

  console.log(
    "Pathway lesson content health (catalog.json + allied-bundled-catalog.json + scoped gold, raw — no DB, no normalizeLesson)\n",
  );
  console.log(`Total lesson rows: ${totalLessons}`);
  console.log(`Thin body (<80 words in section bodies): ${thinBody}`);
  console.log(`Few sections (<3, when any sections exist): ${fewSections}`);
  console.log(`Related ref slug missing in global merged catalog: ${missingRelatedTarget}`);
  console.log(`LESSON: wiki links to missing slug: ${brokenWikiLinks}`);
  console.log("\nPer pathway (id: lessons / thin / fewSec / badRelated / badWiki):");
  for (const p of pathways) {
    const r = byPathway[p.id];
    console.log(
      `  ${p.id.padEnd(22)} ${String(r.lessons).padStart(4)} / ${String(r.thin).padStart(4)} / ${String(r.fewSec).padStart(3)} / ${String(r.badRelated).padStart(3)} / ${String(r.badWiki).padStart(3)}`,
    );
  }
  console.log(
    "\nNote: For structuralQuality.publicComplete and premium gates, use app code or admin tooling — not this raw JSON pass.",
  );
}

main();
