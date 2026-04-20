import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAuthStrictRateLimit429Json } from "@/lib/server/rate-limit-auth-429-json";

describe("auth strict 429 JSON (NextAuth signIn redirect:false compat)", () => {
  it("includes a parseable /login URL with rate_limit_exceeded code (never /api/auth/*)", () => {
    const body = buildAuthStrictRateLimit429Json("https://www.example.com", 42);
    assert.equal(typeof body.url, "string");
    const u = new URL(String(body.url));
    assert.equal(u.pathname, "/login");
    assert.equal(u.searchParams.get("error"), "AccessDenied");
    assert.equal(u.searchParams.get("code"), "rate_limit_exceeded");
    assert.equal(u.searchParams.get("retryAfterSec"), "42");
    assert.equal(body.retryAfterSec, 42);
  });
});
