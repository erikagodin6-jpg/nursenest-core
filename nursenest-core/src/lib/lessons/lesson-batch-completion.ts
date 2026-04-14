import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { resolveLessonContextForPathwayId } from "@/lib/lessons/lesson-region-exam";
import { examRowToLessonBankItem, type LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import { sanitizeQuizItems, unwrapPathwayLessonDbSections } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { PREMIUM_SECTION_HEADINGS } from "@/lib/lessons/pathway-lesson-premium";
import type {
  PathwayLessonFigure,
  PathwayLessonPremiumSectionKind,
  PathwayLessonQuizItem,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";
import {
  buildSectionsDbPayload,
  evaluateCompletion,
  mergeIncrementalPremiumSections,
  mergeQuizItemsNoDup,
  MIN_SECTION_BODY_WORDS_TO_PRESERVE,
  normalizeSectionsRich,
  paragraphs,
  REQUIRED_SECTIONS,
  sectionMap,
  words,
  type CompletionStatus,
  type LessonCompletionLessonRow,
} from "./lesson-completion-incremental-pure";

export {
  buildSectionsDbPayload,
  evaluateCompletion,
  mergeIncrementalPremiumSections,
  mergeQuizItemsNoDup,
  MIN_SECTION_BODY_WORDS_TO_PRESERVE,
  normalizeSectionsRich,
  quizDedupeKey,
  type LessonCompletionLessonRow,
} from "./lesson-completion-incremental-pure";

function lessonsHref(topic: string, topicSlug: string, pathwayId: string): string {
  const q = new URLSearchParams();
  if (topicSlug.trim()) q.set("topicSlug", topicSlug.trim().toLowerCase());
  else q.set("topic", topic.trim());
  q.set("pathwayId", pathwayId);
  return `/app/lessons?${q.toString()}`;
}

function topicDrillHref(topic: string, pathwayId: string): string {
  const q = new URLSearchParams({
    preset: "topic_drill",
    topic: topic.trim(),
    pathwayId,
  });
  return `/app/questions?${q.toString()}`;
}

function catHref(topic: string, pathwayId: string): string {
  const q = new URLSearchParams({
    pathwayId,
    intent: "weak_focus",
    topic: topic.trim(),
  });
  return `/app/readiness?${q.toString()}`;
}

function examNamesForContextExam(exam: string): string[] {
  if (exam === "NCLEX_RN") return ["NCLEX-RN", "RN-CAT", "NCLEX"];
  if (exam === "NCLEX_PN") return ["NCLEX-PN", "RPN-CAT", "NCLEX"];
  if (exam === "REX_PN") return ["REx-PN", "REX-PN", "RPN-CAT"];
  if (exam === "NP") return ["NP", "CNPLE", "CAN-NP", "FNP", "AGPCNP", "PMHNP", "WHNP", "PNP-PC"];
  if (exam === "ALLIED") return ["ALLIED"];
  return [exam.replaceAll("_", "-")];
}

type PriorityBand = "core_systems" | "high_yield" | "remaining";
type BatchMode = "complete" | "refine";
type FocusArea =
  | "cardiovascular"
  | "respiratory"
  | "neurological"
  | "endocrine"
  | "renal"
  | "gi"
  | "hematology"
  | "pharmacology"
  | "maternity"
  | "pediatrics"
  | "mental_health"
  | "prioritization_safety";

type BatchItemResult = {
  lessonId: string;
  slug: string;
  title: string;
  topic: string;
  bodySystem: string;
  priorityBand: PriorityBand;
  statusBefore: CompletionStatus;
  statusAfter: CompletionStatus;
  /** True when the lesson already met completion rules and was left unchanged (no overwrite). */
  skippedAlreadyComplete?: boolean;
  updated: boolean;
  relatedQuestionCount: number;
  preQuestionCount: number;
  postQuestionCount: number;
  gaps: string[];
};

export type LessonCompletionBatchReport = {
  pathwayId: string;
  batchSize: number;
  write: boolean;
  selectedAt: string;
  /** Lessons that reached COMPLETE after this run (excludes already-complete skips). */
  lessonsCompleted: number;
  /** Lessons that were already COMPLETE and not modified. */
  lessonsSkippedAlreadyComplete: number;
  lessonsUpdated: number;
  lessonsStillPartial: number;
  majorGapsRemaining: string[];
  items: BatchItemResult[];
};

type BatchInput = {
  pathwayId: string;
  batchSize: number;
  offset?: number;
  write?: boolean;
  mode?: BatchMode;
  onlyCompleted?: boolean;
  onlyNotComplete?: boolean;
  focusArea?: FocusArea;
  includeSlugs?: string[];
};

type LessonRow = LessonCompletionLessonRow;

const CORE_SYSTEM_KEYS = ["cardio", "cardiovascular", "respir", "renal", "kidney", "endocr", "neuro"];
const HIGH_YIELD_KEYS = ["pharm", "medication", "priorit", "triage", "delegat", "safety", "infection"];
const REMAINING_KEYS = ["gastro", "gi", "hemat", "matern", "obst", "pedi", "child", "mental", "psych"];

/** Safe default batch size for incremental completion (operator may pass 10–20). */
const MIN_BATCH_SIZE = 10;
const MAX_BATCH_SIZE = 20;
const MAX_QUESTION_ROWS = 24;

const CARDIO_INCLUDE_KEYS = [
  "cardio",
  "heart failure",
  "myocard",
  "angina",
  "arrhythm",
  "afib",
  "atrial fibrillation",
  "vt",
  "vf",
  "hypertension",
  "hypotension",
  "shock",
  "valv",
  "peripheral vascular",
  "dvt",
  "pe",
  "pulmonary embol",
  "antihypertens",
  "antidysrhyth",
  "beta blocker",
  "ace inhibitor",
  "anticoagul",
];

const CARDIO_EXCLUDE_KEYS = [
  "fetal heart",
  "obstetric",
  "newborn",
  "labor",
  "postpartum",
];

const RESP_INCLUDE_KEYS = [
  "respir",
  "copd",
  "asthma",
  "pneumonia",
  "ards",
  "pulmonary embol",
  "pe",
  "oxygen therapy",
  "oxygenation",
  "abg",
  "arterial blood gas",
  "ventilation",
  "ventilator",
  "lung sound",
  "wheeze",
  "crackle",
  "rhonchi",
];

const RESP_EXCLUDE_KEYS = [
  "fetal lung",
  "newborn transition",
  "obstetric",
  "labor",
  "postpartum",
];

const NEURO_INCLUDE_KEYS = [
  "neuro",
  "stroke",
  "ischemic",
  "hemorrhagic",
  "increased icp",
  "intracranial pressure",
  "seizure",
  "status epilepticus",
  "meningitis",
  "spinal cord injury",
  "delirium",
  "dementia",
  "gcs",
  "neuro assessment",
  "nihss",
];

const NEURO_EXCLUDE_KEYS = [
  "fetal neural",
  "newborn reflex",
  "obstetric",
  "labor",
  "postpartum",
];

const ENDO_INCLUDE_KEYS = [
  "endocr",
  "diabetes",
  "type 1",
  "type 2",
  "dka",
  "hhs",
  "hyperglycemic",
  "hypoglycem",
  "insulin",
  "thyroid",
  "hypothyroid",
  "hyperthyroid",
  "myxedema",
  "thyroid storm",
  "adrenal",
  "cushing",
  "addison",
  "cortisol",
];

const ENDO_EXCLUDE_KEYS = [
  "gestational diabetes",
  "obstetric",
  "labor",
  "postpartum",
];

const RENAL_INCLUDE_KEYS = [
  "renal",
  "kidney",
  "aki",
  "ckd",
  "acute kidney injury",
  "chronic kidney disease",
  "dialysis",
  "hemodialysis",
  "peritoneal dialysis",
  "electrolyte",
  "hyperkalemia",
  "hypokalemia",
  "hyponatremia",
  "hypernatremia",
  "fluid balance",
  "i&o",
  "oliguria",
  "anuria",
];

const RENAL_EXCLUDE_KEYS = [
  "fetal kidney",
  "obstetric",
  "labor",
  "postpartum",
];

const GI_INCLUDE_KEYS = [
  "gi",
  "gastro",
  "liver",
  "hepatic",
  "cirrhosis",
  "hepatitis",
  "pancreatitis",
  "gi bleed",
  "gastrointestinal bleed",
  "hematemesis",
  "melena",
  "bowel",
  "crohn",
  "ulcerative colitis",
  "ibd",
  "ibs",
  "obstruction",
  "ileus",
  "diverticul",
];

const GI_EXCLUDE_KEYS = [
  "obstetric",
  "labor",
  "postpartum",
  "newborn feeding",
];

const HEME_INCLUDE_KEYS = [
  "hemat",
  "anemia",
  "iron deficiency",
  "b12",
  "folate",
  "hemolytic",
  "aplastic",
  "clot",
  "coagul",
  "platelet",
  "thromb",
  "dvt",
  "pe",
  "disseminated intravascular coagulation",
  "dic",
  "transfusion",
  "blood product",
  "reaction",
];

const HEME_EXCLUDE_KEYS = [
  "obstetric",
  "labor",
  "postpartum",
  "fetal",
];

const PHARM_INCLUDE_KEYS = [
  "pharmac",
  "medication",
  "drug class",
  "side effect",
  "adverse effect",
  "contraindication",
  "black box",
  "safety alert",
  "nursing consideration",
  "monitoring",
  "insulin",
  "antibiotic",
  "anticoagulant",
  "antihypertensive",
  "opioid",
  "diuretic",
  "beta blocker",
  "ace inhibitor",
  "arb",
  "ccb",
];

const PHARM_EXCLUDE_KEYS = [
  "veterinary",
  "research protocol",
];

const MATERNITY_INCLUDE_KEYS = [
  "maternity",
  "obstetric",
  "labor",
  "labour",
  "fetal monitoring",
  "fetal heart",
  "partum",
  "postpartum",
  "pregnan",
  "preeclamps",
  "eclamps",
  "placenta previa",
  "placental abruption",
  "postpartum hemorrhage",
  "pph",
];

const MATERNITY_EXCLUDE_KEYS = ["pediatric", "newborn-only", "neonatal screening"];

const PEDS_INCLUDE_KEYS = [
  "pediatric",
  "paediatric",
  "child",
  "infant",
  "toddler",
  "preschool",
  "school-age",
  "adolescent",
  "developmental stage",
  "growth milestone",
  "immunization",
  "febrile seizure",
  "bronchiolitis",
  "otitis",
  "safety",
  "age-specific",
];

const PEDS_EXCLUDE_KEYS = [
  "maternal",
  "labor",
  "postpartum",
  "fetal monitoring",
];

const MH_INCLUDE_KEYS = [
  "mental health",
  "psych",
  "depression",
  "anxiety",
  "schizophrenia",
  "psychosis",
  "crisis intervention",
  "suicide",
  "self-harm",
  "de-escalation",
  "therapeutic communication",
  "communication strategy",
];

const MH_EXCLUDE_KEYS = [
  "postpartum depression",
  "obstetric",
  "newborn",
];

const PRIORITY_INCLUDE_KEYS = [
  "priorit",
  "abc",
  "airway breathing circulation",
  "delegation",
  "triage",
  "deterioration",
  "rapid response",
  "clinical judgment",
  "decision-making",
  "safety",
  "escalation",
  "unstable patient",
];

const PRIORITY_EXCLUDE_KEYS = ["veterinary triage"];

function completionRank(status: CompletionStatus): number {
  if (status === "EMPTY") return 0;
  if (status === "PARTIAL") return 1;
  return 2;
}

function rankBand(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem">): PriorityBand {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem}`.toLowerCase();
  if (CORE_SYSTEM_KEYS.some((k) => text.includes(k))) return "core_systems";
  if (HIGH_YIELD_KEYS.some((k) => text.includes(k))) return "high_yield";
  if (REMAINING_KEYS.some((k) => text.includes(k))) return "remaining";
  return "remaining";
}

function isCardiovascularTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (CARDIO_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("cardio")) return true;
  return CARDIO_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isRespiratoryTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (RESP_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("respir")) return true;
  return RESP_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isNeurologicalTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (NEURO_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("neuro")) return true;
  return NEURO_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isEndocrineTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (ENDO_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("endocr")) return true;
  return ENDO_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isRenalTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (RENAL_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("renal") || lesson.bodySystem.toLowerCase().includes("neph")) return true;
  return RENAL_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isGiTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (GI_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("gastro")) return true;
  return GI_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isHematologyTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (HEME_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("hemat")) return true;
  return HEME_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isPharmacologyTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (PHARM_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("pharmac")) return true;
  return PHARM_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isMaternityTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (MATERNITY_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("matern") || lesson.bodySystem.toLowerCase().includes("obst")) return true;
  return MATERNITY_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isPediatricTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (PEDS_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("pediatric") || lesson.bodySystem.toLowerCase().includes("paediatric")) return true;
  return PEDS_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isMentalHealthTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (MH_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  if (lesson.bodySystem.toLowerCase().includes("mental") || lesson.bodySystem.toLowerCase().includes("psych")) return true;
  return MH_INCLUDE_KEYS.some((k) => text.includes(k));
}

function isPrioritizationSafetyTargetLesson(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem" | "slug">): boolean {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.slug}`.toLowerCase();
  if (PRIORITY_EXCLUDE_KEYS.some((k) => text.includes(k))) return false;
  return PRIORITY_INCLUDE_KEYS.some((k) => text.includes(k));
}

function bandOrder(band: PriorityBand): number {
  if (band === "core_systems") return 0;
  if (band === "high_yield") return 1;
  return 2;
}

function normalizeSections(raw: Prisma.JsonValue): PathwayLessonSection[] {
  if (!Array.isArray(raw)) return [];
  const out: PathwayLessonSection[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const x = raw[i];
    if (!x || typeof x !== "object") continue;
    const item = x as Record<string, unknown>;
    const kind = typeof item.kind === "string" ? item.kind.trim() : "";
    const body = typeof item.body === "string" ? item.body.trim() : "";
    if (!kind || !body) continue;
    out.push({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `${kind}-${i}`,
      heading: typeof item.heading === "string" && item.heading.trim() ? item.heading : "Section",
      kind: kind as PathwayLessonSection["kind"],
      body,
      ...(Array.isArray(item.figures) ? { figures: item.figures as PathwayLessonFigure[] } : {}),
    });
  }
  return out;
}

function hasRequiredSectionKinds(sections: PathwayLessonSection[]): boolean {
  const kinds = new Set(sections.map((s) => s.kind));
  return REQUIRED_SECTIONS.every((k) => kinds.has(k));
}

function extractImagesFromQuestionRows(rows: Array<{ images: Prisma.JsonValue | null }>): PathwayLessonFigure[] {
  const out: PathwayLessonFigure[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    if (!Array.isArray(row.images)) continue;
    for (let i = 0; i < row.images.length; i += 1) {
      const candidate = row.images[i];
      if (!candidate || typeof candidate !== "object") continue;
      const rec = candidate as Record<string, unknown>;
      const rawUrl = typeof rec.url === "string" ? rec.url.trim() : "";
      if (!rawUrl.startsWith("https://") || seen.has(rawUrl)) continue;
      seen.add(rawUrl);
      out.push({
        id: `img-${out.length + 1}`,
        url: rawUrl,
        alt: typeof rec.alt === "string" && rec.alt.trim() ? rec.alt.trim() : "Clinical reference image",
        kind: "clinical_reference",
      });
      if (out.length >= 3) return out;
    }
  }
  return out;
}

function buildQuestionBackedParagraphs(items: LessonBankQuizItem[]): string[] {
  return items
    .map((i) => i.rationale?.trim() ?? "")
    .filter((x) => x.length >= 50)
    .slice(0, 6)
    .map((r) => r.replace(/\s+/g, " "));
}

function sentenceChunks(text: string): string[] {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitLongParagraphs(body: string, maxWords = 110): string {
  const out: string[] = [];
  for (const para of paragraphs(body)) {
    if (words(para) <= maxWords) {
      out.push(para);
      continue;
    }
    const sentences = sentenceChunks(para);
    if (sentences.length < 2) {
      out.push(para);
      continue;
    }
    let left = "";
    let right = "";
    for (let i = 0; i < sentences.length; i += 1) {
      if (i < Math.ceil(sentences.length / 2)) left += `${sentences[i]} `;
      else right += `${sentences[i]} `;
    }
    out.push(left.trim());
    if (right.trim()) out.push(right.trim());
  }
  return out.join("\n\n").trim();
}

function strengthenPathophysiology(body: string, lesson: LessonRow): string {
  const p = paragraphs(body);
  const out = [...p];
  const t = lesson.topic.toLowerCase();
  const hasCause = /\bcause|trigger|etiolog|precipitat/i.test(body);
  const hasMechanism = /\bmechan|pathophys|inflamm|hemodynam|neurohormonal/i.test(body);
  const hasProgression = /\bprogress|worsen|deteriorat|cascade/i.test(body);
  const hasSymptoms = /\bsymptom|manifest|finding|presentation/i.test(body);
  const hasComplications = /\bcomplicat|shock|failure|arrhythm|sepsis|respiratory failure/i.test(body);
  if (!hasCause) {
    out.push(`Cause focus: clarify the most likely trigger(s) for ${lesson.topic} and how early recognition changes nursing priorities.`);
  }
  if (!hasMechanism) {
    out.push(`Mechanism focus: connect the underlying physiologic mechanism to measurable bedside cues and expected trend changes.`);
  }
  if (!hasProgression || !hasSymptoms || !hasComplications) {
    out.push(
      `Progression and risk focus: explain how ${t} can move from early findings to instability, which symptom progression matters most, and which complications require immediate escalation.`,
    );
  }
  const merged = splitLongParagraphs(out.join("\n\n"));
  const mergedParagraphs = paragraphs(merged);
  if (mergedParagraphs.length >= 3) return merged;
  const add: string[] = [...mergedParagraphs];
  while (add.length < 3) {
    if (add.length === 1) {
      add.push(`Mechanism focus: connect bedside findings to the underlying physiologic process and expected trend over time.`);
      continue;
    }
    add.push(`Complication focus: identify deterioration markers and escalation triggers linked to ${lesson.topic.toLowerCase()}.`);
  }
  return add.join("\n\n");
}

function strengthenClinicalPearls(body: string, lesson: LessonRow): string {
  const lines = body
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const bulletLike = lines.filter((l) => /^[-*]\s+/.test(l));
  if (bulletLike.length >= 3) return splitLongParagraphs(body);
  const base = lines.join(" ");
  const pearls = [
    `- Prioritize the first action that reduces immediate physiologic risk before non-urgent tasks.`,
    `- Use trend-based reasoning: compare current findings with baseline to detect deterioration early.`,
    `- In exam stems about ${lesson.topic}, eliminate options that delay reassessment or escalation when instability is present.`,
  ];
  const merged = base ? `${base}\n\n${pearls.join("\n")}` : pearls.join("\n");
  return splitLongParagraphs(merged);
}

function improvePhrasing(body: string): string {
  const cleaned = body
    .replace(/\bit is important to note that\b/gi, "")
    .replace(/\bin order to\b/gi, "to")
    .replace(/\butilize\b/gi, "use")
    .replace(/\bvery important\b/gi, "high priority")
    .replace(/\s{2,}/g, " ")
    .trim();
  return splitLongParagraphs(cleaned);
}

function refineSectionsForPerfectStandard(args: {
  lesson: LessonRow;
  sections: PathwayLessonSection[];
  mediaFigures: PathwayLessonFigure[];
}): PathwayLessonSection[] {
  const map = sectionMap(args.sections);
  const out: PathwayLessonSection[] = [];
  for (const kind of REQUIRED_SECTIONS) {
    const existing = map.get(kind);
    if (!existing) continue;
    let body = improvePhrasing(existing.body);
    if (kind === "pathophysiology_overview") {
      body = strengthenPathophysiology(body, args.lesson);
    }
    if (kind === "clinical_pearls") {
      body = strengthenClinicalPearls(body, args.lesson);
    }
    const next = ensureSection(kind, body, existing.figures);
    if (kind === "labs_diagnostics" && (!next.figures || next.figures.length === 0) && args.mediaFigures.length > 0) {
      next.figures = args.mediaFigures;
    }
    out.push(next);
  }
  return out;
}

function ensureSection(
  kind: PathwayLessonPremiumSectionKind,
  body: string,
  figures?: PathwayLessonFigure[],
): PathwayLessonSection {
  return {
    id: kind,
    kind,
    heading: PREMIUM_SECTION_HEADINGS[kind],
    body: body.trim(),
    ...(figures?.length ? { figures } : {}),
  };
}

function sectionTextOrFallback(map: Map<string, PathwayLessonSection>, ...kinds: string[]): string {
  for (const k of kinds) {
    const body = map.get(k)?.body?.trim();
    if (body) return body;
  }
  return "";
}

function buildPremiumSections(args: {
  pathwayId: string;
  lesson: LessonRow;
  current: PathwayLessonSection[];
  quizRationaleParagraphs: string[];
  mediaFigures: PathwayLessonFigure[];
}): PathwayLessonSection[] {
  const m = sectionMap(args.current);
  const intro = sectionTextOrFallback(m, "introduction", "clinical_meaning", "intro");
  const pathoBase = sectionTextOrFallback(m, "pathophysiology_overview", "core_concept", "core");
  const signs = sectionTextOrFallback(m, "signs_symptoms", "clinical_scenario");
  const redFlags = sectionTextOrFallback(m, "red_flags", "exam_relevance", "exam_tips");
  const labs = sectionTextOrFallback(m, "labs_diagnostics");
  const nursing = sectionTextOrFallback(m, "nursing_assessment_interventions", "clinical_application", "core_concept");
  const pearls = sectionTextOrFallback(m, "clinical_pearls", "takeaways", "exam_relevance");
  const education = sectionTextOrFallback(m, "client_education", "takeaways");

  const pathoParagraphs = paragraphs(pathoBase);
  const rationaleParagraphs = args.quizRationaleParagraphs;
  const pathoCombined = [...pathoParagraphs, ...rationaleParagraphs].slice(0, 4);
  const pathoBody = pathoCombined.join("\n\n");

  const lessonLinks = [
    `[Topic lessons](${lessonsHref(args.lesson.topic, args.lesson.topicSlug, args.pathwayId)})`,
    `[Topic drill](${topicDrillHref(args.lesson.topic, args.pathwayId)})`,
    `[Readiness CAT](${catHref(args.lesson.topic, args.pathwayId)})`,
  ].join("\n");

  const out: PathwayLessonSection[] = [];
  out.push(ensureSection("introduction", intro || sectionTextOrFallback(m, "exam_relevance", "takeaways")));
  out.push(ensureSection("pathophysiology_overview", pathoBody));
  out.push(ensureSection("signs_symptoms", signs || rationaleParagraphs.slice(0, 2).join("\n\n")));
  out.push(ensureSection("red_flags", redFlags || rationaleParagraphs.slice(0, 2).join("\n\n")));
  out.push(ensureSection("labs_diagnostics", labs || "[not applicable]", args.mediaFigures));
  out.push(ensureSection("nursing_assessment_interventions", nursing || rationaleParagraphs.slice(0, 3).join("\n\n")));
  out.push(ensureSection("clinical_pearls", pearls || rationaleParagraphs.slice(0, 2).join("\n\n")));
  out.push(ensureSection("client_education", education || sectionTextOrFallback(m, "takeaways")));
  out.push(
    ensureSection(
      "tier_specific_relevance",
      sectionTextOrFallback(m, "exam_relevance") || "For RN boards, prioritize immediate safety actions, escalation timing, and delegation boundaries.",
    ),
  );
  out.push(ensureSection("country_specific_notes", "US NCLEX-RN framing and US standard terminology are used in this lesson."));
  out.push(ensureSection("related_next_steps", lessonLinks));
  return out;
}

async function relatedQuestionRowsForLesson(pathwayId: string, lesson: LessonRow): Promise<
  Array<{
    id: string;
    stem: string;
    options: Prisma.JsonValue | null;
    correctAnswer: Prisma.JsonValue | null;
    questionType: string;
    rationale: string | null;
    images: Prisma.JsonValue | null;
  }>
> {
  const context = resolveLessonContextForPathwayId(pathwayId);
  const normalizedTopic = lesson.topic.trim();
  const slugPhrase = lesson.topicSlug.replace(/-/g, " ").trim();
  const tierList =
    pathwayId.includes("-rn-")
      ? ["RN", "rn"]
      : pathwayId.includes("-pn-") || pathwayId.includes("-lpn-") || pathwayId.includes("-rpn-")
        ? ["PN", "pn", "RPN", "rpn", "LVN", "lvn"]
        : [];
  const examList = examNamesForContextExam(context.exam);
  const where: Prisma.ExamQuestionWhereInput = {
    status: "published",
    exam: { in: examList },
    ...(tierList.length ? { tier: { in: tierList } } : {}),
    ...(context.country !== "GLOBAL"
      ? {
          OR: [{ countryCode: context.country }, { countryCode: null }, { countryCode: "" }],
        }
      : {}),
    AND: [
      {
        OR: [
          { topic: { equals: normalizedTopic, mode: "insensitive" } },
          { subtopic: { equals: normalizedTopic, mode: "insensitive" } },
          { topic: { equals: slugPhrase, mode: "insensitive" } },
          { subtopic: { equals: slugPhrase, mode: "insensitive" } },
          { topic: { contains: slugPhrase, mode: "insensitive" } },
          { subtopic: { contains: slugPhrase, mode: "insensitive" } },
          { bodySystem: { contains: lesson.bodySystem, mode: "insensitive" } },
          { tags: { has: lesson.topicSlug } },
        ],
      },
    ],
  };
  return prisma.examQuestion.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    take: MAX_QUESTION_ROWS,
    select: {
      id: true,
      stem: true,
      options: true,
      correctAnswer: true,
      questionType: true,
      rationale: true,
      images: true,
    },
  });
}

function pickPrePost(quizItems: LessonBankQuizItem[]): { pre: PathwayLessonQuizItem[]; post: PathwayLessonQuizItem[] } {
  const pre = quizItems.slice(0, 4).map((q) => ({
    examQuestionId: q.examQuestionId,
    question: q.question,
    options: q.options,
    correct: q.correct,
    ...(q.rationale ? { rationale: q.rationale } : {}),
  }));
  const post = quizItems.slice(4, 12).map((q) => ({
    examQuestionId: q.examQuestionId,
    question: q.question,
    options: q.options,
    correct: q.correct,
    ...(q.rationale ? { rationale: q.rationale } : {}),
  }));
  return { pre, post };
}

function majorGapSummary(items: BatchItemResult[]): string[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const gap of item.gaps) {
      counts.set(gap, (counts.get(gap) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([gap, n]) => `${gap} (${n})`);
}

export async function runLessonCompletionBatch(input: BatchInput): Promise<LessonCompletionBatchReport> {
  const includeSlugSet = input.includeSlugs?.length ? new Set(input.includeSlugs.map((s) => s.trim()).filter(Boolean)) : null;
  const batchSize = Math.max(MIN_BATCH_SIZE, Math.min(MAX_BATCH_SIZE, Math.floor(input.batchSize)));
  const offset = Math.max(0, Math.floor(input.offset ?? 0));
  const write = Boolean(input.write);
  const mode: BatchMode = input.mode ?? "complete";

  const lessonRows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: input.pathwayId,
      locale: "en",
      status: ContentStatus.PUBLISHED,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      sections: true,
    },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    take: 2000,
  });

  const preScored: Array<{
    row: LessonRow;
    band: PriorityBand;
    status: CompletionStatus;
    score: number;
  }> = [];

  for (const row of lessonRows) {
    if (includeSlugSet && !includeSlugSet.has(row.slug)) continue;
    if (input.focusArea === "cardiovascular" && !isCardiovascularTargetLesson(row)) continue;
    if (input.focusArea === "respiratory" && !isRespiratoryTargetLesson(row)) continue;
    if (input.focusArea === "neurological" && !isNeurologicalTargetLesson(row)) continue;
    if (input.focusArea === "endocrine" && !isEndocrineTargetLesson(row)) continue;
    if (input.focusArea === "renal" && !isRenalTargetLesson(row)) continue;
    if (input.focusArea === "gi" && !isGiTargetLesson(row)) continue;
    if (input.focusArea === "hematology" && !isHematologyTargetLesson(row)) continue;
    if (input.focusArea === "pharmacology" && !isPharmacologyTargetLesson(row)) continue;
    if (input.focusArea === "maternity" && !isMaternityTargetLesson(row)) continue;
    if (input.focusArea === "pediatrics" && !isPediatricTargetLesson(row)) continue;
    if (input.focusArea === "mental_health" && !isMentalHealthTargetLesson(row)) continue;
    if (input.focusArea === "prioritization_safety" && !isPrioritizationSafetyTargetLesson(row)) continue;
    const uw = unwrapPathwayLessonDbSections(row.sections);
    const sections = normalizeSectionsRich(uw.sectionList as Prisma.JsonValue);
    const roughWordCount = sections.reduce((sum, s) => sum + words(s.body), 0);
    const roughStatus: CompletionStatus = roughWordCount < 180 ? "EMPTY" : hasRequiredSectionKinds(sections) ? "COMPLETE" : "PARTIAL";
    const band = rankBand(row);
    const score = bandOrder(band) * 100 + (roughStatus === "PARTIAL" ? 0 : 10);
    if (input.onlyCompleted && roughStatus !== "COMPLETE") continue;
    if (input.onlyNotComplete && roughStatus === "COMPLETE") continue;
    preScored.push({ row, band, status: roughStatus, score });
  }

  const selected = preScored
    .sort((a, b) => a.score - b.score || a.row.slug.localeCompare(b.row.slug))
    .slice(offset, offset + batchSize);

  const items: BatchItemResult[] = [];

  for (const pick of selected) {
    const unwrapped = unwrapPathwayLessonDbSections(pick.row.sections);
    const dbPreRaw = sanitizeQuizItems(unwrapped.preTest as unknown) ?? [];
    const dbPostRaw = sanitizeQuizItems(unwrapped.postTest as unknown) ?? [];
    const currentSections = normalizeSectionsRich(unwrapped.sectionList as Prisma.JsonValue);

    const questionRows = await relatedQuestionRowsForLesson(input.pathwayId, pick.row);
    const quizItems = questionRows.map(examRowToLessonBankItem).filter((x): x is LessonBankQuizItem => Boolean(x));
    const { pre, post } = pickPrePost(quizItems);
    const rationaleParagraphs = buildQuestionBackedParagraphs(quizItems);
    const mediaFigures = extractImagesFromQuestionRows(questionRows);

    const preForEval = dbPreRaw.length >= 3 ? dbPreRaw : pre;
    const postForEval = dbPostRaw.length >= 5 ? dbPostRaw : post;
    const beforeEval = evaluateCompletion({
      lesson: pick.row,
      sections: currentSections,
      preQuestions: preForEval,
      postQuestions: postForEval,
    });

    if (beforeEval.status === "COMPLETE") {
      items.push({
        lessonId: pick.row.id,
        slug: pick.row.slug,
        title: pick.row.title,
        topic: pick.row.topic,
        bodySystem: pick.row.bodySystem,
        priorityBand: pick.band,
        statusBefore: beforeEval.status,
        statusAfter: beforeEval.status,
        skippedAlreadyComplete: true,
        updated: false,
        relatedQuestionCount: questionRows.length,
        preQuestionCount: Math.max(dbPreRaw.length, preForEval.length),
        postQuestionCount: Math.max(dbPostRaw.length, postForEval.length),
        gaps: beforeEval.gaps,
      });
      continue;
    }

    const upgradedBuilt =
      mode === "refine"
        ? refineSectionsForPerfectStandard({
            lesson: pick.row,
            sections: currentSections,
            mediaFigures,
          })
        : buildPremiumSections({
            pathwayId: input.pathwayId,
            lesson: pick.row,
            current: currentSections,
            quizRationaleParagraphs: rationaleParagraphs,
            mediaFigures,
          });

    const upgradedSections =
      mode === "refine" ? upgradedBuilt : mergeIncrementalPremiumSections(currentSections, upgradedBuilt);

    const newPre = mergeQuizItemsNoDup(dbPreRaw, pre);
    const newPost = mergeQuizItemsNoDup(dbPostRaw, post);

    const afterEval = evaluateCompletion({
      lesson: pick.row,
      sections: upgradedSections,
      preQuestions: newPre,
      postQuestions: newPost,
    });

    const finalizedSections =
      mode === "refine" && completionRank(afterEval.status) < completionRank(beforeEval.status) ? currentSections : upgradedSections;
    const finalizedEval =
      mode === "refine" && completionRank(afterEval.status) < completionRank(beforeEval.status) ? beforeEval : afterEval;

    const newPreFinal =
      mode === "refine" && completionRank(afterEval.status) < completionRank(beforeEval.status) ? dbPreRaw : newPre;
    const newPostFinal =
      mode === "refine" && completionRank(afterEval.status) < completionRank(beforeEval.status) ? dbPostRaw : newPost;

    const nextPayload = buildSectionsDbPayload(finalizedSections, newPreFinal, newPostFinal);
    const updated = JSON.stringify(pick.row.sections) !== JSON.stringify(nextPayload);

    if (write && updated) {
      await prisma.pathwayLesson.update({
        where: { id: pick.row.id },
        data: {
          sections: nextPayload,
        },
      });
    }

    items.push({
      lessonId: pick.row.id,
      slug: pick.row.slug,
      title: pick.row.title,
      topic: pick.row.topic,
      bodySystem: pick.row.bodySystem,
      priorityBand: pick.band,
      statusBefore: beforeEval.status,
      statusAfter: finalizedEval.status,
      updated,
      relatedQuestionCount: questionRows.length,
      preQuestionCount: newPreFinal.length,
      postQuestionCount: newPostFinal.length,
      gaps: finalizedEval.gaps,
    });
  }

  const lessonsSkippedAlreadyComplete = items.filter((i) => i.skippedAlreadyComplete).length;
  const lessonsCompleted = items.filter((i) => i.statusAfter === "COMPLETE" && !i.skippedAlreadyComplete).length;
  const lessonsUpdated = items.filter((i) => i.updated).length;
  const lessonsStillPartial = items.filter((i) => i.statusAfter !== "COMPLETE").length;

  return {
    pathwayId: input.pathwayId,
    batchSize: items.length,
    write,
    selectedAt: new Date().toISOString(),
    lessonsCompleted,
    lessonsSkippedAlreadyComplete,
    lessonsUpdated,
    lessonsStillPartial,
    majorGapsRemaining: majorGapSummary(items),
    items,
  };
}

