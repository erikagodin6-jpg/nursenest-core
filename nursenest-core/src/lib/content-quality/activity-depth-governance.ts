import {
  ACTIVITY_DEPTH_GLOBAL_REQUIRED_ELEMENTS,
  ACTIVITY_DEPTH_STANDARDS,
  type ActivityDepthStandard,
  type ActivityDepthTrack,
} from "@/lib/content-quality/standards";

export type ActivityDepthInput = {
  track: ActivityDepthTrack;
  interactionCount: number;
  questionCount: number;
  flashcardCount: number;
  averageRationaleWords: number;
  remediationPromptCount: number;
  branchingPointCount: number;
  implementedElements: readonly string[];
};

export type ActivityDepthFinding = {
  id: string;
  severity: "blocker" | "warning";
  label: string;
  expected: number | string;
  actual: number | string;
};

export type ActivityDepthVerdict = {
  standard: ActivityDepthStandard;
  score: number;
  readiness: "blocked" | "needs_review" | "meets_minimum" | "premium";
  findings: ActivityDepthFinding[];
};

function pct(actual: number, expected: number): number {
  if (expected <= 0) return 1;
  return Math.max(0, Math.min(1.2, actual / expected));
}

function pushNumericFinding(
  findings: ActivityDepthFinding[],
  id: string,
  label: string,
  actual: number,
  expected: number,
  severity: ActivityDepthFinding["severity"] = "blocker",
): void {
  if (actual >= expected) return;
  findings.push({ id, label, expected, actual, severity });
}

export function evaluateActivityDepth(input: ActivityDepthInput): ActivityDepthVerdict {
  const standard = ACTIVITY_DEPTH_STANDARDS[input.track];
  const findings: ActivityDepthFinding[] = [];

  pushNumericFinding(findings, "interactions", "Interaction count below minimum", input.interactionCount, standard.minimumInteractions);
  pushNumericFinding(findings, "questions", "Question count below minimum", input.questionCount, standard.minimumQuestions);
  pushNumericFinding(findings, "flashcards", "Flashcard count below minimum", input.flashcardCount, standard.minimumFlashcards);
  pushNumericFinding(
    findings,
    "rationale_depth",
    "Average rationale depth below minimum",
    input.averageRationaleWords,
    standard.minimumRationaleWords,
  );
  pushNumericFinding(
    findings,
    "remediation",
    "Remediation prompt count below minimum",
    input.remediationPromptCount,
    standard.minimumRemediationPrompts,
  );
  pushNumericFinding(
    findings,
    "branching",
    "Branching / progression depth below minimum",
    input.branchingPointCount,
    standard.minimumBranchingPoints,
    standard.minimumBranchingPoints > 0 ? "blocker" : "warning",
  );

  const implemented = new Set(input.implementedElements.map((item) => item.trim().toLowerCase()));
  for (const required of [...standard.requiredElements, ...ACTIVITY_DEPTH_GLOBAL_REQUIRED_ELEMENTS]) {
    if (!implemented.has(required.toLowerCase())) {
      findings.push({
        id: `missing_${required.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
        label: `Missing required element: ${required}`,
        expected: required,
        actual: "not present",
        severity: "blocker",
      });
    }
  }

  const raw =
    pct(input.interactionCount, standard.idealInteractions) * 18 +
    pct(input.questionCount, standard.idealQuestions) * 18 +
    pct(input.flashcardCount, standard.idealFlashcards) * 14 +
    pct(input.averageRationaleWords, Math.max(standard.minimumRationaleWords, 1)) * 18 +
    pct(input.remediationPromptCount, Math.max(standard.minimumRemediationPrompts, 1)) * 14 +
    pct(input.branchingPointCount, Math.max(standard.minimumBranchingPoints, 1)) * 10 +
    Math.max(0, 1 - findings.length / 12) * 8;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const hasBlocker = findings.some((finding) => finding.severity === "blocker");
  const readiness =
    hasBlocker ? "blocked" :
    score >= 90 ? "premium" :
    score >= 75 ? "meets_minimum" :
    "needs_review";

  return { standard, score, readiness, findings };
}

export function summarizeActivityDepthStandard(track: ActivityDepthTrack): string {
  const s = ACTIVITY_DEPTH_STANDARDS[track];
  return `${s.label}: minimum ${s.minimumInteractions} interactions, ${s.minimumQuestions} questions, ${s.minimumFlashcards} flashcards, ${s.minimumRemediationPrompts} remediation prompts, and ${s.minimumBranchingPoints} branching/progression points.`;
}
