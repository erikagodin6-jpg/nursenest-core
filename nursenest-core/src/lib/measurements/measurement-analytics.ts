/**
 * Measurement preference analytics — regional study patterns without fragmenting canonical content.
 */
import type { ClinicalMeasurementSystem, MeasurementContext } from "@/lib/measurements/measurement-domain";

export type MeasurementAnalyticsEvent =
  | "measurement_preference_set"
  | "measurement_toggle_session"
  | "measurement_pathway_mismatch";

export type MeasurementAnalyticsPayload = {
  event: MeasurementAnalyticsEvent;
  pathwayId?: string | null;
  instructionalSystem: ClinicalMeasurementSystem;
  renderedSystem: ClinicalMeasurementSystem;
  measurementContext: MeasurementContext;
  surface?: string;
  /** True when learner chose a system different from pathway instructional default. */
  mismatchInstructional?: boolean;
};

export function buildMeasurementAnalyticsPayload(args: {
  event: MeasurementAnalyticsEvent;
  pathwayId?: string | null;
  instructionalSystem: ClinicalMeasurementSystem;
  renderedSystem: ClinicalMeasurementSystem;
  measurementContext: MeasurementContext;
  surface?: string;
}): MeasurementAnalyticsPayload {
  return {
    event: args.event,
    pathwayId: args.pathwayId ?? null,
    instructionalSystem: args.instructionalSystem,
    renderedSystem: args.renderedSystem,
    measurementContext: args.measurementContext,
    surface: args.surface,
    mismatchInstructional: args.instructionalSystem !== args.renderedSystem,
  };
}

/** Client-side capture (PostHog) — safe no-op on server. */
export async function trackMeasurementAnalytics(
  payload: MeasurementAnalyticsPayload,
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const { trackClientEvent } = await import("@/lib/observability/posthog-client");
    await trackClientEvent(payload.event, {
      pathway_id: payload.pathwayId ?? undefined,
      instructional_system: payload.instructionalSystem,
      rendered_system: payload.renderedSystem,
      measurement_context: payload.measurementContext,
      surface: payload.surface,
      mismatch_instructional: payload.mismatchInstructional ?? false,
    });
  } catch {
    /* optional telemetry */
  }
}
