import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  checkEntitlement,
  getUserEntitlements,
  isActiveTester,
  resolveEntitlementSync,
} from "../entitlements";
import {
  validateExamForPublish,
  normalizeExamQuestions,
  recordExamFailure,
  recordExamSuccess,
  isCircuitOpen,
  resetCircuit,
  getCircuitStatus,
} from "../exam-resilience-engine";
import {
  validateExamQuestion,
  validateFlashcard,
  validateLessonContent,
  filterValidItems,
} from "../backend-resilience";
import {
  computeAbilityEstimate,
  selectNextItem,
  checkDifficultyCalibration,
} from "../cat-engine";

function makeUser(overrides: Record<string, any> = {}) {
  return {
    id: "user-1",
    username: "testuser",
    tier: "free",
    tester_access: false,
    tester_expiry: null,
    trial_active: false,
    trial_end: null,
    is_lifetime: false,
    stripe_subscription_id: null,
    region: "US",
    plan_expires_at: null,
    promo_active: false,
    promo_expires_at: null,
    referral_premium_active: false,
    referral_premium_expires_at: null,
    legacy_access: false,
    bundle_id: null,
    bundle_expires_at: null,
    ...overrides,
  };
}

describe("Entitlement Resolver - Provisional & Grace Window", () => {
  test("resolveEntitlementSync marks non-provisional for standard tier access", () => {
    const user = makeUser({ tier: "rpn" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.provisional).toBe(false);
    expect(decision.hasAccess).toBe(true);
  });

  test("resolveEntitlementSync denied user has fallbackEligible and substituteEligible set", () => {
    const user = makeUser({ tier: "free" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.fallbackEligible).toBe(true);
    expect(decision.substituteEligible).toBe(true);
    expect(decision.accessDecisionReason).toBe("requires_rpn");
  });

  test("denied user for any_premium has fallbackEligible", () => {
    const user = makeUser({ tier: "free" });
    const decision = resolveEntitlementSync(user, "any_premium");
    expect(decision.hasAccess).toBe(false);
    expect(decision.fallbackEligible).toBe(true);
  });

  test("admin denied features have fallbackEligible false", () => {
    const user = makeUser({ tier: "rpn" });
    const decision = resolveEntitlementSync(user, "feature", "admin_dashboard");
    expect(decision.hasAccess).toBe(false);
    expect(decision.fallbackEligible).toBe(false);
  });

});

describe("Entitlement Resolver - All Access Sources", () => {
  test("admin user has admin_override source", () => {
    const user = makeUser({ tier: "admin" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.accessSource).toBe("admin_override");
  });

  test("tester user has tester source", () => {
    const user = makeUser({ tier: "free", tester_access: true });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.accessSource).toBe("tester");
    expect(decision.accessDecisionReason).toBe("tester_bypass");
  });

  test("trial user has trial source", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", trial_active: true, trial_end: future });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.accessSource).toBe("trial");
    expect(decision.accessDecisionReason).toBe("trial_access");
    expect(decision.expiresAt).toBeTruthy();
  });

  test("lifetime user has one_time_purchase source", () => {
    const user = makeUser({ tier: "free", is_lifetime: true });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.accessSource).toBe("one_time_purchase");
    expect(decision.accessDecisionReason).toBe("lifetime_purchase");
  });

  test("bundle user has bundle source", () => {
    const user = makeUser({ tier: "free", bundle_id: "bundle_123" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.accessSource).toBe("bundle");
    expect(decision.accessDecisionReason).toBe("active_bundle");
  });

  test("promo user has promo source", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", promo_active: true, promo_expires_at: future });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.accessSource).toBe("promo");
    expect(decision.accessDecisionReason).toBe("active_promo");
  });

  test("referral user has referral source", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", referral_premium_active: true, referral_premium_expires_at: future });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.accessSource).toBe("referral");
    expect(decision.accessDecisionReason).toBe("referral_bonus");
  });

  test("legacy user has legacy source", () => {
    const user = makeUser({ tier: "free", legacy_access: true });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.accessSource).toBe("legacy");
    expect(decision.accessDecisionReason).toBe("legacy_grandfathered");
  });

  test("subscription user has subscription source", () => {
    const user = makeUser({ tier: "rpn", stripe_subscription_id: "sub_abc" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.accessSource).toBe("subscription");
    expect(decision.planId).toBe("sub_abc");
  });

  test("free user has free source for free features", () => {
    const user = makeUser({ tier: "free" });
    const decision = resolveEntitlementSync(user, "feature", "lessons_free");
    expect(decision.accessSource).toBe("free");
    expect(decision.accessDecisionReason).toBe("free_feature");
  });

  test("null user returns not_authenticated", () => {
    const decision = resolveEntitlementSync(null, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("not_authenticated");
  });
});

