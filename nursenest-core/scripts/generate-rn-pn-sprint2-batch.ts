#!/usr/bin/env npx tsx
/**
 * RN/PN full-bank materialization from Replit `exam_questions.json`.
 * Emits **all** published nursing-tier (rn / rpn / lvn / lpn) MCQs with valid options + correct indices,
 * deduped by {@link stemHash} (first row wins in stable id order). Topic = first regex match in {@link TOPICS}
 * or {@link CATCH_ALL_SPEC}.
 *
 * **US NCLEX product mode** (`MATERIALIZE_US_NCLEX_ONLY`): drops Canada-only rows; tags `country:US` only;
 * PN items map to NCLEX-PN (not REx-PN); full-exam presets exclude catch-all “general clinical” bucket.
 *
 *   npx tsx scripts/generate-rn-pn-sprint2-batch.ts
 */
import fs from "node:fs";
import path from "node:path";
import { stemHash } from "@/lib/content/stem-hash";

const REPLIT = path.join(process.cwd(), "data/replit-exports/exam_questions.json");
const OUT_DIR = path.join(process.cwd(), "data/materialized/rn-pn-replit-batch-2026");
const MASTER_TOPIC_MAP = path.join(process.cwd(), "src/content/topic-maps/master-topic-map.json");

const BATCH_TAG = "mixed-practice-2026-rn-pn";
const SPRINT_TAG = "batch-rn-pn-2026-sprint2";
const PRESET_RN_TAG = "exam-preset-rn-mixed-2026";
const PRESET_PN_TAG = "exam-preset-pn-mixed-2026";
const PRESET_US_RN_FULL_TAG = "exam-preset-us-rn-full-2026";
const PRESET_CA_RN_FULL_TAG = "exam-preset-ca-rn-full-2026";
const PRESET_US_PN_FULL_TAG = "exam-preset-us-pn-full-2026";
const PRESET_CA_RPN_FULL_TAG = "exam-preset-ca-rpn-full-2026";
const FULL_EXAM_QUESTION_TARGET = 75;

/** When true: Canada-only questions omitted; output targets US NCLEX-RN / NCLEX-PN only. */
const MATERIALIZE_US_NCLEX_ONLY = true;

/** Minimum flashcards to emit; also scales up lightly with bank size (capped). */
const TARGET_FLASHCARDS_MIN = 150;
const FLASHCARDS_MAX = 900;

/** Pull flashcards from these topic keys first (priority / safety / pharmacology). */
const FLASHCARD_PRIORITY_KEYS: string[] = [
  "prioritization-abcs",
  "delegation",
  "infection-control",
  "sepsis",
  "anticoagulants",
  "antibiotics",
  "pain-management",
  "insulin-hypoglycemia",
  "potassium-imbalance",
  "sodium-imbalance",
  "heart-failure",
  "myocardial-infarction",
];

/** Richer NCLEX lesson copy: prioritization, first action, traps. */
const NCLEX_ENHANCED_TOPIC_KEYS = new Set<string>([
  "heart-failure",
  "myocardial-infarction",
  "prioritization-abcs",
  "delegation",
  "insulin-hypoglycemia",
]);

type TopicSpec = {
  key: string;
  label: string;
  topicSlug: string;
  bodySystem: string;
  categorySlug: string;
  test: RegExp;
};

