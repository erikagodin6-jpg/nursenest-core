import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonYieldWeight } from "@/lib/lessons/pathway-lesson-yield";
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { buildLessonTaxonomyCorpus, classifyNursingContent, classifyStrings } from "@/lib/taxonomy/classifier";
import { allTaxonomyLeaves, REVIEW_REQUIRED, TAXONOMY } from "@/lib/taxonomy/taxonomy";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Exact taxonomy leaf ids (and space/kebab variants) resolve before substring keyword scoring — avoids false hits (e.g. "neurological" contains "intestinal"). */
const TAXONOMY_LEAF_ID_SET = new Set<string>(allTaxonomyLeaves());

function resolveTaxonomyLeafFromSystemString(normalizedLower: string): string | null {
  if (TAXONOMY_LEAF_ID_SET.has(normalizedLower)) return normalizedLower;
  const underscored = normalizedLower.replace(/[\s/-]+/g, "_");
  if (TAXONOMY_LEAF_ID_SET.has(underscored)) return underscored;
  return null;
}

function knownHubCategoryIds(pathwayId?: string | null): Set<string> {
  const cfg = learningConfigForPathwayId(pathwayId ?? null);
  const ids = new Set<string>();
  for (const c of cfg.categories) {
    ids.add(c.id);
    for (const s of c.subcategories ?? []) ids.add(s.id);
  }
  return ids;
}

const PHARMACOLOGY_LEAVES = new Set<string>(TAXONOMY.PHARMACOLOGY);
const PROFESSIONAL_LEAVES = new Set<string>(TAXONOMY.PROFESSIONAL_PRACTICE);
const EXAM_META_LEAVES = new Set<string>(TAXONOMY.EXAM_META);

function isNpPathway(pathwayId?: string | null): boolean {
  return Boolean(pathwayId && (pathwayId.includes("-np-") || pathwayId === "ca-np-cnple"));
}

