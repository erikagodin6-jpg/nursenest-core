import "server-only";

/**
 * Busts Next.js `unstable_cache` entries on deploy when env-driven data changes (Stripe prices, etc.).
 * Not secret — only used inside cache key arrays.
 */
/**
 * Stable per-deploy segment for `unstable_cache` key arrays. Prefer explicit `BUILD_CACHE_VERSION`
 * (set at **build and runtime** to the same commit or release id on App Platform / Heroku) so Data Cache
 * keys rotate every deploy. `run-next-prod-build.mjs` seeds `BUILD_CACHE_VERSION` from git SHA when unset.
 * At runtime, if only `BUILD_ID` is present (Next standalone), that also rotates per build output.
 */
export function cacheDeploymentRevision(): string {
  const v =
    process.env.BUILD_CACHE_VERSION?.trim() ||
    process.env.BUILD_ID?.trim() ||
    process.env.VERCEL_DEPLOYMENT_ID?.trim() ||
    process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
    process.env.GITHUB_SHA?.trim() ||
    process.env.CI_COMMIT_SHA?.trim() ||
    process.env.CI_COMMIT_SHORT_SHA?.trim() ||
    process.env.SOURCE_VERSION?.trim() ||
    process.env.CACHE_REVISION?.trim() ||
    process.env.npm_package_version?.trim() ||
    "dev";
  return v.slice(0, 96);
}
