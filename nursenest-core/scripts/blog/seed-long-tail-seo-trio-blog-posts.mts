#!/usr/bin/env npx tsx
/**
 * Seed 30 long-tail SEO posts (pharmacology, pathophysiology, allied health).
 *
 * From nursenest-core/:
 *   npx tsx scripts/blog/seed-long-tail-seo-trio-blog-posts.mts --dry-run
 *   npx tsx scripts/blog/seed-long-tail-seo-trio-blog-posts.mts --publish --limit=30
 *   npx tsx scripts/blog/seed-long-tail-seo-trio-blog-posts.mts --publish --resume
 *
 * Default is dry-run (no database writes). `--publish` upserts; rows passing {@link validateBlogPrePublish}
 * are set live. Existing slugs owned by a different `legacySource` are skipped without overwrite.
 */
import "../../src/lib/db/script-env-bootstrap";

import { BlogPostStatus, BlogWorkflowStatus, type Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma-script-client";
import { validateBlogPrePublish, type BlogPostPrePublishRow } from "../../src/lib/blog/blog-pre-publish-validation";
import { ensurePublicBlogPostVisibilityForSeed } from "../../src/lib/content/ensure-public-visibility";
import { assertPublicBlogSeedRenderable } from "../../src/lib/content/assert-public-renderable";
import { collectBlogGeneratedDraftQualityIssues } from "../../src/lib/blog/blog-generated-draft-quality";

import {
  LONG_TAIL_SEO_TRIO_LEGACY_SOURCE,
  getLongTailSeoTrioTopicPlan,
} from "./long-tail-seo-trio-topic-plan";
import {
  buildCreatePayload,
  validateLongTailSeoTrioSeedBody,
} from "./lib/long-tail-seo-trio-blog-post-builder";

const dryRun = !process.argv.includes("--publish");
const resume = process.argv.includes("--resume");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg
  ? Math.max(1, Math.min(30, parseInt(limitArg.split("=")[1] ?? "30", 10) || 30))
  : 30;

const BATCH = 10;

function appendPublishLog(existing: Prisma.JsonValue | null | undefined, entry: Record<string, unknown>): Prisma.InputJsonValue {
  const raw = existing;
  const arr = Array.isArray(raw) ? [...raw] : [];
  arr.push({ at: new Date().toISOString(), ...entry });
  return arr as Prisma.InputJsonValue;
}

function peersFor(topicSlug: string, all: ReturnType<typeof getLongTailSeoTrioTopicPlan>): {
  slug: string;
  title: string;
  excerpt: string;
}[] {
  return all
    .filter((t) => t.slug !== topicSlug)
    .slice(0, 6)
    .map((t) => ({ slug: t.slug, title: t.title, excerpt: t.metaDescription }));
}

function toPrePublishRow(
  payload: ReturnType<typeof buildCreatePayload>,
  postId: string,
  postStatus: BlogPostStatus,
): BlogPostPrePublishRow {
  return {
    id: postId,
    slug: payload.slug,
    title: payload.title,
    excerpt: payload.excerpt,
    body: payload.body,
    exam: payload.exam,
    category: payload.category,
    tags: payload.tags,
    seoTitle: payload.seoTitle,
    seoDescription: payload.seoDescription,
    metaTitleVariant: null,
    metaDescriptionVariant: null,
    requiresReferences: payload.requiresReferences,
    apaReferences: payload.apaReferences,
    sourcesJson: payload.sourcesJson as BlogPostPrePublishRow["sourcesJson"],
    internalLinkPlan: payload.internalLinkPlan as BlogPostPrePublishRow["internalLinkPlan"],
    outlineJson: [],
    faqBlock: payload.faqBlock as BlogPostPrePublishRow["faqBlock"],
    schemaSummary: payload.schemaSummary,
    coverImage: null,
    coverImageAlt: null,
    coverImageCaption: null,
    coverImagePrompt: null,
    imageStatus: payload.imageStatus,
    countryTarget: null,
    postStatus,
    postTemplate: payload.postTemplate,
    intent: payload.postIntent,
    targetKeyword: payload.targetKeyword,
    medicalRiskFlags: payload.medicalRiskFlags,
  };
}

async function main(): Promise<void> {
  if (!dryRun && !process.env.DATABASE_URL?.trim()) {
    console.error("[blog:seed-seo-trio] Refusing writes: DATABASE_URL is not set.");
    process.exit(1);
  }

  const allTopics = getLongTailSeoTrioTopicPlan();
  const topics = allTopics.slice(0, limit);

  let published = 0;
  let draftValidation = 0;
  let skipped = 0;
  let dryRunOk = 0;
  let skippedForeign = 0;

  for (let i = 0; i < topics.length; i += BATCH) {
    const batch = topics.slice(i, i + BATCH);
    for (const topic of batch) {
      const peers = peersFor(topic.slug, allTopics);
      const payload = buildCreatePayload({
        topic,
        peers,
        keywordCluster: "long-tail-seo-trio-2026",
      });

      const local = validateLongTailSeoTrioSeedBody(payload.body, topic.title);
      if (!local.ok) {
        console.log(JSON.stringify({ slug: topic.slug, pillar: topic.pillar, outcome: "failed_local_contract", reasons: local.reasons }));
        if (!dryRun) {
          const existingFailed = await prisma.blogPost.findUnique({
            where: { slug: topic.slug },
            select: { adminPublishLog: true },
          });
          await prisma.blogPost.upsert({
            where: { slug: topic.slug },
            create: {
              slug: payload.slug,
              title: payload.title,
              excerpt: payload.excerpt,
              body: payload.body,
              tags: payload.tags,
              category: payload.category,
              exam: payload.exam,
              careerSlug: payload.careerSlug,
              locale: payload.locale,
              seoTitle: payload.seoTitle,
              seoDescription: payload.seoDescription,
              targetKeyword: payload.targetKeyword,
              keywordCluster: payload.keywordCluster,
              keywordPlan: payload.keywordPlan,
              postTemplate: payload.postTemplate,
              intent: payload.postIntent,
              faqBlock: payload.faqBlock,
              internalLinkPlan: payload.internalLinkPlan,
              schemaSummary: payload.schemaSummary,
              requiresReferences: payload.requiresReferences,
              apaReferences: payload.apaReferences,
              sourcesJson: payload.sourcesJson,
              keyQuestions: payload.keyQuestions,
              legacySource: payload.legacySource,
              imageStatus: payload.imageStatus,
              medicalRiskFlags: payload.medicalRiskFlags,
              relatedLessonPaths: payload.relatedLessonPaths,
              postStatus: BlogPostStatus.DRAFT,
              workflowStatus: BlogWorkflowStatus.FAILED_GENERATION,
              adminPublishLog: appendPublishLog([], {
                kind: "seo_trio_long_tail_seed",
                outcome: "failed_local_contract",
                reasons: local.reasons,
              }),
            },
            update: {
              adminPublishLog: appendPublishLog(existingFailed?.adminPublishLog, {
                kind: "seo_trio_long_tail_seed",
                outcome: "failed_local_contract",
                reasons: local.reasons,
              }),
              workflowStatus: BlogWorkflowStatus.FAILED_GENERATION,
              postStatus: BlogPostStatus.DRAFT,
            },
          });
        }
        continue;
      }

      const dq = collectBlogGeneratedDraftQualityIssues({
        body: payload.body,
        targetKeyword: payload.targetKeyword,
        postTemplate: payload.postTemplate,
        internalLinkPlan: payload.internalLinkPlan,
        faqBlock: payload.faqBlock,
        schemaSummary: payload.schemaSummary,
        sourcesJson: payload.sourcesJson,
        apaReferences: payload.apaReferences,
        medicalRiskFlags: payload.medicalRiskFlags,
        requiresReferences: payload.requiresReferences,
      });
      const dqBlocks = dq.filter((x) => x.severity === "block");
      if (dqBlocks.length > 0) {
        console.log(
          JSON.stringify({
            slug: topic.slug,
            pillar: topic.pillar,
            outcome: "failed_draft_quality",
            blocking: dqBlocks.map((b) => ({ id: b.id, message: b.message })),
          }),
        );
        continue;
      }

      assertPublicBlogSeedRenderable({ slug: payload.slug, title: payload.title, body: payload.body });

      if (dryRun) {
        dryRunOk += 1;
        console.log(JSON.stringify({ slug: topic.slug, pillar: topic.pillar, outcome: "dry_run_ok" }));
        continue;
      }

      const existing = await prisma.blogPost.findUnique({
        where: { slug: topic.slug },
        select: {
          id: true,
          postStatus: true,
          legacySource: true,
          adminPublishLog: true,
        },
      });

      if (existing?.legacySource && existing.legacySource !== LONG_TAIL_SEO_TRIO_LEGACY_SOURCE) {
        skippedForeign += 1;
        console.log(JSON.stringify({ slug: topic.slug, pillar: topic.pillar, outcome: "skipped_foreign_legacy_source" }));
        continue;
      }

      if (resume && existing?.postStatus === BlogPostStatus.PUBLISHED && existing.legacySource === LONG_TAIL_SEO_TRIO_LEGACY_SOURCE) {
        skipped += 1;
        console.log(JSON.stringify({ slug: topic.slug, pillar: topic.pillar, outcome: "skipped_resume_published" }));
        continue;
      }

      const postIdForValidate = existing?.id ?? `new-${payload.slug}`;

      const preRow = toPrePublishRow(payload, postIdForValidate, BlogPostStatus.DRAFT);
      const pre = await validateBlogPrePublish(preRow, postIdForValidate, { prisma });

      const logEntry = {
        kind: "seo_trio_long_tail_seed",
        okToPublish: pre.okToPublish,
        blocking: pre.blocking.map((b) => ({ id: b.id, message: b.message })),
        warnings: pre.warnings.map((w) => ({ id: w.id, message: w.message })),
      };

      if (pre.okToPublish) {
        const base = {
          slug: payload.slug,
          title: payload.title,
          excerpt: payload.excerpt,
          body: payload.body,
          tags: payload.tags,
          category: payload.category,
          exam: payload.exam,
          careerSlug: payload.careerSlug,
          locale: payload.locale,
          seoTitle: payload.seoTitle,
          seoDescription: payload.seoDescription,
          targetKeyword: payload.targetKeyword,
          keywordCluster: payload.keywordCluster,
          keywordPlan: payload.keywordPlan,
          postTemplate: payload.postTemplate,
          faqBlock: payload.faqBlock,
          internalLinkPlan: payload.internalLinkPlan,
          schemaSummary: payload.schemaSummary,
          requiresReferences: payload.requiresReferences,
          apaReferences: payload.apaReferences,
          sourcesJson: payload.sourcesJson,
          keyQuestions: payload.keyQuestions,
          legacySource: payload.legacySource,
          imageStatus: payload.imageStatus,
          medicalRiskFlags: payload.medicalRiskFlags,
          postStatus: BlogPostStatus.PUBLISHED,
          publishAt: new Date(),
          workflowStatus: BlogWorkflowStatus.PUBLISHED,
        };
        const publishLog = appendPublishLog(existing?.adminPublishLog, { ...logEntry, outcome: "published" });
        const data = ensurePublicBlogPostVisibilityForSeed({
          ...base,
          adminPublishLog: publishLog,
        });

        const merged = {
          ...data,
          intent: payload.postIntent,
          relatedLessonPaths: payload.relatedLessonPaths,
        };

        await prisma.blogPost.upsert({
          where: { slug: payload.slug },
          create: merged as Parameters<typeof prisma.blogPost.create>[0]["data"],
          update: merged as Parameters<typeof prisma.blogPost.update>[0]["data"],
        });
        published += 1;
        console.log(JSON.stringify({ slug: topic.slug, pillar: topic.pillar, outcome: "published" }));
      } else {
        const draftData = {
          slug: payload.slug,
          title: payload.title,
          excerpt: payload.excerpt,
          body: payload.body,
          tags: payload.tags,
          category: payload.category,
          exam: payload.exam,
          careerSlug: payload.careerSlug,
          locale: payload.locale,
          seoTitle: payload.seoTitle,
          seoDescription: payload.seoDescription,
          targetKeyword: payload.targetKeyword,
          keywordCluster: payload.keywordCluster,
          keywordPlan: payload.keywordPlan,
          postTemplate: payload.postTemplate,
          faqBlock: payload.faqBlock,
          internalLinkPlan: payload.internalLinkPlan,
          schemaSummary: payload.schemaSummary,
          requiresReferences: payload.requiresReferences,
          apaReferences: payload.apaReferences,
          sourcesJson: payload.sourcesJson,
          keyQuestions: payload.keyQuestions,
          legacySource: payload.legacySource,
          imageStatus: payload.imageStatus,
          medicalRiskFlags: payload.medicalRiskFlags,
          relatedLessonPaths: payload.relatedLessonPaths,
          intent: payload.postIntent,
          postStatus: BlogPostStatus.DRAFT,
          publishAt: null,
          scheduledAt: null,
          workflowStatus: BlogWorkflowStatus.NEEDS_SEO_REVIEW,
          adminPublishLog: appendPublishLog(existing?.adminPublishLog, { ...logEntry, outcome: "draft_validation_failed" }),
        };

        await prisma.blogPost.upsert({
          where: { slug: payload.slug },
          create: draftData as Parameters<typeof prisma.blogPost.create>[0]["data"],
          update: draftData as Parameters<typeof prisma.blogPost.update>[0]["data"],
        });
        draftValidation += 1;
        console.log(
          JSON.stringify({
            slug: topic.slug,
            pillar: topic.pillar,
            outcome: "draft_validation_failed",
            blocking: logEntry.blocking,
          }),
        );
      }
    }
  }

  console.log(
    JSON.stringify({
      summary: {
        dryRun,
        resume,
        limit,
        dryRunOk,
        published,
        draftValidation,
        skipped,
        skippedForeign,
      },
    }),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
