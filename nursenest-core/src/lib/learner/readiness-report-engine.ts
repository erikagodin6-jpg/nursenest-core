export type ReadinessLevel = "Needs Support" | "Developing" | "Progressing" | "Exam Ready" | "Strongly Exam Ready";

export type ConfidenceCategory =
  | "Strong Knowledge + Strong Confidence"
  | "Strong Knowledge + Low Confidence"
  | "Weak Knowledge + High Confidence"
  | "Weak Knowledge + Low Confidence";

export type ReadinessActivityType =
  | "lesson"
  | "flashcards"
  | "questions"
  | "clinical_skills"
  | "pharmacology"
  | "ecg"
  | "cat"
  | "loft";

export type ReadinessTopicAggregate = {
  topic: string;
  domain?: string | null;
  questionAccuracy?: number | null;
  questionsAnswered?: number;
  flashcardMasteryRate?: number | null;
  flashcardsReviewed?: number;
  lessonsCompleted?: number;
  clinicalSkillsCompleted?: number;
  pharmacologyActivities?: number;
  ecgActivities?: number;
  catScore?: number | null;
  loftScore?: number | null;
  confidenceAverage?: number | null;
  remediationAssigned?: number;
  remediationCompleted?: number;
  repeatedMisses?: number;
  missedConcepts?: string[];
  lastActivityAt?: string | null;
  priorMasteryScore?: number | null;
};

export type LearnerReadinessReportInput = {
  userId: string;
  pathway: string;
  tier?: string | null;
  examGoal?: string | null;
  availableStudyMinutesPerDay?: number | null;
  retentionRiskScore?: number | null;
  topics: ReadinessTopicAggregate[];
};

export type TopicMasteryScore = {
  topic: string;
  domain: string;
  masteryScore: number;
  confidenceAverage: number | null;
  progressTrend: "improving" | "stable" | "declining" | "unknown";
  evidence: string[];
};

export type ReadinessStrength = {
  topic: string;
  masteryScore: number;
  evidence: string[];
};

export type ReadinessImprovementArea = {
  topic: string;
  masteryScore: number;
  urgency: "critical" | "high" | "medium";
  explanation: string;
  missedConcepts: string[];
};

export type ConfidenceInsight = {
  topic: string;
  category: ConfidenceCategory;
  coaching: string;
};

export type RecommendedNextStep = {
  activityType: ReadinessActivityType;
  topic: string;
  title: string;
  estimatedMinutes: number;
  reason: string;
};

export type RecommendedStudyPlan = {
  days: 7 | 14 | 30;
  estimatedMinutes: number;
  dailyAverageMinutes: number;
  actions: RecommendedNextStep[];
};

export type LearnerReadinessReport = {
  generatedAt: string;
  userId: string;
  pathway: string;
  tier: string | null;
  examGoal: string | null;
  currentReadinessScore: number;
  priorReadinessScore: number | null;
  readinessDelta: number | null;
  readinessLevel: ReadinessLevel;
  topicMastery: TopicMasteryScore[];
  strengths: ReadinessStrength[];
  improvementAreas: ReadinessImprovementArea[];
  confidenceInsights: ConfidenceInsight[];
  recommendedNextSteps: RecommendedNextStep[];
  studyPlans: {
    sevenDay: RecommendedStudyPlan;
    fourteenDay: RecommendedStudyPlan;
    thirtyDay: RecommendedStudyPlan;
  };
  dashboardCard: {
    headline: string;
    strengths: string[];
    improvementAreas: string[];
    recommendedActions: string[];
    progressTrend: "improving" | "stable" | "declining" | "unknown";
  };
};

export type ReadinessExecutiveAnalytics = {
  generatedAt: string;
  learnerCount: number;
  averageReadiness: number;
  readinessByTier: Record<string, number>;
  readinessByPathway: Record<string, number>;
  mostCommonWeakAreas: Array<{ topic: string; learnerCount: number }>;
  mostEffectiveRemediation: Array<{ topic: string; completionRate: number; learnerCount: number }>;
  readinessImprovements: Array<{ userId: string; delta: number }>;
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeRate(value: number | null | undefined, fallback = 0.5): number {
  if (value == null || !Number.isFinite(value)) return fallback;
  return value > 1 ? Math.max(0, Math.min(1, value / 100)) : Math.max(0, Math.min(1, value));
}

function normalizeConfidence(value: number | null | undefined): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return value > 5 ? Math.max(1, Math.min(5, value / 20)) : Math.max(1, Math.min(5, value));
}

function trend(current: number, prior: number | null | undefined): TopicMasteryScore["progressTrend"] {
  if (prior == null || !Number.isFinite(prior)) return "unknown";
  const delta = current - prior;
  if (delta >= 5) return "improving";
  if (delta <= -5) return "declining";
  return "stable";
}