describe("Entitlement Resolver - Edge Cases", () => {
  test("expired trial with active bundle still grants access via bundle", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({
      tier: "free",
      trial_active: true,
      trial_end: past,
      bundle_id: "bundle_123",
    });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("bundle");
  });

  test("expired tester with active promo still grants access via promo", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({
      tier: "free",
      tester_access: true,
      tester_expiry: past,
      promo_active: true,
      promo_expires_at: future,
    });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("promo");
  });

  test("all expired alternate sources denied on free tier", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({
      tier: "free",
      tester_access: true,
      tester_expiry: past,
      trial_active: true,
      trial_end: past,
      promo_active: true,
      promo_expires_at: past,
      referral_premium_active: true,
      referral_premium_expires_at: past,
      bundle_id: "bundle_123",
      bundle_expires_at: past,
    });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });

  test("unknown feature defaults to free and is accessible", () => {
    const user = makeUser({ tier: "free" });
    const decision = resolveEntitlementSync(user, "feature", "unknown_feature_xyz");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessDecisionReason).toBe("free_feature");
  });

  test("new_grad_toolkit user can access toolkit features but not cert features", () => {
    const user = makeUser({ tier: "new_grad_toolkit" });
    const d1 = resolveEntitlementSync(user, "feature", "newgrad_brain_sheets");
    expect(d1.hasAccess).toBe(true);
    const d2 = resolveEntitlementSync(user, "feature", "newgrad_cert_prep");
    expect(d2.hasAccess).toBe(false);
  });

  test("certification_prep user accesses both toolkit and cert features", () => {
    const user = makeUser({ tier: "certification_prep" });
    const d1 = resolveEntitlementSync(user, "feature", "newgrad_brain_sheets");
    expect(d1.hasAccess).toBe(true);
    const d2 = resolveEntitlementSync(user, "feature", "newgrad_cert_prep");
    expect(d2.hasAccess).toBe(true);
  });

  test("full_access user accesses everything except admin", () => {
    const user = makeUser({ tier: "full_access" });
    const d1 = resolveEntitlementSync(user, "feature", "newgrad_brain_sheets");
    expect(d1.hasAccess).toBe(true);
    const d2 = resolveEntitlementSync(user, "feature", "newgrad_cert_prep");
    expect(d2.hasAccess).toBe(true);
    const d3 = resolveEntitlementSync(user, "feature", "admin_dashboard");
    expect(d3.hasAccess).toBe(false);
  });

  test("decision object includes all required fields", () => {
    const user = makeUser({ tier: "rpn", region: "CA" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision).toHaveProperty("hasAccess");
    expect(decision).toHaveProperty("accessSource");
    expect(decision).toHaveProperty("planId");
    expect(decision).toHaveProperty("productType");
    expect(decision).toHaveProperty("productId");
    expect(decision).toHaveProperty("region");
    expect(decision).toHaveProperty("locale");
    expect(decision).toHaveProperty("fallbackEligible");
    expect(decision).toHaveProperty("backupModesAvailable");
    expect(decision).toHaveProperty("lastVerifiedContentVersion");
    expect(decision).toHaveProperty("substituteEligible");
    expect(decision).toHaveProperty("expiresAt");
    expect(decision).toHaveProperty("accessDecisionReason");
    expect(decision).toHaveProperty("provisional");
    expect(decision.region).toBe("CA");
    expect(decision.locale).toBe("CA");
  });
});

