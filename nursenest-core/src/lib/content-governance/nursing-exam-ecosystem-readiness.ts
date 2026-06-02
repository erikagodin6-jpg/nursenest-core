import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type NursingExamPriority = "critical" | "high" | "strategic";

export type NursingExamTarget = {
  id: string;
  label: string;
  priority: NursingExamPriority;
  pathwayId?: string;
  contentExamKeys: string[];
  minimums: {
    publishedQuestions: number;
    publishedLessons: number;
    publishedFlashcards: number;
    ngnItems: number;
    caseStudies: number;
  };
  requiredQuestionTypes: string[];
  notes: string[];
};

export type NursingExamInventory = {
  targetId: string;
  pathwayId?: string;
  pathwayStatus?: ExamPathwayDefinition["status"];
  publishedQuestions: number;
  activeQuestions: number;
  visibleQuestions: number;
  publishedLessons: number;
  publishedFlashcards: number;
  ngnItems: number;
  caseStudies: number;
  questionTypeCounts: Record<string, number>;
};

export type NursingExamGap = {
  area:
    | "registry"
    | "questions"
    | "lessons"
    | "flashcards"
    | "ngn"
    | "case_studies"
    | "question_type";
  severity: "blocker" | "major" | "minor";
  current: number | string;
  required: number | string;
  message: string;
};

export type NursingExamReadiness = {
  target: NursingExamTarget;
  pathway?: ExamPathwayDefinition;
  inventory: NursingExamInventory;
  score: number;
  publicationReady: boolean;
  monetizationReady: boolean;
  gaps: NursingExamGap[];
};

