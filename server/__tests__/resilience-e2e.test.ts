import { describe, test, expect, vi, beforeEach } from "vitest";
import { createAccessDeliveryOrchestrator } from "../access-delivery-orchestrator";
import {
  resolveEntitlementSync,
  checkEntitlement,
  getUserEntitlements,
} from "../entitlements";
import {
  normalizeExamQuestions,
  recordExamFailure,
  isCircuitOpen,
  resetCircuit,
} from "../exam-resilience-engine";
import {
  validateExamQuestion,
  validateFlashcard,
  filterValidItems,
} from "../backend-resilience";
import type { Request, Response, NextFunction } from "express";

function mockReq(overrides: any = {}): Request {
  return {
    originalUrl: "/api/content/deliver",
    url: "/api/content/deliver",
    params: {},
    user: null,
    ...overrides,
  } as any;
}

function mockRes(): Response & { _json: any; _status: number; _headersSent: boolean } {
  const res: any = {
    _json: null,
    _status: 200,
    _headersSent: false,
    headersSent: false,
    json(data: any) {
      res._json = data;
      res._headersSent = true;
      res.headersSent = true;
      return res;
    },
    status(code: number) {
      res._status = code;
      return res;
    },
  };
  return res;
}

const mockNext: NextFunction = vi.fn();

vi.mock("../storage", () => ({
  pool: {
    query: vi.fn().mockResolvedValue({ rows: [] }),
  },
}));

vi.mock("../admin-auth", () => ({
  resolveAuthUser: vi.fn().mockResolvedValue(null),
}));

describe("E2E: Full paid user journey across subscription products", () => {
  test("paid user logs in → checks entitlements → accesses premium content → content loads", async () => {
    const user = {
      id: "paid-user-1",
      tier: "rpn",
      stripe_subscription_id: "sub_live_123",
      region: "CA",
    };

    const entitlements = getUserEntitlements(user);
    expect(entitlements.flashcards.allowed).toBe(true);
    expect(entitlements.qbank.allowed).toBe(true);
    expect(entitlements.mock_exams.allowed).toBe(true);
    expect(entitlements.adaptive_engine.allowed).toBe(true);
    expect(entitlements.admin_dashboard.allowed).toBe(false);

    const flashcardDecision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(flashcardDecision.hasAccess).toBe(true);
    expect(flashcardDecision.accessSource).toBe("subscription");
    expect(flashcardDecision.planId).toBe("sub_live_123");
    expect(flashcardDecision.region).toBe("CA");

    const req = mockReq({ params: { contentId: "flashcard-deck-premium" }, authUser: user });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async (_req, r) => {
        r.json({
          flashcards: [
            { front: "What is RN?", back: "Registered Nurse" },
            { front: "What is IV?", back: "Intravenous" },
          ],
          _deliveryTier: "primary",
        });
      },
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("primary");
    expect(res._json.flashcards.length).toBe(2);
  });

  test("paid user accesses qbank exam with validated questions", () => {
    const user = { id: "paid-user-2", tier: "rn", stripe_subscription_id: "sub_rn_456" };
    expect(checkEntitlement(user, "qbank")).toBe(true);

    const questions = [
      { id: "q1", stem: "A patient presents with chest pain. What is the priority assessment?", options: ["ABC", "Pain level", "History", "Vitals"], correct_answer: 0 },
      { id: "q2", stem: "Which lab value indicates renal function impairment?", options: ["BUN", "Hemoglobin", "Platelet count", "WBC"], correct_answer: 0 },
      { id: "q3", stem: "What is the normal adult heart rate?", options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-160 bpm"], correct_answer: 1 },
      { id: "q4", stem: "What is the most common cause of cardiac arrest?", options: ["VFib", "Asystole", "PEA", "SVT"], correct_answer: 0 },
      { id: "q5", stem: "Which electrolyte imbalance causes peaked T waves?", options: ["Hyperkalemia", "Hypokalemia", "Hypernatremia", "Hyponatremia"], correct_answer: 0 },
      { id: "q6", stem: "What assessment finding indicates left-sided heart failure?", options: ["Crackles", "JVD", "Hepatomegaly", "Peripheral edema"], correct_answer: 0 },
    ];

    const normalized = normalizeExamQuestions(questions, "qbank-exam-1");
    expect(normalized.validQuestionCount).toBe(6);
    expect(normalized.removedCount).toBe(0);
    expect(normalized.fallbackMode).toBe(false);
  });

  test("paid user accesses mock exam → validates → delivers", async () => {
    const user = { id: "paid-user-3", tier: "rpn" };
    expect(checkEntitlement(user, "mock_exams")).toBe(true);

    const questions = [
      { id: "q1", stem: "Select the best nursing intervention for a patient with dyspnea", options: ["Elevate HOB", "Apply ice", "Administer analgesic", "Restrict fluids"], correct_answer: 0 },
      { id: "q2", stem: "", options: ["A", "B"], correct_answer: 0 },
    ];
    const { validItems } = filterValidItems(questions, validateExamQuestion);
    expect(validItems.length).toBe(1);

    const req = mockReq({ params: { contentId: "mock-exam-001" }, authUser: user });
    const res = mockRes();
    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async (_req, r) => {
        r.json({ questions: validItems, _deliveryTier: "primary" });
      },
    });
    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("primary");
    expect(res._json.questions.length).toBe(1);
  });
});

