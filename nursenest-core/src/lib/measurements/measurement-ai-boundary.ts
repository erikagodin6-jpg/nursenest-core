/**
 * Central AI generation boundary — guardrails + provenance for all measurement copy.
 */
import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";
import {
  measurementAiPromptGuardrail,
  validateAiMeasurementCopy,
  type AiMeasurementGovernanceIssue,
} from "@/lib/measurements/measurement-ai-governance";
import { lintMeasurementTokensInText } from "@/lib/measurements/measurement-token-governance";
import {
  buildMeasurementOrchestrationTelemetry,
  trackMeasurementOrchestrationEvent,
} from "@/lib/measurements/measurement-analytics";

export type AiGenerationSurface =
  | "ai_tutor"
  | "coaching"
  | "remediation_narrative"
  | "dashboard_summary"
  | "interpretation_explainer"
  | "study_plan"
  | "loft"
  | "loft_review";

export type GovernedAiCopyResult = {
  text: string;
  blocked: boolean;
  issues: AiMeasurementGovernanceIssue[];
  fallbackApplied: boolean;
};

const SAFE_FALLBACK =
  "Review serial lab trends using pathway instructional units and your remediation plan — avoid unsourced unit conversions.";

export function enforceGovernedAiMeasurementCopy(args: {
  text: string;
  surface: AiGenerationSurface;
  pathwayId?: string | null;
  highRiskCategories?: MeasurementCategory[];
  /** When true, return safe fallback instead of original on block. */
  applyFallback?: boolean;
}): GovernedAiCopyResult {
  const issues = validateAiMeasurementCopy(args.text, {
    pathwayId: args.pathwayId,
    highRiskCategories: args.highRiskCategories,
  });
  const blocking = issues.filter((i) => i.severity === "block");
  const blocked = blocking.length > 0;
  const tokenErrors = lintMeasurementTokensInText(args.text);

  if (blocked) {
    void trackMeasurementOrchestrationEvent(
      buildMeasurementOrchestrationTelemetry({
        event: "ai_measurement_guardrail_blocked",
        surface: args.surface,
        pathwayId: args.pathwayId,
        governanceIssueCode: blocking[0]?.code,
      }),
    );
  }

  const applyFallback = args.applyFallback !== false;
  return {
    text: blocked && applyFallback ? SAFE_FALLBACK : args.text,
    blocked,
    issues: [...issues, ...tokenErrors.map((e) => ({
      code: "invalid_token" as const,
      message: e.message,
      severity: "warn" as const,
    }))],
    fallbackApplied: blocked && applyFallback,
  };
}

export function aiPromptWithMeasurementGuardrails(basePrompt: string): string {
  return `${basePrompt.trim()}\n\n${measurementAiPromptGuardrail}`;
}
