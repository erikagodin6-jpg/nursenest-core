import { BLOG_ARTICLE_MIN_BODY_CHARS } from "@/lib/blog/blog-article-generation-pipeline";

export type BlogPublishReadinessRow = {
  title: string;
  excerpt: string;
  body: string;
  slug: string;
  seoTitle: string | null;
  seoDescription: string | null;
  requiresReferences: boolean;
  apaReferences: string[];
};

/**
 * Gate for `publish_now`: keeps incomplete or reference-gated posts from going live.
 * Slug uniqueness is enforced separately at PATCH time.
 */
export function evaluateBlogPublishReadiness(row: BlogPublishReadinessRow): { ok: true } | { ok: false; reasons: string[] } {
  const reasons: string[] = [];
  if (!row.slug || row.slug.trim().length < 3) {
    reasons.push("Slug is missing or too short.");
  }
  if (!row.title || row.title.trim().length < 3) {
    reasons.push("Title is missing or too short.");
  }
  if (!row.excerpt || row.excerpt.trim().length < 10) {
    reasons.push("Excerpt is missing or too short (min ~10 characters).");
  }
  if (!row.body || row.body.trim().length < BLOG_ARTICLE_MIN_BODY_CHARS) {
    reasons.push(`Body is too short (min ${BLOG_ARTICLE_MIN_BODY_CHARS} characters).`);
  }
  if (!row.seoTitle?.trim()) {
    reasons.push("Meta / SEO title is empty.");
  }
  if (!row.seoDescription?.trim()) {
    reasons.push("Meta description is empty.");
  }
  if (row.requiresReferences && row.apaReferences.filter((s) => s.trim()).length === 0) {
    reasons.push("This post is marked as requiring references but APA lines are empty.");
  }
  if (reasons.length > 0) return { ok: false, reasons };
  return { ok: true };
}
