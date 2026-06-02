import "./../src/lib/db/script-env-bootstrap";

import { BlogFunnelStage, BlogImageStatus, BlogPostIntent, BlogPostStatus, BlogPostTemplate, CountryCode } from "@prisma/client";
import {
  assertOpenAiKeyConfigured,
  getBlogGenerationModelLabelForLogs,
  getBlogGenerationProviderLabelForLogs,
  primeBlogCliOpenAiIntegrationKey,
} from "@/lib/ai/openai-env";
import { buildDefaultBatchInternalLessonLinkStubs } from "@/lib/blog/blog-generated-publish-gates";
import { parseBlogBatchCliArgs, resolveBatchPathway, selectBatchTopics } from "@/lib/blog/blog-batch-cli";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import { blogPrePublishValidationSelect } from "@/lib/blog/blog-pre-publish-validation";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { validateGeneratedBlogPublishEligibility } from "@/lib/blog/publish-generated-blog-article";
import { prisma } from "@/lib/db";

type BatchRow = {
  title: string;
  slug: string;
  status: string;
  publishedAt: string;
  url: string;
  validation: string;
  blockedReason: string;
  targetPathway: string;
};

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nursenest.ca").replace(/\/$/, "");

function buildInput(
  topic: string,
  exam: string,
  country: "US" | "CA" | "unspecified",
  publish: boolean,
  minWords: number,
  minReferences: number,
  validateInternalLinks: boolean,
  publishOnlyIfValid: boolean,
  paywallSafeLinks: boolean,
  includeFaqs: boolean,
  includeClinicalPearls: boolean,
) {
  const kw = topic.slice(0, 200);
  return {
    topic,
    exam,
    country,
    keywords: kw,
    targetKeyword: kw,
    template: BlogPostTemplate.TOPIC_EXPLAINED,
    intent: BlogPostIntent.STUDY_STRATEGY,
    funnelStage: BlogFunnelStage.CONSIDERATION,
    tone: "professional" as const,
    includeImage: false,
    includeAiImage: false,
    publishImmediately: publish,
    allowInsufficientCitations: false,
    allowGeneratedSourceStubsForPublish: true,
    minPublishReferences: minReferences,
    minPublishWords: minWords,
    validateInternalLinksBeforePublish: validateInternalLinks,
    publishOnlyIfValid,
    paywallSafeLinksBeforePublish: paywallSafeLinks,
    requireClinicalSectionDepthOnPublish: true,
    includeFaqsInBody: includeFaqs,
    includeClinicalPearlsInBody: includeClinicalPearls,
  };
}