/**
 * Rough hub-level completeness for progress tracking (section spine + word count heuristic).
 * Inexpensive full-pathway scan — not identical to {@link evaluateCompletion} (bank-linked quizzes).
 */
export async function estimatePathwayContentCompleteness(pathwayId: string): Promise<{
  pathwayId: string;
  total: number;
  completeRough: number;
  partialRough: number;
  emptyRough: number;
  /** Percent of lessons scoring "complete" on the rough heuristic (0–100, one decimal). */
  completenessApproxPct: number;
}> {
  const rows = await prisma.pathwayLesson.findMany({
    where: { pathwayId, locale: "en", status: ContentStatus.PUBLISHED },
    select: { sections: true },
  });
  let completeRough = 0;
  let partialRough = 0;
  let emptyRough = 0;
  for (const row of rows) {
    const uw = unwrapPathwayLessonDbSections(row.sections);
    const sections = normalizeSectionsRich(uw.sectionList as Prisma.JsonValue);
    const roughWordCount = sections.reduce((sum, s) => sum + words(s.body), 0);
    const roughStatus: CompletionStatus =
      roughWordCount < 180 ? "EMPTY" : hasRequiredSectionKinds(sections) ? "COMPLETE" : "PARTIAL";
    if (roughStatus === "EMPTY") emptyRough += 1;
    else if (roughStatus === "COMPLETE") completeRough += 1;
    else partialRough += 1;
  }
  const total = rows.length;
  const completenessApproxPct = total ? Math.round((completeRough / total) * 1000) / 10 : 0;
  return { pathwayId, total, completeRough, partialRough, emptyRough, completenessApproxPct };
}
