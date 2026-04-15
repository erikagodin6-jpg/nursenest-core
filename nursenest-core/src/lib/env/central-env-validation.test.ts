import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { looksLikeSecretMaterial } from "@/lib/env/central-env-validation";

describe("central-env-validation", () => {
  it("flags obvious secret material", () => {
    assert.equal(looksLikeSecretMaterial("sk_live_1234567890123456789012345678"), true);
    assert.equal(looksLikeSecretMaterial("whsec_1234567890123456789012345678"), true);
    assert.equal(looksLikeSecretMaterial("postgresql://alice:supersecret@db.example.com:5432/app"), true);
  });

  it("does not flag placeholders or short strings", () => {
    assert.equal(looksLikeSecretMaterial("sk_test_REPLACE_ME"), false);
    assert.equal(looksLikeSecretMaterial("public"), false);
  });
});
