export type LearnerModelSignal = Readonly<{
  topic: string;
  accuracy: number;
  retention: number;
  confidence: number;
  clinicalJudgment: number;
  prioritization: number;
  attempts: number;
  lastSeenDaysAgo: number;
}>;

export type LearnerTopicModel = Readonly<{
  topic: string;
  knowledge: number;
  retention: number;
  confidence: number;
  clinicalJudgment: number;
  prioritization: number;
  misunderstandingRisk: number;
  decayRisk: number;
  nextStudyPriority: number;
}>;

export type PersonalLearningTwin = Readonly<{
  learnerId: string;
  topics: readonly LearnerTopicModel[];
  overallKnowledge: number;
  overallRetention: number;
  overallClinicalJudgment: number;
  overallConfidenceCalibration: number;
  weakAreas: readonly string[];
  forgottenAreas: readonly string[];
  misunderstoodAreas: readonly string[];
  improvementTrend: "improving" | "stable" | "declining" | "insufficient_data";
  learningSpeed: "fast" | "steady" | "slow" | "insufficient_data";
  nextBestTopics: readonly string[];
}>;

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function modelTopic(signal: LearnerModelSignal): LearnerTopicModel {
  const knowledge = clamp01(signal.accuracy * 0.7 + Math.min(signal.attempts / 20, 1) * 0.3);
  const retention = clamp01(signal.retention - Math.min(signal.lastSeenDaysAgo / 90, 0.35));
  const confidenceGap = Math.abs(signal.confidence - signal.accuracy);
  const misunderstandingRisk = clamp01(
    (signal.confidence > 0.75 && signal.accuracy < 0.65 ? 0.45 : 0) +
      (signal.clinicalJudgment < 0.65 ? 0.3 : 0) +
      confidenceGap * 0.25,
  );
  const decayRisk = clamp01((1 - retention) * 0.7 + Math.min(signal.lastSeenDaysAgo / 60, 1) * 0.3);
  const nextStudyPriority = clamp01(
    (1 - knowledge) * 0.3 +
      (1 - retention) * 0.25 +
      (1 - signal.clinicalJudgment) * 0.25 +
      misunderstandingRisk * 0.2,
  );

  return {
    topic: signal.topic,
    knowledge,
    retention,
    confidence: clamp01(signal.confidence),
    clinicalJudgment: clamp01(signal.clinicalJudgment),
    prioritization: clamp01(signal.prioritization),
    misunderstandingRisk,
    decayRisk,
    nextStudyPriority,
  };
}

function trendFromRecentScores(current: number, previous: number | null | undefined): PersonalLearningTwin["improvementTrend"] {
  if (previous == null) return "insufficient_data";
  if (current > previous + 0.03) return "improving";
  if (current < previous - 0.03) return "declining";
  return "stable";
}

function speedFromAttempts(signals: readonly LearnerModelSignal[]): PersonalLearningTwin["learningSpeed"] {
  if (signals.length === 0) return "insufficient_data";
  const avgAttempts = average(signals.map((signal) => signal.attempts));
  const avgAccuracy = average(signals.map((signal) => signal.accuracy));
  if (avgAttempts <= 6 && avgAccuracy >= 0.78) return "fast";
  if (avgAttempts <= 12 && avgAccuracy >= 0.68) return "steady";
  return "slow";
}

export function buildPersonalLearningTwin(args: {
  learnerId: string;
  signals: readonly LearnerModelSignal[];
  previousOverallKnowledge?: number | null;
}): PersonalLearningTwin {
  const topics = args.signals.map(modelTopic).sort((a, b) => b.nextStudyPriority - a.nextStudyPriority);
  const overallKnowledge = average(topics.map((topic) => topic.knowledge));
  const overallRetention = average(topics.map((topic) => topic.retention));
  const overallClinicalJudgment = average(topics.map((topic) => topic.clinicalJudgment));
  const overallConfidenceCalibration = clamp01(
    1 - average(args.signals.map((signal) => Math.abs(signal.confidence - signal.accuracy))),
  );

  return {
    learnerId: args.learnerId,
    topics,
    overallKnowledge,
    overallRetention,
    overallClinicalJudgment,
    overallConfidenceCalibration,
    weakAreas: topics.filter((topic) => topic.knowledge < 0.65).map((topic) => topic.topic),
    forgottenAreas: topics.filter((topic) => topic.decayRisk >= 0.55).map((topic) => topic.topic),
    misunderstoodAreas: topics.filter((topic) => topic.misunderstandingRisk >= 0.5).map((topic) => topic.topic),
    improvementTrend: trendFromRecentScores(overallKnowledge, args.previousOverallKnowledge),
    learningSpeed: speedFromAttempts(args.signals),
    nextBestTopics: topics.slice(0, 5).map((topic) => topic.topic),
  };
}
