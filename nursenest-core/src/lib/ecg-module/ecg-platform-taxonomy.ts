/**
 * ECG Platform Taxonomy — Canonical Multi-Tier Clinical Education Architecture
 *
 * This file is the authoritative source of truth for the ECG/Telemetry/Hemodynamics
 * product hierarchy. It defines:
 *
 *   1. Core ECG — included with RN/NP base subscriptions
 *   2. Advanced ECG — premium add-on (specialty telemetry)
 *   3. Future Hemodynamics Lane — reserved taxonomy for ICU/hemodynamic expansion
 *
 * Governance principles:
 *   A. Core ECG authority pages MUST be publicly indexable without auth.
 *      They must never redirect to login, return soft-403 states, or block crawlers.
 *   B. Advanced ECG is premium but MUST remain educationally authoritative and indexable.
 *      Premium gating occurs only at drills, adaptive testing, and mastery tracking.
 *   C. Learner auth state MUST NOT change public ECG page rendering.
 *   D. Hemodynamics routes are RESERVED and must not conflict with existing paths.
 *
 * SEO safety rules (enforced by ecg-platform-architecture.contract.test.ts):
 *   - ECG_CORE_PUBLIC_ROUTES → must have robots: { index: true }
 *   - ECG_ADVANCED_PUBLIC_ROUTES → must have robots: { index: true }
 *   - ECG_LEARNER_PRIVATE_ROUTES → must have robots: { index: false }
 *   - No public ECG route produces a redirect to /login
 */

// ─── Platform tier definitions ─────────────────────────────────────────────────

export type EcgPlatformTier =
  | "core_ecg"          // Included with RN/NP base subscription
  | "advanced_ecg"      // Premium add-on
  | "pediatric_ecg"     // Included with RN/NP, pediatric lane within Core
  | "hemodynamics"      // Future: Hemodynamic Monitoring (reserved)
  | "advanced_hemodynamics"  // Future: Advanced Hemodynamics (reserved)
  | "critical_care_monitoring"; // Future: ICU/CCU Monitoring (reserved)

export type EcgSeoIndexability =
  | "indexed_public"       // Full crawl, index, follow — must render without auth
  | "indexed_premium"      // Indexed but premium-gated CTA; educational content public
  | "noindex_learner"      // Private learner routes: /modules/* /app/*
  | "reserved_future";     // Placeholder for future routes — not yet published

export type EcgRouteCategory =
  | "authority_hub"        // Top-level canonical landing (/ecg, /advanced-ecg-nursing)
  | "authority_cluster"    // Supporting cluster pages (/ecg/[topic])
  | "specialty_module"     // Specialty topic modules (/advanced-ecg-nursing/[module])
  | "learner_module"       // Protected learner module (/modules/ecg/*)
  | "marketing_conversion" // Premium conversion pages
  | "reserved";            // Future expansion

// ─── Core ECG product definition ──────────────────────────────────────────────

/**
 * Core ECG — Included with RN/NP subscriptions.
 *
 * Focus: rhythm recognition, ECG basics, intervals, AV blocks, ACLS/PALS foundations,
 * telemetry fundamentals, beginner/intermediate interpretation, pediatric ECG basics,
 * respiratory sinus arrhythmia, strip drills, nursing-focused interpretation.
 *
 * Branding: "ECG Interpretation for Nurses"
 */
export const CORE_ECG_PRODUCT = {
  id: "core_ecg",
  name: "ECG Interpretation for Nurses",
  tagline: "Rhythm recognition, strip interpretation, and clinical telemetry fundamentals",
  tier: "core_ecg" as EcgPlatformTier,
  entitlementKey: "ecg_mastery_paid",
  eligibleTiers: ["RN", "NP"] as const,
  excludedTiers: ["RPN", "PN", "LVN_LPN"] as const,
} as const;

/**
 * Public authority routes for Core ECG.
 * MUST remain fully indexable without auth.
 * MUST render educational content without login.
 */
export const ECG_CORE_PUBLIC_ROUTES = [
  "/ecg",
  "/ecg-interpretation",
  "/telemetry-nursing",
  "/acls-rhythms",
  "/pals-rhythms",
  "/pediatric-ecg",
] as const satisfies readonly string[];

