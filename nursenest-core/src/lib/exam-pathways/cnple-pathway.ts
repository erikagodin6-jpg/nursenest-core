/**
 * Central helpers for CNPLE pathway detection.
 *
 * Single source of truth for the ca-np-cnple pathway ID so any future
 * slug change only requires updating CNPLE_PATHWAY_ID here.
 */

export const CNPLE_PATHWAY_ID = "ca-np-cnple" as const;

/**
 * True when the pathway ID refers to the Canadian NP CNPLE exam track.
 * Handles null/undefined safely so callers don't need to guard first.
 */
export function isCnplePathway(pathwayId: string | null | undefined): boolean {
  return (pathwayId ?? "").trim() === CNPLE_PATHWAY_ID;
}
