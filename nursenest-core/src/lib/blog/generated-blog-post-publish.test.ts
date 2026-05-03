import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";
import { BLOG_ARTICLE_MIN_WORDS } from "@/lib/blog/blog-word-count";
import {
  buildLegacySourceProvenance,
  expectedCanonicalBlogPath,
  normalizeGeneratedBlogRecord,
  parseSimpleFrontmatter,
  validateGeneratedBlogMaterialization,
  verifyLiveMatchesIntent,
  wordCountForGeneratedBody,
} from "@/lib/blog/generated-blog-post-publish";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..", "..");

function readScript(rel: string): string {
  return readFileSync(join(appRoot, rel), "utf8");
}

function bigHtmlBody(): string {
  return `<p>${Array.from({ length: BLOG_ARTICLE_MIN_WORDS + 50 }, () => "word").join(" ")}</p>`;
}

function validNormalized() {
  const n = normalizeGeneratedBlogRecord({
    title: "Heart failure NCLEX review: assessment cues",
    slug: "heart-failure-nclex-review-assessment",
    excerpt: "This excerpt explains heart failure cues for NCLEX prep with enough length.",
    body: bigHtmlBody(),
    category: "cardiovascular",
    tags: ["nclex", "cardiac"],
    locale: "en",
    careerSlug: null,
    exam: "NCLEX-RN",
    seoTitle: "Heart failure NCLEX review",
    seoDescription: "Meta description long enough for excerpt fallbacks and validation paths here.",
  });
  assert.equal(n.ok, true);
  return n.value!;
}

describe("generated-blog-post-publish", () => {
  it("normalize rejects excerpt shorter than minimum character length", () => {
    const r = normalizeGeneratedBlogRecord({
      title: "T",
      slug: "valid-slug-here",
      excerpt: "short",
      body: bigHtmlBody(),
      seoTitle: "",
      seoDescription: "x",
    });
    assert.equal(r.ok, false);
    assert.ok(r.errors.includes("excerpt_too_short_min_10"));
  });

  it("normalize accepts record with derived seo fields", () => {
    const r = normalizeGeneratedBlogRecord({
      title: "NCLEX pharmacology safety review",
      slug: "nclex-pharmacology-safety-review",
      excerpt: "",
      body: bigHtmlBody(),
      category: "pharmacology",
      tags: ["nclex"],
    });
    assert.equal(r.ok, true);
    assert.ok((r.value?.excerpt.length ?? 0) >= 10);
    assert.ok((r.value?.seoTitle.length ?? 0) > 0);
  });

  it("parseSimpleFrontmatter extracts keys and body", () => {
    const raw = `---
title: Hello
slug: hello-world
---
<p>Body here</p>`;
    const { meta, body } = parseSimpleFrontmatter(raw);
    assert.equal(meta.title, "Hello");
    assert.equal(meta.slug, "hello-world");
    assert.match(body, /Body here/);
  });

  it("validate blocks duplicate slug without --update-existing", () => {
    const n = validNormalized();
    const v = validateGeneratedBlogMaterialization({
      normalized: n,
      wordCount: wordCountForGeneratedBody(n.body),
      existing: {
        postStatus: BlogPostStatus.DRAFT,
        workflowStatus: BlogWorkflowStatus.GENERATED,
        publishAt: null,
        scheduledAt: null,
      },
      flags: { updateExisting: false, allowPublishedUpdate: false, wantPublish: false },
      now: new Date(),
    });
    assert.equal(v.ok, false);
    assert.equal(v.action, "skip");
    assert.ok(v.reasons.some((x) => x.includes("slug_exists")));
  });

  it("validate rejects short body word count", () => {
    const n = validNormalized();
    const v = validateGeneratedBlogMaterialization({
      normalized: { ...n, body: "<p>too short</p>" },
      wordCount: 2,
      existing: null,
      flags: { updateExisting: false, allowPublishedUpdate: false, wantPublish: false },
      now: new Date(),
    });
    assert.equal(v.ok, false);
    assert.ok(v.reasons.some((x) => x.includes("body_below_min_words")));
  });

  it("draft materialization intent is not live (NEEDS_REVIEW)", () => {
    const now = new Date("2026-05-01T12:00:00Z");
    const live = blogPostIsLive(
      {
        postStatus: BlogPostStatus.NEEDS_REVIEW,
        workflowStatus: BlogWorkflowStatus.NEEDS_SEO_REVIEW,
        publishAt: null,
        scheduledAt: null,
      },
      now,
    );
    assert.equal(live, false);
    const v = verifyLiveMatchesIntent({
      postStatus: BlogPostStatus.NEEDS_REVIEW,
      workflowStatus: BlogWorkflowStatus.NEEDS_SEO_REVIEW,
      publishAt: null,
      scheduledAt: null,
      intendedPublished: false,
      now,
    });
    assert.equal(v.ok, true);
    assert.equal(v.live, false);
  });

  it("published canonical row satisfies blogPostIsLive and verify intent", () => {
    const now = new Date("2026-05-01T12:00:00Z");
    const live = blogPostIsLive(
      {
        postStatus: BlogPostStatus.PUBLISHED,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
        publishAt: null,
        scheduledAt: null,
      },
      now,
    );
    assert.equal(live, true);
    const v = verifyLiveMatchesIntent({
      postStatus: BlogPostStatus.PUBLISHED,
      workflowStatus: BlogWorkflowStatus.PUBLISHED,
      publishAt: null,
      scheduledAt: null,
      intendedPublished: true,
      now,
    });
    assert.equal(v.ok, true);
    assert.equal(v.live, true);
  });

  it("buildLegacySourceProvenance includes cursor-generated and path", () => {
    const s = buildLegacySourceProvenance({
      sourceKind: "cursor",
      inputPath: "/tmp/post.json",
      generatedAt: "2026-05-01T00:00:00.000Z",
    });
    assert.match(s, /cursor-generated/);
    assert.match(s, /path=\/tmp\/post\.json/);
  });

  it("expectedCanonicalBlogPath matches global, RN hub, and other scoped nursing", () => {
    assert.equal(expectedCanonicalBlogPath("abc", null), "/blog/abc");
    assert.equal(expectedCanonicalBlogPath("abc", "rn"), "/blog/rn/abc");
    assert.equal(expectedCanonicalBlogPath("abc", "pn"), "/nursing/pn/blog/abc");
  });
});

describe("publish-generated-blog-post.mts contract", () => {
  it("dry-run path skips prisma writes (guard before create)", () => {
    const script = readScript("scripts/blog/publish-generated-blog-post.mts");
    assert.match(script, /if \(!args\.apply \|\| !prisma\) \{/);
    const guardIdx = script.indexOf("if (!args.apply || !prisma) {");
    const createIdx = script.indexOf("prisma.blogPost.create");
    assert.ok(guardIdx > 0 && createIdx > guardIdx);
  });

  it("--publish requires --apply", () => {
    const script = readScript("scripts/blog/publish-generated-blog-post.mts");
    assert.match(script, /--publish requires --apply/);
  });

  it("public blog detail is not wired to generator markdown/json files", () => {
    const page = readFileSync(join(appRoot, "src", "app", "(marketing)", "(default)", "blog", "[slug]", "page.tsx"), "utf8");
    assert.doesNotMatch(page, /publish-generated-blog-post/);
    assert.doesNotMatch(page, /\.mdx?['"]/);
    assert.match(page, /getPublishedBlogPostBySlug|safe-blog-queries/);
  });
});
