/**
 * Pure helpers for adaptive / CAT-style question selection on top of paginated pools.
 * Server routes should still fetch IDs with `take` + `skip` or random ORDER BY — never load full banks.
 */

export type DifficultyBand = "low" | "mid" | "high";

export type TopicWeight = { topicKey: string; weight: number };

export type CognitiveLoadQuestionLike = {
  id?: string;
  difficulty?: number | null;
  riskLevel?: "low" | "moderate" | "high" | string | null;
  cognitiveLayer?: "L1" | "L2" | "L3" | string | null;
  systemTag?: string | null;
  topicSlug?: string | null;
  topic?: string | null;
  bodySystem?: string | null;
  questionType?: string | null;
};

export type CognitiveLoadAnswerLike = CognitiveLoadQuestionLike & {
  correct?: boolean | null;
};

export type CognitiveLoadPolicy = {
  recentWindow?: number;
  highAcuityWindow?: number;
  difficultWindow?: number;
  pharmacologyWindow?: number;
  complexWindow?: number;
};

const DEFAULT_COGNITIVE_LOAD_POLICY: Required<CognitiveLoadPolicy> = {
  recentWindow: 5,
  highAcuityWindow: 2,
  difficultWindow: 3,
  pharmacologyWindow: 3,
  complexWindow: 4,
};

const PHARM_RE = /\b(pharm|med|drug|insulin|heparin|warfarin|anticoag|opioid|digoxin|antibiotic|beta blocker|ace inhibitor|diuretic)\b/i;
const HIGH_ACUITY_RE = /\b(sepsis|shock|deterior|unstable|respiratory distress|hypoxia|stroke|chest pain|emergency|rapid response|priority|triage)\b/i;
const COMPLEX_TYPE_RE = /\b(bow.?tie|matrix|case|trend|hotspot|drag|ordered|cloze|sata|select.*all|highlight|ngn)\b/i;

/** Map Prisma difficulty (1–5) to coarse bands for stratified draws. */
export function difficultyBandFromScore(d: number | null | undefined): DifficultyBand {
  const x = typeof d === "number" && Number.isFinite(d) ? Math.round(d) : 3;
  const clamped = Math.min(5, Math.max(1, x));
  if (clamped <= 2) return "low";
  if (clamped >= 4) return "high";
  return "mid";
}

/**
 * After weak-area diagnostics, overweight underrepresented topics (weights need not sum to 1).
 */
export function reweightTopicsForWeakAreas(
  topicCounts: Record<string, number>,
  weakTopics: string[],
  boost = 2,
): TopicWeight[] {
  const keys = Object.keys(topicCounts);
  if (keys.length === 0) return [];
  const weak = new Set(weakTopics);
  return keys.map((topicKey) => ({
    topicKey,
    weight: weak.has(topicKey) ? topicCounts[topicKey]! * boost : topicCounts[topicKey]!,
  }));
}

/** Simple 3-parameter logistic ability estimate from binary outcomes (CAT-style placeholder). */
export function estimateAbilityLogistic(correct: number, incorrect: number, prior = 0): number {
  const c = Math.max(0, correct);
  const i = Math.max(0, incorrect);
  if (c + i === 0) return prior;
  const p = (c + 0.5) / (c + i + 1);
  const logit = Math.log(p / (1 - p));
  return prior * 0.25 + logit * 0.75;
}

/**
 * Target next difficulty (1–5) from ability — higher ability → harder items.
 */
export function suggestedDifficultyTarget(ability: number): number {
  const t = (Math.tanh(ability / 3) + 1) / 2;
  return Math.min(5, Math.max(1, Math.round(1 + t * 4)));
}

/**
 * Pick topic for the next item using weights (deterministic tie-break with hash of step index).
 */
export function pickTopicByWeight(weights: TopicWeight[], stepIndex: number): string | null {
  if (weights.length === 0) return null;
  const sum = weights.reduce((s, w) => s + Math.max(0, w.weight), 0);
  if (sum <= 0) return weights[0]!.topicKey;
  let r = (Math.sin(stepIndex * 12.9898) * 43758.5453) % 1;
  if (r < 0) r += 1;
  let acc = 0;
  const target = r * sum;
  for (const w of weights) {
    acc += Math.max(0, w.weight);
    if (target <= acc) return w.topicKey;
  }
  return weights[weights.length - 1]!.topicKey;
}

