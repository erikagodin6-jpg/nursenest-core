/**
 * Public vs private telemetry partitioning — cognition-safe serialization.
 */
import { governClientTelemetryCapture } from "@/lib/educational-cognition/client-telemetry-governance";

export type TelemetrySurface = "public_marketing" | "learner_authenticated" | "staff_admin";

const PUBLIC_FORBIDDEN_KEYS = new Set([
  "user_id",
  "userid",
  "email",
  "user_email",
  "learner_cognition_envelope",
  "remediation_path",
  "competency_state",
  "theta",
  "pass_probability",
  "cat_theta",
  "state_fingerprint",
]);

const PUBLIC_FORBIDDEN_PREFIXES = ["cat_", "adaptive_", "remediation_", "cognition_envelope"];

export type TelemetryIsolationResult = {
  allowed: boolean;
  strippedKeys: string[];
  normalizedEvent: string;
  violationCode: string | null;
};

export function partitionTelemetrySurface(routePath: string): TelemetrySurface {
  if (routePath.startsWith("/app") || routePath.startsWith("/modules")) {
    return "learner_authenticated";
  }
  if (routePath.startsWith("/admin")) return "staff_admin";
  return "public_marketing";
}

export function governTelemetryIsolation(args: {
  surface: TelemetrySurface;
  event: string;
  props?: Record<string, string | number | boolean | undefined>;
  pathwayId?: string | null;
}): TelemetryIsolationResult {
  const strippedKeys: string[] = [];
  const props = { ...(args.props ?? {}) };

  if (args.surface === "public_marketing") {
    for (const key of Object.keys(props)) {
      const lower = key.toLowerCase();
      if (
        PUBLIC_FORBIDDEN_KEYS.has(lower) ||
        PUBLIC_FORBIDDEN_PREFIXES.some((p) => lower.startsWith(p))
      ) {
        strippedKeys.push(key);
        delete props[key];
      }
    }
    if (/^cat_/i.test(args.event)) {
      return {
        allowed: false,
        strippedKeys,
        normalizedEvent: args.event.replace(/^cat_/i, "marketing_"),
        violationCode: "public_cat_namespace",
      };
    }
  }

  const clientGov = governClientTelemetryCapture({
    pathwayId: args.pathwayId ?? null,
    event: args.event,
    props,
  });

  return {
    allowed: clientGov.allowed,
    strippedKeys: [...strippedKeys, ...clientGov.strippedProps],
    normalizedEvent: clientGov.normalizedEvent,
    violationCode: clientGov.violationCode,
  };
}

/** Allowlisted keys for cognition orchestration analytics (no PII). */
export const COGNITION_TELEMETRY_ALLOWLIST = new Set([
  "pathway_id",
  "testing_model",
  "envelope_version",
  "hydration_version",
  "migration_path",
  "source_surface",
  "cognition_schema_version",
  "graph_version",
  "ontology_revision",
  "migration_path",
  "integrity_tier",
  "hydration_mode",
  "graph_step_count",
  "confidence_tier",
  "continuity_checkpoint_id",
  "educational_intent",
  "cognition_reliability_tier",
  "graph_authoritative",
  "ontology_namespace",
  "competency_id",
  "topic_slug",
]);

export function filterCognitionTelemetryProps(
  props: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;
    const lower = key.toLowerCase();
    if (COGNITION_TELEMETRY_ALLOWLIST.has(lower) || lower.startsWith("cognition_")) {
      out[key] = value;
    }
  }
  return out;
}

/** Final PostHog-safe payload — deny dangerous keys; pass orchestration metadata through. */
export function cognitionSafePostHogProps(
  props: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;
    const lower = key.toLowerCase();
    if (PUBLIC_FORBIDDEN_KEYS.has(lower)) continue;
    if (PUBLIC_FORBIDDEN_PREFIXES.some((p) => lower.startsWith(p))) continue;
    if (/theta|pass_probability|fingerprint|learner_cognition_envelope|competency_states/i.test(lower)) {
      continue;
    }
    out[key] = value;
  }
  return out;
}
