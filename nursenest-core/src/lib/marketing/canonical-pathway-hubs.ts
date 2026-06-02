/**
 * Canonical public pathway hub roots (marketing + subscriber context).
 * Aligned with `exam-product-registry` + `buildExamPathwayPath` for active RN/PN/NP pathways.
 *
 * Use these when `getExamPathwayById` is unavailable and for legacy programmatic SEO slug → hub redirects.
 */
export const CANONICAL_PATHWAY_HUB = {
  /** US RN NCLEX pathway hub root (registry-aligned). Not the mixed-tier `/lessons` index. */
  usRn: "/us/rn/nclex-rn",
  /** Canada RN NCLEX pathway hub root (registry-aligned). */
  caRn: "/canada/rn/nclex-rn",
  usPn: "/us/pn/nclex-pn",
  caPn: "/canada/pn/rex-pn",
  usNp: "/us/np/fnp",
  caNp: "/canada/np/cnple",
} as const;

/**
 * Legacy shared programmatic SEO slugs (English, often backlinked) → single canonical pathway hub.
 * Umbrella slugs that served both countries redirect to **US** hubs; Canada-specific slugs redirect to **CA** hubs.
 */
export const LEGACY_PROGRAMMATIC_SLUG_TO_PATHWAY_HUB: readonly { slug: string; destination: string }[] = [
  { slug: "nclex-rn-practice-questions", destination: CANONICAL_PATHWAY_HUB.usRn },
  { slug: "nclex-pn-practice-questions", destination: CANONICAL_PATHWAY_HUB.usPn },
  { slug: "np-exam-practice-questions", destination: CANONICAL_PATHWAY_HUB.usNp },
  { slug: "rex-pn-practice-questions", destination: CANONICAL_PATHWAY_HUB.caPn },
  { slug: "cnple-practice-questions", destination: CANONICAL_PATHWAY_HUB.caNp },
];

/**
 * NP umbrella pages are live, self-canonical discovery surfaces now. Keep RN/PN behavior untouched in this pass and
 * explicitly treat all shared NP/CNPLE discovery slugs as non-redirecting so sitemap emission only excludes slugs with
 * a real live hub redirect.
 */
const SELF_CANONICAL_PROGRAMMATIC_DISCOVERY_SLUGS = new Set([
  "np-exam-practice-questions",
  "np-exam-prep",
  "np-clinical-cases",
  "cnple-practice-questions",
  "canada-np-exam-prep",
  "np-study-guide-canada",
]);

const ACTIVE_LEGACY_PROGRAMMATIC_SLUG_TO_PATHWAY_HUB = LEGACY_PROGRAMMATIC_SLUG_TO_PATHWAY_HUB.filter(
  ({ slug }) => !SELF_CANONICAL_PROGRAMMATIC_DISCOVERY_SLUGS.has(slug),
);

/** Slugs that 301 to pathway hubs — exclude from `/seo/{slug}` → `/{slug}` canonical redirect generation. */
export const LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT = new Set(
  ACTIVE_LEGACY_PROGRAMMATIC_SLUG_TO_PATHWAY_HUB.map((x) => x.slug),
);

/** 301s for legacy programmatic URLs + localized `/{locale}/{slug}` + internal `/seo/{slug}` targets. */
export function buildLegacyProgrammaticSeoRedirectsToPathwayHubs(
  nonDefaultLocales: readonly string[],
): Array<{ source: string; destination: string; permanent: true }> {
  const out: Array<{ source: string; destination: string; permanent: true }> = [];
  for (const { slug, destination } of ACTIVE_LEGACY_PROGRAMMATIC_SLUG_TO_PATHWAY_HUB) {
    out.push({ source: `/${slug}`, destination, permanent: true });
    out.push({ source: `/seo/${slug}`, destination, permanent: true });
    for (const loc of nonDefaultLocales) {
      out.push({ source: `/${loc}/${slug}`, destination, permanent: true });
    }
  }
  return out;
}
