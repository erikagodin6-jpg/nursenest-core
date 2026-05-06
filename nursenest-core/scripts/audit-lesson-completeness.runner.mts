#!/usr/bin/env node
/**
 * Audits normalized catalog pathway lessons (publicComplete) for depth, placeholders, figures, and links.
 * Does not hit Prisma — filesystem catalog via pathway-lesson-catalog-sync.
 *
 * Intentionally does not call `resolveLessonImage` (inventory uses `require` and breaks under this ESM runner).
 * Section-level figure URLs are still validated with `hasRenderableLessonFigure`.
 */
import { ExamFamily } from "@prisma/client";
import { pathwayLessonWordCount } from "@/lib/content-quality/classify-lesson";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  getCatalogLessonsRaw,
  listCatalogPathwayIdsWithLessonsSync,
  normalizeLesson,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { hasRenderableLessonFigure } from "@/lib/lessons/has-renderable-lesson-image";

type Row = {
  pathwayId: string;
  slug: string;
  issues: string[];
};

const PLACEHOLDER_BODY = /\b(coming soon|lorem ipsum|to be continued|\[tbd\]|tbd\s*[.:])\b/i;
const OBJ_HEURISTIC =
  /\b(learning objectives?|what you need to know|by the end of this lesson|you will be able to)\b/i;

function minWordsForPathway(pathwayId: string): number {
  const p = getExamPathwayById(pathwayId);
  if (p?.examFamily === ExamFamily.NP) return 1200;
  return 800;
}

function sectionWordCount(body: unknown): number {
  if (typeof body !== "string") return 0;
  return body.trim().split(/\s+/).filter(Boolean).length;
}

function hasLearningObjectivesSignal(lesson: ReturnType<typeof normalizeLesson>): boolean {
  const blob = lesson.sections.map((s) => (typeof s.body === "string" ? s.body : "")).join("\n");
  if (OBJ_HEURISTIC.test(blob)) return true;
  const intro = lesson.sections.find((s) => s.kind === "introduction" || s.kind === "intro");
  if (!intro || typeof intro.body !== "string") return false;
  const lines = intro.body.split("\n").filter((l) => l.trim().length > 0);
  const bullets = lines.filter((l) => /^[-*]\s+/.test(l.trim()) || /^\d+[.)]\s+/.test(l.trim()));
  return bullets.length >= 3;
}

function hasExamTipsSignal(lesson: ReturnType<typeof normalizeLesson>): boolean {
  return lesson.sections.some((s) => {
    if (s.kind === "exam_tips" || s.kind === "clinical_pearls" || s.kind === "exam_focus") {
      return sectionWordCount(s.body) >= 18;
    }
    return false;
  });
}

function hasRelatedSignal(lesson: ReturnType<typeof normalizeLesson>): boolean {
  if (lesson.relatedLessonRefs && lesson.relatedLessonRefs.length > 0) return true;
  const blob = lesson.sections.map((s) => (typeof s.body === "string" ? s.body : "")).join("\n");
  if (/\]\(\s*LESSON:/i.test(blob)) return true;
  return lesson.sections.some(
    (s) => s.kind === "related_next_steps" && sectionWordCount(s.body) >= 20,
  );
}

