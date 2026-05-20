import assert from "node:assert/strict";
import test from "node:test";
import { formatAdminRateLimitMessageFromJson } from "@/lib/admin/format-admin-rate-limit-message";

test("formatAdminRateLimitMessageFromJson surfaces scope, path, bucket, cap, retry", () => {
  const s = formatAdminRateLimitMessageFromJson({
    error: "Too many requests",
    code: "rate_limit_exceeded",
    scope: "admin_blog_content",
    action: "write",
    limiter: "admin_blog_content",
    bucketType: "dedicated",
    bucketKeyType: "user",
    path: "/api/admin/blog/xyz",
    windowMs: 60_000,
    max: 900,
    retryAfterSec: 30,
  });
  assert.match(s, /Too many requests/);
  assert.match(s, /admin_blog_content/);
  assert.match(s, /write/);
  assert.match(s, /bucket: user/);
  assert.match(s, /path:/);
  assert.match(s, /cap: 900\/60s/);
  assert.match(s, /retry ~30s/);
});

test("formatAdminRateLimitMessageFromJson falls back to error string when not a known RL shape", () => {
  assert.equal(formatAdminRateLimitMessageFromJson({ error: "Slug taken" }), "Slug taken");
});