describe("Backup Mode Selection - Exam Validation", () => {
  test("valid exam passes validation", () => {
    const exam = {
      templateId: "exam-1",
      title: "Test Exam",
      questions: [
        { id: "q1", stem: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], correct_answer: 0 },
        { id: "q2", stem: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct_answer: 1 },
      ],
    };
    const result = validateExamForPublish(exam);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  test("exam with no questions fails validation", () => {
    const exam = { templateId: "exam-1", title: "Empty Exam", questions: [] };
    const result = validateExamForPublish(exam);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === "questions")).toBe(true);
  });

  test("exam without title fails validation", () => {
    const exam = {
      templateId: "exam-1",
      title: "",
      questions: [
        { id: "q1", stem: "What is the capital of France?", options: ["Paris", "London"], correct_answer: 0 },
      ],
    };
    const result = validateExamForPublish(exam);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === "title")).toBe(true);
  });

  test("exam with missing question stem fails validation", () => {
    const exam = {
      templateId: "exam-1",
      title: "Test Exam",
      questions: [
        { id: "q1", stem: "", options: ["A", "B"], correct_answer: 0 },
      ],
    };
    const result = validateExamForPublish(exam);
    expect(result.valid).toBe(false);
  });

  test("exam with broken media in question stem is flagged", () => {
    const exam = {
      templateId: "exam-1",
      title: "Test Exam",
      questions: [
        { id: "q1", stem: 'Look at this image: ![]()', options: ["A", "B"], correct_answer: 0 },
      ],
    };
    const result = validateExamForPublish(exam);
    expect(result.valid).toBe(false);
  });

  test("exam with missing correct answer fails validation", () => {
    const exam = {
      templateId: "exam-1",
      title: "Test Exam",
      questions: [
        { id: "q1", stem: "What is the capital of France?", options: ["Paris", "London"], correct_answer: null },
      ],
    };
    const result = validateExamForPublish(exam);
    expect(result.valid).toBe(false);
  });

  test("exam with invalid time limit fails validation", () => {
    const exam = {
      templateId: "exam-1",
      title: "Test Exam",
      questions: [
        { id: "q1", stem: "What is the capital of France?", options: ["Paris", "London"], correct_answer: 0 },
      ],
      timeLimitMinutes: 700,
    };
    const result = validateExamForPublish(exam);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === "timeLimitMinutes")).toBe(true);
  });

  test("exam warnings for fewer than 10 questions", () => {
    const exam = {
      templateId: "exam-1",
      title: "Test Exam",
      questions: [
        { id: "q1", stem: "What is the capital of France?", options: ["Paris", "London"], correct_answer: 0 },
      ],
    };
    const result = validateExamForPublish(exam);
    expect(result.warnings.some(w => w.message.includes("recommend at least 10"))).toBe(true);
  });
});

