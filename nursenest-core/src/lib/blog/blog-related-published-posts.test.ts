import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findRelatedPublishedBlogPosts } from "@/lib/blog/blog-related-published-posts";
import type { BlogRelatedPublishedClient } from "@/lib/blog/blog-related-published-posts";

describe("findRelatedPublishedBlogPosts", () => {
  it("queries by targetKeyword when tags are empty (before exam fallback)", async () => {
    const calls: unknown[] = [];
    const db = {
      blogPost: {
        findMany: async (args: unknown) => {
          calls.push(args);
          return [{ slug: "related-a", title: "A", excerpt: "Ex" }];
        },
      },
    } as unknown as BlogRelatedPublishedClient;

    const out = await findRelatedPublishedBlogPosts(
      {
        excludeId: "self-id",
        tags: [],
        targetKeyword: "Fluid Balance",
        exam: "NCLEX-RN",
      },
      db,
    );

    assert.equal(out.length, 1);
    assert.equal(out[0]?.slug, "related-a");
    assert.equal(calls.length, 1);
    const first = calls[0] as { where: { AND: unknown[] } };
    const kwClause = first.where.AND.find(
      (x): x is { targetKeyword: { equals: string; mode: string } } =>
        Boolean(x && typeof x === "object" && "targetKeyword" in (x as object)),
    );
    assert.ok(kwClause);
    assert.equal(kwClause.targetKeyword.equals, "Fluid Balance");
    assert.equal(kwClause.targetKeyword.mode, "insensitive");
  });
});
