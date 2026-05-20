/**
 * Runtime psychometric isolation — LOFT pathways must never surface CAT semantics.
 */
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { getTestingModelForPathwayId, pathwayUsesLoftEngine } from "@/lib/testing/testing-model-pathway-map";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";

export type PsychometricCopyViolation = {
  pattern: string;
  message: string;
};

/** Product claims forbidden on LOFT surfaces (educational "not CAT" contrast is allowed). */
const LOFT_FORBIDDEN_PRODUCT_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /\badaptive\s+difficulty\b/i,
    message: "LOFT does not use adaptive difficulty framing.",
  },
  {
    pattern: /\bdifficulty\s+(?:increased|decreased|escalat(?:ed|ing)|adapt(?:ed|ing))\b/i,
    message: "LOFT uses stable blueprint pacing, not difficulty escalation language.",
  },
  {
    pattern: /\bexam\s+adapt(?:ed|ing|ation)\b/i,
    message: "LOFT exams do not adapt to performance mid-session.",
  },
  {
    pattern: /\b(?:ability|theta)\s+estimate\b/i,
    message: "LOFT readiness does not use CAT ability estimation.",
  },
  {
    pattern: /\bprecision\s+estimate\b/i,
    message: "LOFT readiness does not use CAT precision estimation.",
  },
  {
    pattern: /\bconfidence\s+threshold\b/i,
    message: "LOFT has no adaptive confidence-threshold shutdown.",
  },
  {
    pattern: /\bhigher[- ]difficulty\s+questions?\b/i,
    message: "LOFT does not target higher-difficulty items adaptively.",
  },
  {
    pattern: /\bcomputer(?:ized)?\s+adaptive\s+test(?:ing)?\b/i,
    message: "CNPLE/LOFT must not be framed as computerized adaptive testing.",
  },
  {
    pattern: /\b(?:cnple|canadian np).{0,60}\b(?:is|uses?)\s+(?:a\s+)?cat\b/i,
    message: "CNPLE must not be labelled as a CAT exam.",
  },
];

const NEGATION_PREFIX = /\b(?:not|never|no|instead of|rather than|unlike|vs\.?|versus)\s+/i;

function isEducationalContrast(matchIndex: number, text: string): boolean {
  const window = text.slice(Math.max(0, matchIndex - 48), matchIndex);
  return NEGATION_PREFIX.test(window);
}

export function validatePsychometricCopyForModel(
  model: TestingModel,
  text: string,
): PsychometricCopyViolation[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const violations: PsychometricCopyViolation[] = [];

  if (model !== "LOFT") return violations;

  for (const { pattern, message } of LOFT_FORBIDDEN_PRODUCT_PATTERNS) {
    const m = pattern.exec(trimmed);
    if (m && m.index != null && !isEducationalContrast(m.index, trimmed)) {
      violations.push({ pattern: pattern.source, message });
    }
    pattern.lastIndex = 0;
  }

  return violations;
}

export function validatePsychometricCopyForPathway(
  pathwayId: string | null | undefined,
  text: string,
): PsychometricCopyViolation[] {
  return validatePsychometricCopyForModel(getTestingModelForPathwayId(pathwayId), text);
}

/**
 * Hard guard for learner-facing copy on LOFT pathways. Throws when violations exist.
 */
export function assertNoCatLanguageForLoftPathway(
  pathwayId: string | null | undefined,
  text: string,
  context?: string,
): void {
  if (!pathwayUsesLoftEngine(pathwayId)) return;
  const violations = validatePsychometricCopyForPathway(pathwayId, text);
  if (violations.length === 0) return;
  const where = context ? ` (${context})` : "";
  throw new Error(
    `LOFT psychometric isolation${where}: ${violations.map((v) => v.message).join(" ")}`,
  );
}

/** Sanitize a string for display on a pathway — returns original or throws in strict mode. */
export function sanitizeLearnerCopyForPathway(
  pathwayId: string | null | undefined,
  text: string,
  fallback: string,
): string {
  const violations = validatePsychometricCopyForPathway(pathwayId, text);
  if (violations.length === 0) return text;
  return fallback;
}

export function loftDashboardPriorityThemes(): readonly string[] {
  const def = getTestingModelDefinition("LOFT");
  return [
    "readiness",
    "competency balance",
    "simulation completion",
    "domain preparedness",
    `remediation:${def.remediationStyle}`,
  ] as const;
}
