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
 * Clinical readiness marketing urlset: OSCE + clinical-scenario pathway hubs (feature-flagged) + `/tools/*` teasers.
 * Used by `/sitemap-clinical-modules.xml` only — never emit learner `/app/*` or hidden mastery-module shells here.
 */
export function collectClinicalModulesSitemapUrls(origin: string): string[] {
  return [...collectClinicalMarketingToolTeaserUrls(origin), ...collectOsceScenariosMarketingHubUrls(origin)];
}
