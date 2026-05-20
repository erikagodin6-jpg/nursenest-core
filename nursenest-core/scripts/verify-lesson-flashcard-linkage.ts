#!/usr/bin/env npx tsx
/**
 * Catalog-only verification: lesson-linked virtual flashcards merged for each pathway.
 *
 * Usage: npm run verify:lesson-flashcard-linkage
 */
import { collectMergedLessonVirtualFlashcardsForPathway } from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import { parseLessonLinkSourceKey } from "@/lib/flashcards/lesson-link-source-key";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

function main() {
  const pathwayIds = listCatalogPathwayIdsWithLessonsSync().sort();
  let totalLessons = 0;
  let totalCards = 0;
  let lessonsZero = 0;
  let missingRationale = 0;
  let missingLessonHref = 0;
  let missingCategory = 0;
  const stemCounts = new Map<string, number>();
  let fillerTagged = 0;

  console.log("=== verify:lesson-flashcard-linkage ===\n");

  for (const pathwayId of pathwayIds) {
    const lessons = getCatalogPathwayLessonsSync(pathwayId);
    const { virtuals, diagnostics } = collectMergedLessonVirtualFlashcardsForPathway(pathwayId);
    totalLessons += lessons.length;
    totalCards += virtuals.length;

    const bySlug = new Map<string, typeof virtuals>();
    for (const v of virtuals) {
      const arr = bySlug.get(v.lessonSlug) ?? [];
      arr.push(v);
      bySlug.set(v.lessonSlug, arr);
    }

    let z = 0;
    for (const l of lessons) {
      if ((bySlug.get(l.slug) ?? []).length === 0) {
        z += 1;
        console.log(`[zero cards] pathway=${pathwayId} slug=${l.slug}`);
      }
    }
    lessonsZero += z;

    for (const v of virtuals) {
      const rat = (v.row.rationaleCorrect ?? "").trim();
      if (rat.length < 8) {
        missingRationale += 1;
        console.log(`[missing rationale] pathway=${pathwayId} id=${v.id}`);
      }
      const href = (v.lessonHref ?? "").trim();
      if (!href || (!href.includes(v.lessonSlug) && !href.includes("q="))) {
        missingLessonHref += 1;
        console.log(`[missing lesson link] pathway=${pathwayId} id=${v.id}`);
      }
      const cat = (v.row.category?.name ?? "").trim();
      if (!cat) {
        missingCategory += 1;
        console.log(`[missing category/system] pathway=${pathwayId} id=${v.id}`);
      }
      const sk = v.row.sourceKey ?? "";
      const stemKey = `${pathwayId}|${v.row.front.trim().toLowerCase().slice(0, 120)}`;
      stemCounts.set(stemKey, (stemCounts.get(stemKey) ?? 0) + 1);
      if (v.derivedFromGenericFillerBody) fillerTagged += 1;
      if (sk.startsWith("lessonlink:v1|") && !parseLessonLinkSourceKey(sk)) {
        console.log(`[bad lessonlink key] pathway=${pathwayId} id=${v.id}`);
      }
    }

    console.log(
      `pathway=${pathwayId} lessons=${lessons.length} virtualCards=${virtuals.length} lessonsWithCards=${diagnostics.lessonsWithVirtualCards} recall=${diagnostics.recallVirtualCount} section=${diagnostics.sectionDerivedVirtualCount} fillerTaggedSection=${diagnostics.genericFillerSourcedSectionCards}`,
    );
  }

  let dupStems = 0;
  for (const c of stemCounts.values()) {
    if (c > 1) dupStems += c - 1;
  }

  console.log("\n--- rollup ---");
  console.log(`total lessons (sum by pathway): ${totalLessons}`);
  console.log(`total generated flashcards (merged): ${totalCards}`);
  console.log(`lessons with zero cards (per pathway×slug): ${lessonsZero}`);
  console.log(`flashcards missing rationale: ${missingRationale}`);
  console.log(`flashcards missing linked lesson: ${missingLessonHref}`);
  console.log(`flashcards missing category/system: ${missingCategory}`);
  console.log(`duplicate stem rows (extra copies): ${dupStems}`);
  console.log(`flashcards generated from generic-tagged section bodies: ${fillerTagged}`);
  console.log("\nverify:lesson-flashcard-linkage complete.");
}

main();
