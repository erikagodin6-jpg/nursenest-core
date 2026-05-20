/**
 * Telemetry governance — normalize analytics dimensions and block CAT events on LOFT pathways.
 */
import { safeServerLog, type SafeLogMeta } from "@/lib/observability/safe-server-log";
import { assertCatTelemetryAllowedForPathway } from "@/lib/testing/testing-engine-capabilities";
import {
  getTestingModelAnalyticsDimensions,
  type TestingModelAnalyticsDimensions,
} from "@/lib/testing/testing-model";

export type TestingModelTelemetryMeta = SafeLogMeta &
  Record<
    | "testing_model"
    | "simulation_family"
    | "psychometric_style"
    | "remediation_style"
    | "analytics_model"
    | "pathway_id",
    string
  >;

/** Flat analytics dimensions for PostHog / server logs (snake_case). */
export function testingModelTelemetryFields(
  pathwayId: string | null | undefined,
): TestingModelTelemetryMeta {
  const dims = getTestingModelAnalyticsDimensions(pathwayId);
  return {
    testing_model: dims.testingModel,
    simulation_family: dims.simulationFamily,
    psychometric_style: dims.psychometricStyle,
    remediation_style: dims.remediationStyle,
    analytics_model: dims.analyticsModel,
    pathway_id: dims.pathway,
  };
}

export function mergeTestingModelTelemetryMeta(
  pathwayId: string | null | undefined,
  meta?: SafeLogMeta,
): TestingModelTelemetryMeta {
  return { ...meta, ...testingModelTelemetryFields(pathwayId) };
}

/**
 * Server log with psychometric dimensions and LOFT/CAT telemetry isolation.
 * CAT-prefixed events on LOFT pathways throw before logging.
 */
export function logTestingModelScopedEvent(
  scope: string,
  event: string,
  pathwayId: string | null | undefined,
  meta?: SafeLogMeta,
): void {
  assertCatTelemetryAllowedForPathway(pathwayId, event);
  safeServerLog(scope, event, mergeTestingModelTelemetryMeta(pathwayId, meta));
}

/** PostHog-style flat payload from pathway id (case + practice surfaces). */
export function toTestingModelPostHogFields(
  pathwayId: string | null | undefined,
): Record<string, string> {
  const dims: TestingModelAnalyticsDimensions = getTestingModelAnalyticsDimensions(pathwayId);
  return {
    testing_model: dims.testingModel,
    simulation_family: dims.simulationFamily,
    psychometric_style: dims.psychometricStyle,
    remediation_style: dims.remediationStyle,
    analytics_model: dims.analyticsModel,
    pathway: dims.pathway,
    exam_model: dims.testingModel,
    simulation_type: dims.simulationFamily,
  };
}