/** First matching topic wins — order most-specific first. */
const TOPICS: TopicSpec[] = [
  {
    key: "pulmonary-embolism",
    label: "Pulmonary embolism",
    topicSlug: "pulmonary-embolism",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bpulmonary embolism\b|\bPE\b.*(lung|dyspnea|hypox)|DVT.*embol|embolus/i,
  },
  {
    key: "heart-failure",
    label: "Heart failure",
    topicSlug: "heart-failure",
    bodySystem: "Cardiovascular",
    categorySlug: "cardiovascular",
    test: /\bheart failure\b|CHF|HFrEF|HFpEF|LVAD|volume overload.*heart/i,
  },
  {
    key: "myocardial-infarction",
    label: "Myocardial infarction",
    topicSlug: "acute-coronary",
    bodySystem: "Cardiovascular",
    categorySlug: "cardiovascular",
    test: /\bmyocardial infarction\b|\bSTEMI\b|\bNSTEMI\b|\bMI\b|acute coronary|heart attack/i,
  },
  {
    key: "angina",
    label: "Angina",
    topicSlug: "angina",
    bodySystem: "Cardiovascular",
    categorySlug: "cardiovascular",
    test: /\bangina\b|nitroglycerin|nitroglycerine|nitro\b|stable angina/i,
  },
  {
    key: "dysrhythmias",
    label: "Dysrhythmias",
    topicSlug: "dysrhythmias",
    bodySystem: "Cardiovascular",
    categorySlug: "cardiovascular",
    test: /\bdysrhythmia\b|\barrhythmia\b|atrial fibrillation|A-fib|VF\b|VT\b|ventricular fibrillation|defibrillat|cardioversion|sinus bradycardia|heart block|pacemaker/i,
  },
  {
    key: "hypertension",
    label: "Hypertension",
    topicSlug: "hypertension",
    bodySystem: "Cardiovascular",
    categorySlug: "cardiovascular",
    test: /\bhypertension\b|\bHTN\b|elevated blood pressure|antihypertensive/i,
  },
  {
    key: "shock",
    label: "Shock",
    topicSlug: "shock",
    bodySystem: "Cardiovascular",
    categorySlug: "cardiovascular",
    test: /\bshock\b|hypovolemic|cardiogenic|distributive|septic shock/i,
  },
  {
    key: "asthma",
    label: "Asthma",
    topicSlug: "asthma",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\basthma\b|albuterol|salbutamol|inhaled corticosteroid|peak flow/i,
  },
  {
    key: "ards",
    label: "ARDS",
    topicSlug: "ards",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bARDS\b|acute respiratory distress|acute lung injury/i,
  },
  {
    key: "pneumonia",
    label: "Pneumonia",
    topicSlug: "pneumonia",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bpneumonia\b|lobar pneumonia|community-acquired pneumonia|CAP\b/i,
  },
  {
    key: "copd-respiratory",
    label: "COPD & respiratory basics",
    topicSlug: "copd",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bCOPD\b|emphysema|chronic bronchitis/i,
  },
  {
    key: "abg-interpretation",
    label: "ABG interpretation",
    topicSlug: "abg",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bABG\b|arterial blood gas|PaCO2|PaO2|HCO3|respiratory acidosis|metabolic acidosis/i,
  },
  {
    key: "acid-base-advanced",
    label: "Acid–base disorders (advanced)",
    topicSlug: "acid-base",
    bodySystem: "Renal",
    categorySlug: "fluids-electrolytes",
    test: /\banion gap\b|metabolic alkalosis|respiratory alkalosis|mixed acid-base|delta gap|Winter|compensation.*acid/i,
  },
  {
    key: "sodium-imbalance",
    label: "Sodium imbalance",
    topicSlug: "sodium",
    bodySystem: "Renal",
    categorySlug: "fluids-electrolytes",
    test: /\bhyponatremia\b|\bhypernatremia\b|serum sodium|Na\+|sodium level/i,
  },
  {
    key: "potassium-imbalance",
    label: "Potassium imbalance",
    topicSlug: "potassium",
    bodySystem: "Renal",
    categorySlug: "fluids-electrolytes",
    test: /\bhypokalemia\b|\bhyperkalemia\b|serum potassium|K\+|potassium level|kayexalate|spironolactone.*K/i,
  },
  {
    key: "insulin-hypoglycemia",
    label: "Insulin & hypoglycemia",
    topicSlug: "diabetes-meds",
    bodySystem: "Endocrine",
    categorySlug: "endocrine",
    test: /\binsulin\b|hypoglycemia|hyperglycemia|\bDKA\b|glucose.*insulin/i,
  },
  {
    key: "sepsis",
    label: "Sepsis",
    topicSlug: "sepsis",
    bodySystem: "Immune",
    categorySlug: "infection",
    test: /\bsepsis\b|SIRS|qSOFA/i,
  },
  {
    key: "infection-control",
    label: "Infection control",
    topicSlug: "infection-control",
    bodySystem: "Infection control",
    categorySlug: "infection",
    test: /\binfection control\b|PPE|hand hygiene|Contact precautions|Droplet|Airborne|C\.diff|C diff/i,
  },
  {
    key: "anticoagulants",
    label: "Anticoagulants",
    topicSlug: "anticoagulation",
    bodySystem: "Hematologic",
    categorySlug: "pharmacology",
    test: /\bwarfarin\b|heparin\b|DOAC|apixaban|rivaroxaban|dabigatran|\bINR\b|anticoagul/i,
  },
  {
    key: "antibiotics",
    label: "Antibiotics",
    topicSlug: "antibiotics",
    bodySystem: "Infection",
    categorySlug: "pharmacology",
    test: /\bantibiotic\b|antimicrobial|broad-spectrum|culture and sensitivity|vancomycin infusion/i,
  },
  {
    key: "pain-management",
    label: "Pain management",
    topicSlug: "pain",
    bodySystem: "Neurologic",
    categorySlug: "pharmacology",
    test: /\bopioid\b|analgesic|pain scale|PCA\b|patient-controlled analgesia|sedation score/i,
  },
  {
    key: "wound-care",
    label: "Wound care",
    topicSlug: "wounds",
    bodySystem: "Integumentary",
    categorySlug: "fundamentals",
    test: /\bwound\b|pressure ulcer|pressure injury|staging|debridement|dressing change/i,
  },
  {
    key: "delegation",
    label: "Delegation & assignment",
    topicSlug: "delegation",
    bodySystem: "General",
    categorySlug: "management-of-care",
    test: /\bdelegat|UAP\b|unlicensed assist|assign.*task|scope of practice|nurse practice act/i,
  },
  {
    key: "fluid-balance",
    label: "Fluid deficit vs excess",
    topicSlug: "fluids-electrolytes",
    bodySystem: "Renal",
    categorySlug: "fluids-electrolytes",
    test: /\bfluid (volume )?(deficit|overload|excess)\b|dehydration|hypervolemia|hypovolemia|\bFVE\b|\bFVD\b/i,
  },
  {
    key: "prioritization-abcs",
    label: "Prioritization, ABCs & safety",
    topicSlug: "prioritization",
    bodySystem: "General",
    categorySlug: "safety",
    test: /\bprioritiz|ABCs\b|Airway.*Breathing|Maslow|first action|see first|most urgent/i,
  },
  {
    key: "neurological-acute-care",
    label: "Neurological acute care",
    topicSlug: "neurological-acute-care",
    bodySystem: "Neurological",
    categorySlug: "neurology",
    test: /\bstroke\b|TIA\b|seizure|postictal|status epilepticus|increased ICP|intracranial|autonomic dysreflexia|cranial|neuro\b/i,
  },
  {
    key: "mental-health-crisis",
    label: "Mental health crisis care",
    topicSlug: "mental-health-crisis",
    bodySystem: "Mental Health",
    categorySlug: "mental-health",
    test: /\bsuicid|homicid|psychosis|mania|schizo|bipolar|depression|withdrawal|CIWA|hallucinat|delirium tremens|anxi|behavioral/i,
  },
  {
    key: "pediatrics-care",
    label: "Pediatrics nursing care",
    topicSlug: "pediatrics-care",
    bodySystem: "Pediatrics",
    categorySlug: "pediatrics",
    test: /\bpediatric|infant|newborn|child|toddler|adolescent|growth percentile|fontanel|immuniz|RSV|croup|febrile seizure/i,
  },
  {
    key: "maternal-newborn-care",
    label: "Maternal and newborn care",
    topicSlug: "maternal-newborn-care",
    bodySystem: "Maternal/Newborn",
    categorySlug: "maternity",
    test: /\bpostpartum|antepartum|labor|delivery|oxytocin|fetal|placenta|eclampsia|preeclampsia|lochia|uterine|newborn/i,
  },
  {
    key: "gastrointestinal-acute-care",
    label: "Gastrointestinal acute care",
    topicSlug: "gastrointestinal-acute-care",
    bodySystem: "Gastrointestinal",
    categorySlug: "gastrointestinal",
    test: /\bpancreatitis|hepatic|liver|GI bleed|hematemesis|melena|bowel obstruction|ileus|ostomy|ascites|cirrhosis|C\.? diff|diarrhea/i,
  },
  {
    key: "renal-genitourinary-care",
    label: "Renal and genitourinary care",
    topicSlug: "renal-genitourinary-care",
    bodySystem: "Renal",
    categorySlug: "renal-gu",
    test: /\bAKI\b|CKD\b|dialysis|oliguria|anuria|creatinine|BUN\b|urinary|catheter|pyelonephritis|renal/i,
  },
  {
    key: "hematology-oncology-care",
    label: "Hematology and oncology care",
    topicSlug: "hematology-oncology-care",
    bodySystem: "Hematology",
    categorySlug: "hematology",
    test: /\banemia|thrombocytopenia|neutropenia|transfusion|hemoglobin|platelet|sickle|leukemia|lymphoma|oncology|chemo/i,
  },
  {
    key: "musculoskeletal-care",
    label: "Musculoskeletal care",
    topicSlug: "musculoskeletal-care",
    bodySystem: "Musculoskeletal",
    categorySlug: "musculoskeletal",
    test: /\bfracture|cast\b|traction|arthrit|osteoporosis|hip replacement|joint|mobility|amputation/i,
  },
  {
    key: "integumentary-burn-wound",
    label: "Integumentary, burn, and wound care",
    topicSlug: "integumentary-burn-wound",
    bodySystem: "Integumentary",
    categorySlug: "integumentary",
    test: /\bburn\b|pressure (ulcer|injury)|skin integrity|wound|dressing|debridement|cellulitis|dermat/i,
  },
  {
    key: "emergency-triage-disaster",
    label: "Emergency triage and disaster care",
    topicSlug: "emergency-triage-disaster",
    bodySystem: "Emergency",
    categorySlug: "emergency",
    test: /\btriage|disaster|mass casualty|emergency department|trauma|rapid response|code blue/i,
  },
  {
    key: "fundamentals-patient-safety",
    label: "Fundamentals and patient safety",
    topicSlug: "fundamentals-patient-safety",
    bodySystem: "Fundamentals",
    categorySlug: "fundamentals",
    test: /\bpatient safety|fall risk|safe transfer|aseptic|sterile|documentation|informed consent|restraint|home safety|teaching plan/i,
  },
];