describe("Exam Question Normalization (Failover Logic)", () => {
  test("normalizes valid questions", () => {
    const questions = Array.from({ length: 6 }, (_, i) => ({
      id: `q${i + 1}`,
      stem: `Valid exam question number ${i + 1}?`,
      options: ["Option A", "Option B", "Option C"],
      correct_answer: 0,
    }));
    const result = normalizeExamQuestions(questions);
    expect(result.validQuestionCount).toBe(6);
    expect(result.removedCount).toBe(0);
    expect(result.fallbackMode).toBe(false);
  });

  test("removes questions with missing stems", () => {
    const questions = [
      { id: "q1", stem: "", options: ["A", "B"], correct_answer: 0 },
      { id: "q2", stem: "Valid question stem here", options: ["A", "B"], correct_answer: 0 },
    ];
    const result = normalizeExamQuestions(questions);
    expect(result.validQuestionCount).toBe(1);
    expect(result.removedCount).toBe(1);
  });

  test("coerces 'question' field to 'stem'", () => {
    const questions = [
      { id: "q1", question: "What is this long question?", options: ["A", "B"], correct_answer: 0 },
    ];
    const result = normalizeExamQuestions(questions);
    expect(result.validQuestionCount).toBe(1);
    expect(result.normalizationLog.some(l => l.includes("Coerced"))).toBe(true);
  });

  test("parses JSON string options", () => {
    const questions = [
      { id: "q1", stem: "What is this question?", options: '["A", "B", "C"]', correct_answer: 0 },
    ];
    const result = normalizeExamQuestions(questions);
    expect(result.validQuestionCount).toBe(1);
  });

  test("removes questions with unparseable options", () => {
    const questions = [
      { id: "q1", stem: "What is this question?", options: "not json at all", correct_answer: 0 },
    ];
    const result = normalizeExamQuestions(questions);
    expect(result.validQuestionCount).toBe(0);
    expect(result.removedCount).toBe(1);
  });

  test("coerces letter answer to index", () => {
    const questions = [
      { id: "q1", stem: "What is this question?", options: ["A", "B", "C"], correct_answer: "B" },
    ];
    const result = normalizeExamQuestions(questions);
    expect(result.validQuestionCount).toBe(1);
    expect(result.normalizationLog.some(l => l.includes("letter answer"))).toBe(true);
  });

  test("removes question with unresolvable correct_answer", () => {
    const questions = [
      { id: "q1", stem: "What is this question?", options: ["A", "B", "C"], correct_answer: "INVALID_VALUE" },
    ];
    const result = normalizeExamQuestions(questions);
    expect(result.validQuestionCount).toBe(0);
    expect(result.removedCount).toBe(1);
  });
});

describe("Circuit Breaker (Exam Resilience)", () => {
  beforeEach(() => {
    resetCircuit("test-exam-1");
    resetCircuit("test-exam-2");
  });

  test("circuit starts closed", () => {
    const status = getCircuitStatus("test-exam-1");
    expect(status.state).toBe("closed");
    expect(status.recentFailures).toBe(0);
  });

  test("single failure does not open circuit", () => {
    recordExamFailure("test-exam-1", "render_error");
    expect(isCircuitOpen("test-exam-1")).toBe(false);
    const status = getCircuitStatus("test-exam-1");
    expect(status.recentFailures).toBe(1);
  });

  test("3 failures opens circuit", () => {
    recordExamFailure("test-exam-1", "render_error");
    recordExamFailure("test-exam-1", "timeout");
    recordExamFailure("test-exam-1", "data_error");
    expect(isCircuitOpen("test-exam-1")).toBe(true);
  });

  test("success on half-open closes circuit", () => {
    recordExamFailure("test-exam-2", "err1");
    recordExamFailure("test-exam-2", "err2");
    recordExamFailure("test-exam-2", "err3");
    resetCircuit("test-exam-2");
    recordExamSuccess("test-exam-2");
    const status = getCircuitStatus("test-exam-2");
    expect(status.state).toBe("closed");
  });

  test("circuit for one exam does not affect another", () => {
    recordExamFailure("test-exam-1", "err1");
    recordExamFailure("test-exam-1", "err2");
    recordExamFailure("test-exam-1", "err3");
    expect(isCircuitOpen("test-exam-1")).toBe(true);
    expect(isCircuitOpen("test-exam-2")).toBe(false);
  });
});

