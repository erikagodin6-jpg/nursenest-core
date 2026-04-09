/**
 * RN NCLEX catalog lesson → `exam_questions` OR-clause hints (bounded, no extra round-trips).
 * Used by {@link loadRelatedExamQuestionStemsForPathwayLesson} to align lesson detail “related questions”
 * with bank metadata (`topic`, `subtopic`, `tags`, `bodySystem`) using existing vocabulary — not new DB writes.
 */
import type { Prisma } from "@prisma/client";

const RN_NCLEX_PATHWAY_IDS = new Set(["us-rn-nclex-rn", "ca-rn-nclex-rn"]);

/** Hard cap so a single findMany stays predictable (merged with title/slug token ORs). */
export const RN_NCLEX_BRIDGE_MAX_CLAUSES = 8;

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

/**
 * High-signal bridges for major conditions (prioritized editorial list + common NCLEX-RN slugs).
 * Values mirror typical `topic` / `tags` / `body_system` strings in the bank; prefer short `contains` terms.
 */
const EXPLICIT_SLUG_BRIDGES: Record<string, Clause[]> = {
  "myocardial-infarction-nclex-rn": [
    icContains("myocardial"),
    icContains("infarct"),
    icContains("STEMI"),
    icContains("NSTEMI"),
    bodyContains("Cardio"),
  ],
  "heart-failure-nclex-rn": [icContains("heart failure"), icContains("CHF"), bodyContains("Cardio")],
  "copd-nclex-rn": [icContains("COPD"), icContains("emphysema"), icContains("chronic bronchitis"), bodyContains("Respiratory")],
  "pulmonary-embolism-nclex-rn": [
    icContains("pulmonary embol"),
    icContains("embolism"),
    icContains("DVT"),
    bodyContains("Respiratory"),
  ],
  "sepsis-nclex-rn": [icContains("sepsis"), icContains("septic"), subContains("sepsis"), icContains("infection")],
  "diabetic-ketoacidosis-nclex-rn": [icContains("DKA"), icContains("ketoacidosis"), icContains("diabetic"), bodyContains("Endocrine")],
  "eclampsia-nclex-rn": [icContains("eclampsia"), icContains("preeclampsia"), icContains("pregnancy"), icContains("gestation")],
  "hellp-syndrome-nclex-rn": [icContains("HELLP"), icContains("preeclampsia"), icContains("liver")],
  "kawasaki-disease-nclex-rn": [icContains("Kawasaki"), icContains("pediatric"), icContains("mucos")],
  "bronchiolitis-and-rsv-nclex-rn": [icContains("RSV"), icContains("bronchiolitis"), icContains("pediatric"), bodyContains("Respiratory")],
  "appendicitis-nclex-rn": [icContains("appendicitis"), icContains("abdomen"), bodyContains("Gastro")],
  "cholecystitis-nclex-rn": [icContains("cholecystitis"), icContains("gallbladder"), bodyContains("Gastro")],
  "bowel-obstruction-mechanical-and-functional-nclex-rn": [
    icContains("obstruction"),
    icContains("bowel"),
    icContains("intestinal"),
    bodyContains("Gastro"),
  ],
  "increased-intracranial-pressure-nclex-rn": [
    icContains("intracranial"),
    icContains("ICP"),
    icContains("neuro"),
    bodyContains("Neuro"),
  ],
  "bacterial-meningitis-nclex-rn": [icContains("meningitis"), icContains("CSF"), bodyContains("Neuro")],
  "nephrotic-syndrome-nclex-rn": [icContains("nephrotic"), icContains("proteinuria"), bodyContains("Renal")],
  "sickle-cell-disease-nclex-rn": [icContains("sickle"), icContains("vaso-occlusive"), icContains("anemia")],
  "acute-lymphoblastic-leukemia-nclex-rn": [icContains("leukemia"), icContains("ALL"), icContains("lymphoblastic")],
  "acute-myelogenous-leukemia-nclex-rn": [icContains("leukemia"), icContains("myeloid"), icContains("AML")],
};

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