/** Fallback when no {@link TOPICS} regex matches (still a usable NCLEX-style item). */
const CATCH_ALL_SPEC: TopicSpec = {
  key: "general-nursing-clinical",
  label: "General nursing clinical judgment",
  topicSlug: "clinical-judgment",
  bodySystem: "General",
  categorySlug: "management-of-care",
  test: /(?!)/, // unused — selected only via classifyTopic default
};

type RawQ = Record<string, unknown> & {
  id: string;
  stem: string;
  tier: string;
  exam: string;
  options: unknown;
  correct_answer?: unknown;
  rationale?: string;
  difficulty?: number;
  body_system?: string;
  topic?: string | null;
  subtopic?: string | null;
  status?: string;
  region_scope?: string | null;
};

function optArray(o: unknown): string[] | null {
  if (!o) return null;
  if (Array.isArray(o)) {
    const s = o.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    return s.length >= 2 ? s : null;
  }
  if (typeof o === "object") {
    const vals = Object.values(o as Record<string, unknown>).filter((x): x is string => typeof x === "string");
    return vals.length >= 2 ? vals : null;
  }
  return null;
}

function correctTexts(raw: RawQ, options: string[]): string[] | null {
  const ca = raw.correct_answer ?? raw.correctAnswer;
  if (typeof ca === "number" && Number.isInteger(ca) && ca >= 0 && ca < options.length) {
    return [options[ca]!];
  }
  if (Array.isArray(ca) && ca.length && typeof ca[0] === "number") {
    const texts: string[] = [];
    for (const x of ca as number[]) {
      if (typeof x !== "number" || x < 0 || x >= options.length) return null;
      texts.push(options[x]!);
    }
    return texts;
  }
  return null;
}

function matchesTopic(row: RawQ, re: RegExp): boolean {
  const opts = optArray(row.options) ?? [];
  const blob = [row.stem, ...opts, row.rationale, row.topic, row.subtopic, row.body_system]
    .filter(Boolean)
    .join(" ");
  return re.test(blob);
}

type MasterTopicMap = {
  exams?: Record<string, { categories?: Array<{ topics?: Array<{ questionTopicHints?: string[] }> }> }>;
};

function loadMasterTopicHints(): string[] {
  try {
    const raw = JSON.parse(fs.readFileSync(MASTER_TOPIC_MAP, "utf8")) as MasterTopicMap;
    const out = new Set<string>();
    for (const exam of Object.values(raw.exams ?? {})) {
      for (const cat of exam.categories ?? []) {
        for (const topic of cat.topics ?? []) {
          for (const hint of topic.questionTopicHints ?? []) {
            const h = hint.trim().toLowerCase();
            if (h.length >= 4) out.add(h);
          }
        }
      }
    }
    return [...out];
  } catch {
    return [];
  }
}

const MASTER_HINTS = loadMasterTopicHints();

function topicByKey(key: string): TopicSpec | null {
  return TOPICS.find((t) => t.key === key) ?? null;
}

function classifyByFallbackSignals(row: RawQ, blobLower: string): TopicSpec | null {
  const body = String(row.body_system ?? "").toLowerCase();
  const topic = String(row.topic ?? "").toLowerCase();
  const subtopic = String(row.subtopic ?? "").toLowerCase();
  const merged = `${body} ${topic} ${subtopic} ${blobLower}`;

  const byDirectRegex: Array<{ key: string; test: RegExp }> = [
    { key: "neurological-acute-care", test: /\b(neuro|stroke|seizure|icp|head injury)\b/ },
    { key: "mental-health-crisis", test: /\b(mental|psych|suicid|depress|mania|withdrawal)\b/ },
    { key: "pediatrics-care", test: /\b(pediatric|infant|child|adolescent|newborn)\b/ },
    { key: "maternal-newborn-care", test: /\b(maternal|postpartum|labor|obstetric|newborn|antepartum)\b/ },
    { key: "gastrointestinal-acute-care", test: /\b(gastro|gi|hepatic|pancrea|bowel|ostomy)\b/ },
    { key: "renal-genitourinary-care", test: /\b(renal|gu|urinary|dialysis|ckd|aki)\b/ },
    { key: "hematology-oncology-care", test: /\b(hematolog|anemia|platelet|neutropen|oncolog|transfusion)\b/ },
    { key: "musculoskeletal-care", test: /\b(musculoskeletal|fracture|joint|arthrit|mobility)\b/ },
    { key: "integumentary-burn-wound", test: /\b(integument|wound|burn|pressure injury|skin)\b/ },
    { key: "emergency-triage-disaster", test: /\b(emergency|triage|trauma|mass casualty|rapid response)\b/ },
    { key: "fundamentals-patient-safety", test: /\b(fundamentals|patient safety|aseptic|sterile|documentation)\b/ },
    { key: "sepsis", test: /\bsepsis|septic\b/ },
    { key: "infection-control", test: /\binfection control|isolation|ppe|airborne|droplet|contact precautions\b/ },
    { key: "fluid-balance", test: /\bfluid (volume )?(deficit|excess|overload)|dehydration|hypervolemia|hypovolemia\b/ },
    { key: "potassium-imbalance", test: /\bpotassium|hypokal|hyperkal|K\+\b/ },
    { key: "sodium-imbalance", test: /\bsodium|hyponat|hypernat|Na\+\b/ },
    { key: "insulin-hypoglycemia", test: /\binsulin|hypogly|hypergly|dka|hhs|diabetes\b/ },
  ];

  for (const rule of byDirectRegex) {
    if (rule.test.test(merged)) return topicByKey(rule.key);
  }

  // Lightweight master-topic-map hint pass for additional precision.
  for (const hint of MASTER_HINTS) {
    if (!merged.includes(hint)) continue;
    if (/\b(cardiovascular|heart|myocard|afib|hyperten|shock)\b/.test(hint)) return topicByKey("heart-failure");
    if (/\b(respiratory|abg|copd|asthma|pneumonia|pe)\b/.test(hint)) return topicByKey("copd-respiratory");
    if (/\b(delegation|prioritization|first action|safety)\b/.test(hint)) return topicByKey("prioritization-abcs");
    if (/\b(maternity|postpartum|labor|newborn)\b/.test(hint)) return topicByKey("maternal-newborn-care");
    if (/\b(pediatric|child|infant|adolescent)\b/.test(hint)) return topicByKey("pediatrics-care");
    if (/\b(mental|psych|suicide)\b/.test(hint)) return topicByKey("mental-health-crisis");
    if (/\b(renal|dialysis|urinary)\b/.test(hint)) return topicByKey("renal-genitourinary-care");
  }
  return null;
}

