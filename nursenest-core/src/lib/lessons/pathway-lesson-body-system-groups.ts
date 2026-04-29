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

function isAlliedPathwayId(pathwayId?: string | null): boolean {
  return pathwayId === "us-allied-core" || pathwayId === "ca-allied-core" || Boolean(pathwayId?.includes("allied"));
}

function classifyAlliedLessonForHub(lesson: PathwayLessonRecord): PathwayLessonSystemLabel {
  const topic = `${lesson.topic ?? ""} ${lesson.topicSlug ?? ""}`.toLowerCase();
  const title = `${lesson.title ?? ""} ${lesson.seoTitle ?? ""}`.toLowerCase();
  const body = `${lesson.seoDescription ?? ""} ${lesson.bodySystem ?? ""} ${lesson.system ?? ""}`.toLowerCase();
  const hay = `${topic} ${title} ${body}`;

  if (/\b(mri|magnetic resonance)\b/.test(hay)) return "mri-technologist";
  if (/\b(ct|computed tomography)\b/.test(hay)) return "ct-technologist";
  if (/\b(ultrasound|sonograph|sonography)\b/.test(hay)) return "sonography";
  if (/\b(nuclear medicine|radiopharm)\b/.test(hay)) return "nuclear-medicine";
  if (/\b(x-ray|xray|radiologic|imaging)\b/.test(hay)) return "radiologic-technology";

  if (/\b(perfusion|cardiopulmonary bypass)\b/.test(hay)) return "perfusionist";
  if (/\b(ecg|ekg|electrocardi)\b/.test(hay)) return "ecg-tech";
  if (/\b(cardiology|telemetry|rhythm)\b/.test(hay)) return "cardiology-tech";

  if (/\b(respiratory|airway|ventilat|gas exchange)\b/.test(hay)) return "respiratory-therapy";
  if (/\b(anesthesia|peri-anesthesia)\b/.test(hay)) return "anesthesia-assistant";
  if (/\b(surgical assistant|or tech|sterile field|operating room)\b/.test(hay)) return "surgical-assistant";
  if (/\b(orthopedic|cast|splint|traction)\b/.test(hay)) return "orthopedic-tech";
  if (/\b(dialysis)\b/.test(hay)) return "dialysis-tech";

  if (/\b(lab values|laboratory|specimen|quality control|hematology analyzer|chemistry analyzer)\b/.test(hay)) {
    return "mlt";
  }
  if (/\b(phlebotom|venipuncture|blood draw)\b/.test(hay)) return "phlebotomy";
  if (/\b(lab assistant|specimen handling|collection)\b/.test(hay)) return "mlt-assistant";

  if (/\b(pharmacology|medication|dispens|dose|high-alert)\b/.test(hay)) return "pharmacy-tech";
  if (/\b(pharmacist|med reconciliation|verification)\b/.test(hay)) return "pharmacist";

  if (/\b(diet|nutrition|malnutrition|tube feed)\b/.test(hay)) return "dietitian";
  if (/\b(social work|discharge planning|community resources|psychosocial|patient communication|teamwork|ethics|documentation)\b/.test(hay)) {
    return "social-work";
  }
  if (/\b(paramedic|prehospital|emergency response|triage|scene safety|vital signs|patient assessment)\b/.test(hay)) {
    return "paramedic";
  }
  if (/\b(mental health therapist|counselor|counselling|counseling|therapy session|behavioral health)\b/.test(hay)) {
    return "mental-health-therapist";
  }
  if (/\b(audiolog|hearing|audiometry)\b/.test(hay)) return "audiology";

  if (/\b(speech|swallow|aphasia|dysphagia|language)\b/.test(hay)) return "speech-language-pathology";
  if (/\b(occupational therapy|adl|activity analysis|adaptive equipment)\b/.test(hay)) return "occupational-therapy";
  if (/\b(physiotherap|physical therapy|gait|mobility|range of motion|anatomy|physiology|rehab)\b/.test(hay)) {
    return "physiotherapy";
  }
  if (/\b(recreation therap|therapeutic recreation|leisure)\b/.test(hay)) return "recreation-therapy";

  return REVIEW_REQUIRED;
}

