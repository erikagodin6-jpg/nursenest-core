/**
 * Governance observability — semantic violations, drift counters, readiness inconsistency signals.
 */
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type CognitionGovernanceViolation = {
  code:
    | "psychometric_copy"
    | "marketing_semantics"
    | "telemetry_semantic_drift"
    | "readiness_inconsistency"
    | "readiness_semantic_drift"
    | "recommendation_drift"
    | "ontology_conflict"
    | "remediation_duplication"
    | "measurement_interpretation"
    | "ai_semantic"
    | "cognition_namespace_conflict";
  surface: string;
  pathwayId: string | null;
  detail: string;
};

let violationCount = 0;
let aiCheckCount = 0;

export function getCognitionGovernanceViolationCount(): number {
  return violationCount;
}

export function resetCognitionGovernanceCounters(): void {
  violationCount = 0;
  aiCheckCount = 0;
}

export function logCognitionGovernanceViolation(v: CognitionGovernanceViolation): void {
  violationCount += 1;
  safeServerLog("educational_cognition", "governance_violation", {
    code: v.code,
    surface: v.surface,
    pathway_id: v.pathwayId ?? "unknown",
    detail: v.detail,
  });
}

export function recordAiSemanticCheck(surface: string): void {
  aiCheckCount += 1;
  safeServerLog("educational_cognition", "ai_semantic_check", { surface, total: aiCheckCount });
}

export function logReadinessInconsistency(
  pathwayId: string | null,
  detail: string,
): void {
  logCognitionGovernanceViolation({
    code: "readiness_inconsistency",
    surface: "readiness_merge",
    pathwayId,
    detail,
  });
}
