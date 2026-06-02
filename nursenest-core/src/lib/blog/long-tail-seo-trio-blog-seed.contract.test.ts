/**
 * Contract tests for scripts/blog long-tail SEO trio seed (30-topic plan + builder).
 * Run: npx tsx --test src/lib/blog/long-tail-seo-trio-blog-seed.contract.test.ts
 */
import assert from "node:assert/strict";
import test from "node:test";
import { BlogImageStatus, BlogPostIntent, BlogPostStatus, type PrismaClient } from "@prisma/client";

import { collectBlogGeneratedDraftQualityIssues } from "@/lib/blog/blog-generated-draft-quality";
import { validateBlogPrePublish, type BlogPostPrePublishRow } from "@/lib/blog/blog-pre-publish-validation";
import { BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH, countWordsFromHtml } from "@/lib/blog/blog-word-count";

import {
  LONG_TAIL_SEO_TRIO_LEGACY_SOURCE,
  getLongTailSeoTrioTopicPlan,
  type LongTailSeoTrioPillar,
} from "../../../scripts/blog/long-tail-seo-trio-topic-plan";
import {
  buildCreatePayload,
  validateLongTailSeoTrioSeedBody,
} from "../../../scripts/blog/lib/long-tail-seo-trio-blog-post-builder";

const mockPrismaForSlugCheck = {
  blogPost: {
    findFirst: async () => null,
  },
} as unknown as PrismaClient;

test("topic plan has exactly 30 rows, unique slugs, and 10 per pillar", () => {
  const topics = getLongTailSeoTrioTopicPlan();
  assert.equal(topics.length, 30);
  const slugs = new Set(topics.map((t) => t.slug));
  assert.equal(slugs.size, 30);
  const counts = new Map<LongTailSeoTrioPillar, number>();
  for (const t of topics) {
    counts.set(t.pillar, (counts.get(t.pillar) ?? 0) + 1);
  }
  assert.equal(counts.get("pharmacology"), 10);
  assert.equal(counts.get("pathophysiology"), 10);
  assert.equal(counts.get("allied"), 10);
});

test("builder produces long-form body, passes local contract, draft-quality, and pre-publish (slug stubbed)", async () => {
  const all = getLongTailSeoTrioTopicPlan();
  const topic = all[5]!;
  const peers = all.filter((x) => x.slug !== topic.slug).slice(0, 5).map((x) => ({
    slug: x.slug,
    title: x.title,
    excerpt: x.metaDescription,
  }));
  const payload = buildCreatePayload({
    topic,
    peers,
    keywordCluster: "long-tail-seo-trio-2026",
  });
  assert.equal(payload.legacySource, LONG_TAIL_SEO_TRIO_LEGACY_SOURCE);
  assert.equal(payload.postIntent, BlogPostIntent.EXAM_PREP);
  const words = countWordsFromHtml(payload.body);
  assert.ok(
    words >= BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH,
    `expected >= ${BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH} words, got ${words}`,
  );
  const local = validateLongTailSeoTrioSeedBody(payload.body, topic.title);
  assert.equal(local.ok, true);

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
  const blocks = dq.filter((i) => i.severity === "block");
  assert.equal(blocks.length, 0, blocks.map((b) => b.message).join(" | "));

  const row: BlogPostPrePublishRow = {
    id: "contract-seed-seo-trio-test",
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
    imageStatus: BlogImageStatus.NONE,
    countryTarget: null,
    postStatus: BlogPostStatus.DRAFT,
    postTemplate: payload.postTemplate,
    intent: payload.postIntent,
    targetKeyword: payload.targetKeyword,
    medicalRiskFlags: payload.medicalRiskFlags,
  };
  const pre = await validateBlogPrePublish(row, row.id, { prisma: mockPrismaForSlugCheck });
  assert.equal(pre.okToPublish, true, pre.blocking.map((b) => `${b.id}: ${b.message}`).join("\n"));
});
