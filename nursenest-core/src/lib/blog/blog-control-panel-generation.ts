import {
  BlogFunnelStage,
  BlogImageStatus,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  CountryCode,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import { getBlogOpenAiChatModel } from "@/lib/ai/openai-env";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import type { BlogSourceRecord } from "@/lib/blog/apa7";
import { coerceBlogSourceRows } from "@/lib/blog/apa7";
import {
  buildCitationEnvelope,
  evaluateCitationGate,
  partitionCitationsForBlog,
} from "@/lib/blog/blog-citation-safety";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { blogLessonLinkRowSchema, type BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import {
  BLOG_PLAN_FALLBACK_IMAGE_ALT_IDEA,
  BLOG_PLAN_FALLBACK_IMAGE_PROMPT_IDEA,
  BLOG_PLAN_FALLBACK_IMAGE_SECTION,
  formatZodIssuesForApi,
  normalizeBlogEditorialPlanCandidate,
  safeParseBlogControlPanelPlan,
} from "@/lib/blog/blog-control-panel-plan-normalize";
import {
  getBlogInternalLinkPathHintsForPrompt,
  lessonRowsToRelatedPaths,
  normalizePlanSuggestedLessonRows,
} from "@/lib/blog/blog-internal-lesson-links";
import {
  buildMinimalSeoBundleFallback,
  buildPersistedSeoBundle,
  buildSchemaSummaryPayload,
} from "@/lib/blog/blog-seo-automation";
import {
  clampSerpDescription,
  clampSerpTitle,
  deriveBlogCategoryForPersist,
  normalizeBlogTagsForStorage,
} from "@/lib/blog/blog-seo-package";
import {
  buildArticleBodySystemPrompt,
  buildArticleBodyUserPrompt,
  buildStructuredPlanSystemPrompt,
  buildStructuredPlanUserPrompt,
} from "@/lib/blog/blog-article-pipeline-prompts";
import type { BlogImageSlotAttachment } from "@/lib/blog/blog-image-workflow";
import { seedBlogAdminPublishLog } from "@/lib/blog/blog-admin-publish-log";
import { publishGeneratedBlogArticle } from "@/lib/blog/publish-generated-blog-article";
import { isBlogSeoPillarDepthProfile } from "@/lib/blog/blog-seo-depth-profile";
import { evaluateBlogGenerationOutputGate } from "@/lib/blog/blog-generation-output-gate";
import { logBlogGenerationRejected } from "@/lib/blog/blog-generation-log";
import {
  blogPrePublishValidationSelect,
  validateBlogPrePublish,
  type PrePublishValidationResult,
} from "@/lib/blog/blog-pre-publish-validation";
import { findRelatedPublishedBlogPosts } from "@/lib/blog/blog-related-published-posts";
import {
  isLongFormPathophysiologyProfile,
  validateLongFormNursingPlanContract,
} from "@/lib/blog/blog-longform-nursing-contract";
import { fetchControlPanelBodyHtmlSectionIsolated } from "@/lib/blog/blog-section-isolated-body-generation";
import { mergePublishingPackageIntoLinkPlanJson } from "@/lib/blog/blog-publishing-package";
import { blogPrimaryStudyCta, marketingStudyHubsForBlogExam } from "@/lib/blog/blog-study-cta";
import { detectRiskFlags, thinDraftWarning } from "@/lib/blog/seo-campaign-engine";
import { prisma } from "@/lib/db";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import {
  blogBodyHtmlWhenAiReturnedEmpty,
  ensureNonEmptyBlogBodyHtmlForPersist,
} from "@/lib/blog/blog-article-bounds";
import {
  BlogInvalidSlugError,
  BLOG_SLUG_FORMAT_RE,
  cleanBlogSlugInput,
  coerceAdminOptionalSlugFromRawInput,
  generateBlogSlugBaseFromExamTopic,
} from "@/lib/blog/blog-optional-slug";
import { ensureUniqueBlogPostSlug } from "@/lib/blog/blog-optional-slug.server";
import { assertSeoSafeToCreateBlog, SeoDuplicateBlockedError } from "@/lib/seo/seo-duplicate-guard";
import {
  blogIntentForQualityGate,
  collectBlogContentQualityIssues,
} from "@/lib/blog/blog-content-quality-gate";

export type ControlPanelGenerateInput = {
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  keywords?: string;
  targetKeyword?: string;
  keywordCluster?: string;
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  includeImage: boolean;
  includeAiImage: boolean;
  sourceRecordsJson?: BlogSourceRecord[];
  /** When set, skips AI stub generation and uses these as APA inputs. */
  fixedSlug?: string;
  /**
   * Allow saving high-risk drafts with zero verified admin citations (not recommended).
   * Default false: {@link evaluateCitationGate} blocks persist.
   */
  allowInsufficientCitations?: boolean;
  /**
   * When true, after the draft transaction commits, load the row and run {@link validateBlogPrePublish};
   * on success set `PUBLISHED`, `publishAt` now, and `workflowStatus` published.
   * On validation failure the draft row remains `DRAFT` and the API returns `PRE_PUBLISH_BLOCKED` (422).
   */
  publishImmediately?: boolean;
  /** CLI/automation only: allow structurally valid generated source stubs to become publishable APA rows. */
  allowGeneratedSourceStubsForPublish?: boolean;
  minPublishReferences?: number;
  minPublishWords?: number;
  validateInternalLinksBeforePublish?: boolean;
  publishOnlyIfValid?: boolean;
  /** When false, skip paywall-safe body copy checks at generated publish time. */
  paywallSafeLinksBeforePublish?: boolean;
  /** When false, skip shallow-H2 publish gate for generated articles. */
  requireClinicalSectionDepthOnPublish?: boolean;
  /** Standard template body: include dedicated Clinical pearls H2 (default true). */
  includeClinicalPearlsInBody?: boolean;
  /** Standard template body: render FAQs as H2 in HTML (default true; long-form pathophysiology omits FAQ H2 regardless). */
  includeFaqsInBody?: boolean;
};

/** Thrown when the structured editorial plan cannot be parsed or validated (with machine codes for clients). */
export class BlogControlPanelPlanError extends Error {
  readonly code: "PLAN_INVALID_JSON" | "PLAN_NORMALIZE" | "PLAN_ZOD" | "PLAN_LONGFORM_CONTRACT";

  readonly details: unknown;

  constructor(code: BlogControlPanelPlanError["code"], message: string, details?: unknown) {
    super(message);
    this.name = "BlogControlPanelPlanError";
    this.code = code;
    this.details = details;
  }

  static is(e: unknown): e is BlogControlPanelPlanError {
    return e instanceof BlogControlPanelPlanError;
  }
}

function extractJsonObject(raw: string): unknown {
  let t = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t) as unknown;
}

export function sanitizeControlPanelGeneratedSlugInput(s: string, exam: string, topic: string): string {
  const fromAi = cleanBlogSlugInput(s).slice(0, 100);
  if (fromAi.length >= 3 && BLOG_SLUG_FORMAT_RE.test(fromAi)) return fromAi;
  return generateBlogSlugBaseFromExamTopic(exam, topic, 100) || "blog-draft";
}

export function appendRequiredStudyLinksBlock(params: {
  bodyHtml: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  relatedPaths: string[];
}): string {
  const hubs = marketingStudyHubsForBlogExam(params.exam, params.country);
  const links: Array<{ href: string; label: string }> = [];
  const push = (href: string, label: string) => {
    if (!href || links.some((l) => l.href === href)) return;
    links.push({ href, label });
  };

  for (const href of params.relatedPaths.slice(0, 2)) {
    push(href, "Topic-matched lesson path");
  }
  push(hubs.lessonsHub, "Lessons hub");
  push(hubs.questionBankHub, "Question bank hub");
  push(HUB.flashcards, "Flashcards hub");
  push(hubs.practiceExamsHub, "Practice exams hub");

  const missingAny = links.some((l) => !params.bodyHtml.includes(`href="${l.href}"`));
  if (!missingAny) return params.bodyHtml;

  const listHtml = links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("");
  return `${params.bodyHtml.trim()}\n<h2>Study next in NurseNest</h2><ul>${listHtml}</ul>`;
}

export async function fetchControlPanelPlan(
  input: ControlPanelGenerateInput,
  opts?: { openAiUser?: string },
): Promise<BlogControlPanelPlan> {
  const system = buildStructuredPlanSystemPrompt({ template: input.template, intent: input.intent });
  const user = `${buildStructuredPlanUserPrompt({
    topic: input.topic,
    exam: input.exam,
    country: input.country,
    template: input.template,
    intent: input.intent,
    funnelStage: input.funnelStage,
    tone: input.tone,
    keywords: input.keywords,
    targetKeyword: input.targetKeyword,
    keywordCluster: input.keywordCluster,
  })}\n\n${getBlogInternalLinkPathHintsForPrompt(input.exam, input.country)}`;

  const res = await openAiChatCompletion({
    useBlogOpenAiApiKey: true,
    model: getBlogOpenAiChatModel(),
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.35,
    maxTokens: 4096,
    user: opts?.openAiUser,
  });

  let parsed: unknown;
  try {
    parsed = extractJsonObject(res.content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new BlogControlPanelPlanError(
      "PLAN_INVALID_JSON",
      `Model returned invalid JSON for the editorial plan: ${msg}`,
      { preview: res.content.slice(0, 1600) },
    );
  }

  const plan = safeParseBlogControlPanelPlan(parsed, { title: input.topic });
  if (!plan.success) {
    if (plan.normalizeError) {
      throw new BlogControlPanelPlanError("PLAN_NORMALIZE", plan.normalizeError, {
        normalizeError: plan.normalizeError,
      });
    }
    if (plan.zodError) {
      throw new BlogControlPanelPlanError(
        "PLAN_ZOD",
        "Editorial plan JSON failed schema validation after coercion.",
        { issues: formatZodIssuesForApi(plan.zodError) },
      );
    }
    throw new BlogControlPanelPlanError("PLAN_ZOD", "Editorial plan validation failed for an unknown reason.", null);
  }
  return await repairMaterializedPlanSectionsOnce(plan.data, input, opts);
}

export async function fetchControlPanelBodyHtml(params: {
  plan: BlogControlPanelPlan;
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  /** Overrides plan.h1 when admin picked a different title option. */
  selectedTitle?: string;
  openAiUser?: string;
  includeClinicalPearls?: boolean;
  includeFaqsInBody?: boolean;
}): Promise<string> {
  if (isLongFormPathophysiologyProfile({ template: params.template, intent: params.intent })) {
    return fetchControlPanelBodyHtmlSectionIsolated(params);
  }

  const pageH1 = params.selectedTitle?.trim() || params.plan.h1;
  const system = buildArticleBodySystemPrompt({
    template: params.template,
    intent: params.intent,
    includeClinicalPearls: params.includeClinicalPearls,
    includeFaqsInBody: params.includeFaqsInBody,
  });
  const user = buildArticleBodyUserPrompt({
    plan: params.plan,
    topic: params.topic,
    exam: params.exam,
    country: params.country,
    template: params.template,
    intent: params.intent,
    funnelStage: params.funnelStage,
    tone: params.tone,
    keywords: params.keywords,
    pageH1,
  });

  const response = await openAiChatCompletion({
    useBlogOpenAiApiKey: true,
    model: getBlogOpenAiChatModel(),
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.42,
    maxTokens: 8192,
    user: params.openAiUser,
  });

  const bodyHtml = response.content.trim();
  const visible = bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!bodyHtml.length || !visible.length) {
    return blogBodyHtmlWhenAiReturnedEmpty();
  }
  if (bodyHtml.length < 1800) {
    throw new Error("Model returned too little HTML for the article body");
  }
  return bodyHtml;
}

export type ControlPanelPersistResult =
  | {
      ok: true;
      skipped: false;
      post: {
        id: string;
        slug: string;
        title: string;
        postStatus: BlogPostStatus;
        updatedAt: Date;
      };
      plan: BlogControlPanelPlan;
      warnings: string[];
    }
  | {
      ok: true;
      skipped: true;
      reason: "duplicate_topic" | "duplicate_slug" | "duplicate_slug_race";
      existingSlug?: string;
      normalizedTopic?: string;
      slug?: string;
    }
  | {
      ok: false;
      error: string;
      code?: "INSUFFICIENT_CITATIONS" | "PRE_PUBLISH_BLOCKED" | "SEO_DUPLICATE_BLOCKED" | "QUALITY_GATE" | "OUTPUT_GATE";
      riskFlags?: string[];
      prePublish?: PrePublishValidationResult;
      /** Present when `PRE_PUBLISH_BLOCKED`: draft row was committed; publish step skipped. */
      post?: { id: string; slug: string; title: string; postStatus: BlogPostStatus; updatedAt: Date };
      /** Present when `QUALITY_GATE`: draft saved as NEEDS_REVIEW for admin repair. */
      plan?: BlogControlPanelPlan;
      warnings?: string[];
    };

export type ControlPanelPersistProgressStage =
  | "validating_citations"
  | "prepublish_checks"
  | "publishing"
  | "published";

export async function persistControlPanelDraft(
  input: ControlPanelGenerateInput,
  plan: BlogControlPanelPlan,
  bodyHtml: string,
  persistHooks?: {
    onPersistStage?: (stage: ControlPanelPersistProgressStage) => void | Promise<void>;
  },
): Promise<ControlPanelPersistResult> {
  const normalizedTopic = normalizeBlogTopicKey(input.targetKeyword ?? input.topic);
  const pageTitle =
    String((plan.h1 || plan.titleOptions[0] || input.topic || "Blog draft").trim()).slice(0, 220) || "Blog draft";
  let slugBase: string;
  try {
    const fixed = input.fixedSlug?.trim() ? coerceAdminOptionalSlugFromRawInput(input.fixedSlug, 180) : null;
    if (fixed) {
      slugBase = fixed;
    } else {
      slugBase = sanitizeControlPanelGeneratedSlugInput(plan.recommendedSlug, input.exam, input.topic);
    }
  } catch (e) {
    if (BlogInvalidSlugError.is(e)) {
      return { ok: false, error: e.message };
    }
    throw e;
  }
  const slug = await ensureUniqueBlogPostSlug(slugBase);

  if (normalizedTopic) {
    const dupTopic = await findExistingBlogByCanonicalIntent({ exam: input.exam, normalizedTopic });
    if (dupTopic) {
      return {
        ok: true,
        skipped: true,
        reason: "duplicate_topic",
        existingSlug: dupTopic.slug,
        normalizedTopic,
      };
    }
  }

  const excerptFromBody = bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 480);
  const excerptSuggestion = (plan.suggestedExcerpt ?? "").trim();
  const excerpt =
    excerptSuggestion.length >= 80
      ? excerptSuggestion.slice(0, 500)
      : excerptFromBody.length >= 10
        ? excerptFromBody.slice(0, 500)
        : `${pageTitle.slice(0, 200)}. Draft excerpt; edit before publish.`;
  const aiSuggested = coerceBlogSourceRows(plan.apaSourceStubs as unknown[]);
  const adminSupplied =
    input.sourceRecordsJson ??
    (input.allowGeneratedSourceStubsForPublish ? aiSuggested : []);
  const aiSuggestedForEnvelope = input.allowGeneratedSourceStubsForPublish ? [] : aiSuggested;
  const partition = partitionCitationsForBlog(adminSupplied, aiSuggestedForEnvelope);
  const citationEnvelope = buildCitationEnvelope(partition);
  const apaReferences = partition.apaLines;
  const sourceCheck = partition.sourceCheck;

  const relatedPaths = lessonRowsToRelatedPaths(plan.suggestedInternalLessons, input.country);

  const cta = blogPrimaryStudyCta({
    exam: input.exam,
    country: input.country,
    intent: input.intent,
    funnel: input.funnelStage,
    template: input.template,
  });
  let bodyWithRequiredLinks = appendRequiredStudyLinksBlock({
    bodyHtml,
    exam: input.exam,
    country: input.country,
    relatedPaths,
  });
  bodyWithRequiredLinks = ensureNonEmptyBlogBodyHtmlForPersist(bodyWithRequiredLinks);
  const riskFlags = detectRiskFlags({ template: input.template, keyword: input.targetKeyword ?? input.topic });
  const thinWarning = thinDraftWarning(bodyWithRequiredLinks);

  await persistHooks?.onPersistStage?.("validating_citations");
  const citationGate = evaluateCitationGate({
    riskFlags,
    verifiedCount: partition.verified.length,
    allowInsufficientCitations: Boolean(input.allowInsufficientCitations),
    allowDraftWithoutVerifiedSources: partition.verified.length === 0 && !input.publishImmediately,
  });
  if (!citationGate.ok) {
    return {
      ok: false,
      error: citationGate.message,
      code: citationGate.code,
      riskFlags: citationGate.riskFlags,
    };
  }
  const countryTarget: CountryCode | null =
    input.country === "US" ? CountryCode.US : input.country === "CA" ? CountryCode.CA : null;

  const tagsForSeo = normalizeBlogTagsForStorage(
    input.keywords ? input.keywords.split(",").map((s) => s.trim()).filter(Boolean) : [],
    plan.seoFocusKeywords ?? [],
    12,
  );
  const categoryAssigned = deriveBlogCategoryForPersist({
    keywordCluster: input.keywordCluster,
    template: input.template,
  });

  const faqBlock = { items: Array.isArray(plan.faqs) ? plan.faqs : [] };
  let seoBundle;
  try {
    seoBundle = buildPersistedSeoBundle(plan, slug, tagsForSeo);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[blog-persist] buildPersistedSeoBundle failed; using minimal SEO bundle: ${msg}`);
    seoBundle = buildMinimalSeoBundleFallback(plan, slug, tagsForSeo);
  }
  const seoTitleStored =
    clampSerpTitle((plan.metaTitle ?? "").trim() || pageTitle, 70).slice(0, 200) || pageTitle.slice(0, 70);
  const seoDescriptionStored =
    clampSerpDescription((plan.metaDescription ?? "").trim() || pageTitle, 120, 155).slice(0, 500) ||
    `${pageTitle.slice(0, 120)}. Draft meta description; edit before publish.`.slice(0, 500);
  seoBundle = {
    ...seoBundle,
    openGraphTitle: (seoBundle.openGraphTitle ?? seoTitleStored).slice(0, 120),
    openGraphDescription: (seoBundle.openGraphDescription ?? seoDescriptionStored).slice(0, 200),
    twitterTitle: (seoBundle.twitterTitle ?? plan.twitterCardTitle?.trim() ?? seoTitleStored).slice(0, 120),
    twitterDescription: (seoBundle.twitterDescription ?? plan.twitterCardDescription?.trim() ?? seoDescriptionStored).slice(
      0,
      320,
    ),
  };
  const needsReviewMerged = [
    ...(plan.needsReviewFlags ?? []),
    ...(isLongFormPathophysiologyProfile({ template: input.template, intent: input.intent }) &&
    partition.verified.length === 0
      ? ["apa_source_review_required"]
      : []),
  ];
  const needsReviewFlagsUnique = [...new Set(needsReviewMerged.map((s) => s.trim()).filter(Boolean))].slice(0, 32);

  const generationContractV1: Record<string, unknown> = {
    version: 1,
    primaryKeyword: plan.primaryKeyword?.trim() || null,
    searchIntent: plan.searchIntent?.trim() || null,
    recommendedInternalLinks: plan.recommendedInternalLinks ?? [],
    sourceCandidates: plan.sourceCandidates ?? [],
    needsReviewFlags: needsReviewFlagsUnique,
    schemaNotes: plan.schemaNotes ?? null,
    articleSummary: plan.articleSummary?.trim().slice(0, 2000) || null,
    editorialNotes: plan.editorialNotes ?? [],
  };

  const internalLinkPlanBase: Record<string, unknown> = {
    lessons: plan.suggestedInternalLessons,
    generationContractV1,
    imagePlacements: plan.imagePlacements,
    imageAttachments: [] as BlogImageSlotAttachment[],
    seo: seoBundle,
  };
  const internalLinkPlanInitial = mergePublishingPackageIntoLinkPlanJson(internalLinkPlanBase, {
    version: 1,
    updatedAt: new Date().toISOString(),
    internalAnchorOpportunities: plan.internalAnchorOpportunities ?? [],
    relatedBlogPosts: [],
  });

  const hasAiCitationStubs = partition.excluded.some((e) => e.provenance === "ai_suggested");
  const medicalRiskFlagsForPersist = [...riskFlags];
  const needsApaSourceReviewFlag = hasAiCitationStubs || partition.verified.length === 0;
  if (needsApaSourceReviewFlag && !medicalRiskFlagsForPersist.includes("apa_source_review_required")) {
    medicalRiskFlagsForPersist.push("apa_source_review_required");
  }
  const workflowStatusBase =
    !plan.metaDescription || !pageTitle
      ? BlogWorkflowStatus.NEEDS_METADATA
      : partition.verified.length === 0 && riskFlags.length > 0
        ? BlogWorkflowStatus.NEEDS_SOURCE_REVIEW
        : riskFlags.length > 0
          ? BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW
          : hasAiCitationStubs
            ? BlogWorkflowStatus.NEEDS_SOURCE_REVIEW
            : BlogWorkflowStatus.GENERATED;

  const pathophysiologyQualityIntent = blogIntentForQualityGate(input.template, input.intent);
  const contentQualityIssues = collectBlogContentQualityIssues({
    title: pageTitle,
    body: bodyWithRequiredLinks,
    targetKeyword: input.targetKeyword ?? input.topic,
    postTemplate: input.template,
    intent: pathophysiologyQualityIntent,
    faqBlock: faqBlock as unknown as Prisma.JsonValue,
    apaReferences,
    sourcesJson: citationEnvelope as unknown as Prisma.JsonValue,
  });
  const contentQualityBlocking = contentQualityIssues.filter((i) => i.severity === "block");
  const qualityGateFailed = contentQualityBlocking.length > 0;
  const postStatusForCreate = qualityGateFailed ? BlogPostStatus.NEEDS_REVIEW : BlogPostStatus.DRAFT;
  const workflowStatusForCreate = qualityGateFailed
    ? BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW
    : workflowStatusBase;

  const heroSlot = plan.imagePlacements?.[0];
  let coverImagePrompt: string | null = null;
  let coverImageAlt: string | null = null;
  let coverImageCaption: string | null = null;
  try {
    const genericHero = `Educational nursing blog hero about ${input.topic}.`.slice(0, 2000);
    coverImagePrompt =
      input.includeAiImage && heroSlot
        ? String(heroSlot.promptIdea ?? "").trim().slice(0, 2000) || genericHero
        : input.includeImage
          ? String(heroSlot?.promptIdea ?? "").trim().slice(0, 2000) || genericHero
          : null;
    coverImageAlt = heroSlot?.altIdea != null ? String(heroSlot.altIdea).trim().slice(0, 240) : null;
    coverImageCaption = heroSlot?.captionIdea != null ? String(heroSlot.captionIdea).trim().slice(0, 300) : null;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[blog-persist] featured image metadata assembly failed; continuing with safe fallbacks: ${msg}`);
    coverImagePrompt = input.includeImage
      ? `Educational nursing blog hero about ${input.topic}.`.slice(0, 2000)
      : null;
    coverImageAlt = null;
    coverImageCaption = null;
  }

  try {
    try {
      await assertSeoSafeToCreateBlog(prisma, {
        slug,
        metaTitle: seoTitleStored,
        h1: pageTitle,
      });
    } catch (e) {
      if (e instanceof SeoDuplicateBlockedError) {
        return { ok: false, error: e.message, code: "SEO_DUPLICATE_BLOCKED" };
      }
      throw e;
    }

    const post = await prisma.$transaction(async (tx) => {
      const created = await tx.blogPost.create({
        data: {
          slug,
          title: pageTitle,
          excerpt: excerpt.length >= 10 ? excerpt : `${pageTitle.slice(0, 200)}. Draft excerpt; edit before publish.`,
          body: bodyWithRequiredLinks,
          exam: input.exam,
          category: categoryAssigned,
          targetKeyword: (
            (seoBundle.primaryKeyword && seoBundle.primaryKeyword.trim()) ||
            normalizedTopic ||
            (input.targetKeyword ?? input.topic)
          )
            .toString()
            .slice(0, 200),
          keywordCluster: input.keywordCluster ?? null,
          countryTarget,
          intent: input.intent,
          funnelStage: input.funnelStage,
          postTemplate: input.template,
          postStatus: postStatusForCreate,
          publishAt: null,
          seoTitle: seoTitleStored,
          seoDescription: seoDescriptionStored,
          metaTitleVariant: seoTitleStored,
          metaDescriptionVariant: seoDescriptionStored,
          tags: tagsForSeo,
          outlineJson: (Array.isArray(plan.outline) && plan.outline.length > 0
            ? plan.outline
            : []) as unknown as Prisma.InputJsonValue,
          keyQuestions: (Array.isArray(plan.faqs) ? plan.faqs : []).slice(0, 6).map((f) => f.q),
          keywordPlan: [
            input.targetKeyword ?? input.topic,
            ...(input.keywords ? input.keywords.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8) : []),
          ].filter(Boolean),
          titleAlternates: (Array.isArray(plan.titleOptions) ? plan.titleOptions : [])
            .filter((t) => t && t !== pageTitle)
            .slice(0, 6),
          keyTakeaways: Array.isArray(plan.keyTakeaways) ? plan.keyTakeaways : [],
          faqBlock: faqBlock as unknown as Prisma.InputJsonValue,
          internalLinkPlan: internalLinkPlanInitial as unknown as Prisma.InputJsonValue,
          relatedLessonPaths: relatedPaths,
          schemaSummary: (() => {
            try {
              return buildSchemaSummaryPayload(seoBundle, {
                schemaOpportunities: plan.schemaOpportunities,
                searchIntent: plan.searchIntent?.trim() || null,
                schemaNotes: plan.schemaNotes,
              });
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              console.error(`[blog-persist] buildSchemaSummaryPayload failed; using summary without extras: ${msg}`);
              return buildSchemaSummaryPayload(seoBundle, {});
            }
          })(),
          ctaType: cta.type,
          ctaText: cta.text,
          ctaHref: cta.href,
          workflowStatus: workflowStatusForCreate,
          sourcesJson: citationEnvelope as unknown as Prisma.InputJsonValue,
          apaReferences,
          requiresReferences: Boolean(riskFlags.length > 0 || hasAiCitationStubs || partition.excluded.length > 0),
          sourceReliabilityScore: partition.verified.length ? sourceCheck.reliabilityScore : 0,
          medicalRiskFlags: medicalRiskFlagsForPersist,
          imageStatus: input.includeImage ? (input.includeAiImage ? BlogImageStatus.REQUESTED : BlogImageStatus.NONE) : BlogImageStatus.NONE,
          coverImagePrompt,
          coverImageAlt,
          coverImageCaption,
          featuredSnippet: plan.featuredSnippetHint?.slice(0, 2000) ?? null,
          shortSummary: excerptSuggestion.slice(0, 220) || excerpt.slice(0, 220),
          socialCaption: `${pageTitle.slice(0, 120)}. ${(excerptSuggestion.slice(0, 100) || excerpt.slice(0, 100))}…`,
          promoBlurb: cta.text,
          updateNeeded: Boolean(thinWarning) || qualityGateFailed,
          rankingNote:
            [
              qualityGateFailed
                ? `Draft failed quality review: repeated filler or structural issues detected (${contentQualityBlocking.length}). First: ${contentQualityBlocking[0]?.message ?? ""}`.slice(
                    0,
                    1900,
                  )
                : null,
              thinWarning ?? null,
            ]
              .filter(Boolean)
              .join("\n\n") || null,
          adminPublishLog: seedBlogAdminPublishLog("draft_created", "AI draft created and saved as DRAFT (control panel)."),
        },
        select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
      });

      const relatedBlogPosts = await findRelatedPublishedBlogPosts(
        {
          excludeId: created.id,
          tags: tagsForSeo,
          targetKeyword: input.targetKeyword ?? input.topic,
          exam: input.exam,
        },
        tx,
      );

      const enrichedPlan = mergePublishingPackageIntoLinkPlanJson(internalLinkPlanBase, {
        version: 1,
        updatedAt: new Date().toISOString(),
        internalAnchorOpportunities: plan.internalAnchorOpportunities ?? [],
        relatedBlogPosts,
      });

      await tx.blogPost.update({
        where: { id: created.id },
        data: { internalLinkPlan: enrichedPlan as unknown as Prisma.InputJsonValue },
      });

      const out = await tx.blogPost.findUnique({
        where: { id: created.id },
        select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
      });
      if (!out) {
        throw new Error("persist_missing_row_after_commit");
      }
      return out;
    });

    const warnings = [
      ...sourceCheck.warnings,
      ...(partition.verified.length === 0
        ? ["No verified bibliography entries yet — only admin-supplied, structurally complete sources are cited."]
        : []),
      ...(partition.excluded.filter((e) => e.provenance === "ai_suggested").length > 0
        ? [
            `${partition.excluded.filter((e) => e.provenance === "ai_suggested").length} AI reference stub(s) held for review (not in bibliography).`,
          ]
        : []),
      ...(partition.excluded.filter((e) => e.provenance === "admin_supplied").length > 0
        ? [
            `${partition.excluded.filter((e) => e.provenance === "admin_supplied").length} admin source row(s) excluded (incomplete URL/DOI/source fields).`,
          ]
        : []),
      ...(thinWarning ? [thinWarning] : []),
    ];

    if (qualityGateFailed) {
      return {
        ok: false,
        code: "QUALITY_GATE",
        error: `Draft failed quality review: repeated filler content detected. ${contentQualityBlocking.map((b) => b.message).join("; ")}`.slice(
          0,
          2000,
        ),
        post,
        plan,
        warnings: [
          ...warnings,
          ...contentQualityIssues.map((i) => `${i.severity}:${i.id} — ${i.message}`),
        ],
      };
    }

    if (input.publishImmediately) {
      const publishedNow = new Date();
      try {
        await persistHooks?.onPersistStage?.("prepublish_checks");
        const outputGate = evaluateBlogGenerationOutputGate({
          title: pageTitle,
          slug: post.slug,
          seoTitle: seoTitleStored,
          seoDescription: seoDescriptionStored,
          bodyHtml: bodyWithRequiredLinks,
          template: input.template,
          intent: input.intent,
          mode: "publish_or_schedule",
        });
        if (!outputGate.ok) {
          const reason = outputGate.reasons.join("; ");
          logBlogGenerationRejected(post.slug, reason);
          return {
            ok: false,
            code: "OUTPUT_GATE",
            error: `Generated output failed publication safety checks: ${reason}`.slice(0, 2000),
            post,
            plan,
            warnings: [...warnings, ...outputGate.reasons.map((r) => `output_gate:${r}`)],
          };
        }
        await persistHooks?.onPersistStage?.("publishing");
        const contentDepth = isBlogSeoPillarDepthProfile({ template: input.template, intent: input.intent })
          ? "pillar"
          : "standard";
        await publishGeneratedBlogArticle({
          id: post.id,
        }, {
          publishAt: publishedNow,
          context: "control_panel_immediate",
          minWords: input.minPublishWords,
          contentDepth,
          minReferences: input.minPublishReferences,
          requireApaReferences: true,
          requireInternalLinks: true,
          validateInternalLinks: input.validateInternalLinksBeforePublish !== false,
          paywallSafeLinks: input.paywallSafeLinksBeforePublish !== false,
          requireClinicalSectionDepth: input.requireClinicalSectionDepthOnPublish !== false,
          publishOnlyIfValid: input.publishOnlyIfValid !== false,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("publishBlogPostCanonical: pre-publish") || msg.includes("publishGeneratedBlogArticle: publish blocked")) {
          const forPre = await prisma.blogPost.findUnique({
            where: { id: post.id },
            select: blogPrePublishValidationSelect,
          });
          const preRes = forPre ? await validateBlogPrePublish(forPre, post.id) : null;
          return {
            ok: false,
            code: "PRE_PUBLISH_BLOCKED",
            error: preRes?.blocking.map((b) => b.message).join("; ") ?? msg,
            prePublish: preRes ?? undefined,
            post,
          };
        }
        return { ok: false, error: msg, post };
      }
      const published = await prisma.blogPost.findUnique({
        where: { id: post.id },
        select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
      });
      if (!published) {
        return { ok: false, error: "Post missing after immediate publish update" };
      }
      await persistHooks?.onPersistStage?.("published");
      return { ok: true, skipped: false, post: published, plan, warnings };
    }

    return { ok: true, skipped: false, post, plan, warnings };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: true, skipped: true, reason: "duplicate_slug_race", slug };
    }
    throw e;
  }
}