describe("Backend Content Validation", () => {
  test("valid exam question passes", () => {
    const q = { stem: "What is the correct answer?", options: ["A", "B", "C"], correct_answer: 0 };
    const result = validateExamQuestion(q);
    expect(result.valid).toBe(true);
    expect(result.issues.length).toBe(0);
  });

  test("question with missing stem fails", () => {
    const q = { stem: "", options: ["A", "B"], correct_answer: 0 };
    const result = validateExamQuestion(q);
    expect(result.valid).toBe(false);
    expect(result.issues).toContain("missing_or_short_stem");
  });

  test("question with insufficient options fails", () => {
    const q = { stem: "What is this?", options: ["A"], correct_answer: 0 };
    const result = validateExamQuestion(q);
    expect(result.valid).toBe(false);
    expect(result.issues).toContain("insufficient_options");
  });

  test("question with missing correct answer fails", () => {
    const q = { stem: "What is this?", options: ["A", "B"], correct_answer: null };
    const result = validateExamQuestion(q);
    expect(result.valid).toBe(false);
    expect(result.issues).toContain("missing_correct_answer");
  });

  test("question with JSON string options is parsed", () => {
    const q = { stem: "What is this?", options: '["A", "B", "C"]', correct_answer: 0 };
    const result = validateExamQuestion(q);
    expect(result.valid).toBe(true);
  });

  test("valid flashcard passes", () => {
    const card = { front: "What is RN?", back: "Registered Nurse" };
    const result = validateFlashcard(card);
    expect(result.valid).toBe(true);
  });

  test("flashcard with missing front fails", () => {
    const card = { back: "Answer" };
    const result = validateFlashcard(card);
    expect(result.valid).toBe(false);
    expect(result.issues).toContain("missing_front");
  });

  test("flashcard with missing back fails", () => {
    const card = { front: "Question" };
    const result = validateFlashcard(card);
    expect(result.valid).toBe(false);
    expect(result.issues).toContain("missing_back");
  });

  test("flashcard with question/answer fields passes", () => {
    const card = { question: "What is?", answer: "This" };
    const result = validateFlashcard(card);
    expect(result.valid).toBe(true);
  });

  test("lesson with title and slug passes", () => {
    const lesson = { title: "Test Lesson", slug: "test-lesson" };
    const result = validateLessonContent(lesson);
    expect(result.valid).toBe(true);
  });

  test("lesson missing title fails", () => {
    const lesson = { slug: "test-lesson" };
    const result = validateLessonContent(lesson);
    expect(result.valid).toBe(false);
    expect(result.issues).toContain("missing_title");
  });

  test("lesson missing slug fails", () => {
    const lesson = { title: "Test" };
    const result = validateLessonContent(lesson);
    expect(result.valid).toBe(false);
    expect(result.issues).toContain("missing_slug");
  });
});

describe("filterValidItems (Batch validation)", () => {
  test("filters out invalid exam questions", () => {
    const items = [
      { stem: "Valid question for test", options: ["A", "B"], correct_answer: 0 },
      { stem: "", options: ["A", "B"], correct_answer: 0 },
      { stem: "Another valid question", options: ["X", "Y"], correct_answer: 1 },
    ];
    const { validItems, skippedCount, skippedDetails } = filterValidItems(items, validateExamQuestion);
    expect(validItems.length).toBe(2);
    expect(skippedCount).toBe(1);
    expect(skippedDetails[0].index).toBe(1);
  });

  test("filters out invalid flashcards", () => {
    const items = [
      { front: "Q1", back: "A1" },
      { front: "Q2" },
      { question: "Q3", answer: "A3" },
    ];
    const { validItems, skippedCount } = filterValidItems(items, validateFlashcard);
    expect(validItems.length).toBe(2);
    expect(skippedCount).toBe(1);
  });

  test("returns all items when all valid", () => {
    const items = [
      { stem: "Question one testing", options: ["A", "B"], correct_answer: 0 },
      { stem: "Question two testing", options: ["X", "Y"], correct_answer: 1 },
    ];
    const { validItems, skippedCount } = filterValidItems(items, validateExamQuestion);
    expect(validItems.length).toBe(2);
    expect(skippedCount).toBe(0);
  });

  test("returns empty when all invalid", () => {
    const items = [
      { stem: "", options: [], correct_answer: null },
      { stem: "" },
    ];
    const { validItems, skippedCount } = filterValidItems(items, validateExamQuestion);
    expect(validItems.length).toBe(0);
    expect(skippedCount).toBe(2);
  });
});

