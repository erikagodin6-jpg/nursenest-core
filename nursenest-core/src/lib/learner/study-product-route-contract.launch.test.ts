import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  subscriberStudyLaunchSurfaceHeader,
  validateFlashcardsPostLaunchRequest,
  validatePracticeExamPostLaunchRequest,
  validateSubscriberStudyLaunchSurface,
} from "./study-product-route-contract";

function req(headers: Record<string, string>) {
  return new Request("http://localhost/api/practice-tests", { method: "POST", headers });
}

describe("validatePracticeExamPostLaunchRequest", () => {
  it("allows missing Referer (non-browser callers)", () => {
    assert.deepEqual(validatePracticeExamPostLaunchRequest(req({})), { ok: true });
  });

  it("allows study app referers outside flashcards", () => {
    const ok = validatePracticeExamPostLaunchRequest(
      req({ Referer: "https://example.com/app/practice-tests" }),
    );
    assert.equal(ok.ok, true);
    const okExams = validatePracticeExamPostLaunchRequest(req({ Referer: "https://example.com/app/exams" }));
    assert.equal(okExams.ok, true);
  });

  it("rejects flashcards tab as launch context", () => {
    const r = validatePracticeExamPostLaunchRequest(
      req({ Referer: "https://example.com/app/flashcards/review" }),
    );
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.error, "INVALID_SURFACE");
      assert.equal(r.expected, "practice_exams");
      assert.equal(r.received, "flashcards");
    }
  });

  it("rejects explicit flashcards surface header", () => {
    const r = validatePracticeExamPostLaunchRequest(
      req({ "x-nn-study-launch-surface": "flashcards" }),
    );
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.error, "INVALID_SURFACE");
      assert.equal(r.received, "flashcards");
    }
  });

  it("rejects signed-out marketing referer (outside /app)", () => {
    const r = validatePracticeExamPostLaunchRequest(req({ Referer: "https://example.com/pricing" }));
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.error, "INVALID_SURFACE");
      assert.equal(r.received, "non_app_referer");
    }
  });
});

describe("validateFlashcardsPostLaunchRequest", () => {
  it("rejects practice-tests referer for flashcards saves", () => {
    const r = validateFlashcardsPostLaunchRequest(
      req({ Referer: "https://example.com/app/practice-tests" }),
    );
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.error, "INVALID_SURFACE");
      assert.equal(r.expected, "flashcards");
      assert.equal(r.received, "practice_tests");
    }
  });

  it("allows flashcards referer", () => {
    const r = validateFlashcardsPostLaunchRequest(req({ Referer: "https://example.com/app/flashcards" }));
    assert.equal(r.ok, true);
  });
});

describe("validateSubscriberStudyLaunchSurface (CAT alias)", () => {
  it("treats cat surface like practice exams for flashcards tab rejection", () => {
    const r = validateSubscriberStudyLaunchSurface(
      req({ Referer: "https://example.com/app/flashcards" }),
      "cat",
    );
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.received, "flashcards");
  });
});

describe("subscriberStudyLaunchSurfaceHeader", () => {
  it("reads x-nn-study-launch-surface", () => {
    const h = new Headers();
    h.set("X-NN-Study-Launch-Surface", "Practice_Exams");
    assert.equal(subscriberStudyLaunchSurfaceHeader({ headers: h } as Request), "practice_exams");
  });
});
