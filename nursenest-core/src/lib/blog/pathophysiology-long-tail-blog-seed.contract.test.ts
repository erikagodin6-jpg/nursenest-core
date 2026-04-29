/**
 * Contract tests for scripts/blog long-tail pathophysiology seed (200-topic plan + builder).
 * Run: npx tsx --test src/lib/blog/pathophysiology-long-tail-blog-seed.contract.test.ts
 */
import assert from "node:assert/strict";
import test from "node:test";
import {
  BlogImageStatus,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  type PrismaClient,
} from "@prisma/client";

import { collectBlogGeneratedDraftQualityIssues } from "@/lib/blog/blog-generated-draft-quality";
import { validateBlogPrePublish, type BlogPostPrePublishRow } from "@/lib/blog/blog-pre-publish-validation";
import { BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH, countWordsFromHtml } from "@/lib/blog/blog-word-count";

import {
  PATHOPHYSIOLOGY_LONG_TAIL_200_LEGACY_SOURCE,
  getPathophysiologyLongTail200TopicPlan,
  type PathophysiologyLongTailTier,
} from "../../../scripts/blog/pathophysiology-long-tail-200-topic-plan";
import {
  buildCreatePayload,
  validateLongTailSeedBody,
} from "../../../scripts/blog/lib/pathophysiology-long-tail-blog-post-builder";

const mockPrismaForSlugCheck = {
  blogPost: {
    findFirst: async () => null,
  },
} as unknown as PrismaClient;

test("topic plan has exactly 200 rows, unique slugs, and required tier distribution", () => {
  const topics = getPathophysiologyLongTail200TopicPlan();
  assert.equal(topics.length, 200);
  const slugs = new Set(topics.map((t) => t.slug));
  assert.equal(slugs.size, 200);
  const counts = new Map<PathophysiologyLongTailTier, number>();
  for (const t of topics) {
    counts.set(t.tier, (counts.get(t.tier) ?? 0) + 1);
  }
  assert.equal(counts.get("RN"), 55);
  assert.equal(counts.get("RPN_PN"), 45);
  assert.equal(counts.get("NP"), 40);
  assert.equal(counts.get("ALLIED"), 40);
  assert.equal(counts.get("NEW_GRAD"), 15);
  assert.equal(counts.get("PRE_NURSING"), 5);
});

test("every topic row has tier, pathway metadata, category, and body system", () => {
  for (const t of getPathophysiologyLongTail200TopicPlan()) {
    assert.ok(t.slug.length >= 8);
    assert.ok(t.title.length > 20);
    assert.ok(t.seoTitle.length >= 10);
    assert.ok(t.metaDescription.length >= 50);
    assert.ok(t.bodySystem.length >= 3);
    assert.ok(t.targetKeyword.length >= 6);
    assert.ok(t.category.length >= 3);
    assert.ok(t.tier);
  }
});

test("builder produces long-form body, FAQ contract, and passes local + draft-quality gates", () => {
  const all = getPathophysiologyLongTail200TopicPlan();
  const topic = all[0]!;
  const peers = all.slice(1, 6).map((x) => ({ slug: x.slug, title: x.title, excerpt: x.metaDescription }));
  const payload = buildCreatePayload({
    topic,
    peers,
    keywordCluster: "pathophysiology-long-tail-200",
  });
  assert.equal(payload.legacySource, PATHOPHYSIOLOGY_LONG_TAIL_200_LEGACY_SOURCE);
  const words = countWordsFromHtml(payload.body);
  assert.ok(
    words >= BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH,
    `expected >= ${BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH} words, got ${words}`,
  );
  const local = validateLongTailSeedBody(payload.body, topic.title);
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
});

test("validateBlogPrePublish passes for a representative seeded payload (slug uniqueness stubbed)", async () => {
  const all = getPathophysiologyLongTail200TopicPlan();
  const topic = all[10]!;
  const peers = all.filter((x) => x.slug !== topic.slug).slice(0, 5).map((x) => ({
    slug: x.slug,
    title: x.title,
    excerpt: x.metaDescription,
  }));
  const payload = buildCreatePayload({ topic, peers, keywordCluster: "pathophysiology-long-tail-200" });
  const row: BlogPostPrePublishRow = {
    id: "contract-seed-patho-test",
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
    postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
    intent: BlogPostIntent.CONCEPT_EXPLAINER,
    targetKeyword: payload.targetKeyword,
    medicalRiskFlags: payload.medicalRiskFlags,
  };
  const pre = await validateBlogPrePublish(row, row.id, { prisma: mockPrismaForSlugCheck });
  assert.equal(pre.okToPublish, true, pre.blocking.map((b) => `${b.id}: ${b.message}`).join("\n"));
});