describe("CAT Engine - Ability Estimate", () => {
  test("computes ability estimate for correct responses", () => {
    const responses = Array.from({ length: 60 }, (_, i) => ({
      questionId: `q-${i}`,
      difficulty: 3,
      correct: true,
      timeSpent: 30,
    }));
    const estimate = computeAbilityEstimate(responses);
    expect(estimate.ability).toBeGreaterThan(0);
    expect(estimate.questionCount).toBe(60);
  });

  test("detects fast guessing pattern", () => {
    const responses = Array.from({ length: 10 }, (_, i) => ({
      questionId: `q-${i}`,
      difficulty: 3,
      correct: true,
      timeSpent: 2,
    }));
    const estimate = computeAbilityEstimate(responses);
    expect(estimate.antiGamingFlags).toContain("fast_guessing_pattern");
  });

  test("flags below minimum items", () => {
    const responses = Array.from({ length: 10 }, (_, i) => ({
      questionId: `q-${i}`,
      difficulty: 3,
      correct: i % 2 === 0,
      timeSpent: 30,
    }));
    const estimate = computeAbilityEstimate(responses);
    expect(estimate.antiGamingFlags).toContain("below_minimum_items");
  });

  test("computes stability index", () => {
    const responses = Array.from({ length: 60 }, (_, i) => ({
      questionId: `q-${i}`,
      difficulty: 3,
      correct: true,
      timeSpent: 30,
    }));
    const estimate = computeAbilityEstimate(responses);
    expect(estimate.stabilityIndex).toBeGreaterThanOrEqual(0);
    expect(estimate.stabilityIndex).toBeLessThanOrEqual(1);
  });
});

describe("CAT Engine - Item Selection", () => {
  test("selects item closest to ability level", () => {
    const candidates = [
      { id: "q1", difficulty: 1, blueprintCategory: "cat-A", discriminationIndex: 0.5, attemptCount: 0, exposureCount: 0, isCaseSet: false },
      { id: "q2", difficulty: 3, blueprintCategory: "cat-A", discriminationIndex: 0.5, attemptCount: 0, exposureCount: 0, isCaseSet: false },
      { id: "q3", difficulty: 5, blueprintCategory: "cat-A", discriminationIndex: 0.5, attemptCount: 0, exposureCount: 0, isCaseSet: false },
    ];
    const selected = selectNextItem(0, candidates, {}, { "cat-A": 1 }, 0, -20);
    expect(selected).not.toBeNull();
    expect(selected!.difficulty).toBe(3);
  });

  test("returns null with empty candidates", () => {
    const selected = selectNextItem(0, [], {}, {}, 0, -20);
    expect(selected).toBeNull();
  });
});

describe("Difficulty Calibration", () => {
  test("detects deviation when actual accuracy is too high", () => {
    const stats = [{ level: 3, correct: 90, total: 100 }];
    const results = checkDifficultyCalibration(stats);
    expect(results[0].deviation).toBe(true);
    expect(results[0].suggestedAdjustment).toBe("increase_difficulty_weight");
  });

  test("detects deviation when actual accuracy is too low", () => {
    const stats = [{ level: 3, correct: 10, total: 100 }];
    const results = checkDifficultyCalibration(stats);
    expect(results[0].deviation).toBe(true);
    expect(results[0].suggestedAdjustment).toBe("decrease_difficulty_weight");
  });

  test("no deviation when accuracy is within range", () => {
    const stats = [{ level: 3, correct: 57, total: 100 }];
    const results = checkDifficultyCalibration(stats);
    expect(results[0].deviation).toBe(false);
    expect(results[0].suggestedAdjustment).toBe("none");
  });
});

describe("Language Fallback Rules", () => {
  test("locale is populated from user region", () => {
    const user = makeUser({ tier: "rpn", region: "CA" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.locale).toBe("CA");
    expect(decision.region).toBe("CA");
  });

  test("locale is null when user has no region", () => {
    const user = makeUser({ tier: "rpn", region: null });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.locale).toBeNull();
    expect(decision.region).toBeNull();
  });

  test("decision includes backupModesAvailable array", () => {
    const user = makeUser({ tier: "free" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(Array.isArray(decision.backupModesAvailable)).toBe(true);
  });

  test("decision includes lastVerifiedContentVersion", () => {
    const user = makeUser({ tier: "rpn" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision).toHaveProperty("lastVerifiedContentVersion");
  });
});
