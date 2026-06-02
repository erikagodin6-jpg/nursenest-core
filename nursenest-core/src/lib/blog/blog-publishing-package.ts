/**
 * Publication-oriented JSON stored under `BlogPost.internalLinkPlan.publishingPackage`.
 * Keeps related-post discovery and anchor opportunities alongside the SEO bundle without schema migrations.
 */

export const BLOG_PUBLISHING_PACKAGE_VERSION = 1 as const;

export type BlogPublishingRelatedPost = {
  slug: string;
  title: string;
  excerpt: string;
};

export type BlogPublishingAnchorOpportunity = {
  phrase: string;
  suggestedAnchorText: string;
  targetSuggestedPath: string;
  rationale?: string;
};

export type BlogPublishingPackageV1 = {
  version: typeof BLOG_PUBLISHING_PACKAGE_VERSION;
  /** ISO timestamp when package was last assembled or refreshed. */
  updatedAt?: string;
  internalAnchorOpportunities: BlogPublishingAnchorOpportunity[];
  relatedBlogPosts: BlogPublishingRelatedPost[];
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Best-effort parse of persisted `internalLinkPlan.publishingPackage`. */
export function parsePublishingPackage(raw: unknown): BlogPublishingPackageV1 | null {
  if (!isPlainObject(raw)) return null;
  if (raw.version !== 1) return null;
  const anchors: BlogPublishingAnchorOpportunity[] = [];
  if (Array.isArray(raw.internalAnchorOpportunities)) {
    for (const row of raw.internalAnchorOpportunities) {
      if (!isPlainObject(row)) continue;
      const phrase = typeof row.phrase === "string" ? row.phrase.trim().slice(0, 200) : "";
      const suggestedAnchorText =
        typeof row.suggestedAnchorText === "string" ? row.suggestedAnchorText.trim().slice(0, 120) : "";
      const targetSuggestedPath =
        typeof row.targetSuggestedPath === "string" ? row.targetSuggestedPath.trim().slice(0, 500) : "";
      if (phrase.length < 2 || suggestedAnchorText.length < 2 || targetSuggestedPath.length < 2) continue;
      const rationale =
        typeof row.rationale === "string" && row.rationale.trim() ? row.rationale.trim().slice(0, 300) : undefined;
      anchors.push({ phrase, suggestedAnchorText, targetSuggestedPath, rationale });
    }
  }
  const related: BlogPublishingRelatedPost[] = [];
  if (Array.isArray(raw.relatedBlogPosts)) {
    for (const row of raw.relatedBlogPosts) {
      if (!isPlainObject(row)) continue;
      const slug = typeof row.slug === "string" ? row.slug.trim() : "";
      const title = typeof row.title === "string" ? row.title.trim().slice(0, 220) : "";
      const excerpt = typeof row.excerpt === "string" ? row.excerpt.trim().slice(0, 500) : "";
      if (slug.length < 2 || title.length < 2) continue;
      related.push({ slug, title, excerpt });
    }
  }
  return {
    version: 1,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt.slice(0, 40) : undefined,
    internalAnchorOpportunities: anchors.slice(0, 24),
    relatedBlogPosts: related.slice(0, 20),
  };
}

export function emptyPublishingPackageV1(): BlogPublishingPackageV1 {
  return {
    version: 1,
    internalAnchorOpportunities: [],
    relatedBlogPosts: [],
  };
}

export function mergePublishingPackageIntoLinkPlanJson(
  existingPlan: Record<string, unknown>,
  pkg: BlogPublishingPackageV1,
): Record<string, unknown> {
  return {
    ...existingPlan,
    publishingPackage: {
      ...pkg,
      updatedAt: pkg.updatedAt ?? new Date().toISOString(),
    },
  };
}
