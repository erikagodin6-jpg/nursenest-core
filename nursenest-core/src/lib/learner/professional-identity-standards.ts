import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";

export type ProfessionalIdentityDimension =
  | "clinical-capability"
  | "safe-practice"
  | "calm-under-pressure"
  | "professional-reasoning"
  | "patient-advocacy"
  | "nursing-responsibility"
  | "transferable-judgment";

export type ProfessionalIdentityStandard = {
  tier: HealthcareProgramTier;
  purpose: string;
  requiredDimensions: readonly ProfessionalIdentityDimension[];
  toneRules: readonly string[];
  avoid: readonly string[];
};

export type ProfessionalIdentityInput = {
  tier: HealthcareProgramTier;
  copy?: string | null;
  rationale?: string | null;
  feedback?: string | null;
  recommendation?: string | null;
  dimensions?: readonly ProfessionalIdentityDimension[] | null;
  framesOnlyExamScore?: boolean | null;
  usesShameOrFear?: boolean | null;
  overpromisesConfidence?: boolean | null;
};

export type ProfessionalIdentityIssueCode =
  | "MISSING_IDENTITY_DIMENSION"
  | "MISSING_SAFE_PRACTICE_LANGUAGE"
  | "MISSING_ADVOCACY_OR_RESPONSIBILITY"
  | "MISSING_TRANSFERABLE_JUDGMENT"
  | "EXAM_SCORE_ONLY_FRAMING"
  | "SHAMING_OR_FEAR_BASED_TONE"
  | "OVERPROMISES_CONFIDENCE";

export type ProfessionalIdentityIssue = {
  code: ProfessionalIdentityIssueCode;
  severity: "warning" | "error";
  dimension?: ProfessionalIdentityDimension;
  message: string;
  remediation: string;
};

export type ProfessionalIdentityResult = {
  pass: boolean;
  score: number;
  standard: ProfessionalIdentityStandard;
  issues: ProfessionalIdentityIssue[];
};

const REQUIRED_DIMENSIONS = [
  "clinical-capability",
  "safe-practice",
  "calm-under-pressure",
  "professional-reasoning",
  "patient-advocacy",
  "nursing-responsibility",
  "transferable-judgment",
] as const;

const SHARED_TONE_RULES = [
  "Frame progress as becoming a safer, calmer clinician, not only earning points.",
  "Use supportive language that builds capability without guaranteeing outcomes.",
  "Connect misses to a next safe reasoning move rather than personal failure.",
  "Name patient advocacy, escalation, reassessment, and scope as professional habits.",
  "Make clinical confidence evidence-based: confidence grows from repeated safe decisions.",
] as const;

const SHARED_AVOID = [
  "shaming language",
  "fear-based urgency",
  "score-only motivation",
  "guaranteed pass claims",
  "copy that treats patient safety like a game",
] as const;

export const PROFESSIONAL_IDENTITY_STANDARDS: Record<HealthcareProgramTier, ProfessionalIdentityStandard> = {
  RPN: {
    tier: "RPN",
    purpose:
      "Build practical-nurse confidence through stable-client care, recognition/reporting, safety habits, and calm bedside responsibility.",
    requiredDimensions: REQUIRED_DIMENSIONS,
    toneRules: SHARED_TONE_RULES,
    avoid: SHARED_AVOID,
  },
  RN: {
    tier: "RN",
    purpose:
      "Build RN identity through safe prioritization, delegation, escalation, patient advocacy, and confident entry-level clinical judgment.",
    requiredDimensions: REQUIRED_DIMENSIONS,
    toneRules: SHARED_TONE_RULES,
    avoid: SHARED_AVOID,
  },
  NP: {
    tier: "NP",
    purpose:
      "Build advanced-practice identity through diagnostic responsibility, evidence-based management, safety-netting, and accountable follow-up.",
    requiredDimensions: REQUIRED_DIMENSIONS,
    toneRules: SHARED_TONE_RULES,
    avoid: SHARED_AVOID,
  },
  ALLIED: {
    tier: "ALLIED",
    purpose:
      "Build allied-health professional identity through scope-aware decisions, workflow safety, documentation, communication, and escalation.",
    requiredDimensions: REQUIRED_DIMENSIONS,
    toneRules: SHARED_TONE_RULES,
    avoid: SHARED_AVOID,
  },
} as const;

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function addIssue(issues: ProfessionalIdentityIssue[], issue: ProfessionalIdentityIssue): void {
  issues.push(issue);
}

function combinedText(input: ProfessionalIdentityInput): string {
  return [input.copy, input.rationale, input.feedback, input.recommendation].map(text).join(" ");
}

