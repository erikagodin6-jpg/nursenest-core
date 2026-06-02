import { describe, test, expect } from "vitest";
import { checkEntitlement, getUserEntitlements, isActiveTester, resolveEntitlementSync } from "../entitlements";
import type { EntitlementDecisionObject } from "../../shared/schema";

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

describe("checkEntitlement", () => {
  test("free user cannot access premium features", () => {
    const user = makeUser({ tier: "free" });
    expect(checkEntitlement(user, "flashcards")).toBe(false);
    expect(checkEntitlement(user, "qbank")).toBe(false);
    expect(checkEntitlement(user, "mock_exams")).toBe(false);
    expect(checkEntitlement(user, "adaptive_engine")).toBe(false);
    expect(checkEntitlement(user, "study_plan")).toBe(false);
    expect(checkEntitlement(user, "study_groups")).toBe(false);
    expect(checkEntitlement(user, "flashcard_bank")).toBe(false);
    expect(checkEntitlement(user, "flashcard_review")).toBe(false);
    expect(checkEntitlement(user, "admin_dashboard")).toBe(false);
  });

  test("free user can access free features", () => {
    const user = makeUser({ tier: "free" });
    expect(checkEntitlement(user, "lessons_free")).toBe(true);
    expect(checkEntitlement(user, "anatomy_labeling")).toBe(true);
    expect(checkEntitlement(user, "concept_checks")).toBe(true);
  });

  test("rpn user can access rpn-tier features but not np features", () => {
    const user = makeUser({ tier: "rpn" });
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "qbank")).toBe(true);
    expect(checkEntitlement(user, "mock_exams")).toBe(true);
    expect(checkEntitlement(user, "adaptive_engine")).toBe(true);
    expect(checkEntitlement(user, "lessons_rpn")).toBe(true);
    expect(checkEntitlement(user, "lessons_np")).toBe(false);
    expect(checkEntitlement(user, "lessons_rn")).toBe(false);
    expect(checkEntitlement(user, "admin_dashboard")).toBe(false);
  });

  test("rn user can access rn and rpn features but not np", () => {
    const user = makeUser({ tier: "rn" });
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "lessons_rpn")).toBe(true);
    expect(checkEntitlement(user, "lessons_rn")).toBe(true);
    expect(checkEntitlement(user, "lessons_np")).toBe(false);
  });

  test("admin user can access everything", () => {
    const user = makeUser({ tier: "admin" });
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "qbank")).toBe(true);
    expect(checkEntitlement(user, "lessons_np")).toBe(true);
    expect(checkEntitlement(user, "admin_dashboard")).toBe(true);
    expect(checkEntitlement(user, "content_editor")).toBe(true);
    expect(checkEntitlement(user, "study_plan")).toBe(true);
    expect(checkEntitlement(user, "study_groups")).toBe(true);
  });

  test("null user is denied all access", () => {
    expect(checkEntitlement(null, "flashcards")).toBe(false);
    expect(checkEntitlement(null, "lessons_free")).toBe(false);
  });

  test("bundle user can access premium features", () => {
    const user = makeUser({ tier: "free", bundle_id: "bundle_123" });
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "qbank")).toBe(true);
  });

  test("promo user can access premium features", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", promo_active: true, promo_expires_at: future });
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "mock_exams")).toBe(true);
  });

  test("referral user can access premium features", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", referral_premium_active: true, referral_premium_expires_at: future });
    expect(checkEntitlement(user, "flashcards")).toBe(true);
  });

  test("legacy user can access premium features", () => {
    const user = makeUser({ tier: "free", legacy_access: true });
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "qbank")).toBe(true);
  });

  test("expired promo user cannot access premium features", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({ tier: "free", promo_active: true, promo_expires_at: past });
    expect(checkEntitlement(user, "flashcards")).toBe(false);
  });

  test("expired referral user cannot access premium features", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({ tier: "free", referral_premium_active: true, referral_premium_expires_at: past });
    expect(checkEntitlement(user, "flashcards")).toBe(false);
  });
});

describe("isActiveTester", () => {
  test("active tester with no expiry returns true", () => {
    const user = makeUser({ tester_access: true, tester_expiry: null });
    expect(isActiveTester(user)).toBe(true);
  });

  test("active tester with future expiry returns true", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tester_access: true, tester_expiry: future });
    expect(isActiveTester(user)).toBe(true);
  });

  test("tester with expired access returns false", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({ tester_access: true, tester_expiry: past });
    expect(isActiveTester(user)).toBe(false);
  });

  test("non-tester returns false", () => {
    const user = makeUser({ tester_access: false });
    expect(isActiveTester(user)).toBe(false);
  });
});

