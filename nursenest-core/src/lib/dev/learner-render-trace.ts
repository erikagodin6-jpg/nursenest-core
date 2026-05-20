/**
 * Dev/test-only UI markers for confirming which Next.js route + component tree rendered.
 * Never enable in production builds.
 */
export function shouldShowLearnerRenderTrace(): boolean {
  return process.env.NODE_ENV !== "production";
}
