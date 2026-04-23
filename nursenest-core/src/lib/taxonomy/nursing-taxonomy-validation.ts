import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildPathwayLessonTaxonomyCorpus,
  classifyPathwayLessonRecordForHub,
  contentSignalsClinicalDomain,
  type NursingTaxonomyClassification,
} from "@/lib/taxonomy/nursing-taxonomy-classifier";

const PROFESSIONAL_HUB = "professional-practice-ethics" as const;

const CLINICAL_CATEGORY_IDS = new Set<string>([
  "cardiovascular",
  "respiratory",
  "neurology",
  "endocrine",
  "renal-genitourinary",
  "gastrointestinal",
  "hematology-oncology",
  "immune-infectious",
  "musculoskeletal",
  "dermatology",
  "mental-health",
  "pharmacology",
  "reproductive-ob-gyn",
  "pediatrics",
  "fundamentals",
  "taxonomy-review-required",
]);

export function isClinicalHubCategoryId(id: string): boolean {
  return CLINICAL_CATEGORY_IDS.has(id);
}

export function validateNursingTaxonomyClassification(
  c: NursingTaxonomyClassification,
): { ok: true } | { ok: false; code: string; message: string } {
  if (c.domain === "clinical" && c.categoryId === PROFESSIONAL_HUB) {
    return {
      ok: false,
      code: "clinical_domain_professional_category",
      message: "Clinical domain cannot map to professional practice hub.",
    };
  }
  if (c.domain === "professional" && c.categoryId !== PROFESSIONAL_HUB) {
    return {
      ok: false,
      code: "professional_domain_non_professional_category",
      message: "Professional domain must use the professional practice hub category.",
    };
  }
  return { ok: true };
}

export type PathwayLessonTaxonomyWriteInput = Pick<
  PathwayLessonRecord,
  "title" | "topic" | "topicSlug" | "bodySystem" | "seoDescription" | "system" | "sections"
>;

/**
 * Validates a pathway lesson payload before DB insert/update.
 * Returns structured violations for API 422 responses.
 */
export function validatePathwayLessonTaxonomyBeforeWrite(
  row: PathwayLessonTaxonomyWriteInput,
): { ok: true; classification: NursingTaxonomyClassification } | { ok: false; violations: string[]; classification: NursingTaxonomyClassification } {
  const classification = classifyPathwayLessonRecordForHub(row);
  const structural = validateNursingTaxonomyClassification(classification);
  const violations: string[] = [];
  if (!structural.ok) {
    violations.push(`${structural.code}: ${structural.message}`);
  }
  if (!(row.bodySystem ?? "").trim()) {
    violations.push("body_system_required");
  }
  if (violations.length > 0) {
    safeServerLog("taxonomy", "pathway_lesson_write_validation_failed", {
      event: "pathway_lesson_write_validation_failed",
      title: row.title.slice(0, 200),
      body_system: (row.bodySystem ?? "").slice(0, 120),
      rule_hint: classification.ruleHint,
      domain: classification.domain,
      category_id: classification.categoryId,
      violations: violations.join("|").slice(0, 500),
    });
    return { ok: false, violations, classification };
  }
  return { ok: true, classification };
}

/**
 * Server hub guardrail: authoring surfaces “professional” while the lesson corpus clearly contains
 * clinical disease / physiology signals — hide the row and log (stale mis-tagged inventory).
 */
export function shouldSuppressProfessionalPracticeHubLesson(lesson: PathwayLessonRecord): boolean {
  const corpus = buildPathwayLessonTaxonomyCorpus(lesson);
  const hubId = classifyPathwayLessonRecordForHub(lesson).categoryId;
  if (hubId !== PROFESSIONAL_HUB) return false;
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
