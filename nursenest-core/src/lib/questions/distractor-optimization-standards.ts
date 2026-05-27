import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";

export type DistractorOptimizationIssueCode =
  | "TOO_FEW_OPTIONS"
  | "MISSING_CORRECT_ANSWER"
  | "TOO_FEW_DISTRACTORS"
  | "THROWAWAY_DISTRACTOR"
  | "OBVIOUS_SAFETY_GIVEAWAY"
  | "ABSOLUTE_LANGUAGE_GIVEAWAY"
  | "ALL_OR_NONE_PATTERN"
  | "LENGTH_CLUE"
  | "REPEATED_OPTION_PATTERN"
  | "DUPLICATE_DISTRACTOR"
  | "DISTRACTOR_RATIONALE_MISSING"
  | "DISTRACTOR_RATIONALE_TOO_GENERIC";

export type DistractorOptimizationIssue = {
  code: DistractorOptimizationIssueCode;
  severity: "warning" | "error";
  optionId?: string;
  message: string;
  remediation: string;
};

export type DistractorOptimizationStandard = {
  tier: HealthcareProgramTier;
  goal: string;
  requiredDistractorQualities: readonly string[];
  avoid: readonly string[];
  misconceptionTargets: readonly string[];
};

export type DistractorOptimizationInput = {
  tier: HealthcareProgramTier;
  stem?: string | null;
  options?: unknown;
  correctAnswer?: unknown;
  distractorRationales?: unknown;
  minimumDistractors?: number;
};

export type DistractorOptimizationResult = {
  pass: boolean;
  score: number;
  standard: DistractorOptimizationStandard;
  issues: DistractorOptimizationIssue[];
};

type NormalizedOption = {
  id: string;
  text: string;
  correct: boolean;
};

const SHARED_REQUIRED_DISTRACTOR_QUALITIES = [
  "Clinically plausible on first read",
  "Mapped to a common learner misconception",
  "Reasoning-based rather than recall-only",
  "Represents a realistic bedside or workflow mistake",
  "Contains a subtle flaw rather than an obvious unsafe action",
  "Matches the grammar, style, and approximate length of the correct answer",
] as const;

const SHARED_AVOID = [
  "joke or non-clinical answers",
  "obviously unsafe actions used as giveaways",
  "grammatical clues",
  "length clues",
  "repeated answer patterns",
  "always/never giveaways",
  "all of the above or none of the above",
  "throwaway distractors",
] as const;

export const DISTRACTOR_OPTIMIZATION_STANDARDS: Record<
  HealthcareProgramTier,
  DistractorOptimizationStandard
> = {
  RPN: {
    tier: "RPN",
    goal:
      "Distractors should separate safe foundational bedside care from common recognition, reporting, and scope mistakes.",
    requiredDistractorQualities: SHARED_REQUIRED_DISTRACTOR_QUALITIES,
    avoid: [
      ...SHARED_AVOID,
      "independent diagnostic or prescribing actions outside practical-nurse scope",
      "unstable critical-care ownership beyond expected RPN decision level",
    ],
    misconceptionTargets: [
      "delaying report of unexpected findings",
      "choosing comfort care before safety assessment",
      "confusing expected stable findings with deterioration",
      "performing actions outside practical-nurse scope instead of escalating",
    ],
  },
  RN: {
    tier: "RN",
    goal:
      "Distractors should challenge entry-level RN prioritization, safety, delegation, and recognition of deterioration.",
    requiredDistractorQualities: SHARED_REQUIRED_DISTRACTOR_QUALITIES,
    avoid: [
      ...SHARED_AVOID,
      "highly specialized ICU management",
      "advanced ventilator management",
      "physician-level decision-making",
      "respiratory therapist-specific interventions",
      "rare specialty procedures",
      "obscure disease states",
    ],
    misconceptionTargets: [
      "prioritizing stable patients over unstable cues",
      "choosing assessment when immediate intervention is required",
      "delegating tasks that require RN judgment",
      "escalating before using safe nursing interventions",
      "missing ABC, safety, or acute-change cues",
    ],
  },
  NP: {
    tier: "NP",
    goal:
      "Distractors should differentiate advanced diagnostic reasoning, evidence-based management, and follow-up judgment.",
    requiredDistractorQualities: SHARED_REQUIRED_DISTRACTOR_QUALITIES,
    avoid: [
      ...SHARED_AVOID,
      "RN-only delegation framing as the final endpoint",
      "diagnoses without management implications",
      "plans without monitoring, contraindication, or follow-up logic",
    ],
    misconceptionTargets: [
      "anchoring on a common diagnosis despite red flags",
      "choosing treatment without ruling out contraindications",
      "ordering tests that do not change management",
      "missing follow-up or escalation requirements",
      "confusing first-line and second-line pharmacologic choices",
    ],
  },
  ALLIED: {
    tier: "ALLIED",
    goal:
      "Distractors should test profession-specific workflow, scope, communication, safety, and escalation reasoning.",
    requiredDistractorQualities: SHARED_REQUIRED_DISTRACTOR_QUALITIES,
    avoid: [
      ...SHARED_AVOID,
      "RN-only care-planning distractors as the default frame",
      "generic healthcare trivia",
      "scope-inappropriate diagnosis or treatment ownership",
      "profession-agnostic explanations that ignore workflow",
    ],
    misconceptionTargets: [
      "working outside profession-specific scope",
      "missing protocol, specimen, device, or documentation safeguards",
      "delaying urgent interprofessional communication",
      "prioritizing workflow speed over patient identity or safety checks",
      "misinterpreting role-specific diagnostic or procedural cues",
    ],
  },
} as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseArrayish(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseObjectish(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }
  return {};
}