export type RegenerateSection =
  | "title_options"
  | "meta"
  | "outline"
  | "article_html"
  | "faqs"
  | "internal_links"
  | "apa_sources"
  | "image_placements";

export async function regenerateControlPanelSection(params: {
  section: RegenerateSection;
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  currentPlan?: BlogControlPanelPlan;
  currentBody?: string;
  currentTitle?: string;
  /** OpenAI end-user id (observability); forwarded to completions. */
  openAiUser?: string;
}): Promise<
  | { section: "title_options"; titleOptions: string[] }
  | {
      section: "meta";
      metaTitle: string;
      metaDescription: string;
      recommendedSlug: string;
      suggestedExcerpt?: string;
      openGraphTitle?: string;
      openGraphDescription?: string;
      canonicalPath?: string | null;
      seoFocusKeywords?: string[];
    }
  | { section: "outline"; outline: BlogControlPanelPlan["outline"] }
  | { section: "article_html"; bodyHtml: string }
  | { section: "faqs"; faqs: BlogControlPanelPlan["faqs"] }
  | { section: "internal_links"; suggestedInternalLessons: BlogControlPanelPlan["suggestedInternalLessons"] }
  | { section: "apa_sources"; apaSourceStubs: BlogSourceRecord[] }
  | { section: "image_placements"; imagePlacements: BlogControlPanelPlan["imagePlacements"] }
