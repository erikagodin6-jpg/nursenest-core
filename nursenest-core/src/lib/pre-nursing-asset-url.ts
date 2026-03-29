/**
 * Legacy SPA served marketing illustrations via `/api/assets/:filename`.
 * Pre-Nursing modules still reference those filenames — resolve against the public marketing origin unless overridden.
 */
const LEGACY_ASSETS_BASE =
  process.env.NEXT_PUBLIC_NURSENEST_LEGACY_ASSETS_BASE?.replace(/\/$/, "") ?? "https://www.nursenest.ca/api/assets";

export function preNursingAssetUrl(filename: string): string {
  return `${LEGACY_ASSETS_BASE}/${encodeURIComponent(filename)}`;
}