function normalizeCorrectAnswer(value: unknown): Set<string> {
  const raw = Array.isArray(value) ? value : [value];
  return new Set(
    raw
      .map((entry) => String(entry ?? "").trim().toLowerCase())
      .filter(Boolean),
  );
}

function normalizeOptions(options: unknown, correctAnswer: unknown): NormalizedOption[] {
  const correct = normalizeCorrectAnswer(correctAnswer);
  return parseArrayish(options)
    .map((option, index): NormalizedOption => {
      if (typeof option === "string") {
        const id = String.fromCharCode(65 + index);
        return {
          id,
          text: option.trim(),
          correct: correct.has(id.toLowerCase()) || correct.has(option.trim().toLowerCase()),
        };
      }

      const record = option && typeof option === "object" ? (option as Record<string, unknown>) : {};
      const id = text(record.id ?? record.key ?? record.label) || String.fromCharCode(65 + index);
      const optionText = text(record.text ?? record.content ?? record.value ?? record.label);
      const optionCorrect = record.correct === true || correct.has(id.toLowerCase()) || correct.has(optionText.toLowerCase());

      return {
        id,
        text: optionText,
        correct: optionCorrect,
      };
    })
    .filter((option) => option.text.length > 0);
}

function words(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function wordSimilarity(a: string, b: string): number {
  const aw = new Set(words(a));
  const bw = new Set(words(b));
  const overlap = [...aw].filter((word) => bw.has(word)).length;
  return overlap / Math.max(1, Math.min(aw.size, bw.size));
}

function leadingPattern(value: string): string {
  const pattern = words(value).slice(0, 2).join(" ");
  if (["a client", "the client", "a patient", "the patient", "a nurse", "the nurse"].includes(pattern)) {
    return "";
  }
  return pattern;
}

function rationaleForOption(rationales: Record<string, unknown>, option: NormalizedOption): string {
  const direct = rationales[option.id] ?? rationales[option.id.toLowerCase()] ?? rationales[option.text];
  return typeof direct === "string" ? direct.trim() : "";
}

function addIssue(issues: DistractorOptimizationIssue[], issue: DistractorOptimizationIssue): void {
  issues.push(issue);
}

export function resolveDistractorOptimizationStandard(
  tier: HealthcareProgramTier,
): DistractorOptimizationStandard {
  return DISTRACTOR_OPTIMIZATION_STANDARDS[tier];
}

export function evaluateDistractorOptimization(
  input: DistractorOptimizationInput,
): DistractorOptimizationResult {
  const standard = resolveDistractorOptimizationStandard(input.tier);
  const options = normalizeOptions(input.options, input.correctAnswer);
  const distractors = options.filter((option) => !option.correct);
  const correctOptions = options.filter((option) => option.correct);
  const rationales = parseObjectish(input.distractorRationales);
  const issues: DistractorOptimizationIssue[] = [];

  if (options.length < 4) {
    addIssue(issues, {
      code: "TOO_FEW_OPTIONS",
      severity: "error",
      message: "Multiple-choice items need four answer options for strong exam discrimination.",
      remediation: "Add four clinically plausible options with one correct answer and three misconception-based distractors.",
    });
  }

  if (correctOptions.length < 1) {
    addIssue(issues, {
      code: "MISSING_CORRECT_ANSWER",
      severity: "error",
      message: "The item must identify at least one correct answer for scoring.",
      remediation: "Mark the canonical correct option(s) and align them with the option id/text.",
    });
  }

  const minimumDistractors = input.minimumDistractors ?? 3;
  if (distractors.length < minimumDistractors) {
    addIssue(issues, {
      code: "TOO_FEW_DISTRACTORS",
      severity: "error",
      message: `The item has fewer than ${minimumDistractors} distractor(s).`,
      remediation: "Create incorrect options that each test a different clinical misconception.",
    });
  }

  const optionLengths = options.map((option) => option.text.length);
  const averageLength =
    optionLengths.reduce((sum, length) => sum + length, 0) / Math.max(1, optionLengths.length);

  for (const option of options) {
    if (/\b(all|none)\s+of\s+the\s+above\b/i.test(option.text)) {
      addIssue(issues, {
        code: "ALL_OR_NONE_PATTERN",
        severity: "error",
        optionId: option.id,
        message: "All/none-of-the-above options weaken distractor analysis.",
        remediation: "Replace with a clinically plausible action or finding that exposes a specific misconception.",
      });
    }

    if (/\b(always|never)\b/i.test(option.text)) {
      addIssue(issues, {
        code: "ABSOLUTE_LANGUAGE_GIVEAWAY",
        severity: "warning",
        optionId: option.id,
        message: "Absolute wording can make a distractor too easy to eliminate.",
        remediation: "Use conditional clinical wording that mirrors real practice decisions.",
      });
    }

    if (/^(yes|no|true|false|maybe|n\/a)$/i.test(option.text) || option.text.length < 10) {
      addIssue(issues, {
        code: "THROWAWAY_DISTRACTOR",
        severity: "error",
        optionId: option.id,
        message: "The option is too short or non-clinical to function as a real distractor.",
        remediation: "Rewrite it as a plausible assessment, intervention, teaching statement, or workflow decision.",
      });
    }

    if (/\b(ignore|do nothing|withhold all|refuse care|leave the client|delay assessment)\b/i.test(option.text)) {
      addIssue(issues, {
        code: "OBVIOUS_SAFETY_GIVEAWAY",
        severity: "warning",
        optionId: option.id,
        message: "The option is so unsafe that learners can eliminate it without reasoning.",
        remediation: "Replace with a realistic but less-prioritized action that contains a subtle flaw.",
      });
    }

    if (averageLength > 0 && option.text.length > averageLength * 1.8) {
      addIssue(issues, {
        code: "LENGTH_CLUE",
        severity: "warning",
        optionId: option.id,
        message: "This option is much longer than the others and may cue the answer.",
        remediation: "Balance option length and detail across all answer choices.",
      });
    }
  }

  const repeatedPatterns = new Set<string>();
  for (const option of options) {
    const pattern = leadingPattern(option.text);
    if (pattern && repeatedPatterns.has(pattern)) {
      addIssue(issues, {
        code: "REPEATED_OPTION_PATTERN",
        severity: "warning",
        optionId: option.id,
        message: "Multiple options share repetitive phrasing that can create pattern clues.",
        remediation: "Vary option starts while preserving parallel grammar and clinical style.",
      });
      break;
    }
    repeatedPatterns.add(pattern);
  }

  for (let i = 0; i < options.length; i += 1) {
    for (let j = i + 1; j < options.length; j += 1) {
      if (wordSimilarity(options[i].text, options[j].text) >= 0.82) {
        addIssue(issues, {
          code: "DUPLICATE_DISTRACTOR",
          severity: "warning",
          optionId: options[j].id,
          message: "Two options are nearly identical and may not test distinct misconceptions.",
          remediation: "Make each distractor target a separate reasoning error.",
        });
        break;
      }
    }
  }

  for (const distractor of distractors) {
    const rationale = rationaleForOption(rationales, distractor);
    if (!rationale) {
      addIssue(issues, {
        code: "DISTRACTOR_RATIONALE_MISSING",
        severity: "error",
        optionId: distractor.id,
        message: "Distractor lacks a teaching rationale.",
        remediation: "Explain why this option is tempting and what clinical flaw makes it incorrect.",
      });
    } else if (
      rationale.length < 40 ||
      /\b(wrong|incorrect|not correct|bad option|not the answer)\b/i.test(rationale)
    ) {
      addIssue(issues, {
        code: "DISTRACTOR_RATIONALE_TOO_GENERIC",
        severity: "warning",
        optionId: distractor.id,
        message: "Distractor rationale is too generic to teach clinical reasoning.",
        remediation: "Name the misconception, cue, or safety issue that makes the option less appropriate.",
      });
    }
  }

  const score = Math.max(
    0,
    100 -
      issues.reduce((penalty, issue) => {
        return penalty + (issue.severity === "error" ? 18 : 8);
      }, 0),
  );

  return {
    pass: score >= 80 && !issues.some((issue) => issue.severity === "error"),
    score,
    standard,
    issues,
  };
}
