/**
 * Coaching telemetry → governed graph lineage (retire parallel coaching-only graph events).
 */
import type { CoachingTelemetryEvent } from "@/lib/learner/rn-coaching-intelligence/coaching-telemetry";
import { graphLineageTelemetryProps, type GraphLineageEnvelope } from "@/lib/educational-graph/graph-lineage-envelope";

const GRAPH_AUTHORITATIVE_EVENTS = new Set<CoachingTelemetryEvent>([
  "coaching_report_generated",
  "remediation_cta_clicked",
  "remediation_path_opened",
  "dashboard_sequence_rendered",
  "study_plan_generated",
  "ai_tutoring_context_generated",
  "ai_tutor_envelope_built",
]);

export function mergeCoachingPropsWithGraphLineage(
  event: CoachingTelemetryEvent,
  props: Record<string, string | number | boolean | null>,
  lineage?: GraphLineageEnvelope | null,
): Record<string, string | number | boolean | null> {
  if (!GRAPH_AUTHORITATIVE_EVENTS.has(event) || !lineage) return props;
  const merged: Record<string, string | number | boolean | null> = { ...props };
  for (const [key, value] of Object.entries(graphLineageTelemetryProps(lineage))) {
    if (value !== undefined) merged[key] = value;
  }
  merged.graph_authoritative = true;
  return merged;
}

export function isGraphAuthoritativeCoachingEvent(event: CoachingTelemetryEvent): boolean {
  return GRAPH_AUTHORITATIVE_EVENTS.has(event);
}
