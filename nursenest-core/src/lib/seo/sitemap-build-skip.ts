/**
 * Build-time deployments should not require live DB connectivity just to emit a sitemap.
 * Skip DB-backed sitemap enrichment during `next build`; runtime requests can still include it.
 */
export function shouldSkipDbBackedSitemapUrlsForBuild(): boolean {
  const lifecycle = process.env.npm_lifecycle_event ?? "";
  if (lifecycle === "build") return true;
  const argv = Array.isArray(process.argv) ? process.argv.join(" ") : "";
  return argv.includes("next build");
}
