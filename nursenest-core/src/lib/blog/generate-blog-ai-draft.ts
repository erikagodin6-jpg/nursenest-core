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
import { getBlogOpenAiChatModel } from "@/lib/ai/openai-env";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { BLOG_TEMPLATE_TITLE_PATTERNS } from "@/lib/blog/blog-template-copy";
import { buildApa7References, type BlogSourceRecord, validateSources } from "@/lib/blog/apa7";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { normalizeBlogTopicIntent } from "@/lib/blog/blog-seo-topic-intent";
import type { BlogLessonLinkRow } from "@/lib/blog/blog-control-panel-schema";
import { fetchSimpleDraftStudyLinks } from "@/lib/blog/blog-simple-draft-study-links";
import { blogPrimaryStudyCta } from "@/lib/blog/blog-study-cta";
import { buildOutline, detectRiskFlags, thinDraftWarning } from "@/lib/blog/seo-campaign-engine";
import {
  devAssertPublishedWritePayloadAligned,
  normalizeBlogPostStatusWriteFields,
} from "@/lib/blog/blog-post-published-state";
import { prisma } from "@/lib/db";
import { BLOG_ARTICLE_MIN_WORDS, countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { coerceAdminOptionalSlugFromRawInput } from "@/lib/blog/blog-optional-slug";
import { prepareAdminBlogGenerationInput } from "@/lib/blog/admin-blog-generation-service";
import { ensureUniqueBlogPostSlug } from "@/lib/blog/blog-optional-slug.server";
import {
  generateBlogSEO,
  normalizeCountryForBlogSeo,
  normalizeExamForBlogSeo,
} from "@/lib/blog/blog-generate-seo";
import { classifyStrings } from "@/lib/taxonomy/classifier";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";
import {
  assertSeoSafeToCreateBlog,
  ensureUniqueTaxonomyTerminalSlug,
  SeoDuplicateBlockedError,
} from "@/lib/seo/seo-duplicate-guard";
import { generateSeo, assertRequiredSeoFieldsPresent } from "@/lib/seo/seo-generator";
import {
  mapExamStringToSeoTier,
  seoDomainForTaxonomyCategory,
  type SeoContentDomain,
} from "@/lib/seo/seo-taxonomy-align";
import {
  buildSeoBundleForSimpleAiDraft,
  clampSerpDescription,
  clampSerpTitle,
  normalizeBlogTagsForStorage,
} from "@/lib/blog/blog-seo-package";
import { buildSchemaSummaryPayload } from "@/lib/blog/blog-seo-automation";
import {
  BLOG_BODY_REPAIR_WORD_BUFFER,
  MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS,
  isTransientBlogProviderError,
} from "@/lib/blog/blog-generation-repair-classifier";
import {
  repairSimpleAiDraftBodyHtml,
  repairSimpleAiDraftHeadlines,
} from "@/lib/blog/blog-generation-repair-ai";

export type GenerateBlogAiDraftInput = {
  topic: string;
  keywords?: string;
  exam: string;
  country?: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent?: BlogPostIntent;
  funnelStage?: BlogFunnelStage;
  tone?: "professional" | "supportive" | "direct";
  includeImage?: boolean;
  includeAiImage?: boolean;
  targetKeyword?: string;
  keywordCluster?: string;
  countryTarget?: "CA" | "US";
  sourceRecords?: BlogSourceRecord[];
  slug?: string;
  /**
   * When set, post is created as SCHEDULED (future) or PUBLISHED (past/now) instead of DRAFT.
   * Used by batch topic scheduler; manual generator omits this.
   */
  publishAt?: Date;
  /**
   * When true, skips canonical-intent dedupe (`findExistingBlogByCanonicalIntent`). Slug uniqueness still enforced.
   * Use only when an admin explicitly accepts duplicate topic coverage (e.g. variant angles).
   */
  allowDuplicateCanonicalTopic?: boolean;
  /** OpenAI `user` / trace id (e.g. batchId:itemId). */
  generationIdempotencyKey?: string;
};

export type GenerateBlogAiDraftResult =
  | {
      ok: true;
      skipped: true;
      reason: "duplicate_slug" | "duplicate_topic" | "duplicate_slug_race";
      slug?: string;
      existingSlug?: string;
      normalizedTopic?: string;
    }
  | {
      ok: true;
      skipped: false;
      post: { id: string; slug: string; title: string; postStatus: BlogPostStatus; updatedAt: Date };
      warnings: string[];
    }
  | {
      ok: false;
      error: string;
      repairPassesUsed?: number;
      /** Matches {@link PipelineFailureLike.stage} for classifier routing. */
      stage?: "body" | "seo_title" | "plan" | "persist";
      /** Machine-readable failure code for the classifier. */
      code?: string;
      /** Structured details for the classifier (e.g. PRE_PUBLISH_BLOCKED prePublish result). */
      details?: unknown;
    };

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function repairBackoffMs(idx: number): number {
  const base = Math.min(
    30_000,
    Math.max(800, Number(process.env.BLOG_REPAIR_BACKOFF_BASE_MS?.trim()) || 1200),
  );
  return Math.min(30_000, Math.floor(base * Math.pow(2, Math.max(0, idx))));
}

function resolvePostStatusForPublishAt(publishAt: Date | undefined, now: Date): { postStatus: BlogPostStatus; publishAt: Date | null } {
  if (!publishAt) {
    return { postStatus: BlogPostStatus.DRAFT, publishAt: null };
  }
  if (publishAt.getTime() > now.getTime()) {
    return { postStatus: BlogPostStatus.SCHEDULED, publishAt };
  }
  return { postStatus: BlogPostStatus.PUBLISHED, publishAt };
}

/**
 * Core AI blog draft creation (shared by `/api/admin/blog/generate-ai` and batch schedulers).
 * Enforces slug + canonical intent dedupe via {@link findExistingBlogByCanonicalIntent}.
 */
export async function generateBlogAiDraft(d: GenerateBlogAiDraftInput): Promise<GenerateBlogAiDraftResult> {
  const topicIntent = normalizeBlogTopicIntent(d.topic, d.exam);
  if (!topicIntent.accepted) {
    return {
      ok: false,
      error: `topic_intent_rejected: ${topicIntent.reason}`,
      stage: "plan",
      code: "TOPIC_INTENT_REJECTED",
    };
  }
  const effectiveTopic = topicIntent.normalizedTopic;
  console.info("[blog_topic_normalized]", {
    rawTopic: d.topic,
    normalizedTopic: effectiveTopic,
    clinicalDomain: topicIntent.clinicalDomain,
    bodySystem: topicIntent.bodySystem ?? null,
    nclexCategory: topicIntent.nclexCategory ?? null,
  });

  const prepared = await prepareAdminBlogGenerationInput({
    rawTitle: effectiveTopic,
    exam: d.exam,
    targetKeyword: effectiveTopic,
    fixedSlug: d.slug,
    publishMode: d.publishAt ? "schedule" : "draft",
    scheduledAt: d.publishAt,
  });
  const normalizedTopic = prepared.normalizedTopic || normalizeBlogTopicKey(effectiveTopic);
  const now = new Date();

  const titleFn = BLOG_TEMPLATE_TITLE_PATTERNS[d.template];
  const templateTitle = titleFn({ exam: d.exam, topic: effectiveTopic });
  const countryTargetResolved =
    d.countryTarget ??
    (d.country === "CA" ? CountryCode.CA : d.country === "US" ? CountryCode.US : null);

  const classified = classifyStrings({
    title: templateTitle,
    content: `${effectiveTopic}\n${d.keywords ?? ""}\n${d.keywordCluster ?? ""}`,
  });
  let taxonomyCategory = classified.category;
  if (taxonomyCategory === REVIEW_REQUIRED) {
    taxonomyCategory = "study_strategy";
  }
  const seoDomain: SeoContentDomain = seoDomainForTaxonomyCategory(taxonomyCategory);
  const tier = mapExamStringToSeoTier(d.exam);
  const kwList = d.keywords
    ? d.keywords.split(",").map((s) => s.trim()).filter(Boolean)
    : [effectiveTopic].filter(Boolean);
  const taxonomySeo = generateSeo({
    title: templateTitle,
    category: taxonomyCategory,
    domain: seoDomain,
    keywords: kwList,
    tier,
  });
  assertRequiredSeoFieldsPresent({
    slug: taxonomySeo.slug,
    metaTitle: taxonomySeo.metaTitle,
    metaDescription: taxonomySeo.metaDescription,
    breadcrumb: taxonomySeo.breadcrumb,
  });

  const explicitRaw = typeof prepared.uniqueSlug === "string" ? prepared.uniqueSlug.trim() : "";
  const explicit = explicitRaw ? coerceAdminOptionalSlugFromRawInput(prepared.uniqueSlug) : null;
  const base = explicit ?? prepared.uniqueSlug ?? taxonomySeo.slug;
  if (!explicit) {
    console.info("[blog] slug auto-generated", { base, topic: effectiveTopic, exam: d.exam });
  }
  const slug = explicit
    ? await ensureUniqueBlogPostSlug(base)
    : await ensureUniqueTaxonomyTerminalSlug(prisma, base);

  let headlineH1 = taxonomySeo.h1.trim();
  let headlineMetaTitle = taxonomySeo.metaTitle.trim();
  let seoRepairPasses = 0;
  for (;;) {
    try {
      await assertSeoSafeToCreateBlog(prisma, { slug, metaTitle: headlineMetaTitle, h1: headlineH1 });
      break;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!(e instanceof SeoDuplicateBlockedError)) throw e;
      if (seoRepairPasses >= MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS - 1) {
        return { ok: false, error: msg, repairPassesUsed: seoRepairPasses, stage: "seo_title", code: "SEO_DUPLICATE_BLOCKED" };
      }
      const repaired = await repairSimpleAiDraftHeadlines({
        topic: effectiveTopic,
        exam: d.exam,
        template: d.template,
        country: d.country,
        blockedReason: msg,
        priorH1: headlineH1,
        priorMetaTitle: headlineMetaTitle,
        openAiUser: d.generationIdempotencyKey
          ? `${d.generationIdempotencyKey}:seo-headline:${seoRepairPasses}`.slice(0, 120)
          : undefined,
      });
      if (!repaired) {
        return { ok: false, error: msg, repairPassesUsed: seoRepairPasses, stage: "seo_title", code: "SEO_DUPLICATE_BLOCKED" };
      }
      headlineH1 = repaired.h1;
      headlineMetaTitle = repaired.metaTitle;
      seoRepairPasses += 1;
      await sleepMs(repairBackoffMs(seoRepairPasses - 1));
    }
  }

  const autoSeo = generateBlogSEO({
    title: templateTitle,
    topic: effectiveTopic,
    exam: normalizeExamForBlogSeo(d.exam),
    country: normalizeCountryForBlogSeo(countryTargetResolved),
    existingSlug: slug,
  });
  const title = headlineH1.slice(0, 220);
  const seoTitle = clampSerpTitle(headlineMetaTitle, 70).slice(0, 200);
  const seoDescription = clampSerpDescription(taxonomySeo.metaDescription, 120, 155).slice(0, 500);
  if (!d.allowDuplicateCanonicalTopic) {
    const dupByTopic = normalizedTopic
      ? await findExistingBlogByCanonicalIntent({ exam: d.exam, normalizedTopic })
      : null;
    if (dupByTopic) {
      return {
        ok: true,
        skipped: true,
        reason: "duplicate_topic",
        existingSlug: dupByTopic.slug,
        normalizedTopic,
      };
    }
  }

  const system = `You write SEO-aware HTML for NurseNest nursing education blog posts. Output valid HTML only: use <h2>, <h3>, <p>, <ul>, <li>, <strong>. No markdown. No fabricated statistics or pass-rate claims. Be accurate and conservative. Audience: nursing students preparing for licensure exams.
Include a short "Key takeaways" section and a short FAQ section when natural.
Do not include medical treatment advice beyond educational exam prep framing.
When you cite or summarize external evidence-style claims, keep tone educational; if a References section is included, use APA 7-style reference list formatting (hanging indent style via paragraph text is acceptable in HTML).`;

  const user = `Write the article body (HTML only, no outer <html>).

Template: ${d.template}
Intent: ${d.intent ?? "EXAM_PREP"}
Funnel stage: ${d.funnelStage ?? "CONSIDERATION"}
Exam focus: ${d.exam}
${d.country && d.country !== "unspecified" ? `Country context: ${d.country}` : ""}
Topic: ${effectiveTopic}
${d.keywords ? `Keywords / phrases: ${d.keywords}` : ""}
Primary target keyword: ${effectiveTopic}
${d.keywordCluster ? `Keyword cluster: ${d.keywordCluster}` : ""}
Tone: ${d.tone ?? "professional"}

Length: aim for at least ${BLOG_ARTICLE_MIN_WORDS} words of substantive, non-repetitive body content (excluding filler).

Include:
- A short intro paragraph
- 5–8 H2 sections (use H3 where helpful) with practical, exam-relevant guidance
- At least one bullet list where helpful
- A closing paragraph with a soft CTA to practice (no fake guarantees)

Title (for context only, do not repeat as H1 in body): ${title}`;

  let bodyHtml: string;
  try {
    const response = await openAiChatCompletion({
      useBlogOpenAiApiKey: true,
      model: getBlogOpenAiChatModel(),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.45,
      maxTokens: 8192,
      user: d.generationIdempotencyKey ? `${d.generationIdempotencyKey}:body:0`.slice(0, 120) : undefined,
    });
    bodyHtml = response.content.trim();
    if (bodyHtml.length < 200) {
      return {
        ok: false,
        error: "Model returned too little content",
        repairPassesUsed: seoRepairPasses,
        stage: "body",
        code: "BODY_TOO_LITTLE_CONTENT",
      };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: msg,
      repairPassesUsed: seoRepairPasses,
      stage: "body",
      // transient overloads are recoverable; hard errors remain generic body failures
      code: isTransientBlogProviderError(msg) ? "TRANSIENT_PROVIDER_ERROR" : undefined,
    };
  }

  const countryForLinks = d.country ?? "unspecified";
  let studyAppendix = "";
  let studyRows: BlogLessonLinkRow[] = [];
  let studyRelatedPaths: string[] = [];
  try {
    const study = await fetchSimpleDraftStudyLinks({
      topic: effectiveTopic,
      exam: d.exam,
      country: countryForLinks,
      targetKeyword: effectiveTopic,
      keywords: d.keywords,
      bodyPreview: bodyHtml,
    });
    studyRows = study.rows;
    studyRelatedPaths = study.relatedPaths;
    studyAppendix = study.appendixHtml;
  } catch {
    studyAppendix = "";
    studyRows = [];
    studyRelatedPaths = [];
  }

  let bodyWithStudy =
    studyAppendix && !bodyHtml.includes("Study next in NurseNest") ? `${bodyHtml.trim()}\n${studyAppendix}` : bodyHtml;

  let wordCount = countWordsFromHtml(bodyWithStudy);
  let bodyRepairPasses = 0;
  while (wordCount < BLOG_ARTICLE_MIN_WORDS && bodyRepairPasses < MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS) {
    await sleepMs(repairBackoffMs(bodyRepairPasses));
    bodyRepairPasses += 1;
    try {
      const expandedMain = await repairSimpleAiDraftBodyHtml({
        topic: effectiveTopic,
        exam: d.exam,
        template: d.template,
        intent: d.intent,
        funnelStage: d.funnelStage,
        country: d.country,
        keywords: d.keywords,
        targetKeyword: effectiveTopic,
        keywordCluster: d.keywordCluster,
        tone: d.tone,
        currentHtml: bodyHtml,
        currentWordCount: wordCount,
        targetWordMin: BLOG_ARTICLE_MIN_WORDS + BLOG_BODY_REPAIR_WORD_BUFFER,
        openAiUser: d.generationIdempotencyKey
          ? `${d.generationIdempotencyKey}:body-repair:${bodyRepairPasses}`.slice(0, 120)
          : undefined,
      });
      bodyHtml = expandedMain;
      bodyWithStudy =
        studyAppendix && !bodyHtml.includes("Study next in NurseNest") ? `${bodyHtml.trim()}\n${studyAppendix}` : bodyHtml;
      wordCount = countWordsFromHtml(bodyWithStudy);
    } catch {
      // repair call failed; count attempt consumed and try again or exit loop
    }
  }

  const totalRepairPasses = seoRepairPasses + bodyRepairPasses;
  if (wordCount < BLOG_ARTICLE_MIN_WORDS) {
    return {
      ok: false,
      error: `Article body too short (${wordCount} words; minimum ${BLOG_ARTICLE_MIN_WORDS}).`,
      repairPassesUsed: totalRepairPasses,
      stage: "body",
      code: "BODY_TOO_SHORT",
    };
  }

  let excerpt = bodyWithStudy.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 480);
  if (excerpt.length < 80) {
    excerpt = `${autoSeo.intro} ${excerpt}`.replace(/\s+/g, " ").trim().slice(0, 480);
  }
  const primaryKw = effectiveTopic.trim().slice(0, 160);
  const fallbackTopicTag = normalizeBlogTopicKey(effectiveTopic)?.replace(/-/g, " ") ?? effectiveTopic;
  const tags = normalizeBlogTagsForStorage(
    d.keywords ? d.keywords.split(",").map((s) => s.trim()).filter(Boolean) : [d.exam, fallbackTopicTag],
    [d.exam, primaryKw],
    12,
  );
  const categoryAssigned = taxonomyCategory;
  const seoBundle = buildSeoBundleForSimpleAiDraft({
    slug,
    h1: title,
    seoTitle,
    seoDescription,
    excerpt: excerpt.slice(0, 500),
    tags,
    primaryKeyword: primaryKw,
    emitFaqSchema: false,
  });
  const sources = (d.sourceRecords ?? []) as BlogSourceRecord[];
  const apaReferences = buildApa7References(sources);
  const sourceCheck = validateSources(sources);
  const outline = buildOutline({
    title,
    targetKeyword: effectiveTopic,
    intent: d.intent ?? BlogPostIntent.EXAM_PREP,
    template: d.template,
  });
  const countryForCta = d.country ?? "unspecified";
  const cta = blogPrimaryStudyCta({
    exam: d.exam,
    country: countryForCta,
    intent: d.intent,
    funnel: d.funnelStage,
    template: d.template,
  });
  const riskFlags = detectRiskFlags({ template: d.template, keyword: effectiveTopic });
  const thinWarning = thinDraftWarning(bodyWithStudy);
  const workflowStatusBase =
    !seoDescription || !title ? BlogWorkflowStatus.NEEDS_METADATA :
    sources.length === 0 && riskFlags.length > 0 ? BlogWorkflowStatus.NEEDS_SOURCE_REVIEW :
    riskFlags.length > 0 ? BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW :
    BlogWorkflowStatus.GENERATED;

  const dupSlugLate = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
  if (dupSlugLate) {
    return { ok: true, skipped: true, reason: "duplicate_slug", slug };
  }
  if (!d.allowDuplicateCanonicalTopic) {
    const dupTopicLate =
      normalizedTopic && (await findExistingBlogByCanonicalIntent({ exam: d.exam, normalizedTopic }));
    if (dupTopicLate) {
      return {
        ok: true,
        skipped: true,
        reason: "duplicate_topic",
        existingSlug: dupTopicLate.slug,
        normalizedTopic,
      };
    }
  }

  const { postStatus: resolvedPs, publishAt: resolvedPa } = resolvePostStatusForPublishAt(d.publishAt, now);
  const statusWrite = normalizeBlogPostStatusWriteFields({
    postStatus: resolvedPs,
    publishAt: resolvedPa,
    draftWorkflow: workflowStatusBase,
  });
  devAssertPublishedWritePayloadAligned({
    postStatus: statusWrite.postStatus,
    workflowStatus: statusWrite.workflowStatus,
    label: "generateBlogAiDraftPersist",
  });

  try {
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt: excerpt.length >= 10 ? excerpt : `${title.slice(0, 200)}. Draft excerpt; edit before publish.`,
        body: bodyWithStudy,
        exam: d.exam,
        targetKeyword: primaryKw || normalizedTopic || effectiveTopic,
        keywordCluster: d.keywordCluster ?? null,
        category: categoryAssigned,
        countryTarget: countryTargetResolved,
        intent: d.intent ?? BlogPostIntent.EXAM_PREP,
        funnelStage: d.funnelStage ?? BlogFunnelStage.CONSIDERATION,
        postTemplate: d.template,
        postStatus: statusWrite.postStatus,
        publishAt: statusWrite.publishAt,
        seoTitle,
        seoDescription,
        metaTitleVariant: seoTitle,
        metaDescriptionVariant: seoDescription,
        tags,
        outlineJson: outline,
        keyQuestions: taxonomySeo.faq.map((f) => f.q).slice(0, 8),
        keywordPlan: [
          primaryKw,
          ...(d.keywords ? d.keywords.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8) : []),
        ].filter(Boolean),
        relatedLessonPaths: studyRelatedPaths,
        internalLinkPlan: {
          lessons: studyRows,
          imagePlacements: [],
          imageAttachments: [],
          seo: seoBundle,
        } as Prisma.InputJsonValue,
        schemaSummary: buildSchemaSummaryPayload(seoBundle, {}),
        ctaType: cta.type,
        ctaText: cta.text,
        ctaHref: cta.href,
        workflowStatus: statusWrite.workflowStatus,
        sourcesJson: sources.length ? (sources as Prisma.InputJsonValue) : Prisma.JsonNull,
        apaReferences,
        requiresReferences: Boolean(sources.length || riskFlags.length > 0),
        sourceReliabilityScore: sourceCheck.reliabilityScore,
        medicalRiskFlags: riskFlags,
        imageStatus: d.includeImage ? (d.includeAiImage ? BlogImageStatus.REQUESTED : BlogImageStatus.NONE) : BlogImageStatus.NONE,
        coverImagePrompt: d.includeAiImage ? `Educational nursing blog hero image about ${effectiveTopic}. Focus keyword: ${effectiveTopic}.` : null,
        shortSummary: excerpt.slice(0, 220),
        socialCaption: `${title}. ${excerpt.slice(0, 120)}...`,
        promoBlurb: cta.text,
        updateNeeded: Boolean(thinWarning),
        rankingNote: thinWarning ?? null,
      },
      select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
    });

    return {
      ok: true,
      skipped: false,
      post,
      warnings: [...sourceCheck.warnings, ...(thinWarning ? [thinWarning] : [])],
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: true, skipped: true, reason: "duplicate_slug_race", slug };
    }
    throw e;
  }
}

/**
 * Canonical entrypoint for creating AI blog posts.
 * Kept as a stable alias while older call-sites still reference `generateBlogAiDraft`.
 */
export async function generateBlogPost(d: GenerateBlogAiDraftInput): Promise<GenerateBlogAiDraftResult> {
  return generateBlogAiDraft(d);
}