> {
  const countryLine =
    params.country === "unspecified" ? "Country: general US/CA nursing exams." : `Country: ${params.country}.`;

  if (params.section === "article_html") {
    if (!params.currentPlan) throw new Error("Plan required to regenerate article HTML");
    const bodyHtml = await fetchControlPanelBodyHtml({
      plan: params.currentPlan,
      topic: params.topic,
      exam: params.exam,
      country: params.country,
      template: params.template,
      intent: params.intent,
      funnelStage: params.funnelStage,
      tone: params.tone,
      keywords: params.keywords,
      selectedTitle: params.currentTitle ?? params.currentPlan.h1 ?? params.currentPlan.titleOptions[0] ?? params.topic,
      openAiUser: params.openAiUser,
    });
    return { section: "article_html", bodyHtml };
  }

  const system = `You are a NurseNest blog editor. Return JSON only (no markdown). Be conservative; no fabricated stats.`;

  const sectionPrompts: Record<Exclude<RegenerateSection, "article_html">, string> = {
    title_options: `Return {"titleOptions": string[] } with 4 new title variants for:
Topic: ${params.topic}, exam: ${params.exam}, ${countryLine}, template ${params.template}.`,

    meta: `Return JSON only for topic "${params.topic}", exam ${params.exam}, primary keyword: ${params.keywords ?? params.topic}.
Keys:
- metaTitle: <=60 chars; name a concrete clinical or exam decision this article covers (no generic "nursing guide").
- metaDescription: 120-155 chars; promise must match the article body themes, not boilerplate.
- recommendedSlug: kebab-case, 3-80 chars.
- suggestedExcerpt: 140-220 chars; card/social blurb; must not copy metaDescription verbatim.
- optional openGraphTitle (<=60c), openGraphDescription (<=110c) if tighter than meta fields.
- optional canonicalPath: "/blog/{recommendedSlug}" only when identical to recommendedSlug; else omit.
- optional seoFocusKeywords: string[] length 3-8 (exam + specific clinical terms).
Current: metaTitle=${JSON.stringify(params.currentPlan?.metaTitle ?? "")}, metaDescription=${JSON.stringify((params.currentPlan?.metaDescription ?? "").slice(0, 160))}`,

    outline: `Return {"outline": same shape as before: array of {h2, h3?, bullets?} } with ${
      isLongFormPathophysiologyProfile({ template: params.template, intent: params.intent }) ? "6-10" : "4-6"
    } sections for template ${params.template}, topic ${params.topic}, exam ${params.exam}.
Current outline for reference: ${JSON.stringify(params.currentPlan?.outline ?? [])}`,

    faqs: `Return {"faqs": array of {q,a} } with ${
      isLongFormPathophysiologyProfile({ template: params.template, intent: params.intent }) ? "4-8" : "4-6"
    } new exam-prep FAQs for topic "${params.topic}" (${params.exam}).`,

    internal_links: `Return {"suggestedInternalLessons": array of { label, suggestedPath, rationale?, optional linkKind ("lesson"|"lessons_hub"|"question_bank"|"topic_cluster"|"practice_exams"|"practice_programmatic"|"flashcards_hub"|"adaptive_cat"|"study_plan"|"general") } } — 5-12 **strictly relevant** destinations: lessons, question bank hub, flashcards hub, /practice-exams, adaptive/CAT marketing paths when applicable, topic clusters. No filler. Match audience country (/us/... vs /canada/...).

${getBlogInternalLinkPathHintsForPrompt(params.exam, params.country)}`,

    apa_sources: `Return {"apaSourceStubs": array of source objects } with 3-6 conservative references (authors[], year, title, source, url?, authority?) suitable for nursing exam prep on "${params.topic}".`,

    image_placements: `Return {"imagePlacements": array} with **at least 1** object (never [], null, or omitted). Each object MUST include:
- promptIdea: string, **≥20 characters**, detailed illustration brief (e.g. "nurse assessing patient with heart failure in hospital setting"). Never "", null, or undefined.
- section: string (which part of the article this image supports)
- altIdea: string (≥5 chars, accessibility)
- optional slotKey (e.g. hero, inline_1), optional role ("hero"|"inline"), optional captionIdea
Hero + 1-3 inline ideas for "${params.topic}" (${params.exam}). NurseNest brand: educational, clinically relevant, dignified, inclusive; no gore, no identifiable patients, no real hospital logos. If unsure, output one row with a generic but valid medical illustration prompt (still ≥20 chars on promptIdea).
Current placements for reference: ${JSON.stringify(params.currentPlan?.imagePlacements ?? [])}`,
  };

  const user = sectionPrompts[params.section as Exclude<RegenerateSection, "article_html">];

  const res = await openAiChatCompletion({
    useBlogOpenAiApiKey: true,
    model: getBlogOpenAiChatModel(),
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.4,
    maxTokens: 3000,
    user: params.openAiUser,
  });

  const json = extractJsonObject(res.content) as Record<string, unknown>;
  if (params.section === "image_placements") {
    const primed = normalizeBlogEditorialPlanCandidate(
      { imagePlacements: json.imagePlacements },
      { title: params.topic },
    ) as Record<string, unknown>;
    json.imagePlacements = primed.imagePlacements;
  }

  switch (params.section) {
    case "title_options": {
      const titles = Array.isArray(json.titleOptions) ? json.titleOptions.filter((t): t is string => typeof t === "string") : [];
      if (titles.length < 2) throw new Error("Invalid titleOptions array");
      return { section: "title_options", titleOptions: titles.slice(0, 6) };
    }
    case "meta": {
      const metaRegenSchema = z.object({
        metaTitle: z.string().min(3).max(70),
        metaDescription: z.string().min(20).max(340),
        recommendedSlug: z.string().min(3).max(120),
        suggestedExcerpt: z.string().max(360).optional(),
        openGraphTitle: z.string().max(90).optional(),
        openGraphDescription: z.string().max(200).optional(),
        canonicalPath: z.string().max(220).nullable().optional(),
        seoFocusKeywords: z.array(z.string().min(1).max(80)).max(10).optional(),
      });
      const parsed = metaRegenSchema.safeParse(json);
      if (!parsed.success) throw new Error("Invalid meta payload");
      const m = parsed.data;
      return {
        section: "meta",
        metaTitle: m.metaTitle,
        metaDescription: m.metaDescription,
        recommendedSlug: m.recommendedSlug,
        ...(m.suggestedExcerpt !== undefined ? { suggestedExcerpt: m.suggestedExcerpt } : {}),
        ...(m.openGraphTitle !== undefined ? { openGraphTitle: m.openGraphTitle } : {}),
        ...(m.openGraphDescription !== undefined ? { openGraphDescription: m.openGraphDescription } : {}),
        ...(m.canonicalPath !== undefined ? { canonicalPath: m.canonicalPath } : {}),
        ...(m.seoFocusKeywords !== undefined ? { seoFocusKeywords: m.seoFocusKeywords } : {}),
      };
    }
    case "outline": {
      const outline = json.outline;
      const parsed = z.array(z.object({ h2: z.string(), h3: z.array(z.string()).optional(), bullets: z.array(z.string()).optional() })).safeParse(outline);
      if (!parsed.success) throw new Error("Invalid outline payload");
      return { section: "outline", outline: parsed.data };
    }
    case "faqs": {
      const faqs = json.faqs;
      const parsed = z.array(z.object({ q: z.string(), a: z.string() })).safeParse(faqs);
      if (!parsed.success) throw new Error("Invalid faqs payload");
      return { section: "faqs", faqs: parsed.data };
    }
    case "internal_links": {
      const lessons = json.suggestedInternalLessons;
      const parsed = z.array(blogLessonLinkRowSchema).max(16).safeParse(lessons);
      if (!parsed.success) throw new Error("Invalid internal links payload");
      return {
        section: "internal_links",
        suggestedInternalLessons: normalizePlanSuggestedLessonRows(parsed.data) as BlogControlPanelPlan["suggestedInternalLessons"],
      };
    }
    case "apa_sources": {
      const stubs = Array.isArray(json.apaSourceStubs) ? json.apaSourceStubs : [];
      return { section: "apa_sources", apaSourceStubs: coerceBlogSourceRows(stubs) };
    }
    case "image_placements": {
      const placementRow = z.object({
        slotKey: z.string().min(2).max(48).optional(),
        role: z.enum(["hero", "inline"]).optional(),
        section: z.string().min(1).max(200),
        promptIdea: z.string().min(1).max(500),
        altIdea: z.string().min(1).max(240),
        captionIdea: z.string().max(300).optional(),
      });
      let arr = json.imagePlacements;
      if (!Array.isArray(arr) || arr.length === 0) {
        arr = [
          {
            slotKey: "hero",
            role: "hero",
            section: BLOG_PLAN_FALLBACK_IMAGE_SECTION,
            promptIdea: BLOG_PLAN_FALLBACK_IMAGE_PROMPT_IDEA,
            altIdea: BLOG_PLAN_FALLBACK_IMAGE_ALT_IDEA,
          },
        ];
      }
      const normalized = (arr as unknown[]).map((img) => {
        const row = img && typeof img === "object" ? { ...(img as Record<string, unknown>) } : {};
        const p = typeof row.promptIdea === "string" ? row.promptIdea.trim() : "";
        const promptIdea = p.length >= 10 ? p.slice(0, 500) : BLOG_PLAN_FALLBACK_IMAGE_PROMPT_IDEA;
        const s = typeof row.section === "string" ? row.section.trim() : "";
        const section = s.length >= 1 ? s.slice(0, 200) : BLOG_PLAN_FALLBACK_IMAGE_SECTION;
        const a = typeof row.altIdea === "string" ? row.altIdea.trim() : "";
        const altIdea = a.length >= 5 ? a.slice(0, 240) : BLOG_PLAN_FALLBACK_IMAGE_ALT_IDEA;
        const out: Record<string, unknown> = { section, promptIdea, altIdea };
        if (typeof row.slotKey === "string" && row.slotKey.trim().length >= 2) out.slotKey = row.slotKey.trim().slice(0, 48);
        if (row.role === "hero" || row.role === "inline") out.role = row.role;
        if (typeof row.captionIdea === "string" && row.captionIdea.trim()) {
          out.captionIdea = row.captionIdea.trim().slice(0, 300);
        }
        return out;
      });
      const parsed = z.array(placementRow).min(1).max(10).safeParse(normalized);
      if (!parsed.success) throw new Error("Invalid imagePlacements payload");
      return { section: "image_placements", imagePlacements: parsed.data };
    }
    default:
      throw new Error("Unsupported section");
  }
}