function hasSafePracticeLanguage(value: string): boolean {
  return /\b(safe|safety|harm|risk|unstable|deteriorat|reassess|escalat|airway|breathing|circulation|medication safety)\b/i.test(value);
}

function hasAdvocacyOrResponsibility(value: string): boolean {
  return /\b(advocacy|advocate|responsibility|accountable|scope|delegate|report|notify|SBAR|handoff|patient-centered|client-centered)\b/i.test(value);
}

function hasTransferableJudgment(value: string): boolean {
  return /\b(pattern|principle|framework|next time|similar client|transfer|apply|clinical judgment|professional reasoning|think like a nurse|cue)\b/i.test(value);
}

function usesShameOrFearLanguage(value: string): boolean {
  return /\b(fail(?:ed|ure)?|dangerous nurse|bad nurse|should have known|never going to pass|panic|catastrophe|disaster)\b/i.test(value);
}

function overpromises(value: string): boolean {
  return /\b(guarantee(?:d)? pass|will pass|certain to pass|always be confident|never miss|fully prepared for every)\b/i.test(value);
}

export function resolveProfessionalIdentityStandard(tier: HealthcareProgramTier): ProfessionalIdentityStandard {
  return PROFESSIONAL_IDENTITY_STANDARDS[tier];
}

export function evaluateProfessionalIdentityExperience(
  input: ProfessionalIdentityInput,
): ProfessionalIdentityResult {
  const standard = resolveProfessionalIdentityStandard(input.tier);
  const present = new Set(input.dimensions ?? []);
  const value = combinedText(input);
  const issues: ProfessionalIdentityIssue[] = [];

  for (const dimension of standard.requiredDimensions) {
    if (!present.has(dimension)) {
      addIssue(issues, {
        code: "MISSING_IDENTITY_DIMENSION",
        severity: ["clinical-capability", "safe-practice", "professional-reasoning"].includes(dimension)
          ? "error"
          : "warning",
        dimension,
        message: `Learning experience does not explicitly support ${dimension}.`,
        remediation:
          "Add copy, rationale, or feedback that connects the activity to safe clinical capability and professional nursing identity.",
      });
    }
  }

  if (!hasSafePracticeLanguage(value)) {
    addIssue(issues, {
      code: "MISSING_SAFE_PRACTICE_LANGUAGE",
      severity: "error",
      message: "Learner feedback does not clearly connect progress to safe practice.",
      remediation: "Name the safety cue, harm-prevention habit, reassessment step, or escalation behavior the learner is building.",
    });
  }

  if (!hasAdvocacyOrResponsibility(value)) {
    addIssue(issues, {
      code: "MISSING_ADVOCACY_OR_RESPONSIBILITY",
      severity: "warning",
      message: "Learning copy does not reinforce advocacy, scope, or professional responsibility.",
      remediation: "Add language about patient advocacy, scope-aware action, communication, escalation, or accountability.",
    });
  }

  if (!hasTransferableJudgment(value)) {
    addIssue(issues, {
      code: "MISSING_TRANSFERABLE_JUDGMENT",
      severity: "error",
      message: "Feedback does not teach a reusable clinical reasoning pattern.",
      remediation: "State the framework learners can transfer to the next question or bedside scenario.",
    });
  }

  if (input.framesOnlyExamScore === true || /\b(score|points|percent|rank)\b/i.test(value) && !/\b(safe|clinical judgment|patient|client)\b/i.test(value)) {
    addIssue(issues, {
      code: "EXAM_SCORE_ONLY_FRAMING",
      severity: "warning",
      message: "Learning motivation is framed mainly around scores rather than clinical capability.",
      remediation: "Connect score movement to safer reasoning, calmer prioritization, or readiness for patient care.",
    });
  }

  if (input.usesShameOrFear === true || usesShameOrFearLanguage(value)) {
    addIssue(issues, {
      code: "SHAMING_OR_FEAR_BASED_TONE",
      severity: "error",
      message: "Tone may create shame or panic instead of calm clinical confidence.",
      remediation: "Use supportive, accountable language: identify the miss, explain the safer pattern, and give the next action.",
    });
  }

  if (input.overpromisesConfidence === true || overpromises(value)) {
    addIssue(issues, {
      code: "OVERPROMISES_CONFIDENCE",
      severity: "error",
      message: "Copy overpromises confidence or exam outcomes.",
      remediation: "Frame confidence as earned through repeated safe decisions, not guaranteed outcomes.",
    });
  }

  const penalty = issues.reduce((sum, issue) => sum + (issue.severity === "error" ? 14 : 6), 0);
  const score = Math.max(0, 100 - penalty);
  return {
    pass: score >= 82 && !issues.some((issue) => issue.severity === "error"),
    score,
    standard,
    issues,
  };
}