describe("E2E: Free user journey with entitled preview content", () => {
  test("free user can access free features but not premium", () => {
    const user = {
      id: "free-user-1",
      tier: "free",
      region: "US",
    };

    const entitlements = getUserEntitlements(user);
    expect(entitlements.lessons_free.allowed).toBe(true);
    expect(entitlements.lessons_free.reason).toBe("free_feature");
    expect(entitlements.anatomy_labeling.allowed).toBe(true);
    expect(entitlements.concept_checks.allowed).toBe(true);

    expect(entitlements.flashcards.allowed).toBe(false);
    expect(entitlements.qbank.allowed).toBe(false);
    expect(entitlements.mock_exams.allowed).toBe(false);
    expect(entitlements.adaptive_engine.allowed).toBe(false);
  });

  test("free user gets upgrade prompt with fallbackEligible flag", () => {
    const user = { id: "free-user-2", tier: "free" };
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.fallbackEligible).toBe(true);
    expect(decision.substituteEligible).toBe(true);
    expect(decision.accessDecisionReason).toBe("requires_rpn");
  });

  test("free user accesses free content via primary delivery", async () => {
    const user = { id: "free-user-3", tier: "free" };
    const decision = resolveEntitlementSync(user, "feature", "lessons_free");
    expect(decision.hasAccess).toBe(true);

    const req = mockReq({ params: { contentId: "free-lesson-1" }, authUser: user });
    const res = mockRes();
    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async (_req, r) => {
        r.json({ lesson: { title: "Free Anatomy Basics" }, _deliveryTier: "primary" });
      },
    });
    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("primary");
    expect(res._json.lesson.title).toBe("Free Anatomy Basics");
  });

  test("unauthenticated user is denied all access", () => {
    const decision = resolveEntitlementSync(null, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("not_authenticated");

    const freeDecision = resolveEntitlementSync(null, "feature", "lessons_free");
    expect(freeDecision.hasAccess).toBe(false);
    expect(freeDecision.accessDecisionReason).toBe("not_authenticated");
  });
});

