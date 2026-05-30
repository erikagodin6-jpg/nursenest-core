import type { FlashcardTelemetryEventRecord } from "./flashcard-analytics-aggregators";
import { evaluateFlashcardQuality, type FlashcardQualityFlag } from "./question-quality-engine";

export type FlashcardEffectivenessContentSignal = {
  id: string;
  prompt?: string | null;
  correctRationale?: string | null;
  distractorRationales?: Array<{ letter: string; rationale?: string | null }> | null;
};

export type FlashcardEffectivenessFlag =
  | "repeated_again"
  | "repeated_hard"
  | "poor_retention"
  | "weak_rationale"
  | "abandonment_risk"
  | "low_confidence_growth"
  | "low_knowledge_growth"
  | "low_remediation_success";

export type FlashcardEffectivenessCardScore = {
  cardId: string;
  topic: string;
  pathwayId: string;
  attempts: number;
  ratedCount: number;
  correctAttempts: number;
  againRate: number;
  hardRate: number;
  goodRate: number;
  easyRate: number;
  averageConfidence: number | null;
  averageTimeToAnswerMs: number | null;
  averageTimeToReviewMs: number | null;
  averageRationaleDwellMs: number | null;
  retentionScore: number;
  confidenceGrowth: number;
  knowledgeGrowth: number;
  remediationSuccess: number | null;
  flashcardQualityScore: number;
  flags: FlashcardEffectivenessFlag[];
  qualityFlags: FlashcardQualityFlag[];
};

export type FlashcardTopicRetentionScore = {
  topic: string;
  pathwayId: string;
  cardCount: number;
  attempts: number;
  retentionScore: number;
  confidenceGrowth: number;
  knowledgeGrowth: number;
  remediationSuccess: number | null;
  mostDifficult: boolean;
  highestImprovement: boolean;
};

export type FlashcardPathwayRetentionScore = {
  pathwayId: string;
  cardCount: number;
  topicCount: number;
  attempts: number;
  retentionScore: number;
  confidenceGrowth: number;
  knowledgeGrowth: number;
  remediationSuccess: number | null;
};

export type FlashcardEffectivenessReport = {
  generatedAtIso: string;
  cards: FlashcardEffectivenessCardScore[];
  topics: FlashcardTopicRetentionScore[];
  pathways: FlashcardPathwayRetentionScore[];
  mostEffectiveCards: FlashcardEffectivenessCardScore[];
  leastEffectiveCards: FlashcardEffectivenessCardScore[];
  mostDifficultTopics: FlashcardTopicRetentionScore[];
  highestImprovementTopics: FlashcardTopicRetentionScore[];
  reviewQueue: FlashcardEffectivenessCardScore[];
};

type InternalCardBucket = {
  cardId: string;
  topic: string;
  pathwayId: string;
  ratings: Array<"again" | "hard" | "good" | "easy">;
  correctness: boolean[];
  confidenceValues: number[];
  timeToAnswerMs: number[];
  timeToReviewMs: number[];
  rationaleDwellMs: number[];
  remediationTriggered: number;
  remediationSuccess: number;
  abandonmentCount: number;
};

const UNKNOWN_TOPIC = "Unknown";
const UNKNOWN_PATHWAY = "unknown";

