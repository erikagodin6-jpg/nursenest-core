import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";
import { evaluateNursingContentVariation } from "@/lib/questions/content-variation-standards";

export type PremiumContentDepthStandard = {
  tier: HealthcareProgramTier;
  purpose: string;
  requiredDepthSignals: readonly string[];
  requiredTeachingSurfaces: readonly string[];
  avoid: readonly string[];
  scopeGuardrails: readonly string[];
};

export type PremiumContentDepthInput = {
  tier: HealthcareProgramTier;
  stem?: string | null;
  options?: unknown;
  rationale?: string | null;
  clinicalReasoning?: string | null;
  hint?: string | null;
  keyTakeaway?: string | null;
  clinicalTrap?: string | null;
  caseStudySummary?: string | null;
  distractorRationales?: unknown;
};

export type PremiumContentDepthIssueCode =
  | "SHALLOW_EXPLANATION"
  | "MISSING_DEEP_CLINICAL_REASONING"
  | "MISSING_PATIENT_SAFETY_REINFORCEMENT"
  | "MISSING_NUANCED_PRIORITIZATION"
  | "MISSING_BEDSIDE_AMBIGUITY"
  | "MISSING_HIGH_YIELD_EXAM_INSIGHT"
  | "MISSING_TRANSFERABLE_JUDGMENT"
  | "GENERIC_TEACHING_LANGUAGE"
  | "REPETITIVE_RATIONALE_WORDING"
  | "TEXTBOOK_REGURGITATION"
  | "INSUFFICIENT_DISTRACTOR_TEACHING"
  | "TIER_SCOPE_MISMATCH";

export type PremiumContentDepthIssue = {
  code: PremiumContentDepthIssueCode;
  severity: "warning" | "error";
  message: string;
  remediation: string;
};

export type PremiumContentDepthResult = {
  pass: boolean;
  score: number;
  standard: PremiumContentDepthStandard;
  issues: PremiumContentDepthIssue[];
};

const SHARED_DEPTH_SIGNALS = [
  "deep clinical reasoning",
  "patient safety reinforcement",
  "nuanced prioritization",
  "real bedside ambiguity",
  "high-yield exam insight",
  "transferable clinical judgment",
] as const;

const SHARED_TEACHING_SURFACES = [
  "rationale",
  "hint",
  "distractor teaching",
  "case or scenario context",
  "exam insight or clinical trap",
] as const;

const SHARED_AVOID = [
  "shallow explanations",
  "textbook regurgitation",
  "simplistic distractors",
  "generic teaching points",
  "repetitive rationale wording",
  "trivia without clinical consequence",
] as const;