describe("E2E: Protected recovery messaging visible instead of dead end", () => {
  test("content failure returns recovery-capable 503 with exhausted tier", async () => {
    const req = mockReq({ params: { contentId: "broken-content" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Database connection lost");
      },
      safeFallback: async () => {
        throw new Error("Safe fallback also unavailable");
      },
      lastKnownGood: async () => null,
      backupSnapshot: async () => null,
      substituteEquivalent: async () => null,
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._status).toBe(503);
    expect(res._json._deliveryTier).toBe("exhausted");
    expect(res._json._attemptsExhausted).toBe(true);
    expect(res._json).toHaveProperty("error");
  });

  test("static fallback provides recovery messaging when other tiers fail", async () => {
    const req = mockReq({ params: { contentId: "problematic-exam" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Exam render crash");
      },
      safeFallback: async () => {
        throw new Error("Safe mode unavailable");
      },
      lastKnownGood: async () => null,
      backupSnapshot: async () => null,
      substituteEquivalent: async () => null,
      staticFallback: () => ({
        message: "This exam is temporarily unavailable. Please try again shortly.",
        recoveryOptions: [
          { label: "Return to Dashboard", path: "/dashboard" },
          { label: "Try Another Exam", path: "/mock-exams" },
          { label: "Contact Support", path: "/contact" },
        ],
      }),
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("static_fallback");
    expect(res._json.data.recoveryOptions).toBeDefined();
    expect(res._json.data.recoveryOptions.length).toBe(3);
    expect(res._json.data.message).toContain("temporarily unavailable");
  });

  test("circuit breaker prevents repeated failures from overwhelming system", () => {
    resetCircuit("e2e-broken-exam");
    recordExamFailure("e2e-broken-exam", "render_crash");
    recordExamFailure("e2e-broken-exam", "render_crash");
    recordExamFailure("e2e-broken-exam", "render_crash");
    expect(isCircuitOpen("e2e-broken-exam")).toBe(true);
  });
});

describe("E2E: Restore progress after crash where possible", () => {
  test("last-known-good restores previous content after primary crash", async () => {
    const req = mockReq({ params: { contentId: "exam-session-123" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Application crashed");
      },
      lastKnownGood: async (_req, contentId) => {
        return {
          id: contentId,
          title: "Restored Exam Session",
          currentQuestion: 15,
          totalQuestions: 50,
          answers: { 1: "A", 2: "B", 3: "C" },
          resumable: true,
        };
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("last_known_good");
    expect(res._json.data.resumable).toBe(true);
    expect(res._json.data.currentQuestion).toBe(15);
    expect(res._json.data.answers).toBeDefined();
  });

  test("backup snapshot provides partial restoration", async () => {
    const req = mockReq({ params: { contentId: "study-session-456" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Session service down");
      },
      lastKnownGood: async () => null,
      backupSnapshot: async (_req, contentId) => {
        return {
          id: contentId,
          flashcardsStudied: 25,
          totalCards: 100,
          lastStudiedAt: new Date().toISOString(),
          partialRestore: true,
        };
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("backup_snapshot");
    expect(res._json.data.partialRestore).toBe(true);
    expect(res._json.data.flashcardsStudied).toBe(25);
  });
});

describe("E2E: Multi-product access journey", () => {
  test("RN user can access RN, RPN, and free features but not NP", () => {
    const user = { id: "rn-user", tier: "rn", stripe_subscription_id: "sub_rn" };
    expect(checkEntitlement(user, "lessons_free")).toBe(true);
    expect(checkEntitlement(user, "lessons_rpn")).toBe(true);
    expect(checkEntitlement(user, "lessons_rn")).toBe(true);
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "qbank")).toBe(true);
    expect(checkEntitlement(user, "lessons_np")).toBe(false);
    expect(checkEntitlement(user, "admin_dashboard")).toBe(false);
  });

  test("NP user can access all clinical tiers", () => {
    const user = { id: "np-user", tier: "np" };
    expect(checkEntitlement(user, "lessons_rpn")).toBe(true);
    expect(checkEntitlement(user, "lessons_rn")).toBe(true);
    expect(checkEntitlement(user, "lessons_np")).toBe(true);
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "admin_dashboard")).toBe(false);
  });

  test("admin has unrestricted access", () => {
    const user = { id: "admin-user", tier: "admin" };
    const entitlements = getUserEntitlements(user);
    const premiumFeatures = ["flashcards", "qbank", "mock_exams", "adaptive_engine", "study_plan"];
    for (const feature of premiumFeatures) {
      expect(entitlements[feature as keyof typeof entitlements].allowed).toBe(true);
    }
    expect(entitlements.admin_dashboard.allowed).toBe(true);
    expect(entitlements.content_editor.allowed).toBe(true);
  });
});

describe("E2E: Entitlement-to-delivery pipeline", () => {
  test("entitled user gets primary content, no fallback needed", async () => {
    const user = { id: "entitled-user", tier: "rpn" };
    const decision = resolveEntitlementSync(user, "feature", "qbank");
    expect(decision.hasAccess).toBe(true);

    const req = mockReq({ params: { contentId: "qbank-set-1" }, authUser: user });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async (_req, r) => {
        r.json({
          questions: [
            { stem: "Nursing question 1", options: ["A", "B", "C", "D"], correct: 0 },
          ],
          _deliveryTier: "primary",
        });
      },
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("primary");
  });

  test("full cascade: primary → safe → LKG → backup → substitute → static", async () => {
    const req = mockReq({ params: { contentId: "cascade-test" } });
    const res = mockRes();

    const callOrder: string[] = [];

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        callOrder.push("primary");
        throw new Error("primary fail");
      },
      safeFallback: async () => {
        callOrder.push("safe");
        throw new Error("safe fail");
      },
      lastKnownGood: async () => {
        callOrder.push("lkg");
        return null;
      },
      backupSnapshot: async () => {
        callOrder.push("backup");
        return null;
      },
      substituteEquivalent: async () => {
        callOrder.push("substitute");
        return null;
      },
      staticFallback: () => {
        callOrder.push("static");
        return { message: "All options exhausted" };
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(callOrder).toEqual(["primary", "safe", "lkg", "backup", "substitute", "static"]);
    expect(res._json._deliveryTier).toBe("static_fallback");
  });
});

describe("E2E: Access source priority chain", () => {
  test("tester > subscription > trial > lifetime > bundle > promo > referral > legacy", () => {
    const future = new Date(Date.now() + 86400000).toISOString();

    const d1 = resolveEntitlementSync(
      { tier: "rpn", tester_access: true, stripe_subscription_id: "sub_1" },
      "feature",
      "flashcards"
    );
    expect(d1.accessSource).toBe("tester");

    const d2 = resolveEntitlementSync(
      { tier: "free", trial_active: true, trial_end: future, bundle_id: "b1" },
      "feature",
      "flashcards"
    );
    expect(d2.accessSource).toBe("trial");

    const d3 = resolveEntitlementSync(
      { tier: "free", is_lifetime: true, promo_active: true, promo_expires_at: future },
      "feature",
      "flashcards"
    );
    expect(d3.accessSource).toBe("one_time_purchase");

    const d4 = resolveEntitlementSync(
      { tier: "free", bundle_id: "b1", promo_active: true, promo_expires_at: future },
      "feature",
      "flashcards"
    );
    expect(d4.accessSource).toBe("bundle");

    const d5 = resolveEntitlementSync(
      { tier: "free", promo_active: true, promo_expires_at: future, referral_premium_active: true, referral_premium_expires_at: future },
      "feature",
      "flashcards"
    );
    expect(d5.accessSource).toBe("promo");

    const d6 = resolveEntitlementSync(
      { tier: "free", referral_premium_active: true, referral_premium_expires_at: future, legacy_access: true },
      "feature",
      "flashcards"
    );
    expect(d6.accessSource).toBe("referral");
  });
});
