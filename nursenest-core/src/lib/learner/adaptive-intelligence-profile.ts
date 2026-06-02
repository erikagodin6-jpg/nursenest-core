import type {
  DimensionBreakdown,
  DimensionStat,
} from "@/lib/learner/exam-attempt-dimension-breakdown";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { CatTrendPoint } from "@/lib/learner/readiness-dashboard-data";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

export type AdaptiveCompetencyId =
  | "knowledge"
  | "clinical_reasoning"
  | "safety"
  | "prioritization"
  | "delegation"
  | "pharmacology"
  | "clinical_skills"
  | "ecg";

export type AdaptiveSystemId =
  | "cardiac"
  | "respiratory"
  | "neuro"
  | "gi"
  | "endocrine"
  | "renal"
  | "mental_health"
  | "maternal"
  | "pediatrics"
  | "leadership"
  | "professional_practice";

export type AdaptiveActivitySurface =
  | "lesson"
  | "flashcards"
  | "questions"
  | "cat"
  | "simulation"
  | "clinical_skills"
  | "pharmacology"
  | "ecg";

export type AdaptiveCompetencyScore = {
  id: AdaptiveCompetencyId | AdaptiveSystemId | string;
  label: string;
  score: number | null;
  confidence: "low" | "medium" | "high";
  direction: "improving" | "stable" | "regressing" | "unknown";
  retentionRisk: "low" | "medium" | "high";
  evidence: string[];
};

export type AdaptiveStudyPrescription = {
  id: string;
  title: string;
  reason: string;
  surface: AdaptiveActivitySurface;
  href: string;
  urgency: "today" | "this_week" | "critical";
  expectedImpact: string;
};

export type AdaptiveIntelligenceProfile = {
  generatedAt: string;
  readiness: {
    examReadinessScore: number | null;
    passingProbability: "unknown" | "low" | "developing" | "moderate" | "high";
    confidenceStability: number | null;
    consistencyScore: number | null;
    momentumScore: number | null;
    explanation: string[];
  };
  competencies: AdaptiveCompetencyScore[];
  systems: AdaptiveCompetencyScore[];
  prescriptions: {
    today: AdaptiveStudyPrescription[];
    thisWeek: AdaptiveStudyPrescription[];
    criticalWeakAreas: AdaptiveStudyPrescription[];
    highRiskAreas: AdaptiveStudyPrescription[];
    examReadinessGaps: AdaptiveStudyPrescription[];
  };
  signalCoverage: Array<{
    surface: AdaptiveActivitySurface;
    label: string;
    active: boolean;
    detail: string;
  }>;
};

const COMPETENCIES: Array<{
  id: AdaptiveCompetencyId;
  label: string;
  patterns: RegExp[];
}> = [
  {
    id: "knowledge",
    label: "Knowledge",
    patterns: [/knowledge|recall|foundational/i],
  },
  {
    id: "clinical_reasoning",
    label: "Clinical Reasoning",
    patterns: [/clinical judgment|reasoning|analysis|application/i],
  },
  {
    id: "safety",
    label: "Safety",
    patterns: [/safe|safety|infection|risk|harm/i],
  },
  {
    id: "prioritization",
    label: "Prioritization",
    patterns: [/priority|prioritization|urgent|first/i],
  },
  {
    id: "delegation",
    label: "Delegation",
    patterns: [/delegat|assignment|supervision|scope/i],
  },
  {
    id: "pharmacology",
    label: "Pharmacology",
    patterns: [/pharm|medication|drug|dose|dosage/i],
  },
  {
    id: "clinical_skills",
    label: "Clinical Skills",
    patterns: [/skill|assessment|documentation|sbar|procedure/i],
  },
  { id: "ecg", label: "ECG", patterns: [/ecg|ekg|rhythm|telemetry|stemi/i] },
];

