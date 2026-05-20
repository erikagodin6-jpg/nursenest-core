/**
 * RN NCLEX catalog lesson → `exam_questions` OR-clause hints (bounded, no extra round-trips).
 * Used by {@link loadRelatedExamQuestionStemsForPathwayLesson} to align lesson detail “related questions”
 * with bank metadata (`topic`, `subtopic`, `tags`, `bodySystem`) using existing vocabulary — not new DB writes.
 *
 * Matching priority (merged in {@link ../lesson-question-cross-links}): explicit bridge → topic/slug/tag
 * alignment → optional body system → title/slug token `contains` only when no explicit bridge exists.
 */
import type { Prisma } from "@prisma/client";

const RN_NCLEX_PATHWAY_IDS = new Set(["us-rn-nclex-rn", "ca-rn-nclex-rn"]);

/** Hard cap so a single findMany stays predictable (merged with title/slug token ORs). */
export const RN_NCLEX_BRIDGE_MAX_CLAUSES = 10;

type Clause = Prisma.ExamQuestionWhereInput;

function icContains(value: string): Clause {
  return { topic: { contains: value, mode: "insensitive" } };
}

function subContains(value: string): Clause {
  return { subtopic: { contains: value, mode: "insensitive" } };
}

function bodyContains(value: string): Clause {
  return { bodySystem: { contains: value, mode: "insensitive" } };
}

/** Prefer structured `tags` array hits when the bank uses the same tokens as topic slugs / labels. */
function tagHas(value: string): Clause {
  return { tags: { has: value } };
}

/**
 * High-signal bridges for major conditions (prioritized editorial list + common NCLEX-RN slugs).
 * Values mirror typical `topic` / `tags` / `body_system` strings in the bank; prefer short `contains` terms.
 * Avoid ultra-generic terms (e.g. “infection”, “pregnancy”) that widen OR matches unnecessarily.
 */
const EXPLICIT_SLUG_BRIDGES: Record<string, Clause[]> = {
  "myocardial-infarction-nclex-rn": [
    tagHas("myocardial-infarction"),
    tagHas("acute-coronary-syndrome"),
    icContains("myocardial"),
    icContains("STEMI"),
    icContains("NSTEMI"),
    bodyContains("Cardio"),
  ],
  "heart-failure-nclex-rn": [
    tagHas("heart-failure"),
    icContains("heart failure"),
    icContains("CHF"),
    bodyContains("Cardio"),
  ],
  "copd-nclex-rn": [tagHas("copd"), icContains("COPD"), icContains("emphysema"), icContains("chronic bronchitis"), bodyContains("Respiratory")],
  "pulmonary-embolism-nclex-rn": [
    tagHas("pulmonary-embolism"),
    tagHas("venous-thromboembolism"),
    icContains("pulmonary embol"),
    icContains("DVT"),
    bodyContains("Respiratory"),
  ],
  "sepsis-nclex-rn": [tagHas("sepsis"), icContains("sepsis"), icContains("septic"), subContains("sepsis")],
  "diabetic-ketoacidosis-nclex-rn": [tagHas("dka"), icContains("DKA"), icContains("ketoacidosis"), bodyContains("Endocrine")],
  /** Canonical map title merged pree/eclampsia; keep legacy key for older slug references. */
  "eclampsia-nclex-rn": [
    tagHas("eclampsia"),
    tagHas("preeclampsia"),
    icContains("eclampsia"),
    icContains("preeclampsia"),
    icContains("magnesium sulfate"),
  ],
  "preeclampsia-and-eclampsia-nclex-rn": [
    tagHas("eclampsia"),
    tagHas("preeclampsia"),
    icContains("eclampsia"),
    icContains("preeclampsia"),
    icContains("magnesium sulfate"),
  ],
  "hellp-syndrome-nclex-rn": [tagHas("hellp"), icContains("HELLP"), icContains("hemolysis"), icContains("elevated liver")],
  "kawasaki-disease-nclex-rn": [tagHas("kawasaki"), icContains("Kawasaki"), icContains("coronary aneurysm")],
  "bronchiolitis-and-rsv-nclex-rn": [tagHas("rsv"), icContains("RSV"), icContains("bronchiolitis"), bodyContains("Respiratory")],
  "appendicitis-nclex-rn": [tagHas("appendicitis"), icContains("appendicitis"), icContains("McBurney"), bodyContains("Gastro")],
  "cholecystitis-nclex-rn": [tagHas("cholecystitis"), icContains("cholecystitis"), icContains("gallbladder"), bodyContains("Gastro")],
  "bowel-obstruction-mechanical-and-functional-nclex-rn": [
    tagHas("bowel-obstruction"),
    icContains("bowel obstruction"),
    icContains("intestinal obstruction"),
    bodyContains("Gastro"),
  ],
  "increased-intracranial-pressure-nclex-rn": [
    tagHas("intracranial-pressure"),
    icContains("intracranial"),
    icContains("ICP"),
    bodyContains("Neuro"),
  ],
  "bacterial-meningitis-nclex-rn": [tagHas("meningitis"), icContains("meningitis"), icContains("CSF"), bodyContains("Neuro")],
  "nephrotic-syndrome-nclex-rn": [tagHas("nephrotic"), icContains("nephrotic"), icContains("proteinuria"), bodyContains("Renal")],
  "sickle-cell-disease-nclex-rn": [tagHas("sickle-cell"), icContains("sickle"), icContains("vaso-occlusive")],
  "acute-lymphoblastic-leukemia-nclex-rn": [
    tagHas("acute-lymphoblastic-leukemia"),
    icContains("lymphoblastic"),
    icContains("acute lymphoblastic"),
  ],
  "acute-myelogenous-leukemia-nclex-rn": [
    tagHas("acute-myeloid-leukemia"),
    icContains("myelogenous"),
    icContains("myeloid"),
    icContains("AML"),
  ],
};

