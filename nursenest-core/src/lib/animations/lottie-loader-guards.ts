/**
 * Performance and shape guards for Jitter / Bodymovin JSON used by {@link JitterBrandedLoaderLottie}.
 * Keep limits in sync with `lottie-loader-guards.test.ts`.
 */

export const LOTTIE_LOADER_JSON_WARN_BYTES = 100 * 1024;
export const LOTTIE_LOADER_JSON_MAX_BYTES = 200 * 1024;

const REDUCED_MOTION_MQ = "(prefers-reduced-motion: reduce)";

/** Sync read for gating network + parse (avoids a fetch window before `useReducedMotion` hydrates). */
export function syncPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_MQ).matches;
}

/**
 * Log when the asset is large; throw when it would hurt Lighthouse / main-thread parse.
 * Called in the browser after `arrayBuffer()` and in CI via the contract test.
 */
export function assertLottieLoaderJsonByteSize(byteLength: number): void {
  if (byteLength > LOTTIE_LOADER_JSON_WARN_BYTES) {
    console.warn(
      `[NurseNest] Jitter/Lottie loader JSON is ${byteLength} bytes (warn threshold ${LOTTIE_LOADER_JSON_WARN_BYTES}). ` +
        `Target < ${LOTTIE_LOADER_JSON_WARN_BYTES} when possible; hard max is ${LOTTIE_LOADER_JSON_MAX_BYTES}.`,
    );
  }
  if (byteLength > LOTTIE_LOADER_JSON_MAX_BYTES) {
    throw new Error(
      `Lottie loader JSON exceeds performance cap (${byteLength} > ${LOTTIE_LOADER_JSON_MAX_BYTES} bytes). ` +
        `Re-export from Jitter with fewer keys / merged shapes, or split motion.`,
    );
  }
}

/**
 * Minimal Bodymovin shape check so a random HTML/JSON error page does not reach `lottie-react`.
 */
export function assertLottieLoaderJsonShape(data: unknown): void {
  if (typeof data !== "object" || data === null) {
    throw new Error("Lottie loader JSON: expected an object root");
  }
  const o = data as Record<string, unknown>;
  if (typeof o.v !== "string" && typeof o.v !== "number") {
    throw new Error("Lottie loader JSON: missing or invalid `v` (schema version)");
  }
  if (typeof o.fr !== "number" || !Number.isFinite(o.fr)) {
    throw new Error("Lottie loader JSON: missing or invalid `fr` (frame rate)");
  }
  if (typeof o.op !== "number" || !Number.isFinite(o.op)) {
    throw new Error("Lottie loader JSON: missing or invalid `op` (out point)");
  }
  if (typeof o.ip !== "number" || !Number.isFinite(o.ip)) {
    throw new Error("Lottie loader JSON: missing or invalid `ip` (in point)");
  }
  if (typeof o.w !== "number" || typeof o.h !== "number") {
    throw new Error("Lottie loader JSON: missing `w` / `h` (composition size)");
  }
  if (!Array.isArray(o.layers) || o.layers.length < 1) {
    throw new Error("Lottie loader JSON: `layers` must be a non-empty array");
  }
}