/**
 * Core ECG cluster topic routes (generated from ECG_CLUSTER_TOPICS slugs).
 * Pattern: /ecg/[slug] — all indexed, all must render without auth.
 */
export const ECG_CORE_CLUSTER_ROUTE_PATTERN = "/ecg/[topic]" as const;

/**
 * Private learner routes for Core ECG — noindex, auth-gated.
 * These must NEVER appear in sitemaps or be indexed.
 */
export const ECG_LEARNER_PRIVATE_ROUTES = [
  "/modules/ecg",
  "/modules/ecg/basic",
  "/modules/ecg/basic/lessons",
  "/modules/ecg/basic/quizzes",
  "/modules/ecg/basic/worksheets",
  "/modules/ecg/advanced",
  "/modules/ecg/advanced/lessons",
  "/modules/ecg/advanced/video-drills",
  "/modules/ecg/advanced/scenarios",
  "/modules/ecg/advanced/worksheets",
  "/modules/ecg/pediatric",
  "/modules/ecg/pediatric/cases",
] as const satisfies readonly string[];

// ─── Advanced ECG product definition ──────────────────────────────────────────

/**
 * Advanced ECG — Premium add-on / specialty telemetry pathway.
 *
 * Focus: STEMI localization, ischemia patterns, electrolyte ECG changes,
 * ICU telemetry, advanced differentials, pacemakers, vector analysis,
 * post-op telemetry, congenital telemetry, hemodynamic correlation,
 * telemetry alarm management, advanced case simulations, waveform analysis.
 *
 * Branding: "Advanced Telemetry & Critical Care ECG"
 *
 * SEO principle: Advanced ECG pages must feel premium WITHOUT hiding educational
 * authority content. Conversion CTAs are additive, not gating.
 */
export const ADVANCED_ECG_PRODUCT = {
  id: "advanced_ecg",
  name: "Advanced Telemetry & Critical Care ECG",
  tagline: "STEMI localization, ICU telemetry, electrolyte patterns, and critical care ECG",
  tier: "advanced_ecg" as EcgPlatformTier,
  entitlementKey: "module_advanced_ecg",
  eligibleTiers: ["RN", "NP"] as const,
  excludedTiers: ["RPN", "PN", "LVN_LPN"] as const,
  stripeEnvKey: "STRIPE_PRICE_ADVANCED_ECG",
} as const;

/**
 * Public authority routes for Advanced ECG.
 * Indexed, educational content publicly visible — premium CTA additive.
 * Must NOT redirect to auth pages. Must NOT show thin/teaser content.
 */
export const ECG_ADVANCED_PUBLIC_ROUTES = [
  "/advanced-ecg-nursing",
  "/advanced-ecg-nursing/rhythm-practice",
  "/advanced-ecg-nursing/12-lead-stemi",
  "/advanced-ecg-nursing/acls-rhythms",
  "/advanced-ecg-nursing/electrolyte-ecg-changes",
  "/advanced-ecg-nursing/medication-induced-ecg-changes",
  "/advanced-ecg-nursing/critical-care-ecg",
  "/advanced-ecg-nursing/pediatric-ecg",
  "/advanced-ecg-nursing/telemetry-monitoring",
  "/advanced-ecg-nursing/ecg-case-simulations",
  "/ecg-telemetry-mastery",
] as const satisfies readonly string[];

/**
 * Advanced ECG learner module routes — noindex, premium-gated.
 */
export const ADVANCED_ECG_LEARNER_PRIVATE_ROUTES = [
  "/modules/ecg-advanced",
] as const satisfies readonly string[];

// ─── Hemodynamics Monitoring — Fundamentals (included with RN/NP) ──────────────

export const HEMODYNAMICS_FUNDAMENTALS_PRODUCT = {
  id: "hemodynamics_fundamentals",
  name: "Hemodynamic Monitoring Fundamentals",
  tagline: "Perfusion, preload, afterload, MAP, arterial lines, CVP, cardiac output, shock states",
  tier: "hemodynamics" as EcgPlatformTier,
  entitlementKey: "hemodynamics_fundamentals",
  eligibleTiers: ["RN", "NP"] as const,
  excludedTiers: ["RPN", "PN", "LVN_LPN"] as const,
} as const;

