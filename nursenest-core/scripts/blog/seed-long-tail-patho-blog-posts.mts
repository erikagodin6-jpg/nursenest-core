#!/usr/bin/env npx tsx
/**
 * Production-safe seed for 200 long-tail pathophysiology blog posts (see `pathophysiology-long-tail-200-topic-plan.ts`).
 *
 * From nursenest-core/:
 *   npm run blog:seed-patho -- --dry-run
 *   npm run blog:seed-patho -- --publish --limit=10
 *   npm run blog:seed-patho -- --publish --limit=200 --resume
 *
 * Default is dry-run (no database writes). `--publish` performs upserts; only rows passing
 * {@link validateBlogPrePublish} are set live (PUBLISHED). Others are saved as DRAFT with workflow NEEDS_SEO_REVIEW
 * and a structured `adminPublishLog` entry describing blocking issues.
 */
import "../../src/lib/db/script-env-bootstrap";

import { BlogPostStatus, BlogWorkflowStatus, type Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma-script-client";
import { validateBlogPrePublish, type BlogPostPrePublishRow } from "../../src/lib/blog/blog-pre-publish-validation";
import { ensurePublicBlogPostVisibilityForSeed } from "../../src/lib/content/ensure-public-visibility";
import { assertPublicBlogSeedRenderable } from "../../src/lib/content/assert-public-renderable";
import {
  PATHOPHYSIOLOGY_LONG_TAIL_200_LEGACY_SOURCE,
  getPathophysiologyLongTail200TopicPlan,
} from "./pathophysiology-long-tail-200-topic-plan";
import {
  buildCreatePayload,
  validateLongTailSeedBody,
} from "./lib/pathophysiology-long-tail-blog-post-builder";

const dryRun = !process.argv.includes("--publish");
const resume = process.argv.includes("--resume");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg
  ? Math.max(1, Math.min(200, parseInt(limitArg.split("=")[1] ?? "200", 10) || 200))
  : 200;

const BATCH = 10;

function appendPublishLog(existing: Prisma.JsonValue | null | undefined, entry: Record<string, unknown>): Prisma.InputJsonValue {
  const raw = existing;
  const arr = Array.isArray(raw) ? [...raw] : [];
  arr.push({ at: new Date().toISOString(), ...entry });
  return arr as Prisma.InputJsonValue;
}

function peersFor(topicSlug: string, all: ReturnType<typeof getPathophysiologyLongTail200TopicPlan>): {
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
    targetKeyword: payload.targetKeyword,
    medicalRiskFlags: payload.medicalRiskFlags,
  };
}

async function main(): Promise<void> {
  if (!dryRun && !process.env.DATABASE_URL?.trim()) {
    console.error("[blog:seed-patho] Refusing writes: DATABASE_URL is not set.");
    process.exit(1);
  }

  const allTopics = getPathophysiologyLongTail200TopicPlan();
  const topics = allTopics.slice(0, limit);

  let published = 0;
  let draftValidation = 0;
  let skipped = 0;
  let dryRunOk = 0;

  for (let i = 0; i < topics.length; i += BATCH) {
    const batch = topics.slice(i, i + BATCH);
    for (const topic of batch) {
      const peers = peersFor(topic.slug, allTopics);
      const payload = buildCreatePayload({
        topic,
        peers,
        keywordCluster: "pathophysiology-long-tail-200",
      });

      const local = validateLongTailSeedBody(payload.body, topic.title);
      if (!local.ok) {
        console.log(
          JSON.stringify({
            slug: topic.slug,
            tier: topic.tier,
            outcome: "failed_local_contract",
            reasons: local.reasons,
          }),
        );
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
              postStatus: BlogPostStatus.DRAFT,
              workflowStatus: BlogWorkflowStatus.FAILED_GENERATION,
              adminPublishLog: appendPublishLog([], {
                kind: "patho_long_tail_seed",
                outcome: "failed_local_contract",
                reasons: local.reasons,
              }),
            },
            update: {
              adminPublishLog: appendPublishLog(existingFailed?.adminPublishLog, {
                kind: "patho_long_tail_seed",
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

      assertPublicBlogSeedRenderable({ slug: payload.slug, title: payload.title, body: payload.body });

      if (dryRun) {
        dryRunOk += 1;
        console.log(JSON.stringify({ slug: topic.slug, tier: topic.tier, outcome: "dry_run_ok" }));
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

      if (resume && existing?.postStatus === BlogPostStatus.PUBLISHED && existing.legacySource === PATHOPHYSIOLOGY_LONG_TAIL_200_LEGACY_SOURCE) {
        skipped += 1;
        console.log(JSON.stringify({ slug: topic.slug, tier: topic.tier, outcome: "skipped_resume_published" }));
        continue;
      }

      const postIdForValidate = existing?.id ?? `new-${payload.slug}`;

      const preRow = toPrePublishRow(payload, postIdForValidate, BlogPostStatus.DRAFT);
      const pre = await validateBlogPrePublish(preRow, postIdForValidate, { prisma });

      const logEntry = {
        kind: "patho_long_tail_seed",
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

        await prisma.blogPost.upsert({
          where: { slug: payload.slug },
          create: data as Parameters<typeof prisma.blogPost.create>[0]["data"],
          update: data as Parameters<typeof prisma.blogPost.update>[0]["data"],
        });
        published += 1;
        console.log(JSON.stringify({ slug: topic.slug, tier: topic.tier, outcome: "published" }));
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
          postStatus: BlogPostStatus.DRAFT,
          publishAt: null,
          scheduledAt: null,
          workflowStatus: BlogWorkflowStatus.NEEDS_SEO_REVIEW,
          adminPublishLog: appendPublishLog(existing?.adminPublishLog, { ...logEntry, outcome: "draft_validation_failed" }),
        };

        await prisma.blogPost.upsert({
          where: { slug: payload.slug },
          create: draftData as Parameters<typeof prisma.blogPost.create>[0]["data"],
          update: draftData,
        });
        draftValidation += 1;
        console.log(
          JSON.stringify({
            slug: topic.slug,
            tier: topic.tier,
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
