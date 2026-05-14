import { collectOsceScenariosMarketingHubUrls } from "@/lib/scenarios/scenario-marketing-sitemap-urls";
import { TOOL_SLUGS } from "@/lib/tools/tool-registry";
import { getAllEcgClusterSlugs } from "@/lib/ecg-module/ecg-seo-cluster";

function normalizeOrigin(origin: string): string {
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

/**
 * Public marketing `/tools/{slug}` surfaces (lab values, medication math, electrolytes, IV, transfusion safety).
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
 * Never include gated `/modules/ecg/*` or `/app/*` routes here.
 */
const ECG_MARKETING_PATHS = [
  "/ecg-interpretation",
  "/ecg-telemetry-mastery",
  "/advanced-ecg-nursing",
] as const;

/**
 * ECG ecosystem sub-pages under `/advanced-ecg-nursing/[module]` — 9 specialty tracks.
 * All indexed marketing pages with no entitlement gate.
 */
const ECG_ECOSYSTEM_PATHS = [
  "/advanced-ecg-nursing/rhythm-practice",
  "/advanced-ecg-nursing/12-lead-stemi",
  "/advanced-ecg-nursing/acls-rhythms",
  "/advanced-ecg-nursing/electrolyte-ecg-changes",
  "/advanced-ecg-nursing/medication-induced-ecg-changes",
  "/advanced-ecg-nursing/critical-care-ecg",
  "/advanced-ecg-nursing/pediatric-ecg",
  "/advanced-ecg-nursing/telemetry-monitoring",
  "/advanced-ecg-nursing/ecg-case-simulations",
] as const;

/**
 * ECG topical cluster pages under `/ecg/[topic]` — 10 supporting authority pages.
 * Generated from the ECG SEO cluster definition in {@link getAllEcgClusterSlugs}.
 */
export function collectEcgClusterUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return getAllEcgClusterSlugs().map((slug) => `${o}/ecg/${slug}`);
}

/**
 * Clinical specialty hub page — the top-level clinical modules discovery page.
 */
const CLINICAL_HUB_PATHS = ["/clinical-modules"] as const;

/**
 * Clinical readiness marketing urlset:
 *   - ECG marketing pillar + satellite pages
 *   - ECG topical cluster (/ecg/[topic] × 10)
 *   - Clinical modules hub (/clinical-modules)
 *   - OSCE + clinical-scenario pathway hubs
 *   - Tools teasers (/tools/*)
 *
 * Used by `/sitemap-clinical-modules.xml` only.
 * Never emit learner `/app/*` or gated `/modules/ecg/*` shells here.
 */
export function collectClinicalModulesSitemapUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const ecgUrls = ECG_MARKETING_PATHS.map((path) => `${o}${path}`);
  const ecgEcosystemUrls = ECG_ECOSYSTEM_PATHS.map((path) => `${o}${path}`);
  const ecgClusterUrls = collectEcgClusterUrls(origin);
  const clinicalHubUrls = CLINICAL_HUB_PATHS.map((path) => `${o}${path}`);
  return [
    ...ecgUrls,
    ...ecgEcosystemUrls,
    ...ecgClusterUrls,
    ...clinicalHubUrls,
    ...collectClinicalMarketingToolTeaserUrls(origin),
    ...collectOsceScenariosMarketingHubUrls(origin),
  ];
}
