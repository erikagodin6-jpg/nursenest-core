import type { ExamBlueprint } from "./question-pool";
import type { PooledQuestion } from "./question-pool";

export interface CATResponse {
  itemId: string;
  isCorrect: boolean;
  abilityAtTime: number;
  difficulty: number;
  bodySystem: string;
}

export interface DomainCoverage {
  domain: string;
  targetWeight: number;
  questionsAdministered: number;
  correct: number;
  total: number;
  coverageMet: boolean;
}

export interface CATState {
  abilityEstimate: number;
  standardError: number;
  itemsAdministered: number;
  responses: CATResponse[];
  abilityHistory: number[];
  bodySystemsSeen: Record<string, number>;
  domainCoverage: Record<string, DomainCoverage>;
  formatTypesSeen: Record<string, number>;
}

export interface DomainBand {
  domain: string;
  level: "Above Passing" | "Near Passing" | "Below Passing";
  correct: number;
  total: number;
  percentage: number;
}

export type ReadinessLevel = "Below Passing Standard" | "Near Passing Standard" | "Above Passing Standard";

export interface ReadinessScore {
  level: ReadinessLevel;
  score: number;
  description: string;
}

export interface WeakArea {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
}

export function initCAT(blueprint?: ExamBlueprint): CATState {
  const domainCoverage: Record<string, DomainCoverage> = {};
  if (blueprint?.domains) {
    for (const d of blueprint.domains) {
      domainCoverage[d.name] = {
        domain: d.name,
        targetWeight: d.weight,
        questionsAdministered: 0,
        correct: 0,
        total: 0,
        coverageMet: false,
      };
    }
  }
  return {
    abilityEstimate: 0,
    standardError: 1.0,
    itemsAdministered: 0,
    responses: [],
    abilityHistory: [0],
    bodySystemsSeen: {},
    domainCoverage,
    formatTypesSeen: {},
  };
}

function itemDifficulty(item: PooledQuestion): number {
  if ((item as any).difficulty && typeof (item as any).difficulty === "number") {
    const d = (item as any).difficulty as number;
    return (d - 1) * 0.75 - 0.5;
  }
  const id = item.id;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return ((hash % 300) / 100);
}

function logistic(theta: number, b: number): number {
  const D = 1.7;
  return 1 / (1 + Math.exp(-D * (theta - b)));
}

export function selectNextItem(
  state: CATState,
  remainingItems: PooledQuestion[],
  blueprint?: ExamBlueprint,
  domainMap?: Record<string, string>
): PooledQuestion | null {
  if (remainingItems.length === 0) return null;

  const systemCounts = state.bodySystemsSeen;
  const totalSeen = state.itemsAdministered;
  const avgPerSystem = totalSeen > 0 ? totalSeen / Math.max(Object.keys(systemCounts).length, 1) : 0;

  const hasDomainCoverage = blueprint?.domains && Object.keys(state.domainCoverage).length > 0;

  const scored = remainingItems.map((item) => {
    const b = itemDifficulty(item);
    const dist = Math.abs(state.abilityEstimate - b);

    let diversityBonus = 0;
    const sysCount = systemCounts[item.bodySystem] || 0;
    if (sysCount < avgPerSystem * 0.5) {
      diversityBonus = -0.3;
    } else if (sysCount > avgPerSystem * 1.5 && totalSeen > 5) {
      diversityBonus = 0.4;
    }

    let domainBonus = 0;
    if (hasDomainCoverage && domainMap) {
      const domainName = domainMap[item.id] || domainMap[item.bodySystem];
      if (domainName && state.domainCoverage[domainName]) {
        const dc = state.domainCoverage[domainName];
        const targetCount = Math.max(1, Math.round((blueprint!.minQuestions || 85) * dc.targetWeight));
        const deficit = targetCount - dc.questionsAdministered;
        if (deficit > 0 && !dc.coverageMet) {
          domainBonus = -0.5 * (deficit / targetCount);
        } else if (dc.questionsAdministered > targetCount * 1.3) {
          domainBonus = 0.5;
        }
      }
    }

    let formatBonus = 0;
    if (item.questionType && totalSeen > 0) {
      const formatCount = state.formatTypesSeen[item.questionType] || 0;
      const distinctFormats = Math.max(1, Object.keys(state.formatTypesSeen).length);
      const avgPerFormat = totalSeen / distinctFormats;
      if (formatCount < avgPerFormat * 0.5) {
        formatBonus = -0.15;
      } else if (formatCount > avgPerFormat * 2 && totalSeen > 10) {
        formatBonus = 0.2;
      }
    }

    const jitter = Math.random() * 0.2;
    return { item, score: dist + diversityBonus + domainBonus + formatBonus + jitter };
  });

  scored.sort((a, b) => a.score - b.score);

  const topK = Math.min(5, scored.length);
  const pick = Math.floor(Math.random() * topK);
  return scored[pick].item;
}

