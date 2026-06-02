import {
  evaluateEvidenceGovernance,
  type EvidenceGovernanceInput,
} from "./evidence-governance";

export type EvidenceContradictionCode =
  | "RATIONALE_ANSWER_MISMATCH"
  | "GUIDELINE_LANGUAGE_CONFLICT"
  | "ABSOLUTE_LANGUAGE_RISK"
  | "OUTDATED_PROTOCOL_LANGUAGE"
  | "UNSUPPORTED_PRIORITY_ACTION"
  | "MEDICATION_SAFETY_CONFLICT"
  | "UNSUPPORTED_SCOPE_OF_PRACTICE"
  | "POTENTIAL_HALLUCINATED_CLAIM";

export type EvidenceContradiction = {
  code: EvidenceContradictionCode;
  severity: "review" | "high" | "blocker";
  message: string;
  remediation: string;
};

export type EvidenceContradictionInput = EvidenceGovernanceInput & {
  correctAnswer?: string | string[] | null;
  options?: unknown;
};

export type EvidenceContradictionResult = {
  safe: boolean;
  contradictionScore: number;
  contradictions: EvidenceContradiction[];
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function combined(input: EvidenceContradictionInput): string {
  return [
    input.stem,
    input.rationale,
    input.clinicalReasoning,
    ...(Array.isArray(input.correctAnswer) ? input.correctAnswer : [input.correctAnswer]),
  ]
    .map(text)
    .join(" ")
    .toLowerCase();
}

export function validateEvidenceContradictions(
  input: EvidenceContradictionInput,
): EvidenceContradictionResult {
  const contradictions: EvidenceContradiction[] = [];
  const evidence = evaluateEvidenceGovernance(input);
  const corpus = combined(input);

  if (/always use oxygen/.test(corpus)) {
    contradictions.push({
      code: "OUTDATED_PROTOCOL_LANGUAGE",
      severity: "high",
      message: "Routine oxygen language may conflict with modern chest-pain guidance unless hypoxia is present.",
      remediation: "Clarify oxygen indications and align with current ACS/chest-pain guidance.",
    });
  }

  if (/never assess airway/.test(corpus) || /delay airway/.test(corpus)) {
    contradictions.push({
      code: "UNSUPPORTED_PRIORITY_ACTION",
      severity: "blocker",
      message: "Priority-action guidance conflicts with ABC stabilization principles.",
      remediation: "Re-evaluate prioritization and ensure airway/breathing/circulation logic is clinically consistent.",
    });
  }

  if (/warfarin.*pregnan/.test(corpus) || /ace inhibitor.*pregnan/.test(corpus)) {
    contradictions.push({
      code: "MEDICATION_SAFETY_CONFLICT",
      severity: "blocker",
      message: "Medication guidance may conflict with pregnancy safety standards.",
      remediation: "Validate medication safety against current obstetric references.",
    });
  }

  if (/always|never|all patients|must always/.test(corpus)) {
    contradictions.push({
      code: "ABSOLUTE_LANGUAGE_RISK",
      severity: "review",
      message: "Absolute language may overstate clinical recommendations.",
      remediation: "Replace absolute wording with clinically nuanced guidance where appropriate.",
    });
  }

  if (/lpn independently diagnose|unlicensed assistive personnel administer insulin/.test(corpus)) {
    contradictions.push({
      code: "UNSUPPORTED_SCOPE_OF_PRACTICE",
      severity: "blocker",
      message: "Scope-of-practice statement may be unsafe or jurisdictionally inaccurate.",
      remediation: "Validate delegation/scope rules against jurisdictional standards.",
    });
  }

  if (evidence.supportedClaims === 0 && corpus.length > 120) {
    contradictions.push({
      code: "POTENTIAL_HALLUCINATED_CLAIM",
      severity: "high",
      message: "Large unsupported clinical explanation detected without evidence support.",
      remediation: "Attach authoritative citations for all major clinical claims.",
    });
  }

  const answer = Array.isArray(input.correctAnswer)
    ? input.correctAnswer.map(text).join(" ").toLowerCase()
    : text(input.correctAnswer).toLowerCase();
  const rationale = text(input.rationale).toLowerCase();

  if (
    answer.includes("hold") && rationale.includes("administer") && !rationale.includes("do not administer")
  ) {
    contradictions.push({
      code: "RATIONALE_ANSWER_MISMATCH",
      severity: "high",
      message: "Rationale language may contradict the selected answer action.",
      remediation: "Ensure rationale explicitly supports the chosen intervention.",
    });
  }

  if (
    evidence.confidence === "low" &&
    /guideline|evidence|recommended standard/.test(corpus)
  ) {
    contradictions.push({
      code: "GUIDELINE_LANGUAGE_CONFLICT",
      severity: "review",
      message: "Strong guideline language is being used without high-confidence evidence support.",
      remediation: "Use authoritative or high-confidence references for definitive guideline statements.",
    });
  }

  const contradictionPenalty = contradictions.reduce((sum, contradiction) => {
    if (contradiction.severity === "blocker") return sum + 35;
    if (contradiction.severity === "high") return sum + 20;
    return sum + 8;
  }, 0);

  return {
    safe: !contradictions.some((entry) => entry.severity === "blocker"),
    contradictionScore: Math.max(0, 100 - contradictionPenalty),
    contradictions,
  };
}
