import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeCallbackPath } from "@/lib/auth/safe-callback-path";

describe("safeCallbackPath", () => {
  it("returns same-origin path-only callbacks", () => {
    assert.equal(safeCallbackPath("/app/dashboard"), "/app/dashboard");
    assert.equal(safeCallbackPath("/app"), "/app");
  });

  it("rejects cross-origin values", () => {
    assert.equal(safeCallbackPath("https://evil.example/phish"), null);
  });

  it("rejects API paths so post-login navigation cannot render raw JSON", () => {
    assert.equal(safeCallbackPath("/api/auth/session"), null);
    assert.equal(safeCallbackPath("/api/pricing"), null);
    assert.equal(safeCallbackPath("/api/foo/bar"), null);
  });

  it("optionally rejects only bare /app for marketing auth flows", () => {
    assert.equal(safeCallbackPath("/app", { rejectLearnerAppShell: true }), null);
    assert.equal(safeCallbackPath("/app/", { rejectLearnerAppShell: true }), null);
    assert.equal(safeCallbackPath("/app?x=1", { rejectLearnerAppShell: true }), null);
    assert.equal(safeCallbackPath("/app/lessons", { rejectLearnerAppShell: true }), "/app/lessons");
    assert.equal(safeCallbackPath("/app/account/readiness", { rejectLearnerAppShell: true }), "/app/account/readiness");
    assert.equal(safeCallbackPath("/pricing", { rejectLearnerAppShell: true }), "/pricing");
  });
});
