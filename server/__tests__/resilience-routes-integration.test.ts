import { describe, test, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { createAccessDeliveryOrchestrator, wrapWithOrchestrator } from "../access-delivery-orchestrator";
import {
  requireEntitlement,
  requireAuthenticated,
  requireAnyPremium,
} from "../entitlements";

const mockResolveAuthUser = vi.fn();
const mockPoolQuery = vi.fn().mockResolvedValue({ rows: [] });

vi.mock("../storage", () => ({
  pool: {
    query: (...args: any[]) => mockPoolQuery(...args),
  },
}));

vi.mock("../admin-auth", () => ({
  resolveAuthUser: (...args: any[]) => mockResolveAuthUser(...args),
}));

vi.mock("../platform-resilience", () => ({
  hasProvisionalAccess: vi.fn().mockReturnValue(false),
  isEmergencyMode: vi.fn().mockReturnValue(false),
  grantProvisionalAccess: vi.fn(),
}));

vi.mock("../backend-resilience", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../backend-resilience")>();
  return {
    ...actual,
    checkAndGrantProvisionalAccess: vi.fn().mockResolvedValue({ granted: false }),
  };
});

function makeUserRow(overrides: Record<string, any> = {}) {
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
    stripe_customer_id: null,
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

function createTestApp() {
  const app = express();
  app.use(express.json());
  return app;
}

function setupPoolForUser(user: any) {
  mockPoolQuery.mockImplementation((sql: string, params?: any[]) => {
    if (typeof sql === "string" && sql.includes("SELECT * FROM users WHERE id")) {
      return Promise.resolve({ rows: user ? [user] : [] });
    }
    return Promise.resolve({ rows: [] });
  });
}

describe("Route Integration: requireAuthenticated middleware via HTTP", () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    mockResolveAuthUser.mockReset();
    mockPoolQuery.mockReset().mockResolvedValue({ rows: [] });
  });

  test("GET /api/protected returns 401 for unauthenticated user", async () => {
    mockResolveAuthUser.mockResolvedValue(null);
    app.get("/api/protected", requireAuthenticated(), (_req, res) => {
      res.json({ data: "secret" });
    });

    const res = await request(app).get("/api/protected");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authentication required");
  });

  test("GET /api/protected returns 200 for authenticated user", async () => {
    mockResolveAuthUser.mockResolvedValue({ id: "user-1", tier: "rpn" });
    app.get("/api/protected", requireAuthenticated(), (req: any, res) => {
      res.json({ data: "secret", userId: req.authUser.id });
    });

    const res = await request(app).get("/api/protected");
    expect(res.status).toBe(200);
    expect(res.body.data).toBe("secret");
    expect(res.body.userId).toBe("user-1");
  });
});

describe("Route Integration: requireEntitlement middleware via HTTP", () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    mockResolveAuthUser.mockReset();
    mockPoolQuery.mockReset().mockResolvedValue({ rows: [] });
  });

  test("returns 401 when user is not authenticated", async () => {
    mockResolveAuthUser.mockResolvedValue(null);
    app.get("/api/flashcards", requireEntitlement("flashcards"), (_req, res) => {
      res.json({ cards: [] });
    });

    const res = await request(app).get("/api/flashcards");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authentication required");
  });

  test("returns 403 when free user accesses premium feature", async () => {
    const user = makeUserRow({ id: "user-free", tier: "free" });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);
    app.get("/api/flashcards", requireEntitlement("flashcards"), (_req, res) => {
      res.json({ cards: [] });
    });

    const res = await request(app).get("/api/flashcards");
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Premium feature - upgrade required");
    expect(res.body.upgradeRequired).toBe(true);
    expect(res.body.feature).toBe("flashcards");
  });

  test("returns 200 when RPN user accesses flashcards through middleware chain", async () => {
    const user = makeUserRow({ id: "user-rpn", tier: "rpn", stripe_subscription_id: "sub_1" });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);
    app.get("/api/flashcards", requireEntitlement("flashcards"), (req: any, res) => {
      res.json({ cards: [{ front: "Q", back: "A" }], entitlement: req.entitlement });
    });

    const res = await request(app).get("/api/flashcards");
    expect(res.status).toBe(200);
    expect(res.body.cards).toHaveLength(1);
    expect(res.body.entitlement.hasAccess).toBe(true);
    expect(res.body.entitlement.accessSource).toBe("subscription");
  });

  test("returns 200 when admin accesses any feature through middleware chain", async () => {
    const user = makeUserRow({ id: "admin-1", tier: "admin" });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);
    app.get("/api/flashcards", requireEntitlement("flashcards"), (req: any, res) => {
      res.json({ cards: [], entitlement: req.entitlement });
    });

    const res = await request(app).get("/api/flashcards");
    expect(res.status).toBe(200);
    expect(res.body.entitlement.accessSource).toBe("admin_override");
  });

  test("returns 200 when tester accesses premium feature through middleware", async () => {
    const user = makeUserRow({ id: "tester-1", tier: "free", tester_access: true });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);
    app.get("/api/flashcards", requireEntitlement("flashcards"), (req: any, res) => {
      res.json({ cards: [], entitlement: req.entitlement });
    });

    const res = await request(app).get("/api/flashcards");
    expect(res.status).toBe(200);
    expect(res.body.entitlement.accessSource).toBe("tester");
  });

  test("returns 200 when lifetime user accesses premium feature through middleware", async () => {
    const user = makeUserRow({ id: "lifetime-1", tier: "free", is_lifetime: true });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);
    app.get("/api/flashcards", requireEntitlement("flashcards"), (req: any, res) => {
      res.json({ cards: [], entitlement: req.entitlement });
    });

    const res = await request(app).get("/api/flashcards");
    expect(res.status).toBe(200);
    expect(res.body.entitlement.accessSource).toBe("one_time_purchase");
  });

  test("returns 200 when trial user accesses premium feature through middleware", async () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUserRow({ id: "trial-1", tier: "free", trial_active: true, trial_end: future });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);
    app.get("/api/flashcards", requireEntitlement("flashcards"), (req: any, res) => {
      res.json({ cards: [], entitlement: req.entitlement });
    });

    const res = await request(app).get("/api/flashcards");
    expect(res.status).toBe(200);
    expect(res.body.entitlement.accessSource).toBe("trial");
    expect(res.body.entitlement.expiresAt).toBeTruthy();
  });
});

