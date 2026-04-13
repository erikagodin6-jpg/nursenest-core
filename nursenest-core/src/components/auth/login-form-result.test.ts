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
});
