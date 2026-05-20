import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import {
  classifyRecoverBlogVisibilityRow,
  RECOVER_BLOG_VISIBILITY_MIN_WORDS_EXCLUSIVE,
} from "./recover-blog-visibility";

const longBody = `<p>${Array.from({ length: 900 }, () => "word").join(" ")}</p>`;

describe("recover-blog-visibility", () => {
  it("accepts PUBLISHED + GENERATED + long body + valid slug", () => {
    const r = classifyRecoverBlogVisibilityRow({
      postStatus: BlogPostStatus.PUBLISHED,
      workflowStatus: BlogWorkflowStatus.GENERATED,
      slug: "valid-recovery-slug",
      body: longBody,
      duplicateSlug: false,
    });
    assert.equal(r.ok, true);
  });

  it("rejects duplicate slug", () => {
    const r = classifyRecoverBlogVisibilityRow({
      postStatus: BlogPostStatus.PUBLISHED,
      workflowStatus: BlogWorkflowStatus.GENERATED,
      slug: "valid-recovery-slug",
      body: longBody,
      duplicateSlug: true,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "duplicate_slug");
  });

  it("rejects short body", () => {
    const r = classifyRecoverBlogVisibilityRow({
      postStatus: BlogPostStatus.PUBLISHED,
      workflowStatus: BlogWorkflowStatus.GENERATED,
      slug: "valid-recovery-slug",
      body: "<p>short</p>",
      duplicateSlug: false,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "body_too_short");
  });

  it(`rejects body at exactly ${RECOVER_BLOG_VISIBILITY_MIN_WORDS_EXCLUSIVE} words`, () => {
    const body = `<p>${Array.from({ length: RECOVER_BLOG_VISIBILITY_MIN_WORDS_EXCLUSIVE }, () => "w").join(" ")}</p>`;
    const r = classifyRecoverBlogVisibilityRow({
      postStatus: BlogPostStatus.PUBLISHED,
      workflowStatus: BlogWorkflowStatus.OUTLINE_READY,
      slug: "valid-recovery-slug",
      body,
      duplicateSlug: false,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "body_too_short");
  });

  it("rejects failed workflow", () => {
    const r = classifyRecoverBlogVisibilityRow({
      postStatus: BlogPostStatus.PUBLISHED,
      workflowStatus: BlogWorkflowStatus.FAILED_GENERATION,
      slug: "valid-recovery-slug",
      body: longBody,
      duplicateSlug: false,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "failed_workflow");
  });

  it("rejects DRAFT postStatus", () => {
    const r = classifyRecoverBlogVisibilityRow({
      postStatus: BlogPostStatus.DRAFT,
      workflowStatus: BlogWorkflowStatus.GENERATED,
      slug: "valid-recovery-slug",
      body: longBody,
      duplicateSlug: false,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "wrong_post_status");
  });
});
