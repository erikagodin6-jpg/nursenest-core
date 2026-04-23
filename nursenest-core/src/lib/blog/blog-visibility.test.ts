import assert from "node:assert/strict";
import test from "node:test";
import { BlogPostStatus } from "@prisma/client";
import { blogLiveWhere, blogPostIsLive } from "./blog-visibility";

test("SCHEDULED post with publishAt in the past is live (matches list/sitemap filters)", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  const row = {
    postStatus: BlogPostStatus.SCHEDULED,
    publishAt: new Date("2026-06-01T12:00:00Z"),
    scheduledAt: null as Date | null,
  };
  assert.equal(blogPostIsLive(row, now), true);
  const where = blogLiveWhere(now) as { OR: unknown[] };
  assert.ok(Array.isArray(where.OR));
});

test("SCHEDULED post with publishAt in the future is not live", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: new Date("2026-07-01T12:00:00Z"),
        scheduledAt: null,
      },
      now,
    ),
    false,
  );
});