describe("Route Integration: requireAnyPremium middleware via HTTP", () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    mockResolveAuthUser.mockReset();
    mockPoolQuery.mockReset().mockResolvedValue({ rows: [] });
  });

  test("returns 401 when not authenticated", async () => {
    mockResolveAuthUser.mockResolvedValue(null);
    app.get("/api/premium-content", requireAnyPremium(), (_req, res) => {
      res.json({ content: "premium" });
    });

    const res = await request(app).get("/api/premium-content");
    expect(res.status).toBe(401);
  });

  test("returns 403 when free user accesses premium content", async () => {
    const user = makeUserRow({ id: "free-1", tier: "free" });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);
    app.get("/api/premium-content", requireAnyPremium(), (_req, res) => {
      res.json({ content: "premium" });
    });

    const res = await request(app).get("/api/premium-content");
    expect(res.status).toBe(403);
    expect(res.body.upgradeRequired).toBe(true);
  });

  test("returns 200 when RN user accesses premium content through full middleware", async () => {
    const user = makeUserRow({ id: "rn-1", tier: "rn" });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);
    app.get("/api/premium-content", requireAnyPremium(), (req: any, res) => {
      res.json({ content: "premium", source: req.entitlement.accessSource });
    });

    const res = await request(app).get("/api/premium-content");
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("premium");
  });
});

