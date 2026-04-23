import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { adminMutationFailure, type AdminMutationResult } from "./admin-data-result";

describe("AdminMutationResult", () => {
  it("adminMutationFailure always includes code and message", () => {
    const r: AdminMutationResult = adminMutationFailure("test_code", "hello");
    assert.equal(r.ok, false);
    if (r.ok) return;
    assert.equal(r.code, "test_code");
    assert.equal(r.message, "hello");
  });
});