describe("tester bypass for entitlements", () => {
  test("active tester can access premium features even on free tier", () => {
    const user = makeUser({ tier: "free", tester_access: true, tester_expiry: null });
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "qbank")).toBe(true);
    expect(checkEntitlement(user, "mock_exams")).toBe(true);
    expect(checkEntitlement(user, "adaptive_engine")).toBe(true);
  });

  test("active tester CANNOT access admin-only features", () => {
    const user = makeUser({ tier: "free", tester_access: true, tester_expiry: null });
    expect(checkEntitlement(user, "admin_dashboard")).toBe(false);
    expect(checkEntitlement(user, "content_editor")).toBe(false);
  });

  test("expired tester on free tier cannot access premium features", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({ tier: "free", tester_access: true, tester_expiry: past });
    expect(checkEntitlement(user, "flashcards")).toBe(false);
    expect(checkEntitlement(user, "qbank")).toBe(false);
  });

  test("trial user can access premium features but not admin features", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", trial_active: true, trial_end: future });
    expect(checkEntitlement(user, "flashcards")).toBe(true);
    expect(checkEntitlement(user, "qbank")).toBe(true);
    expect(checkEntitlement(user, "admin_dashboard")).toBe(false);
    expect(checkEntitlement(user, "content_editor")).toBe(false);
  });
});

describe("getUserEntitlements", () => {
  test("returns full map for admin", () => {
    const user = makeUser({ tier: "admin" });
    const ents = getUserEntitlements(user);
    expect(ents.flashcards.allowed).toBe(true);
    expect(ents.flashcards.reason).toBe("admin_tier");
    expect(ents.admin_dashboard.allowed).toBe(true);
  });

  test("returns correct map for free user", () => {
    const user = makeUser({ tier: "free" });
    const ents = getUserEntitlements(user);
    expect(ents.lessons_free.allowed).toBe(true);
    expect(ents.lessons_free.reason).toBe("free_feature");
    expect(ents.flashcards.allowed).toBe(false);
    expect(ents.flashcards.reason).toBe("requires_rpn");
  });

  test("tester denied admin features with admin_only reason", () => {
    const user = makeUser({ tier: "free", tester_access: true });
    const ents = getUserEntitlements(user);
    expect(ents.admin_dashboard.allowed).toBe(false);
    expect(ents.admin_dashboard.reason).toBe("admin_only");
    expect(ents.content_editor.allowed).toBe(false);
    expect(ents.content_editor.reason).toBe("admin_only");
  });

  test("tester gets tester_bypass reason", () => {
    const user = makeUser({ tier: "free", tester_access: true });
    const ents = getUserEntitlements(user);
    expect(ents.flashcards.allowed).toBe(true);
    expect(ents.flashcards.reason).toBe("tester_bypass");
  });

  test("bundle user gets bundle access for all premium features", () => {
    const user = makeUser({ tier: "free", bundle_id: "bundle_abc" });
    const ents = getUserEntitlements(user);
    expect(ents.flashcards.allowed).toBe(true);
    expect(ents.flashcards.reason).toBe("active_bundle");
  });

  test("promo user gets promo access for premium features", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", promo_active: true, promo_expires_at: future });
    const ents = getUserEntitlements(user);
    expect(ents.flashcards.allowed).toBe(true);
    expect(ents.flashcards.reason).toBe("active_promo");
  });

  test("legacy user gets legacy access for premium features", () => {
    const user = makeUser({ tier: "free", legacy_access: true });
    const ents = getUserEntitlements(user);
    expect(ents.flashcards.allowed).toBe(true);
    expect(ents.flashcards.reason).toBe("legacy_grandfathered");
  });
});

