#!/usr/bin/env node
/**
 * One-off / CI helper: list lowest word-count lessons for a pathway (merged catalog).
 * Run: npx tsx scripts/list-thinnest-pathway-lessons.mts --pathway=us-rn-nclex-rn --top=15
 */
import { pathwayLessonWordCount } from "@/lib/content-quality/classify-lesson";
import { getCatalogLessonsRaw, normalizeLesson } from "@/lib/lessons/pathway-lesson-catalog-sync";

function parseArg(name: string): string | undefined {
  const raw = process.argv.find((a) => a.startsWith(`${name}=`));
  return raw?.slice(name.length + 1);
}

function main(): void {
  const pathwayId = parseArg("--pathway") ?? "us-rn-nclex-rn";
  const top = Math.min(50, Math.max(1, Number.parseInt(parseArg("--top") ?? "15", 10) || 15));

  const rawLessons = getCatalogLessonsRaw(pathwayId);
  const rows = rawLessons.map((raw) => {
    const lesson = normalizeLesson(raw, pathwayId);
    return { slug: lesson.slug, wc: pathwayLessonWordCount(lesson) };
  });
  rows.sort((a, b) => a.wc - b.wc);
  console.info(`pathway=${pathwayId} lessons=${rows.length}`);
  for (const r of rows.slice(0, top)) {
    console.info(`${r.wc}\t${r.slug}`);
  }
}

main();
