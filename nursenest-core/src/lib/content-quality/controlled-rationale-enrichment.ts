import { stripToPlainText } from "@/lib/content-quality/plain-text";

export const HIGH_YIELD_RATIONALE_BATCHES = [
  {
    id: "electrolytes",
    patterns: [/\belectrolyte|potassium|hyperkal|hypokal|sodium|hyponat|hypernat|calcium|magnesium|phosphate|electrolyte imbalance\b/i],
    examTip: "Trend labs with symptoms and ECG changes; treat unstable findings first.",
  },
  {
    id: "abg_acid_base",
    patterns: [/\babg|acid[\s-]?base|metabolic acidosis|metabolic alkalosis|respiratory acidosis|respiratory alkalosis|ph\b/i],
    examTip: "Classify pH first, then PaCO2/HCO3 to identify the primary process before selecting the intervention.",
  },
  {
    id: "cardiac",
    patterns: [/\bcardiac|cardiovascular|acs|stemi|nstemi|angina|arrhythm|heart failure|troponin|ecg|hemodynamic|perfusion\b/i],
    examTip: "Prioritize perfusion and rhythm instability; escalate rapidly for ischemic or hemodynamic red flags.",
  },
  {
    id: "respiratory",
    patterns: [/\brespiratory|hypox|oxygenation|ventilat|mechanical ventilation|copd|asthma|peep|airway\b/i],
    examTip: "Address airway and oxygenation first, then reassess response before advancing therapy.",
  },
  {
    id: "shock_sepsis",
    patterns: [/\bshock|sepsis|septic|lactate|qsofa|sofa|perfusion\b/i],
    examTip: "Early recognition and rapid bundle actions matter more than waiting for complete diagnostics.",
  },
  {
    id: "neuro_emergencies",
    patterns: [/\bstroke|cva|icp|intracranial|neuro|seizure|herniat|cushing\b/i],
    examTip: "Watch for acute neuro deterioration and protect airway while escalating time-critical care.",
  },
  {
    id: "endocrine_crises",
    patterns: [/\bdka|hhs|thyroid storm|myxedema|adrenal crisis|hypoglyc|hyperglyc\b/i],
    examTip: "Stabilize glucose and fluid status first; monitor for rapid shifts in electrolytes and mentation.",
  },
  {
    id: "high_alert_pharmacology",
    patterns: [/\bhigh[\s-]?alert|insulin|heparin|opioid|vasopressor|anticoagul|look[\s-]?alike|sound[\s-]?alike\b/i],
    examTip: "Use independent double-checks and verify dosing context before administration.",
  },
  {
    id: "prioritization_delegation",
    patterns: [/\bprioritiz|delegat|triage|first action|most urgent|uap|assignment\b/i],
    examTip: "Choose the action that addresses immediate instability and keep delegation within scope.",
  },
] as const;

export type HighYieldRationaleBatchId = (typeof HIGH_YIELD_RATIONALE_BATCHES)[number]["id"];

export type ControlledRationaleSeed = {
  stem?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
  tags?: string[] | null;
  questionType?: string | null;
  correctAnswers?: string[];
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  clinicalReasoning?: string | null;
  distractorNotes?: string | null;
  keyTakeaway?: string | null;
  examStrategy?: string | null;
};

export type ControlledRationaleEnrichment = {
  batchId: HighYieldRationaleBatchId | null;
  applied: boolean;
  whyCorrect: string;
  whyWrong: string;
  clinicalPearl: string;
  topicAnchor: string | null;
  skippedReason?: string;
  diagnostics?: {
    sourceAnchorCount: number;
    sourceAnchorWordCount: number;
    minimumSubstanceMet: boolean;
    matchPrecision?: "true_positive_estimate" | "borderline" | "false_positive";
    topInclusionTrigger?: string | null;
    topExclusionTrigger?: string | null;
    inclusionHitCount?: number;
    exclusionHitCount?: number;
  };
};

const FILLER_PHRASES = [
  "this is important because nurses must know",
  "it is important to remember",
  "always use clinical judgment",
  "nurses should know this",
];