export const PREMIUM_CONTENT_DEPTH_STANDARDS: Record<HealthcareProgramTier, PremiumContentDepthStandard> = {
  RPN: {
    tier: "RPN",
    purpose:
      "Upgrade foundational practical-nurse content so it teaches safe bedside recognition, reporting, and stable-client judgment.",
    requiredDepthSignals: SHARED_DEPTH_SIGNALS,
    requiredTeachingSurfaces: SHARED_TEACHING_SURFACES,
    avoid: [
      ...SHARED_AVOID,
      "advanced diagnosis or prescribing framed as practical-nurse judgment",
    ],
    scopeGuardrails: [
      "Depth should come from safety, expected-vs-unexpected findings, and reportable changes.",
      "Do not use out-of-scope interventions as a shortcut for difficulty.",
    ],
  },
  RN: {
    tier: "RN",
    purpose:
      "Upgrade RN content so learners understand how to practice safely through prioritization, delegation, intervention sequencing, and deterioration recognition.",
    requiredDepthSignals: SHARED_DEPTH_SIGNALS,
    requiredTeachingSurfaces: SHARED_TEACHING_SURFACES,
    avoid: [
      ...SHARED_AVOID,
      "advanced ICU or physician-level reasoning as an RN difficulty substitute",
    ],
    scopeGuardrails: [
      "Depth should come from NCLEX-style clinical judgment, not obscure specialty management.",
      "Keep bedside language realistic and focused on safe nursing action.",
    ],
  },
  NP: {
    tier: "NP",
    purpose:
      "Upgrade NP content so it teaches diagnostic reasoning, evidence-based management, pharmacology safety, follow-up, and escalation.",
    requiredDepthSignals: SHARED_DEPTH_SIGNALS,
    requiredTeachingSurfaces: SHARED_TEACHING_SURFACES,
    avoid: [
      ...SHARED_AVOID,
      "RN-only delegation as the endpoint of advanced-practice content",
    ],
    scopeGuardrails: [
      "Depth should come from differential diagnosis, contraindications, monitoring, and management consequences.",
      "Do not make content feel advanced by adding jargon without clinical decision value.",
    ],
  },
  ALLIED: {
    tier: "ALLIED",
    purpose:
      "Upgrade Allied Health content so it teaches profession-specific workflow, scope, communication, documentation, and safety reasoning.",
    requiredDepthSignals: SHARED_DEPTH_SIGNALS,
    requiredTeachingSurfaces: SHARED_TEACHING_SURFACES,
    avoid: [
      ...SHARED_AVOID,
      "generic RN-style teaching that ignores allied-health workflow and scope",
    ],
    scopeGuardrails: [
      "Depth should come from profession-specific workflow, safety checks, interpretation, communication, and escalation.",
      "Do not default to RN care planning when the allied role has a distinct decision pathway.",
    ],
  },
} as const;

function text(value: string | null | undefined): string {
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

function optionText(option: unknown): string {
  if (typeof option === "string") return option.trim();
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    return text(String(record.text ?? record.content ?? record.label ?? ""));
  }
  return "";
}