const SYSTEMS: Array<{
  id: AdaptiveSystemId;
  label: string;
  patterns: RegExp[];
}> = [
  {
    id: "cardiac",
    label: "Cardiac",
    patterns: [/cardiac|cardio|heart|vascular|circulation/i],
  },
  {
    id: "respiratory",
    label: "Respiratory",
    patterns: [/respiratory|oxygen|airway|ventilation|pulmonary/i],
  },
  {
    id: "neuro",
    label: "Neuro",
    patterns: [/neuro|stroke|seizure|cognition|brain/i],
  },
  { id: "gi", label: "GI", patterns: [/gastro|gi|bowel|liver|abdomen/i] },
  {
    id: "endocrine",
    label: "Endocrine",
    patterns: [/endocrine|diabetes|insulin|thyroid|glucose/i],
  },
  {
    id: "renal",
    label: "Renal",
    patterns: [/renal|kidney|urinary|fluid|electrolyte/i],
  },
  {
    id: "mental_health",
    label: "Mental Health",
    patterns: [/mental|psychiatric|depression|anxiety|substance/i],
  },
  {
    id: "maternal",
    label: "Maternal",
    patterns: [/maternal|obstetric|pregnancy|postpartum|labor/i],
  },
  {
    id: "pediatrics",
    label: "Pediatrics",
    patterns: [/pediatric|child|infant|newborn|adolescent/i],
  },
  {
    id: "leadership",
    label: "Leadership",
    patterns: [/leadership|management|team|charge nurse|conflict/i],
  },
  {
    id: "professional_practice",
    label: "Professional Practice",
    patterns: [/professional|ethic|legal|privacy|documentation/i],
  },
];

function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function average(values: number[]): number | null {
  const usable = values.filter((v) => Number.isFinite(v));
  if (usable.length === 0) return null;
  return usable.reduce((sum, v) => sum + v, 0) / usable.length;
}

function factorPct(
  snapshot: PremiumDashboardSnapshot,
  id: string,
): number | null {
  const factor = snapshot.readiness.factors.find((f) => f.id === id);
  if (!factor || factor.maxPoints <= 0) return null;
  return (factor.points / factor.maxPoints) * 100;
}

function matchingStats(
  stats: DimensionStat[],
  patterns: RegExp[],
): DimensionStat[] {
  return stats.filter((stat) =>
    patterns.some((pattern) => pattern.test(stat.label)),
  );
}

function matchingWeakTopics(
  rows: WeakTopicRow[],
  patterns: RegExp[],
): WeakTopicRow[] {
  return rows.filter((row) => {
    const label = `${row.topic} ${row.normalizedTopic ?? ""}`;
    return patterns.some((pattern) => pattern.test(label));
  });
}

function directionFromWeak(
  rows: WeakTopicRow[],
  score: number | null,
): AdaptiveCompetencyScore["direction"] {
  if (
    rows.some(
      (row) =>
        (row.wrongStreak ?? 0) >= 2 || (row.weakPriorityScore ?? 0) >= 0.72,
    )
  )
    return "regressing";
  if (score != null && score >= 78) return "improving";
  if (score != null) return "stable";
  return "unknown";
}

function retentionRisk(args: {
  score: number | null;
  matchingWeak: WeakTopicRow[];
  evidenceTotal: number;
}): AdaptiveCompetencyScore["retentionRisk"] {
  if (
    args.matchingWeak.some(
      (row) => (row.wrongStreak ?? 0) >= 2 || (row.missRate ?? 0) >= 65,
    )
  )
    return "high";
  if (args.score == null || args.evidenceTotal < 5) return "medium";
  if (args.score < 60) return "high";
  if (args.score < 75) return "medium";
  return "low";
}

function confidenceFromEvidence(
  total: number,
  sourceCount: number,
): AdaptiveCompetencyScore["confidence"] {
  if (total >= 25 && sourceCount >= 2) return "high";
  if (total >= 8 || sourceCount >= 2) return "medium";
  return "low";
}

