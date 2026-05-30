/**
 * Simulation Conversion Event Tracking
 *
 * Tracks learner interactions with the simulation platform for PostHog analytics.
 * Used to measure: simulation starts, completion rates, replay usage, clearance attempts,
 * readiness score improvements, and subscription conversion after simulation use.
 *
 * All events follow the existing PH (PostHog) event taxonomy.
 */

import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";

export type SimulationConversionEvent =
  | "simulation_started"
  | "simulation_completed"
  | "simulation_abandoned"
  | "simulation_replay_opened"
  | "clearance_page_viewed"
  | "clearance_earned"
  | "readiness_dashboard_viewed"
  | "simulation_center_viewed"
  | "simulation_remediation_clicked"
  | "simulation_upsell_clicked";

export interface SimulationEventProperties {
  conditionKey?: string;
  compositeScore?: number;
  harmColor?: "green" | "yellow" | "red";
  mode?: string;
  sessionId?: string;
  domain?: string;
  source?: string;
  tier?: string;
}

/**
 * Emit a simulation conversion event to PostHog.
 * Call from API routes or server components.
 */
export async function trackSimulationEvent(
  userId: string,
  event: SimulationConversionEvent,
  properties: SimulationEventProperties = {},
): Promise<void> {
  try {
    const distinctId = analyticsDistinctId(userId);
    await captureServerEvent(distinctId, `nn_simulation_${event}`, {
      ...properties,
      surface: "simulation",
      platform: "web",
    });
  } catch { /* Never throw — analytics errors must not affect learner experience */ }
}

/**
 * Client-side wrapper that calls the tracking API route.
 * Use from React components.
 */
export function trackSimulationEventClient(
  event: SimulationConversionEvent,
  properties: SimulationEventProperties = {},
): void {
  void fetch("/api/learner/simulation-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, properties }),
  }).catch(() => { /* silent */ });
}
