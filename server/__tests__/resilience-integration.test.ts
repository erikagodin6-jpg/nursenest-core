import { describe, test, expect, vi, beforeEach } from "vitest";
import { createAccessDeliveryOrchestrator } from "../access-delivery-orchestrator";
import type { Request, Response, NextFunction } from "express";
import {
  validateExamQuestion,
  validateFlashcard,
  validateLessonContent,
  filterValidItems,
} from "../backend-resilience";
import {
  validateExamForPublish,
  normalizeExamQuestions,
  recordExamFailure,
  recordExamSuccess,
  isCircuitOpen,
  resetCircuit,
} from "../exam-resilience-engine";
import { resolveEntitlementSync } from "../entitlements";

function mockReq(overrides: any = {}): Request {
  return {
    originalUrl: "/api/content/test-123/deliver",
    url: "/api/content/test-123/deliver",
    params: { contentId: "test-123" },
    user: { id: "user-1" },
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
  resolveAuthUser: vi.fn().mockResolvedValue({ id: "user-1" }),
}));

describe("Integration: Active subscriber accessing premium page", () => {
  test("subscriber with rpn tier accesses flashcards via primary delivery", async () => {
    const user = { id: "user-1", tier: "rpn", stripe_subscription_id: "sub_test" };
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("subscription");

    const req = mockReq({ authUser: user });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async (_req, r) => {
        r.json({ flashcards: [{ front: "Q", back: "A" }], _deliveryTier: "primary" });
      },
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("primary");
    expect(res._json.flashcards).toBeDefined();
  });
});

describe("Integration: Subscriber routed to safe fallback after render failure", () => {
  test("primary fails, safe fallback delivers content", async () => {
    const req = mockReq();
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Render failed: component crash");
      },
      safeFallback: async (_req, r) => {
        r.json({ data: { questions: [{ stem: "Safe Q1" }] }, _deliveryTier: "safe_fallback" });
      },
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("safe_fallback");
    expect(res._json.data.questions).toBeDefined();
  });
});

describe("Integration: Live version broken → last-known-good served", () => {
  test("primary and safe fallback fail, LKG delivers content", async () => {
    const req = mockReq();
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Live version broken");
      },
      safeFallback: async () => {
        throw new Error("Safe fallback also broken");
      },
      lastKnownGood: async (_req, contentId) => {
        return { id: contentId, title: "Previously verified content", version: 3 };
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("last_known_good");
    expect(res._json.data.title).toBe("Previously verified content");
    expect(res._json.data.version).toBe(3);
  });
});