function auditLesson(pathwayId: string, lesson: ReturnType<typeof normalizeLesson>): string[] {
  const issues: string[] = [];
  const wc = pathwayLessonWordCount(lesson);
  const minW = minWordsForPathway(pathwayId);
  if (wc < minW) issues.push(`below_word_count(${wc}<${minW})`);

  if (!lesson.seoTitle?.trim()) issues.push("missing_seo_title");
  if (!lesson.seoDescription?.trim()) issues.push("missing_seo_description");

  const combined = lesson.sections.map((s) => (typeof s.body === "string" ? s.body : "")).join("\n\n");
  if (PLACEHOLDER_BODY.test(combined) || PLACEHOLDER_BODY.test(lesson.title ?? "")) {
    issues.push("placeholder_phrase");
  }

  if (!hasLearningObjectivesSignal(lesson)) issues.push("missing_learning_objectives_signal");
  if (!hasExamTipsSignal(lesson)) issues.push("missing_exam_tips_signal");
  if (!hasRelatedSignal(lesson)) issues.push("missing_related_learning_signal");

  for (const s of lesson.sections) {
    const body = typeof s.body === "string" ? s.body : "";
    const trimmed = body.trim();
    const hasFig = Boolean(s.figures?.some(hasRenderableLessonFigure));
    const badFig = s.figures?.some((f) => Boolean(f.url?.trim()) && !hasRenderableLessonFigure(f));
    if (badFig) issues.push(`section_${s.id}_non_renderable_figure_url`);
    const hasExam = Boolean(
      s.examFocus &&
        (s.examFocus.howTested?.trim() || s.examFocus.commonTraps?.trim() || s.examFocus.prioritizationCues?.trim()),
    );
    if (trimmed.length < 12 && !hasFig && !hasExam && s.kind !== "related_next_steps") {
      issues.push(`empty_section_${s.kind ?? "unknown"}`);
    }
  }

  return issues;
}

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const warnOnly = args.has("--warn-only");
  const pathwayFilter = [...args].find((a) => a.startsWith("--pathway="))?.slice("--pathway=".length);

  const rows: Row[] = [];
  let total = 0;
  let incomplete = 0;
  let belowWc = 0;
  let emptySections = 0;
  let badFigures = 0;
  let missingObj = 0;
  let missingExam = 0;
  let missingRelated = 0;

  const ids = listCatalogPathwayIdsWithLessonsSync().filter((id) => !pathwayFilter || id === pathwayFilter);

  for (const pathwayId of ids) {
    const rawLessons = getCatalogLessonsRaw(pathwayId);
    for (const raw of rawLessons) {
      const lesson = normalizeLesson(raw, pathwayId);
      if (!lesson.structuralQuality?.publicComplete) continue;
      total += 1;
      const issues = auditLesson(pathwayId, lesson);
      if (issues.length === 0) continue;
      incomplete += 1;
      if (issues.some((i) => i.startsWith("below_word_count"))) belowWc += 1;
      if (issues.some((i) => i.startsWith("empty_section_"))) emptySections += 1;
      if (issues.some((i) => i.endsWith("_non_renderable_figure_url"))) badFigures += 1;
      if (issues.includes("missing_learning_objectives_signal")) missingObj += 1;
      if (issues.includes("missing_exam_tips_signal")) missingExam += 1;
      if (issues.includes("missing_related_learning_signal")) missingRelated += 1;
      rows.push({ pathwayId, slug: lesson.slug, issues });
    }
  }

  rows.sort((a, b) => `${a.pathwayId}:${a.slug}`.localeCompare(`${b.pathwayId}:${b.slug}`));

  console.info(`[audit:lesson-completeness] pathways=${ids.length} lessons_normalized=${total}`);
  console.info(
    `[audit:lesson-completeness] incomplete=${incomplete} below_word_count=${belowWc} empty_sections=${emptySections} bad_figure_urls=${badFigures}`,
  );
  console.info(
    `[audit:lesson-completeness] missing_objectives_heuristic=${missingObj} missing_exam_tips_heuristic=${missingExam} missing_related_heuristic=${missingRelated}`,
  );

  const preview = rows.slice(0, 40);
  if (preview.length > 0) {
    console.info("[audit:lesson-completeness] first issues (max 40):");
    for (const r of preview) {
      console.info(`  ${r.pathwayId} :: ${r.slug} → ${r.issues.join(", ")}`);
    }
    if (rows.length > preview.length) {
      console.info(`  … ${rows.length - preview.length} more`);
    }
  }

  if (!warnOnly && incomplete > 0) {
    console.error(`[audit:lesson-completeness] FAIL incomplete_lessons=${incomplete} (use --warn-only to exit 0)`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
