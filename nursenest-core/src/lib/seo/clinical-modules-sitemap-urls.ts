import { collectOsceScenariosMarketingHubUrls } from "@/lib/scenarios/scenario-marketing-sitemap-urls";
import { TOOL_SLUGS } from "@/lib/tools/tool-registry";
import { getAllEcgClusterSlugs } from "@/lib/ecg-module/ecg-seo-cluster";
import {
  ECG_CORE_PUBLIC_ROUTES,
  ECG_ADVANCED_PUBLIC_ROUTES,
  ECG_LEARNER_PRIVATE_ROUTES,
  ADVANCED_ECG_LEARNER_PRIVATE_ROUTES,
  isLearnerPrivateEcgRoute,
} from "@/lib/ecg-module/ecg-platform-taxonomy";

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
 * SEGMENT A — Core ECG authority routes.
 * All publicly indexed, no entitlement gate, full educational content without auth.
 * Source of truth: ECG_CORE_PUBLIC_ROUTES from ecg-platform-taxonomy.ts.
 *
 * Includes: /ecg, /ecg-interpretation, /telemetry-nursing, /acls-rhythms,
 *           /pals-rhythms, /pediatric-ecg
 */
export function collectCoreEcgAuthorityUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return ECG_CORE_PUBLIC_ROUTES.map((path) => `${o}${path}`);
}

/**
 * SEGMENT B — Core ECG topical cluster pages (/ecg/[topic] × 10+).
 * Generated from the ECG SEO cluster definition.
 * All indexed, authority cluster supporting the /ecg pillar.
 */
export function collectEcgClusterUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return getAllEcgClusterSlugs().map((slug) => `${o}/ecg/${slug}`);
}

/**
 * SEGMENT C — Advanced ECG premium authority routes.
 * Indexed with premium positioning. Educational content public; premium CTA additive.
 * Source of truth: ECG_ADVANCED_PUBLIC_ROUTES from ecg-platform-taxonomy.ts.
 *
 * Includes: /advanced-ecg-nursing, /advanced-ecg-nursing/[9 modules],
 *           /ecg-telemetry-mastery
 */
export function collectAdvancedEcgAuthorityUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return ECG_ADVANCED_PUBLIC_ROUTES.map((path) => `${o}${path}`);
}

/**
 * Clinical specialty hub page — the top-level clinical modules discovery page.
 */
const CLINICAL_HUB_PATHS = ["/clinical-modules"] as const;

/**
 * Guard: ensures no learner-private ECG routes are accidentally added to the sitemap.
 * Throws during development if a private route is found.
 */
function assertNoPrivateEcgRoutes(urls: string[], origin: string): void {
  const o = normalizeOrigin(origin);
  for (const url of urls) {
    const path = url.startsWith(o) ? url.slice(o.length) : url;
    if (isLearnerPrivateEcgRoute(path)) {
      throw new Error(
        `[sitemap-guard] Attempted to add learner-private ECG route to sitemap: "${path}". ` +
        "Learner routes must have robots: { index: false } and must NOT appear in sitemaps.",
      );
    }
  }
}

/**
 * Clinical readiness marketing urlset — complete ECG authority hierarchy:
 *
 *   SEGMENT A: Core ECG public authority (/ecg, /ecg-interpretation, /telemetry-nursing, …)
 *   SEGMENT B: Core ECG cluster (/ecg/[topic] × 10+)
 *   SEGMENT C: Advanced ECG premium authority (/advanced-ecg-nursing/*, /ecg-telemetry-mastery)
 *   SEGMENT D: Clinical hub (/clinical-modules)
 *   SEGMENT E: OSCE + clinical scenario hubs
 *   SEGMENT F: Tools teasers (/tools/*)
 *
 * EXCLUDED — must never appear in this sitemap:
 *   /modules/ecg/* (learner-private, auth-gated, robots: noindex)
 *   /modules/ecg-advanced (learner-private)
 *   /app/* (learner application shell)
 *
 * Used by `/sitemap-clinical-modules.xml` only.
 */
export function collectClinicalModulesSitemapUrls(origin: string): string[] {
  const coreEcgUrls = collectCoreEcgAuthorityUrls(origin);
  const ecgClusterUrls = collectEcgClusterUrls(origin);
  const advancedEcgUrls = collectAdvancedEcgAuthorityUrls(origin);
  const clinicalHubUrls = CLINICAL_HUB_PATHS.map((path) => `${normalizeOrigin(origin)}${path}`);

  const all = [
    ...coreEcgUrls,
    ...ecgClusterUrls,
    ...advancedEcgUrls,
    ...clinicalHubUrls,
    ...collectClinicalMarketingToolTeaserUrls(origin),
    ...collectOsceScenariosMarketingHubUrls(origin),
  ];

  // Safety guard: fail loudly in development if a private route is accidentally included
  if (process.env.NODE_ENV === "development") {
    assertNoPrivateEcgRoutes(all, origin);
  }

  return all;
}

/**
 * Export all learner-private ECG routes for use by sitemap filters.
 * These routes must be explicitly excluded from any public sitemap.
 */
export const ECG_PRIVATE_ROUTES_FOR_SITEMAP_EXCLUSION = [
  ...ECG_LEARNER_PRIVATE_ROUTES,
  ...ADVANCED_ECG_LEARNER_PRIVATE_ROUTES,
] as const;
