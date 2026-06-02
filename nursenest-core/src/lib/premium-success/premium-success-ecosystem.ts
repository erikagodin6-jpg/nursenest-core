export type PremiumExamProgram =
  | "NCLEX-RN"
  | "NCLEX-PN"
  | "REx-PN"
  | "CNPLE"
  | "Allied Health"
  | "New Grad Programs";

export type ReadinessDimensionKey =
  | "knowledge"
  | "clinicalJudgment"
  | "prioritization"
  | "delegation"
  | "pharmacology"
  | "clinicalSkills"
  | "trend"
  | "consistency";

export type ReadinessStatus =
  | "Not Ready"
  | "Developing"
  | "Near Ready"
  | "Exam Ready";

export type StudyPlanType =
  | "daily"
  | "weekly"
  | "exam_countdown"
  | "remediation";

export type LearningActivityKind =
  | "question"
  | "lesson"
  | "flashcard"
  | "clinical_skill"
  | "pharmacology"
  | "ecg"
  | "cat"
  | "daily";

export interface ReadinessSignals {
  program: PremiumExamProgram;
  catPerformancePct?: number | null;
  practiceAccuracyPct?: number | null;
  flashcardMasteryPct?: number | null;
  lessonCompletionPct?: number | null;
  clinicalSkillsPct?: number | null;
  pharmacologyPct?: number | null;
  ecgPct?: number | null;
  prioritizationPct?: number | null;
  delegationPct?: number | null;
  clinicalJudgmentPct?: number | null;
  trendDeltaPct?: number | null;
  consistencyPct?: number | null;
  studyDaysLast14?: number | null;
  sampleSize?: number | null;
}

export interface ReadinessDimension {
  key: ReadinessDimensionKey;
  label: string;
  score: number;
  weight: number;
  status: ReadinessStatus;
  evidence: string[];
}

export interface PremiumReadinessSnapshot {
  program: PremiumExamProgram;
  readinessScore: number;
  status: ReadinessStatus;
  dimensions: Record<ReadinessDimensionKey, ReadinessDimension>;
  confidence: "low" | "moderate" | "high";
  generatedAt: string;
}

export interface StudyPlanItem {
  kind: LearningActivityKind;
  title: string;
  target: string;
  minutes: number;
  priority: "critical" | "high" | "medium";
  reason: string;
  href: string;
}

export interface StudyPlan {
  type: StudyPlanType;
  program: PremiumExamProgram;
  title: string;
  readinessMessage: string;
  items: StudyPlanItem[];
  totalMinutes: number;
  generatedAt: string;
}

export interface ReportCardSection {
  key: ReadinessDimensionKey | "safety" | "examProjection";
  label: string;
  score: number;
  trend: "improving" | "stable" | "declining" | "insufficient_data";
  insights: string[];
}

export interface PremiumReportCard {
  type: "weekly" | "monthly" | "exam_readiness";
  program: PremiumExamProgram;
  overallScore: number;
  overallStatus: ReadinessStatus;
  sections: ReportCardSection[];
  benchmarkPercentile: number | null;
  recommendations: string[];
  generatedAt: string;
}

export interface PeerBenchmarkInput {
  cohortSize: number;
  learnerScore: number;
  cohortScoresSortedAsc: number[];
  cohortLabel: string;
  threshold?: number;
}

export interface PeerBenchmark {
  active: boolean;
  cohortSize: number;
  threshold: number;
  percentile: number | null;
  message: string;
}

export interface QuestionQualityInput {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  highPerformerCorrectPct?: number | null;
  lowPerformerCorrectPct?: number | null;
  optionSelections: Record<string, number>;
  correctOption: string;
  averageTimeSeconds?: number | null;
}

export interface QuestionQualityReview {
  questionId: string;
  difficultyPct: number | null;
  discrimination: number | null;
  flags: Array<{
    code:
      | "too_easy"
      | "too_difficult"
      | "poor_discrimination"
      | "negative_discrimination"
      | "non_functional_distractor"
      | "misleading_distractor"
      | "answer_key_error"
      | "slow_item";
    severity: "low" | "medium" | "high" | "critical";
    detail: string;
  }>;
  reviewPriority: number;
}

