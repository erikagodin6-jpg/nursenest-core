import { isProductionBuildInvocation } from "@/lib/build/build-safe-mode";

/**
 * Build-time deployments should not require live DB connectivity just to emit a sitemap.
 * Skip DB-backed sitemap enrichment during `next build`; runtime requests can still include it.
 */
export function shouldSkipDbBackedSitemapUrlsForBuild(): boolean {
  return isProductionBuildInvocation();
}