function classifyTopic(row: RawQ): TopicSpec {
  const blobLower = [row.stem, row.rationale, row.topic, row.subtopic, row.body_system]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  for (const spec of TOPICS) {
    if (matchesTopic(row, spec.test)) return spec;
  }
  const fallback = classifyByFallbackSignals(row, blobLower);
  if (fallback) return fallback;
  return CATCH_ALL_SPEC;
}

function isRnTier(t: string) {
  return t.toLowerCase() === "rn";
}
function isPnTier(t: string) {
  const x = t.toLowerCase();
  return x === "rpn" || x === "lvn" || x === "lpn";
}

function correctIdx(raw: RawQ, options: string[]): number | null {
  const ca = raw.correct_answer ?? raw.correctAnswer;
  if (typeof ca === "number" && Number.isInteger(ca) && ca >= 0 && ca < options.length) return ca;
  if (Array.isArray(ca) && ca.length && typeof ca[0] === "number") {
    const i = ca[0] as number;
    if (i >= 0 && i < options.length) return i;
  }
  return null;
}

function toQuiz(row: RawQ, options: string[]): { question: string; options: string[]; correct: number; rationale?: string } {
  const ci = correctIdx(row, options);
  if (ci === null) throw new Error("bad correct");
  return {
    question: row.stem,
    options,
    correct: ci,
    rationale: typeof row.rationale === "string" ? row.rationale : undefined,
  };
}

function caOverlayParagraph(spec: TopicSpec, role: "rn" | "pn"): string {
  const base =
    role === "rn"
      ? `**Canada RN (NCLEX-RN):** Prefer **SI/metric** labs in stems (mmol/L glucose, etc.), **Canadian guideline** phrasing where present, and **provincial** scope language—not US-only statutes. Provincial standards and employer policy govern delegation.`
      : `**Canada RPN (REx-PN-style):** Frame **decision-making within RPN scope**: assignment clarity, **who to notify**, when findings exceed scope, and **safety** over task completion. REx-PN items stress **judgment within role**, not independent medical diagnosis.`;
  const scope =
    spec.bodySystem === "General" || spec.key === "delegation"
      ? role === "pn"
        ? ` **Assignment:** Know what may be **delegated** vs **retained** under college standards; unclear orders → **clarify** before acting.`
        : ` **Scope:** Follow **provincial college** expectations—not US **Nurse Practice Act** distractors verbatim.`
      : "";
  return `${base}${scope}`;
}

function usRnOverlayBlock(): string {
  return `\n\n**US RN (NCLEX-RN):** Prioritize **airway–breathing–circulation** and **unstable vs stable** framing. Watch **delegation** traps: what must stay with the RN when the client is **deteriorating** vs what is appropriate for the **UAP/LPN** when stable and within competency.`;
}

function usPnOverlayBlock(): string {
  return `\n\n**US PN (NCLEX-PN):** Expect **task-based** care for **stable** clients, **clear orders**, and **prompt RN report** when assessment exceeds PN scope. Favor **concrete nursing actions** over independent diagnostic or prescribing decisions.`;
}

function prioritizationLogicBlock(track: "rn" | "pn"): string {
  if (track === "rn") {
    return `\n\n**Prioritization logic:** **Actual problems before potential**; **acute before chronic**; **unstable before stable**. When several clients compete, pick whoever **deteriorates fastest without** the ordered nursing action.`;
  }
  return `\n\n**Scope logic:** Choose what is **clearly within PN practice** (monitoring, ADLs, ordered treatments, reinforcement of teaching). When unsure, favor **clarify or notify the RN** over **independent clinical decisions**.`;
}

function prioritizationFirstBlock(track: "rn" | "pn"): string {
  if (track === "rn") {
    return `\n\n**What do you do first (RN)?** Use **ABCs**, then immediate **safety and harm reduction**. Among similar options, choose what **addresses the greatest risk now** or closes the **critical data gap** before less urgent tasks.`;
  }
  return `\n\n**What do you do first (PN)?** With **stable** clients, complete **time-sensitive** and **safety-linked** tasks first. If a finding suggests **instability** or is **outside the plan**, **pause, assess, and notify the RN** per policy—not silent task completion.`;
}

function nclexTrapBlock(track: "rn" | "pn"): string {
  if (track === "rn") {
    return `\n\n**Exam traps (RN):** Do not **delay an unstable** client for routines. **Delegation** stays with the RN for **assessment and teaching** when risk is high. Wrong answers often **skip assessment**, **delay escalation**, or **delegate** what must stay RN-level.`;
  }
  return `\n\n**Exam traps (PN):** **Scope**—carry out orders, observe, and report; do not **independently diagnose** or **prescribe**. Seductive options may **act outside orders** or **hide** a change that needs RN notification.`;
}

