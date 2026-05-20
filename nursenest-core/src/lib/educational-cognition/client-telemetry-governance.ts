"use client";

/**
 * Client-side telemetry governance — blocks psychometric namespace leakage on LOFT pathways.
 */
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { trackClientEvent } from "@/lib/observability/posthog-client";

const FORBIDDEN_LOFT_PROP_KEYS = new Set([
  "theta",
  "precision",
  "pass_outlook",
  "pass_probability",
  "adaptive_progression",
  "cat_theta",
  "cat_precision",
]);

const FORBIDDEN_LOFT_PROP_PREFIXES = ["cat_", "adaptive_"];

export type ClientTelemetryGovernanceResult = {
  allowed: boolean;
  normalizedEvent: string;
  strippedProps: string[];
  violationCode: string | null;
};

export function resolveClientTestingModel(
  pathwayId: string | null | undefined,
  sessionKind?: string | null,
): TestingModel {
  if (sessionKind === "loft_simulation") return "LOFT";
  if (sessionKind === "cat") return "CAT";
  return getTestingModelForPathwayId(pathwayId);
}

export function governClientTelemetryCapture(args: {
  pathwayId: string | null | undefined;
  event: string;
  props?: Record<string, string | number | boolean | undefined>;
  /** When false, `cat_*` debug-style names are still blocked on LOFT even if the runner uses CAT shell chrome. */
  catSessionActive?: boolean;
  sessionKind?: string | null;
}): ClientTelemetryGovernanceResult {
  const model = resolveClientTestingModel(args.pathwayId, args.sessionKind);
  let normalizedEvent = args.event.trim();
  const strippedProps: string[] = [];
  const props = { ...(args.props ?? {}) };

  if (model === "LOFT") {
    if (/^cat_/i.test(normalizedEvent) && !args.catSessionActive) {
      normalizedEvent = normalizedEvent.replace(/^cat_/i, "practice_session_");
    }
    if (/^adaptive_/i.test(normalizedEvent)) {
      normalizedEvent = normalizedEvent.replace(/^adaptive_/i, "practice_session_");
    }
    for (const key of Object.keys(props)) {
      const lower = key.toLowerCase();
      if (
        FORBIDDEN_LOFT_PROP_KEYS.has(lower) ||
        FORBIDDEN_LOFT_PROP_PREFIXES.some((p) => lower.startsWith(p))
      ) {
        strippedProps.push(key);
        delete props[key];
      }
    }
  }

  const violationCode =
    model === "LOFT" && (/^cat_/i.test(args.event) || strippedProps.length > 0) && !args.catSessionActive
      ? "loft_psychometric_leakage"
      : null;

  return {
    allowed: violationCode === null || strippedProps.length > 0,
    normalizedEvent,
    strippedProps,
    violationCode,
  };
}

/** Governed client PostHog capture for practice and study-loop surfaces. */
export async function captureClientOrchestratedAnalytics(
  pathwayId: string | null | undefined,
  event: string,
  props?: Record<string, string | number | boolean | undefined>,
  options?: { catSessionActive?: boolean; sessionKind?: string | null },
): Promise<ClientTelemetryGovernanceResult> {
  const governed = governClientTelemetryCapture({
    pathwayId,
    event,
    props,
    catSessionActive: options?.catSessionActive,
    sessionKind: options?.sessionKind,
  });
  if (!governed.allowed && governed.violationCode) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[client-telemetry-governance] blocked", governed.violationCode, event);
    }
    return governed;
  }
  await trackClientEvent(governed.normalizedEvent, {
    ...props,
    testing_model: resolveClientTestingModel(pathwayId, options?.sessionKind),
    source_surface: props?.source_surface ?? "practice_runner",
  });
  return governed;
}