function readinessLevel(score: number): ReadinessLevel {
  if (score >= 90) return "Strongly Exam Ready";
  if (score >= 80) return "Exam Ready";
  if (score >= 68) return "Progressing";
  if (score >= 52) return "Developing";
  return "Needs Support";
}

function masteryEvidence(topic: ReadinessTopicAggregate): string[] {
  const evidence: string[] = [];
  if ((topic.questionsAnswered ?? 0) > 0 && topic.questionAccuracy != null) {
    evidence.push(`${Math.round(normalizeRate(topic.questionAccuracy) * 100)}% question accuracy across ${topic.questionsAnswered} question(s).`);
  }
  if ((topic.flashcardsReviewed ?? 0) > 0 && topic.flashcardMasteryRate != null) {
    evidence.push(`${Math.round(normalizeRate(topic.flashcardMasteryRate) * 100)}% flashcard mastery across ${topic.flashcardsReviewed} card(s).`);
  }
  if ((topic.lessonsCompleted ?? 0) > 0) evidence.push(`${topic.lessonsCompleted} lesson(s) completed.`);
  if ((topic.clinicalSkillsCompleted ?? 0) > 0) evidence.push(`${topic.clinicalSkillsCompleted} clinical skill activity item(s) completed.`);
  if ((topic.remediationCompleted ?? 0) > 0) evidence.push(`${topic.remediationCompleted} remediation item(s) completed.`);
  if (topic.confidenceAverage != null) evidence.push(`Average confidence ${normalizeConfidence(topic.confidenceAverage)?.toFixed(1)}/5.`);
  return evidence.length > 0 ? evidence : ["Limited activity recorded for this topic."];
}

export function scoreTopicMastery(topic: ReadinessTopicAggregate): TopicMasteryScore {
  const questionScore = normalizeRate(topic.questionAccuracy, 0.5) * 100;
  const flashcardScore = normalizeRate(topic.flashcardMasteryRate, 0.5) * 100;
  const confidence = normalizeConfidence(topic.confidenceAverage);
  const confidenceScore = confidence == null ? 55 : ((confidence - 1) / 4) * 100;
  const lessonScore = clamp(((topic.lessonsCompleted ?? 0) / 4) * 100);
  const remediationScore =
    (topic.remediationAssigned ?? 0) > 0 ? normalizeRate((topic.remediationCompleted ?? 0) / Math.max(1, topic.remediationAssigned ?? 0)) * 100 : 70;
  const appliedLearningScore = clamp(
    ((topic.clinicalSkillsCompleted ?? 0) / 3) * 30 +
      ((topic.pharmacologyActivities ?? 0) / 4) * 20 +
      ((topic.ecgActivities ?? 0) / 4) * 20 +
      normalizeRate(topic.catScore, 0.55) * 15 +
      normalizeRate(topic.loftScore, 0.55) * 15,
  );
  const repeatedMissPenalty = Math.min(18, (topic.repeatedMisses ?? 0) * 4);
  const masteryScore = clamp(
    questionScore * 0.28 +
      flashcardScore * 0.16 +
      confidenceScore * 0.14 +
      lessonScore * 0.12 +
      remediationScore * 0.16 +
      appliedLearningScore * 0.14 -
      repeatedMissPenalty,
  );

  return {
    topic: topic.topic,
    domain: topic.domain ?? "General",
    masteryScore,
    confidenceAverage: confidence,
    progressTrend: trend(masteryScore, topic.priorMasteryScore),
    evidence: masteryEvidence(topic),
  };
}

function confidenceCategory(masteryScore: number, confidence: number | null): ConfidenceCategory {
  const strongKnowledge = masteryScore >= 75;
  const strongConfidence = confidence != null && confidence >= 3.7;
  if (strongKnowledge && strongConfidence) return "Strong Knowledge + Strong Confidence";
  if (strongKnowledge) return "Strong Knowledge + Low Confidence";
  if (strongConfidence) return "Weak Knowledge + High Confidence";
  return "Weak Knowledge + Low Confidence";
}

function confidenceCoaching(category: ConfidenceCategory): string {
  switch (category) {
    case "Strong Knowledge + Strong Confidence":
      return "Maintain this area with short mixed review so it stays reliable under exam pressure.";
    case "Strong Knowledge + Low Confidence":
      return "Your performance is stronger than your confidence. Use timed practice and brief retrieval reps to build trust in your judgment.";
    case "Weak Knowledge + High Confidence":
      return "Slow down and review the missed concepts. Confidence is running ahead of accuracy in this area.";
    case "Weak Knowledge + Low Confidence":
      return "Rebuild this topic with a lesson, focused flashcards, then a small question set.";
  }
}