export const HEMODYNAMICS_PUBLIC_ROUTES = [
  "/hemodynamic-monitoring",
  "/hemodynamics-monitoring",
  "/shock-and-perfusion",
  "/arterial-line-interpretation",
  "/cardiac-output-monitoring",
] as const satisfies readonly string[];

export const HEMODYNAMICS_LEARNER_PRIVATE_ROUTES = [
  "/modules/hemodynamics",
] as const satisfies readonly string[];

// ─── Advanced Hemodynamic Monitoring — Paid Add-On ────────────────────────────

export const ADVANCED_HEMODYNAMICS_PRODUCT = {
  id: "advanced_hemodynamics",
  name: "Advanced Hemodynamic Monitoring",
  tagline: "Swan-Ganz, cardiac index, SVR, SVV, PAOP, SvO2, ICU case simulations",
  tier: "advanced_hemodynamics" as EcgPlatformTier,
  entitlementKey: "advanced_hemodynamics_paid",
  eligibleTiers: ["RN", "NP"] as const,
  excludedTiers: ["RPN", "PN", "LVN_LPN"] as const,
  stripeEnvKey: "STRIPE_PRICE_ADVANCED_HEMODYNAMICS",
  billing: "one_time" as const,
} as const;

export const CRITICAL_CARE_BUNDLE_PRODUCT = {
  id: "critical_care_bundle",
  name: "Critical Care Bundle",
  tagline: "Advanced ECG + Advanced Hemodynamic Monitoring — complete ICU/CCU clinical readiness",
  tier: "critical_care_monitoring" as EcgPlatformTier,
  entitlementKey: "critical_care_bundle_paid",
  eligibleTiers: ["RN", "NP"] as const,
  excludedTiers: ["RPN", "PN", "LVN_LPN"] as const,
  stripeEnvKey: "STRIPE_PRICE_CRITICAL_CARE_BUNDLE",
  billing: "one_time" as const,
  includes: ["module_advanced_ecg", "advanced_hemodynamics_paid"] as const,
} as const;

export const ADVANCED_HEMODYNAMICS_PUBLIC_ROUTES = [
  "/advanced-hemodynamic-monitoring",
  "/pulmonary-artery-catheter",
  "/critical-care-bundle",
] as const satisfies readonly string[];

export const ADVANCED_HEMODYNAMICS_LEARNER_PRIVATE_ROUTES = [
  "/modules/hemodynamics-advanced",
] as const satisfies readonly string[];

// ─── SEO authority hierarchy ────────────────────────────────────────────────────

/**
 * The complete SEO authority hierarchy for the ECG ecosystem.
 *
 * Hierarchy:
 *   /ecg                        ← Core ECG pillar (authority hub)
 *   ├── /ecg-interpretation     ← Core ECG secondary hub
 *   ├── /ecg/[topic]            ← Core ECG cluster (10+ topics)
 *   ├── /telemetry-nursing      ← Core ECG specialty authority
 *   ├── /acls-rhythms           ← ACLS rhythms authority
 *   ├── /pals-rhythms           ← PALS rhythms authority
 *   ├── /pediatric-ecg          ← Pediatric ECG standalone
 *   └── /advanced-ecg           ← Advanced ECG conversion anchor
 *
 *   /advanced-ecg-nursing       ← Advanced ECG pillar
 *   ├── /advanced-ecg-nursing/rhythm-practice
 *   ├── /advanced-ecg-nursing/12-lead-stemi
 *   ├── /advanced-ecg-nursing/acls-rhythms
 *   ├── /advanced-ecg-nursing/electrolyte-ecg-changes
 *   ├── /advanced-ecg-nursing/medication-induced-ecg-changes
 *   ├── /advanced-ecg-nursing/critical-care-ecg
 *   ├── /advanced-ecg-nursing/pediatric-ecg
 *   ├── /advanced-ecg-nursing/telemetry-monitoring
 *   └── /advanced-ecg-nursing/ecg-case-simulations
 */
