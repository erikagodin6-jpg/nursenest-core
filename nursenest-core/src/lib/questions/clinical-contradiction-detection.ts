export type ClinicalContradictionInput = {
  stem?: string | null;
  correctAnswer?: string | null;
  rationale?: string | null;
  clinicalReasoning?: string | null;
  distractorRationales?: Record<string, string> | null;
};

export type ClinicalContradictionCode =
  | "RATIONALE_CONTRADICTS_CORRECT_ANSWER"
  | "DISTRACTOR_SUPPORTS_WRONG_OPTION"
  | "UNSAFE_DELAY_LANGUAGE"
  | "ABC_PRIORITY_CONTRADICTION"
  | "SEPSIS_RESUSCITATION_CONTRADICTION"
  | "OXYGENATION_CONTRADICTION";

export type ClinicalContradictionIssue = {
  code: ClinicalContradictionCode;
  severity: "review" | "high";
  message: string;
};

export type ClinicalContradictionResult = {
  contradictionScore: number;
  issues: ClinicalContradictionIssue[];
  safeForPublish: boolean;
};

function contains(text: string, patterns: string[]): boolean {
  return patterns.some((pattern) => text.includes(pattern));
}

function normalize(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

export function detectClinicalContradictions(
  input: ClinicalContradictionInput,
): ClinicalContradictionResult {
  const issues: ClinicalContradictionIssue[] = [];

  const stem = normalize(input.stem);
  const answer = normalize(input.correctAnswer);
  const rationale = normalize(input.rationale);
  const reasoning = normalize(input.clinicalReasoning);

  if (
    answer.includes("oxygen") &&
    contains(rationale, ["avoid oxygen", "withhold oxygen"])
  ) {
    issues.push({
      code: "RATIONALE_CONTRADICTS_CORRECT_ANSWER",
      severity: "high",
      message: "Rationale appears to contradict the stated correct answer.",
    });
  }

  if (
    contains(stem, ["airway", "oxygen saturation", "respiratory distress"]) &&
    contains(answer, ["document", "delay", "wait"])
  ) {
    issues.push({
      code: "ABC_PRIORITY_CONTRADICTION",
      severity: "high",
      message: "Correct answer may violate airway/breathing priority principles.",
    });
  }

  if (
    contains(stem, ["sepsis", "hypotension", "shock"]) &&
    contains(answer, ["delay", "wait", "reassure only"])
  ) {
    issues.push({
      code: "SEPSIS_RESUSCITATION_CONTRADICTION",
      severity: "high",
      message: "Correct answer may conflict with sepsis stabilization priorities.",
    });
  }

  if (
    contains(answer, ["delay", "wait", "observe only"]) &&
    contains(rationale + " " + reasoning, ["urgent", "immediate", "priority"])
  ) {
    issues.push({
      code: "UNSAFE_DELAY_LANGUAGE",
      severity: "high",
      message: "Correct answer contains delay language despite urgent rationale framing.",
    });
  }

  if (
    contains(stem, ["oxygen saturation", "hypoxia", "cyanosis"]) &&
    contains(answer, ["withhold oxygen", "remove oxygen"])
  ) {
    issues.push({
      code: "OXYGENATION_CONTRADICTION",
      severity: "high",
      message: "Correct answer may conflict with oxygenation priorities.",
    });
  }

  for (const [option, distractorRationale] of Object.entries(
    input.distractorRationales ?? {},
  )) {
    const normalizedOption = normalize(option);
    const normalizedRationale = normalize(distractorRationale);

    if (
      normalizedOption !== answer &&
      contains(normalizedRationale, ["correct", "priority", "best action"])
    ) {
      issues.push({
        code: "DISTRACTOR_SUPPORTS_WRONG_OPTION",
        severity: "review",
        message: `Distractor rationale for '${option}' may support the wrong option.`,
      });
    }
  }

  const contradictionScore = Math.max(
    0,
    100 - issues.reduce((sum, issue) => sum + (issue.severity === "high" ? 28 : 12), 0),
  );

  return {
    contradictionScore,
    issues,
    safeForPublish: !issues.some((issue) => issue.severity === "high"),
  };
}
