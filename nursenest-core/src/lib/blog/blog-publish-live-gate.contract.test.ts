import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";

describe("blogPostIsLive (public /blog + sitemap contract)", () => {
  const now = new Date("2026-05-01T12:00:00.000Z");

  it("treats PUBLISHED + workflow PUBLISHED with null publishAt as live", () => {
    assert.equal(
      blogPostIsLive(
        {
          postStatus: BlogPostStatus.PUBLISHED,
          publishAt: null,
          workflowStatus: BlogWorkflowStatus.PUBLISHED,
        },
        now,
      ),
      true,
    );
  });

  it("hides DRAFT from public live surfaces", () => {
    assert.equal(
      blogPostIsLive(
        {
          postStatus: BlogPostStatus.DRAFT,
          publishAt: null,
          workflowStatus: BlogWorkflowStatus.GENERATED,
        },
        now,
      ),
      false,
    );
  });

  it("hides PUBLISHED when publishAt is in the future", () => {
    assert.equal(
      blogPostIsLive(
        {
          postStatus: BlogPostStatus.PUBLISHED,
          publishAt: new Date("2027-01-01T00:00:00.000Z"),
          workflowStatus: BlogWorkflowStatus.PUBLISHED,
        },
        now,
      ),
      false,
    );
  });

  it("hides PUBLISHED when workflow is still GENERATED (editorial pipeline)", () => {
    assert.equal(
      blogPostIsLive(
        {
          postStatus: BlogPostStatus.PUBLISHED,
          publishAt: null,
          workflowStatus: BlogWorkflowStatus.GENERATED,
        },
        now,
      ),
      false,
    );
  });
});