describe("Integration: Premium download primary fails → backup works", () => {
  test("primary download fails, backup snapshot serves the file", async () => {
    const req = mockReq({ params: { contentId: "download-pdf-123" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Download service unavailable");
      },
      lastKnownGood: async () => null,
      backupSnapshot: async (_req, contentId) => {
        return { id: contentId, fileUrl: "/backups/download-pdf-123.pdf", type: "backup" };
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("backup_snapshot");
    expect(res._json.data.fileUrl).toContain("backup");
  });
});

describe("Integration: CAT engine fails → safe CAT fallback opens", () => {
  test("CAT engine crash falls back to safe mode exam delivery", async () => {
    const req = mockReq({ params: { contentId: "cat-session-1" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("CAT ability estimation crash");
      },
      safeFallback: async (_req, r) => {
        r.json({
          data: { mode: "linear", questions: [{ stem: "Fallback Q1" }] },
          _deliveryTier: "safe_fallback",
        });
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("safe_fallback");
    expect(res._json.data.mode).toBe("linear");
  });
});

describe("Integration: Flashcard UI fails → safe deck list opens", () => {
  test("flashcard render failure falls back to safe flashcard list", async () => {
    const req = mockReq({ params: { contentId: "flashcard-deck-42" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Flashcard interactive view crashed");
      },
      safeFallback: async (_req, r) => {
        r.json({
          data: {
            cards: [
              { front: "What is RN?", back: "Registered Nurse" },
              { front: "What is IV?", back: "Intravenous" },
            ],
            safeMode: true,
          },
          _deliveryTier: "safe_fallback",
        });
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("safe_fallback");
    expect(res._json.data.safeMode).toBe(true);
    expect(res._json.data.cards.length).toBe(2);
  });
});

describe("Integration: Lesson renderer fails → stripped content opens", () => {
  test("lesson rich renderer fails, stripped content served", async () => {
    const req = mockReq({ params: { contentId: "lesson-anatomy-101" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Lesson renderer crashed");
      },
      safeFallback: async (_req, r) => {
        r.json({
          data: {
            title: "Anatomy 101",
            content: [{ type: "paragraph", content: "Stripped plain text content" }],
            strippedMode: true,
          },
          _deliveryTier: "safe_fallback",
        });
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("safe_fallback");
    expect(res._json.data.strippedMode).toBe(true);
    expect(res._json.data.title).toBe("Anatomy 101");
  });
});

describe("Integration: Substitute content when exact product unavailable", () => {
  test("all primary paths fail, substitute content is served", async () => {
    const req = mockReq({ params: { contentId: "question-set-99" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Primary content unavailable");
      },
      lastKnownGood: async () => null,
      backupSnapshot: async () => null,
      substituteEquivalent: async (_req, contentId) => {
        return {
          id: "substitute-42",
          original: contentId,
          title: "Similar Question Set",
          matchScore: 0.85,
        };
      },
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("substitute_equivalent");
    expect(res._json._originalContentId).toBe("question-set-99");
    expect(res._json.data.matchScore).toBe(0.85);
  });
});

describe("Integration: All delivery tiers exhausted", () => {
  test("returns 503 when all fallback tiers fail", async () => {
    const req = mockReq({ params: { contentId: "broken-content" } });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("primary failed");
      },
      safeFallback: async () => {
        throw new Error("safe fallback failed");
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
  });
});

describe("Integration: Quarantine triggered on primary failure", () => {
  test("quarantine hook called when primary delivery fails", async () => {
    const req = mockReq({ params: { contentId: "quarantine-test" } });
    const res = mockRes();
    const quarantineFn = vi.fn().mockResolvedValue(undefined);

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("content is corrupted");
      },
      staticFallback: () => ({ message: "static content" }),
      getContentId: (r) => r.params.contentId,
      quarantineHook: quarantineFn,
    });

    await handler(req, res, mockNext);
    expect(quarantineFn).toHaveBeenCalledWith("quarantine-test", "content is corrupted");
  });
});

describe("Integration: Billing resilience - provisional access", () => {
  test("paid tier user with subscription gets access", () => {
    const user = {
      id: "user-billing-1",
      tier: "rpn",
      stripe_subscription_id: "sub_active",
      stripe_customer_id: "cus_123",
    };
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("subscription");
    expect(decision.provisional).toBe(false);
  });

  test("free user with no subscription is denied premium features", () => {
    const user = { id: "user-billing-2", tier: "free" };
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.fallbackEligible).toBe(true);
    expect(decision.substituteEligible).toBe(true);
  });

  test("tester bypass works as billing-independent access", () => {
    const user = { id: "user-billing-3", tier: "free", tester_access: true, tester_expiry: null };
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("tester");
  });

  test("trial user access is time-bounded", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = { id: "user-billing-4", tier: "free", trial_active: true, trial_end: future };
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.expiresAt).toBeTruthy();
    expect(new Date(decision.expiresAt!).getTime()).toBeGreaterThan(Date.now());
  });

  test("expired trial does not grant access", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = { id: "user-billing-5", tier: "free", trial_active: true, trial_end: past };
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });
});

describe("Integration: Exam normalization + circuit breaker flow", () => {
  beforeEach(() => {
    resetCircuit("integration-exam");
  });

  test("normalized exam with valid questions keeps circuit closed", () => {
    const questions = Array.from({ length: 6 }, (_, i) => ({
      id: `q${i + 1}`,
      stem: `Integration test question number ${i + 1}?`,
      options: ["Paris", "London", "Berlin", "Madrid"],
      correct_answer: 0,
    }));
    const normalized = normalizeExamQuestions(questions, "integration-exam");
    expect(normalized.validQuestionCount).toBe(6);
    expect(normalized.fallbackMode).toBe(false);

    recordExamSuccess("integration-exam");
    expect(isCircuitOpen("integration-exam")).toBe(false);
  });

  test("failed normalization triggers circuit failure recording", () => {
    const questions = [
      { id: "q1", stem: "", options: [] },
      { id: "q2", stem: "", options: [] },
    ];
    const normalized = normalizeExamQuestions(questions, "integration-exam");
    expect(normalized.validQuestionCount).toBe(0);

    recordExamFailure("integration-exam", "all_questions_invalid");
    recordExamFailure("integration-exam", "all_questions_invalid");
    recordExamFailure("integration-exam", "all_questions_invalid");
    expect(isCircuitOpen("integration-exam")).toBe(true);
  });
});

describe("Integration: Content validation pipeline", () => {
  test("mixed exam questions filtered correctly before delivery", () => {
    const questions = [
      { stem: "Valid question number one", options: ["A", "B", "C"], correct_answer: 0 },
      { stem: "", options: [], correct_answer: null },
      { stem: "Valid question number two", options: ["X", "Y", "Z"], correct_answer: 1 },
      { stem: "abc", options: ["A"], correct_answer: 0 },
    ];
    const { validItems, skippedCount } = filterValidItems(questions, validateExamQuestion);
    expect(validItems.length).toBe(2);
    expect(skippedCount).toBe(2);
  });

  test("mixed flashcards filtered correctly before delivery", () => {
    const cards = [
      { front: "Q1", back: "A1" },
      { front: "", back: "" },
      { question: "Q2", answer: "A2" },
      { front: "Q3" },
    ];
    const { validItems, skippedCount } = filterValidItems(cards, validateFlashcard);
    expect(validItems.length).toBe(2);
    expect(skippedCount).toBe(2);
  });

  test("lesson validation catches missing data", () => {
    const lessons = [
      { title: "Lesson 1", slug: "lesson-1" },
      { title: "", slug: "lesson-2" },
      { title: "Lesson 3", slug: "" },
    ];
    const { validItems, skippedCount } = filterValidItems(lessons, validateLessonContent);
    expect(validItems.length).toBe(1);
    expect(skippedCount).toBe(2);
  });
});

describe("Integration: Entitlement + Delivery orchestration", () => {
  test("denied user gets fallback-eligible decision and static fallback", async () => {
    const user = { id: "user-1", tier: "free" };
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.fallbackEligible).toBe(true);

    const req = mockReq({ authUser: user });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async () => {
        throw new Error("Access denied by entitlement");
      },
      staticFallback: () => ({
        message: "Please upgrade to access this content",
        upgradeUrl: "/pricing",
      }),
      getContentId: (r) => r.params.contentId,
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("static_fallback");
    expect(res._json.data.upgradeUrl).toBe("/pricing");
  });

  test("admin user accesses primary content successfully", async () => {
    const user = { id: "admin-1", tier: "admin" };
    const decision = resolveEntitlementSync(user, "feature", "admin_dashboard");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("admin_override");

    const req = mockReq({ authUser: user });
    const res = mockRes();

    const handler = createAccessDeliveryOrchestrator({
      primaryHandler: async (_req, r) => {
        r.json({ dashboard: true, _deliveryTier: "primary" });
      },
    });

    await handler(req, res, mockNext);
    expect(res._json._deliveryTier).toBe("primary");
    expect(res._json.dashboard).toBe(true);
  });
});
