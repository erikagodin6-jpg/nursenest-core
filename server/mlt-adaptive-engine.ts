import type {
  AbilityEstimate,
  QuestionResponse,
  CATParameters,
  ExamSessionState,
  ExamResultReport,
  MltExamMode,
  SimulationProfile,
} from "../shared/mlt-exam-types";
import { DEFAULT_CAT_PARAMS, CANADA_EXAM_CONFIG, SIMULATION_PROFILES } from "../shared/mlt-exam-types";

export function createInitialAbility(): AbilityEstimate {
  return { theta: 0, standardError: 1.0, confidence: 0, history: [0] };
}

export function updateAbilityEstimate(
  current: AbilityEstimate,
  isCorrect: boolean,
  questionDifficulty: number,
  responseTimeMs: number,
  catParams: CATParameters
): AbilityEstimate {
  const cap = catParams.abilityCapPerQuestion;
  const isRapidGuess = responseTimeMs < catParams.rapidGuessThresholdMs;

  let confidenceMultiplier = 1.0;
  if (isRapidGuess) {
    confidenceMultiplier = 0.3;
  }

  const diff = questionDifficulty / 5.0;
  const expected = 1.0 / (1.0 + Math.exp(-(current.theta - diff)));

  const outcome = isCorrect ? 1 : 0;
  const k = 0.4 * confidenceMultiplier;
  let delta = k * (outcome - expected);

  delta = Math.max(-cap, Math.min(cap, delta));

  const newTheta = Math.max(-3, Math.min(3, current.theta + delta));

  const newSE = current.standardError * 0.95;

  const responseCount = current.history.length;
  const newConfidence = Math.min(1.0, responseCount / 40);

  const newHistory = [...current.history, newTheta];

  return {
    theta: newTheta,
    standardError: Math.max(0.1, newSE),
    confidence: newConfidence,
    history: newHistory,
  };
}

export function detectRapidGuessing(responses: QuestionResponse[], thresholdMs: number): string[] {
  const flags: string[] = [];
  let consecutiveRapid = 0;

  for (const r of responses) {
    if (r.responseTimeMs < thresholdMs) {
      consecutiveRapid++;
      if (consecutiveRapid >= 3) {
        flags.push(`rapid_guessing_streak_at_q${responses.indexOf(r) + 1}`);
      }
    } else {
      consecutiveRapid = 0;
    }
  }

  const rapidCount = responses.filter((r) => r.responseTimeMs < thresholdMs).length;
  if (responses.length > 10 && rapidCount / responses.length > 0.3) {
    flags.push(`high_rapid_guess_rate_${Math.round((rapidCount / responses.length) * 100)}pct`);
  }

  return flags;
}

export function calculateStability(abilityHistory: number[], window: number = 10): number {
  if (abilityHistory.length < window) return 1.0;
  const recent = abilityHistory.slice(-window);
  const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
  const variance = recent.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / recent.length;
  return Math.sqrt(variance);
}

export function shouldStopCAT(
  state: ExamSessionState,
  catParams: CATParameters
): { stop: boolean; reason: string } {
  const answered = state.responses.length;

  if (answered >= catParams.maxQuestions) {
    return { stop: true, reason: "max_questions_reached" };
  }

  if (answered < catParams.minQuestions) {
    return { stop: false, reason: "below_minimum" };
  }

  const stability = calculateStability(state.ability.history);
  if (stability < catParams.stabilityThreshold) {
    const coverageMet = checkCoverageMet(state.coverageAchieved, catParams.contentTargets, 0.6);
    if (coverageMet) {
      return { stop: true, reason: "stable_estimate_coverage_met" };
    }
  }

  return { stop: false, reason: "continuing" };
}

function checkCoverageMet(
  achieved: Record<string, number>,
  targets: Record<string, number>,
  threshold: number
): boolean {
  for (const [category, target] of Object.entries(targets)) {
    const actual = achieved[category] || 0;
    const expectedMin = Math.floor((target / 100) * threshold * 10);
    if (actual < expectedMin) return false;
  }
  return true;
}

export interface QuestionCandidate {
  id: string;
  difficulty: string;
  difficultyNum: number;
  category: string;
  topic: string;
  hasImage: boolean;
  exposureCount: number;
}