export interface LearnerActivityEventSummary {
  type:
    | "login"
    | "study_session"
    | "question_answered"
    | "lesson_completed"
    | "flashcard_completed"
    | "clinical_skill"
    | "pharmacology"
    | "ecg"
    | "subscription"
    | "access";
  at: string;
  minutes?: number;
  detail?: string;
}

export interface UsageEvidenceReport {
  generatedAt: string;
  userId: string;
  totals: {
    logins: number;
    studySessions: number;
    questionsAnswered: number;
    lessonsCompleted: number;
    flashcardsCompleted: number;
    clinicalSkillsEvents: number;
    pharmacologyEvents: number;
    ecgEvents: number;
    estimatedMinutes: number;
  };
  activityTimeline: LearnerActivityEventSummary[];
  exportSummary: string;
}

const DIMENSION_LABELS: Record<ReadinessDimensionKey, string> = {
  knowledge: "Knowledge",
  clinicalJudgment: "Clinical Judgment",
  prioritization: "Prioritization",
  delegation: "Delegation",
  pharmacology: "Pharmacology",
  clinicalSkills: "Clinical Skills",
  trend: "Trend",
  consistency: "Consistency",
};

const PROGRAM_WEIGHTS: Record<
  PremiumExamProgram,
  Record<ReadinessDimensionKey, number>
> = {
  "NCLEX-RN": {
    knowledge: 0.16,
    clinicalJudgment: 0.18,
    prioritization: 0.14,
    delegation: 0.12,
    pharmacology: 0.13,
    clinicalSkills: 0.1,
    trend: 0.08,
    consistency: 0.09,
  },
  "NCLEX-PN": {
    knowledge: 0.18,
    clinicalJudgment: 0.16,
    prioritization: 0.15,
    delegation: 0.09,
    pharmacology: 0.14,
    clinicalSkills: 0.11,
    trend: 0.08,
    consistency: 0.09,
  },
  "REx-PN": {
    knowledge: 0.17,
    clinicalJudgment: 0.17,
    prioritization: 0.16,
    delegation: 0.1,
    pharmacology: 0.13,
    clinicalSkills: 0.1,
    trend: 0.08,
    consistency: 0.09,
  },
  CNPLE: {
    knowledge: 0.16,
    clinicalJudgment: 0.17,
    prioritization: 0.16,
    delegation: 0.12,
    pharmacology: 0.12,
    clinicalSkills: 0.11,
    trend: 0.08,
    consistency: 0.08,
  },
  "Allied Health": {
    knowledge: 0.2,
    clinicalJudgment: 0.13,
    prioritization: 0.1,
    delegation: 0.05,
    pharmacology: 0.12,
    clinicalSkills: 0.18,
    trend: 0.1,
    consistency: 0.12,
  },
  "New Grad Programs": {
    knowledge: 0.11,
    clinicalJudgment: 0.18,
    prioritization: 0.17,
    delegation: 0.15,
    pharmacology: 0.1,
    clinicalSkills: 0.15,
    trend: 0.07,
    consistency: 0.07,
  },
};