function nextStepsForArea(area: ReadinessImprovementArea): RecommendedNextStep[] {
  const topic = area.topic;
  const lower = topic.toLowerCase();
  const actions: RecommendedNextStep[] = [
    {
      activityType: "lesson",
      topic,
      title: `Review ${topic} lesson`,
      estimatedMinutes: 18,
      reason: `Rebuild the concept foundation for ${topic}.`,
    },
    {
      activityType: "flashcards",
      topic,
      title: `Review ${topic} flashcards`,
      estimatedMinutes: 12,
      reason: "Use retrieval practice to strengthen recall before questions.",
    },
    {
      activityType: "questions",
      topic,
      title: `Practice 15 ${topic} questions`,
      estimatedMinutes: 20,
      reason: "Check whether remediation is transferring into clinical judgment.",
    },
  ];
  if (lower.includes("pharm") || lower.includes("medication") || lower.includes("insulin")) {
    actions.push({
      activityType: "pharmacology",
      topic,
      title: `Complete ${topic} pharmacology review`,
      estimatedMinutes: 16,
      reason: "Medication safety benefits from mechanism, monitoring, and teaching review.",
    });
  }
  if (lower.includes("ecg") || lower.includes("cardiac") || lower.includes("telemetry")) {
    actions.push({
      activityType: "ecg",
      topic,
      title: `Complete ${topic} ECG practice`,
      estimatedMinutes: 15,
      reason: "Rhythm and cue recognition improve with short visual interpretation reps.",
    });
  }
  if (area.urgency === "critical" || area.urgency === "high") {
    actions.push({
      activityType: "cat",
      topic,
      title: `Take a mini CAT focused on ${topic}`,
      estimatedMinutes: 25,
      reason: "Adaptive assessment confirms whether the weak area is improving under mixed conditions.",
    });
  }
  return actions;
}

function buildStudyPlan(days: 7 | 14 | 30, actions: RecommendedNextStep[], availableMinutesPerDay: number): RecommendedStudyPlan {
  const targetMinutes = availableMinutesPerDay * days;
  const expanded = [...actions];
  while (expanded.reduce((sum, action) => sum + action.estimatedMinutes, 0) < targetMinutes * 0.75 && expanded.length < actions.length * 4) {
    expanded.push(...actions.slice(0, Math.min(3, actions.length)));
  }
  const selected: RecommendedNextStep[] = [];
  let minutes = 0;
  for (const action of expanded) {
    if (minutes + action.estimatedMinutes > targetMinutes && selected.length > 0) continue;
    selected.push(action);
    minutes += action.estimatedMinutes;
    if (minutes >= targetMinutes * 0.85) break;
  }
  return {
    days,
    estimatedMinutes: minutes,
    dailyAverageMinutes: Math.round(minutes / days),
    actions: selected,
  };
}

function reportTrend(topicMastery: TopicMasteryScore[]): LearnerReadinessReport["dashboardCard"]["progressTrend"] {
  const known = topicMastery.filter((topic) => topic.progressTrend !== "unknown");
  if (known.length === 0) return "unknown";
  const improving = known.filter((topic) => topic.progressTrend === "improving").length;
  const declining = known.filter((topic) => topic.progressTrend === "declining").length;
  if (improving > declining) return "improving";
  if (declining > improving) return "declining";
  return "stable";
}