const MIN_PLAN_TITLE_OPTION_CHARS = 3;
const MIN_PLAN_OUTLINE_H2 = 3;

type PlanMaterializedEditorialSection = "title_options" | "meta" | "outline" | "faqs";

function findInvalidMaterializedPlanSections(
  plan: BlogControlPanelPlan,
  input: { template: BlogPostTemplate; intent: BlogPostIntent },
): PlanMaterializedEditorialSection[] {
  const bad: PlanMaterializedEditorialSection[] = [];
  const titles = plan.titleOptions ?? [];
  const goodTitles = titles.filter((t) => typeof t === "string" && t.trim().length >= MIN_PLAN_TITLE_OPTION_CHARS);
  if (goodTitles.length < 2) bad.push("title_options");

  if (
    !plan.metaTitle?.trim() ||
    plan.metaTitle.trim().length < 3 ||
    !plan.metaDescription?.trim() ||
    plan.metaDescription.trim().length < 20 ||
    !plan.recommendedSlug?.trim() ||
    plan.recommendedSlug.trim().length < 3
  ) {
    bad.push("meta");
  }

  const outline = plan.outline ?? [];
  if (!Array.isArray(outline) || outline.length < MIN_PLAN_OUTLINE_H2) bad.push("outline");

  const longform = isLongFormPathophysiologyProfile(input);
  const minFaqs = longform ? 4 : 2;
  const faqs = plan.faqs ?? [];
  const faqsOk =
    Array.isArray(faqs) &&
    faqs.length >= minFaqs &&
    faqs.every((f) => f.q?.trim().length >= 5 && f.a?.trim().length >= 10);
  if (!faqsOk) bad.push("faqs");

  return bad;
}

