export const EXAM_DAY_SESSION_LENGTHS = [15, 30, 60] as const;

export type ExamDaySessionLength = (typeof EXAM_DAY_SESSION_LENGTHS)[number];

export type ExamDayFilterId =
  | "most-missed"
  | "highest-yield"
  | "recently-incorrect"
  | "must-know"
  | "frequently-tested";

export type ExamDayActivityId = "flashcards" | "questions" | "ecg" | "pharmacology" | "labs";

export type ExamDayReviewResource = {
  id: ExamDayActivityId;
  label: string;
  description: string;
  href: string;
  estimatedMinutes: number;
};

export type ExamDayFilter = {
  id: ExamDayFilterId;
  label: string;
  description: string;
  flashcardMode: "all" | "weak" | "incorrect" | "unstudied";
  practiceFocus: "all" | "weak" | "missed" | "unseen";
};

export type ExamDayHighYieldBlock = {
  id: string;
  title: string;
  pearl: string;
  memoryHook: string;
  nclexTakeaway: string;
  tags: ExamDayActivityId[];
};

export const EXAM_DAY_FILTERS: readonly ExamDayFilter[] = [
  {
    id: "most-missed",
    label: "Most Missed",
    description: "Prioritize concepts the learner has missed repeatedly.",
    flashcardMode: "weak",
    practiceFocus: "weak",
  },
  {
    id: "highest-yield",
    label: "Highest Yield",
    description: "Review common safety, prioritization, and medication patterns.",
    flashcardMode: "all",
    practiceFocus: "all",
  },
  {
    id: "recently-incorrect",
    label: "Recently Incorrect",
    description: "Reinforce errors from recent practice sessions before they fade.",
    flashcardMode: "incorrect",
    practiceFocus: "missed",
  },
  {
    id: "must-know",
    label: "Must Know",
    description: "Focus on non-negotiable exam-day safety and clinical judgment cues.",
    flashcardMode: "all",
    practiceFocus: "all",
  },
  {
    id: "frequently-tested",
    label: "Frequently Tested",
    description: "Target recurring NCLEX patterns across common body systems.",
    flashcardMode: "all",
    practiceFocus: "all",
  },
];

export const EXAM_DAY_HIGH_YIELD_BLOCKS: readonly ExamDayHighYieldBlock[] = [
  {
    id: "abc-first",
    title: "Airway and Breathing Instability",
    pearl: "New work of breathing, falling oxygen saturation, stridor, or inability to protect the airway should move to the front of the priority list.",
    memoryHook: "Air first, then everything else.",
    nclexTakeaway: "On exam questions with two correct-sounding answers, choose the one that stabilizes oxygenation or ventilation before slower assessment tasks.",
    tags: ["questions", "flashcards", "labs"],
  },
  {
    id: "potassium-risk",
    title: "Potassium and ECG Risk",
    pearl: "Abnormal potassium becomes urgent when paired with weakness, renal failure, cardiac symptoms, or ECG changes.",
    memoryHook: "K changes can kill rhythm.",
    nclexTakeaway: "Electrolyte questions often test whether you connect the lab value to cardiac monitoring and escalation.",
    tags: ["labs", "ecg", "pharmacology"],
  },
  {
    id: "medication-safety",
    title: "High-Alert Medication Safety",
    pearl: "Insulin, anticoagulants, opioids, sedatives, and concentrated electrolytes require a stronger safety check than routine medications.",
    memoryHook: "High-alert means double-check.",
    nclexTakeaway: "Medication questions usually reward verifying safety before administering, especially with labs, vitals, or unclear orders.",
    tags: ["pharmacology", "questions", "flashcards"],
  },
  {
    id: "delegation-scope",
    title: "Delegation and Scope",
    pearl: "Delegate stable, predictable tasks with clear instructions; keep assessment, teaching, evaluation, and unstable changes with the nurse.",
    memoryHook: "Stable tasks can travel.",
    nclexTakeaway: "Delegation distractors often look efficient but shift nursing judgment to the wrong team member.",
    tags: ["questions", "flashcards"],
  },
  {
    id: "deterioration-trends",
    title: "Trend Recognition",
    pearl: "A single abnormal value matters less than a worsening pattern across vitals, mentation, urine output, pain, breathing, or labs.",
    memoryHook: "Trends tell the story.",
    nclexTakeaway: "Exam stems with repeated data usually ask you to identify deterioration before the patient fully decompensates.",
    tags: ["labs", "questions", "ecg"],
  },
];