async function main(): Promise<void> {
  primeBlogCliOpenAiIntegrationKey();
  console.log(`Provider: ${getBlogGenerationProviderLabelForLogs()}`);
  console.log(`Model: ${getBlogGenerationModelLabelForLogs()}`);

  const keyGate = assertOpenAiKeyConfigured({ pipeline: "blog" });
  if (!keyGate.ok) {
    console.error(`[run-blog-batch] ${keyGate.message}`);
    process.exitCode = 1;
    return;
  }

  const args = parseBlogBatchCliArgs(process.argv);
  const pathway = resolveBatchPathway(args.pathwayId);
  const topics = selectBatchTopics({ count: args.count, strategy: args.strategy });
  const rows: BatchRow[] = [];
  let failed = false;

  console.log(
    `batch count=${args.count} pathway=${pathway.pathwayId} strategy=${args.strategy} dryRun=${args.dryRun} publish=${args.publish} minWords=${args.minWords} includeFaqs=${args.includeFaqs} includeClinicalPearls=${args.includeClinicalPearls} paywallSafeLinks=${args.paywallSafeLinks}`,
  );

  for (let index = 0; index < topics.length; index++) {
    const topic = topics[index]!;
    console.log(`\n[${index + 1}/${topics.length}] ${topic}`);
    const input = buildInput(
      topic,
      pathway.exam,
      pathway.country,
      args.publish && !args.dryRun,
      args.minWords,
      args.minReferences,
      args.validateInternalLinks,
      args.publishOnlyIfValid,
      args.paywallSafeLinks,
      args.includeFaqs,
      args.includeClinicalPearls,
    );
    const pipeline = await runBlogArticleGenerationPipeline(input, {
      persist: !args.dryRun,
      substantiveWordMinOverride: args.minWords,
      idempotencyKey: `run-blog-batch:${Date.now()}:${index}`,
    });

    if (!pipeline.ok) {
      failed = true;
      rows.push({
        title: topic,
        slug: pipeline.plan?.recommendedSlug ?? "",
        status: "failed_pipeline",
        publishedAt: "",
        url: pipeline.plan?.recommendedSlug ? `${SITE_ORIGIN}/blog/${pipeline.plan.recommendedSlug}` : "",
        validation: pipeline.code ?? pipeline.stage,
        blockedReason: pipeline.error,
        targetPathway: pathway.pathwayId,
      });
      continue;
    }

    const proposedTitle = pipeline.plan.h1 || pipeline.plan.titleOptions[0] || topic;
    const proposedSlug = pipeline.plan.recommendedSlug;
    const mergedLessonLinks = buildDefaultBatchInternalLessonLinkStubs(pipeline.plan, pathway.exam, pathway.country);
    const dryValidation = await validateGeneratedBlogPublishEligibility(
      {
        id: "dry-run",
        slug: proposedSlug,
        title: proposedTitle,
        excerpt: pipeline.plan.suggestedExcerpt ?? proposedTitle,
        body: pipeline.bodyHtml,
        exam: pathway.exam,
        category: pipeline.plan.breadcrumbs[2]?.label ?? "Exam strategy",
        tags: pipeline.plan.seoFocusKeywords ?? [],
        seoTitle: pipeline.plan.metaTitle,
        seoDescription: pipeline.plan.metaDescription,
        metaTitleVariant: pipeline.plan.metaTitle,
        metaDescriptionVariant: pipeline.plan.metaDescription,
        requiresReferences: args.requireApaReferences,
        apaReferences: (pipeline.plan.apaSourceStubs ?? []).map((row) => {
          const title = typeof row.title === "string" ? row.title : "Untitled source";
          const year = typeof row.year === "string" ? row.year : "n.d.";
          const source = typeof row.source === "string" ? row.source : "NurseNest source review";
          const url = typeof row.url === "string" ? row.url : "";
          return `${title}. (${year}). ${source}.${url ? ` ${url}` : ""}`.trim();
        }),
        sourcesJson: pipeline.plan.apaSourceStubs ?? [],
        internalLinkPlan: {
          lessons: mergedLessonLinks,
          imagePlacements: pipeline.plan.imagePlacements,
          imageAttachments: [],
          seo: {
            version: 1,
            normalizedBreadcrumbs: pipeline.plan.breadcrumbs,
            suggestedExcerpt: pipeline.plan.suggestedExcerpt,
            emitFaqSchema: false,
            focusKeywords: pipeline.plan.seoFocusKeywords ?? [],
            primaryKeyword: pipeline.plan.primaryKeyword ?? topic,
            imageAlts: [],
          },
        },
        outlineJson: pipeline.plan.outline,
        faqBlock: { items: pipeline.plan.faqs },
        schemaSummary: JSON.stringify({ breadcrumbs: pipeline.plan.breadcrumbs, emitFaqSchema: false }),
        coverImage: null,
        coverImageAlt: null,
        coverImageCaption: null,
        coverImagePrompt: null,
        imageStatus: BlogImageStatus.NONE,
        countryTarget: pathway.country === "CA" ? CountryCode.CA : pathway.country === "US" ? CountryCode.US : null,
        postStatus: BlogPostStatus.DRAFT,
        postTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
        intent: BlogPostIntent.STUDY_STRATEGY,
        targetKeyword: topic,
        medicalRiskFlags: [],
      } as never,
      "dry-run",
      {
        minWords: args.minWords,
        requireApaReferences: args.requireApaReferences,
        minReferences: args.minReferences,
        requireInternalLinks: args.requireInternalLinks,
        validateInternalLinks: args.validateInternalLinks,
        publishOnlyIfValid: args.publishOnlyIfValid,
        paywallSafeLinks: args.paywallSafeLinks,
        requireClinicalSectionDepth: true,
        prisma,
      },
    );

    if (args.dryRun) {
      if (!dryValidation.ok) failed = true;
      rows.push({
        title: proposedTitle,
        slug: proposedSlug,
        status: "dry_run",
        publishedAt: "",
        url: `${SITE_ORIGIN}/blog/${proposedSlug}`,
        validation: dryValidation.ok ? "eligible" : "blocked",
        blockedReason: dryValidation.reasons.join("; "),
        targetPathway: pathway.pathwayId,
      });
      continue;
    }

    const persisted = pipeline.persist?.post;
    if (!persisted) {
      failed = true;
      rows.push({
        title: proposedTitle,
        slug: proposedSlug,
        status: "failed_persist",
        publishedAt: "",
        url: `${SITE_ORIGIN}/blog/${proposedSlug}`,
        validation: "blocked",
        blockedReason: "Pipeline succeeded but no persisted post was returned.",
        targetPathway: pathway.pathwayId,
      });
      continue;
    }

    if (persisted.postStatus !== BlogPostStatus.PUBLISHED) {
      const dbRow = await prisma.blogPost.findUnique({
        where: { id: persisted.id },
        select: {
          id: true,
          slug: true,
          title: true,
          publishAt: true,
          ...blogPrePublishValidationSelect,
        },
      });
      let reason = "Post remained draft.";
      if (dbRow) {
        const eligibility = await validateGeneratedBlogPublishEligibility(dbRow as never, persisted.id, {
          minWords: args.minWords,
          requireApaReferences: args.requireApaReferences,
          minReferences: args.minReferences,
          requireInternalLinks: args.requireInternalLinks,
          validateInternalLinks: args.validateInternalLinks,
          publishOnlyIfValid: args.publishOnlyIfValid,
          paywallSafeLinks: args.paywallSafeLinks,
          requireClinicalSectionDepth: true,
          prisma,
        });
        reason = eligibility.reasons.join("; ") || reason;
      }
      failed = true;
      rows.push({
        title: persisted.title,
        slug: persisted.slug,
        status: "draft",
        publishedAt: "",
        url: `${SITE_ORIGIN}/blog/${persisted.slug}`,
        validation: "blocked",
        blockedReason: reason,
        targetPathway: pathway.pathwayId,
      });
      continue;
    }

    rows.push({
      title: persisted.title,
      slug: persisted.slug,
      status: "published",
      publishedAt: new Date().toISOString(),
      url: `${SITE_ORIGIN}/blog/${persisted.slug}`,
      validation: "eligible",
      blockedReason: "",
      targetPathway: pathway.pathwayId,
    });
    console.log(`published slug=${persisted.slug} words=${countWordsFromHtml(pipeline.bodyHtml)}`);
  }

  console.log("\nPublish report");
  console.table(rows);
  if (failed) process.exitCode = 1;
}

void main();