function clampPct(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function roundRatio(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function avg(values: number[]): number | null {
  const clean = values.filter((value) => Number.isFinite(value) && value >= 0);
  if (clean.length === 0) return null;
  return Math.round(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

function normalizeTopic(value: string | undefined): string {
  const clean = value?.trim();
  return clean ? clean : UNKNOWN_TOPIC;
}

function normalizePathway(value: string | undefined): string {
  const clean = value?.trim();
  return clean ? clean : UNKNOWN_PATHWAY;
}

function confidenceFromRating(rating: string | undefined): number | null {
  switch (rating) {
    case "again":
      return 1;
    case "hard":
      return 2;
    case "good":
      return 4;
    case "easy":
      return 5;
    default:
      return null;
  }
}

function improvementScore(values: number[]): number {
  if (values.length < 4) return 0;
  const midpoint = Math.max(1, Math.floor(values.length / 2));
  const first = values.slice(0, midpoint);
  const second = values.slice(midpoint);
  const firstAvg = first.reduce((sum, value) => sum + value, 0) / first.length;
  const secondAvg = second.reduce((sum, value) => sum + value, 0) / second.length;
  return clampPct(((secondAvg - firstAvg) / 4) * 100);
}

function rate(count: number, total: number): number {
  return total > 0 ? roundRatio(count / total) : 0;
}

function getBucket(map: Map<string, InternalCardBucket>, event: FlashcardTelemetryEventRecord): InternalCardBucket | null {
  if (!event.card_id) return null;
  const cardId = event.card_id;
  const existing = map.get(cardId);
  if (existing) {
    if (event.topic) existing.topic = normalizeTopic(event.topic);
    if (event.pathway_id) existing.pathwayId = normalizePathway(event.pathway_id);
    return existing;
  }
  const bucket: InternalCardBucket = {
    cardId,
    topic: normalizeTopic(event.topic),
    pathwayId: normalizePathway(event.pathway_id),
    ratings: [],
    correctness: [],
    confidenceValues: [],
    timeToAnswerMs: [],
    timeToReviewMs: [],
    rationaleDwellMs: [],
    remediationTriggered: 0,
    remediationSuccess: 0,
    abandonmentCount: 0,
  };
  map.set(cardId, bucket);
  return bucket;
}

function buildCardScore(
  bucket: InternalCardBucket,
  contentSignal?: FlashcardEffectivenessContentSignal,
): FlashcardEffectivenessCardScore {
  const ratedCount = bucket.ratings.length;
  const attempts = Math.max(bucket.correctness.length, ratedCount);
  const correctAttempts = bucket.correctness.filter(Boolean).length;
  const againCount = bucket.ratings.filter((rating) => rating === "again").length;
  const hardCount = bucket.ratings.filter((rating) => rating === "hard").length;
  const goodCount = bucket.ratings.filter((rating) => rating === "good").length;
  const easyCount = bucket.ratings.filter((rating) => rating === "easy").length;
  const correctRate = attempts > 0 ? correctAttempts / attempts : 0;
  const againRate = rate(againCount, ratedCount);
  const hardRate = rate(hardCount, ratedCount);
  const goodRate = rate(goodCount, ratedCount);
  const easyRate = rate(easyCount, ratedCount);
  const retainedRate = rate(goodCount + easyCount, ratedCount);
  const abandonmentRate = attempts > 0 ? bucket.abandonmentCount / attempts : 0;
  const retentionScore = clampPct(correctRate * 42 + retainedRate * 38 + (1 - againRate) * 12 + (1 - abandonmentRate) * 8);
  const confidenceGrowth = improvementScore(bucket.confidenceValues);
  const knowledgeGrowth = improvementScore(bucket.correctness.map((isCorrect) => (isCorrect ? 1 : 0)));
  const remediationSuccess =
    bucket.remediationTriggered > 0 ? clampPct((bucket.remediationSuccess / bucket.remediationTriggered) * 100) : null;

  const quality = evaluateFlashcardQuality({
    id: bucket.cardId,
    prompt: contentSignal?.prompt,
    correctRationale: contentSignal?.correctRationale,
    distractorRationales: contentSignal?.distractorRationales,
    correctRate,
    againRate,
    hardRate,
    abandonmentRate,
  });

  const flags: FlashcardEffectivenessFlag[] = [];
  if (againCount >= 3 || againRate >= 0.35) flags.push("repeated_again");
  if (hardCount >= 3 || hardRate >= 0.4) flags.push("repeated_hard");
  if (retentionScore < 60 && attempts >= 3) flags.push("poor_retention");
  if (quality.flags.includes("thin_correct_rationale") || quality.flags.includes("generic_correct_rationale")) {
    flags.push("weak_rationale");
  }
  if (abandonmentRate >= 0.2) flags.push("abandonment_risk");
  if (bucket.confidenceValues.length >= 4 && confidenceGrowth < 5) flags.push("low_confidence_growth");
  if (bucket.correctness.length >= 4 && knowledgeGrowth < 5) flags.push("low_knowledge_growth");
  if (remediationSuccess !== null && remediationSuccess < 50) flags.push("low_remediation_success");

  const effectivenessPenalty = flags.reduce((sum, flag) => {
    if (flag === "weak_rationale" || flag === "poor_retention") return sum + 16;
    if (flag === "repeated_again" || flag === "repeated_hard") return sum + 12;
    return sum + 8;
  }, 0);
  const flashcardQualityScore = clampPct(quality.score * 0.48 + retentionScore * 0.36 + confidenceGrowth * 0.08 + knowledgeGrowth * 0.08 - effectivenessPenalty);

  return {
    cardId: bucket.cardId,
    topic: bucket.topic,
    pathwayId: bucket.pathwayId,
    attempts,
    ratedCount,
    correctAttempts,
    againRate,
    hardRate,
    goodRate,
    easyRate,
    averageConfidence: avg(bucket.confidenceValues),
    averageTimeToAnswerMs: avg(bucket.timeToAnswerMs),
    averageTimeToReviewMs: avg(bucket.timeToReviewMs),
    averageRationaleDwellMs: avg(bucket.rationaleDwellMs),
    retentionScore,
    confidenceGrowth,
    knowledgeGrowth,
    remediationSuccess,
    flashcardQualityScore,
    flags: [...new Set(flags)],
    qualityFlags: quality.flags,
  };
}

function weightedAverage<T>(rows: T[], getValue: (row: T) => number | null, getWeight: (row: T) => number): number | null {
  let total = 0;
  let weight = 0;
  for (const row of rows) {
    const value = getValue(row);
    const rowWeight = getWeight(row);
    if (value === null || rowWeight <= 0) continue;
    total += value * rowWeight;
    weight += rowWeight;
  }
  return weight > 0 ? Math.round(total / weight) : null;
}

function buildTopicScores(cards: FlashcardEffectivenessCardScore[]): FlashcardTopicRetentionScore[] {
  const map = new Map<string, FlashcardEffectivenessCardScore[]>();
  for (const card of cards) {
    const key = `${card.pathwayId}||${card.topic}`;
    map.set(key, [...(map.get(key) ?? []), card]);
  }
  const rows = [...map.entries()].map(([key, group]) => {
    const [pathwayId, topic] = key.split("||");
    return {
      topic,
      pathwayId,
      cardCount: group.length,
      attempts: group.reduce((sum, card) => sum + card.attempts, 0),
      retentionScore: weightedAverage(group, (card) => card.retentionScore, (card) => Math.max(1, card.attempts)) ?? 0,
      confidenceGrowth: weightedAverage(group, (card) => card.confidenceGrowth, (card) => Math.max(1, card.ratedCount)) ?? 0,
      knowledgeGrowth: weightedAverage(group, (card) => card.knowledgeGrowth, (card) => Math.max(1, card.attempts)) ?? 0,
      remediationSuccess: weightedAverage(group, (card) => card.remediationSuccess, (card) => Math.max(1, card.attempts)),
      mostDifficult: false,
      highestImprovement: false,
    };
  });
  const difficult = [...rows].sort((a, b) => a.retentionScore - b.retentionScore).slice(0, 3);
  const improving = [...rows].sort((a, b) => b.knowledgeGrowth - a.knowledgeGrowth || b.confidenceGrowth - a.confidenceGrowth).slice(0, 3);
  const difficultKeys = new Set(difficult.map((row) => `${row.pathwayId}||${row.topic}`));
  const improvingKeys = new Set(improving.map((row) => `${row.pathwayId}||${row.topic}`));
  return rows
    .map((row) => ({
      ...row,
      mostDifficult: difficultKeys.has(`${row.pathwayId}||${row.topic}`),
      highestImprovement: improvingKeys.has(`${row.pathwayId}||${row.topic}`),
    }))
    .sort((a, b) => a.pathwayId.localeCompare(b.pathwayId) || a.topic.localeCompare(b.topic));
}

function buildPathwayScores(cards: FlashcardEffectivenessCardScore[], topics: FlashcardTopicRetentionScore[]): FlashcardPathwayRetentionScore[] {
  const map = new Map<string, FlashcardEffectivenessCardScore[]>();
  for (const card of cards) {
    map.set(card.pathwayId, [...(map.get(card.pathwayId) ?? []), card]);
  }
  return [...map.entries()]
    .map(([pathwayId, group]) => ({
      pathwayId,
      cardCount: group.length,
      topicCount: topics.filter((topic) => topic.pathwayId === pathwayId).length,
      attempts: group.reduce((sum, card) => sum + card.attempts, 0),
      retentionScore: weightedAverage(group, (card) => card.retentionScore, (card) => Math.max(1, card.attempts)) ?? 0,
      confidenceGrowth: weightedAverage(group, (card) => card.confidenceGrowth, (card) => Math.max(1, card.ratedCount)) ?? 0,
      knowledgeGrowth: weightedAverage(group, (card) => card.knowledgeGrowth, (card) => Math.max(1, card.attempts)) ?? 0,
      remediationSuccess: weightedAverage(group, (card) => card.remediationSuccess, (card) => Math.max(1, card.attempts)),
    }))
    .sort((a, b) => a.pathwayId.localeCompare(b.pathwayId));
}

export function buildFlashcardEffectivenessReport(args: {
  events: FlashcardTelemetryEventRecord[];
  contentSignals?: FlashcardEffectivenessContentSignal[];
  generatedAtIso?: string;
}): FlashcardEffectivenessReport {
  const buckets = new Map<string, InternalCardBucket>();
  for (const event of args.events) {
    const bucket = getBucket(buckets, event);
    if (!bucket) continue;
    if (event.event === "answer_submitted" && typeof event.is_correct === "boolean") {
      bucket.correctness.push(event.is_correct);
      if (typeof event.time_to_answer_ms === "number") bucket.timeToAnswerMs.push(event.time_to_answer_ms);
    }
    if (event.event === "flashcard_reveal" && typeof event.reveal_dwell_ms === "number") {
      bucket.timeToAnswerMs.push(event.reveal_dwell_ms);
    }
    if (event.event === "flashcard_rated" && event.confidence_level) {
      if (event.confidence_level === "again" || event.confidence_level === "hard" || event.confidence_level === "good" || event.confidence_level === "easy") {
        bucket.ratings.push(event.confidence_level);
      }
      const confidence = confidenceFromRating(event.confidence_level);
      if (confidence !== null) bucket.confidenceValues.push(confidence);
      if (typeof event.dwell_reveal_ms === "number") bucket.timeToReviewMs.push(event.dwell_reveal_ms);
      if (typeof event.rationale_dwell_ms === "number") bucket.rationaleDwellMs.push(event.rationale_dwell_ms);
    }
    if (event.event === "rationale_opened" && typeof event.rationale_dwell_ms === "number") {
      bucket.rationaleDwellMs.push(event.rationale_dwell_ms);
    }
    if (event.event === "remediation_triggered") {
      bucket.remediationTriggered += 1;
    }
    if (bucket.remediationTriggered > 0 && event.event === "flashcard_rated" && (event.confidence_level === "good" || event.confidence_level === "easy")) {
      bucket.remediationSuccess += 1;
    }
    if (event.event === "flashcard_abandoned" || event.event === "study_session_abandoned") {
      bucket.abandonmentCount += 1;
    }
  }

  const contentById = new Map((args.contentSignals ?? []).map((signal) => [signal.id, signal]));
  const cards = [...buckets.values()]
    .map((bucket) => buildCardScore(bucket, contentById.get(bucket.cardId)))
    .sort((a, b) => b.flashcardQualityScore - a.flashcardQualityScore || b.attempts - a.attempts);
  const topics = buildTopicScores(cards);
  const pathways = buildPathwayScores(cards, topics);
  return {
    generatedAtIso: args.generatedAtIso ?? new Date().toISOString(),
    cards,
    topics,
    pathways,
    mostEffectiveCards: cards.filter((card) => card.attempts >= 2).slice(0, 10),
    leastEffectiveCards: [...cards].filter((card) => card.attempts >= 2).sort((a, b) => a.flashcardQualityScore - b.flashcardQualityScore).slice(0, 10),
    mostDifficultTopics: topics.filter((topic) => topic.mostDifficult).sort((a, b) => a.retentionScore - b.retentionScore),
    highestImprovementTopics: topics.filter((topic) => topic.highestImprovement).sort((a, b) => b.knowledgeGrowth - a.knowledgeGrowth || b.confidenceGrowth - a.confidenceGrowth),
    reviewQueue: cards
      .filter((card) => card.flags.length > 0 || card.flashcardQualityScore < 70)
      .sort((a, b) => a.flashcardQualityScore - b.flashcardQualityScore || b.flags.length - a.flags.length),
  };
}

