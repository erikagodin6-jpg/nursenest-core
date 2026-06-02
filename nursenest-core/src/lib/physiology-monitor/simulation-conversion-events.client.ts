/**
 * Client-safe simulation conversion event tracking.
 * Posts to /api/learner/simulation-events — never imports server-only analytics.
 */

import type {
  SimulationConversionEvent,
  SimulationEventProperties,
} from "./simulation-conversion-events.types";

export type { SimulationConversionEvent, SimulationEventProperties };

/**
 * Client-side wrapper that calls the tracking API route.
 * Use from React components marked "use client".
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
