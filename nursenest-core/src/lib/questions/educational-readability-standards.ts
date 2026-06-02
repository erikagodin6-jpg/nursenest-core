import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";

export type EducationalReadabilityStandard = {
  tier: HealthcareProgramTier;
  purpose: string;
  maxSentenceWords: number;
  maxParagraphWords: number;
  maxOptionWords: number;
  preferredRationaleSections: readonly string[];
  requiredScannabilityCues: readonly string[];
  mobileGuidance: readonly string[];
};

export type EducationalReadabilityInput = {
  tier: HealthcareProgramTier;
  stem?: string | null;
  options?: unknown;
  rationale?: string | null;
  clinicalReasoning?: string | null;
  keyTeachingPoints?: unknown;
  rationaleSections?: unknown;
};

export type EducationalReadabilityIssueCode =
  | "DENSE_PARAGRAPH"
  | "LONG_SENTENCE"
  | "RATIONALE_NOT_CHUNKED"
  | "MISSING_BULLETS_FOR_LONG_RATIONALE"
  | "KEY_TEACHING_POINTS_NOT_SCANNABLE"
  | "SAFETY_CUES_NOT_SCANNABLE"
  | "OPTION_TOO_LONG_FOR_MOBILE"
  | "INCONSISTENT_TERMINOLOGY"
  | "EXCESSIVE_COGNITIVE_LOAD";

export type EducationalReadabilityIssue = {
  code: EducationalReadabilityIssueCode;
  severity: "warning" | "error";
  message: string;
  remediation: string;
};

export type EducationalReadabilityResult = {
  pass: boolean;
  score: number;
  standard: EducationalReadabilityStandard;
  issues: EducationalReadabilityIssue[];
};

const COMMON_RATIONALE_SECTIONS = [
  "Why this is correct",
  "Why the other options are tempting",
  "Safety cue",
  "Test-taking takeaway",
] as const;

const COMMON_SCANNABILITY_CUES = [
  "short rationale chunks",
  "bullets for multi-step teaching",
  "explicit safety cue",
  "clear correct-answer takeaway",
  "consistent patient/client terminology",
] as const;

export const EDUCATIONAL_READABILITY_STANDARDS: Record<
  HealthcareProgramTier,
  EducationalReadabilityStandard