export function updateAbility(
  state: CATState,
  item: PooledQuestion,
  isCorrect: boolean,
  domainName?: string
): CATState {
  const b = itemDifficulty(item);
  const p = logistic(state.abilityEstimate, b);

  const recencyWeight = Math.min(1.0, 0.4 + (state.itemsAdministered * 0.02));
  const stepSize = state.standardError * 0.5 * recencyWeight;
  const delta = isCorrect ? stepSize * (1 - p) : -stepSize * p;
  const newTheta = state.abilityEstimate + delta;

  const info = p * (1 - p);
  const totalInfo =
    state.itemsAdministered > 0
      ? 1 / (state.standardError * state.standardError) + info
      : 1 + info;
  const newSE = 1 / Math.sqrt(totalInfo);

  const newResponse: CATResponse = {
    itemId: item.id,
    isCorrect,
    abilityAtTime: newTheta,
    difficulty: b,
    bodySystem: item.bodySystem,
  };

  const newSystemsSeen = { ...state.bodySystemsSeen };
  newSystemsSeen[item.bodySystem] = (newSystemsSeen[item.bodySystem] || 0) + 1;

  const newDomainCoverage = { ...state.domainCoverage };
  if (domainName && newDomainCoverage[domainName]) {
    const dc = { ...newDomainCoverage[domainName] };
    dc.questionsAdministered++;
    dc.total++;
    if (isCorrect) dc.correct++;
    const minQ = 85;
    const targetCount = Math.max(2, Math.round(minQ * dc.targetWeight));
    dc.coverageMet = dc.questionsAdministered >= targetCount;
    newDomainCoverage[domainName] = dc;
  }

  const newFormatTypesSeen = { ...state.formatTypesSeen };
  if (item.questionType) {
    newFormatTypesSeen[item.questionType] = (newFormatTypesSeen[item.questionType] || 0) + 1;
  }

  return {
    abilityEstimate: newTheta,
    standardError: newSE,
    itemsAdministered: state.itemsAdministered + 1,
    responses: [...state.responses, newResponse],
    abilityHistory: [...state.abilityHistory, newTheta],
    bodySystemsSeen: newSystemsSeen,
    domainCoverage: newDomainCoverage,
    formatTypesSeen: newFormatTypesSeen,
  };
}

function isDomainCoverageSufficient(state: CATState): boolean {
  const domains = Object.values(state.domainCoverage);
  if (domains.length === 0) return true;
  return domains.every(dc => dc.coverageMet);
}