export function selectNextQuestion(
  candidates: QuestionCandidate[],
  state: ExamSessionState,
  catParams: CATParameters
): QuestionCandidate | null {
  if (candidates.length === 0) return null;

  const usedIds = new Set(state.questionIds);
  const available = candidates.filter((c) => !usedIds.has(c.id));
  if (available.length === 0) return null;

  const scored = available.map((c) => {
    let score = 0;

    const abilityLevel = state.ability.theta;
    const diffNorm = c.difficultyNum / 5.0;
    const closeness = 1.0 - Math.abs(abilityLevel - diffNorm);
    score += closeness * 30;

    if (catParams.contentTargets[c.category]) {
      const targetPct = catParams.contentTargets[c.category] / 100;
      const totalAnswered = state.responses.length || 1;
      const currentPct = (state.coverageAchieved[c.category] || 0) / totalAnswered;
      const gap = targetPct - currentPct;
      score += Math.max(0, gap * 100) * 2;
    }

    const weakScore = state.weakAreaMap[c.category] || 0;
    score += weakScore * 15;

    if (c.exposureCount > 0) {
      const penalty = Math.min(c.exposureCount * 10, 30);
      score -= penalty;
    }

    const lastImageIdx = findLastImageIndex(state);
    if (c.hasImage && lastImageIdx >= 0 && state.responses.length - lastImageIdx < 5) {
      score -= 10;
    }

    return { candidate: c, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topN = Math.min(5, scored.length);
  const topCandidates = scored.slice(0, topN);
  const pick = topCandidates[Math.floor(Math.random() * topCandidates.length)];

  return pick.candidate;
}

function findLastImageIndex(state: ExamSessionState): number {
  return -1;
}

export function computeWeakStrongAreas(responses: QuestionResponse[]): {
  weakAreas: Record<string, number>;
  strongAreas: Record<string, number>;
} {
  const categoryStats: Record<string, { correct: number; total: number }> = {};

  for (const r of responses) {
    if (!categoryStats[r.category]) {
      categoryStats[r.category] = { correct: 0, total: 0 };
    }
    categoryStats[r.category].total++;
    if (r.isCorrect) categoryStats[r.category].correct++;
  }

  const weakAreas: Record<string, number> = {};
  const strongAreas: Record<string, number> = {};

  for (const [cat, stats] of Object.entries(categoryStats)) {
    if (stats.total < 2) continue;
    const rate = stats.correct / stats.total;
    if (rate < 0.5) {
      weakAreas[cat] = Math.round((1 - rate) * 100);
    } else if (rate >= 0.7) {
      strongAreas[cat] = Math.round(rate * 100);
    }
  }

  return { weakAreas, strongAreas };
}

export function generateExamReport(state: ExamSessionState): ExamResultReport {
  const totalQuestions = state.responses.length;
  const correctCount = state.responses.filter((r) => r.isCorrect).length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const timeSpent = state.responses.reduce((sum, r) => sum + r.responseTimeMs, 0);

  const categoryBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};
  for (const r of state.responses) {
    if (!categoryBreakdown[r.category]) {
      categoryBreakdown[r.category] = { total: 0, correct: 0, percentage: 0 };
    }
    categoryBreakdown[r.category].total++;
    if (r.isCorrect) categoryBreakdown[r.category].correct++;
  }
  for (const cat of Object.keys(categoryBreakdown)) {
    const cb = categoryBreakdown[cat];
    cb.percentage = cb.total > 0 ? Math.round((cb.correct / cb.total) * 100) : 0;
  }

  const difficultyProgression = state.responses.map((r, i) => ({
    index: i,
    difficulty: r.difficulty,
    correct: r.isCorrect,
    ability: state.ability.history[i + 1] || state.ability.theta,
  }));

  const { weakAreas, strongAreas } = computeWeakStrongAreas(state.responses);

  let passed = false;
  let passThreshold = 65;
  if (state.country === "US") {
    passThreshold = 70;
    passed = state.ability.theta > 0.3;
  } else {
    passed = score >= passThreshold;
  }

  let abilityBand: string | undefined;
  if (state.mode === "usa_cat") {
    const t = state.ability.theta;
    if (t >= 1.5) abilityBand = "Above Passing – High Performance";
    else if (t >= 0.5) abilityBand = "Above Passing";
    else if (t >= 0) abilityBand = "Near Passing – Above";
    else if (t >= -0.5) abilityBand = "Near Passing – Below";
    else abilityBand = "Below Passing";
  }

  const recommendations = generateRecommendations(weakAreas, strongAreas, score, state);

  return {
    sessionId: state.sessionId,
    mode: state.mode,
    country: state.country,
    totalQuestions,
    correctCount,
    score,
    timeSpent: Math.round(timeSpent / 1000),
    abilityEstimate: Math.round(state.ability.theta * 100) / 100,
    passed,
    categoryBreakdown,
    difficultyProgression,
    weakAreas: Object.keys(weakAreas),
    strongAreas: Object.keys(strongAreas),
    recommendations,
    abilityBand,
  };
}

function generateRecommendations(
  weakAreas: Record<string, number>,
  strongAreas: Record<string, number>,
  score: number,
  state: ExamSessionState
): string[] {
  const recs: string[] = [];

  const weakList = Object.entries(weakAreas).sort((a, b) => b[1] - a[1]);
  for (const [area] of weakList.slice(0, 3)) {
    recs.push(`Focus on ${area} – use adaptive practice weak-area drill mode`);
  }

  if (score < 60) {
    recs.push("Review foundational concepts across all domains before retesting");
    recs.push("Use flashcard decks for key terminology and concepts");
  } else if (score < 75) {
    recs.push("Target weak areas with focused practice quizzes");
    recs.push("Review rationales for all incorrect answers");
  } else {
    recs.push("Maintain current study pace – focus on timed practice to build speed");
  }

  if (state.mode === "usa_cat" && state.ability.theta < 0) {
    recs.push("Practice with progressively harder questions to build adaptive test stamina");
  }

  return recs;
}

function summarizeCatSimulation(responses: QuestionResponse[]): {
  totalCorrect: number;
  totalIncorrect: number;
  overallScore: number;
  categoryBreakdown: Record<string, { correct: number; incorrect: number }>;
} {
  let totalCorrect = 0;
  let totalIncorrect = 0;
  const categoryBreakdown: Record<string, { correct: number; incorrect: number }> = {};
  for (const r of responses) {
    if (r.isCorrect) totalCorrect++;
    else totalIncorrect++;
    const cat = r.category || "general";
    if (!categoryBreakdown[cat]) categoryBreakdown[cat] = { correct: 0, incorrect: 0 };
    if (r.isCorrect) categoryBreakdown[cat].correct++;
    else categoryBreakdown[cat].incorrect++;
  }
  const n = totalCorrect + totalIncorrect;
  const overallScore = n === 0 ? 0 : (totalCorrect / n) * 100;
  return { totalCorrect, totalIncorrect, overallScore, categoryBreakdown };
}

export function simulateCAT(
  profile: SimulationProfile,
  questions: QuestionCandidate[],
  catParams: CATParameters
): {
  responses: QuestionResponse[];
  finalAbility: number;
  questionsUsed: number;
  stoppedReason: string;
  totalCorrect: number;
  totalIncorrect: number;
  overallScore: number;
  categoryBreakdown: Record<string, { correct: number; incorrect: number }>;
} {
  const state: ExamSessionState = {
    sessionId: "sim-" + Date.now(),
    mode: "usa_cat",
    country: "US",
    currentIndex: 0,
    totalQuestions: catParams.maxQuestions,
    timeLimit: catParams.timeLimit,
    startedAt: new Date().toISOString(),
    ability: createInitialAbility(),
    responses: [],
    questionIds: [],
    flaggedIds: [],
    coverageAchieved: {},
    weakAreaMap: {},
    strongAreaMap: {},
    stabilityScore: 1.0,
    completed: false,
    catParams,
  };

  const simResponses: QuestionResponse[] = [];

  for (let i = 0; i < catParams.maxQuestions; i++) {
    const nextQ = selectNextQuestion(questions, state, catParams);
    if (!nextQ) break;

    const diffKey = nextQ.difficulty as keyof typeof profile.difficultyModifier;
    const accuracy = profile.difficultyModifier[diffKey] ?? profile.baseAccuracy;
    const isCorrect = Math.random() < accuracy;

    const response: QuestionResponse = {
      questionId: nextQ.id,
      selectedAnswer: isCorrect ? "correct" : "wrong",
      isCorrect,
      responseTimeMs: 15000 + Math.random() * 60000,
      difficulty: nextQ.difficulty,
      category: nextQ.category,
    };

    simResponses.push(response);
    state.responses.push(response);
    state.questionIds.push(nextQ.id);
    state.coverageAchieved[nextQ.category] = (state.coverageAchieved[nextQ.category] || 0) + 1;

    state.ability = updateAbilityEstimate(
      state.ability,
      isCorrect,
      nextQ.difficultyNum,
      response.responseTimeMs,
      catParams
    );

    const stopCheck = shouldStopCAT(state, catParams);
    if (stopCheck.stop) {
      const stats = summarizeCatSimulation(simResponses);
      return {
        responses: simResponses,
        finalAbility: state.ability.theta,
        questionsUsed: simResponses.length,
        stoppedReason: stopCheck.reason,
        ...stats,
      };
    }
  }

  const stats = summarizeCatSimulation(simResponses);
  return {
    responses: simResponses,
    finalAbility: state.ability.theta,
    questionsUsed: simResponses.length,
    stoppedReason: "max_questions_reached",
    ...stats,
  };
}