function buildScore(args: {
  id: AdaptiveCompetencyId | AdaptiveSystemId;
  label: string;
  patterns: RegExp[];
  snapshot: PremiumDashboardSnapshot;
  dimensions: DimensionBreakdown;
  topicPerf: TopicPerformanceSnapshot | null;
  baseSignals?: number[];
}): AdaptiveCompetencyScore {
  const weakTopics = args.topicPerf?.weakTopics ?? [];
  const stats = [
    ...matchingStats(args.dimensions.byBodySystem, args.patterns),
    ...matchingStats(args.dimensions.byCognitiveLevel, args.patterns),
    ...matchingStats(args.dimensions.byClientNeeds, args.patterns),
    ...matchingStats(args.dimensions.byQuestionType, args.patterns),
  ];
  const matchingWeak = matchingWeakTopics(weakTopics, args.patterns);
  const statAverage = average(stats.map((stat) => stat.accuracyPct));
  const weakPenalty =
    matchingWeak.length > 0
      ? (average(
          matchingWeak.map((row) =>
            row.weakPriorityScore != null
              ? row.weakPriorityScore * 100
              : row.missRate,
          ),
        ) ?? 0)
      : 0;
  const scoreBase = average([
    ...(args.baseSignals ?? []),
    ...(statAverage != null ? [statAverage] : []),
  ]);
  const decayed =
    scoreBase == null ? null : clampScore(scoreBase - weakPenalty * 0.28);
  const evidenceTotal =
    stats.reduce((sum, stat) => sum + stat.total, 0) +
    matchingWeak.reduce(
      (sum, row) => sum + (row.evidenceCount ?? row.attempted ?? 0),
      0,
    );
  const sourceCount =
    Number(stats.length > 0) +
    Number(matchingWeak.length > 0) +
    Number((args.baseSignals ?? []).length > 0);
  const evidence = [
    stats.length > 0
      ? `${stats.length} scored dimension signal${stats.length === 1 ? "" : "s"} matched this area.`
      : null,
    matchingWeak.length > 0
      ? `${matchingWeak.length} weak-topic signal${matchingWeak.length === 1 ? "" : "s"} increase review priority.`
      : null,
    (args.baseSignals ?? []).length > 0
      ? "Blended from the current readiness snapshot."
      : null,
  ].filter((line): line is string => Boolean(line));

  return {
    id: args.id,
    label: args.label,
    score: decayed,
    confidence: confidenceFromEvidence(evidenceTotal, sourceCount),
    direction: directionFromWeak(matchingWeak, decayed),
    retentionRisk: retentionRisk({
      score: decayed,
      matchingWeak,
      evidenceTotal,
    }),
    evidence:
      evidence.length > 0
        ? evidence
        : ["No dedicated signal yet; keep studying to build this profile."],
  };
}

function readinessProbability(
  score: number | null,
): AdaptiveIntelligenceProfile["readiness"]["passingProbability"] {
  if (score == null) return "unknown";
  if (score >= 85) return "high";
  if (score >= 72) return "moderate";
  if (score >= 55) return "developing";
  return "low";
}

function trendScore(catTrend: CatTrendPoint[]): number | null {
  if (catTrend.length < 2) return null;
  const first = catTrend[0]!.score;
  const last = catTrend[catTrend.length - 1]!.score;
  return clampScore(50 + (last - first) * 2);
}

function stabilityScore(
  catTrend: CatTrendPoint[],
  readinessConfidence: string,
): number | null {
  if (catTrend.length < 2) {
    if (readinessConfidence === "high") return 75;
    if (readinessConfidence === "medium") return 60;
    return null;
  }
  const scores = catTrend.map((p) => p.score);
  const mean = average(scores) ?? 0;
  const variance = average(scores.map((score) => (score - mean) ** 2)) ?? 0;
  return clampScore(100 - Math.sqrt(variance) * 4);
}

function consistencyScore(snapshot: PremiumDashboardSnapshot): number | null {
  const streak = Math.min(snapshot.studyStreakDays, 14);
  const practiceVolume = Math.min(snapshot.practice.gradedTotal, 80);
  if (
    streak === 0 &&
    practiceVolume === 0 &&
    snapshot.overallLessons.completed === 0
  )
    return null;
  return clampScore(
    streak * 4 + practiceVolume * 0.45 + snapshot.overallLessons.pct * 0.2,
  );
}