export function shouldStop(
  state: CATState,
  blueprint: ExamBlueprint
): { stop: boolean; reason: string } {
  const minQ = blueprint.minQuestions ?? 85;
  const maxQ = blueprint.maxQuestions ?? 150;

  if (state.itemsAdministered >= maxQ) {
    return { stop: true, reason: "maximum_reached" };
  }

  if (state.itemsAdministered < minQ) {
    return { stop: false, reason: "below_minimum" };
  }

  const seThresholdMet = state.standardError < 0.33;
  const coverageMet = isDomainCoverageSufficient(state);

  if (seThresholdMet && coverageMet) {
    return { stop: true, reason: "confidence_and_coverage_met" };
  }

  return { stop: false, reason: seThresholdMet ? "awaiting_coverage" : coverageMet ? "awaiting_confidence" : "awaiting_both" };
}

export function getPassFailResult(state: CATState): {
  passed: boolean;
  label: string;
} {
  if (state.abilityEstimate >= 0) {
    return { passed: true, label: "PASS" };
  }
  return { passed: false, label: "FAIL" };
}

export function getReadinessScore(state: CATState): ReadinessScore {
  const theta = state.abilityEstimate;
  const score = Math.round(Math.max(0, Math.min(100, (theta + 2) * 25)));

  if (theta >= 0.5) {
    return {
      level: "Above Passing Standard",
      score,
      description: "Your performance indicates strong exam readiness. Continue reviewing weak areas for maximum confidence.",
    };
  } else if (theta >= -0.3) {
    return {
      level: "Near Passing Standard",
      score,
      description: "You are approaching the passing threshold. Focus on your weakest topics to push above the standard.",
    };
  }
  return {
    level: "Below Passing Standard",
    score,
    description: "Additional study is recommended before attempting the licensing exam. Focus on foundational topics and high-yield content.",
  };
}

export function getWeakAreas(state: CATState): WeakArea[] {
  const topicStats: Record<string, { correct: number; total: number }> = {};

  for (const r of state.responses) {
    const system = r.bodySystem || "Unknown";
    if (!topicStats[system]) topicStats[system] = { correct: 0, total: 0 };
    topicStats[system].total++;
    if (r.isCorrect) topicStats[system].correct++;
  }

  return Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .filter((a) => a.total >= 2 && a.percentage < 65)
    .sort((a, b) => a.percentage - b.percentage);
}

export function getStrengthAreas(state: CATState): WeakArea[] {
  const topicStats: Record<string, { correct: number; total: number }> = {};

  for (const r of state.responses) {
    const system = r.bodySystem || "Unknown";
    if (!topicStats[system]) topicStats[system] = { correct: 0, total: 0 };
    topicStats[system].total++;
    if (r.isCorrect) topicStats[system].correct++;
  }

  return Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .filter((a) => a.total >= 2 && a.percentage >= 70)
    .sort((a, b) => b.percentage - a.percentage);
}

export function getDifficultyDistribution(state: CATState): { easy: number; moderate: number; hard: number } {
  let easy = 0, moderate = 0, hard = 0;
  for (const r of state.responses) {
    if (r.difficulty < 0.5) easy++;
    else if (r.difficulty < 1.5) moderate++;
    else hard++;
  }
  return { easy, moderate, hard };
}

export function getDomainBands(
  domainScores: Record<string, { correct: number; total: number }>
): DomainBand[] {
  return Object.entries(domainScores).map(([domain, scores]) => {
    const percentage =
      scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;

    let level: DomainBand["level"];
    if (percentage >= 65) {
      level = "Above Passing";
    } else if (percentage >= 50) {
      level = "Near Passing";
    } else {
      level = "Below Passing";
    }

    return {
      domain,
      level,
      correct: scores.correct,
      total: scores.total,
      percentage,
    };
  });
}

export function computeScaledScore(
  rawPercentage: number,
  scoreRange: { min: number; max: number; passScore: number }
): { scaledScore: number; passed: boolean } {
  const range = scoreRange.max - scoreRange.min;
  const scaledScore = Math.round(scoreRange.min + (rawPercentage / 100) * range);
  const clamped = Math.max(scoreRange.min, Math.min(scoreRange.max, scaledScore));

  return {
    scaledScore: clamped,
    passed: clamped >= scoreRange.passScore,
  };
}
