import { describe, test, expect, vi, beforeEach } from "vitest";

const mockPoolQuery = vi.fn();

vi.mock("../storage", () => ({
  pool: {
    query: (...args: any[]) => mockPoolQuery(...args),
  },
}));

vi.mock("../admin-auth", () => ({
  resolveAuthUser: vi.fn().mockResolvedValue(null),
}));

const mockHasProvisionalAccess = vi.fn().mockReturnValue(false);
const mockIsEmergencyMode = vi.fn().mockReturnValue(false);
const mockGrantProvisionalAccess = vi.fn();

vi.mock("../platform-resilience", () => ({
  hasProvisionalAccess: (...args: any[]) => mockHasProvisionalAccess(...args),
  isEmergencyMode: (...args: any[]) => mockIsEmergencyMode(...args),
  grantProvisionalAccess: (...args: any[]) => mockGrantProvisionalAccess(...args),
}));

vi.mock("../incident-monitor", () => ({
  logIncident: vi.fn(),
}));

import { resolveEntitlement } from "../entitlements";

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
    stripeCustomerId: null,
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

function setupPoolMock(config: {
  user?: any;
  cacheRows?: any[];
  subscriptionRows?: any[];
}) {
  mockPoolQuery.mockImplementation((sql: string, _params?: any[]) => {
    if (typeof sql !== "string") return Promise.resolve({ rows: [] });
    if (sql.includes("SELECT * FROM users WHERE id")) {
      if (config.user === "THROW") return Promise.reject(new Error("ECONNREFUSED"));
      return Promise.resolve({ rows: config.user ? [config.user] : [] });
    }
    if (sql.includes("entitlement_cache")) {
      if (config.cacheRows === undefined) return Promise.resolve({ rows: [] });
      return Promise.resolve({ rows: config.cacheRows });
    }
    if (sql.includes("subscriptions")) {
      return Promise.resolve({ rows: config.subscriptionRows || [] });
    }
    return Promise.resolve({ rows: [] });
  });
}

