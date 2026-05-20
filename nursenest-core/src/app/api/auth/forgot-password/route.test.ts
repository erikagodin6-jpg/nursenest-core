import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { passwordResetCleanupWhere } from "@/app/api/auth/forgot-password/route";

describe("POST /api/auth/forgot-password token retention", () => {
  it("scopes cleanup to expired tokens for the same user", () => {
    const now = new Date("2026-04-13T12:00:00.000Z");
    const where = passwordResetCleanupWhere("user_12345678", now);
    assert.equal(where.userId, "user_12345678");
    assert.deepEqual(where.expiresAt, { lt: now });
  });
});
