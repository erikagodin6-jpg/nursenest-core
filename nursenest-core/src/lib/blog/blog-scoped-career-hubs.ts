import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";

/** Nursing exam-prep hubs backed by `BlogPost.careerSlug` (see `/nursing/[careerSlug]/blog`). */
export const NURSING_SCOPED_CAREER_SLUGS = ["rn", "pn", "np"] as const;
export type NursingScopedCareerSlug = (typeof NURSING_SCOPED_CAREER_SLUGS)[number];

/**
 * Regional and specialty blog authority cluster slugs.
 * These route to dedicated `/blog/{slug}/` index+detail trees rather than the generic `/nursing/{slug}/blog` pattern.
 * Kept separate from `NURSING_SCOPED_CAREER_SLUGS` to avoid breaking existing routing.
 */
export const REGIONAL_BLOG_CLUSTER_SLUGS = [
  "canada-rn",
  "us-rn",
  "rex-pn",
  "nclex-pn",
] as const;
export type RegionalBlogClusterSlug = (typeof REGIONAL_BLOG_CLUSTER_SLUGS)[number];

const REGIONAL_BLOG_BASE: Record<RegionalBlogClusterSlug, string> = {
  "canada-rn": "/blog/canada-rn",
  "us-rn": "/blog/us-rn",
  "rex-pn": "/blog/rex-pn",
  "nclex-pn": "/blog/nclex-pn",
};

const REGIONAL_BLOG_LABELS: Record<RegionalBlogClusterSlug, { h1: string; short: string; examShort: string }> = {
  "canada-rn": { h1: "Canada RN (NCLEX-RN)", short: "Canada RN", examShort: "NCLEX-RN (Canada)" },
  "us-rn": { h1: "US Registered Nurse (NCLEX-RN)", short: "US RN", examShort: "NCLEX-RN (United States)" },
  "rex-pn": { h1: "REx-PN (Canada RPN)", short: "REx-PN / RPN", examShort: "REx-PN" },
  "nclex-pn": { h1: "NCLEX-PN (US LPN / LVN)", short: "LPN / LVN", examShort: "NCLEX-PN" },
};

export function isRegionalBlogClusterSlug(slug: string | null | undefined): slug is RegionalBlogClusterSlug {
  if (!slug) return false;
  return (REGIONAL_BLOG_CLUSTER_SLUGS as readonly string[]).includes(slug.trim().toLowerCase());
}

export function regionalBlogClusterBase(slug: RegionalBlogClusterSlug): string {
  return REGIONAL_BLOG_BASE[slug];
}

export function regionalBlogClusterLabels(slug: RegionalBlogClusterSlug): {
  h1: string;
  short: string;
  examShort: string;
} {
  return REGIONAL_BLOG_LABELS[slug];
}

const NURSING_LABELS: Record<NursingScopedCareerSlug, { h1: string; short: string }> = {
  rn: { h1: "Registered Nurse (RN)", short: "RN" },
  pn: { h1: "Practical Nurse / RPN", short: "PN / RPN" },
  np: { h1: "Nurse Practitioner (NP)", short: "NP" },
};

export function resolveNursingScopedCareerSlug(raw: string): NursingScopedCareerSlug | null {
  const s = raw.trim().toLowerCase();
  return (NURSING_SCOPED_CAREER_SLUGS as readonly string[]).includes(s) ? (s as NursingScopedCareerSlug) : null;
}

export function nursingScopedCareerLabels(career: NursingScopedCareerSlug): { h1: string; short: string } {
  return NURSING_LABELS[career];
}

export function isNursingScopedCareerSlug(careerSlug: string | null | undefined): careerSlug is NursingScopedCareerSlug {
  if (!careerSlug) return false;
  return (NURSING_SCOPED_CAREER_SLUGS as readonly string[]).includes(careerSlug.trim().toLowerCase());
}

export function isAlliedBlogProfessionCareerSlug(careerSlug: string | null | undefined): boolean {
  if (!careerSlug) return false;
  return Boolean(getAlliedProfessionByProfessionKey(careerSlug.trim().toLowerCase()));
}

/**
 * Default marketing locale scope for allied + nursing scoped hubs (mirrors route loaders).
 */
export function defaultMarketingScopedBlogScope(careerSlug: string): {
  locale: string;
  sourceLocale: string;
  careerSlug: string;
  allowSourceLocaleFallback: boolean;
} {
  return {
    locale: "en",
    sourceLocale: "en",
    careerSlug: careerSlug.trim().toLowerCase(),
    allowSourceLocaleFallback: true,
  };
}

export type GeneratedBlogPathPlan = {
  expectedPublicBlogPath: string;
  expectedDetailPath: string;
  /** When set, this hub lists the post via `getPublishedBlogPostsPage` with a career scope. */
  scopedListPath: string | null;
};

/**
 * Public list + detail URLs for generated `BlogPost` rows (canonical `/blog` vs scoped hubs).
 */
export function expectedGeneratedBlogPaths(row: { slug: string; careerSlug: string | null }): GeneratedBlogPathPlan {
  const slug = row.slug.trim();
  const cs = row.careerSlug?.trim().toLowerCase() ?? null;

  // Regional/specialty clusters route to dedicated `/blog/{cluster}/` trees.
  if (cs && isRegionalBlogClusterSlug(cs)) {
    const base = REGIONAL_BLOG_BASE[cs as RegionalBlogClusterSlug];
    return {
      expectedPublicBlogPath: base,
      expectedDetailPath: `${base}/${encodeURIComponent(slug)}`,
      scopedListPath: base,
    };
  }

  if (cs === "rn") {
    const base = "/blog/rn";
    return {
      expectedPublicBlogPath: base,
      expectedDetailPath: `${base}/${encodeURIComponent(slug)}`,
      scopedListPath: base,
    };
  }
  if (cs && isNursingScopedCareerSlug(cs)) {
    const base = `/nursing/${cs}/blog`;
    return {
      expectedPublicBlogPath: base,
      expectedDetailPath: `${base}/${encodeURIComponent(slug)}`,
      scopedListPath: base,
    };
  }

  if (cs && isAlliedBlogProfessionCareerSlug(cs)) {
    const base = `/allied-health/${cs}/blog`;
    return {
      expectedPublicBlogPath: base,
      expectedDetailPath: `${base}/${encodeURIComponent(slug)}`,
      scopedListPath: base,
    };
  }

  return {
    expectedPublicBlogPath: "/blog",
    expectedDetailPath: `/blog/${encodeURIComponent(slug)}`,
    scopedListPath: null,
  };
}