export type EcgSeoAuthorityRoute = {
  path: string;
  indexability: EcgSeoIndexability;
  tier: EcgPlatformTier;
  category: EcgRouteCategory;
  /**
   * Canonical path — if a route has a canonical it points elsewhere,
   * the route itself must not compete with its canonical.
   */
  canonicalPath?: string;
  /** Schema.org type(s) for structured data on this page. */
  schemaTypes: ReadonlyArray<string>;
  /** Priority weight for sitemap (0.0–1.0). */
  sitemapPriority: number;
  /** Internal linking role — who links TO this page. */
  linkingRole: "pillar" | "cluster_member" | "specialty_hub" | "conversion" | "learner";
};

export const ECG_SEO_AUTHORITY_ROUTES: ReadonlyArray<EcgSeoAuthorityRoute> = [
  // ── Core ECG pillar ────────────────────────────────────────────────────────
  {
    path: "/ecg",
    indexability: "indexed_public",
    tier: "core_ecg",
    category: "authority_hub",
    schemaTypes: ["WebPage", "Course", "FAQPage"],
    sitemapPriority: 0.9,
    linkingRole: "pillar",
  },
  {
    path: "/ecg-interpretation",
    indexability: "indexed_public",
    tier: "core_ecg",
    category: "authority_hub",
    schemaTypes: ["WebPage", "Course", "FAQPage"],
    sitemapPriority: 0.85,
    linkingRole: "pillar",
  },
  {
    path: "/ecg/[topic]",
    indexability: "indexed_public",
    tier: "core_ecg",
    category: "authority_cluster",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.75,
    linkingRole: "cluster_member",
  },
  {
    path: "/telemetry-nursing",
    indexability: "indexed_public",
    tier: "core_ecg",
    category: "specialty_module",
    schemaTypes: ["WebPage", "Course"],
    sitemapPriority: 0.80,
    linkingRole: "specialty_hub",
  },
  {
    path: "/acls-rhythms",
    indexability: "indexed_public",
    tier: "core_ecg",
    category: "specialty_module",
    schemaTypes: ["WebPage", "Course", "FAQPage"],
    sitemapPriority: 0.80,
    linkingRole: "specialty_hub",
  },
  {
    path: "/pals-rhythms",
    indexability: "indexed_public",
    tier: "pediatric_ecg",
    category: "specialty_module",
    schemaTypes: ["WebPage", "Course"],
    sitemapPriority: 0.75,
    linkingRole: "specialty_hub",
  },
  {
    path: "/pediatric-ecg",
    indexability: "indexed_public",
    tier: "pediatric_ecg",
    category: "authority_hub",
    schemaTypes: ["WebPage", "Course", "FAQPage"],
    sitemapPriority: 0.80,
    linkingRole: "pillar",
  },
  // ── Advanced ECG pillar ────────────────────────────────────────────────────
  {
    path: "/advanced-ecg-nursing",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "authority_hub",
    schemaTypes: ["WebPage", "Course", "FAQPage"],
    sitemapPriority: 0.90,
    linkingRole: "pillar",
  },
  {
    path: "/advanced-ecg-nursing/rhythm-practice",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "specialty_module",
    schemaTypes: ["Article", "Course"],
    sitemapPriority: 0.75,
    linkingRole: "cluster_member",
  },
  {
    path: "/advanced-ecg-nursing/12-lead-stemi",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "specialty_module",
    schemaTypes: ["Article", "Course", "FAQPage"],
    sitemapPriority: 0.80,
    linkingRole: "cluster_member",
  },
  {
    path: "/advanced-ecg-nursing/acls-rhythms",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "specialty_module",
    schemaTypes: ["Article", "Course"],
    sitemapPriority: 0.75,
    linkingRole: "cluster_member",
  },
  {
    path: "/advanced-ecg-nursing/electrolyte-ecg-changes",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "specialty_module",
    schemaTypes: ["Article", "Course"],
    sitemapPriority: 0.75,
    linkingRole: "cluster_member",
  },
  {
    path: "/advanced-ecg-nursing/medication-induced-ecg-changes",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "specialty_module",
    schemaTypes: ["Article", "Course"],
    sitemapPriority: 0.75,
    linkingRole: "cluster_member",
  },
  {
    path: "/advanced-ecg-nursing/critical-care-ecg",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "specialty_module",
    schemaTypes: ["Article", "Course"],
    sitemapPriority: 0.75,
    linkingRole: "cluster_member",
  },
  {
    path: "/advanced-ecg-nursing/pediatric-ecg",
    indexability: "indexed_premium",
    tier: "pediatric_ecg",
    category: "specialty_module",
    schemaTypes: ["Article", "Course"],
    sitemapPriority: 0.75,
    linkingRole: "cluster_member",
  },
  {
    path: "/advanced-ecg-nursing/telemetry-monitoring",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "specialty_module",
    schemaTypes: ["Article", "Course"],
    sitemapPriority: 0.75,
    linkingRole: "cluster_member",
  },
  {
    path: "/advanced-ecg-nursing/ecg-case-simulations",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "specialty_module",
    schemaTypes: ["Article", "Course"],
    sitemapPriority: 0.75,
    linkingRole: "cluster_member",
  },
  {
    path: "/ecg-telemetry-mastery",
    indexability: "indexed_premium",
    tier: "advanced_ecg",
    category: "marketing_conversion",
    schemaTypes: ["WebPage"],
    sitemapPriority: 0.70,
    linkingRole: "conversion",
  },
  // ── Protected learner routes ───────────────────────────────────────────────
  ...ECG_LEARNER_PRIVATE_ROUTES.map((path): EcgSeoAuthorityRoute => ({
    path,
    indexability: "noindex_learner",
    tier: "core_ecg",
    category: "learner_module",
    schemaTypes: [],
    sitemapPriority: 0.0,
    linkingRole: "learner",
  })),
  ...ADVANCED_ECG_LEARNER_PRIVATE_ROUTES.map((path): EcgSeoAuthorityRoute => ({
    path,
    indexability: "noindex_learner",
    tier: "advanced_ecg",
    category: "learner_module",
    schemaTypes: [],
    sitemapPriority: 0.0,
    linkingRole: "learner",
  })),
  // ── Hemodynamics Fundamentals (public, included with RN/NP) ─────────────────
  ...HEMODYNAMICS_PUBLIC_ROUTES.map((path): EcgSeoAuthorityRoute => ({
    path,
    indexability: "indexed_public",
    tier: "hemodynamics",
    category: path === "/hemodynamic-monitoring" ? "authority_hub" : "specialty_module",
    schemaTypes: ["WebPage", "Course", "FAQPage"],
    sitemapPriority: path === "/hemodynamic-monitoring" ? 0.85 : 0.75,
    linkingRole: path === "/hemodynamic-monitoring" ? "pillar" : "cluster_member",
  })),
  ...HEMODYNAMICS_LEARNER_PRIVATE_ROUTES.map((path): EcgSeoAuthorityRoute => ({
    path,
    indexability: "noindex_learner",
    tier: "hemodynamics",
    category: "learner_module",
    schemaTypes: [],
    sitemapPriority: 0.0,
    linkingRole: "learner",
  })),
  // ── Advanced Hemodynamics (premium add-on) ───────────────────────────────────
  ...ADVANCED_HEMODYNAMICS_PUBLIC_ROUTES.map((path): EcgSeoAuthorityRoute => ({
    path,
    indexability: "indexed_premium",
    tier: "advanced_hemodynamics",
    category: path === "/advanced-hemodynamic-monitoring" ? "authority_hub" : "specialty_module",
    schemaTypes: ["WebPage", "Course", "FAQPage"],
    sitemapPriority: path === "/advanced-hemodynamic-monitoring" ? 0.85 : 0.75,
    linkingRole: path === "/advanced-hemodynamic-monitoring" ? "pillar" : "cluster_member",
  })),
  ...ADVANCED_HEMODYNAMICS_LEARNER_PRIVATE_ROUTES.map((path): EcgSeoAuthorityRoute => ({
    path,
    indexability: "noindex_learner",
    tier: "advanced_hemodynamics",
    category: "learner_module",
    schemaTypes: [],
    sitemapPriority: 0.0,
    linkingRole: "learner",
  })),
];

