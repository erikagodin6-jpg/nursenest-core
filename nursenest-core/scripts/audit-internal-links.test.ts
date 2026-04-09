import assert from "node:assert/strict";
import { test } from "node:test";
import { createRouteValidator, isValidInternalPath, collectApiPatterns, collectPagePatterns } from "./audit-internal-links";

test("rejects garbage under locale-prefixed marketing paths", () => {
  const { isValidPath } = createRouteValidator();
  assert.equal(isValidPath("/fr/not-a-valid-programmatic-or-static-page"), false);
});

test("accepts programmatic slug and locale × programmatic", () => {
  const { isValidPath } = createRouteValidator();
  assert.equal(isValidPath("/nclex-rn-practice-questions"), true);
  assert.equal(isValidPath("/fr/nclex-rn-practice-questions"), true);
});

test("accepts exam hub paths", () => {
  const { isValidPath } = createRouteValidator();
  assert.equal(isValidPath("/us/rn/nclex-rn"), true);
});

test("accepts learner app paths", () => {
  const pages = collectPagePatterns();
  const apis = collectApiPatterns();
  assert.equal(isValidInternalPath("/app/questions", pages, apis), true);
  assert.equal(isValidInternalPath("/api/health", pages, apis), true);
});

/** User bar, account sidebar, redirects, dashboard widgets, and cross-link targets (query/hash stripped by audit). */
const LEARNER_ACCOUNT_AND_APP_PATHS = [
  "/app",
  "/app/account",
  "/app/account/overview",
  "/app/account/report-card",
  "/app/account/readiness",
  "/app/account/progress",
  "/app/account/billing",
  "/app/account/personal",
  "/app/account/study-preferences",
  "/app/account/security",
  "/app/account/settings",
  "/app/profile",
  "/app/lessons",
  "/app/questions",
  "/app/practice-tests",
  "/app/exams",
  "/app/study-plan",
  "/app/flashcards",
  "/app/flashcards/weak-areas",
  "/pricing",
  "/forgot-password",
  "/login",
  "/contact",
  "/terms",
  "/privacy",
  "/refund-policy",
  "/acceptable-use",
  "/api/learner/personal-profile",
  "/api/learner/exam-plan",
  "/api/auth/change-password",
  "/api/billing/portal",
] as const;

test("learner account surface and related paths resolve", () => {
  const pages = collectPagePatterns();
  const apis = collectApiPatterns();
  for (const p of LEARNER_ACCOUNT_AND_APP_PATHS) {
    assert.equal(isValidInternalPath(p, pages, apis), true, `expected valid: ${p}`);
  }
});
