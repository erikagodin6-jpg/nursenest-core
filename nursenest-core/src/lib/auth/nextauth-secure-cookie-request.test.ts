import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextAuthSecureCookieForRequest } from "@/lib/auth/nextauth-secure-cookie-request";

function req(headers: Record<string, string>, protocol: "http:" | "https:" = "https:") {
  const h = new Headers(headers);
  return { headers: h, nextUrl: new URL(`${protocol}//example.com/api/admin/x`) };
}

describe("nextAuthSecureCookieForRequest", () => {
  it("prefers x-forwarded-proto https over internal URL", () => {
    assert.equal(
      nextAuthSecureCookieForRequest(
        req({ "x-forwarded-proto": "https" }, "http:"),
      ),
      true,
    );
  });

  it("treats x-forwarded-proto http as non-secure cookie hint", () => {
    assert.equal(nextAuthSecureCookieForRequest(req({ "x-forwarded-proto": "http" }, "https:")), false);
  });

  it("falls back to nextUrl.protocol when forwarded proto absent", () => {
    assert.equal(nextAuthSecureCookieForRequest(req({}, "https:")), true);
    assert.equal(nextAuthSecureCookieForRequest(req({}, "http:")), false);
  });
});
