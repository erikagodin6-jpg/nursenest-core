/** Public list/detail: Postgres CMS vs bundled or repo supplement content. */
export type BlogPostPublicListSource = "db" | "static";

/**
 * Parsed long-tail markdown supplement (`src/content/blog-static-longtail/*.md`).
 * Frontmatter uses `publishedAt` (mapped to `createdAt` at parse time for index ordering).
 */
export type BlogStaticLongtailRecord = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  /** Public HTML body (markdown files may use raw HTML blocks). */
  bodyHtml: string;
  /** ISO `YYYY-MM-DD` — sourced from frontmatter `publishedAt`. */
  createdAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  medicalDisclaimer: string;
  authorDisplayName?: string;
  medicalReviewerName?: string;
};
