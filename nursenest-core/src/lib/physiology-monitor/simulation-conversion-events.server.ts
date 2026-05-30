/**
 * Server-only simulation conversion event tracking (PostHog via posthog-node).
 * Import from API routes and Server Components only.
 */

import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";
import type {
  SimulationConversionEvent,
  SimulationEventProperties,
} from "./simulation-conversion-events.types";

export type { SimulationConversionEvent, SimulationEventProperties };

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