describe("Route Integration: orchestrated content delivery via HTTP", () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    mockResolveAuthUser.mockReset();
    mockPoolQuery.mockReset().mockResolvedValue({ rows: [] });
  });

  test("primary handler delivers content successfully via HTTP", async () => {
    mockResolveAuthUser.mockResolvedValue({ id: "user-1", tier: "rpn" });

    app.get(
      "/api/content/:contentId/deliver",
      requireAuthenticated(),
      createAccessDeliveryOrchestrator({
        primaryHandler: async (_req, res) => {
          res.json({ questions: [{ stem: "Q1" }], _deliveryTier: "primary" });
        },
      }),
    );

    const res = await request(app).get("/api/content/exam-001/deliver");
    expect(res.status).toBe(200);
    expect(res.body._deliveryTier).toBe("primary");
    expect(res.body.questions).toHaveLength(1);
  });

  test("primary failure cascades to safe fallback via HTTP", async () => {
    mockResolveAuthUser.mockResolvedValue({ id: "user-1", tier: "rpn" });

    app.get(
      "/api/content/:contentId/deliver",
      requireAuthenticated(),
      createAccessDeliveryOrchestrator({
        primaryHandler: async () => {
          throw new Error("DB connection failed");
        },
        safeFallback: async (_req, res) => {
          res.json({ data: { safe: true }, _deliveryTier: "safe_fallback" });
        },
      }),
    );

    const res = await request(app).get("/api/content/exam-001/deliver");
    expect(res.status).toBe(200);
    expect(res.body._deliveryTier).toBe("safe_fallback");
  });

  test("all tiers exhausted returns 503 via HTTP", async () => {
    mockResolveAuthUser.mockResolvedValue({ id: "user-1", tier: "rpn" });

    app.get(
      "/api/content/:contentId/deliver",
      requireAuthenticated(),
      createAccessDeliveryOrchestrator({
        primaryHandler: async () => {
          throw new Error("primary down");
        },
        safeFallback: async () => {
          throw new Error("safe down");
        },
        lastKnownGood: async () => null,
        backupSnapshot: async () => null,
        substituteEquivalent: async () => null,
        getContentId: (r) => r.params.contentId,
      }),
    );

    const res = await request(app).get("/api/content/broken-123/deliver");
    expect(res.status).toBe(503);
    expect(res.body._deliveryTier).toBe("exhausted");
    expect(res.body._attemptsExhausted).toBe(true);
  });

  test("unauthenticated request to orchestrated route returns 401", async () => {
    mockResolveAuthUser.mockResolvedValue(null);

    app.get(
      "/api/content/:contentId/deliver",
      requireAuthenticated(),
      createAccessDeliveryOrchestrator({
        primaryHandler: async (_req, res) => {
          res.json({ data: "should not reach" });
        },
      }),
    );

    const res = await request(app).get("/api/content/exam-001/deliver");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authentication required");
  });

  test("static fallback delivers recovery messaging via HTTP", async () => {
    mockResolveAuthUser.mockResolvedValue({ id: "user-1", tier: "rpn" });

    app.get(
      "/api/content/:contentId/deliver",
      requireAuthenticated(),
      createAccessDeliveryOrchestrator({
        primaryHandler: async () => {
          throw new Error("crash");
        },
        lastKnownGood: async () => null,
        backupSnapshot: async () => null,
        substituteEquivalent: async () => null,
        staticFallback: () => ({
          message: "Content temporarily unavailable",
          recoveryUrl: "/dashboard",
        }),
        getContentId: (r) => r.params.contentId,
      }),
    );

    const res = await request(app).get("/api/content/broken-123/deliver");
    expect(res.status).toBe(200);
    expect(res.body._deliveryTier).toBe("static_fallback");
    expect(res.body.data.recoveryUrl).toBe("/dashboard");
  });

  test("LKG content served via HTTP when primary fails", async () => {
    mockResolveAuthUser.mockResolvedValue({ id: "user-1", tier: "rpn" });

    app.get(
      "/api/content/:contentId/deliver",
      requireAuthenticated(),
      createAccessDeliveryOrchestrator({
        primaryHandler: async () => {
          throw new Error("primary fail");
        },
        lastKnownGood: async (_req, contentId) => ({
          id: contentId,
          title: "Cached version",
          version: 5,
        }),
        getContentId: (r) => r.params.contentId,
      }),
    );

    const res = await request(app).get("/api/content/exam-999/deliver");
    expect(res.status).toBe(200);
    expect(res.body._deliveryTier).toBe("last_known_good");
    expect(res.body.data.title).toBe("Cached version");
  });

  test("wrapWithOrchestrator helper wraps a route handler with fallback via HTTP", async () => {
    mockResolveAuthUser.mockResolvedValue({ id: "user-1", tier: "rpn" });

    app.get(
      "/api/wrapped-exam/:contentId",
      requireAuthenticated(),
      wrapWithOrchestrator(
        async () => {
          throw new Error("handler crashed");
        },
        {
          staticFallbackData: { message: "wrapped fallback" },
          getContentId: (r: any) => r.params.contentId,
        },
      ),
    );

    const res = await request(app).get("/api/wrapped-exam/exam-1");
    expect(res.status).toBe(200);
    expect(res.body._deliveryTier).toBe("static_fallback");
    expect(res.body.data.message).toBe("wrapped fallback");
  });
});