function activityCoverage(
  snapshot: PremiumDashboardSnapshot,
  catTrend: CatTrendPoint[],
): AdaptiveIntelligenceProfile["signalCoverage"] {
  return [
    {
      surface: "questions",
      label: "Question performance",
      active: snapshot.practice.gradedTotal > 0,
      detail: `${snapshot.practice.gradedTotal} recent scored items are available.`,
    },
    {
      surface: "lesson",
      label: "Lesson progress",
      active: snapshot.overallLessons.total > 0,
      detail: `${snapshot.overallLessons.completed} of ${snapshot.overallLessons.total} visible lessons completed.`,
    },
    {
      surface: "flashcards",
      label: "Flashcards",
      active: (snapshot.flashcards?.cardsReviewedTotal ?? 0) > 0,
      detail: `${snapshot.flashcards?.cardsReviewedTotal ?? 0} cards reviewed.`,
    },
    {
      surface: "cat",
      label: "CAT performance",
      active: catTrend.length > 0,
      detail: `${catTrend.length} CAT trend point${catTrend.length === 1 ? "" : "s"} available.`,
    },
    {
      surface: "clinical_skills",
      label: "Clinical skills",
      active: snapshot.pathways.some(
        (p) => /skill|clinical/i.test(p.label) && p.lessonsCompleted > 0,
      ),
      detail:
        "Clinical-skills evidence is inferred from scoped lesson and competency signals.",
    },
    {
      surface: "pharmacology",
      label: "Pharmacology",
      active: snapshot.readiness.topWeakAreas.some((topic) =>
        /pharm|medication|drug/i.test(topic),
      ),
      detail:
        "Medication and pharmacology topics contribute when they appear in performance signals.",
    },
    {
      surface: "ecg",
      label: "ECG",
      active: snapshot.readiness.topWeakAreas.some((topic) =>
        /ecg|ekg|rhythm|cardiac/i.test(topic),
      ),
      detail:
        "ECG evidence contributes when ECG or rhythm signals appear in practice, lessons, or modules.",
    },
    {
      surface: "simulation",
      label: "Simulation",
      active: snapshot.recentMocks.length > 0,
      detail: `${snapshot.recentMocks.length} recent mock/simulation-style attempt${snapshot.recentMocks.length === 1 ? "" : "s"} available.`,
    },
  ];
}

function surfaceForCompetency(id: string): AdaptiveActivitySurface {
  if (id === "pharmacology") return "pharmacology";
  if (id === "ecg" || id === "cardiac") return "ecg";
  if (id === "clinical_skills" || id === "safety") return "clinical_skills";
  if (id === "prioritization" || id === "delegation") return "simulation";
  return "questions";
}

function hrefForPrescription(
  surface: AdaptiveActivitySurface,
  label: string,
): string {
  const topic = encodeURIComponent(label);
  switch (surface) {
    case "lesson":
      return `/app/lessons?topic=${topic}`;
    case "flashcards":
      return `/app/flashcards?topic=${topic}`;
    case "cat":
      return "/app/cat";
    case "clinical_skills":
      return "/app/clinical-skills";
    case "pharmacology":
      return "/app/pharmacology";
    case "ecg":
      return "/modules/ecg";
    case "simulation":
      return `/app/questions?preset=case_study&topic=${topic}`;
    case "questions":
    default:
      return `/app/questions?studyMode=weak&topic=${topic}`;
  }
}

function buildPrescriptions(
  scores: AdaptiveCompetencyScore[],
  snapshot: PremiumDashboardSnapshot,
): AdaptiveStudyPrescription[] {
  const weak = [...scores]
    .filter(
      (score) =>
        score.score == null ||
        score.score < 75 ||
        score.retentionRisk !== "low",
    )
    .sort((a, b) => {
      const risk = { high: 2, medium: 1, low: 0 };
      return (
        risk[b.retentionRisk] - risk[a.retentionRisk] ||
        (a.score ?? 0) - (b.score ?? 0)
      );
    })
    .slice(0, 8);

  const prescriptions = weak.map((score, index) => {
    const surface = surfaceForCompetency(score.id);
    const urgency =
      score.retentionRisk === "high" || index === 0
        ? "critical"
        : index <= 2
          ? "today"
          : "this_week";
    return {
      id: `${score.id}-${surface}`,
      title: `Target ${score.label}`,
      reason:
        score.retentionRisk === "high"
          ? `${score.label} is high risk for retention or repeated misses.`
          : `${score.label} is limiting the adaptive profile right now.`,
      surface,
      href: hrefForPrescription(surface, score.label),
      urgency,
      expectedImpact:
        "Improves the weakest active signal before the next readiness refresh.",
    } satisfies AdaptiveStudyPrescription;
  });

  if (snapshot.continueLesson && prescriptions.length < 3) {
    prescriptions.push({
      id: "continue-lesson",
      title: `Continue ${snapshot.continueLesson.title}`,
      reason:
        "Lesson completion is part of the adaptive readiness model, not just question accuracy.",
      surface: "lesson",
      href: snapshot.continueLesson.href,
      urgency: "today",
      expectedImpact:
        "Adds learning evidence and improves the knowledge foundation signal.",
    });
  }

  if (snapshot.recommendedQuizTopic && prescriptions.length < 4) {
    prescriptions.push({
      id: "recommended-quiz-topic",
      title: `Drill ${snapshot.recommendedQuizTopic}`,
      reason:
        "This topic is already selected by the existing weak-area recommendation engine.",
      surface: "questions",
      href: `/app/questions?studyMode=weak&topic=${encodeURIComponent(snapshot.recommendedQuizTopic)}`,
      urgency: "today",
      expectedImpact:
        "Turns a current weak-topic signal into targeted practice evidence.",
    });
  }

  return prescriptions;
}

