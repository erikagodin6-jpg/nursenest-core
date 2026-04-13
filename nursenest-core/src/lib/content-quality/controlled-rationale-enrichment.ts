import { stripToPlainText } from "@/lib/content-quality/plain-text";

export const HIGH_YIELD_RATIONALE_BATCHES = [
  {
    id: "electrolytes",
    patterns: [/\belectrolyte|potassium|hyperkal|hypokal|sodium|hyponat|hypernat|calcium|magnesium\b/i],
    examTip: "Trend labs with symptoms and ECG changes; treat unstable findings first.",
  },
  {
    id: "abg_acid_base",
    patterns: [/\babg|acid[\s-]?base|metabolic acidosis|metabolic alkalosis|respiratory acidosis|respiratory alkalosis|ph\b/i],
    examTip: "Classify pH first, then PaCO2/HCO3 to identify the primary process before selecting the intervention.",
  },
  {
    id: "cardiac",
    patterns: [/\bcardiac|acs|stemi|nstemi|angina|arrhythm|heart failure|troponin|ecg\b/i],
    examTip: "Prioritize perfusion and rhythm instability; escalate rapidly for ischemic or hemodynamic red flags.",
  },
  {
    id: "respiratory",
    patterns: [/\brespiratory|hypox|oxygenation|ventilat|copd|asthma|peep|airway\b/i],
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
  const match = HIGH_YIELD_RATIONALE_BATCHES.find((batch) => batch.patterns.some((re) => re.test(haystack)));
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
  const batchId = detectBatch(seed);
  if (!batchId) {
    return {
      batchId: null,
      applied: false,
      whyCorrect: buildWhyCorrect(seed),
      whyWrong: buildWhyWrong(seed),
      clinicalPearl: buildClinicalPearl(seed, null),
      topicAnchor: buildTopicAnchor(seed),
      skippedReason: "not_high_yield_batch",
    };
  }

  const hasSourceAnchor = [
    seed.correctAnswerExplanation,
    seed.rationale,
    seed.clinicalReasoning,
    seed.keyTakeaway,
  ].some((x) => wordCount(x ?? "") >= 6);

  if (!hasSourceAnchor) {
    return {
      batchId,
      applied: false,
      whyCorrect: "Clinical reasoning is not yet on file for this item.",
      whyWrong: "Detailed distractor explanations are not available for this item yet.",
      clinicalPearl: "A concise clinical pearl is not available for this item yet.",
      topicAnchor: buildTopicAnchor(seed),
      skippedReason: "source_content_too_weak",
    };
  }

  return {
    batchId,
    applied: true,
    whyCorrect: buildWhyCorrect(seed),
    whyWrong: buildWhyWrong(seed),
    clinicalPearl: buildClinicalPearl(seed, batchId),
    topicAnchor: buildTopicAnchor(seed),
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
