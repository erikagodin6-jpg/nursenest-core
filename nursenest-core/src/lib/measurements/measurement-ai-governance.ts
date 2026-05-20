/**
 * AI + tutoring governance V2 — hallucination and unsafe-equivalency guards.
 */
import { findMeasurementTokensV2 } from "@/lib/measurements/measurement-token-v2";
import { lintMeasurementTokensInText } from "@/lib/measurements/measurement-token-governance";
import { assessMeasurementSafety, isHighRiskMeasurementCategory } from "@/lib/measurements/measurement-safety-governance";
import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";

export type AiMeasurementGovernanceIssue = {
  code:
    | "unsafe_dual_equivalency"
    | "invented_conversion"
    | "high_risk_rewrite"
    | "invalid_token"
    | "pathway_mismatch_hint"
    | "unsupported_trend_claim";
  message: string;
  severity: "block" | "warn";
};

const UNSAFE_EQUIV_PATTERNS = [
  /\b(?:exactly|equal to|same as)\s+\d+(?:\.\d+)?\s*(?:mg\/dl|mmol\/l)\b/i,
  /\bconvert(?:ed)?\s+(?:insulin|heparin|vasopressor|norepinephrine)\b/i,
  /\b(?:always|never)\s+(?:use|display)\s+(?:si|conventional|us)\s+units\b/i,
];

const INVENTED_CONVERSION_PATTERNS = [
  /\b\d+(?:\.\d+)?\s*mg\/dl\s*=\s*\d+(?:\.\d+)?\s*mmol\/l\b/i,
  /\b\d+(?:\.\d+)?\s*mmhg\s*=\s*\d+(?:\.\d+)?\s*kpa\b/i,
];

export const measurementAiPromptGuardrail = `Measurement governance (mandatory):
- Preserve pathway instructional units; learner toggle changes display only, not authored clinical truth.
- Never invent numeric cross-system equivalencies for insulin, vasopressors, ABG panels, ventilator settings, or pediatric dosing.
- Prefer canonical tokens [[category:value:unit]] in examples; do not replace with free-text conversions.
- Trend claims must reference serial values, not single points.
- Escalation language must be educational ("per protocol") not prescriptive orders.`;

export function validateAiMeasurementCopy(text: string, context?: {
  pathwayId?: string | null;
  highRiskCategories?: MeasurementCategory[];
}): AiMeasurementGovernanceIssue[] {
  const issues: AiMeasurementGovernanceIssue[] = [];

  for (const err of lintMeasurementTokensInText(text)) {
    issues.push({
      code: "invalid_token",
      message: err.message,
      severity: "warn",
    });
  }

  for (const pattern of UNSAFE_EQUIV_PATTERNS) {
    if (pattern.test(text)) {
      issues.push({
        code: "unsafe_dual_equivalency",
        message: "AI copy asserts unsafe unit equivalency or medication conversion.",
        severity: "block",
      });
    }
  }

  for (const pattern of INVENTED_CONVERSION_PATTERNS) {
    if (pattern.test(text)) {
      issues.push({
        code: "invented_conversion",
        message: "AI copy contains unsourced conversion equalities.",
        severity: "block",
      });
    }
  }

  const highRisk = context?.highRiskCategories ?? [];
  for (const cat of highRisk) {
    if (isHighRiskMeasurementCategory(cat)) {
      const safety = assessMeasurementSafety({
        category: cat,
        authoredSystem: "si",
        renderedSystem: "conventional",
      });
      if (safety.tier === "blocked_conversion" && /\b(?:switch|toggle|convert)\b/i.test(text)) {
        issues.push({
          code: "high_risk_rewrite",
          message: `High-risk category ${cat} must not be rewritten by unit toggle in AI narrative.`,
          severity: "block",
        });
      }
    }
  }

  const tokens = findMeasurementTokensV2(text);
  if (tokens.length === 0 && /\b(?:trending|worsening|improving)\b/i.test(text) && /\b\d+(?:\.\d+)?/g.test(text)) {
    issues.push({
      code: "unsupported_trend_claim",
      message: "Trend language without governed measurement tokens — use serial token grammar.",
      severity: "warn",
    });
  }

  if (context?.pathwayId?.startsWith("ca-") && /\bmg\/dL\b/i.test(text) && !/\b(?:also|approx|≈)\b/i.test(text)) {
    issues.push({
      code: "pathway_mismatch_hint",
      message: "Canadian pathway instructional frame is SI-first — flag conventional-only tutoring.",
      severity: "warn",
    });
  }

  return issues;
}

export function assertAiMeasurementCopySafe(
  text: string,
  context?: Parameters<typeof validateAiMeasurementCopy>[1],
): void {
  const blocking = validateAiMeasurementCopy(text, context).filter((i) => i.severity === "block");
  if (blocking.length > 0) {
    throw new Error(
      `AI measurement governance blocked output: ${blocking.map((b) => b.message).join("; ")}`,
    );
  }
}