/** Exclude IDs already served in-session or in recent history. */
export function filterSeenIds<T extends { id: string }>(rows: T[], seen: ReadonlySet<string>): T[] {
  return rows.filter((r) => !seen.has(r.id));
}

function normalizedText(q: CognitiveLoadQuestionLike): string {
  return [q.systemTag, q.topicSlug, q.topic, q.bodySystem, q.questionType].filter(Boolean).join(" ");
}

export function isPharmacologyLoad(q: CognitiveLoadQuestionLike): boolean {
  return PHARM_RE.test(normalizedText(q));
}

export function isHighAcuityLoad(q: CognitiveLoadQuestionLike): boolean {
  return q.riskLevel === "high" || HIGH_ACUITY_RE.test(normalizedText(q));
}

export function isHighDifficultyLoad(q: CognitiveLoadQuestionLike): boolean {
  return (q.difficulty ?? 3) >= 4;
}

export function isComplexNgnLoad(q: CognitiveLoadQuestionLike): boolean {
  return q.cognitiveLayer === "L3" || COMPLEX_TYPE_RE.test(normalizedText(q));
}

export function cognitiveLoadPenaltyMultiplier(
  candidate: CognitiveLoadQuestionLike,
  recentItems: readonly CognitiveLoadAnswerLike[],
  policy: CognitiveLoadPolicy = {},
): number {
  const p = { ...DEFAULT_COGNITIVE_LOAD_POLICY, ...policy };
  const recent = recentItems.slice(-p.recentWindow);
  let multiplier = 1;

  const highAcuityStreak = recent.slice(-p.highAcuityWindow).filter(isHighAcuityLoad).length;
  const difficultRecent = recent.slice(-p.difficultWindow).filter(isHighDifficultyLoad).length;
  const pharmRecent = recent.slice(-p.pharmacologyWindow).filter(isPharmacologyLoad).length;
  const complexRecent = recent.slice(-p.complexWindow).filter(isComplexNgnLoad).length;
  const recentWrong = recent.filter((item) => item.correct === false).length;

  if (isHighAcuityLoad(candidate) && highAcuityStreak >= p.highAcuityWindow) multiplier *= 0.42;
  if (isHighDifficultyLoad(candidate) && difficultRecent >= Math.max(2, p.difficultWindow - 1)) multiplier *= 0.58;
  if (isPharmacologyLoad(candidate) && pharmRecent >= Math.max(2, p.pharmacologyWindow - 1)) multiplier *= 0.48;
  if (isComplexNgnLoad(candidate) && complexRecent >= Math.max(2, p.complexWindow - 1)) multiplier *= 0.62;

  // If the learner is sliding into fatigue, prefer a recovery item unless the bank/floors force otherwise.
  if (recent.length >= 4 && recentWrong >= 3) {
    if (isHighDifficultyLoad(candidate) || isHighAcuityLoad(candidate) || isComplexNgnLoad(candidate)) multiplier *= 0.64;
    else multiplier *= 1.12;
  }

  return Math.max(0.25, Math.min(1.18, multiplier));
}

function projectedLoadCost(
  candidate: CognitiveLoadQuestionLike,
  selected: readonly CognitiveLoadQuestionLike[],
  policy: CognitiveLoadPolicy,
): number {
  const multiplier = cognitiveLoadPenaltyMultiplier(candidate, selected, policy);
  const difficultyCost = Math.max(0, (candidate.difficulty ?? 3) - 3) * 0.08;
  return (1 - multiplier) + difficultyCost;
}

/**
 * Reorders an already-selected set so long practice sessions do not stack
 * high-acuity, high-difficulty, pharmacology, or NGN-complexity items.
 */
export function balanceCognitiveLoadSequence<T extends CognitiveLoadQuestionLike & { id: string }>(
  rows: readonly T[],
  policy: CognitiveLoadPolicy = {},
): T[] {
  if (rows.length <= 2) return [...rows];
  const remaining = [...rows];
  const ordered: T[] = [];

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestScore = Infinity;
    for (let i = 0; i < remaining.length; i += 1) {
      const candidate = remaining[i]!;
      const loadCost = projectedLoadCost(candidate, ordered, policy);
      const displacementCost = i * 0.015;
      const score = loadCost + displacementCost;
      if (score < bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    ordered.push(remaining.splice(bestIndex, 1)[0]!);
  }

  return ordered;
}
