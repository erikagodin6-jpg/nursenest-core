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

test("PUBLISHED is always live (publishAt irrelevant)", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.PUBLISHED,
        publishAt: new Date("2099-01-01T00:00:00Z"),
        scheduledAt: null,
      },
      now,
    ),
    true,
  );
});

test("DRAFT, NEEDS_REVIEW, FAILED are never live", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  const past = new Date("2020-01-01T00:00:00Z");
  for (const postStatus of [BlogPostStatus.DRAFT, BlogPostStatus.NEEDS_REVIEW, BlogPostStatus.FAILED]) {
    assert.equal(blogPostIsLive({ postStatus, publishAt: past, scheduledAt: null }, now), false);
  }
});

test("APPROVED is live on public surfaces (matches list / SEO after editorial sign-off)", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      { postStatus: BlogPostStatus.APPROVED, publishAt: null, scheduledAt: null },
      now,
    ),
    true,
  );
  const where = blogLiveWhere(now) as { OR: Array<{ postStatus?: BlogPostStatus }> };
  assert.ok(where.OR.some((c) => c.postStatus === BlogPostStatus.APPROVED));
});

test("SCHEDULED uses scheduledAt when publishAt is null and time has passed", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: null,
        scheduledAt: new Date("2026-06-01T12:00:00Z"),
      },
      now,
    ),
    true,
  );
});
