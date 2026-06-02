/**
 * Byte thresholds for API response / payload size — pure constants (no server-only deps).
 * Shared by perf logging and question limits so tests and isomorphic code can import safely.
 */

/** Log JSON API bodies estimated above this (UTF-8 bytes). */
export const LARGE_API_RESPONSE_BYTES = 500_000;

/** Earlier warning threshold (still below {@link LARGE_API_RESPONSE_BYTES}) for noisy routes. */
export const ALERT_API_PAYLOAD_BYTES = 250_000;