export function getExamDayFilter(id: string | null | undefined): ExamDayFilter {
  return EXAM_DAY_FILTERS.find((filter) => filter.id === id) ?? EXAM_DAY_FILTERS[0]!;
}

export function normalizeExamDaySessionLength(raw: string | number | null | undefined): ExamDaySessionLength {
  const parsed = typeof raw === "number" ? raw : Number(raw);
  if (EXAM_DAY_SESSION_LENGTHS.includes(parsed as ExamDaySessionLength)) return parsed as ExamDaySessionLength;
  return 30;
}

export function examDayCardCountForLength(length: ExamDaySessionLength): number {
  if (length === 15) return 25;
  if (length === 60) return 100;
  return 50;
}

export function examDayQuestionCountForLength(length: ExamDaySessionLength): number {
  if (length === 15) return 25;
  if (length === 60) return 75;
  return 50;
}

export function buildExamDayReviewResources(args: {
  pathwayId: string;
  filterId: ExamDayFilterId;
  sessionLength: ExamDaySessionLength;
}): ExamDayReviewResource[] {
  const pathwayId = args.pathwayId.trim() || "ca-rn-nclex-rn";
  const filter = getExamDayFilter(args.filterId);
  const cardLimit = examDayCardCountForLength(args.sessionLength);
  const questionCount = examDayQuestionCountForLength(args.sessionLength);
  const flashcards = new URLSearchParams({
    pathwayId,
    mode: filter.flashcardMode,
    cardLimit: String(cardLimit),
    examDay: "1",
  });
  const practice = new URLSearchParams({
    pathwayId,
    focus: filter.practiceFocus,
    count: String(questionCount),
    startMode: "practice_exam",
    examDay: "1",
  });
  const scoped = new URLSearchParams({ pathwayId, examDay: "1" });

  return [
    {
      id: "flashcards",
      label: "Flashcards",
      description: "Rapid recall for pearls, memory hooks, and must-know cues.",
      href: `/app/flashcards?${flashcards.toString()}`,
      estimatedMinutes: Math.max(5, Math.round(args.sessionLength * 0.35)),
    },
    {
      id: "questions",
      label: "Questions",
      description: "Focused NCLEX-style practice using the selected final-review filter.",
      href: `/app/practice-tests?${practice.toString()}`,
      estimatedMinutes: Math.max(6, Math.round(args.sessionLength * 0.35)),
    },
    {
      id: "ecg",
      label: "ECG",
      description: "Recognition drills for rhythm, escalation, and telemetry patterns.",
      href: `/app/ecg-video-quiz?${scoped.toString()}`,
      estimatedMinutes: Math.max(4, Math.round(args.sessionLength * 0.1)),
    },
    {
      id: "pharmacology",
      label: "Pharmacology",
      description: "Medication safety checks, monitoring cues, and high-alert patterns.",
      href: `/app/pharmacology?${scoped.toString()}`,
      estimatedMinutes: Math.max(5, Math.round(args.sessionLength * 0.12)),
    },
    {
      id: "labs",
      label: "Labs",
      description: "Final review of critical values, trends, and clinical implications.",
      href: `/app/labs?${scoped.toString()}`,
      estimatedMinutes: Math.max(4, Math.round(args.sessionLength * 0.08)),
    },
  ];
}