export function buildReadinessReport(
  input: LearnerReadinessReportInput,
  generatedAt = new Date().toISOString(),
): LearnerReadinessReport {
  const topicMastery = input.topics.map(scoreTopicMastery).sort((a, b) => b.masteryScore - a.masteryScore);
  const priorTopicScores = input.topics
    .map((topic) => topic.priorMasteryScore)
    .filter((score): score is number => typeof score === "number" && Number.isFinite(score));
  const priorReadinessScore = priorTopicScores.length > 0 ? clamp(priorTopicScores.reduce((sum, score) => sum + score, 0) / priorTopicScores.length) : null;
  const currentReadinessScore = clamp(
    topicMastery.length > 0 ? topicMastery.reduce((sum, topic) => sum + topic.masteryScore, 0) / topicMastery.length - Math.max(0, (input.retentionRiskScore ?? 0) - 70) * 0.12 : 0,
  );
  const strengths = topicMastery
    .filter((topic) => topic.masteryScore >= 78)
    .slice(0, 5)
    .map((topic) => ({ topic: topic.topic, masteryScore: topic.masteryScore, evidence: topic.evidence }));
  const improvementAreas = [...topicMastery]
    .reverse()
    .filter((topic) => topic.masteryScore < 72)
    .slice(0, 6)
    .map((topic): ReadinessImprovementArea => {
      const source = input.topics.find((item) => item.topic === topic.topic);
      return {
        topic: topic.topic,
        masteryScore: topic.masteryScore,
        urgency: topic.masteryScore < 50 ? "critical" : topic.masteryScore < 62 ? "high" : "medium",
        explanation: `${topic.topic} is limiting readiness because mastery is ${topic.masteryScore}/100 and recent evidence shows ${topic.evidence[0].toLowerCase()}`,
        missedConcepts: source?.missedConcepts ?? [],
      };
    });
  const confidenceInsights = topicMastery.map((topic) => {
    const category = confidenceCategory(topic.masteryScore, topic.confidenceAverage);
    return {
      topic: topic.topic,
      category,
      coaching: confidenceCoaching(category),
    };
  });
  const recommendedNextSteps = improvementAreas.flatMap(nextStepsForArea).slice(0, 18);
  const availableMinutes = Math.max(10, Math.min(180, input.availableStudyMinutesPerDay ?? 45));
  const progressTrend = reportTrend(topicMastery);

  return {
    generatedAt,
    userId: input.userId,
    pathway: input.pathway,
    tier: input.tier ?? null,
    examGoal: input.examGoal ?? null,
    currentReadinessScore,
    priorReadinessScore,
    readinessDelta: priorReadinessScore == null ? null : currentReadinessScore - priorReadinessScore,
    readinessLevel: readinessLevel(currentReadinessScore),
    topicMastery,
    strengths,
    improvementAreas,
    confidenceInsights,
    recommendedNextSteps,
    studyPlans: {
      sevenDay: buildStudyPlan(7, recommendedNextSteps, availableMinutes),
      fourteenDay: buildStudyPlan(14, recommendedNextSteps, availableMinutes),
      thirtyDay: buildStudyPlan(30, recommendedNextSteps, availableMinutes),
    },
    dashboardCard: {
      headline: `${currentReadinessScore}/100 ${readinessLevel(currentReadinessScore)}`,
      strengths: strengths.map((strength) => strength.topic),
      improvementAreas: improvementAreas.map((area) => area.topic),
      recommendedActions: recommendedNextSteps.slice(0, 4).map((step) => step.title),
      progressTrend,
    },
  };
}

function average(values: number[]): number {
  return values.length > 0 ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : 0;
}

export function buildReadinessExecutiveAnalytics(
  reports: LearnerReadinessReport[],
  generatedAt = new Date().toISOString(),
): ReadinessExecutiveAnalytics {
  const readinessByTier: Record<string, number> = {};
  const readinessByPathway: Record<string, number> = {};
  const weakAreaCounts = new Map<string, number>();
  const remediation = new Map<string, { completed: number; assigned: number; learners: number }>();

  for (const report of reports) {
    const tier = report.tier ?? "Unassigned";
    const pathway = report.pathway;
    readinessByTier[tier] = average([...reports.filter((item) => (item.tier ?? "Unassigned") === tier).map((item) => item.currentReadinessScore)]);
    readinessByPathway[pathway] = average([...reports.filter((item) => item.pathway === pathway).map((item) => item.currentReadinessScore)]);
    for (const area of report.improvementAreas) {
      weakAreaCounts.set(area.topic, (weakAreaCounts.get(area.topic) ?? 0) + 1);
    }
    for (const topic of report.topicMastery) {
      const row = remediation.get(topic.topic) ?? { completed: 0, assigned: 0, learners: 0 };
      if (topic.masteryScore >= 72) row.completed += 1;
      row.assigned += 1;
      row.learners += 1;
      remediation.set(topic.topic, row);
    }
  }

  return {
    generatedAt,
    learnerCount: reports.length,
    averageReadiness: average(reports.map((report) => report.currentReadinessScore)),
    readinessByTier,
    readinessByPathway,
    mostCommonWeakAreas: [...weakAreaCounts.entries()]
      .map(([topic, learnerCount]) => ({ topic, learnerCount }))
      .sort((a, b) => b.learnerCount - a.learnerCount)
      .slice(0, 10),
    mostEffectiveRemediation: [...remediation.entries()]
      .map(([topic, row]) => ({
        topic,
        completionRate: clamp((row.completed / Math.max(1, row.assigned)) * 100),
        learnerCount: row.learners,
      }))
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 10),
    readinessImprovements: reports
      .filter((report) => report.readinessDelta != null)
      .map((report) => ({ userId: report.userId, delta: report.readinessDelta ?? 0 }))
      .filter((row) => row.delta !== 0),
  };
}
