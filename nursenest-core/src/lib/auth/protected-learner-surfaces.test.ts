import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  isProtectedLearnerApiPath,
  isProtectedLearnerAuthPath,
  isProtectedLearnerPagePath,
} from "@/lib/auth/protected-learner-surfaces";

describe("protected learner auth surfaces", () => {
  it("protects learner workspaces and activity aliases", () => {
    assert.equal(isProtectedLearnerPagePath("/app"), true);
    assert.equal(isProtectedLearnerPagePath("/app/flashcards/custom"), true);
    assert.equal(isProtectedLearnerPagePath("/dashboard"), true);
    assert.equal(isProtectedLearnerPagePath("/activities/cat"), true);
    assert.equal(isProtectedLearnerPagePath("/study/session"), true);
  });

  it("keeps public marketing routes available for preview and SEO", () => {
    assert.equal(isProtectedLearnerPagePath("/"), false);
    assert.equal(isProtectedLearnerPagePath("/pricing"), false);
    assert.equal(isProtectedLearnerPagePath("/flashcards"), false);
    assert.equal(isProtectedLearnerPagePath("/free-nclex-practice-questions"), false);
  });

  it("protects subscriber study APIs independently of page routing", () => {
    assert.equal(isProtectedLearnerApiPath("/api/flashcards/study-queue"), true);
    assert.equal(isProtectedLearnerApiPath("/api/questions/grade"), true);
    assert.equal(isProtectedLearnerApiPath("/api/practice-tests/cat-readiness"), true);
    assert.equal(isProtectedLearnerApiPath("/api/learner/pathway-lessons"), true);
    assert.equal(isProtectedLearnerApiPath("/api/auth/session"), false);
    assert.equal(isProtectedLearnerApiPath("/api/health"), false);
  });

  it("combines page and API protected surfaces", () => {
    assert.equal(isProtectedLearnerAuthPath("/app/questions"), true);
    assert.equal(isProtectedLearnerAuthPath("/api/exams/start"), true);
    assert.equal(isProtectedLearnerAuthPath("/blog"), false);
  });
});
