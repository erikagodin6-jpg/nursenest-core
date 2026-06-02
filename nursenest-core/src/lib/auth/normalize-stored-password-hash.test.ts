import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeStoredPasswordHash } from "@/lib/auth/normalize-stored-password-hash";

describe("normalizeStoredPasswordHash", () => {
  it("returns null for null, undefined, or empty", () => {
    assert.equal(normalizeStoredPasswordHash(null), null);
    assert.equal(normalizeStoredPasswordHash(undefined), null);
    assert.equal(normalizeStoredPasswordHash(""), null);
    assert.equal(normalizeStoredPasswordHash("   "), null);
  });

  it("trims surrounding whitespace from bcrypt strings", () => {
    const h = "$2b$12$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789012";
    assert.equal(normalizeStoredPasswordHash(`  ${h}  `), h);
  });
});
