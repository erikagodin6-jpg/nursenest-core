import type { BlogPost } from "@prisma/client";
import { BlogImageStatus, BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import type { BlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Maps a long-tail MD record to a synthetic `BlogPost` for `/blog/[slug]`.
 * `workflowStatus` is **PUBLISHED** so {@link blogPostIsLive} matches public gates.
 */
export function publishedBlogPostFromHybridRecord(r: BlogStaticLongtailRecord): BlogPost {
  const createdAt = new Date(`${r.createdAt}T12:00:00Z`);
  const updatedAt = new Date(`${r.updatedAt}T12:00:00Z`);
  const aside = `<aside class="nn-blog-editorial-disclaimer rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--theme-card-bg))] p-4 text-sm text-[var(--theme-muted-text)] mb-6" role="note"><p><strong>Educational use only:</strong> ${escapeHtml(r.disclaimer)}</p></aside>`;
  const body = `${aside}\n${r.bodyHtml}`;
  return {
    id: `static-longtail:${r.slug}`,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    body,
    coverImage: null,
    tags: r.tags ?? [],
    category: r.category ?? null,
    createdAt,
    updatedAt,
    legacySource: "static-longtail",
    postStatus: BlogPostStatus.PUBLISHED,
    publishAt: null,
    scheduledAt: null,
    exam: null,
    seoTitle: r.seoTitle,
    seoDescription: r.seoDescription,
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
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
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
    authorDisplayName: r.authorDisplayName ?? null,
    authorCredentials: null,
    authorBio: null,
    medicalReviewerName: r.medicalReviewerName ?? null,
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
