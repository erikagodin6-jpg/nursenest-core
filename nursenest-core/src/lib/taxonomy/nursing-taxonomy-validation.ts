import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildPathwayLessonTaxonomyCorpus,
  classifyPathwayLessonRecord,
  classifyPathwayLessonRecordForHub,
  contentSignalsClinicalDomain,
  type ClassificationResult,
} from "@/lib/taxonomy/classifier";
import { validateClassification } from "@/lib/taxonomy/validate";
import { REVIEW_REQUIRED, TAXONOMY } from "@/lib/taxonomy/taxonomy";

const PROFESSIONAL_CATEGORY_IDS = new Set<string>(TAXONOMY.PROFESSIONAL_PRACTICE);

const NON_PROFESSIONAL_HUB_IDS = new Set<string>([
  ...TAXONOMY.CLINICAL,
  ...TAXONOMY.PHARMACOLOGY,
  ...TAXONOMY.EXAM_META,
  REVIEW_REQUIRED,
]);

/** True when `id` is any hub bucket outside professional practice (clinical, pharm, exam meta, review). */
export function isClinicalHubCategoryId(id: string): boolean {
  return NON_PROFESSIONAL_HUB_IDS.has(id);
}

export type PathwayLessonTaxonomyWriteInput = Pick<
  PathwayLessonRecord,
  "title" | "topic" | "topicSlug" | "bodySystem" | "seoDescription" | "system" | "sections"
>;

/**
 * Validates a pathway lesson payload before DB insert/update.
 * On success, callers should persist `classification.category` as `bodySystem` when applying deterministic taxonomy.
 */
export function validatePathwayLessonTaxonomyBeforeWrite(
  row: PathwayLessonTaxonomyWriteInput,
): { ok: true; classification: ClassificationResult } | { ok: false; violations: string[]; classification: ClassificationResult } {
  const classification = classifyPathwayLessonRecord(row);
  const violations: string[] = [];
  try {
    validateClassification(classification);
  } catch (e) {
    violations.push(e instanceof Error ? e.message : String(e));
  }
  if (violations.length > 0) {
    safeServerLog("taxonomy", "pathway_lesson_write_validation_failed", {
      event: "pathway_lesson_write_validation_failed",
      title: row.title.slice(0, 200),
      body_system: (row.bodySystem ?? "").slice(0, 120),
      domain: classification.domain,
      category: classification.category,
      violations: violations.join("|").slice(0, 500),
    });
    return { ok: false, violations, classification };
  }
  return { ok: true, classification };
}

/**
 * Server hub guardrail: a lesson is bucketed under **professional practice** while the corpus still hits
 * **clinical** keyword evidence — hide the row and log (stale or mis-tagged inventory).
 */
export function shouldSuppressProfessionalPracticeHubLesson(lesson: PathwayLessonRecord): boolean {
  const corpus = buildPathwayLessonTaxonomyCorpus(lesson);
  const hubId = classifyPathwayLessonRecordForHub(lesson).categoryId;
  if (!PROFESSIONAL_CATEGORY_IDS.has(hubId)) return false;
  if (!contentSignalsClinicalDomain(corpus)) return false;
  safeServerLog("taxonomy", "professional_hub_clinical_corpus_guard", {
    event: "professional_hub_clinical_corpus_guard",
    slug: lesson.slug.slice(0, 160),
    title: lesson.title.slice(0, 200),
    body_system: (lesson.bodySystem ?? "").slice(0, 120),
  });
  return true;
}

export function filterLessonsForProfessionalPracticeHubGuard(lessons: PathwayLessonRecord[]): PathwayLessonRecord[] {
  return lessons.filter((l) => !shouldSuppressProfessionalPracticeHubLesson(l));
}
