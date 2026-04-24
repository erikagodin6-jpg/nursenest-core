import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import {
  BlogImageStatus,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  CountryCode,
} from "@prisma/client";
import { BLOG_ARTICLE_MIN_WORDS } from "@/lib/blog/blog-word-count";
import { blogLiveWhere } from "@/lib/blog/blog-visibility";
import { publishBlogPostCanonical } from "@/lib/blog/publish-blog-post-canonical";
import { prisma } from "@/lib/db";
import { getPublishedBlogPostBySlug } from "@/lib/blog/safe-blog-queries";

function longWords(n: number): string {
  return `<p>${Array.from({ length: n }, () => "term").join(" ")}</p>`;
}

function buildPublishableBody(): string {
  return (
    `${longWords(BLOG_ARTICLE_MIN_WORDS + 40)}` +
    "<h2>Pathophysiology</h2><p>Mechanism explanation for clinical depth.</p>" +
    "<h2>Nursing implications</h2><p>Practice and safety considerations.</p>"
  );
}

const hasDb = Boolean(process.env.DATABASE_URL?.trim());

describe("publishBlogPostCanonical", () => {
  it("rejects forbidden companion keys before touching the database", async () => {
    await assert.rejects(
      () =>
        publishBlogPostCanonical({
          postId: "nonexistent-canonical-test-id",
          publishAt: new Date(),
          context: "bulk_chunk_blog_publish",
          companionUpdate: { postStatus: BlogPostStatus.PUBLISHED },
        }),
      /companionUpdate must not set "postStatus"/,
    );
  });

  it("publishes a disposable draft through blogLiveWhere + slug resolution", async () => {
    if (!hasDb) {
      console.info("[publishBlogPostCanonical] skip integration test (no DATABASE_URL)");
      return;
    }

    const slug = `canonical-publish-test-${Date.now()}`;
    const body = buildPublishableBody();
    const excerpt =
      "Integration test excerpt long enough for card previews and pre-publish validation rules in the suite.";
    const internalLinkPlan = {
      lessons: [
        {
          label: "Lesson link",
          suggestedPath: "/us/rn/nclex-rn/lessons/sample",
          pathStatus: "ok",
          id: "ll-canonical-test",
          reviewStatus: "active",
        },
      ],
      seo: {
        version: 1,
        normalizedBreadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Article", href: `/blog/${slug}` },
        ],
        suggestedExcerpt: "x".repeat(80),
        emitFaqSchema: false,
        focusKeywords: ["nclex"],
        primaryKeyword: "fluid balance",
        imageAlts: [],
      },
      publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] },
    };

    const created = await prisma.blogPost.create({
      data: {
        slug,
        title: "Canonical publish integration test row",
        excerpt,
        body,
        exam: "NCLEX-RN",
        category: "Clinical",
        tags: ["nclex", "nursing", "canonical-test"],
        postStatus: BlogPostStatus.DRAFT,
        workflowStatus: BlogWorkflowStatus.GENERATED,
        postTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
        seoTitle: "Canonical test — SEO title",
        seoDescription:
          "Meta description with enough substance for SERP previews and pre-publish validation rules in tests.",
        metaTitleVariant: "Canonical test — SEO title",
        metaDescriptionVariant:
          "Meta description with enough substance for SERP previews and pre-publish validation rules in tests.",
        requiresReferences: false,
        apaReferences: [],
        sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
        internalLinkPlan,
        outlineJson: [],
        faqBlock: {
          items: [
            { q: "First common question for learners?", a: "Answer with enough substance for FAQ validation." },
            { q: "Second question about clinical judgment?", a: "Another substantive answer for schema checks." },
          ],
        },
        schemaSummary: JSON.stringify({
          schemaOpportunities: [{ type: "BlogPosting", rationale: "Test row." }],
          emitFaqSchema: false,
        }),
        imageStatus: BlogImageStatus.NONE,
        countryTarget: CountryCode.US,
        targetKeyword: "fluid balance",
        medicalRiskFlags: [],
      },
    });

    const now = new Date();
    try {
      await publishBlogPostCanonical({
        postId: created.id,
        publishAt: now,
        clearScheduledAt: true,
        context: "bulk_chunk_blog_publish",
        acknowledgePrePublishWarnings: true,
        skipRevalidate: true,
      });

      const row = await prisma.blogPost.findUnique({
        where: { id: created.id },
        select: { postStatus: true, workflowStatus: true, scheduledAt: true },
      });
      assert.equal(row?.postStatus, BlogPostStatus.PUBLISHED);
      assert.equal(row?.workflowStatus, BlogWorkflowStatus.PUBLISHED);
      assert.equal(row?.scheduledAt, null);

      const listed = await prisma.blogPost.count({
        where: { AND: [{ id: created.id }, blogLiveWhere(now)] },
      });
      assert.ok(listed >= 1);

      const detail = await getPublishedBlogPostBySlug(slug);
      assert.ok(detail);
      assert.equal(detail!.id, created.id);
    } finally {
      await prisma.blogPost.delete({ where: { id: created.id } }).catch(() => undefined);
    }
  });

  it("fails pre-publish when body is far too short", async () => {
    if (!hasDb) {
      console.info("[publishBlogPostCanonical] skip integration test (no DATABASE_URL)");
      return;
    }

    const slug = `canonical-publish-bad-${Date.now()}`;
    const created = await prisma.blogPost.create({
      data: {
        slug,
        title: "Bad body canonical test",
        excerpt: "Short excerpt that is still long enough for minimum excerpt rules here.",
        body: "<p>tiny</p>",
        exam: "NCLEX-RN",
        category: "Clinical",
        tags: ["nclex"],
        postStatus: BlogPostStatus.DRAFT,
        workflowStatus: BlogWorkflowStatus.GENERATED,
        postTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
        seoTitle: "Bad body test title for SEO column presence",
        seoDescription:
          "Meta description with enough substance for SERP previews and pre-publish validation rules in tests.",
        metaTitleVariant: "Bad body test title for SEO column presence",
        metaDescriptionVariant:
          "Meta description with enough substance for SERP previews and pre-publish validation rules in tests.",
        requiresReferences: false,
        apaReferences: [],
        sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
        internalLinkPlan: {
          lessons: [
            {
              label: "Lesson link",
              suggestedPath: "/us/rn/nclex-rn/lessons/sample",
              pathStatus: "ok",
              id: "ll-bad",
              reviewStatus: "active",
            },
          ],
          seo: {
            version: 1,
            normalizedBreadcrumbs: [
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: "Article", href: `/blog/${slug}` },
            ],
            suggestedExcerpt: "x".repeat(80),
            emitFaqSchema: false,
            focusKeywords: ["nclex"],
            primaryKeyword: "fluid balance",
            imageAlts: [],
          },
          publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] },
        },
        outlineJson: [],
        faqBlock: {
          items: [
            { q: "First common question for learners?", a: "Answer with enough substance for FAQ validation." },
            { q: "Second question about clinical judgment?", a: "Another substantive answer for schema checks." },
          ],
        },
        schemaSummary: JSON.stringify({
          schemaOpportunities: [{ type: "BlogPosting", rationale: "Test row." }],
          emitFaqSchema: false,
        }),
        imageStatus: BlogImageStatus.NONE,
        countryTarget: CountryCode.US,
        targetKeyword: "fluid balance",
        medicalRiskFlags: [],
      },
    });

    try {
      await assert.rejects(
        () =>
          publishBlogPostCanonical({
            postId: created.id,
            publishAt: new Date(),
            context: "bulk_chunk_blog_publish",
            acknowledgePrePublishWarnings: true,
            skipRevalidate: true,
          }),
        /publishBlogPostCanonical: pre-publish blocked/,
      );
    } finally {
      await prisma.blogPost.delete({ where: { id: created.id } }).catch(() => undefined);
    }
  });
});

after(() => {
  void prisma.$disconnect().catch(() => undefined);
});
