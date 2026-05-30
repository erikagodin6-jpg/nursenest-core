/**
 * Simulation conversion events — server entry point.
 *
 * Client components must import from `./simulation-conversion-events.client`
 * to keep posthog-node (and node:fs) out of the browser bundle.
 */

export type {
  SimulationConversionEvent,
  SimulationEventProperties,
} from "./simulation-conversion-events.types";

export { trackSimulationEvent } from "./simulation-conversion-events.server";
