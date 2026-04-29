import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { BlogImageStatus, BlogPostStatus, BlogPostTemplate, CountryCode, type PrismaClient } from "@prisma/client";
import {
  BLOG_ARTICLE_MIN_WORDS,
  BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH,
} from "@/lib/blog/blog-word-count";
import { validateBlogPrePublish, type BlogPostPrePublishRow } from "@/lib/blog/blog-pre-publish-validation";

/** In-memory Prisma stub so this suite runs under `tsx --test` without importing `server-only` `@/lib/db`. */
let slugUniqueFindFirstImpl: () => Promise<null> = async () => null;
const testPrisma = {
  blogPost: {
    findFirst: async (..._args: unknown[]) => slugUniqueFindFirstImpl(),
  },
} as unknown as PrismaClient;

function longWords(n: number): string {
  return `<p>${Array.from({ length: n }, () => "term").join(" ")}</p>`;
}

function baseRow(overrides: Partial<BlogPostPrePublishRow> = {}): BlogPostPrePublishRow {
  const slug = "quality-contract-test-slug";
  const body =
    `${longWords(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH + 40)}` +
    "<h2>Pathophysiology</h2><p>Mechanism explanation for clinical depth.</p>" +
    "<h2>Nursing implications</h2><p>Practice and safety considerations.</p>";
  const r: BlogPostPrePublishRow = {
    id: "post_quality_contract_test",
    slug,
    title: "NCLEX-focused clinical guide for testing validation",
    excerpt:
      "This excerpt is long enough for pre-publish checks and describes learner value for the nursing exam prep article.",
    body,
    exam: "NCLEX-RN",
    category: "Clinical",
    tags: ["nclex", "nursing"],
    seoTitle: "NCLEX clinical guide — SEO title for testing",
    seoDescription:
      "Meta description with enough substance for SERP previews and pre-publish validation rules in the test suite here.",
    metaTitleVariant: "NCLEX clinical guide — SEO title for testing",
    metaDescriptionVariant:
      "Meta description with enough substance for SERP previews and pre-publish validation rules in the test suite here.",
    requiresReferences: false,
    apaReferences: [],
    sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
    internalLinkPlan: {
      lessons: [
        {
          label: "Lesson link",
          suggestedPath: "/us/rn/nclex-rn/lessons/sample",
          pathStatus: "ok",
          id: "ll-test",
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
      publishingPackage: {
        version: 1,
        internalAnchorOpportunities: [
          {
            phrase: "fluid balance",
            suggestedAnchorText: "fluid balance review",
            targetSuggestedPath: "/us/rn/nclex-rn/lessons/fluids",
          },
        ],
        relatedBlogPosts: [],
      },
    },
    outlineJson: [],
    faqBlock: {
      items: [
        { q: "First common question for learners?", a: "Answer with enough substance for FAQ validation in tests." },
        { q: "Second question about clinical judgment?", a: "Another substantive answer for schema and content checks." },
      ],
    },
    schemaSummary: JSON.stringify({
      schemaOpportunities: [{ type: "BlogPosting", rationale: "Canonical nursing article." }],
      emitFaqSchema: false,
    }),
    coverImage: null,
    coverImageAlt: null,
    coverImageCaption: null,
    coverImagePrompt: null,
    imageStatus: BlogImageStatus.NONE,
    countryTarget: CountryCode.US,
    postStatus: BlogPostStatus.DRAFT,
    postTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
    targetKeyword: "fluid balance",
    medicalRiskFlags: [],
    ...overrides,
  };
  return r;
}

afterEach(() => {
  slugUniqueFindFirstImpl = async () => null;
});

function stubSlugUniqueCheck() {
  slugUniqueFindFirstImpl = async () => null;
}

describe("validateBlogPrePublish + generated draft quality", () => {
  it("blocks when body word count is under the long-form minimum", async () => {
    stubSlugUniqueCheck();
    const row = baseRow({
      body: `${longWords(200)}<h2>Pathophysiology</h2><p>x</p><h2>Nursing implications</h2><p>x</p>`,
    });
    const res = await validateBlogPrePublish(row, row.id, { prisma: testPrisma });
    assert.equal(res.okToPublish, false);
    assert.ok(res.blocking.some((i) => i.id === "body_word_count"));
  });

  it("blocks publish when body is above hard min but below substantive publish target", async () => {
    stubSlugUniqueCheck();
    const between = BLOG_ARTICLE_MIN_WORDS + 25;
    assert.ok(between < BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH);
    const row = baseRow({
      body: `${longWords(between)}<h2>Pathophysiology</h2><p>depth</p><h2>Nursing implications</h2><p>depth</p>`,
    });
    const res = await validateBlogPrePublish(row, row.id, { prisma: testPrisma });
    assert.equal(res.okToPublish, false);
    assert.ok(res.blocking.some((i) => i.id === "body_word_count"));
    assert.ok(
      res.blocking.some((i) => i.message.includes(String(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH))),
      "message should cite publish-depth target",
    );
  });

  it("blocks when slug is not kebab-case", async () => {
    stubSlugUniqueCheck();
    const row = baseRow({ slug: "Invalid Uppercase Slug" });
    const res = await validateBlogPrePublish(row, row.id, { prisma: testPrisma });
    assert.equal(res.okToPublish, false);
    assert.ok(res.blocking.some((i) => i.id === "slug"));
  });

  it("includes draft-quality issues for missing nursing implications when other checks pass structure", async () => {
    stubSlugUniqueCheck();
    const row = baseRow({
      body: `${longWords(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH + 20)}<h2>Pathophysiology</h2><p>depth</p>`,
    });
    const res = await validateBlogPrePublish(row, row.id, { prisma: testPrisma });
    assert.equal(res.okToPublish, false);
    assert.ok(res.blocking.some((i) => i.id === "content_nursing_implications"));
  });
});
