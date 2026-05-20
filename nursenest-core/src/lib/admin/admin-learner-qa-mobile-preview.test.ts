import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  adminLearnerQaMobilePreviewHref,
  clampAdminLearnerQaPreviewWidth,
  sanitizeAdminLearnerQaIframePath,
} from "@/lib/admin/admin-learner-qa-mobile-preview";

describe("sanitizeAdminLearnerQaIframePath", () => {
  it("defaults empty to /app", () => {
    assert.equal(sanitizeAdminLearnerQaIframePath(""), "/app");
    assert.equal(sanitizeAdminLearnerQaIframePath(undefined), "/app");
  });

  it("allows /app and nested learner paths", () => {
    assert.equal(sanitizeAdminLearnerQaIframePath("/app"), "/app");
    assert.equal(sanitizeAdminLearnerQaIframePath("/app/flashcards"), "/app/flashcards");
  });

  it("strips query and hash", () => {
    assert.equal(sanitizeAdminLearnerQaIframePath("/app/lessons?x=1"), "/app/lessons");
    assert.equal(sanitizeAdminLearnerQaIframePath("/app/lessons#h"), "/app/lessons");
  });

  it("rejects traversal and non-app prefixes", () => {
    assert.equal(sanitizeAdminLearnerQaIframePath("/app/../admin"), "/app");
    assert.equal(sanitizeAdminLearnerQaIframePath("/admin/users"), "/app");
    assert.equal(sanitizeAdminLearnerQaIframePath("//evil.com"), "/app");
    assert.equal(sanitizeAdminLearnerQaIframePath("https://x.test/app"), "/app");
    assert.equal(sanitizeAdminLearnerQaIframePath("/apple"), "/app");
  });
});

describe("clampAdminLearnerQaPreviewWidth", () => {
  it("clamps and defaults", () => {
    assert.equal(clampAdminLearnerQaPreviewWidth(390), 390);
    assert.equal(clampAdminLearnerQaPreviewWidth(200), 390);
    assert.equal(clampAdminLearnerQaPreviewWidth(2000), 896);
  });
});

describe("adminLearnerQaMobilePreviewHref", () => {
  it("encodes path and width", () => {
    const h = adminLearnerQaMobilePreviewHref("/app/questions", 375);
    assert.ok(h.startsWith("/admin/learner-qa/mobile?"));
    assert.ok(h.includes("width=375"));
    assert.ok(h.includes(encodeURIComponent("/app/questions")));
  });
});
