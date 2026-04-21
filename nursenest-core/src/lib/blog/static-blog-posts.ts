/**
 * Route-scoped static blog corpus access.
 * Keep this out of root/shared layouts, homepage shell chrome, and the site header;
 * shared surfaces should use smaller teaser/query helpers instead.
 */
import type { BlogPost } from "@prisma/client";
import { BlogImageStatus, BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import type { StaticBlogPostRecord } from "@/content/blog-static-posts";

type StaticBlogPostsModule = {
  STATIC_BLOG_POSTS: StaticBlogPostRecord[];
};

let staticBlogPostsCache: StaticBlogPostRecord[] | null = null;

function getStaticBlogPosts(): StaticBlogPostRecord[] {
  if (staticBlogPostsCache) return staticBlogPostsCache;
  staticBlogPostsCache = (require("@/content/blog-static-posts") as StaticBlogPostsModule).STATIC_BLOG_POSTS;
  return staticBlogPostsCache;
}

export function listStaticBlogPostsForIndex(): StaticBlogPostRecord[] {
  return [...getStaticBlogPosts()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getStaticBlogPost(slug: string): StaticBlogPostRecord | undefined {
  return getStaticBlogPosts().find((p) => p.slug === slug);
}

export function countStaticBlogPosts(): number {
  return getStaticBlogPosts().length;
}

/** Shape consumed by `/blog/[slug]` rendering (matches Prisma fields used there). */
export function staticRecordToBlogDisplay(s: StaticBlogPostRecord) {
  return {
    title: s.title,
    excerpt: s.excerpt,
    category: s.category,
    createdAt: new Date(s.createdAt + "T12:00:00Z"),
    body: s.bodyHtml,
    tags: s.tags,
    coverImage: null as string | null,
    exam: null as string | null,
    relatedLessonPaths: [] as string[],
    relatedQuestionIds: [] as string[],
    relatedTools: [] as string[],
    publishAt: null as Date | null,
    seoTitle: null as string | null,
    seoDescription: null as string | null,
  };
}

/**
 * Minimal `BlogPost` row for public `/blog/[slug]` when the DB has no row but the bundled
 * static corpus is authoritative (empty DB or `next build` without Postgres).
 * Cast is intentional: relation fields are unused on the public blog route.
 */
export function publishedBlogPostFromStaticRecord(s: StaticBlogPostRecord): BlogPost {
  const createdAt = new Date(`${s.createdAt}T12:00:00Z`);
  return {
    id: `static:${s.slug}`,
    slug: s.slug,
    title: s.title,
    excerpt: s.excerpt,
    body: s.bodyHtml,
    coverImage: null,
    tags: s.tags ?? [],
    category: s.category ?? null,
    createdAt,
    updatedAt: createdAt,
    legacySource: "static-corpus",
    postStatus: BlogPostStatus.PUBLISHED,
    publishAt: null,
    scheduledAt: null,
    exam: null,
    seoTitle: null,
    seoDescription: null,
    postTemplate: null,
    relatedLessonPaths: [],
    relatedQuestionIds: [],
    relatedTools: [],
    adminPublishLog: [],
    campaignId: null,
    targetKeyword: null,
    keywordCluster: null,
    countryTarget: null,
    intent: null,
    funnelStage: null,
    workflowStatus: BlogWorkflowStatus.GENERATED,
    outlineJson: null,
    keyQuestions: [],
    keywordPlan: [],
    internalLinkPlan: null,
    ctaType: null,
    ctaText: null,
    ctaHref: null,
    titleAlternates: [],
    clickTitle: null,
    metaTitleVariant: null,
    metaDescriptionVariant: null,
    featuredSnippet: null,
    keyTakeaways: [],
    faqBlock: null,
    definitionBox: null,
    checklistBlock: null,
    quickReferenceBlock: null,
    sourceReliabilityScore: null,
    sourcesJson: null,
    apaReferences: [],
    requiresReferences: false,
    medicalRiskFlags: [],
    reviewDueAt: null,
    lastReviewedAt: null,
    coverImageAlt: null,
    coverImageCaption: null,
    coverImagePrompt: null,
    imageStyleType: null,
    imageStatus: BlogImageStatus.NONE,
    socialCaption: null,
    emailTeaser: null,
    shortSummary: null,
    promoBlurb: null,
    schemaSummary: null,
    perfImpressions: null,
    perfClicks: null,
    perfCtr: null,
    perfInternalClicks: null,
    perfConversionAssists: null,
    perfSubscriptionAssists: null,
    updateNeeded: false,
    rankingNote: null,
    careerSlug: null,
    locale: "en",
    translationGroupId: null,
    sourceLocale: null,
    isAutoTranslated: false,
    translationSource: null,
    canonicalPostId: null,
    authorDisplayName: null,
    authorCredentials: null,
    authorBio: null,
    medicalReviewerName: null,
    medicalReviewerCredentials: null,
    batchScheduleItems: [],
    campaignItems: [],
    draftGenerationBatchItems: [],
    campaign: null,
    canonicalPost: null,
    translatedVariants: [],
    contentAutomationLogs: [],
    localizedVariants: [],
  } as BlogPost;
}
