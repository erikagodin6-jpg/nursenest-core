import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";
import { BLOG_ARTICLE_MIN_WORDS } from "@/lib/blog/blog-word-count";
import {
  hiddenBlogImportSourceTypeMatchesFilter,
  longFormSectionsToHtml,
  planHiddenBlogImport,
} from "@/lib/blog/hidden-blog-content-import-plan";

const now = new Date("2026-05-01T12:00:00Z");

const bigBody = `<p>${Array.from({ length: BLOG_ARTICLE_MIN_WORDS + 50 }, () => "word").join(" ")}</p>`;

describe("hidden-blog-content-import-plan", () => {
  it("blocks metadata-only inventory reasons", () => {
    const r = planHiddenBlogImport({
      sourceType: "manifest_import_ready",
      title: "T",
      slug: "s",
      excerpt: "e".repeat(40),
      bodyHtml: bigBody,
      wordCount: BLOG_ARTICLE_MIN_WORDS + 50,
      seoTitle: "seo",
      seoDescription: "meta here with enough length for excerpt fallbacks and validation paths",
      category: "cardiovascular",
      tags: ["a"],
      careerSlug: null,
      exam: null,
      locale: "en",
      inventoryReasons: ["metadata_only_manifest_entry", "missing_full_body"],
      existing: null,
      flags: { updateExisting: false, allowPublishedUpdate: false, publish: false },
      now,
    });
    assert.equal(r.outcome, "skip");
  });

  it("skips duplicate slug without --update-existing", () => {
    const r = planHiddenBlogImport({
      sourceType: "manifest_import_ready",
      title: "T",
      slug: "dup-slug",
      excerpt: "e".repeat(40),
      bodyHtml: bigBody,
      wordCount: BLOG_ARTICLE_MIN_WORDS + 50,
      seoTitle: "seo",
      seoDescription: "meta here with enough length for excerpt fallbacks and validation paths",
      category: "New grad nursing",
      tags: ["nclex"],
      careerSlug: null,
      exam: "NCLEX-RN",
      locale: "en",
      inventoryReasons: [],
      existing: {
        id: "id1",
        postStatus: BlogPostStatus.DRAFT,
        workflowStatus: BlogWorkflowStatus.GENERATED,
        publishAt: null,
        scheduledAt: null,
      },
      flags: { updateExisting: false, allowPublishedUpdate: false, publish: false },
      now,
    });
    assert.equal(r.outcome, "skip");
    assert.ok(r.reasons.some((x) => x.includes("slug_exists")));
  });

  it("allows update draft when --update-existing", () => {
    const r = planHiddenBlogImport({
      sourceType: "newgrad_batch_file",
      title: "T",
      slug: "dup-slug",
      excerpt: "e".repeat(40),
      bodyHtml: bigBody,
      wordCount: BLOG_ARTICLE_MIN_WORDS + 50,
      seoTitle: "seo",
      seoDescription: "meta here with enough length for excerpt fallbacks and validation paths",
      category: "New grad nursing",
      tags: ["nclex"],
      careerSlug: null,
      exam: "NCLEX-RN",
      locale: "en",
      inventoryReasons: [],
      existing: {
        id: "id1",
        postStatus: BlogPostStatus.DRAFT,
        workflowStatus: BlogWorkflowStatus.GENERATED,
        publishAt: null,
        scheduledAt: null,
      },
      flags: { updateExisting: true, allowPublishedUpdate: false, publish: false },
      now,
    });
    assert.equal(r.outcome, "update_draft");
  });

  it("full-body manifest cohort plans create_draft", () => {
    const r = planHiddenBlogImport({
      sourceType: "manifest_import_ready",
      title: "Sample import title for nursing students",
      slug: "sample-slug-for-import-plan",
      excerpt: "e".repeat(80),
      bodyHtml: bigBody,
      wordCount: BLOG_ARTICLE_MIN_WORDS + 50,
      seoTitle: "",
      seoDescription: "",
      category: "cardiovascular",
      tags: ["nclex"],
      careerSlug: null,
      exam: "NCLEX-RN",
      locale: "en",
      inventoryReasons: ["import_ready_json_exists_but_not_live"],
      existing: null,
      flags: { updateExisting: false, allowPublishedUpdate: false, publish: false },
      now,
    });
    assert.equal(r.outcome, "create_draft");
    assert.ok(r.resolvedSeoTitle.length > 0);
    assert.ok(r.resolvedSeoDescription.length > 0);
  });

  it("source filter batch01 vs longform", () => {
    assert.equal(hiddenBlogImportSourceTypeMatchesFilter("manifest_import_ready", "batch01"), true);
    assert.equal(hiddenBlogImportSourceTypeMatchesFilter("long_form_post_ts", "batch01"), false);
    assert.equal(hiddenBlogImportSourceTypeMatchesFilter("long_form_post_ts", "longform"), true);
    assert.equal(hiddenBlogImportSourceTypeMatchesFilter("long_form_post_ts_chunk2", "longform"), true);
  });

  it("longFormSectionsToHtml escapes angle brackets", () => {
    const html = longFormSectionsToHtml([{ heading: "A & B", body: "Line1\n\nLine2 <script>" }]);
    assert.match(html, /&lt;script&gt;/);
    assert.match(html, /<h2>/);
  });

  it("blogPostIsLive matches PUBLISHED + workflow PUBLISHED + publishAt <= now", () => {
    assert.equal(
      blogPostIsLive(
        {
          postStatus: BlogPostStatus.PUBLISHED,
          workflowStatus: BlogWorkflowStatus.PUBLISHED,
          publishAt: new Date("2020-01-01T00:00:00Z"),
          scheduledAt: null,
        },
        now,
      ),
      true,
    );
    assert.equal(
      blogPostIsLive(
        {
          postStatus: BlogPostStatus.PUBLISHED,
          workflowStatus: BlogWorkflowStatus.GENERATED,
          publishAt: null,
          scheduledAt: null,
        },
        now,
      ),
      false,
    );
    assert.equal(
      blogPostIsLive(
        {
          postStatus: BlogPostStatus.NEEDS_REVIEW,
          workflowStatus: BlogWorkflowStatus.NEEDS_SEO_REVIEW,
          publishAt: null,
          scheduledAt: null,
        },
        now,
      ),
      false,
    );
  });
});
