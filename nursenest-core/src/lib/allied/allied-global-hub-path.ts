/**
 * Cycle-free URL helpers for the global Allied Health marketing hub.
 * Kept separate from `allied-global-pathway.ts` so `build-exam-pathway-path` can import without
 * pulling `exam-product-registry` (which depends on the pathway path builder).
 */

export const ALLIED_GLOBAL_HUB_PATH = "/allied/allied-health" as const;

export function buildAlliedGlobalHubPath(subpath?: string): string {
  if (!subpath) return ALLIED_GLOBAL_HUB_PATH;
  return `${ALLIED_GLOBAL_HUB_PATH}/${subpath.replace(/^\//, "")}`;
}

/**
 * When the request pathname is a legacy country-prefixed Allied Health marketing URL, returns the
 * matching global hub destination (301). Otherwise null.
 */
export function legacyCountryAlliedHealthMarketingRedirectDestination(pathname: string): string | null {
  const p = pathname.trim();
  const m = p.match(/^\/(?:us|canada)\/allied\/allied-health(?:\/(.*))?$/);
  if (!m) return null;
  const rest = (m[1] ?? "").trim();
  return rest ? buildAlliedGlobalHubPath(rest) : ALLIED_GLOBAL_HUB_PATH;
}
