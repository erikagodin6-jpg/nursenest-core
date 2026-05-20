/**
 * Telemetry governance — normalize analytics dimensions and block CAT events on LOFT pathways.
 */
import { safeServerLog, type SafeLogMeta } from "@/lib/observability/safe-server-log";

let governanceViolationCount = 0;

/** Test/diagnostic hook — count of blocked telemetry emissions this process. */
export function getPsychometricTelemetryViolationCount(): number {
  return governanceViolationCount;
}

export function resetPsychometricTelemetryViolationCount(): void {
  governanceViolationCount = 0;
}

/** Logs a psychometric telemetry violation without throwing (production-safe). */
export function logPsychometricTelemetryViolation(
  pathwayId: string | null | undefined,
  eventName: string,
  detail: string,
): void {
  governanceViolationCount += 1;
  safeServerLog("psychometric_telemetry", "governance_violation", {
    pathway_id: pathwayId ?? "unknown",
    event: eventName,
    detail,
  });
}
import { assertCatTelemetryAllowedForPathway } from "@/lib/testing/testing-engine-capabilities";
import {
  getTestingModelDefinition,
  type AnalyticsModelKey,
  type PsychometricStyle,
  type RemediationStyle,
} from "@/lib/testing/testing-model-definitions";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import type { TestingModel } from "@/lib/testing/testing-model-types";

export type TestingModelAnalyticsDimensions = {
  testingModel: TestingModel;
  simulationFamily: string;
  psychometricStyle: PsychometricStyle;
  remediationStyle: RemediationStyle;
  analyticsModel: AnalyticsModelKey;
  pathway: string;
};

function resolveAnalyticsDimensions(
  pathwayId: string | null | undefined,
): TestingModelAnalyticsDimensions {
  const id = (pathwayId ?? "").trim() || "unknown";
  const model = getTestingModelForPathwayId(id);
  const def = getTestingModelDefinition(model);
  return {
    testingModel: model,
    simulationFamily: def.simulationFamily,
    psychometricStyle: def.psychometricStyle,
    remediationStyle: def.remediationStyle,
    analyticsModel: def.analyticsModel,
    pathway: id,
  };
}

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
  const dims = resolveAnalyticsDimensions(pathwayId);
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

/**
 * Guard PostHog capture for a pathway — blocks CAT-prefixed event names and property keys on LOFT pathways.
 */
export function assertPathwayPostHogCapture(
  pathwayId: string | null | undefined,
  eventName: string,
  properties?: Record<string, unknown>,
): void {
  assertCatTelemetryAllowedForPathway(pathwayId, eventName);
  if (!properties) return;
  for (const key of Object.keys(properties)) {
    assertCatTelemetryAllowedForPathway(pathwayId, key);
  }
}

/** PostHog-style flat payload from pathway id (case + practice surfaces). */
export function toTestingModelPostHogFields(
  pathwayId: string | null | undefined,
): Record<string, string> {
  const dims = resolveAnalyticsDimensions(pathwayId);
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
