/**
 * Behavioral + static contracts for admin learner QA simulation (cookie overlay, analytics, routing).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  buildUserAccessForAdminLearnerQa,
  signAdminLearnerQaCookieValue,
  verifyAdminLearnerQaCookieValue,
} from "@/lib/admin/admin-learner-qa-simulation";
import { accessScopeFromUserAccess } from "@/lib/entitlements/get-user-access";
import { skipLearnerBusinessAnalyticsForAccessScope } from "@/lib/observability/admin-learner-qa-analytics";

const here = dirname(fileURLToPath(import.meta.url));
/** Repo root `nursenest-core/` (this file lives under `src/lib/admin/`). */
const nursenestCoreRoot = join(here, "..", "..", "..");

describe("admin learner QA — entitlement + analytics guard", () => {
  it("accessScopeFromUserAccess propagates server-trusted adminLearnerQaSimulation", () => {
    const ua = buildUserAccessForAdminLearnerQa({
      v: 1,
      sub: "u1",
      exp: Math.floor(Date.now() / 1000) + 3600,
      track: "RN",
      lifecycle: "paid_active",
      country: "US",
    });
    assert.equal(ua.adminLearnerQaSimulation, true);
    const scope = accessScopeFromUserAccess({
      ...ua,
      sessionJwt: { role: "ADMIN" as never, credentialVersion: 1 },
    });
    assert.equal(scope.adminLearnerQaSimulation, true);
    assert.equal(skipLearnerBusinessAnalyticsForAccessScope(scope), true);
  });

  it("simulated expired lifecycle yields no premium (paywall-aligned scope)", () => {
    const ua = buildUserAccessForAdminLearnerQa({
      v: 1,
      sub: "u1",
      exp: Math.floor(Date.now() / 1000) + 3600,
      track: "RN",
      lifecycle: "expired",
      country: "US",
    });
    const scope = accessScopeFromUserAccess({
      ...ua,
      sessionJwt: { role: "ADMIN" as never, credentialVersion: 1 },
    });
    assert.equal(scope.hasAccess, false);
    assert.equal(scope.adminLearnerQaSimulation, true);
    assert.equal(skipLearnerBusinessAnalyticsForAccessScope(scope), true);
  });

  it("does not verify QA cookie for a different user (no cross-session entitlement spoof)", () => {
    process.env.ADMIN_LEARNER_QA_SECRET = "test-secret-at-least-16";
    const payload = {
      v: 1 as const,
      sub: "user-a",
      exp: Math.floor(Date.now() / 1000) + 3600,
      track: "RN" as const,
      lifecycle: "paid_active" as const,
      country: "US" as const,
    };
    const signed = signAdminLearnerQaCookieValue(payload);
    assert.equal(verifyAdminLearnerQaCookieValue(signed ?? "", "user-b"), null);
    delete process.env.ADMIN_LEARNER_QA_SECRET;
  });
});

describe("admin learner QA — API + proxy contracts (static)", () => {
  it("simulate / clear / status routes use requireAdmin(req) and never trust client-sent user id for cookie sub", () => {
    for (const name of ["simulate", "clear", "status"]) {
      const src = readFileSync(
        join(nursenestCoreRoot, "src", "app", "api", "admin", "learner-qa", name, "route.ts"),
        "utf8",
      );
      assert.match(src, /requireAdmin\(req\)/, name);
    }
    const sim = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "admin", "learner-qa", "simulate", "route.ts"),
      "utf8",
    );
    assert.match(sim, /sub:\s*gate\.admin\.userId/);
    assert.doesNotMatch(sim, /sub:\s*parsed\.data\.(userId|sub)\b/);
    assert.doesNotMatch(sim, /sub:\s*d\.(userId|sub)\b/);
    assert.doesNotMatch(sim, /searchParams|nextUrl\.searchParams/);
  });

  it("proxy does not implement parallel learner QA entitlement logic (parity with RSC/API)", () => {
    const proxy = readFileSync(join(nursenestCoreRoot, "src", "proxy.ts"), "utf8");
    assert.doesNotMatch(proxy, /nn_admin_learner_qa/);
    assert.doesNotMatch(proxy, /ADMIN_LEARNER_QA/);
  });

  it("page entitlement resolution stays centralized on getUserAccess (RSC parity with APIs)", () => {
    const resolve = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "entitlements", "resolve-entitlement.ts"),
      "utf8",
    );
    assert.match(resolve, /getUserAccess\(/);
  });

  it("learner shell hides staff chrome during QA and mounts PostHog suppressor", () => {
    const layout = readFileSync(
      join(nursenestCoreRoot, "src", "app", "(student)", "app", "(learner)", "layout.tsx"),
      "utf8",
    );
    assert.match(layout, /AdminLearnerQaPosthogSuppressor/);
    assert.match(layout, /serverHasStaffSession=\{staffSession != null && !qaPayload\}/);
  });

  it("server learner analytics helpers skip PostHog when QA simulation flag is on", () => {
    const analytics = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "observability", "learner-product-analytics.ts"),
      "utf8",
    );
    assert.match(analytics, /skipLearnerBusinessAnalyticsForAccessScope\(entitlement\)/);
    const funnel = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "observability", "study-funnel-capture.ts"),
      "utf8",
    );
    assert.match(funnel, /skipLearnerBusinessAnalyticsForAccessScope\(scope\)/);
  });

  it("free-form learner APIs gate PostHog with verified QA user check", () => {
    for (const rel of [
      join("src", "app", "api", "learner", "pre-nursing-progress", "route.ts"),
      join("src", "app", "api", "learner", "pre-nursing-plan", "route.ts"),
      join("src", "app", "api", "onboarding", "complete", "route.ts"),
      join("src", "app", "api", "billing", "portal", "route.ts"),
    ]) {
      const src = readFileSync(join(nursenestCoreRoot, rel), "utf8");
      assert.match(src, /serverLearnerPosthogDisabledForVerifiedQaUser/);
    }
  });

  it("dashboard home prefers entitlement tier for nav chrome (QA parity)", () => {
    const dash = readFileSync(
      join(nursenestCoreRoot, "src", "app", "(student)", "app", "(learner)", "page.tsx"),
      "utf8",
    );
    assert.match(dash, /tierForDashboardCopy/);
    assert.match(
      dash,
      /examsNavLabelFromLearnerContext\(getExamPathwayById, userLearnerPath, tierForDashboardCopy\)/,
    );
  });
});
