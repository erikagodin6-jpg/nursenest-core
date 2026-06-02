/**
 * Dry-run catalog report: authoring `bodySystem` label classification vs full-lesson hub classification.
 * Same signals as `taxonomy-audit-pathway-catalog.mts` — use before bulk-updating `bodySystem` in JSON/DB.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/fix-taxonomy.mts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { classifyNursingContent, classifyPathwayLessonRecordForHub } from "@/lib/taxonomy/classifier";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

type CatalogLesson = Pick<
  PathwayLessonRecord,
  "title" | "topic" | "topicSlug" | "bodySystem" | "seoDescription" | "sections" | "system"
>;

function topN(m: Map<string, number>, n: number): { pattern: string; count: number }[] {
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([pattern, count]) => ({ pattern, count }));
}

function main() {
  const root = process.cwd();
  const catalogPath = join(root, "src", "content", "pathway-lessons", "catalog.json");
  const raw = JSON.parse(readFileSync(catalogPath, "utf8")) as {
    pathways?: Record<string, { lessons?: CatalogLesson[] }>;
  };
  const pathways = raw.pathways ?? {};
  let total = 0;
  let mismatched = 0;
  const patternCounts = new Map<string, number>();

  for (const [_pathwayId, bucket] of Object.entries(pathways)) {
    const lessons = bucket.lessons ?? [];
    for (const lesson of lessons) {
      total += 1;
      const fromLabel = classifyNursingContent({ title: lesson.bodySystem ?? "" }).categoryId;
      const fromContent = classifyPathwayLessonRecordForHub({
        title: lesson.title,
        topic: lesson.topic,
        topicSlug: lesson.topicSlug,
        bodySystem: lesson.bodySystem,
        seoDescription: lesson.seoDescription,
        system: lesson.system ?? "",
        sections: lesson.sections ?? [],
      }).categoryId;
      if (fromLabel !== fromContent) {
        mismatched += 1;
        const key = `${fromLabel}→${fromContent}`;
        patternCounts.set(key, (patternCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const pct = total ? ((mismatched / total) * 100).toFixed(2) : "0";
  console.log(
    JSON.stringify(
      {
        script: "fix-taxonomy",
        note: "Dry-run only. No files or DB writes.",
        totalLessons: total,
        labelVsCorpusMismatched: mismatched,
        misclassifiedPct: pct,
        topPatterns: topN(patternCounts, 24),
      },
      null,
      2,
    ),
  );
}

main();
