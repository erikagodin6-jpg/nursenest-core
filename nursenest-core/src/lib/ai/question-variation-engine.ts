import { QuestionType } from "@prisma/client";

/** Minimum variation count (1 = no expansion). */
export const VARIATIONS_PER_TOPIC_MIN = 1;
/** Max variations per concept in batch jobs (API clamp). */
export const VARIATIONS_PER_TOPIC_BATCH_CAP = 8;
/** Max variations the engine can emit (aligns with single-generate quantity cap15). */
export const VARIATIONS_PER_TOPIC_ENGINE_MAX = 15;
export const VARIATIONS_PER_TOPIC_DEFAULT = 6;

const AGES = [
  "infant (0–12 months)",
  "toddler / preschool child",
  "school-age child",
  "adolescent",
  "young adult",
  "middle-aged adult",
  "older adult (65+)",
  "older adult with multiple comorbidities",
] as const;

const SETTINGS = [
  "emergency department",
  "ICU / critical care",
  "medical–surgical inpatient unit",
  "step-down / progressive care",
  "outpatient clinic",
  "telehealth / telephone triage",
  "long-term care / skilled nursing",
  "perioperative / PACU",
] as const;

const PRESENTATIONS = [
  "subtle early symptoms easy to overlook",
  "classic textbook presentation",
  "atypical or misleading presentation",
  "worsening despite initial treatment",
  "return visit with a new red-flag complaint",
  "stable chronic disease with an acute change",
] as const;

const ARCHETYPES = [
  "priority: what should the nurse do first?",
  "next nursing action after focused assessment",
  "interpretation of assessment findings or trends",
  "interpretation of labs/diagnostics (values provided in stem)",
  "patient/family teaching or discharge instruction",
  "medication administration or safety decision",
  "risk identification / complication prevention",
] as const;

const DATA_FOCUS = [
  "lead with abnormal labs or diagnostic data in the stem",
  "lead with subjective symptoms, history, and assessment cues",
  "balance objective labs with symptom narrative",
] as const;

const TIMELINES = [
  "acute / new-onset (hours to a few days)",
  "subacute (several days to weeks)",
  "chronic stable disease with new exacerbation",
  "long-term chronic management / surveillance",
] as const;

const PHASES = [
  "initial presentation / working differential",
  "known diagnosis — early stabilization phase",
  "emerging complication or clinical deterioration",
  "recovery, rehabilitation, or transition of care",
] as const;

export type QuestionVariationSpec = {
  age: string;
  setting: string;
  presentation: string;
  archetype: string;
  dataFocus: string;
  timeline: string;
  phase: string;
  /** Stable id for batchTopicKey hashing. */
  signature: string;
};

function pick<T extends readonly string[]>(arr: T, i: number, salt: number): T[number] {
  const idx = Math.abs((i * 31 + salt * 17) % arr.length);
  return arr[idx]!;
}

/** Small stable hash for salting picks (not crypto). */
export function variationSaltFromLabel(label: string): number {
  let h = 0;
  const s = label.trim().toLowerCase();
  for (let k = 0; k < s.length; k++) h = (Math.imul(31, h) + s.charCodeAt(k)) | 0;
  return Math.abs(h) % 1000;
}

function specSignatureParts(s: Omit<QuestionVariationSpec, "signature">): string {
  return [
    s.age,
    s.setting,
    s.presentation,
    s.archetype,
    s.dataFocus,
    s.timeline,
    s.phase,
  ]
    .map((x) => x.trim().toLowerCase().replace(/\s+/g, " "))
    .join("|");
}

/**
 * Build N distinct variation specs for one clinical concept.
 * Deterministic for the same label + count (salt from concept string).
 */
export function buildVariationSpecsForConcept(conceptLabel: string, count: number): QuestionVariationSpec[] {
  const n = Math.max(
    VARIATIONS_PER_TOPIC_MIN,
    Math.min(VARIATIONS_PER_TOPIC_ENGINE_MAX, Math.floor(count)),
  );
  const salt = variationSaltFromLabel(conceptLabel);
  const seen = new Set<string>();
  const out: QuestionVariationSpec[] = [];

  for (let i = 0; i < n; i++) {
    let bump = 0;
    let spec: QuestionVariationSpec | undefined;
    while (bump < 80) {
      const age = pick(AGES, i + bump, salt);
      const setting = pick(SETTINGS, i + bump * 3, salt + 2);
      const presentation = pick(PRESENTATIONS, i + bump * 5, salt + 4);
      const archetype = pick(ARCHETYPES, i + bump * 7, salt + 6);
      const dataFocus = pick(DATA_FOCUS, i + bump * 11, salt + 8);
      const timeline = pick(TIMELINES, i + bump * 13, salt + 10);
      const phase = pick(PHASES, i + bump * 17, salt + 12);
      const base = { age, setting, presentation, archetype, dataFocus, timeline, phase };
      const signature = specSignatureParts(base);
      if (!seen.has(signature)) {
        seen.add(signature);
        spec = { ...base, signature };
        break;
      }
      bump++;
    }
    if (spec) out.push(spec);
  }

  return out;
}

/**
 * User + model facing block; keep in English for the item writer.
 */
export function formatVariationDirective(spec: QuestionVariationSpec): string {
  return [
    "VARIATION CONTRACT (this item ONLY — obey all lines):",
    `- Patient age band: ${spec.age}`,
    `- Care setting: ${spec.setting}`,
    `- Presentation: ${spec.presentation}`,
    `- Question type / stem focus: ${spec.archetype}`,
    `- Data emphasis: ${spec.dataFocus}`,
    `- Time course: ${spec.timeline}`,
    `- Clinical phase: ${spec.phase}`,
    "The stem must be clearly distinct from other items on the same topic: different scenario details, orders, and wording.",
    "For MCQ: randomize which option index is correct across items when possible (do not default every item to the same letter position).",
  ].join("\n");
}

export type NormalizedForAnswerPattern = {
  questionType: QuestionType;
  options: string[];
  answerKey: string[];
};

/**
 * Fingerprint correct-option indices for dedup within a batch job (no DB).
 */
export function answerPatternFingerprint(n: NormalizedForAnswerPattern): string {
  const nOpt = n.options.length;
  if (n.questionType === QuestionType.SATA) {
    const idx = n.options
      .map((o, i) => (n.answerKey.includes(o) ? i : -1))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b);
    return `sata|${nOpt}|${idx.join(",")}`;
  }
  const ci = n.options.findIndex((o) => o === n.answerKey[0]);
  return `mcq|${nOpt}|${ci >= 0 ? ci : -1}`;
}

/** Clamp for batch create API (1–8). */
export function clampVariationsPerTopicBatch(raw: number | undefined): number {
  if (raw == null || Number.isNaN(raw)) return 1;
  return Math.max(
    VARIATIONS_PER_TOPIC_MIN,
    Math.min(VARIATIONS_PER_TOPIC_BATCH_CAP, Math.floor(raw)),
  );
}
