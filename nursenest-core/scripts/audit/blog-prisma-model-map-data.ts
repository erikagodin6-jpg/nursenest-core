/**
 * Static Prisma ↔ route mapping for blog audit (no DB required).
 * Source of truth: prisma/schema.prisma + safe-blog-queries + safe-localized-blog-queries + app routes.
 */
export const BLOG_PRISMA_MODEL_MAP = {
  generatedAtNote: "Written by run-blog-prisma-readonly-export.mts; regenerate with npm run audit:blog-prisma-export",
  models: [
    {
      modelName: "BlogPost",
      usedBy: [
        "Default marketing blog: `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`",
        "Sitemap: `src/lib/seo/sitemap-blog-xml.ts` → getSitemapPublishedBlogSlugs",
        "Queries: `src/lib/blog/safe-blog-queries.ts` — getPublishedBlogPostBySlug, getPublishedBlogPostsPage, getBlogPostMetaBySlug",
      ],
      slugField: "slug",
      titleField: "title",
      publishStatusField: "postStatus (BlogPostStatus)",
      localeField: "locale",
      bodyField: "body (@db.Text HTML/markdown as stored)",
      createdAtField: "createdAt",
      updatedAtField: "updatedAt",
      publishSchedulingFields: ["publishAt", "scheduledAt"],
      seoFields: ["seoTitle", "seoDescription", "targetKeyword", "keywordCluster"],
      translationLinkage: [
        "translationGroupId — links translations of same article",
        "canonicalPostId — optional self-relation for translation variants",
      ],
      evidenceSourceFiles: [
        "nursenest-core/prisma/schema.prisma (BlogPost model)",
        "nursenest-core/src/lib/blog/safe-blog-queries.ts",
        "nursenest-core/src/lib/blog/blog-visibility.ts (blogLiveWhere, blogPostIsLive)",
        "nursenest-core/src/app/(marketing)/(default)/blog/[slug]/page.tsx",
      ],
    },
    {
      modelName: "LocalizedBlogArticle",
      usedBy: [
        "Regional blog: `/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]`",
        "Queries: `src/lib/blog/safe-localized-blog-queries.ts` — getPublishedLocalizedBlogBySlug, getPublishedLocalizedBlogPostsPage, getSitemapLocalizedBlogRows",
      ],
      slugField: "localizedSlug (public URL segment; canonicalSlug mirrors source)",
      titleField: "localizedTitle",
      publishStatusField: "contentStatus (LocalizedBlogStatus: PUBLISHED | SCHEDULED | …)",
      localeField: "locale",
      bodyField: "localizedBody (@db.Text)",
      createdAtField: "createdAt",
      updatedAtField: "updatedAt",
      publishSchedulingFields: ["publishedAt", "scheduledAt"],
      seoFields: [
        "localizedMetaTitle",
        "localizedMetaDescription",
        "seoKeywordPrimary",
        "seoKeywordSecondary",
        "canonicalUrl",
        "hreflangJson",
      ],
      translationLinkage: [
        "canonicalArticleId — required FK to BlogPost.id (canonical article)",
      ],
      evidenceSourceFiles: [
        "nursenest-core/prisma/schema.prisma (LocalizedBlogArticle model)",
        "nursenest-core/src/lib/blog/safe-localized-blog-queries.ts (localizedBlogLiveWhere, fullSelect)",
        "nursenest-core/src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]/page.tsx",
      ],
    },
  ],
} as const;