function fiveSections(
  spec: TopicSpec,
  role: "us" | "ca",
  track: "rn" | "pn",
  nclexEnhanced = false,
): Record<string, unknown>[] {
  const caBlock = role === "ca" ? `\n\n${caOverlayParagraph(spec, track)}` : "";
  const usRn = role === "us" && track === "rn" ? usRnOverlayBlock() : "";
  const usPn = role === "us" && track === "pn" ? usPnOverlayBlock() : "";
  const enh =
    nclexEnhanced && role === "us"
      ? `${prioritizationLogicBlock(track)}${prioritizationFirstBlock(track)}${nclexTrapBlock(track)}`
      : "";
  return [
    {
      id: "clinical_meaning",
      heading: "Clinical meaning",
      kind: "clinical_meaning",
      body: `**${spec.label}** items test whether you connect assessment data to risk: what changes first, what needs escalation, and what teaching or orders are unsafe in context.${caBlock}${usRn}${usPn}${enh}`,
    },
    {
      id: "exam_relevance",
      heading: "Exam relevance",
      kind: "exam_relevance",
      body: `Expect **prioritization**, **monitoring**, and **safety**—especially when the stem adds routine tasks alongside an abnormal finding.${role === "ca" ? " Canadian items may use metric units and Canadian care settings; the judgment pattern is the same." : ""}${role === "us" && track === "rn" ? " **US:** NCLEX-style **who to see first** and **which order to question**." : ""}${role === "us" && track === "pn" ? " **US:** NCLEX-PN stresses **safe sequencing** of delegated care." : ""}${role === "ca" && track === "pn" ? " **Canada:** REx-PN may emphasize **assignment**, **communication**, and **scope boundaries**." : ""}`,
    },
    {
      id: "core_concept",
      heading: "Core concept",
      kind: "core_concept",
      body: `Tie interventions to the underlying pattern (perfusion, oxygenation, infection burden, electrolyte shifts, or glucose–insulin dynamics) and the monitoring that proves the intervention is working.`,
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario",
      kind: "clinical_scenario",
      body:
        track === "pn"
          ? `You have multiple tasks; one client shows a **new finding** that could worsen without action. Choose the **scope-safe** move: assess/report per order, delegate only what policy allows, and escalate when instability is likely.${role === "ca" ? " **RPN:** clarify **assignment**, document **concerns**, and escalate per college expectations—not autonomous medical decisions." : " **PN:** stay within **NCLEX-PN** task and reporting expectations."}`
          : `You are managing competing priorities. Choose the client whose **risk rises fastest** without nursing intervention—then the assessment or order that matches that risk.${role === "ca" ? " Use Canadian acute-care context when the stem references units or roles." : ""}`,
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: `- Link **vitals + labs + story** before teaching or discharge.\n- Eliminate options that **skip assessment** or **delay escalation** when data show instability.\n- **Bank:** drill items tagged \`topic:${spec.key}\` from imported Replit MCQs.${role === "ca" ? "\n- **Canada:** watch for **metric labs** and **college / REx-PN** scope language in PN stems." : "\n- **US RN:** review **delegation** and **prioritization** rules for unstable presentations."}${role === "us" && track === "pn" ? "\n- **US PN:** rehearse **stable-client** tasks and **when to stop and notify** the RN." : ""}`,
    },
  ];
}

function normalizeRegionScope(rs: string | null | undefined): "US_ONLY" | "CA_ONLY" | "BOTH" {
  const u = String(rs ?? "BOTH")
    .trim()
    .toUpperCase()
    .replace(/-/g, "_");
  if (u === "US" || u === "US_ONLY") return "US_ONLY";
  if (u === "CA" || u === "CAN" || u === "CA_ONLY") return "CA_ONLY";
  if (u === "BOTH") return "BOTH";
  return "BOTH";
}

/** Classify PN rows for preset pools (Replit uses tier `rpn` for both tracks). */
function pnTrack(row: RawQ): "nclex-pn-us" | "rex-pn-ca" {
  if (MATERIALIZE_US_NCLEX_ONLY) {
    return "nclex-pn-us";
  }
  const raw = String(row.region_scope ?? "BOTH").trim().toUpperCase();
  const ex = String(row.exam ?? "");
  if (raw === "US") return "nclex-pn-us";
  if (raw === "CA" || raw === "CAN") return "rex-pn-ca";
  if (/NCLEX-PN/i.test(ex)) return "nclex-pn-us";
  if (/REX-PN|REx-PN|RPN-CAT/i.test(ex)) return "rex-pn-ca";
  return "rex-pn-ca";
}

function materializedQuestionTier(row: RawQ): "rn" | "rpn" | "lvn" {
  const t = String(row.tier).toLowerCase();
  if (t === "rn") return "rn";
  if (t === "rpn") return "rpn";
  if (t === "lvn" || t === "lpn") return "lvn";
  return "rn";
}

function examTagForRow(mTier: "rn" | "rpn" | "lvn", track: "nclex-pn-us" | "rex-pn-ca" | null): string {
  if (mTier === "rn") return "NCLEX-RN";
  if (mTier === "rpn" || mTier === "lvn") {
    return track === "nclex-pn-us" ? "NCLEX-PN" : "REx-PN";
  }
  return "NCLEX-RN";
}

function flashTierLabel(row: RawQ): "RN" | "RPN" | "LVN_LPN" {
  const m = materializedQuestionTier(row);
  if (m === "rn") return "RN";
  if (m === "rpn") return "RPN";
  return "LVN_LPN";
}

function examLabelForRow(row: RawQ, isPn: boolean): string {
  const ex = String(row.exam ?? "").trim();
  if (ex.length > 0) return ex.length > 80 ? ex.slice(0, 80) : ex;
  return isPn ? "NCLEX-PN" : "NCLEX-RN";
}

function sourceExamTagFragment(row: RawQ): string {
  const ex = String(row.exam ?? "unknown")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return ex || "unknown";
}

