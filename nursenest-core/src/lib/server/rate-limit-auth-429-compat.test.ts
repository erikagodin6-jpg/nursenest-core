import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { NextRequest } from "next/server";
import {
  buildAuthStrictRateLimit429Json,
  publicRequestOriginForAuthUiRedirect,
} from "@/lib/server/rate-limit-auth-429-json";

function mockReq(headers: Record<string, string>, nextUrl: string): Pick<NextRequest, "headers" | "nextUrl"> {
  const h = new Headers();
  for (const [k, v] of Object.entries(headers)) h.set(k, v);
  return { headers: h, nextUrl: new URL(nextUrl) } as Pick<NextRequest, "headers" | "nextUrl">;
}

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

  it("publicRequestOriginForAuthUiRedirect prefers Host over internal nextUrl origin", () => {
    const origin = publicRequestOriginForAuthUiRedirect(
      mockReq({ host: "www.nursenest.ca", "x-forwarded-proto": "https" }, "http://127.0.0.1:37120/api/auth/csrf"),
    );
    assert.equal(origin, "https://www.nursenest.ca");
  });

  it("publicRequestOriginForAuthUiRedirect prefers x-forwarded-host when present", () => {
    const origin = publicRequestOriginForAuthUiRedirect(
      mockReq(
        { "x-forwarded-host": "www.example.org", "x-forwarded-proto": "https", host: "internal.local" },
        "http://localhost:9999/foo",
      ),
    );
    assert.equal(origin, "https://www.example.org");
  });
});
