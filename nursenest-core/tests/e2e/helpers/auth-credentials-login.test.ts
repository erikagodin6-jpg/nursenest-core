import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseCredentialsCallbackPayload } from "./auth-credentials-login";

describe("parseCredentialsCallbackPayload", () => {
  it("treats /app redirect without error as success", () => {
    const r = parseCredentialsCallbackPayload({ url: "/app" });
    assert.equal(r.ok, true);
    assert.equal(r.errorParam, null);
  });
  it("detects CredentialsSignin in query string", () => {
    const r = parseCredentialsCallbackPayload({
      url: "/login?error=CredentialsSignin&code=credentials",
    });
    assert.equal(r.ok, false);
    assert.equal(r.errorParam, "CredentialsSignin");
  });
});
