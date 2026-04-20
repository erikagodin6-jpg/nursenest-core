import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextAuthSecureCookieForRequest, resolveNextAuthHttpsForRequest } from "@/lib/auth/nextauth-secure-cookie-request";

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

  it("treats mixed forwarded proto as HTTPS when any segment is https", () => {
    assert.equal(
      nextAuthSecureCookieForRequest(req({ "x-forwarded-proto": "http, https" }, "http:")),
      true,
    );
  });

  it("honors x-forwarded-ssl on", () => {
    assert.equal(nextAuthSecureCookieForRequest(req({ "x-forwarded-ssl": "on" }, "http:")), true);
  });

  it("honors cf-visitor scheme https", () => {
    assert.equal(
      nextAuthSecureCookieForRequest(req({ "cf-visitor": '{"scheme":"https"}' }, "http:")),
      true,
    );
  });

  it("falls back to nextUrl.protocol when forwarded proto absent", () => {
    assert.equal(nextAuthSecureCookieForRequest(req({}, "https:")), true);
    assert.equal(nextAuthSecureCookieForRequest(req({}, "http:")), false);
  });

  it("resolveNextAuthHttpsForRequest exposes signal for diagnostics", () => {
    assert.deepEqual(resolveNextAuthHttpsForRequest(req({ "x-forwarded-proto": "https" }, "http:")), {
      secureCookie: true,
      signal: "xff_any_https",
    });
    assert.deepEqual(resolveNextAuthHttpsForRequest(req({ "x-forwarded-proto": "foo, bar" }, "https:")), {
      secureCookie: false,
      signal: "xff_inconclusive",
    });
    assert.deepEqual(resolveNextAuthHttpsForRequest(req({}, "https:")), {
      secureCookie: true,
      signal: "next_url_https",
    });
  });
});
