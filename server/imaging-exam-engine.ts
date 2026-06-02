export interface ImagingCandidateQuestion {
  id: string;
  difficulty: number;
  category: string;
  topic: string;
  modality?: string;
  bodyPart?: string;
  hasImage?: boolean;
  lastSeenByUser?: Date | null;
}

export interface ImagingExamOptions {
  country: string;
  examType: string;
  mode: "adaptive" | "practice" | "mock";
  examLength: number;
  topicWeights?: Record<string, number>;
  imageQuestionPercentage?: number;
  difficultySensitivity?: number;
  reuseCooldownDays?: number;
}

const DIFFICULTY_STEP_UP = 0.4;
const DIFFICULTY_STEP_DOWN = 0.6;
const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 5;
const STARTING_DIFFICULTY = 3;

const DEFAULT_CAMRT_WEIGHTS: Record<string, number> = {
  "Radiographic Positioning": 0.25,
  "Radiation Physics": 0.15,
  "Radiation Safety": 0.15,
  "Image Production": 0.20,
  "Patient Care": 0.15,
  "Equipment Operation": 0.10,
};

const DEFAULT_ARRT_WEIGHTS: Record<string, number> = {
  "Patient Care": 0.18,
  "Image Production": 0.28,
  "Procedures": 0.30,
  "Radiation Safety": 0.14,
  "Equipment Operation": 0.10,
};

export function getDefaultWeights(examType: string): Record<string, number> {
  return examType === "arrt" ? DEFAULT_ARRT_WEIGHTS : DEFAULT_CAMRT_WEIGHTS;
}

export function adjustDifficulty(
  currentDifficulty: number,
  isCorrect: boolean,
  sensitivity: number = 0.5
): number {
  const stepUp = DIFFICULTY_STEP_UP * sensitivity;
  const stepDown = DIFFICULTY_STEP_DOWN * sensitivity;

  let next: number;
  if (isCorrect) {
    next = currentDifficulty + stepUp;
  } else {
    next = currentDifficulty - stepDown;
  }

  return Math.round(Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, next)) * 10) / 10;
}

