import assert from "node:assert/strict";
import test from "node:test";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import {
  blogLiveWhere,
  blogPostIsLive,
  buildBlogPublicListWhere,
  isBlogPostMarketingMetaVisible,
  isBlogPublicE2eTestArtifact,
} from "./blog-visibility";

test("SCHEDULED post with publishAt in the past is live (matches list/sitemap filters)", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  const row = {
    postStatus: BlogPostStatus.SCHEDULED,
    publishAt: new Date("2026-06-01T12:00:00Z"),
    scheduledAt: null as Date | null,
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
  };
  assert.equal(blogPostIsLive(row, now), true);
  const where = blogLiveWhere(now) as { AND: unknown[] };
  assert.ok(Array.isArray(where.AND));
  const core = where.AND[0] as { OR: unknown[] };
  assert.ok(Array.isArray(core.OR));
});

test("SCHEDULED post with publishAt in the future is not live", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: new Date("2026-07-01T12:00:00Z"),
        scheduledAt: null,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
      },
      now,
    ),
    false,
  );
});

test("PUBLISHED with future publishAt is not live (embargo; matches blogLiveWhere)", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.PUBLISHED,
        publishAt: new Date("2099-01-01T00:00:00Z"),
        scheduledAt: null,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
      },
      now,
    ),
    false,
  );
});

test("PUBLISHED with null publishAt is live", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.PUBLISHED,
        publishAt: null,
        scheduledAt: null,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
      },
      now,
    ),
    true,
  );
});

test("PUBLISHED with pipeline workflow is not live (matches blogLiveWhere)", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.PUBLISHED,
        publishAt: new Date("2020-01-01T00:00:00Z"),
        scheduledAt: null,
        workflowStatus: BlogWorkflowStatus.GENERATED,
      },
      now,
    ),
    false,
  );
});

test("PUBLISHED requires workflowStatus PUBLISHED (not editorial APPROVED workflow)", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.PUBLISHED,
        publishAt: new Date("2020-01-01T00:00:00Z"),
        scheduledAt: null,
        workflowStatus: BlogWorkflowStatus.APPROVED,
      },
      now,
    ),
    false,
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
      {
        postStatus: BlogPostStatus.APPROVED,
        publishAt: null,
        scheduledAt: null,
        workflowStatus: BlogWorkflowStatus.APPROVED,
      },
      now,
    ),
    true,
  );
  const where = blogLiveWhere(now);
  assert.ok(JSON.stringify(where).includes('"APPROVED"'), "blogLiveWhere should include an APPROVED branch");
});

test("isBlogPostMarketingMetaVisible matches draft vs live gates", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    isBlogPostMarketingMetaVisible(
      {
        postStatus: BlogPostStatus.DRAFT,
        publishAt: null,
        scheduledAt: null,
      },
      now,
    ),
    false,
  );
  assert.equal(
    isBlogPostMarketingMetaVisible(
      {
        postStatus: BlogPostStatus.PUBLISHED,
        publishAt: null,
        scheduledAt: null,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
      },
      now,
    ),
    true,
  );
});

test("SCHEDULED uses scheduledAt when publishAt is null and time has passed", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: null,
        scheduledAt: new Date("2026-06-01T12:00:00Z"),
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
      },
      now,
    ),
    true,
  );
});

test("SCHEDULED due date with pipeline workflow (e.g. GENERATED) is not live until workflow clears", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: new Date("2026-06-01T12:00:00Z"),
        scheduledAt: null,
        workflowStatus: BlogWorkflowStatus.GENERATED,
      },
      now,
    ),
    false,
  );
});

test("SCHEDULED due date with workflowStatus SCHEDULED is live (admin schedule must align workflow)", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(
    blogPostIsLive(
      {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: new Date("2026-06-01T12:00:00Z"),
        scheduledAt: null,
        workflowStatus: BlogWorkflowStatus.SCHEDULED,
      },
      now,
    ),
    true,
  );
});

test("isBlogPublicE2eTestArtifact matches slug/title bloge2e and Runtime QA title patterns", () => {
  assert.equal(isBlogPublicE2eTestArtifact("bloge2e-smoke-1", "Hello"), true);
  assert.equal(isBlogPublicE2eTestArtifact("any-slug", "BlogE2E title"), true);
  assert.equal(isBlogPublicE2eTestArtifact("ok-slug", "Runtime EN Published"), true);
  assert.equal(isBlogPublicE2eTestArtifact("ok-slug", "Runtime EN Scheduled"), true);
  assert.equal(isBlogPublicE2eTestArtifact("ok-slug", "Runtime Draft Scheduled"), true);
  assert.equal(isBlogPublicE2eTestArtifact("clinical-judgment-on-exam-day", "NCLEX tips"), false);
});

test("blogLiveWhere includes NOT clause excluding E2E artifact patterns", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  const json = JSON.stringify(blogLiveWhere(now));
  assert.ok(json.includes('"NOT"'));
  assert.ok(json.includes("bloge2e"));
});

test("buildBlogPublicListWhere can restrict main index to global rows when env is set", () => {
  const prev = process.env.BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS;
  process.env.BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS = "1";
  try {
    const now = new Date("2026-06-15T12:00:00Z");
    const where = buildBlogPublicListWhere(now, {});
    assert.ok(JSON.stringify(where).includes("careerSlug"));
  } finally {
    if (prev === undefined) delete process.env.BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS;
    else process.env.BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS = prev;
  }
});