describe("Async Billing Resilience: DB Unavailable → Cache Fallback", () => {
  beforeEach(() => {
    mockPoolQuery.mockReset();
    mockHasProvisionalAccess.mockReturnValue(false);
    mockIsEmergencyMode.mockReturnValue(false);
    mockGrantProvisionalAccess.mockReset();
  });

  test("returns cached entitlement when DB is unavailable and cache exists", async () => {
    let callCount = 0;
    mockPoolQuery.mockImplementation((sql: string) => {
      callCount++;
      if (typeof sql !== "string") return Promise.resolve({ rows: [] });
      if (sql.includes("SELECT * FROM users WHERE id")) {
        return Promise.reject(new Error("ECONNREFUSED"));
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
            decision_reason: "cached_entitlement",
          }],
        });
      }
      return Promise.resolve({ rows: [] });
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.provisional).toBe(true);
    expect(decision.accessSource).toBe("subscription");
    expect(decision.planId).toBe("sub_cached");
  });

  test("returns database_unavailable when DB is down and no cache exists", async () => {
    mockPoolQuery.mockImplementation((sql: string) => {
      if (typeof sql !== "string") return Promise.resolve({ rows: [] });
      if (sql.includes("SELECT * FROM users WHERE id")) {
        return Promise.reject(new Error("ECONNREFUSED"));
      }
      if (sql.includes("entitlement_cache")) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("database_unavailable");
  });

  test("returns database_unavailable when both DB and cache throw", async () => {
    mockPoolQuery.mockImplementation((sql: string) => {
      if (typeof sql !== "string") return Promise.resolve({ rows: [] });
      if (sql.includes("SELECT * FROM users WHERE id")) {
        return Promise.reject(new Error("DB down"));
      }
      if (sql.includes("entitlement_cache")) {
        return Promise.reject(new Error("Cache also down"));
      }
      return Promise.resolve({ rows: [] });
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("database_unavailable");
  });
});

describe("Async Billing Resilience: Subscription Sync Delay", () => {
  beforeEach(() => {
    mockPoolQuery.mockReset();
    mockHasProvisionalAccess.mockReturnValue(false);
    mockIsEmergencyMode.mockReturnValue(false);
    mockGrantProvisionalAccess.mockReset();
  });

  test("grants provisional access when user has stripe_customer_id and active subscription in DB", async () => {
    const user = makeUserRow({
      tier: "free",
      stripe_customer_id: "cus_123",
      stripeCustomerId: "cus_123",
    });
    setupPoolMock({
      user,
      subscriptionRows: [{ status: "active", created_at: new Date().toISOString() }],
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.provisional).toBe(true);
    expect(decision.accessDecisionReason).toContain("subscription_fallback");
    expect(decision.accessDecisionReason).toContain("active");
    expect(mockGrantProvisionalAccess).toHaveBeenCalledWith("user-1", "billing_sync_delay:active");
  });

  test("grants provisional access for trialing subscription when tier is free", async () => {
    const user = makeUserRow({
      tier: "free",
      stripe_customer_id: "cus_456",
      stripeCustomerId: "cus_456",
    });
    setupPoolMock({
      user,
      subscriptionRows: [{ status: "trialing", created_at: new Date().toISOString() }],
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.provisional).toBe(true);
    expect(decision.accessDecisionReason).toContain("subscription_fallback");
    expect(decision.accessDecisionReason).toContain("trialing");
  });

  test("does not grant access when no subscription found for customer", async () => {
    const user = makeUserRow({
      tier: "free",
      stripe_customer_id: "cus_789",
      stripeCustomerId: "cus_789",
    });
    setupPoolMock({
      user,
      subscriptionRows: [],
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });
});

describe("Async Billing Resilience: Past Due Grace Period", () => {
  beforeEach(() => {
    mockPoolQuery.mockReset();
    mockHasProvisionalAccess.mockReturnValue(false);
    mockIsEmergencyMode.mockReturnValue(false);
    mockGrantProvisionalAccess.mockReset();
  });

  test("grants grace period access for recent past_due subscription (24h old)", async () => {
    const user = makeUserRow({
      tier: "free",
      stripe_customer_id: "cus_pastdue",
      stripeCustomerId: "cus_pastdue",
    });
    const recentDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    setupPoolMock({
      user,
      subscriptionRows: [{ status: "past_due", created_at: recentDate }],
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.provisional).toBe(true);
    expect(decision.accessDecisionReason).toBe("past_due_grace_period");
    expect(mockGrantProvisionalAccess).toHaveBeenCalledWith("user-1", "past_due_grace_period");
  });

  test("denies access for old past_due subscription (beyond 72h grace)", async () => {
    const user = makeUserRow({
      tier: "free",
      stripe_customer_id: "cus_oldpastdue",
      stripeCustomerId: "cus_oldpastdue",
    });
    const oldDate = new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString();
    setupPoolMock({
      user,
      subscriptionRows: [{ status: "past_due", created_at: oldDate }],
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });

  test("72-hour boundary: grants at 71 hours, denies at 73 hours", async () => {
    const user = makeUserRow({
      tier: "free",
      stripe_customer_id: "cus_boundary",
      stripeCustomerId: "cus_boundary",
    });

    const at71h = new Date(Date.now() - 71 * 60 * 60 * 1000).toISOString();
    setupPoolMock({
      user,
      subscriptionRows: [{ status: "past_due", created_at: at71h }],
    });

    const decision71 = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision71.hasAccess).toBe(true);
    expect(decision71.accessDecisionReason).toBe("past_due_grace_period");

    const at73h = new Date(Date.now() - 73 * 60 * 60 * 1000).toISOString();
    setupPoolMock({
      user,
      subscriptionRows: [{ status: "past_due", created_at: at73h }],
    });

    const decision73 = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision73.hasAccess).toBe(false);
  });
});

describe("Async Billing Resilience: Emergency Mode Override", () => {
  beforeEach(() => {
    mockPoolQuery.mockReset();
    mockHasProvisionalAccess.mockReturnValue(false);
    mockIsEmergencyMode.mockReturnValue(false);
    mockGrantProvisionalAccess.mockReset();
  });

  test("emergency mode grants access to denied free user", async () => {
    const user = makeUserRow({ tier: "free" });
    mockIsEmergencyMode.mockReturnValue(true);
    setupPoolMock({ user, cacheRows: [] });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.provisional).toBe(true);
    expect(decision.accessDecisionReason).toBe("emergency_mode_override");
  });

  test("emergency mode with cached entitlement uses cache with provisional flag", async () => {
    const user = makeUserRow({ tier: "free" });
    mockIsEmergencyMode.mockReturnValue(true);
    setupPoolMock({
      user,
      cacheRows: [{
        has_access: true,
        access_source: "subscription",
        plan_id: "sub_prev",
        product_type: "feature",
        product_id: "flashcards",
        expires_at: null,
        decision_reason: "cached",
      }],
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.provisional).toBe(true);
    expect(decision.accessDecisionReason).toBe("provisional_grace_window");
  });
});

describe("Async Billing Resilience: Provisional Access Grant", () => {
  beforeEach(() => {
    mockPoolQuery.mockReset();
    mockHasProvisionalAccess.mockReturnValue(false);
    mockIsEmergencyMode.mockReturnValue(false);
    mockGrantProvisionalAccess.mockReset();
  });

  test("user with provisional access flag uses cached entitlement", async () => {
    const user = makeUserRow({ tier: "free" });
    mockHasProvisionalAccess.mockReturnValue(true);
    setupPoolMock({
      user,
      cacheRows: [{
        has_access: true,
        access_source: "subscription",
        plan_id: "sub_grace",
        product_type: "feature",
        product_id: "flashcards",
        expires_at: null,
        decision_reason: "subscription_cached",
      }],
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.provisional).toBe(true);
    expect(decision.accessDecisionReason).toBe("provisional_grace_window");
  });

  test("user with provisional flag but no cache still denied (no emergency)", async () => {
    const user = makeUserRow({ tier: "free" });
    mockHasProvisionalAccess.mockReturnValue(true);
    setupPoolMock({ user, cacheRows: [] });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });
});

describe("Async Billing Resilience: Webhook Delay Scenario", () => {
  beforeEach(() => {
    mockPoolQuery.mockReset();
    mockHasProvisionalAccess.mockReturnValue(false);
    mockIsEmergencyMode.mockReturnValue(false);
    mockGrantProvisionalAccess.mockReset();
  });

  test("user paid via Stripe but webhook has not updated tier: subscription_fallback grants access", async () => {
    const user = makeUserRow({
      tier: "free",
      stripe_customer_id: "cus_webhook_delay",
      stripeCustomerId: "cus_webhook_delay",
    });
    setupPoolMock({
      user,
      subscriptionRows: [{ status: "active", created_at: new Date().toISOString() }],
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.provisional).toBe(true);
    expect(decision.accessDecisionReason).toBe("subscription_fallback:active");
  });

  test("user with Stripe timeout: subscription query fails gracefully", async () => {
    const user = makeUserRow({
      tier: "free",
      stripe_customer_id: "cus_timeout",
      stripeCustomerId: "cus_timeout",
    });
    mockPoolQuery.mockImplementation((sql: string) => {
      if (typeof sql !== "string") return Promise.resolve({ rows: [] });
      if (sql.includes("SELECT * FROM users WHERE id")) {
        return Promise.resolve({ rows: [user] });
      }
      if (sql.includes("subscriptions")) {
        return Promise.reject(new Error("query timeout"));
      }
      return Promise.resolve({ rows: [] });
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });
});

describe("Async Billing Resilience: Caching successful decisions", () => {
  beforeEach(() => {
    mockPoolQuery.mockReset();
    mockHasProvisionalAccess.mockReturnValue(false);
    mockIsEmergencyMode.mockReturnValue(false);
    mockGrantProvisionalAccess.mockReset();
  });

  test("successful entitlement decision triggers cache write", async () => {
    const user = makeUserRow({ tier: "rpn", stripe_subscription_id: "sub_cache_test" });
    const cacheInsertCalled: string[] = [];
    mockPoolQuery.mockImplementation((sql: string) => {
      if (typeof sql !== "string") return Promise.resolve({ rows: [] });
      if (sql.includes("INSERT INTO entitlement_cache")) {
        cacheInsertCalled.push(sql);
      }
      if (sql.includes("SELECT * FROM users WHERE id")) {
        return Promise.resolve({ rows: [user] });
      }
      return Promise.resolve({ rows: [] });
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.provisional).toBe(false);

    await new Promise((r) => setTimeout(r, 50));
    expect(cacheInsertCalled.length).toBeGreaterThan(0);
  });

  test("denied decisions do NOT trigger cache write", async () => {
    const user = makeUserRow({ tier: "free" });
    const cacheInsertCalled: string[] = [];
    mockPoolQuery.mockImplementation((sql: string) => {
      if (typeof sql !== "string") return Promise.resolve({ rows: [] });
      if (sql.includes("INSERT INTO entitlement_cache")) {
        cacheInsertCalled.push(sql);
      }
      if (sql.includes("SELECT * FROM users WHERE id")) {
        return Promise.resolve({ rows: [user] });
      }
      return Promise.resolve({ rows: [] });
    });

    const decision = await resolveEntitlement("user-1", "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);

    await new Promise((r) => setTimeout(r, 50));
    expect(cacheInsertCalled.length).toBe(0);
  });
});

describe("Async Billing Resilience: User not found", () => {
  beforeEach(() => {
    mockPoolQuery.mockReset();
  });

  test("returns default denied decision when user not found in DB", async () => {
    setupPoolMock({ user: null });

    const decision = await resolveEntitlement("nonexistent-user", "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.provisional).toBe(false);
  });
});