const DEFAULT_BENCHMARK_THRESHOLD = 100;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function avg(values: Array<number | null | undefined>, fallback = 50): number {
  const clean = values.filter(
    (v): v is number => typeof v === "number" && Number.isFinite(v),
  );
  if (clean.length === 0) return fallback;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

export function readinessStatus(score: number): ReadinessStatus {
  if (score < 55) return "Not Ready";
  if (score < 70) return "Developing";
  if (score < 82) return "Near Ready";
  return "Exam Ready";
}

function evidence(label: string, value: number | null | undefined): string[] {
  return typeof value === "number" && Number.isFinite(value)
    ? [`${label}: ${clampScore(value)}%`]
    : [];
}

function buildDimension(
  key: ReadinessDimensionKey,
  score: number,
  weight: number,
  evidenceRows: string[],
): ReadinessDimension {
  const rounded = clampScore(score);
  return {
    key,
    label: DIMENSION_LABELS[key],
    score: rounded,
    weight,
    status: readinessStatus(rounded),
    evidence:
      evidenceRows.length > 0
        ? evidenceRows
        : ["Insufficient direct signal; conservative neutral score used."],
  };
}

export function computePremiumReadinessSnapshot(
  signals: ReadinessSignals,
  now: Date = new Date(),
): PremiumReadinessSnapshot {
  const weights = PROGRAM_WEIGHTS[signals.program];
  const consistencyFromDays =
    typeof signals.studyDaysLast14 === "number"
      ? Math.min(100, Math.max(35, (signals.studyDaysLast14 / 14) * 100))
      : null;
  const trendScore =
    typeof signals.trendDeltaPct === "number"
      ? clampScore(55 + Math.max(-10, Math.min(10, signals.trendDeltaPct)) * 3)
      : 50;

  const rawDimensions: Record<
    ReadinessDimensionKey,
    { score: number; evidence: string[] }
  > = {
    knowledge: {
      score: avg([
        signals.practiceAccuracyPct,
        signals.lessonCompletionPct,
        signals.flashcardMasteryPct,
        signals.catPerformancePct,
      ]),
      evidence: [
        ...evidence("Practice accuracy", signals.practiceAccuracyPct),
        ...evidence("Lesson completion", signals.lessonCompletionPct),
        ...evidence("Flashcard mastery", signals.flashcardMasteryPct),
        ...evidence("CAT performance", signals.catPerformancePct),
      ],
    },
    clinicalJudgment: {
      score: avg([
        signals.clinicalJudgmentPct,
        signals.catPerformancePct,
        signals.practiceAccuracyPct,
        signals.clinicalSkillsPct,
      ]),
      evidence: [
        ...evidence("Clinical judgment items", signals.clinicalJudgmentPct),
        ...evidence("CAT performance", signals.catPerformancePct),
        ...evidence("Clinical skills", signals.clinicalSkillsPct),
      ],
    },
    prioritization: {
      score: avg([
        signals.prioritizationPct,
        signals.clinicalJudgmentPct,
        signals.catPerformancePct,
      ]),
      evidence: [
        ...evidence("Prioritization items", signals.prioritizationPct),
        ...evidence("Clinical judgment items", signals.clinicalJudgmentPct),
      ],
    },
    delegation: {
      score: avg([
        signals.delegationPct,
        signals.clinicalSkillsPct,
        signals.practiceAccuracyPct,
      ]),
      evidence: [
        ...evidence("Delegation items", signals.delegationPct),
        ...evidence("Clinical skills", signals.clinicalSkillsPct),
      ],
    },
    pharmacology: {
      score: avg([
        signals.pharmacologyPct,
        signals.flashcardMasteryPct,
        signals.practiceAccuracyPct,
      ]),
      evidence: [
        ...evidence("Pharmacology", signals.pharmacologyPct),
        ...evidence("Flashcard mastery", signals.flashcardMasteryPct),
      ],
    },
    clinicalSkills: {
      score: avg([
        signals.clinicalSkillsPct,
        signals.lessonCompletionPct,
        signals.practiceAccuracyPct,
      ]),
      evidence: [
        ...evidence("Clinical skills", signals.clinicalSkillsPct),
        ...evidence("Lesson completion", signals.lessonCompletionPct),
      ],
    },
    trend: {
      score: trendScore,
      evidence:
        typeof signals.trendDeltaPct === "number"
          ? [
              `Readiness trend: ${signals.trendDeltaPct >= 0 ? "+" : ""}${signals.trendDeltaPct}%`,
            ]
          : ["No longitudinal trend yet."],
    },
    consistency: {
      score: avg([signals.consistencyPct, consistencyFromDays], 50),
      evidence: [
        ...evidence("Consistency", signals.consistencyPct),
        ...(typeof signals.studyDaysLast14 === "number"
          ? [`Study days in last 14: ${signals.studyDaysLast14}`]
          : []),
      ],
    },
  };

  const dimensions = Object.fromEntries(
    (Object.keys(rawDimensions) as ReadinessDimensionKey[]).map((key) => [
      key,
      buildDimension(
        key,
        rawDimensions[key].score,
        weights[key],
        rawDimensions[key].evidence,
      ),
    ]),
  ) as Record<ReadinessDimensionKey, ReadinessDimension>;

  const readinessScore = clampScore(
    (Object.keys(dimensions) as ReadinessDimensionKey[]).reduce(
      (sum, key) => sum + dimensions[key].score * dimensions[key].weight,
      0,
    ),
  );

  const sampleSize = signals.sampleSize ?? 0;
  const directSignalCount = [
    signals.catPerformancePct,
    signals.practiceAccuracyPct,
    signals.flashcardMasteryPct,
    signals.lessonCompletionPct,
    signals.clinicalSkillsPct,
    signals.pharmacologyPct,
    signals.ecgPct,
  ].filter((v) => typeof v === "number").length;

  const confidence =
    sampleSize >= 150 && directSignalCount >= 5
      ? "high"
      : sampleSize >= 40 && directSignalCount >= 3
        ? "moderate"
        : "low";

  return {
    program: signals.program,
    readinessScore,
    status: readinessStatus(readinessScore),
    dimensions,
    confidence,
    generatedAt: now.toISOString(),
  };
}

function weakestDimensions(
  snapshot: PremiumReadinessSnapshot,
  count = 3,
): ReadinessDimension[] {
  return (Object.values(snapshot.dimensions) as ReadinessDimension[])
    .sort((a, b) => a.score - b.score || b.weight - a.weight)
    .slice(0, count);
}

export function buildAdaptiveStudyPlan(
  snapshot: PremiumReadinessSnapshot,
  type: StudyPlanType,
  now: Date = new Date(),
): StudyPlan {
  const weak = weakestDimensions(snapshot, type === "daily" ? 2 : 4);
  const items: StudyPlanItem[] = weak.flatMap((dimension): StudyPlanItem[] => {
    const base = dimension.key;
    const topic = dimension.label;
    const critical = dimension.score < 55;
    const priority = critical
      ? "critical"
      : dimension.score < 70
        ? "high"
        : "medium";
    const common = {
      priority,
      target: topic,
      reason: `${topic} is currently ${dimension.status.toLowerCase()} at ${dimension.score}/100.`,
    } as const;

    if (base === "pharmacology") {
      return [
        {
          ...common,
          kind: "pharmacology",
          title: "Pharmacology application drill",
          minutes: 18,
          href: "/app/pharmacology",
        },
        {
          ...common,
          kind: "flashcard",
          title: "Medication recall set",
          minutes: 10,
          href: "/app/flashcards",
        },
      ];
    }
    if (base === "clinicalSkills" || base === "delegation") {
      return [
        {
          ...common,
          kind: "clinical_skill",
          title: `${topic} skill loop`,
          minutes: 20,
          href: "/app/clinical-skills",
        },
      ];
    }
    return [
      {
        ...common,
        kind: "question",
        title: `${topic} question drill`,
        minutes: 15,
        href: "/app/practice-tests",
      },
      {
        ...common,
        kind: "lesson",
        title: `${topic} lesson refresh`,
        minutes: 12,
        href: "/app/lessons",
      },
    ];
  });

  const cappedItems = items.slice(0, type === "daily" ? 4 : 8);
  const totalMinutes = cappedItems.reduce((sum, item) => sum + item.minutes, 0);

  return {
    type,
    program: snapshot.program,
    title:
      type === "daily"
        ? "Today"
        : type === "weekly"
          ? "This Week"
          : type === "exam_countdown"
            ? "Exam Countdown"
            : "Remediation Plan",
    readinessMessage: `${snapshot.program}: ${snapshot.status} (${snapshot.readinessScore}/100).`,
    items: cappedItems,
    totalMinutes,
    generatedAt: now.toISOString(),
  };
}

export function buildPremiumReportCard(
  snapshot: PremiumReadinessSnapshot,
  type: PremiumReportCard["type"],
  benchmark: PeerBenchmark | null,
  now: Date = new Date(),
): PremiumReportCard {
  const sections: ReportCardSection[] = (
    Object.values(snapshot.dimensions) as ReadinessDimension[]
  ).map((dimension) => ({
    key: dimension.key,
    label: dimension.label,
    score: dimension.score,
    trend:
      dimension.key === "trend"
        ? dimension.score >= 62
          ? "improving"
          : dimension.score < 45
            ? "declining"
            : "stable"
        : "stable",
    insights: [
      `${dimension.label} is ${dimension.status.toLowerCase()} at ${dimension.score}/100.`,
      dimension.evidence[0] ?? "No direct evidence yet.",
    ],
  }));

  const weak = weakestDimensions(snapshot, 3);
  return {
    type,
    program: snapshot.program,
    overallScore: snapshot.readinessScore,
    overallStatus: snapshot.status,
    sections: [
      ...sections,
      {
        key: "examProjection",
        label: "Exam Projection",
        score: snapshot.readinessScore,
        trend:
          snapshot.dimensions.trend.score >= 62
            ? "improving"
            : snapshot.dimensions.trend.score < 45
              ? "declining"
              : "stable",
        insights: [
          `Projection is ${snapshot.status.toLowerCase()} with ${snapshot.confidence} confidence.`,
        ],
      },
    ],
    benchmarkPercentile: benchmark?.percentile ?? null,
    recommendations: weak.map(
      (dimension) =>
        `Focus next on ${dimension.label.toLowerCase()} to lift readiness.`,
    ),
    generatedAt: now.toISOString(),
  };
}

export function buildPeerBenchmark(input: PeerBenchmarkInput): PeerBenchmark {
  const threshold = input.threshold ?? DEFAULT_BENCHMARK_THRESHOLD;
  if (
    input.cohortSize < threshold ||
    input.cohortScoresSortedAsc.length < threshold
  ) {
    return {
      active: false,
      cohortSize: input.cohortSize,
      threshold,
      percentile: null,
      message: `Benchmarking will appear once ${threshold} comparable learners are available.`,
    };
  }

  const atOrBelow = input.cohortScoresSortedAsc.filter(
    (score) => score <= input.learnerScore,
  ).length;
  const percentile = Math.max(
    1,
    Math.min(
      99,
      Math.round((atOrBelow / input.cohortScoresSortedAsc.length) * 100),
    ),
  );
  return {
    active: true,
    cohortSize: input.cohortSize,
    threshold,
    percentile,
    message: `You performed better than ${percentile}% of ${input.cohortLabel}.`,
  };
}

export function analyzeQuestionQuality(
  input: QuestionQualityInput,
): QuestionQualityReview {
  const difficultyPct =
    input.totalAttempts > 0
      ? clampScore((input.correctAttempts / input.totalAttempts) * 100)
      : null;
  const discrimination =
    typeof input.highPerformerCorrectPct === "number" &&
    typeof input.lowPerformerCorrectPct === "number"
      ? Math.round(
          (input.highPerformerCorrectPct - input.lowPerformerCorrectPct) * 100,
        ) / 100
      : null;
  const flags: QuestionQualityReview["flags"] = [];

  if (
    difficultyPct != null &&
    input.totalAttempts >= 100 &&
    difficultyPct > 90
  ) {
    flags.push({
      code: "too_easy",
      severity: "low",
      detail: `Correct rate is ${difficultyPct}%.`,
    });
  }
  if (
    difficultyPct != null &&
    input.totalAttempts >= 100 &&
    difficultyPct < 20
  ) {
    flags.push({
      code: "too_difficult",
      severity: "medium",
      detail: `Correct rate is ${difficultyPct}%.`,
    });
  }
  if (
    discrimination != null &&
    input.totalAttempts >= 100 &&
    discrimination < 0.1 &&
    discrimination >= 0
  ) {
    flags.push({
      code: "poor_discrimination",
      severity: "high",
      detail: `Discrimination is ${discrimination}.`,
    });
  }
  if (
    discrimination != null &&
    input.totalAttempts >= 50 &&
    discrimination < 0
  ) {
    flags.push({
      code: "negative_discrimination",
      severity: "critical",
      detail: `Discrimination is ${discrimination}.`,
    });
  }

  const totalSelections = Object.values(input.optionSelections).reduce(
    (sum, value) => sum + value,
    0,
  );
  if (totalSelections > 0) {
    const correctSelections = input.optionSelections[input.correctOption] ?? 0;
    if (input.totalAttempts >= 20 && correctSelections === 0) {
      flags.push({
        code: "answer_key_error",
        severity: "critical",
        detail: "Correct answer was never selected.",
      });
    }
    for (const [option, count] of Object.entries(input.optionSelections)) {
      if (option === input.correctOption) continue;
      const pct = count / totalSelections;
      if (input.totalAttempts >= 100 && pct < 0.05) {
        flags.push({
          code: "non_functional_distractor",
          severity: "low",
          detail: `${option} selected by ${Math.round(pct * 100)}%.`,
        });
      }
      if (pct > 0.6) {
        flags.push({
          code: "misleading_distractor",
          severity: "critical",
          detail: `${option} selected by ${Math.round(pct * 100)}%.`,
        });
      }
    }
  }

  if (
    typeof input.averageTimeSeconds === "number" &&
    input.averageTimeSeconds > 150
  ) {
    flags.push({
      code: "slow_item",
      severity: "medium",
      detail: `Average time is ${Math.round(input.averageTimeSeconds)} seconds.`,
    });
  }

  const reviewPriority = flags.reduce((sum, flag) => {
    if (flag.severity === "critical") return sum + 40;
    if (flag.severity === "high") return sum + 25;
    if (flag.severity === "medium") return sum + 15;
    return sum + 7;
  }, 0);

  return {
    questionId: input.questionId,
    difficultyPct,
    discrimination,
    flags,
    reviewPriority,
  };
}

export function buildUsageEvidenceReport(
  userId: string,
  events: LearnerActivityEventSummary[],
  now: Date = new Date(),
): UsageEvidenceReport {
  const sorted = [...events].sort((a, b) => a.at.localeCompare(b.at));
  const count = (type: LearnerActivityEventSummary["type"]) =>
    sorted.filter((event) => event.type === type).length;
  const totals = {
    logins: count("login"),
    studySessions: count("study_session"),
    questionsAnswered: count("question_answered"),
    lessonsCompleted: count("lesson_completed"),
    flashcardsCompleted: count("flashcard_completed"),
    clinicalSkillsEvents: count("clinical_skill"),
    pharmacologyEvents: count("pharmacology"),
    ecgEvents: count("ecg"),
    estimatedMinutes: sorted.reduce(
      (sum, event) => sum + (event.minutes ?? 0),
      0,
    ),
  };

  return {
    generatedAt: now.toISOString(),
    userId,
    totals,
    activityTimeline: sorted,
    exportSummary: `${totals.logins} logins, ${totals.studySessions} study sessions, ${totals.questionsAnswered} questions, ${totals.lessonsCompleted} lessons, ${totals.flashcardsCompleted} flashcard completions, ${totals.estimatedMinutes} estimated minutes.`,
  };
}

export const PREMIUM_ECOSYSTEM_CAPABILITY_MAP = {
  clinicalSkills: [
    "Assessment",
    "Prioritization",
    "Delegation",
    "Documentation",
    "SBAR",
    "Patient teaching",
    "Medication administration",
    "Communication",
    "Safety",
    "Critical thinking",
  ],
  pharmacology: [
    "Medication classes",
    "Flashcards",
    "Practice questions",
    "Case studies",
    "Clinical application",
    "Natural supplements",
  ],
  ecg: [
    "Telemetry",
    "Rhythm progression",
    "Pacemakers",
    "Hemodynamics",
    "STEMI localization",
    "Clinical response",
    "Medication implications",
  ],
  daily: [
    "Daily Question",
    "Daily Drug",
    "Daily ECG",
    "Daily Clinical Pearl",
    "Daily Skill",
  ],
} as const;
