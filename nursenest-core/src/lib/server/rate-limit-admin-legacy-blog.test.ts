import assert from "node:assert/strict";
import test from "node:test";
import { adminLegacyBlogToolingRateLimitKind } from "@/lib/server/rate-limit";

test("adminLegacyBlogToolingRateLimitKind classifies legacy generator POSTs", () => {
  assert.equal(adminLegacyBlogToolingRateLimitKind("/api/admin/blog/generate-ai", "POST"), "generate_ai");
  assert.equal(adminLegacyBlogToolingRateLimitKind("/api/admin/blog/batch-chunk", "POST"), "batch_chunk");
  assert.equal(adminLegacyBlogToolingRateLimitKind("/api/admin/blog/generate-ai", "GET"), null);
  assert.equal(adminLegacyBlogToolingRateLimitKind("/api/admin/blog/other", "POST"), null);
});
