import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { blogBulkChunkPayloadSchema, blogBulkFilterSchema } from "@/lib/admin/content-bulk/blog-bulk-schema";

describe("blogBulkFilterSchema", () => {
  it("accepts slug + exam", () => {
    const r = blogBulkFilterSchema.safeParse({ slugs: ["a"], exam: "RN" });
    assert.equal(r.success, true);
  });

  it("rejects empty filters", () => {
    const r = blogBulkFilterSchema.safeParse({});
    assert.equal(r.success, false);
  });
});

describe("blogBulkChunkPayloadSchema", () => {
  it("parses chunk payload", () => {
    const r = blogBulkChunkPayloadSchema.safeParse({
      operation: "blog_seo_bundle_refresh",
      postIds: ["postid01"],
      correlationId: "corr-123456789012345678901234",
      chunkIndex: 0,
      totalChunks: 2,
      createdById: "userxxxxxxxxxxxxxxxx",
    });
    assert.equal(r.success, true);
  });
});
