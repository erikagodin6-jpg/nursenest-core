import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isUserFacingAuthApiPath, sanitizeClientNavigationHref } from "@/lib/auth/safe-auth-ui-redirect";

describe("safe-auth-ui-redirect", () => {
  it("detects /api/auth/* as unsafe SPA targets", () => {
    assert.equal(isUserFacingAuthApiPath("/api/auth/error"), true);
    assert.equal(isUserFacingAuthApiPath("/api/auth/signin?x=1"), true);
    assert.equal(isUserFacingAuthApiPath("https://www.example.com/api/auth/session"), true);
  });

  it("allows normal app and marketing paths", () => {
    assert.equal(isUserFacingAuthApiPath("/login"), false);
    assert.equal(isUserFacingAuthApiPath("/app"), false);
    assert.equal(isUserFacingAuthApiPath("/pricing"), false);
  });

  it("sanitizeClientNavigationHref replaces auth API paths", () => {
    assert.equal(sanitizeClientNavigationHref("/api/auth/error", "/login"), "/login");
    assert.equal(sanitizeClientNavigationHref("/app", "/login"), "/app");
  });
});
