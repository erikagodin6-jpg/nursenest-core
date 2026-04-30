import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostStatus, BlogPostTemplate, BlogWorkflowStatus } from "@prisma/client";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";
import { normalizeBlogPostStatusWriteFields } from "@/lib/blog/blog-post-published-state";
import { prisma } from "@/lib/db";
import { getPublishedBlogPostBySlug, getPublishedBlogPostsPage } from "@/lib/blog/safe-blog-queries";
import { BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH } from "@/lib/blog/blog-word-count";

const hasDb = Boolean(process.env.DATABASE_URL?.trim());

function longWords(n: number): string {
  return `<p>${Array.from({ length: n }, () => "term").join(" ")}</p>`;
}

describe("blog post PUBLISHED + workflow alignment (public /blog visibility)", () => {
  it("admin-style create: PUBLISHED rows appear in getPublishedBlogPostsPage and resolve by slug", async () => {
    if (!hasDb) {
      console.info("[blog-post-published-visibility] skip (no DATABASE_URL)");
      return;
    }

    const slug = `published-state-contract-${Date.now()}`;
    const body = `${longWords(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH + 20)}<h2>Clinical</h2><p>Depth for listing.</p>`;
    const excerpt =
      "Contract test excerpt with enough characters for card previews and database constraints on the blog post row.";
    const now = new Date();
    const statusWrite = normalizeBlogPostStatusWriteFields({
      postStatus: BlogPostStatus.PUBLISHED,
      publishAt: now,
    });

    assert.equal(statusWrite.workflowStatus, BlogWorkflowStatus.PUBLISHED);
    assert.ok(blogPostIsLive({ postStatus: statusWrite.postStatus, publishAt: statusWrite.publishAt, workflowStatus: statusWrite.workflowStatus }, now));

    const created = await prisma.blogPost.create({
      data: {
        slug,
        title: "Published state contract row",
        excerpt,
        body,
        exam: "NCLEX-RN",
        category: "Clinical",
        tags: ["nclex", "contract-test", "publish-state"],
        postTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
        postStatus: statusWrite.postStatus,
        publishAt: statusWrite.publishAt,
        workflowStatus: statusWrite.workflowStatus,
        seoTitle: "Contract test SEO title",
        seoDescription:
          "Meta description with enough substance for any downstream validation and public card surfaces in tests.",
        metaTitleVariant: "Contract test SEO title",
        metaDescriptionVariant:
          "Meta description with enough substance for any downstream validation and public card surfaces in tests.",
        requiresReferences: false,
        apaReferences: [],
        sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
        internalLinkPlan: {
          lessons: [
            {
              label: "Lesson",
              suggestedPath: "/us/rn/nclex-rn/lessons/sample",
              pathStatus: "ok",
              id: "ll-contract",
              reviewStatus: "active",
            },
          ],
          seo: {
            version: 1,
            normalizedBreadcrumbs: [],
            suggestedExcerpt: "x".repeat(80),
            emitFaqSchema: false,
            focusKeywords: ["nclex"],
            primaryKeyword: "nursing",
            imageAlts: [],
          },
        },
      },
    });
    const page = await getPublishedBlogPostsPage(1, 80, undefined, { includeTotal: false });
    const hit = page.posts.some((p) => p.slug === slug);
    assert.ok(hit, "expected published post in getPublishedBlogPostsPage first page");

    const bySlug = await getPublishedBlogPostBySlug(slug);
    assert.ok(bySlug, "expected getPublishedBlogPostBySlug to resolve /blog/[slug] payload");
    assert.equal(bySlug?.slug, slug);

    await prisma.blogPost.delete({ where: { id: created.id } }).catch(() => undefined);
  });
});
