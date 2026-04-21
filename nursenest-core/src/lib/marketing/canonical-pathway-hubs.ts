/**
 * Canonical public pathway hub roots (marketing + subscriber context).
 * Aligned with `exam-product-registry` + `buildExamPathwayPath` for active RN/PN/NP pathways.
 *
 * Use these when `getExamPathwayById` is unavailable and for legacy programmatic SEO slug → hub redirects.
 */
export const CANONICAL_PATHWAY_HUB = {
  /** Retired marketing RN NCLEX overview; consolidate legacy + toggles on `/lessons`. */
  usRn: "/lessons",
  caRn: "/lessons",
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

/** Slugs that 301 to pathway hubs — exclude from `/seo/{slug}` → `/{slug}` canonical redirect generation. */
export const LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT = new Set(
  LEGACY_PROGRAMMATIC_SLUG_TO_PATHWAY_HUB.map((x) => x.slug),
);

/** 301s for legacy programmatic URLs + localized `/{locale}/{slug}` + internal `/seo/{slug}` targets. */
export function buildLegacyProgrammaticSeoRedirectsToPathwayHubs(
  nonDefaultLocales: readonly string[],
): Array<{ source: string; destination: string; permanent: true }> {
  const out: Array<{ source: string; destination: string; permanent: true }> = [];
  for (const { slug, destination } of LEGACY_PROGRAMMATIC_SLUG_TO_PATHWAY_HUB) {
    out.push({ source: `/${slug}`, destination, permanent: true });
    out.push({ source: `/seo/${slug}`, destination, permanent: true });
    for (const loc of nonDefaultLocales) {
      out.push({ source: `/${loc}/${slug}`, destination, permanent: true });
    }
  }
  return out;
}
