import "./blog-public-read-tests-env";
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import type { BlogPost } from "@prisma/client";
import { BlogPostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getPublishedBlogPostBySlug } from "@/lib/blog/safe-blog-queries";

let findUniqueRestore: typeof prisma.blogPost.findUnique | null = null;

afterEach(() => {
  if (findUniqueRestore) {
    prisma.blogPost.findUnique = findUniqueRestore;
    findUniqueRestore = null;
  }
});

/** Minimal row for `resolveScopedBlogPostBySlug` with no `scope` (returns first `findUnique` hit). */
function stubFindUniqueForSlug(
  slug: string,
  partial: Pick<BlogPost, "postStatus" | "publishAt" | "scheduledAt"> & Partial<BlogPost>,
) {
  if (!findUniqueRestore) findUniqueRestore = prisma.blogPost.findUnique;
  const row = {
    id: "test-blog-post-id",
    slug,
    title: "Test title for slug visibility",
    careerSlug: null,
    exam: null,
    locale: "en",
    translationGroupId: null,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z"),
    body: "<p>x</p>",
    excerpt: "excerpt",
    ...partial,
  } as BlogPost;
  prisma.blogPost.findUnique = (async (args) => {
    const w = args as { where?: { slug?: string } };
    if (w?.where?.slug === slug) return row;
    return null;
  }) as typeof prisma.blogPost.findUnique;
}

describe("getPublishedBlogPostBySlug visibility (matches blogLiveWhere / list surfaces)", () => {
  it("returns a SCHEDULED row when publishAt is in the past", async () => {
    stubFindUniqueForSlug("sched-past", {
      postStatus: BlogPostStatus.SCHEDULED,
      publishAt: new Date("2020-01-01T00:00:00Z"),
      scheduledAt: null,
    });
    const got = await getPublishedBlogPostBySlug("sched-past");
    assert.ok(got);
    assert.equal(got.slug, "sched-past");
    assert.equal(got.postStatus, BlogPostStatus.SCHEDULED);
  });

  it("returns null for SCHEDULED when publishAt is in the future", async () => {
    stubFindUniqueForSlug("sched-future", {
      postStatus: BlogPostStatus.SCHEDULED,
      publishAt: new Date("2099-01-01T00:00:00Z"),
      scheduledAt: null,
    });
    const got = await getPublishedBlogPostBySlug("sched-future");
    assert.equal(got, null);
  });

  it("returns PUBLISHED rows", async () => {
    stubFindUniqueForSlug("live-pub", {
      postStatus: BlogPostStatus.PUBLISHED,
      publishAt: new Date("2024-06-01T00:00:00Z"),
      scheduledAt: null,
    });
    const got = await getPublishedBlogPostBySlug("live-pub");
    assert.ok(got);
    assert.equal(got.postStatus, BlogPostStatus.PUBLISHED);
  });

  it("returns null for DRAFT", async () => {
    stubFindUniqueForSlug("draft-only", {
      postStatus: BlogPostStatus.DRAFT,
      publishAt: null,
      scheduledAt: null,
    });
    assert.equal(await getPublishedBlogPostBySlug("draft-only"), null);
  });

  it("returns null for NEEDS_REVIEW and APPROVED", async () => {
    stubFindUniqueForSlug("needs-review", {
      postStatus: BlogPostStatus.NEEDS_REVIEW,
      publishAt: null,
      scheduledAt: null,
    });
    assert.equal(await getPublishedBlogPostBySlug("needs-review"), null);

    stubFindUniqueForSlug("approved", {
      postStatus: BlogPostStatus.APPROVED,
      publishAt: null,
      scheduledAt: null,
    });
    assert.equal(await getPublishedBlogPostBySlug("approved"), null);
  });
});
