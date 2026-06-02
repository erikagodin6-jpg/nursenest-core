export type FlashcardRecallRating = "again" | "hard" | "good" | "easy";

export type FlashcardLearningSignal = {
  cardId: string;
  topic?: string | null;
  subtopic?: string | null;
  isCorrect: boolean;
  confidence?: 1 | 2 | 3 | 4 | 5 | null;
  rating?: FlashcardRecallRating | null;
  responseMs?: number | null;
  difficulty?: "easy" | "medium" | "hard" | null;
  timestamp?: number;
};

export type TopicInsight = {
  topic: string;
  attempts: number;
  correct: number;
  accuracy: number;
  lowConfidenceCount: number;
  highConfidenceWrongCount: number;
  againOrHardCount: number;
};

export type LearningInsight = {
  tone: "strength" | "coach" | "caution";
  message: string;
  topic?: string;
};

export type StudyStreakSummary = {
  reviewed: number;
  mastered: number;
  improving: number;
  needsReview: number;
};

export type LearnerReadinessIndex = {
  score: number;
  level: "Needs Support" | "Developing" | "Exam Ready" | "Strongly Exam Ready";
  drivers: string[];
};

function topicLabel(signal: FlashcardLearningSignal): string {
  return signal.topic?.trim() || signal.subtopic?.trim() || "This topic";
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function summarizeTopicInsights(signals: FlashcardLearningSignal[]): TopicInsight[] {
  const map = new Map<string, TopicInsight>();
  for (const signal of signals) {
    const topic = topicLabel(signal);
    const row = map.get(topic) ?? {
      topic,
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lowConfidenceCount: 0,
      highConfidenceWrongCount: 0,
      againOrHardCount: 0,
    };
    row.attempts += 1;
    row.correct += signal.isCorrect ? 1 : 0;
    if ((signal.confidence ?? 3) <= 2) row.lowConfidenceCount += 1;
    if (!signal.isCorrect && (signal.confidence ?? 0) >= 4) row.highConfidenceWrongCount += 1;
    if (signal.rating === "again" || signal.rating === "hard") row.againOrHardCount += 1;
    row.accuracy = row.attempts > 0 ? row.correct / row.attempts : 0;
    map.set(topic, row);
  }
  return [...map.values()].sort((a, b) => b.attempts - a.attempts || a.topic.localeCompare(b.topic));
}

export function detectWeakTopicWindows(
  signals: FlashcardLearningSignal[],
  windows = [5, 10, 25],
  threshold = 0.6,
): Array<{ topic: string; window: number; attempts: number; correct: number; accuracy: number }> {
  const out: Array<{ topic: string; window: number; attempts: number; correct: number; accuracy: number }> = [];
  const topics = [...new Set(signals.map(topicLabel))];
  for (const topic of topics) {
    const topicSignals = signals.filter((signal) => topicLabel(signal) === topic);
    for (const window of windows) {
      const recent = topicSignals.slice(-window);
      if (recent.length < Math.min(4, window)) continue;
      const correct = recent.filter((signal) => signal.isCorrect).length;
      const accuracy = correct / recent.length;
      const lowConfidence = recent.filter((signal) => (signal.confidence ?? 3) <= 2).length;
      const hardRecall = recent.filter((signal) => signal.rating === "again" || signal.rating === "hard").length;
      if (accuracy < threshold || lowConfidence >= Math.ceil(recent.length * 0.6) || hardRecall >= Math.ceil(recent.length * 0.6)) {
        out.push({ topic, window, attempts: recent.length, correct, accuracy });
      }
    }
  }
  return out.sort((a, b) => a.accuracy - b.accuracy || a.window - b.window);
}

export function buildLearningInsights(signals: FlashcardLearningSignal[]): LearningInsight[] {
  if (signals.length < 3) return [];
  const topics = summarizeTopicInsights(signals);
  const insights: LearningInsight[] = [];
  const strongest = topics.find((row) => row.attempts >= 3 && row.accuracy >= 0.8);
  if (strongest) {
    insights.push({
      tone: "strength",
      topic: strongest.topic,
      message: `You are consistently answering ${strongest.topic.toLowerCase()} cards correctly.`,
    });
  }
  const weak = topics.find((row) => row.attempts >= 3 && row.accuracy < 0.6);
  if (weak) {
    insights.push({
      tone: "coach",
      topic: weak.topic,
      message: `A short ${weak.topic.toLowerCase()} review would help reinforce this concept before it becomes a pattern.`,
    });
  }
  const overconfident = topics.find((row) => row.highConfidenceWrongCount >= 2);
  if (overconfident) {
    insights.push({
      tone: "caution",
      topic: overconfident.topic,
      message: `You may be overestimating mastery in ${overconfident.topic.toLowerCase()}. Slow down and compare the rationale to the stem cues.`,
    });
  }
  const underconfident = topics.find((row) => row.attempts >= 3 && row.accuracy >= 0.75 && row.lowConfidenceCount >= 2);
  if (underconfident) {
    insights.push({
      tone: "coach",
      topic: underconfident.topic,
      message: `Your ${underconfident.topic.toLowerCase()} knowledge is stronger than your confidence suggests.`,
    });
  }
  return insights.slice(0, 3);
}

export function summarizeStudyStreak(signals: FlashcardLearningSignal[]): StudyStreakSummary {
  return signals.reduce<StudyStreakSummary>(
    (summary, signal) => {
      summary.reviewed += 1;
      if (signal.rating === "easy" || (signal.isCorrect && (signal.confidence ?? 0) >= 4)) summary.mastered += 1;
      else if (signal.rating === "good" || signal.isCorrect) summary.improving += 1;
      else summary.needsReview += 1;
      return summary;
    },
    { reviewed: 0, mastered: 0, improving: 0, needsReview: 0 },
  );
}

export function calculateConfidenceAccuracyGap(signals: FlashcardLearningSignal[]): {
  overconfidentWrong: number;
  underconfidentCorrect: number;
  message: string | null;
} {
  const overconfidentWrong = signals.filter((signal) => !signal.isCorrect && (signal.confidence ?? 0) >= 4).length;
  const underconfidentCorrect = signals.filter((signal) => signal.isCorrect && (signal.confidence ?? 3) <= 2).length;
  let message: string | null = null;
  if (overconfidentWrong >= 2) {
    message = "Confidence is running ahead of accuracy on a few cards. Use the rationale to reset the clinical cue you missed.";
  } else if (underconfidentCorrect >= 2) {
    message = "Your accuracy is stronger than your confidence. Keep rating honestly, but trust the concepts you are recognizing.";
  }
  return { overconfidentWrong, underconfidentCorrect, message };
}

export function calculateLearnerReadinessIndex(signals: FlashcardLearningSignal[]): LearnerReadinessIndex {
  if (signals.length === 0) {
    return { score: 0, level: "Needs Support", drivers: ["No flashcard signals recorded yet."] };
  }
  const accuracy = signals.filter((signal) => signal.isCorrect).length / signals.length;
  const confidentCorrect = signals.filter((signal) => signal.isCorrect && (signal.confidence ?? 3) >= 3).length / signals.length;
  const retention = signals.filter((signal) => signal.rating === "good" || signal.rating === "easy").length / signals.length;
  const coverage = Math.min(1, new Set(signals.map(topicLabel)).size / 5);
  const consistency = Math.min(1, signals.length / 20);
  const score = clampScore((accuracy * 38 + confidentCorrect * 22 + retention * 22 + coverage * 10 + consistency * 8));
  const level =
    score >= 90 ? "Strongly Exam Ready" :
    score >= 75 ? "Exam Ready" :
    score >= 50 ? "Developing" :
    "Needs Support";
  const drivers: string[] = [];
  if (accuracy >= 0.75) drivers.push("Strong recent accuracy");
  if (retention < 0.6) drivers.push("More spaced repetition needed");
  if (coverage < 0.6) drivers.push("Broaden topic coverage");
  if (confidentCorrect < 0.6) drivers.push("Confidence and accuracy are still stabilizing");
  return { score, level, drivers };
}

export function buildRecommendedNextSteps(signals: FlashcardLearningSignal[]): string[] {
  const weak = detectWeakTopicWindows(signals)[0];
  if (!weak) return ["Continue your next scheduled flashcard set."];
  return [
    `Review the ${weak.topic} lesson.`,
    `Complete a focused ${weak.topic} flashcard set.`,
    `Practice 10 related questions before your next mixed review.`,
  ];
}

