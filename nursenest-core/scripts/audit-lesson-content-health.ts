#!/usr/bin/env npx tsx
/**
 * Code-level pathway lesson health: catalog + scoped-gold merge, structural gates, related-ref targets.
 * Does not hit HTTP routes (no live browser). Run: npx tsx scripts/audit-lesson-content-health.ts
 */
import { getEffectiveCatalogLessonsForPathwaySync } from "../src/lib/lessons/pathway-lesson-loader";
import { pathwayLessonHasRenderableHubSlug } from "../src/lib/lessons/pathway-lesson-types";
import { listExamPathways } from "../src/lib/exam-pathways/exam-product-registry";

function wordCountSections(sections: { body?: string }[]): number {
  let n = 0;
  for (const s of sections) {
    const b = typeof s.body === "string" ? s.body : "";
    n += b.split(/\s+/).filter(Boolean).length;
  }
  return n;
}

function main() {
  const pathways = listExamPathways().filter((p) => p.status !== "hidden");
  const slugSets = new Map<string, Set<string>>();
  for (const p of pathways) {
    const lessons = getEffectiveCatalogLessonsForPathwaySync(p.id);
    slugSets.set(
      p.id,
      new Set(lessons.map((l) => l.slug.trim()).filter(Boolean)),
    );
  }

  let totalLessons = 0;
  let notPublicComplete = 0;
  let thinBody = 0;
  let missingRelatedTarget = 0;
  let brokenWikiLinks = 0;

  const byPathway: Record<
    string,
    { lessons: number; notPublic: number; thin: number; badRelated: number; badWiki: number }
  > = {};

  for (const p of pathways) {
    byPathway[p.id] = { lessons: 0, notPublic: 0, thin: 0, badRelated: 0, badWiki: 0 };
    const lessons = getEffectiveCatalogLessonsForPathwaySync(p.id);
    const slugs = slugSets.get(p.id) ?? new Set();

    for (const lesson of lessons) {
      totalLessons += 1;
      byPathway[p.id].lessons += 1;

      if (!lesson.structuralQuality?.publicComplete) {
        notPublicComplete += 1;
        byPathway[p.id].notPublic += 1;
      }

      const wc = wordCountSections(lesson.sections);
      if (wc < 80) {
        thinBody += 1;
        byPathway[p.id].thin += 1;
      }

      for (const ref of lesson.relatedLessonRefs ?? []) {
        const slug = typeof ref.slug === "string" ? ref.slug.trim() : "";
        if (!slug || !slugs.has(slug)) {
          missingRelatedTarget += 1;
          byPathway[p.id].badRelated += 1;
        }
      }

      for (const sec of lesson.sections) {
        const body = typeof sec.body === "string" ? sec.body : "";
        for (const m of body.matchAll(/\]\(LESSON:([^)]+)\)/g)) {
          const target = m[1]?.trim() ?? "";
          if (!target || !slugs.has(target)) {
            brokenWikiLinks += 1;
            byPathway[p.id].badWiki += 1;
          }
        }
      }
    }
  }

  console.log("Pathway lesson content health (catalog + scoped gold, normalized)\n");
  console.log(`Total lessons counted: ${totalLessons}`);
  console.log(`structuralQuality.publicComplete === false: ${notPublicComplete}`);
  console.log(`Thin body (<80 words across sections): ${thinBody}`);
  console.log(`Related ref slug missing in pathway: ${missingRelatedTarget}`);
  console.log(`LESSON: wiki links pointing to missing slug: ${brokenWikiLinks}`);
  console.log("\nPer pathway (id: lessons / notPublic / thin / badRelated / badWiki):");
  for (const p of pathways) {
    const r = byPathway[p.id];
    console.log(
      `  ${p.id.padEnd(22)} ${String(r.lessons).padStart(4)} / ${String(r.notPublic).padStart(3)} / ${String(r.thin).padStart(4)} / ${String(r.badRelated).padStart(3)} / ${String(r.badWiki).padStart(3)}`,
    );
  }
  console.log(
    "\nNote: This is a static/catalog audit. DB-only lessons and runtime locale rows are not fully represented.",
  );
}

main();
