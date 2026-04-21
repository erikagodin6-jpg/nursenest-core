import assert from "node:assert/strict";
import test from "node:test";
import {
  adminBlogContentApiRateLimitKind,
  adminLegacyBlogToolingRateLimitKind,
  rateLimitUserPartitionFromSessionJwt,
} from "@/lib/server/rate-limit";

test("adminLegacyBlogToolingRateLimitKind classifies legacy generator POSTs", () => {
  assert.equal(adminLegacyBlogToolingRateLimitKind("/api/admin/blog/generate-ai", "POST"), "generate_ai");
  assert.equal(adminLegacyBlogToolingRateLimitKind("/api/admin/blog/batch-chunk", "POST"), "batch_chunk");
  assert.equal(adminLegacyBlogToolingRateLimitKind("/api/admin/blog/generate-ai", "GET"), null);
  assert.equal(adminLegacyBlogToolingRateLimitKind("/api/admin/blog/other", "POST"), null);
});

test("adminBlogContentApiRateLimitKind covers blog APIs except batch-schedule and legacy tooling", () => {
  assert.equal(adminBlogContentApiRateLimitKind("/api/admin/blog/campaigns", "GET"), "read");
  assert.equal(adminBlogContentApiRateLimitKind("/api/admin/blog/campaigns/abc/run-chunk", "POST"), "write");
  assert.equal(adminBlogContentApiRateLimitKind("/api/admin/blog/batch-schedule", "GET"), null);
  assert.equal(adminBlogContentApiRateLimitKind("/api/admin/blog/batch-schedule/run", "POST"), null);
  assert.equal(adminBlogContentApiRateLimitKind("/api/admin/blog/generate-ai", "POST"), null);
  assert.equal(adminBlogContentApiRateLimitKind("/api/admin/blog/batch-chunk", "POST"), null);
});

test("rateLimitUserPartitionFromSessionJwt prefers sub, then id, then stable email partition", () => {
  assert.equal(rateLimitUserPartitionFromSessionJwt({ sub: "user-1" } as never), "user-1");
  assert.equal(rateLimitUserPartitionFromSessionJwt({ sub: "", id: "legacy-2" } as never), "legacy-2");
  const p = rateLimitUserPartitionFromSessionJwt({ sub: "", id: null, email: "A@Example.com" } as never);
  assert.ok(p?.startsWith("jwt_email:"));
  assert.equal(rateLimitUserPartitionFromSessionJwt(null), null);
});