/** Canonical slugs covered by {@link EXPLICIT_SLUG_BRIDGES} (deterministic, small). */
export const RN_NCLEX_PRIORITIZED_LESSON_SLUGS = Object.freeze(Object.keys(EXPLICIT_SLUG_BRIDGES)) as readonly string[];

function genericSlugPhraseBridge(lessonSlug: string): Clause[] {
  if (!lessonSlug.endsWith("-nclex-rn")) return [];
  const core = lessonSlug.slice(0, -"-nclex-rn".length).replace(/-/g, " ").trim();
  if (core.length < 5) return [];
  const words = core.split(/\s+/).filter((w) => w.length >= 3);
  const out: Clause[] = [];
  if (words.length >= 2) {
    out.push(icContains(`${words[0]} ${words[1]}`));
  }
  if (words.length >= 1 && words[0].length >= 5) {
    out.push(icContains(words[0]));
  }
  return out.slice(0, 3);
}

function dedupeClauses(clauses: Clause[]): Clause[] {
  const seen = new Set<string>();
  const out: Clause[] = [];
  for (const c of clauses) {
    const k = JSON.stringify(c);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
  }
  return out;
}

/**
 * True when this lesson uses the explicit prioritized bridge (not generic slug-phrase inference).
 * Used to skip broad title/slug token `contains` ORs for mapped RN catalog lessons.
 */
export function hasExplicitRnNclexLessonBridge(pathwayId: string, lessonSlug: string): boolean {
  if (!RN_NCLEX_PATHWAY_IDS.has(pathwayId)) return false;
  const slug = lessonSlug.trim();
  return Boolean(slug && EXPLICIT_SLUG_BRIDGES[slug]);
}

/**
 * Extra `OR` branches for pathway-scoped question lookup (merged into a single findMany).
 */
export function getRnNclexLessonQuestionBankBridgeClauses(pathwayId: string, lessonSlug: string): Clause[] {
  if (!RN_NCLEX_PATHWAY_IDS.has(pathwayId)) return [];
  const slug = lessonSlug.trim();
  if (!slug) return [];

  const explicit = EXPLICIT_SLUG_BRIDGES[slug];
  const generic = genericSlugPhraseBridge(slug);
  const merged = dedupeClauses([...(explicit ?? []), ...(!explicit ? generic : [])]);
  return merged.slice(0, RN_NCLEX_BRIDGE_MAX_CLAUSES);
}
