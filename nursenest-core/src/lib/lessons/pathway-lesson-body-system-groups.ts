import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { mapTaxonomyLeafToNursingHubCategory } from "@/lib/lessons/lesson-taxonomy";
import { pathwayLessonYieldWeight } from "@/lib/lessons/pathway-lesson-yield";
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { buildLessonTaxonomyCorpus, classifyNursingContent, classifyStrings } from "@/lib/taxonomy/classifier";
import { allTaxonomyLeaves, REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { resolvePublicHubTitle } from "@/lib/public-display-copy";

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

function isNewGradPathwayId(pathwayId?: string | null): boolean {
  return pathwayId === "us-rn-new-grad-transition" || Boolean(pathwayId?.includes("new-grad"));
}

function classifyNewGradLessonForHub(lesson: PathwayLessonRecord): PathwayLessonSystemLabel {
  const topic = `${lesson.topic ?? ""} ${lesson.topicSlug ?? ""}`.toLowerCase();
  const title = `${lesson.title ?? ""} ${lesson.seoTitle ?? ""}`.toLowerCase();
  const body = `${lesson.seoDescription ?? ""} ${lesson.bodySystem ?? ""} ${lesson.system ?? ""}`.toLowerCase();
  const hay = `${topic} ${title} ${body}`;

  if (/\b(resume|cover letter|interview|application|applications|job offer|reference|hiring)\b/.test(hay)) {
    return "job_applications_interviews";
  }
  if (/\b(choose|choosing|unit fit|floor|specialty|med[\s-]?surg vs|hospital unit|which unit)\b/.test(hay)) {
    return "choosing_floor_unit";
  }
  if (/\b(orientation|preceptor|preceptorship|preceptee|feedback|first year|first-year|surviving)\b/.test(hay)) {
    return "orientation_preceptorship";
  }

  if (/\b(emergency department|\bed\b|triage|resuscitation|trauma bay)\b/.test(hay)) return "emergency_department";
  if (/\b(icu|stepdown|critical care|ventilat|vasopressor|telemetry alarm|competing alarms)\b/.test(hay)) return "icu_stepdown";
  if (/\b(pediatric|child|children|adolescent|febrile infant)\b/.test(hay)) return "pediatrics";
  if (/\b(labou?r|delivery|fetal|fhr|contraction|intrapartum)\b/.test(hay)) return "labour_delivery";
  if (/\b(postpartum|newborn|breastfeed|maternal)\b/.test(hay)) return "postpartum";
  if (/\b(mental health|psychiatric|suicide|behavioral|de-?escalat|confrontational|aggressive)\b/.test(hay)) return "mental_health";
  if (/\b(long[-\s]?term care|\bltc\b|resident|nursing home)\b/.test(hay)) return "long_term_care";
  if (/\b(community|home health|public health|clinic|follow-up)\b/.test(hay)) return "community_health";
  if (/\b(operating room|pacu|perioperative|post-?op|postoperative|surgical)\b/.test(hay)) return "operating_room_pacu";
  if (/\b(oncology|chemo|neutropen|cancer)\b/.test(hay)) return "oncology";
  if (/\b(cardiology|cardiac|heart failure|chest pain|telemetry|rhythm|stemi|acs)\b/.test(hay)) return "cardiology";
  if (/\b(nephrology|dialysis|renal|kidney|electrolyte|fluid balance)\b/.test(hay)) return "nephrology_dialysis";
  if (/\b(neurology|neuro|stroke|seizure|mental status|confusion)\b/.test(hay)) return "neurology";

  if (/\b(chart\w*|document\w*|assessment\w*|handoff|report|receiving report|shift report)\b/.test(hay)) {
    return "assessments_documentation";
  }
  if (/\b(delegat\w*|cna|pct|aide|unlicensed|charge nurse|assignment|priorit\w*|acuity|patient load|task batching|time management|rounding)\b/.test(hay)) {
    return "prioritization_delegation";
  }
  if (/\b(communication|communicat\w*|sbar|physician|provider|family|families|huddle|speaking up|asking for help|clinical concern|difficult conversation)\b/.test(hay)) {
    return "communication_providers_families";
  }
  if (/\b(safety|emergency|rapid response|decline|deteriorat\w*|unstable|alarm\w*|escalat\w*|abcs?|short-staffed)\b/.test(hay)) {
    return "safety_emergencies_escalation";
  }

  return "medical_surgical_nursing";
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
  if (isNewGradPathwayId(pathwayId)) {
    return classifyNewGradLessonForHub(lesson);
  }
  const known = knownHubCategoryIds(pathwayId);
  const tryLabel = (raw: string | null | undefined): PathwayLessonSystemLabel | null => {
    const t = raw?.trim();
    if (!t) return null;
    const directHubCategory = t.toLowerCase().replace(/[\s/-]+/g, "_");
    if (directHubCategory !== REVIEW_REQUIRED.toLowerCase() && known.has(directHubCategory)) {
      return directHubCategory;
    }
    const mapped = normalizePathwayLessonSystemLabel(t);
    const hubCategory = mapTaxonomyLeafToNursingHubCategory(mapped, lesson, pathwayId);
    if (hubCategory !== REVIEW_REQUIRED && known.has(hubCategory)) return hubCategory;
    return null;
  };
  const fromBody = tryLabel(lesson.bodySystem);
  if (fromBody) return fromBody;
  const fromSystem = tryLabel(lesson.system);
  if (fromSystem) return fromSystem;
  const titleOnly = classifyStrings({ title: lesson.title, placementStrictUnique: true });
  const titleHubCategory = mapTaxonomyLeafToNursingHubCategory(titleOnly.category, lesson, pathwayId);
  if (titleHubCategory !== REVIEW_REQUIRED && known.has(titleHubCategory)) {
    return titleHubCategory as PathwayLessonSystemLabel;
  }
  const strict = classifyStrings({
    title: lesson.title,
    content: buildLessonTaxonomyCorpus(lesson),
    placementStrictUnique: true,
  });
  const strictHubCategory = mapTaxonomyLeafToNursingHubCategory(strict.category, lesson, pathwayId);
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
          label: resolvePublicHubTitle({ curatedTitle: category.title, slug: category.id }),
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
          label: resolvePublicHubTitle({
            curatedTitle: `${category.title} - ${sub.title}`,
            slug: sub.id,
          }),
          systemLabel: sub.id,
          description: category.description ?? "",
          lessons: sorted,
          count: sorted.length,
        },
      ];
    });
  });
}
