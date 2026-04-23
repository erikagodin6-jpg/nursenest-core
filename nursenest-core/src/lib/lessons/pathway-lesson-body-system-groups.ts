import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonYieldWeight } from "@/lib/lessons/pathway-lesson-yield";
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { classifyNursingContent, classifyPathwayLessonRecordForHub } from "@/lib/taxonomy/classifier";
import { allTaxonomyLeaves, REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

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
    const mapped = normalizePathwayLessonSystemLabel(t);
    if (mapped !== REVIEW_REQUIRED && known.has(mapped)) return mapped;
    return null;
  };
  const fromBody = tryLabel(lesson.bodySystem);
  if (fromBody) return fromBody;
  const fromSystem = tryLabel(lesson.system);
  if (fromSystem) return fromSystem;
  return classifyPathwayLessonRecordForHub(lesson).categoryId as PathwayLessonSystemLabel;
}

export function buildPathwayLessonSystemSections(
  lessons: PathwayLessonRecord[],
  pathwayId?: string | null,
): PathwayLessonSystemSection[] {
  const grouped = new Map<string, PathwayLessonRecord[]>();
  const config = learningConfigForPathwayId(pathwayId ?? null);

  for (const lesson of lessons) {
    const label = classifyLessonForHub(lesson, pathwayId);
    const bucket = grouped.get(label) ?? [];
    bucket.push(lesson);
    grouped.set(label, bucket);
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