export function buildAdaptiveIntelligenceProfile(args: {
  snapshot: PremiumDashboardSnapshot;
  topicPerf: TopicPerformanceSnapshot | null;
  dimensions: DimensionBreakdown;
  catTrend: CatTrendPoint[];
  generatedAt?: Date;
}): AdaptiveIntelligenceProfile {
  const { snapshot, topicPerf, dimensions, catTrend } = args;
  const practicePct = factorPct(snapshot, "practice_accuracy");
  const lessonPct =
    factorPct(snapshot, "lesson_completion") ?? snapshot.overallLessons.pct;
  const mockPct = factorPct(snapshot, "mock_performance");
  const topicPct = factorPct(snapshot, "topic_errors");

  const competencies = COMPETENCIES.map((competency) => {
    const baseSignals =
      competency.id === "knowledge"
        ? [practicePct, lessonPct, topicPct].filter(
            (v): v is number => v != null,
          )
        : competency.id === "clinical_reasoning"
          ? [mockPct, practicePct].filter((v): v is number => v != null)
          : competency.id === "clinical_skills"
            ? [lessonPct].filter((v): v is number => v != null)
            : [];
    return buildScore({
      ...competency,
      snapshot,
      dimensions,
      topicPerf,
      baseSignals,
    });
  });

  const systems = SYSTEMS.map((system) =>
    buildScore({
      ...system,
      snapshot,
      dimensions,
      topicPerf,
    }),
  );

  const allScores = [...competencies, ...systems];
  const prescriptions = buildPrescriptions(allScores, snapshot);
  const stability = stabilityScore(catTrend, snapshot.readiness.confidence);
  const consistency = consistencyScore(snapshot);
  const momentum =
    trendScore(catTrend) ??
    (snapshot.readiness.trend === "improving"
      ? 68
      : snapshot.readiness.trend === "declining"
        ? 38
        : 55);

  return {
    generatedAt: (args.generatedAt ?? new Date()).toISOString(),
    readiness: {
      examReadinessScore: snapshot.readiness.score,
      passingProbability: readinessProbability(snapshot.readiness.score),
      confidenceStability: stability,
      consistencyScore: consistency,
      momentumScore: momentum,
      explanation: [
        snapshot.readiness.summary,
        snapshot.readiness.trend
          ? `Current readiness trend is ${snapshot.readiness.trend}.`
          : null,
        stability != null
          ? `Confidence stability is ${stability}/100 from CAT/readiness signal spread.`
          : null,
        consistency != null
          ? `Consistency is ${consistency}/100 from study streak, lessons, and recent practice volume.`
          : null,
      ].filter((line): line is string => Boolean(line)),
    },
    competencies,
    systems,
    prescriptions: {
      today: prescriptions
        .filter((item) => item.urgency === "today")
        .slice(0, 3),
      thisWeek: prescriptions
        .filter((item) => item.urgency === "this_week")
        .slice(0, 4),
      criticalWeakAreas: prescriptions
        .filter((item) => item.urgency === "critical")
        .slice(0, 3),
      highRiskAreas: prescriptions
        .filter((item) => item.reason.includes("high risk"))
        .slice(0, 3),
      examReadinessGaps: prescriptions.slice(0, 5),
    },
    signalCoverage: activityCoverage(snapshot, catTrend),
  };
}