export function selectNextQuestion(
  candidates: ImagingCandidateQuestion[],
  currentDifficulty: number,
  answeredCategories: Record<string, number>,
  totalAnswered: number,
  answeredQuestionIds: Set<string>,
  topicWeights: Record<string, number>,
  recentTopics: string[],
  imageQuestionPct: number = 20,
  imageQuestionsAnswered: number = 0,
  reuseCooldownDays: number = 7
): ImagingCandidateQuestion | null {
  const available = candidates.filter(q => !answeredQuestionIds.has(q.id));
  if (available.length === 0) return null;

  const now = new Date();
  const cooldownMs = reuseCooldownDays * 24 * 60 * 60 * 1000;

  const scored = available.map(q => {
    const diffDistance = Math.abs((q.difficulty || 3) - currentDifficulty);
    const diffScore = Math.max(0, 1 - diffDistance / 4);

    const catWeight = topicWeights[q.category] || 0.1;
    const catAnswered = answeredCategories[q.category] || 0;
    const targetCount = catWeight * totalAnswered;
    const blueprintScore = targetCount > 0
      ? Math.max(0, 1 - catAnswered / Math.max(targetCount, 1))
      : 0.8;

    const recentIdx = recentTopics.lastIndexOf(q.topic || q.category);
    const repetitionPenalty = recentIdx >= 0 && recentTopics.length - recentIdx < 3 ? 0.3 : 0;

    let cooldownPenalty = 0;
    if (q.lastSeenByUser) {
      const elapsed = now.getTime() - new Date(q.lastSeenByUser).getTime();
      if (elapsed < cooldownMs) {
        cooldownPenalty = 0.5 * (1 - elapsed / cooldownMs);
      }
    }

    const imagePct = totalAnswered > 0 ? (imageQuestionsAnswered / totalAnswered) * 100 : 0;
    let imageBonus = 0;
    if (q.hasImage && imagePct < imageQuestionPct) {
      imageBonus = 0.15;
    } else if (!q.hasImage && imagePct > imageQuestionPct + 10) {
      imageBonus = 0.1;
    }

    const score = diffScore * 0.4 + blueprintScore * 0.3 + imageBonus - repetitionPenalty - cooldownPenalty;

    return { question: q, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topN = scored.slice(0, Math.min(5, scored.length));
  const pick = topN[Math.floor(Math.random() * topN.length)];

  return pick?.question || null;
}

export type ReadinessBand =
  | "Needs Review"
  | "Approaching Readiness"
  | "Likely Exam Ready"
  | "Strong Exam Readiness";

export function getReadinessBand(scorePercent: number): ReadinessBand {
  if (scorePercent >= 85) return "Strong Exam Readiness";
  if (scorePercent >= 70) return "Likely Exam Ready";
  if (scorePercent >= 55) return "Approaching Readiness";
  return "Needs Review";
}

export interface ExamReport {
  overallScore: number;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  readinessBand: ReadinessBand;
  topicBreakdown: Record<string, { correct: number; total: number; percent: number }>;
  difficultyBreakdown: Record<string, { correct: number; total: number; percent: number }>;
  imageQuestionPerformance: { correct: number; total: number; percent: number };
  timeSpent: number;
  averageTimePerQuestion: number;
  abilityEstimate: number;
  recommendations: string[];
}

export function generateExamReport(
  questions: Array<{
    id: string;
    category: string;
    difficulty: number;
    hasImage?: boolean;
    userAnswer: string | null;
    isCorrect: boolean;
    timeSpent: number;
  }>,
  abilityEstimate: number,
  totalTimeSpent: number,
  country: string
): ExamReport {
  const totalQuestions = questions.length;
  const correctCount = questions.filter(q => q.isCorrect).length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const readinessBand = getReadinessBand(scorePercent);

  const topicBreakdown: Record<string, { correct: number; total: number; percent: number }> = {};
  const diffBuckets: Record<string, { correct: number; total: number; percent: number }> = {};

  let imageCorrect = 0;
  let imageTotal = 0;

  for (const q of questions) {
    const cat = q.category || "Other";
    if (!topicBreakdown[cat]) topicBreakdown[cat] = { correct: 0, total: 0, percent: 0 };
    topicBreakdown[cat].total++;
    if (q.isCorrect) topicBreakdown[cat].correct++;

    const diffLabel = q.difficulty <= 2 ? "Easy" : q.difficulty <= 3 ? "Medium" : "Hard";
    if (!diffBuckets[diffLabel]) diffBuckets[diffLabel] = { correct: 0, total: 0, percent: 0 };
    diffBuckets[diffLabel].total++;
    if (q.isCorrect) diffBuckets[diffLabel].correct++;

    if (q.hasImage) {
      imageTotal++;
      if (q.isCorrect) imageCorrect++;
    }
  }

  for (const cat of Object.keys(topicBreakdown)) {
    const d = topicBreakdown[cat];
    d.percent = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
  }
  for (const d of Object.keys(diffBuckets)) {
    const b = diffBuckets[d];
    b.percent = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
  }

  const recommendations: string[] = [];
  const weakTopics = Object.entries(topicBreakdown)
    .filter(([, d]) => d.percent < 60 && d.total >= 2)
    .sort((a, b) => a[1].percent - b[1].percent);

  for (const [topic, data] of weakTopics.slice(0, 3)) {
    recommendations.push(`Review ${topic} — scored ${data.percent}% (${data.correct}/${data.total})`);
  }

  if (imageTotal > 0 && (imageCorrect / imageTotal) < 0.6) {
    recommendations.push(`Practice image interpretation questions — scored ${Math.round((imageCorrect / imageTotal) * 100)}%`);
  }

  if (scorePercent < 70) {
    recommendations.push(`Focus on flashcard review for weak areas before attempting another mock exam`);
  }

  if (recommendations.length === 0) {
    recommendations.push("Strong performance across all areas. Continue with full mock exams to maintain readiness.");
  }

  return {
    overallScore: correctCount,
    totalQuestions,
    correctCount,
    scorePercent,
    readinessBand,
    topicBreakdown,
    difficultyBreakdown: diffBuckets,
    imageQuestionPerformance: {
      correct: imageCorrect,
      total: imageTotal,
      percent: imageTotal > 0 ? Math.round((imageCorrect / imageTotal) * 100) : 0,
    },
    timeSpent: totalTimeSpent,
    averageTimePerQuestion: totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0,
    abilityEstimate,
    recommendations,
  };
}

export const EXAM_LENGTH_OPTIONS = [
  { value: 25, label: "Quick Practice", time: 30 },
  { value: 50, label: "Standard", time: 60 },
  { value: 75, label: "Extended", time: 90 },
  { value: 100, label: "Full Mock", time: 120 },
  { value: 200, label: "Certification Simulation", time: 240 },
];