// ─── Entitlement boundary map ───────────────────────────────────────────────────

/**
 * Maps each tier to its entitlement key, eligible tiers, and learner routes.
 * The render-layer MUST use this map (not ad-hoc checks) to determine access.
 * This ensures entitlement boundaries cannot be accidentally widened.
 */
export const ECG_PLATFORM_ENTITLEMENT_MAP = {
  core_ecg: {
    entitlementKey: CORE_ECG_PRODUCT.entitlementKey,
    eligibleTiers: CORE_ECG_PRODUCT.eligibleTiers,
    excludedTiers: CORE_ECG_PRODUCT.excludedTiers,
    publicRoutes: ECG_CORE_PUBLIC_ROUTES,
    learnerRoutes: ECG_LEARNER_PRIVATE_ROUTES,
    /**
     * Premium gating applies ONLY inside these learner routes.
     * Public marketing pages must render educational content without gating.
     */
    gatingSurfaces: ["adaptive_drills", "quiz_attempts", "mastery_tracking"] as const,
  },
  advanced_ecg: {
    entitlementKey: ADVANCED_ECG_PRODUCT.entitlementKey,
    eligibleTiers: ADVANCED_ECG_PRODUCT.eligibleTiers,
    excludedTiers: ADVANCED_ECG_PRODUCT.excludedTiers,
    publicRoutes: ECG_ADVANCED_PUBLIC_ROUTES,
    learnerRoutes: ADVANCED_ECG_LEARNER_PRIVATE_ROUTES,
    gatingSurfaces: [
      "advanced_case_simulations",
      "advanced_drills",
      "mastery_tracking",
      "adaptive_testing",
    ] as const,
  },
  hemodynamics: {
    entitlementKey: HEMODYNAMICS_FUNDAMENTALS_PRODUCT.entitlementKey,
    eligibleTiers: HEMODYNAMICS_FUNDAMENTALS_PRODUCT.eligibleTiers,
    excludedTiers: HEMODYNAMICS_FUNDAMENTALS_PRODUCT.excludedTiers,
    publicRoutes: HEMODYNAMICS_PUBLIC_ROUTES,
    learnerRoutes: HEMODYNAMICS_LEARNER_PRIVATE_ROUTES,
    gatingSurfaces: ["adaptive_drills", "quiz_attempts", "mastery_tracking"] as const,
  },
  advanced_hemodynamics: {
    entitlementKey: ADVANCED_HEMODYNAMICS_PRODUCT.entitlementKey,
    eligibleTiers: ADVANCED_HEMODYNAMICS_PRODUCT.eligibleTiers,
    excludedTiers: ADVANCED_HEMODYNAMICS_PRODUCT.excludedTiers,
    publicRoutes: ADVANCED_HEMODYNAMICS_PUBLIC_ROUTES,
    learnerRoutes: ADVANCED_HEMODYNAMICS_LEARNER_PRIVATE_ROUTES,
    billing: ADVANCED_HEMODYNAMICS_PRODUCT.billing,
    gatingSurfaces: [
      "icu_case_simulations",
      "swan_ganz_drills",
      "vasopressor_reasoning",
      "fluid_responsiveness_practice",
      "waveform_interpretation",
    ] as const,
  },
  critical_care_bundle: {
    entitlementKey: CRITICAL_CARE_BUNDLE_PRODUCT.entitlementKey,
    eligibleTiers: CRITICAL_CARE_BUNDLE_PRODUCT.eligibleTiers,
    excludedTiers: CRITICAL_CARE_BUNDLE_PRODUCT.excludedTiers,
    publicRoutes: ["/critical-care-bundle"] as const,
    learnerRoutes: [] as const,
    billing: CRITICAL_CARE_BUNDLE_PRODUCT.billing,
    includes: CRITICAL_CARE_BUNDLE_PRODUCT.includes,
    gatingSurfaces: [] as const,
  },
} as const;

