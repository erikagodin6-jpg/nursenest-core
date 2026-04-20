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

  it("with rejectLearnerAppShell, rejects /app and /app/*", () => {
    assert.equal(safeCallbackPath("/app", { rejectLearnerAppShell: true }), null);
    assert.equal(safeCallbackPath("/app/", { rejectLearnerAppShell: true }), null);
    assert.equal(safeCallbackPath("/app?x=1", { rejectLearnerAppShell: true }), null);
    assert.equal(safeCallbackPath("/app/lessons", { rejectLearnerAppShell: true }), null);
    assert.equal(safeCallbackPath("/app/account/readiness", { rejectLearnerAppShell: true }), null);
    assert.equal(safeCallbackPath("/pricing", { rejectLearnerAppShell: true }), "/pricing");
    assert.equal(safeCallbackPath("/blog", { rejectLearnerAppShell: true }), "/blog");
    assert.equal(safeCallbackPath("/login?next=1", { rejectLearnerAppShell: true }), "/login?next=1");
    assert.equal(safeCallbackPath("/admin", { rejectLearnerAppShell: true }), "/admin");
  });
});
