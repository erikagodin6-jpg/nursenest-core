import assert from "node:assert/strict";
import test from "node:test";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import {
  blogPostPublishedScalars,
  normalizeBlogPostStatusWriteFields,
  resolveBlogPostPublishAtExplicitOrExisting,
} from "@/lib/blog/blog-post-published-state";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";

test("normalizeBlogPostStatusWriteFields: PUBLISHED + null publishAt forces workflow PUBLISHED and publishAt=now", () => {
  const now = new Date("2025-03-10T15:00:00.000Z");
  const w = normalizeBlogPostStatusWriteFields({
    postStatus: BlogPostStatus.PUBLISHED,
    publishAt: null,
    now,
  });
  assert.equal(w.postStatus, BlogPostStatus.PUBLISHED);
  assert.equal(w.workflowStatus, BlogWorkflowStatus.PUBLISHED);
  assert.equal(w.publishAt?.getTime(), now.getTime());
  assert.ok(
    blogPostIsLive(
      { postStatus: w.postStatus, publishAt: w.publishAt, scheduledAt: null, workflowStatus: w.workflowStatus },
      now,
    ),
  );
});

test("normalizeBlogPostStatusWriteFields: PUBLISHED preserves future publishAt embargo with workflow PUBLISHED", () => {
  const now = new Date("2025-03-10T15:00:00.000Z");
  const future = new Date("2099-01-01T00:00:00.000Z");
  const w = normalizeBlogPostStatusWriteFields({
    postStatus: BlogPostStatus.PUBLISHED,
    publishAt: future,
    now,
  });
  assert.equal(w.workflowStatus, BlogWorkflowStatus.PUBLISHED);
  assert.equal(w.publishAt?.getTime(), future.getTime());
  assert.equal(blogPostIsLive({ postStatus: w.postStatus, publishAt: w.publishAt, workflowStatus: w.workflowStatus }, now), false);
});

test("normalizeBlogPostStatusWriteFields: SCHEDULED defaults workflow to SCHEDULED", () => {
  const when = new Date("2026-01-05T12:00:00.000Z");
  const w = normalizeBlogPostStatusWriteFields({
    postStatus: BlogPostStatus.SCHEDULED,
    publishAt: when,
  });
  assert.equal(w.workflowStatus, BlogWorkflowStatus.SCHEDULED);
});

test("blogPostPublishedScalars + resolveBlogPostPublishAtExplicitOrExisting", () => {
  const now = new Date("2025-01-01T00:00:00.000Z");
  const pa = resolveBlogPostPublishAtExplicitOrExisting(undefined, null, now);
  assert.equal(pa.getTime(), now.getTime());
  const s = blogPostPublishedScalars(null, now);
  assert.equal(s.workflowStatus, BlogWorkflowStatus.PUBLISHED);
});