function wordCount(text: string): number {
  return stripToPlainText(text)
    .split(/\s+/)
    .filter(Boolean).length;
}

function normalizeSentenceSpacing(text: string): string {
  return stripToPlainText(text).replace(/\s+/g, " ").trim();
}

function containsFiller(text: string): boolean {
  const plain = normalizeSentenceSpacing(text).toLowerCase();
  return FILLER_PHRASES.some((p) => plain.includes(p));
}

function splitSentences(text: string | null | undefined): string[] {
  const clean = normalizeSentenceSpacing(text ?? "");
  if (!clean) return [];
  return clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 18);
}

function chooseSubstantiveSentences(text: string | null | undefined, maxSentences = 2): string[] {
  const all = splitSentences(text);
  if (all.length === 0) return [];
  const strong = all.filter((s) => wordCount(s) >= 8 && !containsFiller(s));
  return (strong.length > 0 ? strong : all).slice(0, maxSentences);
}

function dedupeSentences(lines: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    const key = normalizeSentenceSpacing(line).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(normalizeSentenceSpacing(line));
  }
  return out;
}

function clipWords(text: string, maxWords: number): string {
  const words = normalizeSentenceSpacing(text).split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}…`;
}

type TriggerRule = { id: string; re: RegExp };
type PrecisionGateResult = {
  matched: boolean;
  precision: "true_positive_estimate" | "borderline" | "false_positive";
  inclusionHits: string[];
  exclusionHits: string[];
};

const ELECTROLYTE_STRONG_INCLUDE_RULES: TriggerRule[] = [
  { id: "potassium_disorder", re: /\b(hyperkal|hypokal|k\+|potassium(?:\s+(?:level|shift|replacement|repletion|supplement))?)\b/i },
  { id: "sodium_disorder", re: /\b(hyponat|hypernat|na\+|sodium(?:\s+(?:level|correction|replacement|disorder|imbalance))?)\b/i },
  { id: "calcium_disorder", re: /\b(hypocal|hypercal|ionized calcium|ca\+\+|calcium gluconate|calcium chloride)\b/i },
  { id: "magnesium_disorder", re: /\b(hypomag|hypermag|mg\+\+|magnesium sulfate|magnesium replacement)\b/i },
  { id: "phosphate_disorder", re: /\b(hypophosph|hyperphosph|phosphate(?:\s+(?:level|replacement|repletion))?|phosphorus(?:\s+level)?)\b/i },
  { id: "electrolyte_emergency", re: /\b(electrolyte (?:imbalance|disturbance)|ecg changes|peaked t waves|widened qrs|arrhythmia due to)\b/i },
  { id: "electrolyte_repletion", re: /\b(potassium replacement|magnesium replacement|phosphate repletion|electrolyte protocol|electrolyte replacement|oral rehydration salts?)\b/i },
];

const ELECTROLYTE_CONTEXT_RULES: TriggerRule[] = [
  { id: "electrolyte_context", re: /\b(electrolyte|lab interpretation|clinical chemistry|fluid balance)\b/i },
  { id: "acid_base_overlap", re: /\b(abg|acid[- ]base|hco3|anion gap)\b/i },
];

const ELECTROLYTE_EXCLUSION_RULES: TriggerRule[] = [
  { id: "osteoporosis_only", re: /\b(osteoporosis|denosumab|bisphosphonate)\b/i },
  { id: "diabetes_medication_only", re: /\b(sglt2|glp-?1|metformin titration|a1c goal)\b/i },
  { id: "general_htn_only", re: /\b(resistant hypertension|bp target|antihypertensive regimen)\b/i },
  { id: "non_clinical_meta", re: /\b(replit import|deck cards|placeholder)\b/i },
  { id: "nutrition_general_only", re: /\b(dietary counseling|nutrition education|meal plan)\b/i },
];

function collectTriggerHits(haystack: string, rules: TriggerRule[]): string[] {
  const hits: string[] = [];
  for (const rule of rules) {
    if (rule.re.test(haystack)) hits.push(rule.id);
  }
  return hits;
}

function detectElectrolytesMatch(haystack: string): {
  matched: boolean;
  precision: "true_positive_estimate" | "borderline" | "false_positive";
  inclusionHits: string[];
  exclusionHits: string[];
} {
  const inclusionHits = collectTriggerHits(haystack, ELECTROLYTE_STRONG_INCLUDE_RULES);
  const contextHits = collectTriggerHits(haystack, ELECTROLYTE_CONTEXT_RULES);
  const exclusionHits = collectTriggerHits(haystack, ELECTROLYTE_EXCLUSION_RULES);
  const hasStrong = inclusionHits.length > 0;
  const hasContext = contextHits.length > 0;
  const hasExclusion = exclusionHits.length > 0;

  if (hasStrong && !hasExclusion) {
    return {
      matched: true,
      precision: "true_positive_estimate",
      inclusionHits: [...inclusionHits, ...contextHits],
      exclusionHits,
    };
  }
  if (hasStrong && hasExclusion) {
    return {
      matched: true,
      precision: "borderline",
      inclusionHits: [...inclusionHits, ...contextHits],
      exclusionHits,
    };
  }
  return {
    matched: false,
    precision: hasExclusion ? "false_positive" : "borderline",
    inclusionHits: [...inclusionHits, ...contextHits],
    exclusionHits,
  };
}

const ABG_STRONG_INCLUDE_RULES: TriggerRule[] = [
  { id: "abg_interpretation", re: /\b(abg interpretation|abg results|interpret (?:the )?abg|arterial blood gas results|acid[- ]base interpretation)\b/i },
  { id: "respiratory_acidosis", re: /\b(respiratory acidosis|acute respiratory acidosis|chronic respiratory acidosis)\b/i },
  { id: "respiratory_alkalosis", re: /\b(respiratory alkalosis)\b/i },
  { id: "metabolic_acidosis", re: /\b(metabolic acidosis|anion gap metabolic acidosis|high anion gap acidosis)\b/i },
  { id: "metabolic_alkalosis", re: /\b(metabolic alkalosis)\b/i },
  { id: "compensation_pattern", re: /\b(compensat|partially compensated|uncompensated|mixed acid[- ]base|winter(?:'s)? formula)\b/i },
  { id: "acid_base_decision_sequence", re: /\b(classify pH first|interpret (?:the )?abg|primary disorder)\b/i },
];

const ABG_CONTEXT_RULES: TriggerRule[] = [
  { id: "ventilation_context", re: /\b(hypoventilation|hyperventilation|ventilator|minute ventilation)\b/i },
  { id: "critical_metabolic_context", re: /\b(dka|lactic acidosis|sepsis|renal failure)\b/i },
];

const ABG_EXCLUSION_RULES: TriggerRule[] = [
  { id: "pulmonary_hypertension_only", re: /\b(pulmonary hypertension|pah)\b/i },
  { id: "non_abg_respiratory_workup", re: /\b(spirometry|bronchoscopy|hilar lymphadenopathy|sarcoidosis)\b/i },
  { id: "hematology_lymphoma_only", re: /\b(hodgkin|lymphoma|reed-sternberg|lymphadenopathy)\b/i },
  { id: "oxygen_device_only", re: /\b(venturi|nasal cannula|simple mask|nonrebreather|fio2)\b/i },
  { id: "non_clinical_meta", re: /\b(replit import|deck cards|placeholder)\b/i },
];

function detectAbgAcidBaseMatch(haystack: string): PrecisionGateResult {
  const inclusionHits = collectTriggerHits(haystack, ABG_STRONG_INCLUDE_RULES);
  const contextHits = collectTriggerHits(haystack, ABG_CONTEXT_RULES);
  const exclusionHits = collectTriggerHits(haystack, ABG_EXCLUSION_RULES);
  const tripletSignalCount = [/\bpH\b/i, /\bPaCO2\b/i, /\bHCO3\b/i, /\bbicarbonate\b/i, /\bbase excess\b/i].filter((re) =>
    re.test(haystack),
  ).length;
  const hasTripletContext = /\b(acidosis|alkalosis|acid[- ]base|compensat|anion gap|abg)\b/i.test(haystack);
  const hasTripletRelationship = tripletSignalCount >= 2 && hasTripletContext;
  const allInclusionHits = hasTripletRelationship ? [...inclusionHits, "abg_triplet_relationship"] : inclusionHits;
  const hasStrong = allInclusionHits.length > 0;
  const hasExclusion = exclusionHits.length > 0;
  const specificSignalCount = allInclusionHits.filter((hit) => hit !== "abg_interpretation").length;

  if (hasStrong && hasExclusion && specificSignalCount === 0) {
    return {
      matched: false,
      precision: "false_positive",
      inclusionHits: [...allInclusionHits, ...contextHits],
      exclusionHits,
    };
  }

  if (hasStrong && !hasExclusion) {
    return {
      matched: true,
      precision: "true_positive_estimate",
      inclusionHits: [...allInclusionHits, ...contextHits],
      exclusionHits,
    };
  }
  if (hasStrong && hasExclusion) {
    return {
      matched: true,
      precision: "borderline",
      inclusionHits: [...allInclusionHits, ...contextHits],
      exclusionHits,
    };
  }
  return {
    matched: false,
    precision: hasExclusion ? "false_positive" : "borderline",
    inclusionHits: [...inclusionHits, ...contextHits],
    exclusionHits,
  };
}

const CARDIAC_STRONG_INCLUDE_RULES: TriggerRule[] = [
  { id: "acs_ischemia_mi", re: /\b(acs|acute coronary syndrome|stemi|nstemi|myocardial infarction|mi\b|ischemi|unstable angina|angina)\b/i },
  { id: "arrhythmia_dysrhythmia", re: /\b(arrhythm|dysrhythm|atrial fibrillation|afib|flutter|vtach|vfib|torsades|heart block|bradycardia|tachycardia)\b/i },
  { id: "heart_failure", re: /\b(heart failure|hfrEF|hfpef|decompensated heart failure|pulmonary edema cardiogenic)\b/i },
  { id: "cardiac_output_hemodynamics", re: /\b(cardiac output|preload|afterload|stroke volume|cardiogenic shock)\b/i },
  { id: "ecg_cardiac_interpretation", re: /\b(ecg|ekg|st elevation|st depression|q waves|wide qrs|t wave inversion)\b/i },
  { id: "cardiac_biomarker_context", re: /\b(troponin|ck-mb)\b.*\b(acs|mi\b|ischemi|angina|stemi|nstemi)\b/i },
  { id: "cardiac_emergency_stabilization", re: /\b(cardioversion|defibrillation|code blue|chest pain protocol|cath lab activation)\b/i },
  { id: "cardiac_medication_decision", re: /\b(antiarrhythmic|nitroglycerin|beta[- ]blocker|ace inhibitor|arb|diuretic|inotrope)\b.*\b(heart failure|acs|afib|arrhythm|ischemi|angina)\b/i },
];

const CARDIAC_CONTEXT_RULES: TriggerRule[] = [
  { id: "cardiac_context", re: /\b(cardiac|cardiovascular|hemodynamic|perfusion)\b/i },
  { id: "critical_care_overlap", re: /\b(shock|unstable|hypotension|pressors?)\b/i },
];

const CARDIAC_EXCLUSION_RULES: TriggerRule[] = [
  { id: "hypertension_only", re: /\b(hypertension|htn|bp target|blood pressure control)\b/i },
  { id: "renal_fluid_only", re: /\b(ckd|dialysis|aki|electrolyte imbalance|fluid overload|renal)\b/i },
  { id: "respiratory_only", re: /\b(copd|asthma|peep|oxygenation|ventilation|airway)\b/i },
  { id: "pulmonary_embolism_non_cardiac", re: /\b(pulmonary embolism|submassive pe|massive pe|rv strain from pe)\b/i },
  { id: "medication_only_non_cardiac", re: /\b(insulin|metformin|antibiotic|steroid taper|pain regimen)\b/i },
  { id: "non_cardiac_shock", re: /\b(septic shock|anaphylactic shock|neurogenic shock|hemorrhagic shock)\b/i },
  { id: "non_clinical_meta", re: /\b(replit import|deck cards|placeholder)\b/i },
];

function detectCardiacMatch(haystack: string): PrecisionGateResult {
  const inclusionHits = collectTriggerHits(haystack, CARDIAC_STRONG_INCLUDE_RULES);
  const contextHits = collectTriggerHits(haystack, CARDIAC_CONTEXT_RULES);
  const exclusionHits = collectTriggerHits(haystack, CARDIAC_EXCLUSION_RULES);
  const hasStrong = inclusionHits.length > 0;
  const hasExclusion = exclusionHits.length > 0;
  const hasCardiacConditionSignal = /\b(acs|stemi|nstemi|mi\b|angina|arrhythm|afib|heart failure|cardiogenic|cardiac output|troponin)\b/i.test(
    haystack,
  );
  const hasContextOnly = !hasStrong && contextHits.length > 0;

  if (hasContextOnly) {
    return {
      matched: false,
      precision: "borderline",
      inclusionHits: contextHits,
      exclusionHits,
    };
  }

  if (hasStrong && hasExclusion && !hasCardiacConditionSignal) {
    return {
      matched: false,
      precision: "false_positive",
      inclusionHits: [...inclusionHits, ...contextHits],
      exclusionHits,
    };
  }

  if (hasStrong && !hasExclusion) {
    return {
      matched: true,
      precision: "true_positive_estimate",
      inclusionHits: [...inclusionHits, ...contextHits],
      exclusionHits,
    };
  }
  if (hasStrong && hasExclusion) {
    return {
      matched: true,
      precision: "borderline",
      inclusionHits: [...inclusionHits, ...contextHits],
      exclusionHits,
    };
  }
  return {
    matched: false,
    precision: hasExclusion ? "false_positive" : "borderline",
    inclusionHits: [...inclusionHits, ...contextHits],
    exclusionHits,
  };
}

function detectBatch(seed: ControlledRationaleSeed): HighYieldRationaleBatchId | null {
  const haystack = [
    seed.topic,
    seed.subtopic,
    seed.bodySystem,
    seed.stem,
    ...(seed.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");
  if (!haystack.trim()) return null;
  const electrolyteGate = detectElectrolytesMatch(haystack);
  if (electrolyteGate.matched) return "electrolytes";
  const abgGate = detectAbgAcidBaseMatch(haystack);
  if (abgGate.matched) return "abg_acid_base";
  const cardiacGate = detectCardiacMatch(haystack);
  if (cardiacGate.matched) return "cardiac";
  const match = HIGH_YIELD_RATIONALE_BATCHES.find(
    (batch) =>
      batch.id !== "electrolytes" &&
      batch.id !== "abg_acid_base" &&
      batch.id !== "cardiac" &&
      batch.patterns.some((re) => re.test(haystack)),
  );
  return match?.id ?? null;
}

function buildTopicAnchor(seed: ControlledRationaleSeed): string | null {
  const parts = [seed.topic, seed.subtopic, seed.bodySystem].filter((x): x is string => Boolean(x && x.trim()));
  if (parts.length === 0) return null;
  return dedupeSentences([parts.join(" · ")])[0] ?? null;
}

function buildWhyCorrect(seed: ControlledRationaleSeed): string {
  const candidates = dedupeSentences([
    ...chooseSubstantiveSentences(seed.correctAnswerExplanation, 2),
    ...chooseSubstantiveSentences(seed.rationale, 2),
    ...chooseSubstantiveSentences(seed.clinicalReasoning, 2),
  ]);
  if (candidates.length === 0) return "Clinical reasoning is not yet on file for this item.";
  return clipWords(candidates.join(" "), 70);
}

function buildWhyWrong(seed: ControlledRationaleSeed): string {
  const distractor = normalizeSentenceSpacing(seed.distractorNotes ?? "");
  if (wordCount(distractor) >= 10 && !containsFiller(distractor)) {
    return clipWords(distractor, 85);
  }
  return "Detailed distractor explanations are not available for this item yet.";
}

function buildClinicalPearl(seed: ControlledRationaleSeed, batchId: HighYieldRationaleBatchId | null): string {
  const candidates = dedupeSentences([
    ...chooseSubstantiveSentences(seed.keyTakeaway, 1),
    ...chooseSubstantiveSentences(seed.examStrategy, 1),
  ]);
  const batchTip = batchId ? HIGH_YIELD_RATIONALE_BATCHES.find((x) => x.id === batchId)?.examTip ?? null : null;
  const merged = dedupeSentences([...(candidates.length ? [candidates[0] ?? ""] : []), ...(batchTip ? [batchTip] : [])]).filter(Boolean);
  if (merged.length === 0) return "A concise clinical pearl is not available for this item yet.";
  return clipWords(merged.join(" "), 55);
}

export function buildControlledRationaleEnrichment(seed: ControlledRationaleSeed): ControlledRationaleEnrichment {
  const matchHaystack = [
    seed.topic,
    seed.subtopic,
    seed.bodySystem,
    seed.stem,
    ...(seed.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");
  const electrolytesGate = detectElectrolytesMatch(matchHaystack);
  const abgGate = detectAbgAcidBaseMatch(matchHaystack);
  const cardiacGate = detectCardiacMatch(matchHaystack);
  const batchId = detectBatch(seed);
  const precisionGate: PrecisionGateResult | null =
    batchId === "electrolytes"
      ? electrolytesGate
      : batchId === "abg_acid_base"
        ? abgGate
        : batchId === "cardiac"
          ? cardiacGate
          : null;
  const sourceAnchors = [
    seed.correctAnswerExplanation,
    seed.rationale,
    seed.clinicalReasoning,
    seed.keyTakeaway,
  ]
    .map((x) => normalizeSentenceSpacing(x ?? ""))
    .filter(Boolean);
  const sourceAnchorCount = sourceAnchors.length;
  const sourceAnchorWordCount = sourceAnchors.reduce((acc, x) => acc + wordCount(x), 0);

  if (!batchId) {
    return {
      batchId: null,
      applied: false,
      whyCorrect: buildWhyCorrect(seed),
      whyWrong: buildWhyWrong(seed),
      clinicalPearl: buildClinicalPearl(seed, null),
      topicAnchor: buildTopicAnchor(seed),
      skippedReason: "not_high_yield_batch",
      diagnostics: {
        sourceAnchorCount,
        sourceAnchorWordCount,
        minimumSubstanceMet: false,
        ...(precisionGate
          ? {
              matchPrecision: precisionGate.precision,
              topInclusionTrigger: precisionGate.inclusionHits[0] ?? null,
              topExclusionTrigger: precisionGate.exclusionHits[0] ?? null,
              inclusionHitCount: precisionGate.inclusionHits.length,
              exclusionHitCount: precisionGate.exclusionHits.length,
            }
          : {}),
      },
    };
  }

  if (sourceAnchorCount === 0) {
    return {
      batchId,
      applied: false,
      whyCorrect: "Clinical reasoning is not yet on file for this item.",
      whyWrong: "Detailed distractor explanations are not available for this item yet.",
      clinicalPearl: "A concise clinical pearl is not available for this item yet.",
      topicAnchor: buildTopicAnchor(seed),
      skippedReason: "no_source_anchor",
      diagnostics: {
        sourceAnchorCount,
        sourceAnchorWordCount,
        minimumSubstanceMet: false,
        ...(precisionGate
          ? {
              matchPrecision: precisionGate.precision,
              topInclusionTrigger: precisionGate.inclusionHits[0] ?? null,
              topExclusionTrigger: precisionGate.exclusionHits[0] ?? null,
              inclusionHitCount: precisionGate.inclusionHits.length,
              exclusionHitCount: precisionGate.exclusionHits.length,
            }
          : {}),
      },
    };
  }

  if (sourceAnchorWordCount < 12) {
    return {
      batchId,
      applied: false,
      whyCorrect: "Clinical reasoning is not yet on file for this item.",
      whyWrong: "Detailed distractor explanations are not available for this item yet.",
      clinicalPearl: "A concise clinical pearl is not available for this item yet.",
      topicAnchor: buildTopicAnchor(seed),
      skippedReason: "source_content_too_weak",
      diagnostics: {
        sourceAnchorCount,
        sourceAnchorWordCount,
        minimumSubstanceMet: false,
        ...(precisionGate
          ? {
              matchPrecision: precisionGate.precision,
              topInclusionTrigger: precisionGate.inclusionHits[0] ?? null,
              topExclusionTrigger: precisionGate.exclusionHits[0] ?? null,
              inclusionHitCount: precisionGate.inclusionHits.length,
              exclusionHitCount: precisionGate.exclusionHits.length,
            }
          : {}),
      },
    };
  }

  const whyCorrect = buildWhyCorrect(seed);
  const whyWrong = buildWhyWrong(seed);
  const clinicalPearl = buildClinicalPearl(seed, batchId);
  const topicAnchor = buildTopicAnchor(seed);

  const hasMinimumSubstance = wordCount(whyCorrect) >= 10 && wordCount(clinicalPearl) >= 8;
  if (!hasMinimumSubstance) {
    return {
      batchId,
      applied: false,
      whyCorrect: "Clinical reasoning is not yet on file for this item.",
      whyWrong: "Detailed distractor explanations are not available for this item yet.",
      clinicalPearl: "A concise clinical pearl is not available for this item yet.",
      topicAnchor,
      skippedReason: "below_minimum_substance_threshold",
      diagnostics: {
        sourceAnchorCount,
        sourceAnchorWordCount,
        minimumSubstanceMet: false,
        ...(precisionGate
          ? {
              matchPrecision: precisionGate.precision,
              topInclusionTrigger: precisionGate.inclusionHits[0] ?? null,
              topExclusionTrigger: precisionGate.exclusionHits[0] ?? null,
              inclusionHitCount: precisionGate.inclusionHits.length,
              exclusionHitCount: precisionGate.exclusionHits.length,
            }
          : {}),
      },
    };
  }

  return {
    batchId,
    applied: true,
    whyCorrect,
    whyWrong,
    clinicalPearl,
    topicAnchor,
    diagnostics: {
      sourceAnchorCount,
      sourceAnchorWordCount,
      minimumSubstanceMet: true,
      ...(precisionGate
        ? {
            matchPrecision: precisionGate.precision,
            topInclusionTrigger: precisionGate.inclusionHits[0] ?? null,
            topExclusionTrigger: precisionGate.exclusionHits[0] ?? null,
            inclusionHitCount: precisionGate.inclusionHits.length,
            exclusionHitCount: precisionGate.exclusionHits.length,
          }
        : {}),
    },
  };
}

export function buildFlashcardExplanationFromSources(seed: {
  front: string;
  back: string;
  topic?: string | null;
  subtopic?: string | null;
}): string | null {
  const enrichment = buildControlledRationaleEnrichment({
    stem: seed.front,
    rationale: seed.back,
    topic: seed.topic,
    subtopic: seed.subtopic,
    keyTakeaway: seed.back,
  });
  if (!enrichment.applied) return null;
  const lines = [
    `Why it is correct: ${enrichment.whyCorrect}`,
    `Clinical pearl: ${enrichment.clinicalPearl}`,
    enrichment.topicAnchor ? `Topic anchor: ${enrichment.topicAnchor}` : null,
  ].filter(Boolean) as string[];
  const merged = clipWords(lines.join("\n"), 95);
  return wordCount(merged) >= 14 ? merged : null;
}