> = {
  RPN: {
    tier: "RPN",
    purpose:
      "Make foundational bedside teaching easy to scan for fatigued learners while preserving safety and reporting logic.",
    maxSentenceWords: 26,
    maxParagraphWords: 70,
    maxOptionWords: 24,
    preferredRationaleSections: COMMON_RATIONALE_SECTIONS,
    requiredScannabilityCues: COMMON_SCANNABILITY_CUES,
    mobileGuidance: [
      "Use short action-focused answer options.",
      "Highlight reportable cues and safety implications.",
      "Avoid dense paragraph teaching when a bullet list would improve retention.",
    ],
  },
  RN: {
    tier: "RN",
    purpose:
      "Keep NCLEX-style clinical judgment rationales readable during rapid review without flattening prioritization depth.",
    maxSentenceWords: 28,
    maxParagraphWords: 80,
    maxOptionWords: 28,
    preferredRationaleSections: COMMON_RATIONALE_SECTIONS,
    requiredScannabilityCues: COMMON_SCANNABILITY_CUES,
    mobileGuidance: [
      "Chunk prioritization, cue recognition, and intervention sequence separately.",
      "Make urgent safety cues visually scannable.",
      "Keep options parallel and mobile-readable.",
    ],
  },
  NP: {
    tier: "NP",
    purpose:
      "Support advanced diagnostic and management reasoning with structured sections that reduce cognitive overload.",
    maxSentenceWords: 32,
    maxParagraphWords: 90,
    maxOptionWords: 32,
    preferredRationaleSections: [
      "Why this is correct",
      "Differential or management reasoning",
      "Safety or contraindication cue",
      "Follow-up takeaway",
    ],
    requiredScannabilityCues: COMMON_SCANNABILITY_CUES,
    mobileGuidance: [
      "Separate diagnosis, management, contraindication, and follow-up teaching.",
      "Use bullets for differential or medication-safety comparisons.",
      "Keep advanced terminology but define the decision consequence.",
    ],
  },
  ALLIED: {
    tier: "ALLIED",
    purpose:
      "Keep profession-specific workflow teaching scannable across mobile study, rapid review, and varied allied-health terminology.",
    maxSentenceWords: 28,
    maxParagraphWords: 80,
    maxOptionWords: 28,
    preferredRationaleSections: [
      "Why this is correct",
      "Workflow or scope cue",
      "Safety implication",
      "Communication or documentation takeaway",
    ],
    requiredScannabilityCues: COMMON_SCANNABILITY_CUES,
    mobileGuidance: [
      "Use role-specific terms consistently.",
      "Separate safety checks, workflow decisions, and escalation cues.",
      "Avoid RN-only wording unless the allied role is explicitly communicating with nursing.",
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

function parseSections(value: unknown): Array<{ heading: string; body: string }> {
  return parseArrayish(value)
    .map((section) => {
      if (!section || typeof section !== "object") return null;
      const record = section as Record<string, unknown>;
      return {
        heading: text(String(record.heading ?? record.title ?? "")),
        body: text(String(record.body ?? record.content ?? "")),
      };
    })
    .filter((section): section is { heading: string; body: string } => Boolean(section?.heading || section?.body));
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

function sentences(value: string): string[] {
  return value
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function paragraphs(value: string): string[] {
  return value
    .split(/\n{2,}|\r{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function hasBulletStructure(value: string): boolean {
  return /(^|\n)\s*(-|\*|•|\d+\.)\s+\S/.test(value);
}

function hasSafetyCue(value: string): boolean {
  return /\b(safety|risk|harm|urgent|immediate|priority|deteriorat|unstable|airway|breathing|circulation|fall|bleeding|infection|hypoxia|shock)\b/i.test(value);
}

function inconsistentPatientTerminology(value: string): boolean {
  return /\bpatient\b/i.test(value) && /\bclient\b/i.test(value);
}

function addIssue(issues: EducationalReadabilityIssue[], issue: EducationalReadabilityIssue): void {
  issues.push(issue);
}

export function resolveEducationalReadabilityStandard(
  tier: HealthcareProgramTier,
): EducationalReadabilityStandard {
  return EDUCATIONAL_READABILITY_STANDARDS[tier];
}

export function evaluateEducationalReadability(
  input: EducationalReadabilityInput,
): EducationalReadabilityResult {
  const standard = resolveEducationalReadabilityStandard(input.tier);
  const stem = text(input.stem);
  const rationale = text(input.rationale);
  const clinicalReasoning = text(input.clinicalReasoning);
  const keyTeachingPoints = parseArrayish(input.keyTeachingPoints).map((point) => text(String(point))).filter(Boolean);
  const rationaleSections = parseSections(input.rationaleSections);
  const options = parseArrayish(input.options).map(optionText).filter(Boolean);
  const teachingText = [rationale, clinicalReasoning, ...rationaleSections.map((section) => section.body)].join("\n\n");
  const combined = [stem, teachingText, ...options, ...keyTeachingPoints].join(" ");
  const issues: EducationalReadabilityIssue[] = [];

  for (const paragraph of paragraphs(teachingText)) {
    if (wordCount(paragraph) > standard.maxParagraphWords) {
      addIssue(issues, {
        code: "DENSE_PARAGRAPH",
        severity: "error",
        message: "Teaching text contains a dense paragraph that is hard to scan.",
        remediation: "Split rationale content into short chunks with one teaching purpose per paragraph.",
      });
      break;
    }
  }

  for (const sentence of sentences(teachingText)) {
    if (wordCount(sentence) > standard.maxSentenceWords) {
      addIssue(issues, {
        code: "LONG_SENTENCE",
        severity: "warning",
        message: "Teaching text contains a long sentence that increases cognitive load.",
        remediation: "Break long explanations into shorter sentences with direct clinical cues.",
      });
      break;
    }
  }

  if (wordCount(teachingText) >= 90 && rationaleSections.length < 2) {
    addIssue(issues, {
      code: "RATIONALE_NOT_CHUNKED",
      severity: "error",
      message: "Long rationale content is not split into learner-friendly sections.",
      remediation: "Add rationale sections such as why correct, why tempting, safety cue, and takeaway.",
    });
  }

  if (wordCount(teachingText) >= 90 && !hasBulletStructure(teachingText) && keyTeachingPoints.length < 2) {
    addIssue(issues, {
      code: "MISSING_BULLETS_FOR_LONG_RATIONALE",
      severity: "warning",
      message: "Long rationale content lacks bullets or concise teaching points.",
      remediation: "Use bullets for multi-step reasoning, safety cues, and incorrect-option contrasts.",
    });
  }

  if (keyTeachingPoints.some((point) => wordCount(point) > 24)) {
    addIssue(issues, {
      code: "KEY_TEACHING_POINTS_NOT_SCANNABLE",
      severity: "warning",
      message: "A key teaching point is too long for rapid review.",
      remediation: "Keep each teaching point short, concrete, and focused on one cue or action.",
    });
  }

  if (hasSafetyCue(combined) && !hasBulletStructure(teachingText) && !rationaleSections.some((section) => /safety|priority|cue/i.test(section.heading))) {
    addIssue(issues, {
      code: "SAFETY_CUES_NOT_SCANNABLE",
      severity: "warning",
      message: "Important safety cues are present but not visually scannable.",
      remediation: "Surface safety cues in a heading, bullet, or short standalone teaching point.",
    });
  }

  if (options.some((option) => wordCount(option) > standard.maxOptionWords)) {
    addIssue(issues, {
      code: "OPTION_TOO_LONG_FOR_MOBILE",
      severity: "warning",
      message: "One or more answer options are too long for comfortable mobile scanning.",
      remediation: "Shorten options while preserving parallel meaning and clinical nuance.",
    });
  }

  if (inconsistentPatientTerminology(combined)) {
    addIssue(issues, {
      code: "INCONSISTENT_TERMINOLOGY",
      severity: "warning",
      message: "Content mixes patient/client terminology, which can add avoidable cognitive load.",
      remediation: "Use one learner-facing term consistently unless contrasting source language intentionally.",
    });
  }

  if (issues.filter((issue) => issue.severity === "warning").length >= 4) {
    addIssue(issues, {
      code: "EXCESSIVE_COGNITIVE_LOAD",
      severity: "error",
      message: "Multiple readability issues combine into excessive cognitive load.",
      remediation: "Shorten, chunk, bullet, and surface the key safety cue before publishing.",
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
