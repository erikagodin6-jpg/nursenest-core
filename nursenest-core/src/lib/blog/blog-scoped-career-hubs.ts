import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";

/** Nursing exam-prep hubs backed by `BlogPost.careerSlug` (see `/nursing/[careerSlug]/blog`). */
export const NURSING_SCOPED_CAREER_SLUGS = ["rn", "pn", "np"] as const;
export type NursingScopedCareerSlug = (typeof NURSING_SCOPED_CAREER_SLUGS)[number];

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
export function defaultMarketingScopedBlogScope(careerSlug: string): Pick<
  BlogQueryScope,
  "locale" | "sourceLocale" | "careerSlug" | "allowSourceLocaleFallback"
> {
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
