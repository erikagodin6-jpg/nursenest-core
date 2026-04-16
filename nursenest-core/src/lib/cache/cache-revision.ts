import "server-only";

/**
 * Busts Next.js `unstable_cache` entries on deploy when env-driven data changes (Stripe prices, etc.).
 * Not secret — only used inside cache key arrays.
 */
export function cacheDeploymentRevision(): string {
  const v =
    process.env.VERCEL_DEPLOYMENT_ID?.trim() ||
    process.env.CACHE_REVISION?.trim() ||
    process.env.npm_package_version?.trim() ||
    "dev";
  return v.slice(0, 96);
}