function wordCount(value: string): number {
  return value.match(/\b[\w'-]+\b/g)?.length ?? 0;
}

function countMatches(value: string, patterns: readonly RegExp[]): number {
  return patterns.reduce((sum, pattern) => sum + (pattern.test(value) ? 1 : 0), 0);
}

function addIssue(issues: PremiumContentDepthIssue[], issue: PremiumContentDepthIssue): void {
  issues.push(issue);
}

const CLINICAL_REASONING_PATTERNS = [
  /\b(cue|because|therefore|indicates|suggests|reflects|means|priority|interpret|connect|recognize|synthesize|reasoning chain)\b/i,
  /\b(pathophysiology|clinical judgment|nursing judgment|clinical reasoning|diagnostic reasoning|management reasoning|workflow reasoning|reasoning framework|decision framework|framework)\b/i,
] as const;

const SAFETY_PATTERNS = [
  /\b(safety|harm|risk|deteriorat|unstable|urgent|airway|breathing|circulation|bleeding|infection|hypoxia|shock|fall|medication error)\b/i,
] as const;

const PRIORITIZATION_PATTERNS = [
  /\b(first|priority|before|after|initial|next|immediate|most important|least appropriate|stable|unstable|delegate|escalate)\b/i,
] as const;

const AMBIGUITY_PATTERNS = [
  /\b(although|however|while|despite|but|competing|ambiguous|uncertain|reasonable|tempting|less urgent|later)\b/i,
] as const;

const EXAM_INSIGHT_PATTERNS = [
  /\b(exam|test[- ]taking|trap|takeaway|high[- ]yield|common mistake|tempting|NCLEX|REx|board)\b/i,
] as const;

const TRANSFERABLE_JUDGMENT_PATTERNS = [
  /\b(framework|principle|apply|transfer|similar clients|future questions|generalize|pattern|decision rule)\b/i,
] as const;

const GENERIC_PATTERNS = [
  /\b(because it is correct|this is the best answer|review the material|study this topic|important to know|basic concept)\b/i,
  /\b(this option does not address the priority assessment or intervention implied by the stem)\b/i,
  /\b(this option does not address the priority|this is incorrect|not the best answer|this is not correct)\b/i,
  /\b(no separate rationale is available|rationale unavailable|answer shown)\b/i,
] as const;

const TEXTBOOK_PATTERNS = [
  /^\s*(what is|define|which statement defines|which option defines)\b/i,
  /\b(is defined as|refers to|textbook|definition|memorize|term means|is when)\b/i,
] as const;

const SCOPE_MISMATCH_PATTERNS: Record<HealthcareProgramTier, readonly RegExp[]> = {
  RPN: [/\bdiagnose|prescribe|intubate|vasopressor|central line|adjust ventilator\b/i],
  RN: [/\bprescribe\b|diagnose\b|intubate|adjust ventilator settings|insert central line|perform surgery\b/i],
  NP: [/\bnone impossible marker\b/i],
  ALLIED: [/\bnursing care plan|prescribe|diagnose and treat|independent medical management\b/i],
};

export function resolvePremiumContentDepthStandard(tier: HealthcareProgramTier): PremiumContentDepthStandard {
  return PREMIUM_CONTENT_DEPTH_STANDARDS[tier];
}

export function evaluatePremiumContentDepth(input: PremiumContentDepthInput): PremiumContentDepthResult {
  const standard = resolvePremiumContentDepthStandard(input.tier);
  const stem = text(input.stem);
  const rationale = text(input.rationale);
  const clinicalReasoning = text(input.clinicalReasoning);
  const hint = text(input.hint);
  const keyTakeaway = text(input.keyTakeaway);
  const clinicalTrap = text(input.clinicalTrap);
  const caseStudySummary = text(input.caseStudySummary);
  const options = parseArrayish(input.options).map(optionText).filter(Boolean);
  const distractorRationales = Object.values(parseObjectish(input.distractorRationales))
    .map((value) => text(typeof value === "string" ? value : JSON.stringify(value)))
    .filter(Boolean);
  const teachingText = [
    rationale,
    clinicalReasoning,
    hint,
    keyTakeaway,
    clinicalTrap,
    caseStudySummary,
    ...distractorRationales,
  ].join(" ");
  const combined = [stem, teachingText, ...options].join(" ");
  const issues: PremiumContentDepthIssue[] = [];

  if (wordCount(teachingText) < 80) {
    addIssue(issues, {
      code: "SHALLOW_EXPLANATION",
      severity: "error",
      message: "Teaching content is too thin for premium board-prep quality.",
      remediation: "Add clinician-authored reasoning that explains cues, safety implications, and why alternatives are tempting.",
    });
  }

  if (countMatches(teachingText, CLINICAL_REASONING_PATTERNS) < 2) {
    addIssue(issues, {
      code: "MISSING_DEEP_CLINICAL_REASONING",
      severity: "error",
      message: "Content does not teach the reasoning chain behind the answer.",
      remediation: "Explain how the relevant cues connect to the safest clinical decision.",
    });
  }

  if (countMatches(combined, SAFETY_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_PATIENT_SAFETY_REINFORCEMENT",
      severity: "error",
      message: "Content does not clearly reinforce patient safety.",
      remediation: "Tie the teaching to harm prevention, deterioration recognition, medication safety, escalation, or safe workflow.",
    });
  }

  if (countMatches(combined, PRIORITIZATION_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_NUANCED_PRIORITIZATION",
      severity: "warning",
      message: "Content lacks prioritization or sequencing nuance.",
      remediation: "Explain what happens first, what can wait, and why timing or stability changes the answer.",
    });
  }

  if (countMatches(combined, AMBIGUITY_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_BEDSIDE_AMBIGUITY",
      severity: "warning",
      message: "Content does not reflect realistic bedside ambiguity.",
      remediation: "Name why an incorrect option is tempting and what specific stem detail, threshold, or scope rule makes it wrong.",
    });
  }

  if (countMatches(teachingText, EXAM_INSIGHT_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_HIGH_YIELD_EXAM_INSIGHT",
      severity: "warning",
      message: "Content lacks a high-yield exam insight or trap.",
      remediation: "Add a concise takeaway, common trap, or exam-facing reasoning rule.",
    });
  }

  if (countMatches(teachingText, TRANSFERABLE_JUDGMENT_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_TRANSFERABLE_JUDGMENT",
      severity: "warning",
      message: "Content does not build transferable clinical judgment.",
      remediation: "Add a principle learners can apply to similar patients, future questions, or real workflow decisions.",
    });
  }

  if (countMatches(teachingText, GENERIC_PATTERNS) > 0) {
    addIssue(issues, {
      code: "GENERIC_TEACHING_LANGUAGE",
      severity: "error",
      message: "Content uses generic teaching language instead of clinician-quality explanation.",
      remediation: "Replace generic wording with specific cues, consequences, and rationale for each decision.",
    });
  }

  if (countMatches(combined, TEXTBOOK_PATTERNS) > 0 && countMatches(combined, CLINICAL_REASONING_PATTERNS) < 2) {
    addIssue(issues, {
      code: "TEXTBOOK_REGURGITATION",
      severity: "error",
      message: "Content reads like textbook regurgitation rather than clinical reasoning.",
      remediation: "Convert definitions into scenario-based teaching with safety, prioritization, and bedside decision consequences.",
    });
  }

  const repeatedBecause = (teachingText.match(/\bbecause\b/gi) ?? []).length;
  const repeatedCorrect = (teachingText.match(/\bcorrect answer\b/gi) ?? []).length;
  const variation = evaluateNursingContentVariation([
    { id: "rationale", kind: "rationale", text: rationale },
    { id: "clinicalReasoning", kind: "rationale", text: clinicalReasoning },
    { id: "hint", kind: "hint", text: hint },
    { id: "keyTakeaway", kind: "rationale", text: keyTakeaway },
    { id: "clinicalTrap", kind: "rationale", text: clinicalTrap },
    ...distractorRationales.map((value, index) => ({
      id: `distractor-${index + 1}`,
      kind: "distractor-rationale" as const,
      text: value,
    })),
  ]);
  if (
    repeatedBecause >= 5 ||
    repeatedCorrect >= 3 ||
    variation.issues.some((issue) =>
      ["REPEATED_OPENING_PATTERN", "REPEATED_SENTENCE_FRAME", "LOW_STRUCTURAL_VARIATION"].includes(issue.code),
    )
  ) {
    addIssue(issues, {
      code: "REPETITIVE_RATIONALE_WORDING",
      severity: "warning",
      message: "Rationale wording is repetitive and may feel generated.",
      remediation: "Vary explanation structure while keeping cue recognition, safety, and decision logic explicit.",
    });
  }

  if (options.length >= 4 && distractorRationales.length < Math.max(1, options.length - 1)) {
    addIssue(issues, {
      code: "INSUFFICIENT_DISTRACTOR_TEACHING",
      severity: "error",
      message: "Distractor teaching is incomplete for premium board-prep content.",
      remediation: "Explain why each incorrect answer is tempting and what clinical flaw makes it incorrect.",
    });
  }

  if (SCOPE_MISMATCH_PATTERNS[input.tier].some((pattern) => pattern.test(combined))) {
    addIssue(issues, {
      code: "TIER_SCOPE_MISMATCH",
      severity: "error",
      message: "Teaching depth appears to exceed or mismatch the learner tier scope.",
      remediation: "Increase depth through reasoning within scope, not through out-of-scope clinical authority.",
    });
  }

  const score = Math.max(
    0,
    100 -
      issues.reduce((penalty, issue) => {
        return penalty + (issue.severity === "error" ? 18 : 7);
      }, 0),
  );

  return {
    pass: score >= 80 && !issues.some((issue) => issue.severity === "error"),
    score,
    standard,
    issues,
  };
}
