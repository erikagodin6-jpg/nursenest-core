/**
 * Repo-backed long-tail blog supplements (MD under `src/content/blog-static-longtail/`).
 * Public merge: live DB {@link blogLiveWhere} wins on slug collision; static excluded for that slug.
 */
export type BlogStaticLongtailRecord = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** YYYY-MM-DD — used for index ordering */
  createdAt: string;
  /** YYYY-MM-DD — preferred for sort when present */
  updatedAt: string;
  tags: string[];
  bodyHtml: string;
  seoTitle: string;
  seoDescription: string;
  /** Site path `/blog/...` or absolute https URL */
  canonicalUrl: string;
  /** Shown near article; must contain educational disclaimer language */
  disclaimer: string;
  authorDisplayName?: string;
  medicalReviewerName?: string;
  /**
   * When true, the file is validated locally but excluded from public merge, sitemap,
   * `/blog/[slug]` static-longtail resolution, and supplement overlap lists.
   */
  draft?: boolean;
};

/** Origin of a row in merged public blog lists (`/blog`, tag/category hubs when merged). */
export type BlogPostPublicListSource = "db" | "static";
