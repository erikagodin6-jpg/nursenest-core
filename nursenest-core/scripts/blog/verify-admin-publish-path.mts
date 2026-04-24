#!/usr/bin/env npx tsx
/**
 * Verifies the canonical admin publish path: pre-publish, DB write, blogLiveWhere visibility,
 * slug resolution via getPublishedBlogPostBySlug, and intended ISR targets (/blog + /blog/{slug}).
 *
 * Default: **dry-run** — prints the checklist and exits 0 (no writes).
 * With **`--apply`** and **`DATABASE_URL`**: creates a disposable draft row that passes pre-publish,
 * runs {@link publishBlogPostCanonical}, asserts visibility, then deletes the row.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/verify-admin-publish-path.mts
 *   npx tsx scripts/blog/verify-admin-publish-path.mts --apply
 */
import {
  BlogImageStatus,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  CountryCode,
} from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";

import { BLOG_ARTICLE_MIN_WORDS } from "../../src/lib/blog/blog-word-count";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import { publishBlogPostCanonical } from "../../src/lib/blog/publish-blog-post-canonical";
import { prisma } from "../../src/lib/db";
import { getPublishedBlogPostBySlug } from "../../src/lib/blog/safe-blog-queries";

function longWords(n: number): string {
  return `<p>${Array.from({ length: n }, () => "term").join(" ")}</p>`;
}

function buildVerifyBody(): string {
  return (
    `${longWords(BLOG_ARTICLE_MIN_WORDS + 40)}` +
    "<h2>Pathophysiology</h2><p>Mechanism explanation for clinical depth.</p>" +
    "<h2>Nursing implications</h2><p>Practice and safety considerations.</p>"
  );
}

async function main(): Promise<void> {
  const apply = process.argv.includes("--apply");
  const slug = `verify-admin-publish-${Date.now()}`;
  const revalidationTargets = ["/blog", `/blog/${slug}`];

  console.log(
    JSON.stringify(
      {
        mode: apply ? "apply" : "dry-run",
        revalidationTargets,
        note: "Successful publishBlogPostCanonical calls revalidateBlogPublishingSurfaces({ slug, tags, alliedProfessionKey }) which always includes /blog and /blog/{slug} when slug is set.",
      },
      null,
      2,
    ),
  );

  if (!apply) {
    console.log("\nDry-run only. Pass --apply with DATABASE_URL to run an end-to-end disposable publish.");
    return;
  }

  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is required for --apply.");
    process.exit(1);
  }

  const body = buildVerifyBody();
  const excerpt =
    "Disposable verification article excerpt long enough for card previews and pre-publish validation rules.";
  const internalLinkPlan = {
    lessons: [
      {
        label: "Lesson link",
        suggestedPath: "/us/rn/nclex-rn/lessons/sample",
        pathStatus: "ok",
        id: "ll-verify",
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
      title: "Verify admin canonical publish path (disposable)",
      excerpt,
      body,
      exam: "NCLEX-RN",
      category: "Clinical",
      tags: ["nclex", "nursing", "verify-admin-publish"],
      postStatus: BlogPostStatus.DRAFT,
      workflowStatus: BlogWorkflowStatus.GENERATED,
      postTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
      seoTitle: "Verify admin publish — SEO title",
      seoDescription:
        "Meta description with enough substance for SERP previews and pre-publish validation rules in the verify script.",
      metaTitleVariant: "Verify admin publish — SEO title",
      metaDescriptionVariant:
        "Meta description with enough substance for SERP previews and pre-publish validation rules in the verify script.",
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
        schemaOpportunities: [{ type: "BlogPosting", rationale: "Verification row." }],
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
      setLegacySourceIfEmpty: "verify_admin_publish_script",
    });

    const listed = await prisma.blogPost.count({
      where: { AND: [{ id: created.id }, blogLiveWhere(now)] },
    });
    if (listed < 1) {
      throw new Error("Post not included by blogLiveWhere(now) after canonical publish.");
    }
    const detail = await getPublishedBlogPostBySlug(slug);
    if (!detail || detail.id !== created.id) {
      throw new Error("getPublishedBlogPostBySlug did not resolve the published row.");
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          postId: created.id,
          slug,
          revalidationTargets,
          blogLiveWhereCount: listed,
          detailTitle: detail.title,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.blogPost.delete({ where: { id: created.id } }).catch(() => undefined);
    await prisma.$disconnect().catch(() => undefined);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