describe("resolveEntitlementSync", () => {
  test("returns correct decision for admin user", () => {
    const user = makeUser({ tier: "admin" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("admin_override");
    expect(decision.accessDecisionReason).toBe("admin_tier");
    expect(decision.provisional).toBe(false);
    expect(decision.productType).toBe("feature");
    expect(decision.productId).toBe("flashcards");
  });

  test("returns correct decision for free user accessing premium feature", () => {
    const user = makeUser({ tier: "free" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("requires_rpn");
    expect(decision.fallbackEligible).toBe(true);
    expect(decision.substituteEligible).toBe(true);
  });

  test("returns correct decision for free feature", () => {
    const user = makeUser({ tier: "free" });
    const decision = resolveEntitlementSync(user, "feature", "lessons_free");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("free");
    expect(decision.accessDecisionReason).toBe("free_feature");
  });

  test("returns correct decision for tester", () => {
    const user = makeUser({ tier: "free", tester_access: true });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("tester");
    expect(decision.accessDecisionReason).toBe("tester_bypass");
  });

  test("tester cannot access admin features via resolver", () => {
    const user = makeUser({ tier: "free", tester_access: true });
    const decision = resolveEntitlementSync(user, "feature", "admin_dashboard");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("admin_only");
  });

  test("returns correct decision for trial user", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", trial_active: true, trial_end: future });
    const decision = resolveEntitlementSync(user, "feature", "qbank");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("trial");
    expect(decision.accessDecisionReason).toBe("trial_access");
    expect(decision.expiresAt).toBeTruthy();
  });

  test("expired trial user is denied", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({ tier: "free", trial_active: true, trial_end: past });
    const decision = resolveEntitlementSync(user, "feature", "qbank");
    expect(decision.hasAccess).toBe(false);
  });

  test("returns correct decision for any_premium check", () => {
    const user = makeUser({ tier: "rpn", stripe_subscription_id: "sub_123" });
    const decision = resolveEntitlementSync(user, "any_premium");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("subscription");
    expect(decision.planId).toBe("sub_123");
  });

  test("free user denied any_premium", () => {
    const user = makeUser({ tier: "free" });
    const decision = resolveEntitlementSync(user, "any_premium");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("requires_paid_tier");
    expect(decision.fallbackEligible).toBe(true);
  });

  test("not authenticated returns correct decision", () => {
    const decision = resolveEntitlementSync(null, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("not_authenticated");
  });

  test("lifetime user gets one_time_purchase source", () => {
    const user = makeUser({ tier: "rn", is_lifetime: true });
    const decision = resolveEntitlementSync(user, "feature", "lessons_rn");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("one_time_purchase");
  });

  test("subscription user gets subscription source", () => {
    const user = makeUser({ tier: "rpn", stripe_subscription_id: "sub_abc" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("subscription");
    expect(decision.planId).toBe("sub_abc");
  });

  test("newgrad toolkit feature access", () => {
    const user = makeUser({ tier: "new_grad_toolkit" });
    const decision = resolveEntitlementSync(user, "feature", "newgrad_brain_sheets");
    expect(decision.hasAccess).toBe(true);
  });

  test("newgrad toolkit user cannot access cert_prep features", () => {
    const user = makeUser({ tier: "new_grad_toolkit" });
    const decision = resolveEntitlementSync(user, "feature", "newgrad_cert_prep");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("requires_certification_prep");
  });

  test("certification_prep user can access both toolkit and cert features", () => {
    const user = makeUser({ tier: "certification_prep" });
    const d1 = resolveEntitlementSync(user, "feature", "newgrad_brain_sheets");
    expect(d1.hasAccess).toBe(true);
    const d2 = resolveEntitlementSync(user, "feature", "newgrad_cert_prep");
    expect(d2.hasAccess).toBe(true);
  });

  test("full_access user can access everything (except admin)", () => {
    const user = makeUser({ tier: "full_access" });
    const d1 = resolveEntitlementSync(user, "feature", "newgrad_brain_sheets");
    expect(d1.hasAccess).toBe(true);
    const d2 = resolveEntitlementSync(user, "feature", "newgrad_cert_prep");
    expect(d2.hasAccess).toBe(true);
    const d3 = resolveEntitlementSync(user, "feature", "admin_dashboard");
    expect(d3.hasAccess).toBe(false);
  });

  test("decision object has all required fields", () => {
    const user = makeUser({ tier: "rpn" });
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
  });

  test("locale is populated from user region", () => {
    const user = makeUser({ tier: "rpn", region: "CA" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.locale).toBe("CA");
    expect(decision.region).toBe("CA");
  });

  test("lifetime user on free tier can access premium features", () => {
    const user = makeUser({ tier: "free", is_lifetime: true });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("one_time_purchase");
    expect(decision.accessDecisionReason).toBe("lifetime_purchase");
  });

  test("lifetime user on free tier passes any_premium check", () => {
    const user = makeUser({ tier: "free", is_lifetime: true });
    const decision = resolveEntitlementSync(user, "any_premium");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("one_time_purchase");
  });

  test("lifetime user cannot access admin features", () => {
    const user = makeUser({ tier: "free", is_lifetime: true });
    const decision = resolveEntitlementSync(user, "feature", "admin_dashboard");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("admin_only");
  });

  test("expired tester denied via resolver", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({ tier: "free", tester_access: true, tester_expiry: past });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });

  test("default decision is non-provisional", () => {
    const user = makeUser({ tier: "rpn" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.provisional).toBe(false);
  });
});

describe("resolveEntitlementSync - bundle access", () => {
  test("bundle user gets access to premium features", () => {
    const user = makeUser({ tier: "free", bundle_id: "bundle_123" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("bundle");
    expect(decision.accessDecisionReason).toBe("active_bundle");
  });

  test("bundle user passes any_premium check", () => {
    const user = makeUser({ tier: "free", bundle_id: "bundle_abc" });
    const decision = resolveEntitlementSync(user, "any_premium");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("bundle");
  });

  test("bundle user with expiry includes expiry date", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", bundle_id: "bundle_123", bundle_expires_at: future });
    const decision = resolveEntitlementSync(user, "feature", "qbank");
    expect(decision.hasAccess).toBe(true);
    expect(decision.expiresAt).toBeTruthy();
  });

  test("bundle user cannot access admin features", () => {
    const user = makeUser({ tier: "free", bundle_id: "bundle_123" });
    const decision = resolveEntitlementSync(user, "feature", "admin_dashboard");
    expect(decision.hasAccess).toBe(false);
    expect(decision.accessDecisionReason).toBe("admin_only");
  });

  test("expired bundle user is denied", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({ tier: "free", bundle_id: "bundle_123", bundle_expires_at: past });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });

  test("bundle without expiry grants access", () => {
    const user = makeUser({ tier: "free", bundle_id: "bundle_123", bundle_expires_at: null });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("bundle");
  });
});

describe("resolveEntitlementSync - promo access", () => {
  test("active promo user gets access to premium features", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", promo_active: true, promo_expires_at: future });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("promo");
    expect(decision.accessDecisionReason).toBe("active_promo");
    expect(decision.expiresAt).toBeTruthy();
  });

  test("expired promo user is denied", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({ tier: "free", promo_active: true, promo_expires_at: past });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });

  test("inactive promo user is denied", () => {
    const user = makeUser({ tier: "free", promo_active: false });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });

  test("promo user passes any_premium check", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", promo_active: true, promo_expires_at: future });
    const decision = resolveEntitlementSync(user, "any_premium");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("promo");
  });

  test("promo user cannot access admin features", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", promo_active: true, promo_expires_at: future });
    const decision = resolveEntitlementSync(user, "feature", "admin_dashboard");
    expect(decision.hasAccess).toBe(false);
  });
});

describe("resolveEntitlementSync - referral access", () => {
  test("active referral user gets access to premium features", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", referral_premium_active: true, referral_premium_expires_at: future });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("referral");
    expect(decision.accessDecisionReason).toBe("referral_bonus");
    expect(decision.expiresAt).toBeTruthy();
  });

  test("expired referral user is denied", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const user = makeUser({ tier: "free", referral_premium_active: true, referral_premium_expires_at: past });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(false);
  });

  test("referral user passes any_premium check", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", referral_premium_active: true, referral_premium_expires_at: future });
    const decision = resolveEntitlementSync(user, "any_premium");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("referral");
  });
});

