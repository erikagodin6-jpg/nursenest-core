import assert from "node:assert/strict";
import test from "node:test";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";

import { ensurePublicBlogPostVisibilityForSeed } from "./ensure-public-visibility";

test("ensurePublicBlogPostVisibilityForSeed forces published schedule for seed rows", () => {
  const out = ensurePublicBlogPostVisibilityForSeed({
    slug: "pp-demo",
    title: "Demo",
    postStatus: BlogPostStatus.DRAFT,
    publishAt: null,
    scheduledAt: null,
    workflowStatus: BlogWorkflowStatus.NEEDS_SEO_REVIEW,
  });
  assert.equal(out.postStatus, BlogPostStatus.PUBLISHED);
  assert.equal(out.workflowStatus, BlogWorkflowStatus.PUBLISHED);
  assert.ok(out.publishAt instanceof Date);
});

test("ensurePublicBlogPostVisibilityForSeed repairs invalid slug from title", () => {
  const out = ensurePublicBlogPostVisibilityForSeed({
    slug: "Bad_Slug!!!",
    title: "Valid Title Here",
    postStatus: BlogPostStatus.PUBLISHED,
    publishAt: new Date(),
    scheduledAt: null,
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
  });
  assert.match(out.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});
