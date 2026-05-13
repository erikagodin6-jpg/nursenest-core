import { collectOsceScenariosMarketingHubUrls } from "@/lib/scenarios/scenario-marketing-sitemap-urls";
import { TOOL_SLUGS } from "@/lib/tools/tool-registry";

function normalizeOrigin(origin: string): string {
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

/**
 * Public marketing `/tools/{slug}` surfaces (labs values, medication math, electrolytes, IV, transfusion safety).
 * These routes live under the marketing shell and pass {@link isValidPublicUrl} (no query/hash).
 *
 * **Excluded by design:** gated learner workstations (`/app/labs`, `/app/med-calculations`, …) and `/modules/*`
 * shells that use `robots: { index: false }` or entitlement gates — not eligible for sitemap emission.
 */
export function collectClinicalMarketingToolTeaserUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return TOOL_SLUGS.map((slug) => `${o}/tools/${slug}`);
}

/**
 * Public ECG + telemetry specialty marketing pages.
 * All indexed, no entitlement gate — pure SEO/conversion surfaces.
 */
const ECG_MARKETING_PATHS = [
  "/ecg-interpretation",
  "/ecg-telemetry-mastery",
  "/advanced-ecg-nursing",
] as const;

/**
 * Clinical readiness marketing urlset: ECG marketing pages + OSCE + clinical-scenario pathway hubs + `/tools/*` teasers.
 * Used by `/sitemap-clinical-modules.xml` only — never emit learner `/app/*` or gated `/modules/*` shells here.
 */
export function collectClinicalModulesSitemapUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const ecgUrls = ECG_MARKETING_PATHS.map((path) => `${o}${path}`);
  return [...ecgUrls, ...collectClinicalMarketingToolTeaserUrls(origin), ...collectOsceScenariosMarketingHubUrls(origin)];
}