describe("Route Integration: entitlement + delivery pipeline via HTTP", () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    mockResolveAuthUser.mockReset();
    mockPoolQuery.mockReset().mockResolvedValue({ rows: [] });
  });

  test("free user denied at entitlement middleware never reaches orchestrator", async () => {
    const user = makeUserRow({ id: "free-1", tier: "free" });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);

    app.get(
      "/api/qbank/:contentId",
      requireEntitlement("qbank"),
      createAccessDeliveryOrchestrator({
        primaryHandler: async (_req, res) => {
          res.json({ questions: [], _deliveryTier: "primary" });
        },
      }),
    );

    const res = await request(app).get("/api/qbank/set-1");
    expect(res.status).toBe(403);
    expect(res.body.upgradeRequired).toBe(true);
    expect(res.body.feature).toBe("qbank");
  });

  test("RPN user passes entitlement and reaches orchestrator primary delivery", async () => {
    const user = makeUserRow({ id: "rpn-1", tier: "rpn", stripe_subscription_id: "sub_1" });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);

    app.get(
      "/api/qbank/:contentId",
      requireEntitlement("qbank"),
      createAccessDeliveryOrchestrator({
        primaryHandler: async (req: any, res) => {
          res.json({
            questions: [{ stem: "Nursing Q1" }],
            userId: req.authUser.id,
            _deliveryTier: "primary",
          });
        },
      }),
    );

    const res = await request(app).get("/api/qbank/set-1");
    expect(res.status).toBe(200);
    expect(res.body._deliveryTier).toBe("primary");
    expect(res.body.userId).toBe("rpn-1");
    expect(res.body.questions).toHaveLength(1);
  });

  test("RPN user sees fallback when primary crashes after entitlement passes", async () => {
    const user = makeUserRow({ id: "rpn-1", tier: "rpn" });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);

    app.get(
      "/api/qbank/:contentId",
      requireEntitlement("qbank"),
      createAccessDeliveryOrchestrator({
        primaryHandler: async () => {
          throw new Error("qbank service down");
        },
        staticFallback: () => ({
          message: "Question bank temporarily unavailable",
          suggestRetry: true,
        }),
        getContentId: (r) => r.params.contentId,
      }),
    );

    const res = await request(app).get("/api/qbank/set-1");
    expect(res.status).toBe(200);
    expect(res.body._deliveryTier).toBe("static_fallback");
    expect(res.body.data.suggestRetry).toBe(true);
  });
});

describe("Route Integration: provisional access via emergency mode over HTTP", () => {
  let app: express.Express;

  beforeEach(async () => {
    app = createTestApp();
    mockResolveAuthUser.mockReset();
    mockPoolQuery.mockReset().mockResolvedValue({ rows: [] });
    const platformResilience = await import("../platform-resilience");
    vi.mocked(platformResilience.hasProvisionalAccess).mockReturnValue(false);
    vi.mocked(platformResilience.isEmergencyMode).mockReturnValue(false);
  });

  test("free user gets access when emergency mode is active via HTTP (resolved inside resolveEntitlement)", async () => {
    const user = makeUserRow({ id: "free-1", tier: "free" });
    mockResolveAuthUser.mockResolvedValue(user);
    setupPoolForUser(user);
    const platformResilience = await import("../platform-resilience");
    vi.mocked(platformResilience.isEmergencyMode).mockReturnValue(true);

    app.get(
      "/api/flashcards",
      requireEntitlement("flashcards"),
      (req: any, res) => {
        res.json({
          cards: [{ front: "Q", back: "A" }],
          entitlementProvisional: req.entitlement?.provisional || false,
          entitlementReason: req.entitlement?.accessDecisionReason || "unknown",
        });
      },
    );

    const res = await request(app).get("/api/flashcards");
    expect(res.status).toBe(200);
    expect(res.body.cards).toHaveLength(1);
    expect(res.body.entitlementProvisional).toBe(true);
    expect(res.body.entitlementReason).toBe("emergency_mode_override");
  });

  test("free user gets access when hasProvisionalAccess returns true and cache exists via HTTP", async () => {
    const user = makeUserRow({ id: "provisional-1", tier: "free" });
    mockResolveAuthUser.mockResolvedValue(user);

    mockPoolQuery.mockImplementation((sql: string) => {
      if (typeof sql !== "string") return Promise.resolve({ rows: [] });
      if (sql.includes("SELECT * FROM users WHERE id")) {
        return Promise.resolve({ rows: [user] });
      }
      if (sql.includes("entitlement_cache")) {
        return Promise.resolve({
          rows: [{
            has_access: true,
            access_source: "subscription",
            plan_id: "sub_cached",
            product_type: "feature",
            product_id: "flashcards",
            expires_at: null,
            decision_reason: "cached",
          }],
        });
      }
      return Promise.resolve({ rows: [] });
    });

    const platformResilience = await import("../platform-resilience");
    vi.mocked(platformResilience.hasProvisionalAccess).mockReturnValue(true);

    app.get(
      "/api/flashcards",
      requireEntitlement("flashcards"),
      (req: any, res) => {
        res.json({
          cards: [],
          entitlementProvisional: req.entitlement?.provisional || false,
          entitlementReason: req.entitlement?.accessDecisionReason || "unknown",
        });
      },
    );

    const res = await request(app).get("/api/flashcards");
    expect(res.status).toBe(200);
    expect(res.body.entitlementProvisional).toBe(true);
    expect(res.body.entitlementReason).toBe("provisional_grace_window");
  });
});