function textHasAny(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function hubClassificationCorpus(lesson: PathwayLessonRecord): string {
  return `${lesson.title ?? ""} ${lesson.topic ?? ""} ${lesson.topicSlug ?? ""} ${lesson.bodySystem ?? ""} ${
    lesson.system ?? ""
  } ${lesson.seoDescription ?? ""}`.toLowerCase();
}

const MENTAL_HEALTH_PATTERNS = [
  /\bpsychiat/,
  /\bmental health\b/,
  /\bdepression\b/,
  /\banxiety\b/,
  /\bsuicid/,
  /\bbipolar\b/,
  /\bschizo/,
  /\bptsd\b/,
  /\bbehavioral health\b/,
] as const;

const NP_ASSESSMENT_PATTERNS = [/\bassessment\b/, /\bphysical exam\b/, /\bhistory\b/, /\brisk assessment\b/] as const;
const NP_DIAGNOSTIC_PATTERNS = [
  /\bdifferential\b/,
  /\bdiagnos/,
  /\bdiagnostic/,
  /\bclinical reasoning\b/,
  /\babg\b/,
  /\bacid[- ]base\b/,
  /\binterpretation\b/,
] as const;
const NP_PRESCRIBING_PATTERNS = [/\bprescrib/, /\bmedication\b/, /\bmedications\b/, /\bpharmac/, /\bdrug\b/] as const;
const NP_CHRONIC_PATTERNS = [
  /\bchronic\b/,
  /\bdiabetes\b/,
  /\bhypertension\b/,
  /\bheart failure\b/,
  /\bckd\b/,
  /\bcopd\b/,
  /\blongitudinal\b/,
] as const;
const NP_ACUTE_PATTERNS = [
  /\bacute\b/,
  /\burgent\b/,
  /\bepisodic\b/,
  /\bunstable\b/,
  /\bshock\b/,
  /\brapid response\b/,
  /\bfirst-day admissions\b/,
  /\boverflow unit\b/,
] as const;
const NP_OLDER_ADULT_PATTERNS = [/\bolder adult/, /\bgeriatric/, /\bfrailty\b/, /\bpolypharmacy\b/] as const;

function mapTaxonomyLeafToRnPnHubCategory(leaf: string, corpus: string): string {
  if (leaf === REVIEW_REQUIRED) return REVIEW_REQUIRED;
  if (leaf === "renal_genitourinary") return "renal_urinary";
  if (leaf === "reproductive_obstetrics") return "reproductive_maternal_newborn";
  if (leaf === "neurological" && textHasAny(corpus, MENTAL_HEALTH_PATTERNS)) return "mental_health";
  if (leaf === "patient_safety_quality") return "fundamentals_safety";
  if (PHARMACOLOGY_LEAVES.has(leaf)) return "pharmacology";
  if (PROFESSIONAL_LEAVES.has(leaf)) return "professional_practice";
  if (EXAM_META_LEAVES.has(leaf)) return "exam_strategy";
  switch (leaf) {
    case "cardiovascular":
    case "respiratory":
    case "neurological":
    case "gastrointestinal":
    case "endocrine":
    case "pediatrics":
      return leaf;
    case "immune_infectious":
    case "hematology_oncology":
    case "musculoskeletal":
    case "integumentary":
      return "fundamentals_safety";
    default:
      return REVIEW_REQUIRED;
  }
}

function mapTaxonomyLeafToNpHubCategory(leaf: string, corpus: string): string {
  if (leaf === REVIEW_REQUIRED) return REVIEW_REQUIRED;
  if (textHasAny(corpus, MENTAL_HEALTH_PATTERNS)) return "mental_health";
  if (textHasAny(corpus, NP_OLDER_ADULT_PATTERNS)) return "older_adults";
  if (leaf === "pediatrics") return "pediatrics";
  if (leaf === "reproductive_obstetrics") return "womens_health";
  if (PHARMACOLOGY_LEAVES.has(leaf) || textHasAny(corpus, NP_PRESCRIBING_PATTERNS)) return "pharmacology_prescribing";
  if (PROFESSIONAL_LEAVES.has(leaf)) return "professional_practice";
  if (EXAM_META_LEAVES.has(leaf)) return "exam_strategy";
  if (textHasAny(corpus, NP_ASSESSMENT_PATTERNS)) return "health_assessment";
  if (textHasAny(corpus, NP_DIAGNOSTIC_PATTERNS)) return "diagnostics_clinical_reasoning";
  if (textHasAny(corpus, NP_ACUTE_PATTERNS)) return "acute_episodic_care";
  if (textHasAny(corpus, NP_CHRONIC_PATTERNS)) return "chronic_disease_management";
  if (TAXONOMY.CLINICAL.includes(leaf as (typeof TAXONOMY.CLINICAL)[number])) return "primary_care";
  return REVIEW_REQUIRED;
}

function mapTaxonomyLeafToHubCategory(leaf: string, lesson: PathwayLessonRecord, pathwayId?: string | null): string {
  const corpus = hubClassificationCorpus(lesson);
  return isNpPathway(pathwayId)
    ? mapTaxonomyLeafToNpHubCategory(leaf, corpus)
    : mapTaxonomyLeafToRnPnHubCategory(leaf, corpus);
}

export type PathwayLessonSystemLabel = string;
export const PATHWAY_LESSON_SYSTEM_ORDER: string[] = (() => {
  const categories = learningConfigForPathwayId(null).categories;
  return categories.flatMap((category) =>
    category.subcategories?.length ? category.subcategories.map((sub) => sub.id) : [category.id],
  );
})();

export const PATHWAY_LESSON_SYSTEM_DESCRIPTIONS: Record<string, string> = (() => {
  const categories = learningConfigForPathwayId(null).categories;
  return categories.reduce<Record<string, string>>((acc, category) => {
    if (category.subcategories?.length) {
      for (const sub of category.subcategories) {
        acc[sub.id] = category.description ?? "";
      }
      return acc;
    }
    acc[category.id] = category.description ?? "";
    return acc;
  }, {});
})();

export type PathwayLessonSystemSection = {
  id: string;
  label: string;
  systemLabel: PathwayLessonSystemLabel;
  description: string;
  lessons: PathwayLessonRecord[];
  count: number;
};

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

/**
 * Maps a single string (system or bodySystem field value) into the shared pathway structure.
 */
export function normalizePathwayLessonSystemLabel(
  system: string | null | undefined,
): PathwayLessonSystemLabel {
  const normalizedSystem = normalizeText(system);
  if (!normalizedSystem) return REVIEW_REQUIRED;
  const direct = resolveTaxonomyLeafFromSystemString(normalizedSystem);
  if (direct) return direct as PathwayLessonSystemLabel;
  const classified = classifyNursingContent({ title: normalizedSystem });
  return classified.categoryId as PathwayLessonSystemLabel;
}

/**
 * Numeric sort score for a lesson — higher = shown first within a system section.
 * Uses `examRelevance` when present; falls back to alphabetical tiebreak in callers.
 */
function lessonPriorityScore(lesson: PathwayLessonRecord): number {
  const yieldWeight = pathwayLessonYieldWeight(lesson.activeExamMeta?.yieldLevel);
  if (yieldWeight < 4) return 100 - yieldWeight;
  switch (lesson.examRelevance) {
    case "high_yield": return 3;
    case "core": return 2;
    case "specialty": return 1;
    default: return 2;
  }
}

/**
 * Full lesson-level classifier: when `bodySystem` / `system` map cleanly into a **known** hub bucket,
 * prefer that for clinical grouping; otherwise fall back to full-record keyword classification.
 * Reduces “review required” noise when editorial `bodySystem` is already aligned to the fixed grid.
 */
export function classifyLessonForHub(
  lesson: PathwayLessonRecord,
  pathwayId?: string | null,
): PathwayLessonSystemLabel {
  const known = knownHubCategoryIds(pathwayId);
  const tryLabel = (raw: string | null | undefined): PathwayLessonSystemLabel | null => {
    const t = raw?.trim();
    if (!t) return null;
    const directHubCategory = t.toLowerCase().replace(/[\s/-]+/g, "_");
    if (directHubCategory !== REVIEW_REQUIRED.toLowerCase() && known.has(directHubCategory)) {
      return directHubCategory;
    }
    const mapped = normalizePathwayLessonSystemLabel(t);
    const hubCategory = mapTaxonomyLeafToHubCategory(mapped, lesson, pathwayId);
    if (hubCategory !== REVIEW_REQUIRED && known.has(hubCategory)) return hubCategory;
    return null;
  };
  const fromBody = tryLabel(lesson.bodySystem);
  if (fromBody) return fromBody;
  const fromSystem = tryLabel(lesson.system);
  if (fromSystem) return fromSystem;
  const titleOnly = classifyStrings({ title: lesson.title, placementStrictUnique: true });
  const titleHubCategory = mapTaxonomyLeafToHubCategory(titleOnly.category, lesson, pathwayId);
  if (titleHubCategory !== REVIEW_REQUIRED && known.has(titleHubCategory)) {
    return titleHubCategory as PathwayLessonSystemLabel;
  }
  const strict = classifyStrings({
    title: lesson.title,
    content: buildLessonTaxonomyCorpus(lesson),
    placementStrictUnique: true,
  });
  const strictHubCategory = mapTaxonomyLeafToHubCategory(strict.category, lesson, pathwayId);
  if (strictHubCategory !== REVIEW_REQUIRED && known.has(strictHubCategory)) {
    return strictHubCategory as PathwayLessonSystemLabel;
  }
  return REVIEW_REQUIRED;
}

export function buildPathwayLessonSystemSections(
  lessons: PathwayLessonRecord[],
  pathwayId?: string | null,
): PathwayLessonSystemSection[] {
  const grouped = new Map<string, PathwayLessonRecord[]>();
  const config = learningConfigForPathwayId(pathwayId ?? null);
  const configIds = new Set<string>();
  for (const c of config.categories) {
    configIds.add(c.id);
    for (const s of c.subcategories ?? []) configIds.add(s.id);
  }

  for (const lesson of lessons) {
    const label = classifyLessonForHub(lesson, pathwayId);
    const bucket = grouped.get(label) ?? [];
    bucket.push(lesson);
    grouped.set(label, bucket);
  }

  const orphanKeys = [...grouped.keys()].filter((k) => !configIds.has(k));
  if (orphanKeys.length > 0) {
    const counts = Object.fromEntries(orphanKeys.map((k) => [k, grouped.get(k)?.length ?? 0]));
    safeServerLog("pathway_lessons", "hub_curriculum_orphan_taxonomy_buckets", {
      pathway_id: pathwayId ?? "",
      orphan_bucket_count: String(orphanKeys.length),
      orphan_bucket_counts_json: JSON.stringify(counts),
    });
    const reviewBucket = grouped.get(REVIEW_REQUIRED) ?? [];
    const mergedReview = [...reviewBucket];
    for (const k of orphanKeys) {
      mergedReview.push(...(grouped.get(k) ?? []));
    }
    grouped.set(REVIEW_REQUIRED, mergedReview);
    for (const k of orphanKeys) {
      if (k !== REVIEW_REQUIRED) grouped.delete(k);
    }
  }

  return config.categories.flatMap((category) => {
    if (!category.subcategories?.length) {
      const sectionLessons = grouped.get(category.id);
      if (!sectionLessons?.length) return [];
      const sorted = [...sectionLessons].sort((a, b) => {
        const scoreDiff = lessonPriorityScore(b) - lessonPriorityScore(a);
        if (scoreDiff !== 0) return scoreDiff;
        return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      });
      return [
        {
          id: category.id,
          label: category.title,
          systemLabel: category.id,
          description: category.description ?? "",
          lessons: sorted,
          count: sorted.length,
        },
      ];
    }
    return category.subcategories.flatMap((sub) => {
      const sectionLessons = grouped.get(sub.id);
      if (!sectionLessons?.length) return [];
      const sorted = [...sectionLessons].sort((a, b) => {
        const scoreDiff = lessonPriorityScore(b) - lessonPriorityScore(a);
        if (scoreDiff !== 0) return scoreDiff;
        return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      });
      return [
        {
          id: `${category.id}:${sub.id}`,
          label: `${category.title} - ${sub.title}`,
          systemLabel: sub.id,
          description: category.description ?? "",
          lessons: sorted,
          count: sorted.length,
        },
      ];
    });
  });
}
