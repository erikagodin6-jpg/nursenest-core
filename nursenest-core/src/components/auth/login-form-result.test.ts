import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveLoginSubmitOutcome, type LoginSubmitResultLike } from "@/components/auth/login-form-result";

describe("resolveLoginSubmitOutcome", () => {
  it("treats confirmed session as success even when signIn returns credentials error", () => {
    const result: LoginSubmitResultLike = {
      error: "CredentialsSignin",
      code: "CredentialsSignin",
      status: 401,
      ok: false,
    };
    const outcome = resolveLoginSubmitOutcome(result, true);
    assert.equal(outcome, "success");
  });

  it("returns invalid credentials when credentials sign-in fails and no session exists", () => {
    const result: LoginSubmitResultLike = {
      error: "CredentialsSignin",
      code: "CredentialsSignin",
      status: 401,
      ok: false,
    };
    const outcome = resolveLoginSubmitOutcome(result, false);
    assert.equal(outcome, "invalid_credentials");
  });

  it("matches next-auth/react + @auth/core: failed credential POST uses error=CredentialsSignin&code=credentials with HTTP 200", () => {
    const result: LoginSubmitResultLike = {
      error: "CredentialsSignin",
      code: "credentials",
      status: 200,
      ok: true,
    };
    assert.equal(resolveLoginSubmitOutcome(result, false), "invalid_credentials");
  });

  it("treats ok: true without error as success (Auth.js happy path)", () => {
    const result: LoginSubmitResultLike = {
      error: undefined,
      code: undefined,
      status: 200,
      ok: true,
      url: "https://example.com/app",
    };
    assert.equal(resolveLoginSubmitOutcome(result, false), "success");
  });
});
