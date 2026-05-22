import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSessionExpiredLoginHref,
  resolveAuthReturnDestination,
  resolveLearnerStudyCallbackPath,
  resolveMarketingAuthRedirectTarget,
  resolveSessionExpiredCallbackPath,
  shouldSkipSessionExpiredRedirect,
} from "./auth-flow-governance";

const FLOWS = [
  { label: "flashcards", path: "/app/flashcards?pathwayId=us-rn-nclex-rn" },
  { label: "CAT launch", path: "/app/practice-tests/cat-launch?pathwayId=us-rn-nclex-rn" },
  { label: "questions session", path: "/app/questions/session?pathwayId=us-rn-nclex-rn&count=20" },
  { label: "analytics", path: "/app/account/analytics?pathwayId=us-rn-nclex-rn" },
  { label: "lessons", path: "/app/lessons?pathwayId=ca-rn-nclex-rn" },
] as const;

describe("auth transition callback continuity", () => {
  for (const flow of FLOWS) {
    it(`preserves ${flow.label} through session-expired login href`, () => {
      const href = buildSessionExpiredLoginHref(flow.path, "en");
      assert.match(href, /session=expired/);
      assert.match(href, /callbackUrl=/);
      const resolved = resolveSessionExpiredCallbackPath(flow.path);
      assert.ok(resolved.includes(flow.path.split("?")[0]!));
    });

    it(`post-login redirect honors ${flow.label}`, () => {
      const sp = new URLSearchParams();
      sp.set("callbackUrl", flow.path);
      const target = resolveMarketingAuthRedirectTarget("/login", sp, "en");
      assert.equal(target, flow.path);
      assert.equal(resolveAuthReturnDestination(flow.path), flow.path);
      assert.equal(resolveLearnerStudyCallbackPath(flow.path), flow.path);
    });
  }

  it("does not loop on login with session=expired already present", () => {
    assert.equal(shouldSkipSessionExpiredRedirect("/login", "?session=expired"), true);
  });
});