// ─── Paywall-safe rendering rules ──────────────────────────────────────────────

/**
 * Public ECG pages must render these elements WITHOUT requiring auth.
 * These rules are enforced by contract tests and periodic SEO audits.
 */
export const ECG_PUBLIC_RENDERING_REQUIREMENTS = {
  mustRenderWithoutAuth: [
    "educational_content_body",   // Full article/lesson text
    "faq_schema",                  // FAQ structured data
    "waveform_examples",           // Strip description / visual examples
    "nursing_implications",        // Nursing-specific clinical context
    "breadcrumb_schema",           // Navigation breadcrumbs
    "course_schema",               // Course/module structured data
  ],
  mustNeverRender: [
    "login_redirect",             // No redirect to /login or /signup
    "soft_403_gate",              // No "sign in to view" blocking wall
    "thin_teaser_content",        // Full educational value, not a teaser
    "blank_content_state",        // Content must load without auth
    "crawler_blocking_headers",   // No X-Robots-Tag: noindex on public pages
  ],
  premiumCtaIsAdditive: true, // Upgrade CTA is shown alongside content, never replaces it
} as const;

// ─── Internal linking map ────────────────────────────────────────────────────────

/**
 * Required internal links for SEO authority building.
 * Each authority page must link to its pillar and vice versa.
 * Enforcement: visual audit + contract tests on cluster pages.
 */