export const NURSING_EXAM_ECOSYSTEM_TARGETS: readonly NursingExamTarget[] = [
  {
    id: "ca-np-cnple",
    label: "Canadian NP / CNPLE",
    priority: "critical",
    pathwayId: "ca-np-cnple",
    contentExamKeys: ["NP", "CNPLE", "CAN-NP"],
    minimums: { publishedQuestions: 2500, publishedLessons: 120, publishedFlashcards: 5000, ngnItems: 300, caseStudies: 100 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"],
    notes: ["Highest-priority Canadian NP inventory target from the ecosystem expansion directive."],
  },
  {
    id: "ca-np-adult",
    label: "Canadian NP / Adult",
    priority: "high",
    contentExamKeys: ["NP", "CNPLE", "CAN-NP", "ADULT-NP"],
    minimums: { publishedQuestions: 2500, publishedLessons: 100, publishedFlashcards: 5000, ngnItems: 250, caseStudies: 80 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"],
    notes: ["Specialty target is required by strategy but does not yet have a canonical pathway row."],
  },
  {
    id: "ca-np-primary-care",
    label: "Canadian NP / Primary Care",
    priority: "high",
    contentExamKeys: ["NP", "CNPLE", "CAN-NP", "PRIMARY-CARE-NP"],
    minimums: { publishedQuestions: 2500, publishedLessons: 100, publishedFlashcards: 5000, ngnItems: 250, caseStudies: 80 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"],
    notes: ["Specialty target is required by strategy but does not yet have a canonical pathway row."],
  },
  ...[
    ["us-np-fnp", "US NP / FNP", ["NP", "FNP", "NP-FNP"]],
    ["us-np-agpcnp", "US NP / AGPCNP", ["NP", "AGPCNP", "AGNP"]],
    ["us-np-pmhnp", "US NP / PMHNP", ["NP", "PMHNP", "PSYCH-NP"]],
    ["us-np-pnp-pc", "US NP / PNP-PC", ["NP", "PNP-PC", "PNP_PC", "Pediatric-PC-NP"]],
    ["us-np-whnp", "US NP / WHNP", ["NP", "WHNP", "NP-WHNP", "Womens-Health-NP"]],
  ].map(([pathwayId, label, contentExamKeys]) => ({
    id: pathwayId as string,
    label: label as string,
    priority: "high" as const,
    pathwayId: pathwayId as string,
    contentExamKeys: contentExamKeys as string[],
    minimums: { publishedQuestions: 2500, publishedLessons: 100, publishedFlashcards: 5000, ngnItems: 250, caseStudies: 80 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"],
    notes: ["US NP certification inventory target from the ecosystem expansion directive."],
  })),
  {
    id: "us-np-enp",
    label: "US NP / ENP",
    priority: "strategic",
    contentExamKeys: ["NP", "ENP"],
    minimums: { publishedQuestions: 2500, publishedLessons: 90, publishedFlashcards: 5000, ngnItems: 250, caseStudies: 100 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"],
    notes: ["ENP exists in NP certification ecosystem docs/code but does not yet have a public exam-pathway row."],
  },
  {
    id: "ca-rn-nclex-rn",
    label: "Canada RN / NCLEX-RN",
    priority: "critical",
    pathwayId: "ca-rn-nclex-rn",
    contentExamKeys: ["NCLEX-RN", "NCLEX_RN"],
    minimums: { publishedQuestions: 10000, publishedLessons: 160, publishedFlashcards: 5000, ngnItems: 800, caseStudies: 250 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"],
    notes: ["RN pathways require the deepest inventory because they anchor lessons, CAT, readiness, and question-bank monetization."],
  },
  {
    id: "us-rn-nclex-rn",
    label: "US RN / NCLEX-RN",
    priority: "critical",
    pathwayId: "us-rn-nclex-rn",
    contentExamKeys: ["NCLEX-RN", "NCLEX_RN"],
    minimums: { publishedQuestions: 10000, publishedLessons: 160, publishedFlashcards: 5000, ngnItems: 800, caseStudies: 250 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"],
    notes: ["RN pathways require the deepest inventory because they anchor lessons, CAT, readiness, and question-bank monetization."],
  },
  {
    id: "ca-rpn-rex-pn",
    label: "Canada RPN / REx-PN",
    priority: "critical",
    pathwayId: "ca-rpn-rex-pn",
    contentExamKeys: ["NCLEX-PN", "REx-PN", "REX-PN"],
    minimums: { publishedQuestions: 5000, publishedLessons: 130, publishedFlashcards: 5000, ngnItems: 500, caseStudies: 160 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"],
    notes: ["PN/RPN pathways need enough depth for standalone subscriptions, practice exams, remediation, and CAT-like study loops."],
  },
  {
    id: "us-lpn-nclex-pn",
    label: "US PN / NCLEX-PN",
    priority: "critical",
    pathwayId: "us-lpn-nclex-pn",
    contentExamKeys: ["NCLEX-PN", "NCLEX_PN"],
    minimums: { publishedQuestions: 5000, publishedLessons: 130, publishedFlashcards: 5000, ngnItems: 500, caseStudies: 160 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"],
    notes: ["PN/RPN pathways need enough depth for standalone subscriptions, practice exams, remediation, and CAT-like study loops."],
  },
  ...[
    ["uk-rn-nmc-test-of-competence", "International RN / UK NMC CBT + OSCE"],
    ["au-rn-iqnm-pathway", "International RN / Australia NMBA-AHPRA IQNM"],
    ["ph-rn-prc-pnle", "International RN / Philippines PRC PNLE"],
    ["in-rn-state-nursing-council-registration", "International RN / India state council"],
    ["ng-rn-nmcn-licensure", "International RN / Nigeria NMCN"],
    ["sa-rn-scfhs-licensure", "International RN / Saudi SCFHS"],
  ].map(([pathwayId, label]) => ({
    id: pathwayId as string,
    label: label as string,
    priority: "strategic" as const,
    pathwayId: pathwayId as string,
    contentExamKeys: [],
    minimums: { publishedQuestions: 2500, publishedLessons: 80, publishedFlashcards: 2500, ngnItems: 150, caseStudies: 80 },
    requiredQuestionTypes: ["MCQ", "SATA", "NGN_CASE"],
    notes: ["International RN foundation target; hidden/waitlist pathways must not be marketed as publication-ready until inventory passes."],
  })),
] as const;

export function getNursingExamPathway(pathwayId?: string): ExamPathwayDefinition | undefined {
  if (!pathwayId) return undefined;
  return EXAM_PATHWAYS.find((pathway) => pathway.id === pathwayId);
}

function percent(current: number, required: number): number {
  if (required <= 0) return 100;
  return Math.min(100, Math.round((current / required) * 100));
}

function gapForCount(
  area: NursingExamGap["area"],
  label: string,
  current: number,
  required: number,
  blocker = true,
): NursingExamGap | null {
  if (current >= required) return null;
  return {
    area,
    severity: blocker ? "blocker" : "major",
    current,
    required,
    message: `${label} is ${current.toLocaleString()} / ${required.toLocaleString()}.`,
  };
}

export function evaluateNursingExamTargetReadiness(
  target: NursingExamTarget,
  inventory: NursingExamInventory,
): NursingExamReadiness {
  const pathway = getNursingExamPathway(target.pathwayId);
  const gaps: NursingExamGap[] = [];
  if (target.pathwayId && !pathway) {
    gaps.push({
      area: "registry",
      severity: "blocker",
      current: "missing",
      required: target.pathwayId,
      message: `Required pathway registry row is missing for ${target.pathwayId}.`,
    });
  }
  if (!target.pathwayId) {
    gaps.push({
      area: "registry",
      severity: "blocker",
      current: "missing",
      required: "canonical pathway id",
      message: `${target.label} has no canonical exam-pathway row yet.`,
    });
  }

  const countGaps = [
    gapForCount("questions", "Published question inventory", inventory.publishedQuestions, target.minimums.publishedQuestions),
    gapForCount("lessons", "Published lesson inventory", inventory.publishedLessons, target.minimums.publishedLessons),
    gapForCount("flashcards", "Published flashcard inventory", inventory.publishedFlashcards, target.minimums.publishedFlashcards),
    gapForCount("ngn", "NGN item inventory", inventory.ngnItems, target.minimums.ngnItems),
    gapForCount("case_studies", "Case study inventory", inventory.caseStudies, target.minimums.caseStudies, false),
  ].filter((gap): gap is NursingExamGap => Boolean(gap));
  gaps.push(...countGaps);

  for (const type of target.requiredQuestionTypes) {
    if ((inventory.questionTypeCounts[type] ?? 0) === 0) {
      gaps.push({
        area: "question_type",
        severity: "blocker",
        current: 0,
        required: type,
        message: `${type} is required for publication breadth but has no visible published inventory.`,
      });
    }
  }

  const scores = [
    percent(inventory.publishedQuestions, target.minimums.publishedQuestions),
    percent(inventory.publishedLessons, target.minimums.publishedLessons),
    percent(inventory.publishedFlashcards, target.minimums.publishedFlashcards),
    percent(inventory.ngnItems, target.minimums.ngnItems),
    percent(inventory.caseStudies, target.minimums.caseStudies),
  ];
  const score = Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
  const publicationReady = gaps.filter((gap) => gap.severity === "blocker").length === 0 && score >= 95;
  return {
    target,
    pathway,
    inventory,
    score,
    publicationReady,
    monetizationReady: publicationReady && inventory.publishedQuestions >= target.minimums.publishedQuestions,
    gaps,
  };
}

export function rankNursingExamGaps(readiness: NursingExamReadiness[]): NursingExamReadiness[] {
  const priorityWeight: Record<NursingExamPriority, number> = { critical: 3, high: 2, strategic: 1 };
  return [...readiness].sort((a, b) => {
    const priorityDelta = priorityWeight[b.target.priority] - priorityWeight[a.target.priority];
    if (priorityDelta !== 0) return priorityDelta;
    const blockerDelta =
      b.gaps.filter((gap) => gap.severity === "blocker").length -
      a.gaps.filter((gap) => gap.severity === "blocker").length;
    if (blockerDelta !== 0) return blockerDelta;
    return a.score - b.score;
  });
}