function polishStem(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function hasDuplicateOptions(opts: string[]): boolean {
  const norm = opts.map((o) => o.trim().toLowerCase());
  return new Set(norm).size !== norm.length;
}

const ALL_LESSON_SPECS: TopicSpec[] = [...TOPICS, CATCH_ALL_SPEC];

function main() {
  const rawList = JSON.parse(fs.readFileSync(REPLIT, "utf8")) as RawQ[];
  const usedStemHashes = new Set<string>();
  const questionsOut: Record<string, unknown>[] = [];
  const sourceMap: Record<string, string[]> = {};
  for (const spec of ALL_LESSON_SPECS) {
    sourceMap[spec.key] = [];
  }

  let skippedNotPublished = 0;
  let skippedInvalidMcq = 0;
  let skippedNonNursingTier = 0;
  let skippedStemDedupe = 0;
  let skippedCanadaOnly = 0;
  let questionsWithQualityFlags = 0;

  const sorted = [...rawList].sort((a, b) => a.id.localeCompare(b.id));

  for (const row of sorted) {
    if (row.status !== "published") {
      skippedNotPublished += 1;
      continue;
    }
    const opts = optArray(row.options);
    if (!opts || !correctTexts(row, opts)) {
      skippedInvalidMcq += 1;
      continue;
    }
    const tierStr = String(row.tier);
    if (!isRnTier(tierStr) && !isPnTier(tierStr)) {
      skippedNonNursingTier += 1;
      continue;
    }
    const regionScopeEarly = normalizeRegionScope(row.region_scope);
    if (MATERIALIZE_US_NCLEX_ONLY && regionScopeEarly === "CA_ONLY") {
      skippedCanadaOnly += 1;
      continue;
    }
    const stemPolished = polishStem(row.stem);
    const sh = stemHash(stemPolished);
    if (usedStemHashes.has(sh)) {
      skippedStemDedupe += 1;
      continue;
    }
    usedStemHashes.add(sh);

    const spec = classifyTopic(row);
    sourceMap[spec.key]!.push(row.id);

    const tierLower = tierStr.toLowerCase();
    const isPn = isPnTier(tierLower);
    const mTier = materializedQuestionTier(row);
    const track = isPn ? pnTrack(row) : null;
    const examNorm = examTagForRow(mTier, track);
    const exam =
      MATERIALIZE_US_NCLEX_ONLY && isPn
        ? "NCLEX-PN"
        : MATERIALIZE_US_NCLEX_ONLY && !isPn
          ? "NCLEX-RN"
          : examLabelForRow(row, isPn);
    const diff = typeof row.difficulty === "number" ? row.difficulty : 3;
    const presetTag = isPn ? PRESET_PN_TAG : PRESET_RN_TAG;
    const isCatchAll = spec.key === CATCH_ALL_SPEC.key;
    const priority = isCatchAll ? "priority:low" : "priority:high";
    const regionScope = regionScopeEarly;

    const countryTags: string[] = MATERIALIZE_US_NCLEX_ONLY
      ? ["country:US"]
      : regionScope === "US_ONLY"
        ? ["country:US"]
        : regionScope === "CA_ONLY"
          ? ["country:CA"]
          : ["country:US", "country:CA"];

    const overlayExam =
      mTier === "rn"
        ? MATERIALIZE_US_NCLEX_ONLY
          ? "overlay:us-nclex-rn"
          : regionScope === "CA_ONLY"
            ? "overlay:ca-nclex-rn"
            : regionScope === "US_ONLY"
              ? "overlay:us-nclex-rn"
              : "overlay:nclex-rn-transnational"
        : track === "nclex-pn-us"
          ? "overlay:nclex-pn-us"
          : "overlay:rex-pn-ca";

    const tags = new Set<string>([
      BATCH_TAG,
      SPRINT_TAG,
      presetTag,
      `topic:${spec.key}`,
      `category:${spec.categorySlug}`,
      `exam:${examNorm}`,
      `difficulty:${diff}`,
      priority,
      "source:replit-exam_questions.json",
      "materialization:full-bank",
      `sourceExam:${sourceExamTagFragment(row)}`,
      overlayExam,
      regionScope === "BOTH" ? "overlay:region-both" : `overlay:region-${regionScope.toLowerCase().replace("_", "-")}`,
      ...countryTags,
    ]);

    if (mTier === "rn") {
      tags.add("nclex-rn:prioritization-unstable-delegation");
    }
    if (mTier === "rpn" || mTier === "lvn") {
      tags.add("nclex-pn:stable-tasks-scope");
    }

    if (mTier === "rn") {
      if (MATERIALIZE_US_NCLEX_ONLY) {
        if (!isCatchAll) tags.add(PRESET_US_RN_FULL_TAG);
      } else {
        if (regionScope === "US_ONLY" || regionScope === "BOTH") tags.add(PRESET_US_RN_FULL_TAG);
        if (regionScope === "CA_ONLY" || regionScope === "BOTH") tags.add(PRESET_CA_RN_FULL_TAG);
      }
    }
    if ((mTier === "rpn" || mTier === "lvn") && track) {
      if (MATERIALIZE_US_NCLEX_ONLY) {
        if (!isCatchAll) tags.add(PRESET_US_PN_FULL_TAG);
      } else {
        if (track === "nclex-pn-us") tags.add(PRESET_US_PN_FULL_TAG);
        if (track === "rex-pn-ca") tags.add(PRESET_CA_RPN_FULL_TAG);
      }
    }

    let rationale = typeof row.rationale === "string" ? row.rationale.trim() : "";
    const qualityTags: string[] = [];
    if (stemPolished.length < 42) qualityTags.push("quality:short-stem");
    if (hasDuplicateOptions(opts)) qualityTags.push("quality:duplicate-options");
    if (rationale.length < 24) {
      rationale = `This item tests nursing judgment for **${spec.label}**. Compare options for **safety**, **scope**, and the **first nursing action** the stem implies.`;
      qualityTags.push("quality:synthetic-rationale");
    }
    for (const qt of qualityTags) tags.add(qt);
    if (qualityTags.length) questionsWithQualityFlags += 1;

    const rowOut: Record<string, unknown> = {
      id: row.id,
      stem: stemPolished,
      options: opts.map((o) => o.trim()),
      correctAnswer: correctTexts(row, opts)!,
      questionType: "multiple_choice",
      tier: mTier,
      exam,
      status: "published",
      regionScope,
      careerType: "nursing",
      rationale,
      topic: spec.label,
      bodySystem: row.body_system ?? spec.bodySystem,
      tags: Array.from(tags),
      difficulty: diff,
      stemHash: sh,
    };
    if (MATERIALIZE_US_NCLEX_ONLY) rowOut.countryCode = "US";
    else if (regionScope === "US_ONLY") rowOut.countryCode = "US";
    else if (regionScope === "CA_ONLY") rowOut.countryCode = "CA";
    questionsOut.push(rowOut);
  }

  const catalogUsRn: Record<string, unknown>[] = [];
  const catalogUsPn: Record<string, unknown>[] = [];
  const catalogCaRn: Record<string, unknown>[] = [];
  const catalogCaRpn: Record<string, unknown>[] = [];

  for (const spec of ALL_LESSON_SPECS) {
    const pickedIds = sourceMap[spec.key] ?? [];
    if (pickedIds.length === 0) continue;
    const picked = pickedIds
      .map((id) => rawList.find((r) => r.id === id))
      .filter((r): r is RawQ => !!r)
      .sort((a, b) => a.id.localeCompare(b.id));

    const preRaw = picked.slice(0, Math.min(5, picked.length));
    const postRaw = picked.slice(5, Math.min(15, picked.length));
    const preTest = preRaw.map((r) => toQuiz(r, optArray(r.options)!));
    const postTest = postRaw.map((r) => toQuiz(r, optArray(r.options)!));

    const enhanced = NCLEX_ENHANCED_TOPIC_KEYS.has(spec.key);
    catalogUsRn.push({
      slug: `us-rn-${spec.key}`,
      title: `${spec.label} (NCLEX-RN, US)`,
      topic: spec.label,
      topicSlug: spec.topicSlug,
      bodySystem: spec.bodySystem,
      previewSectionCount: 1,
      seoTitle: `${spec.label} | NCLEX-RN US | NurseNest`,
      seoDescription: `US RN: ${spec.label.toLowerCase()} — Replit-sourced bank, five-section lesson.`,
      sections: fiveSections(spec, "us", "rn", enhanced),
      preTest,
      postTest,
    });

    catalogUsPn.push({
      slug: `us-pn-${spec.key}`,
      title: `${spec.label} — PN scope (NCLEX-PN, US)`,
      topic: spec.label,
      topicSlug: spec.topicSlug,
      bodySystem: spec.bodySystem,
      previewSectionCount: 1,
      seoTitle: `${spec.label} | NCLEX-PN US | NurseNest`,
      seoDescription: `US PN scope overlay for ${spec.label.toLowerCase()}.`,
      sections: fiveSections(spec, "us", "pn", enhanced),
      preTest,
      postTest: postTest.slice(0, Math.min(8, postTest.length)),
    });

    if (!MATERIALIZE_US_NCLEX_ONLY) {
      catalogCaRn.push({
        slug: `ca-rn-${spec.key}`,
        title: `${spec.label} (NCLEX-RN, Canada)`,
        topic: spec.label,
        topicSlug: spec.topicSlug,
        bodySystem: spec.bodySystem,
        previewSectionCount: 1,
        seoTitle: `${spec.label} | NCLEX-RN Canada | NurseNest`,
        seoDescription: `Canada RN context: ${spec.label.toLowerCase()} with metric/scope-aware framing.`,
        sections: fiveSections(spec, "ca", "rn", false),
        preTest,
        postTest,
      });
      catalogCaRpn.push({
        slug: `ca-rpn-${spec.key}`,
        title: `${spec.label} (REx-PN / PN, Canada)`,
        topic: spec.label,
        topicSlug: spec.topicSlug,
        bodySystem: spec.bodySystem,
        previewSectionCount: 1,
        seoTitle: `${spec.label} | REx-PN Canada | NurseNest`,
        seoDescription: `Canada PN: ${spec.label.toLowerCase()} with REx-PN-style scope emphasis.`,
        sections: fiveSections(spec, "ca", "pn", false),
        preTest,
        postTest: postTest.slice(0, Math.min(8, postTest.length)),
      });
    }
  }

  const flashcardTarget = Math.min(
    FLASHCARDS_MAX,
    Math.max(TARGET_FLASHCARDS_MIN, Math.floor(questionsOut.length / 12)),
  );
  const flashcards: Record<string, unknown>[] = [];
  let fidx = 0;
  const seenFlashFront = new Set<string>();
  const questionById = new Map(
    questionsOut.map((q) => [String(q.id), q as { rationale?: string; tags?: string[]; stem: string }]),
  );
  const topicByKey = new Map(ALL_LESSON_SPECS.map((s) => [s.key, s] as const));
  const flashSpecsOrder: TopicSpec[] = [
    ...FLASHCARD_PRIORITY_KEYS.map((k) => topicByKey.get(k)).filter((x): x is TopicSpec => !!x),
    ...ALL_LESSON_SPECS.filter((s) => !FLASHCARD_PRIORITY_KEYS.includes(s.key)),
  ];

  function pushFlashcardsForTopic(spec: TopicSpec, includeSyntheticRationale: boolean) {
    const ids = sourceMap[spec.key] ?? [];
    const rowsForTopic = ids
      .map((id) => rawList.find((r) => r.id === id))
      .filter((r): r is RawQ => !!r);
    for (const r of rowsForTopic) {
      if (flashcards.length >= flashcardTarget) return;
      const materialized = questionById.get(r.id);
      if (!materialized) continue;
      const qTags = new Set(materialized.tags ?? []);
      const synthetic = qTags.has("quality:synthetic-rationale");
      if (synthetic && !includeSyntheticRationale) continue;
      const rat = typeof materialized.rationale === "string" ? materialized.rationale.trim() : "";
      if (rat.length < 40) continue;
      const stemUse = polishStem(materialized.stem);
      const fp = stemUse.slice(0, 48).toLowerCase();
      if (seenFlashFront.has(fp)) continue;
      seenFlashFront.add(fp);
      const stemShort = stemUse.length > 120 ? `${stemUse.slice(0, 117)}…` : stemUse;
      const rs = normalizeRegionScope(r.region_scope);
      flashcards.push({
        id: `fc2026s2_${spec.key}_${fidx}`,
        front: stemShort,
        back: rat.slice(0, 900),
        country: MATERIALIZE_US_NCLEX_ONLY ? "US" : rs === "CA_ONLY" ? "CA" : "US",
        tier: flashTierLabel(r),
        topicKey: spec.key,
        categorySlug: spec.categorySlug,
        sourceQuestionId: r.id,
      });
      fidx += 1;
    }
  }

  // Pass 1: prefer strongest non-synthetic rationales.
  for (const spec of flashSpecsOrder) {
    if (flashcards.length >= flashcardTarget) break;
    pushFlashcardsForTopic(spec, false);
  }
  // Pass 2: preserve target counts with synthetic fallback only if needed.
  for (const spec of flashSpecsOrder) {
    if (flashcards.length >= flashcardTarget) break;
    pushFlashcardsForTopic(spec, true);
  }

  const topicCounts = Object.fromEntries(ALL_LESSON_SPECS.map((s) => [s.key, (sourceMap[s.key] ?? []).length]));
  const emittedRn = questionsOut.filter((q) => q.tier === "rn").length;
  const emittedRpn = questionsOut.filter((q) => q.tier === "rpn").length;
  const emittedLvn = questionsOut.filter((q) => q.tier === "lvn").length;
  const withUsRnPreset = questionsOut.filter((q) => (q.tags as string[]).includes(PRESET_US_RN_FULL_TAG)).length;
  const withCaRnPreset = questionsOut.filter((q) => (q.tags as string[]).includes(PRESET_CA_RN_FULL_TAG)).length;
  const withUsPnPreset = questionsOut.filter((q) => (q.tags as string[]).includes(PRESET_US_PN_FULL_TAG)).length;
  const withCaRpnPreset = questionsOut.filter((q) => (q.tags as string[]).includes(PRESET_CA_RPN_FULL_TAG)).length;
  const tagSet = (q: Record<string, unknown>) => new Set<string>((q.tags as string[]) ?? []);
  const countryDistribution = {
    /** Both `country:US` and `country:CA` tags (BOTH region_scope). */
    taggedBothCountries: questionsOut.filter((q) => {
      const t = tagSet(q);
      return t.has("country:US") && t.has("country:CA");
    }).length,
    usTagOnly: questionsOut.filter((q) => {
      const t = tagSet(q);
      return t.has("country:US") && !t.has("country:CA");
    }).length,
    caTagOnly: questionsOut.filter((q) => {
      const t = tagSet(q);
      return t.has("country:CA") && !t.has("country:US");
    }).length,
  };
  const generationStats = {
    sourceFile: "data/replit-exports/exam_questions.json",
    rawRows: rawList.length,
    emittedQuestions: questionsOut.length,
    emittedByMaterializedTier: { rn: emittedRn, rpn: emittedRpn, lvn: emittedLvn },
    presetPoolCounts: {
      usRnFull: withUsRnPreset,
      caRnFull: withCaRnPreset,
      usPnFull: withUsPnPreset,
      caRpnFull: withCaRpnPreset,
    },
    countryTagDistribution: countryDistribution,
    skippedNotPublished,
    skippedInvalidMcq,
    skippedNonNursingTier,
    skippedStemDedupe,
    skippedCanadaOnly: MATERIALIZE_US_NCLEX_ONLY ? skippedCanadaOnly : 0,
    questionsWithQualityFlags,
    nclexEnhancedLessonTopicKeys: [...NCLEX_ENHANCED_TOPIC_KEYS],
    catchAllTopicKey: CATCH_ALL_SPEC.key,
    catchAllMappedCount: sourceMap[CATCH_ALL_SPEC.key]?.length ?? 0,
    topicQuestionCounts: topicCounts,
    dedupe: { method: "stemHash(trim+lowercase)", note: "first row by stable id sort wins" },
    flashcardTarget,
    weakAreasRemaining: [
      (sourceMap[CATCH_ALL_SPEC.key]?.length ?? 0) > 2500
        ? "Many items still classify to general-nursing-clinical; refine TOPICS regexes over time to sharpen quizzes."
        : null,
      questionsWithQualityFlags > 0
        ? `${questionsWithQualityFlags} questions carry quality:* tags (short stem, duplicate options, or synthetic rationale)—curate incrementally.`
        : null,
    ].filter((x): x is string => typeof x === "string" && x.length > 0),
  };

  const practicePresetExport: Record<string, unknown>[] = [
    {
      id: "preset_mixed_2026_rn_pn",
      examId: "exam_mixed_practice_2026_rn_pn",
      tag: BATCH_TAG,
      title: "Mixed RN/PN — full batch (20)",
      questionCount: 20,
    },
    {
      id: "preset_rn_mixed_2026",
      examId: "exam_rn_mixed_practice_2026",
      tag: PRESET_RN_TAG,
      title: "RN mixed practice (20)",
      questionCount: 20,
      tierFilter: "rn",
    },
    {
      id: "preset_pn_mixed_2026",
      examId: "exam_pn_mixed_practice_2026",
      tag: PRESET_PN_TAG,
      title: "PN mixed practice (20)",
      questionCount: 20,
      tierFilter: "pn",
    },
    {
      id: "preset_us_rn_full_2026",
      examId: "exam_us_rn_full_2026",
      tag: PRESET_US_RN_FULL_TAG,
      title: "NCLEX-RN full practice (75)",
      questionCount: FULL_EXAM_QUESTION_TARGET,
      tierFilter: "rn",
    },
    {
      id: "preset_us_pn_full_2026",
      examId: "exam_us_pn_full_2026",
      tag: PRESET_US_PN_FULL_TAG,
      title: "NCLEX-PN full practice (75)",
      questionCount: FULL_EXAM_QUESTION_TARGET,
      tierFilter: "rpn",
    },
  ];
  if (!MATERIALIZE_US_NCLEX_ONLY) {
    practicePresetExport.push(
      {
        id: "preset_ca_rn_full_2026",
        examId: "exam_ca_rn_full_2026",
        tag: PRESET_CA_RN_FULL_TAG,
        title: "Canada NCLEX-RN full practice (75)",
        questionCount: FULL_EXAM_QUESTION_TARGET,
        tierFilter: "rn",
      },
      {
        id: "preset_ca_rpn_full_2026",
        examId: "exam_ca_rpn_full_2026",
        tag: PRESET_CA_RPN_FULL_TAG,
        title: "Canada REx-PN / RPN full practice (75)",
        questionCount: FULL_EXAM_QUESTION_TARGET,
        tierFilter: "rpn",
      },
    );
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "questions.json"), JSON.stringify(questionsOut), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "flashcards.json"), JSON.stringify(flashcards, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "generation-stats.json"), JSON.stringify(generationStats, null, 2), "utf8");
  fs.writeFileSync(
    path.join(OUT_DIR, "source-map.json"),
    JSON.stringify(
      {
        file: "data/replit-exports/exam_questions.json",
        generated: "sprint2-full-bank",
        stats: generationStats,
        topics: sourceMap,
      },
      null,
      2,
    ),
    "utf8",
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "catalog-lessons.json"),
    JSON.stringify({ usRn: catalogUsRn, usPn: catalogUsPn, caRn: catalogCaRn, caRpn: catalogCaRpn }, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "practice-exam-presets.json"),
    JSON.stringify(practicePresetExport, null, 2),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        lessonTopicSpecs: ALL_LESSON_SPECS.length,
        questions: questionsOut.length,
        flashcards: flashcards.length,
        lessonsUsRn: catalogUsRn.length,
        lessonsUsPn: catalogUsPn.length,
        lessonsCaRn: catalogCaRn.length,
        lessonsCaRpn: catalogCaRpn.length,
        stats: generationStats,
      },
      null,
      2,
    ),
  );
}

main();