describe("resolveEntitlementSync - legacy access", () => {
  test("legacy user gets access to premium features", () => {
    const user = makeUser({ tier: "free", legacy_access: true });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("legacy");
    expect(decision.accessDecisionReason).toBe("legacy_grandfathered");
    expect(decision.expiresAt).toBeNull();
  });

  test("legacy user passes any_premium check", () => {
    const user = makeUser({ tier: "free", legacy_access: true });
    const decision = resolveEntitlementSync(user, "any_premium");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("legacy");
  });

  test("legacy user cannot access admin features", () => {
    const user = makeUser({ tier: "free", legacy_access: true });
    const decision = resolveEntitlementSync(user, "feature", "admin_dashboard");
    expect(decision.hasAccess).toBe(false);
  });
});

describe("resolveEntitlementSync - access source priority", () => {
  test("tester takes priority over subscription", () => {
    const user = makeUser({ tier: "rpn", tester_access: true, stripe_subscription_id: "sub_123" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("tester");
  });

  test("trial takes priority over bundle", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", trial_active: true, trial_end: future, bundle_id: "bundle_123" });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("trial");
  });

  test("lifetime takes priority over promo", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", is_lifetime: true, promo_active: true, promo_expires_at: future });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("one_time_purchase");
  });

  test("bundle takes priority over promo", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", bundle_id: "bundle_123", promo_active: true, promo_expires_at: future });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("bundle");
  });

  test("promo takes priority over referral", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", promo_active: true, promo_expires_at: future, referral_premium_active: true, referral_premium_expires_at: future });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("promo");
  });

  test("referral takes priority over legacy", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const user = makeUser({ tier: "free", referral_premium_active: true, referral_premium_expires_at: future, legacy_access: true });
    const decision = resolveEntitlementSync(user, "feature", "flashcards");
    expect(decision.hasAccess).toBe(true);
    expect(decision.accessSource).toBe("referral");
  });
});