export const ECG_INTERNAL_LINKING_MAP = {
  // Core pillar → cluster
  "/ecg": {
    mustLinkTo: ECG_CORE_PUBLIC_ROUTES.filter((r) => r !== "/ecg"),
    linkType: "internal_cluster_links",
  },
  // Cluster members → pillar
  "/ecg/[topic]": {
    mustLinkTo: ["/ecg", "/advanced-ecg-nursing"],
    linkType: "pillar_backlinks",
  },
  // Advanced pillar → core pillar
  "/advanced-ecg-nursing": {
    mustLinkTo: ["/ecg", "/ecg-interpretation"],
    linkType: "cross_tier_link",
  },
  // Advanced cluster → advanced pillar
  "/advanced-ecg-nursing/[module]": {
    mustLinkTo: ["/advanced-ecg-nursing", "/ecg"],
    linkType: "pillar_backlinks",
  },
} as const;

// ─── Utility functions ────────────────────────────────────────────────────────

/** True when this route must have robots: { index: true } */
export function isPubliclyIndexedEcgRoute(path: string): boolean {
  const route = ECG_SEO_AUTHORITY_ROUTES.find((r) => r.path === path);
  return route?.indexability === "indexed_public" || route?.indexability === "indexed_premium";
}

/** True when this route must have robots: { index: false } (learner private) */
export function isLearnerPrivateEcgRoute(path: string): boolean {
  const allPrivate = [
    ...ECG_LEARNER_PRIVATE_ROUTES,
    ...ADVANCED_ECG_LEARNER_PRIVATE_ROUTES,
    ...HEMODYNAMICS_LEARNER_PRIVATE_ROUTES,
    ...ADVANCED_HEMODYNAMICS_LEARNER_PRIVATE_ROUTES,
  ];
  return allPrivate.some((r) => path === r || path.startsWith(`${r}/`));
}

/** True when a route must NEVER redirect to login (public authority page) */
export function mustNotRedirectToLogin(path: string): boolean {
  const allPublic = [
    ...ECG_CORE_PUBLIC_ROUTES,
    ...ECG_ADVANCED_PUBLIC_ROUTES,
    ...HEMODYNAMICS_PUBLIC_ROUTES,
    ...ADVANCED_HEMODYNAMICS_PUBLIC_ROUTES,
  ];
  return allPublic.some((r) => path === r || path.startsWith(`${r}/`));
}

/** All public ECG routes eligible for sitemap inclusion (excludes future/reserved) */
export const ECG_SITEMAP_ELIGIBLE_ROUTES: ReadonlyArray<EcgSeoAuthorityRoute> =
  ECG_SEO_AUTHORITY_ROUTES.filter(
    (r) => r.indexability === "indexed_public" || r.indexability === "indexed_premium",
  );
