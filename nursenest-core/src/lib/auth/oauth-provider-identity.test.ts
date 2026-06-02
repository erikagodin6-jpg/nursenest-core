import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isApplePrivateRelayEmail } from "@/lib/auth/oauth-provider-identity";

describe("isApplePrivateRelayEmail", () => {
  it("detects Apple Hide My Email relay addresses", () => {
    assert.equal(isApplePrivateRelayEmail("abc@privaterelay.appleid.com"), true);
    assert.equal(isApplePrivateRelayEmail("USER@privaterelay.appleid.com"), true);
  });

  it("rejects normal addresses", () => {
    assert.equal(isApplePrivateRelayEmail("learner@gmail.com"), false);
    assert.equal(isApplePrivateRelayEmail(""), false);
  });
});