function classifyNewGradLessonForHub(lesson: PathwayLessonRecord): PathwayLessonSystemLabel {
  const topic = `${lesson.topic ?? ""} ${lesson.topicSlug ?? ""}`.toLowerCase();
  const title = `${lesson.title ?? ""} ${lesson.seoTitle ?? ""}`.toLowerCase();
  const body = `${lesson.seoDescription ?? ""} ${lesson.bodySystem ?? ""} ${lesson.system ?? ""}`.toLowerCase();
  const hay = `${topic} ${title} ${body}`;

  if (/\b(cover letter|cover letters|resume|resumes|cv)\b/.test(hay)) {
    return "resumes-cover-letters";
  }
  if (/\b(interview|interviews|hiring manager|behavioral question|mock interview)\b/.test(hay)) {
    return "interviews";
  }
  if (/\b(application|applications|job offer|reference|hiring|job search)\b/.test(hay)) {
    return "job-applications";
  }
  if (/\b(choose|choosing|unit fit|floor|specialty|med[\s-]?surg vs|hospital unit|which unit)\b/.test(hay)) {
    return "choosing-a-floor";
  }
  if (/\b(orientation|preceptor|preceptorship|preceptee|feedback|first year|first-year|surviving)\b/.test(hay)) {
    return "orientation-preceptorship";
  }

  if (/\b(cardiac icu|cvicu|cicu|post[-\s]?cath icu)\b/.test(hay)) return "cardiac-icu";
  if (/\b(neuro icu|neuroicu|neurological icu)\b/.test(hay)) return "neuro-icu";
  if (/\b(pediatric icu|picu)\b/.test(hay)) return "pediatric-icu";
  if (/\b(neonatal icu|nicu)\b/.test(hay)) return "nicu";
  if (/\b(stepdown|progressive care|pcu|telemetry alarm|competing alarms)\b/.test(hay)) return "stepdown";
  if (/\b(emergency department|\bed\b|triage|resuscitation|trauma bay|trauma)\b/.test(hay)) return "emergency-trauma";
  if (/\b(icu|critical care|ventilat|vasopressor)\b/.test(hay)) return "icu";
  if (/\b(pediatric|child|children|adolescent|febrile infant)\b/.test(hay)) return "pediatrics";
  if (/\b(labou?r|delivery|fetal|fhr|contraction|intrapartum)\b/.test(hay)) return "labour-delivery";
  if (/\b(postpartum|newborn|breastfeed|maternal)\b/.test(hay)) return "postpartum";
  if (/\b(mental health|psychiatric|suicide|behavioral|de-?escalat|confrontational|aggressive)\b/.test(hay)) return "mental-health";
  if (/\b(long[-\s]?term care|\bltc\b|resident|nursing home)\b/.test(hay)) return "ltc";
  if (/\b(public health)\b/.test(hay)) return "public-health";
  if (/\b(home health|home care)\b/.test(hay)) return "home-care";
  if (/\b(clinic|outpatient|ambulatory)\b/.test(hay)) return "clinic";
  if (/\b(community|follow-up)\b/.test(hay)) return "community";
  if (/\b(palliative|hospice|comfort care|end-of-life)\b/.test(hay)) return "palliative-care";
  if (/\b(rehab|rehabilitation|snf rehab)\b/.test(hay)) return "rehab";
  if (/\b(operating room|perioperative)\b/.test(hay)) return "or";
  if (/\b(pacu|post-?anesthesia|post-?op|postoperative)\b/.test(hay)) return "pacu";
  if (/\b(general surgery|surgical floor|surgery service)\b/.test(hay)) return "surgery";
  if (/\b(oncology|chemo|neutropen|cancer|hematology|hem[-\s]?onc)\b/.test(hay)) return "hem-onc";
  if (/\b(cardiology|cardiac|heart failure|chest pain|telemetry|rhythm|stemi|acs)\b/.test(hay)) return "cardiology";
  if (/\b(dialysis)\b/.test(hay)) return "dialysis";
  if (/\b(nephrology|renal|kidney|electrolyte|fluid balance)\b/.test(hay)) return "renal";

  if (/\b(chart\w*|document\w*|assessment\w*|handoff|report|receiving report|shift report)\b/.test(hay)) {
    return "assessments-documentation";
  }
  if (/\b(delegat\w*|cna|pct|aide|unlicensed|charge nurse|assignment|priorit\w*|acuity|patient load|task batching|time management|rounding)\b/.test(hay)) {
    return "prioritization-delegation";
  }
  if (/\b(communication|communicat\w*|sbar|physician|provider|family|families|huddle|speaking up|asking for help|clinical concern|difficult conversation|rapid response|deteriorat\w*|unstable|alarm\w*|escalat\w*|abcs?|short-staffed)\b/.test(hay)) {
    return "communication-escalation";
  }

  return "med-surg";
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
  if (isAlliedPathwayId(pathwayId)) {
    return classifyAlliedLessonForHub(lesson);
  }
  const known = knownHubCategoryIds(pathwayId);
  const tryLabel = (raw: string | null | undefined): PathwayLessonSystemLabel | null => {
    const t = raw?.trim();
    if (!t) return null;
    const lowered = t.toLowerCase();
    const candidateIds = [
      lowered,
      lowered.replace(/[\s/_]+/g, "-"),
      lowered.replace(/[\s/-]+/g, "_"),
    ];
    for (const candidate of candidateIds) {
      if (candidate !== REVIEW_REQUIRED.toLowerCase() && known.has(candidate)) {
        return candidate;
      }
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