function mergeControlPanelPlanSectionPatch(
  plan: BlogControlPanelPlan,
  patch: { section: string } & Record<string, unknown>,
): BlogControlPanelPlan {
  switch (patch.section) {
    case "title_options": {
      const titles = patch.titleOptions as string[];
      const h1Next = (titles[0] ?? plan.h1 ?? plan.titleOptions[0] ?? "").trim().slice(0, 200);
      return {
        ...plan,
        titleOptions: titles,
        ...(h1Next.length >= 3 ? { h1: h1Next } : {}),
      };
    }
    case "meta":
      return {
        ...plan,
        metaTitle: patch.metaTitle as string,
        metaDescription: patch.metaDescription as string,
        recommendedSlug: patch.recommendedSlug as string,
        ...(patch.suggestedExcerpt !== undefined ? { suggestedExcerpt: patch.suggestedExcerpt as string } : {}),
        ...(patch.openGraphTitle !== undefined ? { openGraphTitle: patch.openGraphTitle as string } : {}),
        ...(patch.openGraphDescription !== undefined ? { openGraphDescription: patch.openGraphDescription as string } : {}),
        ...(patch.canonicalPath !== undefined ? { canonicalPath: (patch.canonicalPath as string | null) ?? undefined } : {}),
        ...(patch.seoFocusKeywords !== undefined ? { seoFocusKeywords: patch.seoFocusKeywords as string[] } : {}),
      };
    case "outline":
      return { ...plan, outline: patch.outline as BlogControlPanelPlan["outline"] };
    case "faqs":
      return { ...plan, faqs: patch.faqs as BlogControlPanelPlan["faqs"] };
    default:
      return plan;
  }
}

async function repairMaterializedPlanSectionsOnce(
  plan: BlogControlPanelPlan,
  input: ControlPanelGenerateInput,
  opts?: { openAiUser?: string },
): Promise<BlogControlPanelPlan> {
  let current = plan;
  const firstBad = findInvalidMaterializedPlanSections(current, input);
  if (firstBad.length === 0) return current;

  for (const section of firstBad) {
    const patch = await regenerateControlPanelSection({
      section,
      topic: input.topic,
      exam: input.exam,
      country: input.country,
      template: input.template,
      intent: input.intent,
      funnelStage: input.funnelStage,
      tone: input.tone,
      keywords: input.keywords,
      currentPlan: current,
      openAiUser: opts?.openAiUser ? `${opts.openAiUser}:section-repair:${section}` : undefined,
    });
    current = mergeControlPanelPlanSectionPatch(current, patch as { section: string } & Record<string, unknown>);
  }

  const stillBad = findInvalidMaterializedPlanSections(current, input);
  if (stillBad.length > 0) {
    throw new BlogControlPanelPlanError(
      "PLAN_ZOD",
      `Editorial plan invalid after targeted regeneration; sections still failing: ${stillBad.join(", ")}.`,
      { sections: stillBad },
    );
  }
  return current;
}
